import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../service/esignservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CaseActivityLog } from '../../../beans/ESignCase';

@Component({
  selector: 'app-auditpopup',
  templateUrl: './auditpopup.component.html',
  styleUrls: ['./auditpopup.component.scss']
})
export class AuditpopupComponent implements OnInit {

  mycaseId: any;
  statusBar: any;
  autoHeight: any;
  caseActivityData: CaseActivityLog[];
  gridColumnDefs: any;
  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<AuditpopupComponent>,
  ) { }

  ngOnInit() {
    this.gridColumnDefs = this.configColDef();
    this.loadCaseActivityData();
  }

  setCaseInfo(caseId: string) {
    console.log('set case info with in audit popup');
    console.log(caseId);
    this.mycaseId = caseId;
  }
  onFirstDataRendered(params) {
    console.log(params);
    params.api.sizeColumnsToFit();
  }
  configColDef() {
    const res = [
      {
        headerName: 'Seq No', field: 'seqNo',
        width: 75,
        suppressSizeToFit: true
      },
      { headerName: 'Date', field: 'activityDate' },
      { headerName: 'Type of Activity', field: 'typeofActivity', cellStyle: { color: 'blue' } },
      { headerName: 'Updated By', field: 'updatedBy' },
      { headerName: 'Audit Info', field: 'auditInfo' },
      { headerName: 'eSign Date', field: 'esignDate' }
    ];
    return res;
  }

  loadCaseActivityData() {
    this.service.getCaseActivityLog(this.mycaseId).subscribe(resp => {
      this.caseActivityData = <CaseActivityLog[]>resp;
    });
  }

  closeme() {
    this.dialogRef.close();
  }
}
