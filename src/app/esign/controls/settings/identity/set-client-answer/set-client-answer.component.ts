import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { EsignserviceService } from '../../../../service/esignservice.service';
import { EsignuiserviceService } from '../../../../service/esignuiservice.service';
import {
  IdentityQuestion, OrgClientQuestion, ESignClient, ESignCPA, ClientAnswer,
  OrgClientsIdentityAnswerSetup, ResponseStatusResource
} from '../../../../beans/ESignCase';
import { FormControl } from '@angular/forms';
import { EsignSettingsComponent } from '../../../settings/esign-settings.component';
import { GridColConfigPopupComponent } from '../../../history/gridcolpopup/grid-col-config-popup.component';
import { Step1panelComponent } from '../../../casemain/step1panel/step1panel.component';
@Component({
  selector: 'app-set-client-answer',
  templateUrl: './set-client-answer.component.html',
  styleUrls: ['./set-client-answer.component.scss']
})
export class SetClientAnswerComponent implements OnInit {
  clientAnswerGridApi: any = {};
  clientAnswerGridColumnApi: any = {};
  clientAnswergridData: OrgClientsIdentityAnswerSetup[];
  gridColumnDefs: any;
  private pinnedTopRowData;
  private pinnedBottomRowData;
  defaultColDef: any;
  rowSelection: any;
  autoGroupColumnDef: any;
  source: string;
  sourceClientId: string;
  isAllQuestionsAnswered = 'N';
  step1panelref: Step1panelComponent;
  clientType: string;
  autoHeight: string;
  statusBar: string;
  context: string;
  frameworkComponents: string;
  constructor(private service: EsignserviceService, private uiservice: EsignuiserviceService,
    public dialogRef: MatDialogRef<SetClientAnswerComponent>) {
  }

  setSource(source: string, clientId: string, clientType: string) {
    this.source = source;
    this.sourceClientId = clientId;
    this.clientType = clientType;
  }

  ngOnInit() {
    this.gridColumnDefs = this.clientAnswerGridColDef();
    this.service.getOrgClientIdentiificationAnswerData(this.service.auth.getOrgUnitID()).subscribe(resp => {
      const rr = <OrgClientsIdentityAnswerSetup[]>resp;
      console.log('getOrgClientIdentiificationAnswerData response');
      console.log(rr);
      if (this.source === 'newCase') {
        rr.forEach(rrQstn => {
          if (rrQstn.clientId === this.sourceClientId) {
            const rrQstnTemp: OrgClientsIdentityAnswerSetup[] = new Array(1);
            rrQstnTemp.push(rrQstn);
            this.clientAnswergridData = rrQstnTemp;
          }
        });
      } else {
        this.clientAnswergridData = rr;
      }
    });
    this.defaultColDef = { editable: true };
    this.rowSelection = 'multiple';
  }

  clientAnswerGridColDef() {
    const res = [
      {
        headerName: 'Client Name', field: 'clientName', width: 300,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        editable: false
      },
      { headerName: 'ClientId', field: 'clientId', hide: 'false' },
      { headerName: 'Question1', field: 'question', width: 500, editable: false },
      { headerName: 'QuestionId', field: 'questionId', hide: 'false' },
      {
        headerName: 'Answer1', field: 'answer', width: 200,
        cellStyle: { 'border-style': 'dashed', 'border-color': 'gray', 'border-width': '0.5px' }
      },
      {
        headerName: 'Share for email encryption (Y/N)?', field: 'shareForEmailEncryptionInd',
        width: 450,
        cellStyle: { 'border-style': 'dashed', 'border-color': 'gray', 'border-width': '0.5px' }
      },
      { headerName: 'Question2', field: 'question2', width: 500, editable: false },
      { headerName: 'Question2Id', field: 'question2Id', hide: 'false' },
      {
        headerName: 'Answer2', field: 'answer2', width: 200,
        cellStyle: { 'border-style': 'dashed', 'border-color': 'gray', 'border-width': '0.5px' }
      },
      { headerName: 'Question3', field: 'question3', width: 500, editable: false },
      { headerName: 'Question3Id', field: 'question3Id', hide: 'false' },
      {
        headerName: 'Answer3', field: 'answer3', width: 200,
        cellStyle: { 'border-style': 'dashed', 'border-color': 'gray', 'border-width': '0.5px' }
      }
    ];
    return res;
  }

  onGridReady(params) {
    this.clientAnswerGridApi = params.api;
    this.clientAnswerGridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  saveClientAnswerData() {
    let cjson: any = [];
    this.clientAnswerGridApi.forEachNode(function (rowNode, index) {
      if (rowNode.isSelected() === true) {
        console.log('------');
        console.log('node ' + rowNode.data.clientName + ' is in the grid');
        console.log('ClientId:' + rowNode.data.clientId);
        console.log('Question:' + rowNode.data.question);
        console.log('QuestionId:' + rowNode.data.questionId);
        console.log('Answer:' + rowNode.data.answer);
        console.log('Question2:' + rowNode.data.question2);
        console.log('Question2Id:' + rowNode.data.question2Id);
        console.log('Answer2:' + rowNode.data.answer2);
        console.log('Question3:' + rowNode.data.question3);
        console.log('Question3Id:' + rowNode.data.question3Id);
        console.log('Answer3:' + rowNode.data.answer3);
        console.log('shareForEmailEncryptionInd:' + rowNode.data.shareForEmailEncryptionInd);
        console.log('------');
        cjson.push({
          clientName: rowNode.data.clientName,
          clientId: rowNode.data.clientId,
          question: rowNode.data.question,
          questionId: rowNode.data.questionId,
          answer: rowNode.data.answer,
          answerId: rowNode.data.answerId,
          question2: rowNode.data.question2,
          question2Id: rowNode.data.question2Id,
          answer2: rowNode.data.answer2,
          answer2Id: rowNode.data.answer2Id,
          question3: rowNode.data.question3,
          question3Id: rowNode.data.question3Id,
          answer3: rowNode.data.answer3,
          answer3Id: rowNode.data.answer3Id,
          shareForEmailEncryptionInd: rowNode.data.shareForEmailEncryptionInd
        });
      }
    });
    console.log(cjson);
    this.service.saveClientIdentityAnswerData(this.service.auth.getOrgUnitID(), cjson).subscribe(resp => {
      const res = <ResponseStatusResource>resp;
      console.log('saveClientIdentityAnswerData response:');
      console.log(res);
      if (this.source === 'newCase') {
        if (res.statusCode === 'Y') {
          if (this.clientType === 'primary') {
            this.step1panelref.primarysigner.isIdentityAnswerSet = 'Y';
          } else if (this.clientType === 'secondary') {
            this.step1panelref.secondarysigner.isIdentityAnswerSet = 'Y';
          }
        } else {
          if (this.clientType === 'primary') {
            this.step1panelref.primarysigner.isIdentityAnswerSet = 'N';
          } else if (this.clientType === 'secondary') {
            this.step1panelref.secondarysigner.isIdentityAnswerSet = 'N';
          }
        }
      }
    });
    this.dialogRef.close();
  }

  closeme() {
    this.dialogRef.close();
  }
}
