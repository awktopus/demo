import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InfotrackerComponent } from '../infotracker.component';
import { InfoTrackerService } from '../service/infotracker.service';
import { MatDialogRef, MatDialog, MatOptionSelectionChange } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { FormTemplateResource, PageQuestionResource, InfoTrackerAnswerResource, InfoTrackerUser } from '../../esign/beans/ESignCase';
import { SelfreportsummaryComponent } from '../selfreportsummary/selfreportsummary.component';
import { InfotrackerConfirmDialogComponent } from '../shared/infotracker-confirm-dialog/infotracker-confirm-dialog.component';
import { AddupdateuserComponent } from './addupdateuser/addupdateuser.component';

@Component({
  selector: 'app-reportforothers',
  templateUrl: './reportforothers.component.html',
  styleUrls: ['./reportforothers.component.scss']
})
export class ReportforothersComponent implements OnInit {

  infoTrackerRef: InfotrackerComponent;
  templateId: number;
  userName: string;
  userId: string;
  showSubmitSpinner = false;
  isDataFetched = false;
  formTemplate: FormTemplateResource;
  questions: PageQuestionResource[];
  reportDate: any;
  selAnswers: InfoTrackerAnswerResource[];
  isReadyToSubmit = false;

  showEditSpinner = false;
  showAddendumSpinner = false;
  existingTrackerId: string;

  infoTrackUsers: InfoTrackerUser[];
  cacheInfoTrackUsers: InfoTrackerUser[];
  infoTrackUser: InfoTrackerUser = null;
  removable = true;
  user_var = '';
  reportStatus: string;
  selfReportForm: FormGroup = new FormGroup({
    reportDateFormControl: new FormControl((new Date()).toISOString(), Validators.required),
    userNameFormControl: new FormControl('', Validators.required),
  });

  @ViewChild('focusField') focusField: ElementRef;
  constructor(private service: InfoTrackerService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<ReportforothersComponent>, private formBuilder: FormBuilder) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

    console.log('self report init');
    let date1: Date = new Date();
    let month = Number(date1.getMonth()) + 1;
    let rDate1 = month + "-" + date1.getDate() + '-' + date1.getFullYear();
    console.log('todate');
    console.log(rDate1);
    console.log('Self report init');

    this.service.GetInfoTrackerUsers(this.service.auth.getOrgUnitID(),
    this.service.auth.getUserID()).subscribe(uResp => {
      this.infoTrackUsers = [];
      this.infoTrackUsers = <InfoTrackerUser[]>uResp;
      this.cacheInfoTrackUsers = <InfoTrackerUser[]>uResp;
      console.log('info track users');
      console.log(this.infoTrackUsers);

    });

    this.service.GetFormTemplateConfig(this.service.auth.getOrgUnitID(),
    this.service.auth.getUserID(), this.templateId).subscribe(resp => {
      this.formTemplate = <FormTemplateResource>resp;
      console.log('GetFormTemplateConfig response');
      console.log(this.formTemplate);
      if (this.formTemplate) {
        if (this.formTemplate.pages) {
          this.questions = this.formTemplate.pages[0].questions;
          console.log(this.questions);
        }
      }
      this.isDataFetched = true;
      this.focusField.nativeElement.focus();
    });

    // this.userName = this.service.auth.getUserFirstName() + " " + this.service.auth.getUserLastName();
    // this.userId = this.service.auth.getUserID();
    // console.log('user name');
    // console.log(this.userName);
    // console.log('user id');
    // console.log(this.userId);
    // this.selfReportForm.controls['userNameFormControl'].setValue(this.userName);



