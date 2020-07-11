import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InfotrackerComponent } from '../infotracker.component';
import { InfoTrackerService } from '../service/infotracker.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { FormTemplateResource, PageQuestionResource, InfoTrackerAnswerResource } from '../../esign/beans/ESignCase';
import { SelfreportsummaryComponent } from '../selfreportsummary/selfreportsummary.component';
import { InfotrackerConfirmDialogComponent } from '../shared/infotracker-confirm-dialog/infotracker-confirm-dialog.component';

@Component({
  selector: 'app-selfreport',
  templateUrl: './selfreport.component.html',
  styleUrls: ['./selfreport.component.scss']
})
export class SelfreportComponent implements OnInit {

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
  isAlreadyReported = false;
  showEditSpinner = false;
  showAddendumSpinner = false;
  existingTrackerId: string;
  selfReportForm: FormGroup = new FormGroup({
    reportDateFormControl: new FormControl((new Date()).toISOString(), Validators.required),
    userNameFormControl: new FormControl(''),
  });

  @ViewChild('focusField') focusField: ElementRef;

  constructor(private service: InfoTrackerService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<SelfreportComponent>, private formBuilder: FormBuilder) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

    console.log('self report init');
    let date1: Date = new Date();
    let month = Number(date1.getMonth()) + 1;
    let rDate1 = month + "-"  +  date1.getDate() + '-' + date1.getFullYear();
    console.log('todate');
    console.log(rDate1);
    console.log('Self report init');
    this.service.GetUserCurrentFormStatus(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
    this.service.auth.getUserID(), this.templateId, rDate1).subscribe(resp2 => {
      console.log('today user status');
      console.log(resp2);
      if (resp2 && resp2.trackerId !== null) {
        this.isAlreadyReported = true;
        this.existingTrackerId = resp2.trackerId;
      }
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
        });

      this.userName = this.service.auth.getUserFirstName() + " " + this.service.auth.getUserLastName();
      this.userId = this.service.auth.getUserID();
      console.log('user name');
      console.log(this.userName);
      console.log('user id');
      console.log(this.userId);
      this.selfReportForm.controls['userNameFormControl'].setValue(this.userName);
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

  openConfirmationDialogforSelfReport(action: string): void {
    const dialogRef = this.dialog.open(InfotrackerConfirmDialogComponent, {
      width: '500px', height: '250px',
      data: "Once you submit and after being reviewed, you will no longer be able to change your answers for today. Continue?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        if (action === 'submit') {
         this.submitSelfReportForm();
        } else if (action === 'edit') {
          this.editSelfReportForm();
        }
      }
    });
  }

  submitSelfReportForm() {
    this.showSubmitSpinner = true;
    console.log('submitSelfReportForm');
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
      userId: this.service.auth.getUserID(),
      userFirstName: this.service.auth.getUserFirstName(),
      userLastName: this.service.auth.getUserLastName(),
      reportedDate: this.reportDate,
      answers: this.selAnswers
    };
    console.log(selfReportForm);

    this.service.SubmitForm(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.templateId, 1, selfReportForm).subscribe(resp => {
        console.log(resp);
        if (resp) {
          this.dialogRef.close();
          this.showSubmitSpinner = false;
          const dialogRef = this.dialog.open(SelfreportsummaryComponent, {
            width: '700px', height: '900px'
          });
          dialogRef.componentInstance.infoTrackerRef = this.infoTrackerRef;
          dialogRef.componentInstance.setData(resp.trackerId);
        }
      });
  }

  cancelSelfReport() {
    this.dialogRef.close();
  }

  editSelfReportForm() {
    this.showEditSpinner = true;
    console.log('Edit self report form');
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
      userId: this.service.auth.getUserID(),
      userFirstName: this.service.auth.getUserFirstName(),
      userLastName: this.service.auth.getUserLastName(),
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
          dialogRef.componentInstance.setData(resp.trackerId);
        }
      });
  }

  submitAddendum() {

  }
}
