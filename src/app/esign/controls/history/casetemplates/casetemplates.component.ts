import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { EsignserviceService } from '../../../service/esignservice.service';
import { EsignuiserviceService } from '../../../service/esignuiservice.service';
import { NewCaseRendererComponent } from './../NewCaseRenderer.component';
import {
  ESignClient, ESignCPA,
  CaseTemplate, ResponseStatusResource
} from '../../../beans/ESignCase';
import { HistoryComponent } from '../history.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-casetemplates',
  templateUrl: './casetemplates.component.html',
  styleUrls: ['./casetemplates.component.scss']
})
export class CasetemplatesComponent implements OnInit {
  caseTemplatesGridApi: any = {};
  caseTemplatesGridColumnApi: any = {};
  caseTemplatesgridData: CaseTemplate[];
  gridColumnDefs: any;
  private pinnedTopRowData;
  private pinnedBottomRowData;
  defaultColDef: any;
  rowSelection: any;
  autoGroupColumnDef: any;
  historyref: HistoryComponent;
  autoHeight: string;
  statusBar: string;
  context: string;
  frameworkComponents: any;
  casetemplatefiles: any;
  constructor(private service: EsignserviceService, private uiservice: EsignuiserviceService,
    private router: Router,
    public dialogRef: MatDialogRef<CasetemplatesComponent>) {
      dialogRef.disableClose = true;
     }


  ngOnInit() {
    this.gridColumnDefs = this.clientAnswerGridColDef();
    this.frameworkComponents = {
      newCaseRenderer: NewCaseRendererComponent
    };
    this.service.getCaseTemplatesData().subscribe(resp => {
      const rr = <CaseTemplate[]>resp;
      console.log('getCaseTemplatesData response');
      console.log(rr);
      this.caseTemplatesgridData = rr;
     });
    this.defaultColDef = { editable: true };
    this.rowSelection = 'multiple';
  }

  clientAnswerGridColDef() {
    const res = [
      { headerName: 'Tax Return Id Number', field: 'taxReturnIdNumber', width: 300 },
      { headerName: 'Return Name', field: 'returnName', width: 500 },
      { headerName: 'Signer', field: 'signer', width: 500 },
      { headerName: 'Co-Signer', field: 'coSigner', width: 500 },
      { headerName: 'Tax Year', field: 'taxYear', width: 300 },
      { headerName: '+', field: 'newCase', cellRenderer: 'newCaseRenderer', width: 50,
      suppressSizeToFit: true }
    ];
    return res;
  }

  onGridReady(params) {
    this.caseTemplatesGridApi = params.api;
    this.caseTemplatesGridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  closeme() {
    this.dialogRef.close();
 //   this.historyref.selectedIndex = 0;
  }

  uploadCaseTemplates(ff: File | FileList) {
    this.service.uploadCaseTemplates(ff).subscribe(resp => {
      console.log('uploadCaseTemplates response');
      console.log(resp);
      const rr = <CaseTemplate[]>resp;
      if (rr != null && rr.length > 0) {
      this.caseTemplatesgridData = rr;
      } else {
      }
    },
      error => console.log(error)
    );
  }

  neweSignCaseFromScratch() {
    this.router.navigateByUrl('main/esign/case/newcaseID');
    this.dialogRef.close();
  }
}
