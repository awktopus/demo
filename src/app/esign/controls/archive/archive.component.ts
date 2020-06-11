import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ESignCase, ESignCasePerson } from '../../beans/ESignCase';
import { EsignserviceService } from '../../service/esignservice.service';
import { EsignuiserviceService } from '../../service/esignuiservice.service';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ClientreminderComponent } from '../casemain/esigncase/clientreminder/clientreminder.component';
import { AddnotepopupComponent } from '../history/addnotepopup/addnotepopup.component';
import { RouterLinkRendererComponent } from '../history/RouterLinkRenderer.component';
import { ReminderRendererComponent } from '../history/ReminderRenderer.component';
import { NotesRendererComponent } from '../history/NotesRenderer.component';
import { AuditRendererComponent } from '../history/AuditRenderer.component';
import { NewCaseRendererComponent } from '../history/NewCaseRenderer.component';
import { GridColConfigPopupComponent } from '../history/gridcolpopup/grid-col-config-popup.component';
import { AuditpopupComponent } from '../history/auditpopup/auditpopup.component';
import { CasetemplatesComponent } from '../history/casetemplates/casetemplates.component';
import { MoreOptionsRenderer2Component } from './MoreOptionsRenderer2.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit, AfterViewInit {

  archivedcasesgridData: any;
  archivedcasesapi: any = {};
  archivedcasesapi2: any = {};
  gridColumnDefs: any;
  casectrl: FormControl = new FormControl();
  search_val: string;
  caseusers: ESignCasePerson[];
  selectuser: string;
  cases: ESignCase[];
  original_cases: ESignCase[];
  filtertype: string;
  filterid: string;
  isSearch = false;
  clientReminder: any;
  pageHeading: string;
  frameworkComponents: any;
  context: any;
  statusBar: any;
  autoHeight: any;
  selectedIndex = 0;
  overlayNoRowsTemplate: any;
  isArchiveCasesLoaded = false;
  constructor(private service: EsignserviceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private uiservice: EsignuiserviceService
  ) { }

  ngAfterViewInit() {
  }

  ngOnInit() {
    console.log('Inside archive component');
    this.gridColumnDefs = this.configColDef();
    this.frameworkComponents = {
      linkRenderer: RouterLinkRendererComponent,
      reminderRenderer: ReminderRendererComponent,
      notesRenderer: NotesRendererComponent,
      auditRender: AuditRendererComponent,
      newCaseRenderer: NewCaseRendererComponent,
      moreOptionsRenderer: MoreOptionsRenderer2Component
    };
    this.route.paramMap.subscribe(para => {
      this.filtertype = para.get('type');
      this.filterid = para.get('id');
      console.log('filterid,filtertype');
      console.log(this.filterid, this.filtertype);
      console.log(this.route.outlet);
      if (this.filtertype === 'archivedcases' || (this.filtertype === null)) {
        this.pageHeading = 'Archived Cases';
        this.service.getArchivedTaxCases().subscribe(resp => {
          console.log('get archived cases');
          console.log(resp);
          const ccc: ESignCase[] = <ESignCase[]>resp;
          if (ccc.length !== 0) {
            this.setCaseData(ccc);
            this.isSearch = false;
            this.archivedcasesgridData = this.cases;
            this.isArchiveCasesLoaded = true;
          } else {
            this.isArchiveCasesLoaded = true;
            this.overlayNoRowsTemplate =
              "<span style=\"padding: 10px;font-size: 15px;\">" +
              "There are currently no documents in this archive folder. <br> <br>" +
              "To archive a document, click on the More button on cases history and select Archive option." +
              "</span>";
            //  this.onBtShowNoRows();
          }
        });
      }
    });

    this.casectrl.valueChanges.subscribe(val => {
      //  console.log('search case');
      if (val && typeof val !== 'object') {
        if (this.search_val === val.trim()) {
          return;
        } else {
          this.uiservice.searchCaseUsers(val).subscribe(resp => {
            this.caseusers = <ESignCasePerson[]>resp;
          });
        }
      }
    });
  }

  onBtShowNoRows() {
    console.log('onBtShowNoRows');
    this.archivedcasesapi2.showNoRowsOverlay();
  }
  loadSearchData(type: string, id: string) {
    this.filtertype = type;
    this.filterid = id;
    console.log('filterid,filtertype');
    console.log(this.filterid, this.filtertype);
    console.log(this.route.outlet);
    if (this.filtertype === 'archivedcases' || (this.filtertype === null)) {
      this.pageHeading = 'Archived Cases';
      this.service.getArchivedTaxCases().subscribe(resp => {
        const ccc: ESignCase[] = <ESignCase[]>resp;
        console.log('get archived cases');
        console.log(resp);
        this.setCaseData(ccc);
        this.isSearch = false;
        console.log('load search data');
        console.log(this.cases);
        this.archivedcasesgridData = this.cases;
        if (ccc.length !== 0) {
        } else {
          this.overlayNoRowsTemplate =
            "<span style=\"padding: 10px;font-size: 15px;\">" +
            "There are currently no documents in this archive folder. <br><br> " +
            "To archive a document, click on the More button on cases history and select Archive option." +
            "</span>";
        }
      });
    }
  }

  setCaseData(cases: ESignCase[]) {
    cases.forEach(ele => {
      if (ele.notes) {
        ele.splitNotes = ele.notes.split(';');
      }
    });
    this.cases = cases;
  }



  addNotes(caseId: string, notes: string) {
    const dialogRef = this.dialog.open(AddnotepopupComponent, {
      width: '480px',
    });
    dialogRef.componentInstance.archiveComponentRef = this;
    dialogRef.componentInstance.setCaseInfo(caseId, notes);
  }

  updateNotes(caseId: string, notes: string) {
    this.cases.forEach(cc => {
      if (cc.caseId === caseId) {
        cc.notes = notes;
        if (cc.notes) {
          cc.splitNotes = cc.notes.split(';');
        }
      }
    });

    this.original_cases.forEach(cc => {
      if (cc.caseId === caseId) {
        cc.notes = notes;
        if (cc.notes) {
          cc.splitNotes = cc.notes.split(';');
        }
      }
    });
  }



  createClientReminder(caseId: string): void {
    // console.log('create client remider:' + caseId);
    const dialogRef = this.dialog.open(ClientreminderComponent, {
      width: '980px',
    });
    dialogRef.componentInstance.archiveComponentRef = this;
    this.service.getClientScheduleReminder(caseId).subscribe(resp => {
      const res_c = <any>resp;
      //   console.log(res_c);
      dialogRef.componentInstance.setClientReminderInfo(res_c);
    });
  }

  updateClientReminderFlag(caseId: string, flag: string) {
    this.cases.forEach(cc => {
      if (cc.caseId === caseId) {
        cc.clientReminderFlag = flag;
      }
    });
  }

  public changeTab(e) {
    console.log(e);
    switch (e.index) {
      case 0:
        console.log('tab:' + e.index);
        this.loadSearchData('archivedcases', '');
        break;
    }
  }
  configColDef() {
    const res = [
      {
        headerName: 'Case #', field: 'caseId',
        cellRenderer: 'linkRenderer', width: 120,
        suppressSizeToFit: true
      },
      { headerName: 'Status', field: 'status', cellStyle: { color: 'blue' } },
      { headerName: 'Category', field: 'type' },
      { headerName: 'Return Name', field: 'returnName' },
      { headerName: 'Tax Return ID Number', field: 'taxReturnIdNo' },
      {
        headerName: ' Primary Signer', field: 'primarySigner',
        valueGetter: (params) => {
          if (!params.data.primarySigner.firstName) {
            params.data.primarySigner.firstName = '';
          }
          if (!params.data.primarySigner.lastName) {
            params.data.primarySigner.lastName = '';
          }
          return params.data.primarySigner.firstName + ' ' + params.data.primarySigner.lastName;
        }
      },
      {
        headerName: ' Secondary Signer', field: 'secondarySigner',
        valueGetter: (params) => {
          if (!params.data.secondarySigner.firstName) {
            params.data.secondarySigner.firstName = '';
          }
          if (!params.data.secondarySigner.lastName) {
            params.data.secondarySigner.lastName = '';
          }
          return params.data.secondarySigner.firstName + ' ' + params.data.secondarySigner.lastName;
        }
      },
      {
        headerName: 'Delivered By', field: 'cpa',
        valueGetter: (params) => {
          if (!params.data.cpa.firstName) {
            params.data.cpa.firstName = '';
          }
          if (!params.data.cpa.lastName) {
            params.data.cpa.lastName = '';
          }
          return params.data.cpa.firstName + ' ' + params.data.cpa.lastName;
        }
      },
      { headerName: 'Created', field: 'createdDate' },
      { headerName: 'Notes', field: 'notes', cellRenderer: 'notesRenderer' },
      {
        headerName: 'Activity Log', field: 'caseId', cellRenderer: 'auditRender'
      },
      {
        headerName: '', field: 'moreOptions', cellRenderer: 'moreOptionsRenderer',
        minwidth: 100
      }
    ];

    this.context = { componentParent: this, allcasefit: false };
    return res;
  }

  nameRenderer(params) {
    if (!params.value.firstName) {
      params.value.firstName = '';
    }
    if (!params.value.lastName) {
      params.value.lastName = '';
    }
    return params.value.firstName + ' ' + params.value.lastName;
  }

  onGridReady(params) {
    console.log('on grid ready');
    console.log(this.archivedcasesgridData);
    this.archivedcasesapi.api = params.api;
    this.archivedcasesapi2 = params.api;
    this.archivedcasesapi.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    if (typeof this.archivedcasesgridData === 'undefined') {
      console.log(this.archivedcasesgridData);
      this.onBtShowNoRows();
    } else if (this.archivedcasesgridData.length === 0) {
      console.log(this.archivedcasesgridData);
      this.onBtShowNoRows();
    }
  }

  onFirstDataRendered(params, gridname) {
    console.log('on first data rendered');
    console.log(params);
    params.api.sizeColumnsToFit();
    if (gridname === 'archivedcases') {
      this.archivedcasesapi.api = params.api;
      this.archivedcasesapi2 = params.api;
      this.archivedcasesapi.columnApi = params.columnApi;
      this.archivedcasesapi.cols = [];
      this.archivedcasesapi.columnApi.getAllColumns().forEach(cc => {
        this.archivedcasesapi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
  }

  goToCase(caseId) {
    const url = '/main/esign/case/' + caseId;
    this.router.navigateByUrl(url);
  }

  resizeAll(gridname) {
    console.log(gridname);
    if (gridname === 'archivedcases') {
      this.archivedcasesapi.columnApi.autoSizeColumns(this.archivedcasesapi.columnApi.getAllColumns());
    }
  }

  fitsizeAll(gridname) {
    if (gridname === 'archivedcases') {
      this.archivedcasesapi.api.sizeColumnsToFit();
    }
  }

  gridExport(gridname) {
    if (gridname === 'archivedcases') {
      this.archivedcasesapi.api.exportDataAsCsv();
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

  showAuditPopup(caseID) {
    const dialogRef = this.dialog.open(AuditpopupComponent, {
      width: '900px',
    });
    dialogRef.componentInstance.setCaseInfo(caseID);
  }


  createNewCaseFromPrevious(caseId: string) {
    console.log('archive: Create new case from previous:' + caseId);
    const url = '/main/esign/case/' + caseId + '-' + 'copycase';
    this.router.navigateByUrl(url);
  }


  updateGridCaseFilingStatus(caseId: string, status: string) {
    this.loadSearchData('archivedcases', '');
  }

  performMoreOperationAction(actionName: string, caseRecord: any) {
    console.log('singleCaseUnArchive');
    console.log(actionName);
    console.log(caseRecord);
    if (actionName === 'unarchive') {
      this.singleCaseUnArchive(caseRecord);
    }

    if (actionName === "delete") {
      this.singleCaseDelete(caseRecord);
    }
  }

  singleCaseUnArchive(caseRecord: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px', height: '150px',
      data: "Do you confirm the unarchival of this tax case?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.service.unarchiveSingleCase(caseRecord.caseId).subscribe(resp => {
          const res_c = <any>resp;
          console.log(res_c);
          this.loadSearchData('archivedcases', '');
        });
      }
    });
  }

  singleCaseDelete(caseRecord: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px', height: '150px',
      data: "Do you confirm the deletion of this tax case?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.service.deleteSingleCase(caseRecord.caseId).subscribe(resp => {
          const res_c = <any>resp;
          console.log(res_c);
          this.loadSearchData('archivedcases', '');
        });
      }
    });
  }
}
