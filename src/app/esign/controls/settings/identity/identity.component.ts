import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../service/esignservice.service';
import { OrgClientQuestion } from '../../../beans/ESignCase';
import { MatDialog, MatOptionSelectionChange } from '@angular/material';
import { IdentityQuestionsComponent } from './identity-questions/identity-questions.component';
import { SetClientAnswerComponent } from './set-client-answer/set-client-answer.component';
import { NewidentityQuestionComponent } from './newidentity-question/newidentity-question.component';
@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class IdentityComponent implements OnInit {
  orgUnitName: string;
  identityQuestion: string;
  orgUnitId: string;
  orgQtnId: string;
  qtnId: string;
  activeInd: string;
  constructor(private service: EsignserviceService, public dialog: MatDialog) { }

  ngOnInit() {
      this.service.getOrgUnitActiveIdentityQuestion(
        this.service.auth.getOrgUnitID()).subscribe(resp => {
          const rr = <OrgClientQuestion>resp;
          this.orgUnitId = rr.orgUnitId;
          this.orgQtnId = rr.orgQtnId;
          this.identityQuestion = rr.question;
          this.activeInd = rr.activeInd;
          this.qtnId = rr.qtnId;
          console.log(rr);
        });
  }

  // public makeIdentityQuestionInactive() {
  //   this.service.makeIdentityQuestionInactive(
  //     this.service.auth.getOrgUnitID()).subscribe(resp => {
  //       const rr = <OrgClientQuestion>resp;
  //       this.orgUnitId = rr.orgUnitId;
  //       this.orgQtnId = rr.orgQtnId;
  //       this.identityQuestion = rr.question;
  //       this.activeInd = rr.activeInd;
  //       this.qtnId = rr.qtnId;
  //       console.log(rr);
  //     });
  // }
  public editIdentityQuestion() {

  }
  public addIdentityQuestion() {
      const dialogRef = this.dialog.open(IdentityQuestionsComponent, {
        width: '700px',
      });
    //      dialogRef.componentInstance.esignSettingsRef = this;
          dialogRef.componentInstance.setIdentityQuestionInfo(this.service.auth.getOrgUnitID());
  }

  public setClientAnswer() {
    const dialogRef = this.dialog.open(SetClientAnswerComponent, {
      width: '960px',
    });
     //   dialogRef.componentInstance.esignSettingsRef = this;
     //   dialogRef.componentInstance.setClientAnswerInfo(this.service.auth.getOrgUnitID(),
     //                                                   this.identityQuestion, this.orgQtnId);
  }

  createNewQuestion() {
    const dialogRef = this.dialog.open(NewidentityQuestionComponent, {
      width: '560px',
    });
       // dialogRef.componentInstance.esignSettingsRef = this;
        dialogRef.componentInstance.setNewQuestionInfo(this.service.auth.getOrgUnitID());
  }
}
