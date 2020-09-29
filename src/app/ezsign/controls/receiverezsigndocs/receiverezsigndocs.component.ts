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

@Component({
  selector: 'app-receiverezsigndocs',
  templateUrl: './receiverezsigndocs.component.html',
  styleUrls: ['./receiverezsigndocs.component.scss']
})
export class ReceiverezsigndocsComponent implements OnInit {

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
  receiverEzSignApi: any = {};
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
      viewButtonRender: EzsignViewButtonRendererComponent,
      receiverEzsigningButtonRender: ReceiverEzsigningRendererComponent
    }
  }

  ngOnInit() {
    this.gridColumnDefs = this.configColDef();
    this.loadEZSignDocuments();
   }

  loadEZSignDocuments() {
    this.isEZsignDataFetched = false;
    this.ezSignDataService.getEZSignDocs().subscribe(resp => {
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
        cellStyle: this.changeRowColor
      },
      { headerName: 'Sender', field: 'senderName', cellStyle: this.changeRowColor },
      { headerName: 'Document Name', field: 'documentName', cellStyle: this.changeRowColor },
      { headerName: 'Status', field: 'status', cellStyle: this.changeRowColor },
      { headerName: 'Last Modified', field: 'lastModifiedDateTime',
      cellStyle: this.changeRowColor },
      {
        headerName: 'View',
        cellRenderer: 'viewButtonRender',
        cellRendererParams: {
          onClick: this.viewEZSignDocument.bind(this),
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Sign',
        cellRenderer: 'receiverEzsigningButtonRender',
        cellRendererParams: {
          onClick: this.startReceiverEzsign.bind(this)
        },
        cellStyle: this.changeRowColor
      }
    ];
    this.context = { componentParent: this, ezsignfit: true };
    this.rowHeight = 40;
    this.domLayout = 'autoHeight';
    return res;
  }


  viewEZSignDocument(selectedRow: any) {
    console.log('view ezsign document');
    console.log(selectedRow);
    const dialogRef = this.dialog.open(EzsignPdfPopupComponent, { width: '520pt' });
    dialogRef.componentInstance.setPDF(this.ezSignDataService.auth.baseurl +
      '/Ezsign/tracking/' + selectedRow.rowData.ezSignTrackingId + '/signedform');
  }

  startReceiverEzsign(ezSignTrackingId: string) {
    console.log('start ezsigning document...');
    console.log(ezSignTrackingId);
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

changeRowColor(params) {
console.log('params');
console.log(params);
if (params.colDef.headerName === 'View' || params.colDef.headerName === 'Sign') {
  if (params.data.status === 'Sent to recipient') {
    return { 'background-color': '#DE2A2A', 'justify-content': "center" };
  } else if (params.data.status === 'Inprogress') {
    return { 'background-color': '#D0D0D0', 'justify-content': "center" };
  } else if (params.data.status === 'Signed') {
    return { 'background-color': '#97FBB6', 'justify-content': "center" };
  } else if (params.data.status === 'need assistance') {
    return { 'background-color': '#FBE197', 'justify-content': "center" };
  }
} else {
    if (params.data.status === 'Sent to recipient') {
      return { 'background-color': '#DE2A2A', 'text-align': "left" };
    } else if (params.data.status === 'Inprogress') {
      return { 'background-color': '#D0D0D0', 'text-align': "left" };
    } else if (params.data.status === 'Signed') {
      return { 'background-color': '#97FBB6', 'text-align': "left" };
    } else if (params.data.status === 'need assistance') {
      return { 'background-color': '#FBE197', 'text-align': "left" };
    }
  }
  }

  changeTab(event) {

  }

}
