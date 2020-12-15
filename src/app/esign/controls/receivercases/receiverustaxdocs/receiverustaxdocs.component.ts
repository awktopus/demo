import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../../service/esignservice.service';
import { AuditRendererComponent } from '../../history/AuditRenderer.component';
import { EzsignViewButtonRendererComponent } from '../../../../ezsign/controls/Ezsignviewbutton-renderer.component';
import { ReceiverEzsigningRendererComponent } from '../../../../ezsign/controls/ReceiverEzsigningbutton-renderer.component';
import { EzsignDownloadButtonRendererComponent } from '../../../../ezsign/controls/EzsignDownloadbutton-renderer.component';
import { DocumenthistoryComponent } from '../../../../ezsign/controls/senderdocuments/documenthistory/documenthistory.component';
import { EzsignGridcolpopupComponent } from '../../../../ezsign/controls/shared/ezsign-gridcolpopup/ezsign-gridcolpopup.component';
import { USTaxViewButtonRendererComponent } from './USTaxViewbutton-renderer.component';
import { USTaxDownloadButtonRendererComponent } from './USTaxDownloadbutton-renderer.component';
import { GridColConfigPopupComponent } from '../../history/gridcolpopup/grid-col-config-popup.component';
import { AuditpopupComponent } from '../../history/auditpopup/auditpopup.component';
import { USTaxCase } from '../../../beans/ESignCase';
import { USTaxPrimarySigningRendererComponent } from './USTaxPrimarySigningbutton-renderer.component';
import { USTaxSecondarySigningRendererComponent } from './USTaxSecondarySigningbutton-renderer.component';
import { USTaxPaperSigningRendererComponent } from './USTaxPaperSigningbutton-renderer.component';

@Component({
  selector: 'app-receiverustaxdocs',
  templateUrl: './receiverustaxdocs.component.html',
  styleUrls: ['./receiverustaxdocs.component.scss']
})
export class ReceiverustaxdocsComponent implements OnInit {

