import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../../service/esignservice.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Step1panelComponent } from '../../../casemain/step1panel/step1panel.component';
import { ClientAnswer } from '../../../../beans/ESignCase';

@Component({
  selector: 'app-client-answer',
  templateUrl: './client-answer.component.html',
  styleUrls: ['./client-answer.component.scss']
})
export class ClientAnswerComponent implements OnInit {
  identityQuestion: string;
  identityAnswer: string;
  answerId: string;
  orgUnitId: string;
  clientId: string;
  orgQtnId: string;
  step1panelref: Step1panelComponent;
  clientType: string;


  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<ClientAnswerComponent>) {
      dialogRef.disableClose = true;
     }

  ngOnInit() {
  }

  setClientAnswerInfo(orgUnitId: string, clientId: string, question: string,
                     answer: string, answerId: string, orgQtnId: string, clientType: string) {
    this.identityQuestion = question;
    this.identityAnswer = answer;
    this.answerId = answerId;
    this.orgUnitId = orgUnitId;
    this.clientId = clientId;
    this.orgQtnId = orgQtnId;
    this.clientType = clientType;
    console.log('client answer component:' + this.identityQuestion + ','
                  + this.identityAnswer + ',' + this.answerId + ',' + this.orgUnitId +
                  ',' + this.clientId + ',' + this.orgQtnId);
  }
  closeme() {
    this.dialogRef.close();
  }
  saveQuestion() {
    const cjson = {
      answer: this.identityAnswer
    };
    console.log(cjson);
    this.service.saveClientIdentityAnswer(this.orgUnitId, this.clientId, this.orgQtnId, cjson).subscribe(resp => {
      const res = <ClientAnswer> resp;
      console.log('save client identity answer response:');
      console.log(res);
      if (res.answer) {
        if (this.clientType === 'primary') {
          this.step1panelref.primarysigner.isIdentityAnswerSet = 'Y';
        } else if (this.clientType === 'secondary') {
          this.step1panelref.secondarysigner.isIdentityAnswerSet = 'Y';
        }
      } else { if (this.clientType === 'primary') {
          this.step1panelref.primarysigner.isIdentityAnswerSet = 'N';
        } else if (this.clientType === 'secondary') {
          this.step1panelref.secondarysigner.isIdentityAnswerSet = 'N';
        }
      }
    });
    this.dialogRef.close();
  }
}