    // this.selfReportForm.controls['userNameFormControl'].valueChanges.subscribe(searchToken => {
    //   console.log('userNameFormControl search called');
    //   console.log("searchToken:" + searchToken.trim());
    //   console.log(this.user_var);
    //   console.log(typeof searchToken);
    //   console.log(this.infoTrackUser);
    //   if (this.infoTrackUser) {
    //     return;
    //   }
    //   if (searchToken && typeof searchToken !== 'object') {
    //     if (this.user_var === searchToken.trim()) {
    //       return;
    //     } else {
    //       console.log('userNameFormControl searching...');
    //       this.infoTrackUsers = [];
    //       console.log('cache infoTrackUsers');
    //       console.log(this.cacheInfoTrackUsers);
    //       this.cacheInfoTrackUsers.forEach(cc => {
    //         if ((cc.firstName && cc.firstName.toLowerCase().search(searchToken.toLowerCase()) !== -1) ||
    //           (cc.lastName && cc.lastName.toLowerCase().search(searchToken.toLowerCase()) !== -1)) {
    //           this.infoTrackUsers.push(cc);
    //         }
    //       });
    //       console.log(this.infoTrackUsers);
    //     }
    //   } else {
    //     this.infoTrackUsers = <InfoTrackerUser[]>this.cacheInfoTrackUsers;
    //   }
    // });
  }

  addInfoTrackUser(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add info track user:' + value);
    if ((value && event.isUserInput && this.infoTrackUsers)) {
      let c: InfoTrackerUser = null;
      this.infoTrackUsers.forEach(cc => { if (cc.userId === value) { c = cc; } });
      this.infoTrackUser = c;
      console.log('added info track user:');
      console.log(this.infoTrackUser);

      let date1: Date = new Date();
      let month = Number(date1.getMonth()) + 1;
      let rDate1 = month + "-" + date1.getDate() + '-' + date1.getFullYear();
      console.log('todate');
      console.log(rDate1);
      this.service.GetUserCurrentFormStatus(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(),
      this.infoTrackUser.userId, this.templateId, rDate1).subscribe(resp2 => {
        console.log('today user status');
        console.log(resp2);
        if (resp2 && resp2.trackerId === null) {
          this.reportStatus = 'submit';
        } else if ((resp2 && resp2.trackerId !== null) && (resp2.reviewStatus === null)) {
          this.reportStatus = 'edit';
          this.existingTrackerId = resp2.existingTrackerId;
        } else if ((resp2 && resp2.trackerId !== null) && (resp2.reviewStatus !== null)) {
          this.reportStatus = 'addendum';
          this.existingTrackerId = resp2.existingTrackerId;
        }
      });
      this.selfReportForm.controls['userNameFormControl'].setValue('');
    }
  }

  removeInfoTrackUser(): void {
    console.log('removeInfoTrackUser');
    this.infoTrackUser = null;
    this.reportStatus = null;
  //  this.selfReportForm.controls['userNameFormControl'].setValue('');
    this.infoTrackUsers = <InfoTrackerUser[]>this.cacheInfoTrackUsers;
  //  this.infoTrackUserValidator();
  }

  infoTrackUserValidator(): ValidatorFn {
    console.log("info track user validator");
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const iTUser = control.value;
      console.log('iTUser:' + iTUser);
      if (iTUser === null || iTUser === '') {
        return { 'infoTrackUser': false };
      } else {
        return null;
      }
    };
  }

  infoTrackUserfocusOut() {
    console.log('infoTrackUserfocusOut event');
  //  this.infoTrackUserValidator();
  //  this.infoTrackUserInput.nativeElement.value = "";
  }

  infoTrackUserOnKey(event) {
    console.log('infoTrackUserOnKey event');
  //  this.infoTrackUserInput.nativeElement.value = "";
  //  this.selfReportForm.controls['userNameFormControl'].setValue('');
  //  this.infoTrackUserValidator();
  }

  loadUsers() {
    this.service.GetInfoTrackerUsers(this.service.auth.getOrgUnitID(),
    this.service.auth.getUserID()).subscribe(uResp => {
      this.infoTrackUsers = [];
      this.infoTrackUsers = <InfoTrackerUser[]>uResp;
      this.cacheInfoTrackUsers = <InfoTrackerUser[]>uResp;
      console.log('info track users');
      console.log(this.infoTrackUsers);
    });
  }

  setData(templateId: number) {
    this.templateId = templateId;
  }

  selectAnswer(questionId: any, answerOption: any) {
    console.log('select answer');
    console.log(questionId);
    console.log(answerOption);
    this.questions.forEach(cc => {
      if (cc.questionId === questionId && answerOption === 'no') {
        cc.noSelected = true;
        cc.yesSelected = false;
        cc.isQuestionAnswered = true;
      } else if (cc.questionId === questionId && answerOption === 'yes') {
        cc.noSelected = false;
        cc.yesSelected = true;
        cc.isQuestionAnswered = true;
      }
    });
    let lReadyToSubmit = true;
    this.questions.forEach(cc => {
      if (!cc.isQuestionAnswered) {
        lReadyToSubmit = false;
      }
    });
    if (lReadyToSubmit) {
      this.isReadyToSubmit = true;
    } else {
      this.isReadyToSubmit = false;
    }
  }

  openConfirmationDialogReportForOther(action: string): void {
    const dialogRef = this.dialog.open(InfotrackerConfirmDialogComponent, {
      width: '500px', height: '250px',
      data: "Once you submit and after being reviewed, you will no longer be able to change user's answers for today. Continue?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        if (action === 'submit') {
          this.submitOthersSelfReportForm();
        } else if (action === 'edit') {
          this.editOthersReportForm();
        }
      }
    });
  }

  submitOthersSelfReportForm() {
    this.showSubmitSpinner = true;
    console.log('submitOthersSelfReportForm');
    let currentDate: Date = new Date(this.selfReportForm.controls['reportDateFormControl'].value);
    this.reportDate = currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
    console.log('report date:' + this.reportDate);
    console.log('update question answers');
    console.log(this.questions);
    this.selAnswers = [];
    this.questions.forEach(cc => {
      let selAns: InfoTrackerAnswerResource = new InfoTrackerAnswerResource();
      if (cc.yesSelected) {
        selAns.answer = 'yes';
      }
      if (cc.noSelected) {
        selAns.answer = 'no';
      }
      selAns.question = cc.question;
      selAns.questionId = cc.questionId;
      this.selAnswers.push(selAns);
    });
    console.log('selected answers');
    console.log(this.selAnswers);
    const othersReportForm = {
      empId: this.service.auth.getUserID(),
      empFirstName: this.service.auth.getUserFirstName(),
      empLastName: this.service.auth.getUserLastName(),
      userId: this.infoTrackUser.userId,
      userFirstName: this.infoTrackUser.firstName,
      userLastName: this.infoTrackUser.lastName,
      reportedDate: this.reportDate,
      answers: this.selAnswers
    };
    console.log(othersReportForm);

    this.service.SubmitForm(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.templateId, 1, othersReportForm).subscribe(resp => {
        console.log(resp);
        if (resp) {
          this.dialogRef.close();
          this.showSubmitSpinner = false;
          const dialogRef = this.dialog.open(SelfreportsummaryComponent, {
            width: '700px', height: '900px'
          });
          dialogRef.componentInstance.infoTrackerRef = this.infoTrackerRef;
          dialogRef.componentInstance.setData(resp.trackerId, 'otheruserreported');
        }
      });
  }

  cancelSelfReport() {
    this.dialogRef.close();
  }

  editOthersReportForm() {
    this.showEditSpinner = true;
    console.log('Edit others report form');
    let currentDate: Date = new Date(this.selfReportForm.controls['reportDateFormControl'].value);
    this.reportDate = currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
    console.log('report date:' + this.reportDate);
    console.log('update question answers');
    console.log(this.questions);
    this.selAnswers = [];
    this.questions.forEach(cc => {
      let selAns: InfoTrackerAnswerResource = new InfoTrackerAnswerResource();
      if (cc.yesSelected) {
        selAns.answer = 'yes';
      }
      if (cc.noSelected) {
        selAns.answer = 'no';
      }
      selAns.question = cc.question;
      selAns.questionId = cc.questionId;
      this.selAnswers.push(selAns);
    });
    console.log('selected answers');
    console.log(this.selAnswers);
    const selfReportForm = {
      empId: this.service.auth.getUserID(),
      empFirstName: this.service.auth.getUserFirstName(),
      empLastName: this.service.auth.getUserLastName(),
      userId: this.infoTrackUser.userId,
      userFirstName: this.infoTrackUser.firstName,
      userLastName: this.infoTrackUser.lastName,
      reportedDate: this.reportDate,
      answers: this.selAnswers
    };
    console.log(selfReportForm);

    this.service.EditForm(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.existingTrackerId, selfReportForm).subscribe(resp => {
        console.log(resp);
        if (resp) {
          this.dialogRef.close();
          this.showSubmitSpinner = false;
          const dialogRef = this.dialog.open(SelfreportsummaryComponent, {
            width: '700px', height: '900px'
          });
          dialogRef.componentInstance.infoTrackerRef = this.infoTrackerRef;
          dialogRef.componentInstance.setData(resp.trackerId, 'otheruserreported');
        }
      });
  }

  submitAddendum() {

  }

  addUpdateUser() {
    const dialogRef = this.dialog.open(AddupdateuserComponent, {
      width: '500px', height: '700px'
    });
    dialogRef.componentInstance.reportForOtherRef = this;
    dialogRef.componentInstance.setData('adduser', "Add User", null);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
