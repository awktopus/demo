import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../../service/esignservice.service';
import { IdentityQuestion, OrgClientQuestion } from '../../../../beans/ESignCase';
import { EsignSettingsComponent } from '../../../settings/esign-settings.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-identity-questions',
  templateUrl: './identity-questions.component.html',
  styleUrls: ['./identity-questions.component.scss']
})
export class IdentityQuestionsComponent implements OnInit {
  idQuestions: any;
  selIdentityQuestion: any;
  esignSettingsRef: EsignSettingsComponent;
  orgUnitId: string;
  idQstnId: string;

  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<IdentityQuestionsComponent>) { }

  ngOnInit() {
    this.service.getIdentityQuestions(this.orgUnitId).subscribe(resp => {
      const rr = <IdentityQuestion>resp;
      console.log(rr);
      this.idQuestions = resp;
      console.log(this.idQuestions);
      this.selIdentityQuestion = this.idQuestions[0].qtnId;
    });
  }

  setIdentityQuestionInfo(orgUnitId: string) {
    this.orgUnitId = orgUnitId;
  }

  closeme() {
    this.dialogRef.close();
  }
  selectIdQuestion(event) {
    console.log('question:' + event.value);
    this.selIdentityQuestion = event.value;
  }

  saveQuestion() {
    const cjson = {
      qtnId: this.selIdentityQuestion,
      activeInd: 'Y'
    };
    console.log(cjson);
    this.service.saveOrgUnitIdentityQuestion(this.orgUnitId, cjson).subscribe(resp => {
     // const res = <OrgClientQuestion> resp;
      console.log('save org ID Verification Question response:');
      console.log(resp);
      this.esignSettingsRef.orgClientQuestions = resp;
      if (this.esignSettingsRef.orgClientQuestions == null) {
        this.esignSettingsRef.isOrgClientIdQuestionsExists = 'N';
      } else {
        this.esignSettingsRef.isOrgClientIdQuestionsExists = 'Y';
        this.esignSettingsRef.orgClientIdQuestionCount += 1;
      }
    });
    this.dialogRef.close();
  }

}
