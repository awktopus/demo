import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { GridColConfigPopupComponent } from './../../../esign/controls/history/gridcolpopup/grid-col-config-popup.component';
import { RouterLinkRendererComponent } from './../../../esign/controls/history/RouterLinkRenderer.component';
import { AddsignersComponent } from './../addsigners/addsigners.component'
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { EZSignDocResource } from '../../../esign/beans/ESignCase'
import { ViewChild, AfterViewInit } from '@angular/core';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { EzsignAddSignersButtonRendererComponent } from '../Ezsignaddsignersbutton-renderer.component';
import { EzsignConfirmationDialogComponent } from '../shared/ezsign-confirmation-dialog/ezsign-confirmation-dialog.component';
import { EzsignDeleteButtonRendererComponent } from '../Ezsigndeletebutton-renderer.component';
import { EzsignHistoryButtonRendererComponent } from '../Ezsignhistorybutton-renderer.component';
import { DocumenthistoryComponent } from './documenthistory/documenthistory.component';

@Component({
  selector: 'app-senderdocuments',
  templateUrl: './senderdocuments.component.html',
  styleUrls: ['./senderdocuments.component.scss']
})
export class SenderdocumentsComponent implements OnInit {
  isLinear = false;
  ezSignDocsgridData: any;
  gridColumnDefs: any;
  ezsignctrl: FormControl = new FormControl();
  search_val: string;
  filtertype: string;
  filterid: string;
  isSearch = false;
  pageHeading: string;
  frameworkComponents: any;
  context: any;
  ezsignapi: any = {};
  statusBar: any;
  autoHeight: any;
  selectedIndex = 0;
  files: any = [];
  ezSignDoc: File | FileList;
  uploadedFileName: string;
  private rowHeight;
  private rowClass;
  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private ezSignDataService: EzsigndataService) {
    this.frameworkComponents = {
      addSignersButtonRenderer: EzsignAddSignersButtonRendererComponent,
      historyButtonRenderer: EzsignHistoryButtonRendererComponent,
      deleteButtonRender: EzsignDeleteButtonRendererComponent
    }
  }

  ngOnInit() {
    this.gridColumnDefs = this.configColDef();

    this.loadEZSignDocuments();

    //  this.ezSignDataService.cur_ezsignDocHistory.subscribe(ezSignDocHis => {
    //    console.log('subscribe');
    //    if (ezSignDocHis) {
    //    console.log(ezSignDocHis);
    //    this.ezSignDocsgridData = [];
    //    this.ezSignDocsgridData.push(ezSignDocHis);
    //   }
    //   console.log('after subscribe push');
    //   console.log(this.ezSignDocsgridData);
    //   console.log(this.ezSignDocsgridData.length);
    //   });
    // this.loadEZSignDocuments();
  }

  loadEZSignDocuments() {
    this.ezSignDataService.getEZSignDocuments().subscribe(resp => {
      const ezSignDocs: EZSignDocResource[] = <EZSignDocResource[]>resp;
      console.log(ezSignDocs);
      this.ezSignDocsgridData = ezSignDocs;
    });

    // this.ezSignDocsgridData = [
    //   { ezSignTrackingId: "EZS11151901", documentName: "E-File Authorization Sample1",
    //   status: "Uploaded", receiverName : "",
    //   lastModified: "12 hours ago"},
    //   { ezSignTrackingId: "EZS11151902", documentName: "E-File Authorization Sample2",
    //   status: "Sent to recipient", receiverName : "Ranga Rachapudi",
    //   lastModified: "2 days back"},
    //   { ezSignTrackingId: "EZS11151903", documentName: "E-File Authorization Sample3",
    //   status: "Recipient signed", receiverName : "Ying Guo",
    //   lastModified: "7 days back"},
    //   { ezSignTrackingId: "EZS11151904", documentName: "E-File Authorization Sample3",
    //   status: "Completed", receiverName : "Charles Ysl",
    //   lastModified: "10 days back"}
    // ];
  }

  configColDef() {
    const res = [
      {
        headerName: 'EZSign Tracking Id', field: 'ezSignTrackingId',
        cellStyle: { textAlign: 'left' }
      },
      { headerName: 'Document Name', field: 'documentName', cellStyle: { textAlign: 'left' } },
      { headerName: 'Status', field: 'status', cellStyle: { color: 'blue', textAlign: 'left' } },
      { headerName: 'Last Modified', field: 'lastModifiedDateTime', cellStyle: { textAlign: 'left' } },
      // { headerName: 'Receiver Name', field: 'receiverName', cellStyle: {textAlign: 'left'} },
      {
        width: 120,
        cellRenderer: 'addSignersButtonRenderer',
        cellRendererParams: {
          onClick: this.addSigners.bind(this),
          label: 'ADD SIGNERS'
        },
        cellStyle: { 'justify-content': "center" }
      },
      {
        width: 100,
        cellRenderer: 'deleteButtonRender',
        cellRendererParams: {
          onClick: this.openConfirmationDialogforCompanyDeletion.bind(this),
          label: 'DELETE'
        },
        cellStyle: { 'justify-content': "center" }
      },
      {
        width: 120,
        cellRenderer: 'historyButtonRenderer',
        cellRendererParams: {
          onClick: this.openHistoryDialog.bind(this),
          label: 'HISTORY'
        },
        cellStyle: { 'justify-content': "center" }
      }
    ];
    this.context = { componentParent: this, ezsignfit: false };
    this.rowHeight = 40;
    this.rowClass = 'ezsign-history-grid';
    return res;
  }

  deleteEZSignDocument(deletedRow: any) {
    console.log('deleteEZSignDocument...');
    console.log('tracking Id:' + deletedRow.rowData.ezSignTrackingId);
    this.ezSignDataService.deleteEZSignDocument(deletedRow.rowData.ezSignTrackingId).subscribe(resp => {
      this.loadEZSignDocuments();
    });
  }

  openConfirmationDialogforCompanyDeletion(deletedRow: any): void {
    const dialogRef = this.dialog.open(EzsignConfirmationDialogComponent, {
      width: '450px', height: '150px',
      data: "Do you confirm the deletion of this EZSign document?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.deleteEZSignDocument(deletedRow);
      }
    });
  }

  resizeAll(gridname) {
    console.log(gridname);
    if (gridname === 'ezsign') {
      this.ezsignapi.columnApi.autoSizeColumns(this.ezsignapi.columnApi.getAllColumns());
    }
  }
  fitsizeAll(gridname) {
    if (gridname === 'ezsign') {
      this.ezsignapi.api.sizeColumnsToFit();
    }
  }

  gridExport(gridname) {
    if (gridname === 'ezsign') {
      this.ezsignapi.api.exportDataAsCsv();
    }
  }

  selCol(ev, api, colId) {
    console.log(ev);
    console.log(api);
    console.log(colId);
    if (ev.checked) {
      api.columnApi.setColumnVisible(colId, true);
    } else {
      api.columnApi.setColumnVisible(colId, false);
    }
  }

  togglecolswitch(api) {
    if (!api.colswitch) {
      api.colswitch = true;
    } else {
      api.colswitch = false;
    }
  }

  openColumnConfig(api) {
    this.dialog.open(GridColConfigPopupComponent, { width: '200', data: api });
  }

  onFirstDataRendered(params, gridname) {
    console.log(params);
    params.api.sizeColumnsToFit();
    if (gridname === 'ezsign') {
      this.ezsignapi.api = params.api;
      // this.ezsignapi.rowClassRules = "ezsign-history-grid";
      this.ezsignapi.columnApi = params.columnApi;
      this.ezsignapi.cols = [];
      this.ezsignapi.columnApi.getAllColumns().forEach(cc => {
        this.ezsignapi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
  }

  addSigners(ezSignDocRow: any) {
    console.log('addSigners');
    console.log('tracking id:' + ezSignDocRow.rowData.ezSignTrackingId);
    const dialogRef = this.dialog.open(AddsignersComponent, {
      width: '1260px', height: '500px'
    });
    dialogRef.componentInstance.senderDocumentsref = this;
    dialogRef.componentInstance.setData(ezSignDocRow.rowData.ezSignTrackingId, 'senderdocuments');
  }

  launchNewEZSignDocument() {
    console.log('createNewEZSignDocument');
    const dialogRef = this.dialog.open(UploadDocumentComponent, {
      width: '1300px'
    });
    dialogRef.componentInstance.senderDocumentCompomentRef = this;
  }

  uploadFile(event) {
    console.log('uploadFile');
    console.log(event);
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element)
      this.ezSignDoc = element;
      this.uploadedFileName = element.name;
    }
  }
  deleteAttachment(index) {
    this.files.splice(index, 1);
    this.ezSignDoc = null;
  }

  createNewEZSignDocument() {
    this.ezSignDataService.createNewEZSignDocument(this.ezSignDoc).subscribe(resp => {
      console.log(resp);
      this.loadEZSignDocuments();
    });

  }

  openHistoryDialog(ezSignDocRow: any): void {
    const dialogRef = this.dialog.open(DocumenthistoryComponent, {
      width: '1200px',
    });
    dialogRef.componentInstance.setData(ezSignDocRow.rowData.ezSignTrackingId,
      ezSignDocRow.rowData.documentName);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
