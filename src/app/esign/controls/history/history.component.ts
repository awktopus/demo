import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ESignCase, ESignCasePerson } from '../../beans/ESignCase';
import { EsignserviceService } from '../../service/esignservice.service';
import { EsignuiserviceService } from '../../service/esignuiservice.service';
import { AddnotepopupComponent } from './addnotepopup/addnotepopup.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ClientreminderComponent } from '../casemain/esigncase/clientreminder/clientreminder.component';
import { RouterLinkRendererComponent } from './RouterLinkRenderer.component';
import { ReminderRendererComponent } from './ReminderRenderer.component';
import { NotesRendererComponent } from './NotesRenderer.component';
import { AuditRendererComponent} from './AuditRenderer.component';
import { NewCaseRendererComponent } from './NewCaseRenderer.component';
import { GridColConfigPopupComponent } from './gridcolpopup/grid-col-config-popup.component';
import { AuditpopupComponent } from './auditpopup/auditpopup.component';
import { CasetemplatesComponent } from './casetemplates/casetemplates.component';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, AfterViewInit {
  mycasegridData: any;
  allcasegridData: any;
  reviewcasegridData: any;
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
  mycaseapi: any = {};
  allcaseapi: any = {};
  reviewcaseapi: any = {};
  statusBar: any;
  autoHeight: any;
  selectedIndex = 0;
  constructor(private service: EsignserviceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private uiservice: EsignuiserviceService
  ) { }

  ngAfterViewInit() {
  }

  loadSearchData(type: string, id: string) {
    this.filtertype = type;
    this.filterid = id;
    console.log('filterid,filtertype');
    console.log(this.filterid, this.filtertype);
    console.log(this.route.outlet);
    if (this.filtertype === 'allcases' || (this.filtertype === null)) {
      this.pageHeading = 'All Cases';
      this.service.getAllCases().subscribe(resp => {
        const ccc: ESignCase[] = <ESignCase[]>resp;
        this.setCaseData(ccc);
        this.isSearch = false;
        console.log('load search data');
        console.log(this.cases);
        this.allcasegridData = this.cases;
      });
    } else if (this.filtertype === 'mycases') {
      // this.service.getUserCases(this.service.CPAID, this.filtertype, this.filterid).subscribe(resp => {
      this.pageHeading = 'My Cases';
      this.service.getMyCases().subscribe(resp => {
        const ccc: ESignCase[] = <ESignCase[]>resp;
        this.isSearch = true;
        this.setCaseData(ccc);
        this.isSearch = false;
        this.mycasegridData = this.cases;
      });
    } else if (this.filtertype === 'reviewcases') {
      this.pageHeading = 'My Review Case Worklist';
      this.service.getMyReviewCases().subscribe(resp => {
        const ccc: ESignCase[] = <ESignCase[]>resp;
        this.isSearch = true;
        this.setCaseData(ccc);
        this.isSearch = false;
        this.reviewcasegridData = this.cases;
      });
    }
  }
  ngOnInit() {
    this.gridColumnDefs = this.configColDef();
    this.frameworkComponents = {
      linkRenderer: RouterLinkRendererComponent,
      reminderRenderer: ReminderRendererComponent,
      notesRenderer: NotesRendererComponent,
      auditRender: AuditRendererComponent,
      newCaseRenderer: NewCaseRendererComponent
    };
    this.route.paramMap.subscribe(para => {
      this.filtertype = para.get('type');
      // this.filtertype = 'allcases';
      this.filterid = para.get('id');
      console.log('filterid,filtertype');
      console.log(this.filterid, this.filtertype);
      console.log(this.route.outlet);
      if (this.filtertype === 'allcases' || (this.filtertype === null)) {
        this.pageHeading = 'All Cases';
        this.service.getAllCases().subscribe(resp => {
          const ccc: ESignCase[] = <ESignCase[]>resp;
         // console.log(ccc);
          this.setCaseData(ccc);
          this.isSearch = false;
          this.allcasegridData = this.cases;
        });
      } else if (this.filtertype === 'mycases') {
        // this.service.getUserCases(this.service.CPAID, this.filtertype, this.filterid).subscribe(resp => {
        this.pageHeading = 'My Cases';
        this.service.getMyCases().subscribe(resp => {
          const ccc: ESignCase[] = <ESignCase[]>resp;
          this.isSearch = true;
          this.setCaseData(ccc);
          this.isSearch = false;
          this.mycasegridData = this.cases;
        });
      } else if (this.filtertype === 'reviewcases') {
        this.pageHeading = 'My Worklist';
        this.service.getMyReviewCases().subscribe(resp => {
          const ccc: ESignCase[] = <ESignCase[]>resp;
          this.isSearch = true;
          this.setCaseData(ccc);
          this.isSearch = false;
          this.reviewcasegridData = this.cases;
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

  setCaseData(cases: ESignCase[]) {
    cases.forEach(ele => {
      if (ele.notes) {
        ele.splitNotes = ele.notes.split(';');
      }
    });
    this.cases = cases;
    // this.original_cases = this.copyAry(cases);
    // this.dataSource.sort = this.sort;  // sort need to happend after the data is rendered
    // this.sortCase({'active': 'createdDate', 'direction': 'desc'});
  }



  addNotes(caseId: string, notes: string) {
   // console.log(caseId);
    const dialogRef = this.dialog.open(AddnotepopupComponent, {
      width: '480px',
    });
    dialogRef.componentInstance.historyref = this;
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
    dialogRef.componentInstance.historyref = this;
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
        this.loadSearchData('reviewcases', '');
        break;
      case 1:
        console.log('tab:' + e.index);
        this.loadSearchData('allcases', '');
        break;
      case 2:
      console.log('tab:' + e.index);
      this.showCaseTemplatesPopup();
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
      { headerName: '+', field: 'newCase', cellRenderer: 'newCaseRenderer', width: 50,
      suppressSizeToFit: true },
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
      {
        headerName: 'Reminder', field: 'clientReminderFlag', cellRenderer: 'reminderRenderer',
        minwidth: 100
      },
      { headerName: 'Notes', field: 'notes', cellRenderer: 'notesRenderer' },
      {
        headerName: 'Activity Log', field: 'caseId', cellRenderer: 'auditRender'
      }
    ];
    this.context = { componentParent: this, allcasefit: false, mycasefit: false, reviewcasefit: false };
    return res;
  }

  nameRenderer(params) {
    // return '<a class="dropdown-item waves-light" mdbRippleRadius routerLink="../case/' + params.value + '">'
    // + '<font color="#336699"><b>' + params.value + '</b></font></a>';
    if (!params.value.firstName) {
      params.value.firstName = '';
    }
    if (!params.value.lastName) {
      params.value.lastName = '';
    }
    return params.value.firstName + ' ' + params.value.lastName;
  }
  onFirstDataRendered(params, gridname) {
    console.log(params);
    params.api.sizeColumnsToFit();
    if (gridname === 'mycase') {
      this.mycaseapi.api = params.api;
      this.mycaseapi.columnApi = params.columnApi;
      this.mycaseapi.cols = [];
      this.mycaseapi.columnApi.getAllColumns().forEach(cc => {
        this.mycaseapi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
    if (gridname === 'allcase') {
      this.allcaseapi.api = params.api;
      this.allcaseapi.columnApi = params.columnApi;
      this.allcaseapi.cols = [];
      this.allcaseapi.columnApi.getAllColumns().forEach(cc => {
        this.allcaseapi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
    if (gridname === 'reviewcases') {
      this.reviewcaseapi.api = params.api;
      this.reviewcaseapi.columnApi = params.columnApi;
      this.reviewcaseapi.cols = [];
      this.reviewcaseapi.columnApi.getAllColumns().forEach(cc => {
        this.reviewcaseapi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
  }
  goToCase(caseId) {
    const url = '/main/esign/case/' + caseId;
    this.router.navigateByUrl(url);
  }

  resizeAll(gridname) {
    console.log(gridname);
    if (gridname === 'mycase') {
      this.mycaseapi.columnApi.autoSizeColumns(this.mycaseapi.columnApi.getAllColumns());
    }
    if (gridname === 'allcase') {
      this.allcaseapi.columnApi.autoSizeColumns(this.allcaseapi.columnApi.getAllColumns());
    }
    if (gridname === 'reviewcase') {
      this.reviewcaseapi.columnApi.autoSizeColumns(this.reviewcaseapi.columnApi.getAllColumns());
    }
  }
  fitsizeAll(gridname) {
    if (gridname === 'mycase') {
      this.mycaseapi.api.sizeColumnsToFit();
    }
    if (gridname === 'allcase') {
      this.allcaseapi.api.sizeColumnsToFit();
    }
    if (gridname === 'reviewcase') {
      this.reviewcaseapi.api.sizeColumnsToFit();
    }
  }

  gridExport(gridname) {
    if (gridname === 'mycase') {
      this.mycaseapi.api.exportDataAsCsv();
    }
    if (gridname === 'allcase') {
      this.allcaseapi.api.exportDataAsCsv();
    }
    if (gridname === 'reviewcase') {
      this.reviewcaseapi.api.exportDataAsCsv();
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
    // this.dialog.open(AuditpopupComponent, { width: '900px', data: caseID });
  }

  showCaseTemplatesPopup() {
    console.log('showCaseTemplatesPopup');
    const dialogRef = this.dialog.open(CasetemplatesComponent, {
      width: '1260px'
    });
    dialogRef.componentInstance.historyref = this;
  }
  createNewCaseFromPrevious(caseId: string) {
    console.log('Create new case from previous:' + caseId);
    // this.router.navigateByUrl('main/esign/case/newcaseID');
    const url = '/main/esign/case/' + caseId + '-' + 'newcase';
    this.router.navigateByUrl(url);
  }
}
