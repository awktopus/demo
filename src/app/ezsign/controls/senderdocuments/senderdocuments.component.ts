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
import { EzsignLinkRendererComponent } from '../EzsignLinkRenderer.component';
import { EzsignViewButtonRendererComponent } from '../Ezsignviewbutton-renderer.component';
import { EzsignPdfPopupComponent } from '../shared/ezsign-pdf-popup/ezsign-pdf-popup.component';
import { EzsignGridcolpopupComponent } from '../shared/ezsign-gridcolpopup/ezsign-gridcolpopup.component';
import { EzSignReminderRendererComponent } from '../EzsignReminderRenderer.component';
import { EzsignClientReminderComponent } from '../shared/ezsign-client-reminder/ezsign-client-reminder.component';

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
  isEZsignDataFetched = false;
  showProcessSpinner = false;
  private rowHeight;
  private rowClass;
  domLayout: any;
  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private ezSignDataService: EzsigndataService) {
    this.frameworkComponents = {
      ezsignLinkRenderer: EzsignLinkRendererComponent,
      viewButtonRender: EzsignViewButtonRendererComponent,
      addSignersButtonRenderer: EzsignAddSignersButtonRendererComponent,
      historyButtonRenderer: EzsignHistoryButtonRendererComponent,
      deleteButtonRender: EzsignDeleteButtonRendererComponent,
      reminderRenderer: EzSignReminderRendererComponent
    }
  }

  ngOnInit() {
    this.gridColumnDefs = this.configColDef();

    this.loadEZSignDocuments();
  }

  loadEZSignDocuments() {
    this.ezSignDataService.getEZSignDocuments().subscribe(resp => {
      const ezSignDocs: EZSignDocResource[] = <EZSignDocResource[]>resp;
      console.log(ezSignDocs);
      this.ezSignDocsgridData = ezSignDocs;
      this.isEZsignDataFetched = true;
    });
  }

  configColDef() {
    const res = [
      {
        headerName: 'EZSign Tracking Id', field: 'ezSignTrackingId',
        cellStyle: { color: 'blue', textAlign: 'left' },
        cellRenderer: 'ezsignLinkRenderer'
      },
      { headerName: 'Document Name', field: 'documentName', cellStyle: { textAlign: 'left' } },
      { headerName: 'Status', field: 'status', cellStyle: { textAlign: 'left' } },
      { headerName: 'Last Modified', field: 'lastModifiedDateTime', cellStyle: { textAlign: 'left' } },
      {
        headerName: 'Signer Status',
        cellRenderer: 'addSignersButtonRenderer',
        cellRendererParams: {
          onClick: this.addSigners.bind(this),
          label: 'ADD SIGNERS'
        },
        cellStyle: { 'justify-content': "center" }
      },
      {
        headerName: 'View',
        cellRenderer: 'viewButtonRender',
        cellRendererParams: {
          onClick: this.viewEZSignDocument.bind(this),
        },
        cellStyle: { 'justify-content': "center" }
      },
      {
        headerName: 'Delete',
        cellRenderer: 'deleteButtonRender',
        cellRendererParams: {
          onClick: this.openConfirmationDialogforCompanyDeletion.bind(this),
          label: 'DELETE'
        },
        cellStyle: { 'justify-content': "center" }
      },
      {
        headerName: 'History',
        cellRenderer: 'historyButtonRenderer',
        cellRendererParams: {
          onClick: this.openHistoryDialog.bind(this),
          label: 'HISTORY'
        },
        cellStyle: { 'justify-content': "center" }
      }, {
        headerName: 'Reminder', field: 'clientReminderFlag', cellRenderer: 'reminderRenderer',
        minwidth: 100
      },
    ];
    this.context = { componentParent: this, ezsignfit: false };
    this.rowHeight = 40;
    this.domLayout = 'autoHeight';
    this.rowClass = 'ezsign-history-grid';
    return res;
  }

  createClientReminder(ezSignTrackingId: string): void {
     const dialogRef = this.dialog.open(EzsignClientReminderComponent, {
      width: '980px',
    });
    dialogRef.componentInstance.senderDocRef = this;
    this.ezSignDataService.getClientScheduleReminder(ezSignTrackingId).subscribe(resp => {
      const res_c = <any>resp;
      //   console.log(res_c);
      dialogRef.componentInstance.setClientReminderInfo(res_c);
    });
  }

  updateClientReminderFlag(ezSignTrackingId: string, flag: string) {
    this.ezSignDocsgridData.forEach(cc => {
      if (cc.ezSignTrackingId === ezSignTrackingId
      ) {
        cc.clientReminderFlag = flag;
      }
    });
  }

  showEzSignDocument(selectedRow: any) {
    console.log('show ezsign document');
    console.log(selectedRow);
    const url = '/main/ezsign/addfields/' + selectedRow;
    this.router.navigateByUrl(url);
  }

  viewEZSignDocument(selectedRow: any) {
    console.log('view ezsign document');
    console.log(selectedRow);
    const dialogRef = this.dialog.open(EzsignPdfPopupComponent, { width: '520pt' });
    dialogRef.componentInstance.setPDF(this.ezSignDataService.auth.baseurl +
      '/Ezsign/tracking/' + selectedRow.rowData.ezSignTrackingId + '/signedform');
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
    this.dialog.open(EzsignGridcolpopupComponent, { width: '200', data: api });
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
      width: '70%', height: '70%'
    });
    dialogRef.componentInstance.senderDocumentsref = this;
    dialogRef.componentInstance.setData(ezSignDocRow.rowData.ezSignTrackingId,
      'senderdocuments', ezSignDocRow.rowData.status);
  }

  launchNewEZSignDocument() {
    console.log('createNewEZSignDocument');
    const dialogRef = this.dialog.open(UploadDocumentComponent, {
      width: '70%', height: '80%'
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
    this.showProcessSpinner = true;
    this.ezSignDataService.createNewEZSignDocument(this.ezSignDoc).subscribe(resp => {
      console.log(resp);
      if (resp) {
        const ezSignDoc: EZSignDocResource = <EZSignDocResource>resp;
        //  this.loadEZSignDocuments();
        const url = '/main/ezsign/addfields/' + ezSignDoc.ezSignTrackingId;
        this.router.navigateByUrl(url);
      }
      this.showProcessSpinner = false;
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

  changeTab(event) {

  }
}
