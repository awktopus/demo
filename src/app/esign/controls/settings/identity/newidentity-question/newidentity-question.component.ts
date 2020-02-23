import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../../service/esignservice.service';
import { MatDialog, MatOptionSelectionChange, MatDialogRef } from '@angular/material';
import { IdentityQuestion } from '../../../../beans/ESignCase';
import { EsignSettingsComponent } from '../../../settings/esign-settings.component';
@Component({
  selector: 'app-newidentity-question',
  templateUrl: './newidentity-question.component.html',
  styleUrls: ['./newidentity-question.component.scss']
})
export class NewidentityQuestionComponent implements OnInit {
  esignSettingsRef: EsignSettingsComponent;
  orgUnitId: string;
  identityQuestion: string;
  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<NewidentityQuestionComponent>) {
      dialogRef.disableClose = true;
    }

  ngOnInit() {
  }

  setNewQuestionInfo(orgUnitId: string) {
    this.orgUnitId = orgUnitId;
  }

  createNewQuestion() {
    const cjson = {
      question: this.identityQuestion
    };
    console.log(cjson);
    this.service.addNewIdentityQuestion(this.orgUnitId, cjson).subscribe(resp => {
      const res = <IdentityQuestion[]>resp;
     });
    this.dialogRef.close();
  }
  closeme() {
    this.dialogRef.close();
  }

}