  isLinear = false;
  usTaxReceiverDocsgridData: USTaxCase[] = [];
  usTaxAllCases: any = [];
  gridColumnDefs: any;
  ezsignctrl: FormControl = new FormControl();
  search_val: string;
  filtertype: string;
  filterid: string;
  isSearch = false;
  pageHeading: string;
  frameworkComponents: any;
  context: any;
  usTaxReceiverApi: any = {};
  statusBar: any;
  autoHeight: any;
  selectedIndex = 0;
  files: any = [];
  ezSignDoc: File | FileList;
  uploadedFileName: string;
  isUSTaxDataFetched = false;
  showProcessSpinner = false;
  viewType = 'grid';
  private rowHeight;
  private rowClass;
  domLayout: any;
  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private service: EsignserviceService) {
    this.frameworkComponents = {
      viewButtonRender: USTaxViewButtonRendererComponent,
      usTaxPrimarySignButtonRender: USTaxPrimarySigningRendererComponent,
      usTaxSecondarySignButtonRender: USTaxSecondarySigningRendererComponent,
      usTaxPaperSignButtonRender: USTaxPaperSigningRendererComponent,
      downloadButtonRender: USTaxDownloadButtonRendererComponent,
      auditRender: AuditRendererComponent
    }
  }

  ngOnInit() {
    console.log('receiver us tax docs ng on init');
    this.gridColumnDefs = this.configColDef();
    this.loadUSTaxDocuments();
    this.viewType = 'grid';
  }

  loadUSTaxDocuments() {
    this.isUSTaxDataFetched = false;

    this.service.getUSTaxCases().subscribe(resp => {
      this.usTaxAllCases = <any[]>resp;
      console.log(this.usTaxAllCases);
      if (this.usTaxAllCases) {
        this.usTaxReceiverDocsgridData = [];

        this.usTaxAllCases.forEach(caseRec => {
          let caseR = new USTaxCase();
          caseR.caseId = caseRec.caseId;
          caseR.returnName = caseRec.returnName;
          caseR.createdDateTime = caseRec.createdDateTime;
          caseR.caseStatus = caseRec.caseStatus;
          let isPaperForm = false;
          if (caseRec.forms) {
            caseRec.forms.forEach(form => {
              if (form.approvedForEsign === 'N' && !isPaperForm) {
                caseR.isPaperSignForm = true;
                isPaperForm = true;
              }
            });
          }
          if (caseRec.signers) {
            caseRec.signers.forEach(signer => {
              if (signer.type === 'PRIMARY_SIGNER' &&
                signer.receiverId === this.service.auth.getUserID()) {
                caseR.isPrimarySignerForm = true;
              } else if (signer.type !== 'SECONDARY_SIGNER') {
                caseR.isPrimarySignerForm = false;
              }
              if (signer.type === 'SECONDARY_SIGNER' &&
                signer.receiverId === this.service.auth.getUserID()) {
                caseR.isSecondarySignerForm = true;
              } else if (signer.type !== 'PRIMARY_SIGNER') {
                caseR.isSecondarySignerForm = false;
              }
            });
          }
          this.usTaxReceiverDocsgridData.push(caseR);
        });

        console.log(this.usTaxReceiverDocsgridData);
      }
      this.isUSTaxDataFetched = true;
    });
  }


  loadInternalUSTaxDocuments() {
    this.isUSTaxDataFetched = false;

    this.usTaxReceiverApi.api.sizeColumnsToFit();
    this.isUSTaxDataFetched = true;

  }

  configColDef() {
    const res = [
      {
        headerName: 'US Tax Case Id', field: 'caseId', width: 120,
        cellStyle: this.changeRowColor
      },
      { headerName: 'Return Name', field: 'returnName', cellStyle: this.changeRowColor, width: 120 },
      { headerName: 'Status', field: 'caseStatus', cellStyle: this.changeRowColor, width: 100 },
      {
        headerName: 'Primary Sign', width: 120,
        cellRenderer: 'usTaxPrimarySignButtonRender',
        cellRendererParams: {
          onClick: this.startReceiverUSTaxSign.bind(this)
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Secondary Sign', width: 120,
        cellRenderer: 'usTaxSecondarySignButtonRender',
        cellRendererParams: {
          onClick: this.startReceiverUSTaxSign.bind(this)
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Paper Sign', width: 120,
        cellRenderer: 'usTaxPaperSignButtonRender',
        cellRendererParams: {
          onClick: this.startReceiverUSTaxSign.bind(this)
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'View', width: 100,
        cellRenderer: 'viewButtonRender',
        cellRendererParams: {
          onClick: this.viewUSTaxDocument.bind(this),
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Download', width: 80,
        cellRenderer: 'downloadButtonRender',
        cellRendererParams: {
          onClick: this.downloadUSTaxSignedDocument.bind(this)
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'History', width: 80,
        cellRenderer: 'auditRender',
        cellRendererParams: {
          onClick: this.showAuditPopup.bind(this),
          label: 'HISTORY'
        },
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Created date', field: 'createdDateTime',
        cellStyle: this.changeRowColor
      }
    ];
    this.context = { componentParent: this, ustaxfit: true };
    this.rowHeight = 40;
    this.domLayout = 'autoHeight';
    return res;
  }

  showAuditPopup(usTaxCaseId: any): void {
    console.log(usTaxCaseId);
    const dialogRef = this.dialog.open(AuditpopupComponent, {
      width: '900px',
    });
    dialogRef.componentInstance.setCaseInfo(usTaxCaseId);
  }

  viewUSTaxDocument(selectedRow: any) {
    console.log(selectedRow.rowData);
    // this.service.setCacheData("case", selectedRow.rowData);
    // this.viewType = "pagereview";
    const trkID = selectedRow.rowData.ezSignTrackingId;
    const docId = selectedRow.rowData.docId;
    const status: any = selectedRow.rowData.status;
    // this.service.showEzsignPDFDoc(trkID);
    // if (status === "Signed") {
    //   this.service.viewEzsignFinalDoc(trkID);
    // } else {
    //   this.service.previewEzsignDocPreview(trkID, docId);
    // }
  }


  startReceiverUSTaxSign(usTaxCaseRow: any) {
    console.log('start signing US Tax document...');
    console.log(usTaxCaseRow);
    // find the corresponding signing document
    this.usTaxReceiverDocsgridData.forEach(doc => {
      if (doc.caseId === usTaxCaseRow.caseId) {
        console.log(doc);
        this.service.setCacheData("case", doc);
        this.viewType = 'signing';
      }
    });
  }

  switchToGridView() {
    this.viewType = 'grid';
    this.loadInternalUSTaxDocuments();
  }

  resizeAll(gridname) {
    console.log(gridname);
    if (gridname === 'ustax') {
      this.usTaxReceiverApi.columnApi.autoSizeColumns(this.usTaxReceiverApi.columnApi.getAllColumns());
    }
  }
  fitsizeAll(gridname) {
    if (gridname === 'ustax') {
      this.usTaxReceiverApi.api.sizeColumnsToFit();
    }
  }

  gridExport(gridname) {
    if (gridname === 'ustax') {
      this.usTaxReceiverApi.api.exportDataAsCsv();
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
    // params.api.autoSizeAllColumns();
    if (gridname === 'ustax') {
      this.usTaxReceiverApi.api = params.api;
      this.usTaxReceiverApi.columnApi = params.columnApi;
      this.usTaxReceiverApi.cols = [];
      this.usTaxReceiverApi.columnApi.getAllColumns().forEach(cc => {
        this.usTaxReceiverApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
  }

  onGridReady(params, gridname) {
    console.log('onGridReady');
    console.log(params);
    console.log(gridname);
    params.api.sizeColumnsToFit();
    if (gridname === 'ustax') {
      this.usTaxReceiverApi.api = params.api;
      this.usTaxReceiverApi.columnApi = params.columnApi;
      this.usTaxReceiverApi.cols = [];
      this.usTaxReceiverApi.columnApi.getAllColumns().forEach(cc => {
        this.usTaxReceiverApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
  }


  changeRowColor(params) {
    // console.log('params');
    // console.log(params);
    if (params.colDef.headerName === 'View' || params.colDef.headerName === 'Sign') {
      if (params.data.caseStatus === 'ESign') {
        return { 'background-color': '#f8d2d2', 'justify-content': "center" };
      } else if (params.data.caseStatus === 'Inprogress') {
        return { 'background-color': '#f1f1a6', 'justify-content': "center" };
      } else if (params.data.caseStatus === 'Signed') {
        return { 'background-color': '#d2f8d2', 'justify-content': "center" };
      }
    } else {
      if (params.data.caseStatus === 'ESign') {
        return { 'background-color': '#f8d2d2', 'text-align': "left" };
      } else if (params.data.caseStatus === 'Inprogress') {
        return { 'background-color': '#f1f1a6', 'text-align': "left" };
      } else if (params.data.caseStatus === 'Signed') {
        return { 'background-color': '#d2f8d2', 'text-align': "left" };
      }
    }
  }

  downloadUSTaxSignedDocument(ezSignDocRec: any) {
    console.log('downloadUSTaxSignedDocument...');
    console.log(ezSignDocRec);
    // this.service.downloadESignedDoc(ezSignDocRec.ezSignTrackingId,
    //   ezSignDocRec.documentName);
  }

}



