import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EzsigndataService } from '../../../service/ezsigndata.service';
import {EzSignHistory} from '../../../../esign/beans/ESignCase';

@Component({
  selector: 'app-documenthistory',
  templateUrl: './documenthistory.component.html',
  styleUrls: ['./documenthistory.component.scss']
})
export class DocumenthistoryComponent implements OnInit {

  ezSignTrackingId: any;
  statusBar: any;
  autoHeight: any;
  eZSignHistoryData: EzSignHistory[];
  gridColumnDefs: any;
  title: string;
  constructor(private service: EzsigndataService,
    public dialogRef: MatDialogRef<DocumenthistoryComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.gridColumnDefs = this.configColDef();
    this.loadEzSignHistoryData();
  }

  setData(ezSignTrackingId: string, title: string) {
    console.log('set ezsign tracking info with in audit popup');
    console.log(ezSignTrackingId);
    this.ezSignTrackingId = ezSignTrackingId;
    this.title = title;
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
      { headerName: 'EZSign Date', field: 'esignDate' }
    ];
    return res;
  }

  loadEzSignHistoryData() {
    this.service.getEzSignHistoryData(this.ezSignTrackingId).subscribe(resp => {
      this.eZSignHistoryData = <EzSignHistory[]>resp;
    });
  }

  closeme() {
    this.dialogRef.close();
  }

}
