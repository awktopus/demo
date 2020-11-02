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
import { EzsignLinkRendererComponent } from '../EzsignLinkRenderer.component';
import { EzsignViewButtonRendererComponent } from '../Ezsignviewbutton-renderer.component';
import { EzsignPdfPopupComponent } from '../shared/ezsign-pdf-popup/ezsign-pdf-popup.component';
import { EzsignGridcolpopupComponent } from '../shared/ezsign-gridcolpopup/ezsign-gridcolpopup.component';
import { EzSignReminderRendererComponent } from '../EzsignReminderRenderer.component';
import { EzsignClientReminderComponent } from '../shared/ezsign-client-reminder/ezsign-client-reminder.component';
import { ReceiverEzsigningRendererComponent } from '../ReceiverEzsigningbutton-renderer.component';
import { EzsignDownloadButtonRendererComponent } from '../EzsignDownloadbutton-renderer.component';

@Component({
  selector: 'app-receiverezsigndocs',
  templateUrl: './receiverezsigndocs.component.html',
  styleUrls: ['./receiverezsigndocs.component.scss']
})
export class ReceiverezsigndocsComponent implements OnInit {

  isLinear = false;
  ezSignReceiverDocsgridData: EZSignDocResource[];
  gridColumnDefs: any;
  ezsignctrl: FormControl = new FormControl();
  search_val: string;
  filtertype: string;
  filterid: string;
  isSearch = false;
  pageHeading: string;
  frameworkComponents: any;
  context: any;
  receiverEzSignApi: any = {};
  statusBar: any;
  autoHeight: any;
  selectedIndex = 0;
  files: any = [];
  ezSignDoc: File | FileList;
  uploadedFileName: string;
  isEZsignDataFetched = false;
  showProcessSpinner = false;
  viewType = 'grid';
  private rowHeight;
  private rowClass;
  domLayout: any;
  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private ezSignDataService: EzsigndataService) {
    this.frameworkComponents = {
      viewButtonRender: EzsignViewButtonRendererComponent,
      receiverEzsigningButtonRender: ReceiverEzsigningRendererComponent,
      ezsignDownloadButtonRender: EzsignDownloadButtonRendererComponent
    }
  }

  ngOnInit() {
    console.log('receiver ezsing ng on init');
    this.gridColumnDefs = this.configColDef();
    this.loadEZSignDocuments();
    this.viewType = 'grid';
   }

  loadEZSignDocuments() {
    this.isEZsignDataFetched = false;
    this.ezSignDataService.getEZSignDocs().subscribe(resp => {
      const ezSignDocs: EZSignDocResource[] = <EZSignDocResource[]>resp;
      console.log(ezSignDocs);
      if (ezSignDocs) {
        this.ezSignReceiverDocsgridData = [];
        this.ezSignReceiverDocsgridData = ezSignDocs;
        this.ezSignReceiverDocsgridData.forEach(doc => {
          if (doc.receiverSigningStatus === "Signed" && doc.status === "Inprogress") {
            doc.status = doc.status + " " + "(Pending with others)"
          }
        });
      }
      this.isEZsignDataFetched = true;
    });
  }

  loadInternalEZSignDocuments() {
    this.isEZsignDataFetched = false;
    this.ezSignDataService.getEZSignDocs().subscribe(resp => {
      const ezSignDocs: EZSignDocResource[] = <EZSignDocResource[]>resp;
      console.log(ezSignDocs);
      if (ezSignDocs) {
        this.ezSignReceiverDocsgridData = [];
        this.ezSignReceiverDocsgridData = ezSignDocs;
        this.ezSignReceiverDocsgridData.forEach(doc => {
          if (doc.receiverSigningStatus === "Signed" && doc.status === "Inprogress") {
            doc.status = doc.status + " " + "(Pending with others)"
          }
        });
      }
      this.receiverEzSignApi.api.sizeColumnsToFit();
      this.isEZsignDataFetched = true;
    });
  }

  configColDef() {
    const res = [
      {
        headerName: 'EZSign Tracking Id', field: 'ezSignTrackingId', width: 150,
        cellStyle: this.changeRowColor
      },
      { headerName: 'Sender', field: 'senderName', cellStyle: this.changeRowColor, width: 200 },
      { headerName: 'Document Name', field: 'documentName', cellStyle: this.changeRowColor, width: 250 },
      { headerName: 'Status', field: 'status', cellStyle: this.changeRowColor, width: 200 },
      {
        headerName: 'View', width: 100,
        cellRenderer: 'viewButtonRender',
        cellRendererParams: {
          onClick: this.viewEZSignDocument.bind(this),
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Sign', width: 100,
        cellRenderer: 'receiverEzsigningButtonRender',
        cellRendererParams: {
          onClick: this.startReceiverEzsign.bind(this)
        },
        cellStyle: this.changeRowColor
      },
       {
         headerName: 'Download', width: 120,
         cellRenderer: 'ezsignDownloadButtonRender',
         cellRendererParams: {
          onClick: this.downloadEzSignDocument.bind(this)
         },
         cellStyle: this.changeRowColor
       },
      { headerName: 'Last Modified', field: 'lastModifiedDateTime',
      cellStyle: this.changeRowColor }
    ];
    this.context = { componentParent: this, ezsignfit: true };
    this.rowHeight = 40;
    this.domLayout = 'autoHeight';
    return res;
  }

  viewEZSignDocument(selectedRow: any) {
    console.log(selectedRow.rowData);
   // this.ezSignDataService.setCacheData("case", selectedRow.rowData);
   // this.viewType = "pagereview";
    const trkID = selectedRow.rowData.ezSignTrackingId;
    const docId=selectedRow.rowData.docId;
    const status:any=selectedRow.rowData.status;
    //this.ezSignDataService.showEzsignPDFDoc(trkID);
    if(status == "Signed"){
      this.ezSignDataService.viewEzsignFinalDoc(trkID);
    } else {
      this.ezSignDataService.previewEzsignDocPreview(trkID,docId);
    }
  }

  viewEZSignDocument_old(selectedRow: any) {
    console.log('view ezsign document');
    console.log(selectedRow);
    const dialogRef = this.dialog.open(EzsignPdfPopupComponent, { width: '520pt' });
    dialogRef.componentInstance.setPDF(this.ezSignDataService.auth.baseurl +
      '/Ezsign/tracking/' + selectedRow.rowData.ezSignTrackingId + '/signedform');
  }

  startReceiverEzsign(ezSignTrackingId: string) {
    console.log('start ezsigning document...');
    console.log(ezSignTrackingId);
    // find the corresponding signing document
    this.ezSignReceiverDocsgridData.forEach(doc => {
      if (doc.ezSignTrackingId === ezSignTrackingId) {
        console.log(doc);
        this.ezSignDataService.setCacheData("case", doc);
        this.viewType = 'signing';
      }
    });
  }

   switchToGridView() {
     this.viewType = 'grid';
     this.loadInternalEZSignDocuments();
   }

   resizeAll(gridname) {
    console.log(gridname);
    if (gridname === 'ezsign') {
      this.receiverEzSignApi.columnApi.autoSizeColumns(this.receiverEzSignApi.columnApi.getAllColumns());
    }
  }
  fitsizeAll(gridname) {
    if (gridname === 'ezsign') {
      this.receiverEzSignApi.api.sizeColumnsToFit();
    }
  }

  gridExport(gridname) {
    if (gridname === 'ezsign') {
      this.receiverEzSignApi.api.exportDataAsCsv();
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
   // params.api.autoSizeAllColumns();
    if (gridname === 'ezsign') {
      this.receiverEzSignApi.api = params.api;
      this.receiverEzSignApi.columnApi = params.columnApi;
      this.receiverEzSignApi.cols = [];
      this.receiverEzSignApi.columnApi.getAllColumns().forEach(cc => {
        this.receiverEzSignApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
  }

  onGridReady(params, gridname) {
    console.log('onGridReady');
    console.log(params);
    console.log(gridname);
    params.api.sizeColumnsToFit();
    if (gridname === 'ezsign') {
      this.receiverEzSignApi.api = params.api;
      this.receiverEzSignApi.columnApi = params.columnApi;
      this.receiverEzSignApi.cols = [];
      this.receiverEzSignApi.columnApi.getAllColumns().forEach(cc => {
        this.receiverEzSignApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
  }


changeRowColor(params) {
// console.log('params');
// console.log(params);
if (params.colDef.headerName === 'View' || params.colDef.headerName === 'Sign') {
  if (params.data.status === 'Sent to recipient') {
    return { 'background-color': '#f8d2d2', 'justify-content': "center" };
  } else if (params.data.status === 'Inprogress') {
    return { 'background-color': '#f1f1a6', 'justify-content': "center" };
  } else if (params.data.status === 'Signed') {
    return { 'background-color': '#d2f8d2', 'justify-content': "center" };
  }
} else {
    if (params.data.status === 'Sent to recipient') {
      return { 'background-color': '#f8d2d2', 'text-align': "left" };
    } else if (params.data.status === 'Inprogress') {
      return { 'background-color': '#f1f1a6', 'text-align': "left" };
    } else if (params.data.status === 'Signed') {
      return { 'background-color': '#d2f8d2', 'text-align': "left" };
    }
  }
  }

  changeTab(event) {

  }

  downloadEzSignDocument(ezSignDocRec: any) {
    console.log('downloadEzSignDocument...');
    console.log(ezSignDocRec);
    this.ezSignDataService.downloadEzsignDocument(ezSignDocRec.ezSignTrackingId,
      ezSignDocRec.documentName);
  }

}
