import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoTrackerService } from '../service/infotracker.service';
import { InfoTrackUserStatusReport, FormTemplateResource } from '../../esign/beans/ESignCase';
import { InfotrackerComponent } from '../infotracker.component';
import { InfotrackerConfirmDialogComponent } from '../shared/infotracker-confirm-dialog/infotracker-confirm-dialog.component';
import { InfotrackerGridcolpopupComponent } from '../shared/infotracker-gridcolpopup/infotracker-gridcolpopup.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ViewReportRendererComponent } from '../shared/ViewReportRenderer.component';
import { SelfreportsummaryComponent } from '../selfreportsummary/selfreportsummary.component';
@Component({
  selector: 'app-reportforothersummary',
  templateUrl: './reportforothersummary.component.html',
  styleUrls: ['./reportforothersummary.component.scss']
})
export class ReportforothersummaryComponent implements OnInit {
  infoTrackerRef: InfotrackerComponent;
  infoTrackerGridData: InfoTrackUserStatusReport[];
  infoTrackerGridApi: any = {};
  infoTrackerGridColumnApi: any = {};
  gridColumnDefs: any;
  context: any;
  frameworkComponents: any;
  autoGroupColumnDef: any;
  statusBar: any;
  defaultColDef: any;
  autoHeight: any;
  gridActionInprogress = false;
  showDownloadSpinner = false;
  showRefreshSpinner = false;
  isInfoTrackerDataFetched = false;
  downloadAs: any;
  rowClassRules: any;
  templateId: any;
  reportedDate: any;
  reportedDates: string[];
  tooltipShowDelay;
  stDate = (new Date()).toISOString();
  formTemplate: FormTemplateResource;
  formName: string;
  startDate: any;
  endDate: any;
  domLayout: any;
  userRole: string;
  userType: string;
  userViewReportForm: FormGroup = new FormGroup({
    // startDateFormControl: new FormControl({value: this.stDate, disabled: true}, Validators.required),
    // endDateFormControl: new FormControl({value: this.stDate, disabled: true}, Validators.required)
    startDateFormControl: new FormControl((new Date()).toISOString(), Validators.required),
    endDateFormControl: new FormControl((new Date()).toISOString(), Validators.required)
  });
  constructor(private service: InfoTrackerService, public dialog: MatDialog,
    private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    console.log('Info tracker report for other initialization...');
    console.log('actual role');
    this.userRole = this.service.auth.getUserRole();
    console.log(this.userRole);
    if (typeof this.userRole === "undefined" || this.userRole === null) {
     // this.userRole = 'ADMIN';
    } else {
      this.userRole = this.userRole.toUpperCase();
    }
    console.log('converted role');
    console.log(this.userRole);
    if (this.userRole === 'ADMIN' || this.userRole === 'OWNER') {
      this.userType = "ALL";
    } else {
      this.userType = "SELF";
    }
    // console.log('form Name:' + this.formName);
    this.route.paramMap.subscribe(para => {
      this.templateId = para.get('templateId');
    });
    console.log('templateId: ' + this.templateId);
    this.gridColumnDefs = this.configColDef();
    this.frameworkComponents = {
      viewHealthCheckSummaryRenderer: ViewReportRendererComponent
    };
    this.service.GetFormTemplateConfig(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.templateId).subscribe(resp => {
        this.formTemplate = <FormTemplateResource>resp;
        console.log('GetFormTemplateConfig response');
        console.log(this.formTemplate);
        if (this.formTemplate) {
          this.formName = this.formTemplate.formName;
        }
      });

    // this.service.GetReportedDates(this.service.auth.getOrgUnitID(),
    //   this.service.auth.getUserID(), this.templateId).subscribe(resp2 => {
    //     this.reportedDates = resp2;
    //     console.log(this.reportedDates);
    //     if (resp2 && this.reportedDates.length > 0) {
    // this.reportedDate = this.reportedDates[0];
    // console.log('default date:' + this.reportedDate);
    // let date1: Date = new Date();
    // let month = Number(date1.getMonth()) + 1;
    // let sDate1 = month + "-"  +  date1.getDate() + '-' + date1.getFullYear();
    // let sDate2 = month + "-"  +  date1.getDate() + '-' + date1.getFullYear();
    // console.log(sDate1);
    // console.log(sDate2);
    let tStartDate: Date = new Date(this.userViewReportForm.controls['startDateFormControl'].value);
    this.startDate = tStartDate.getMonth() + 1 + '-' + tStartDate.getDate() + '-' + tStartDate.getFullYear();
    console.log('report start date:' + this.startDate);

    let tEndDate: Date = new Date(this.userViewReportForm.controls['endDateFormControl'].value);
    this.endDate = tEndDate.getMonth() + 1 + '-' + tEndDate.getDate() + '-' + tEndDate.getFullYear();
    console.log('report end date:' + this.endDate);

    this.service.GetAllUserStatus(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      this.startDate, this.userType, this.endDate).subscribe(uReport => {
        if (uReport) {
          console.log('Get all user status');
          console.log(uReport);
          this.infoTrackerGridData = <InfoTrackUserStatusReport[]>uReport;
          this.isInfoTrackerDataFetched = true;
        }
      });
    // }
    // });
  }

  loadInfoTrackUserReport() {
    this.showRefreshSpinner = true;
    let tStartDate: Date = new Date(this.userViewReportForm.controls['startDateFormControl'].value);
    this.startDate = tStartDate.getMonth() + 1 + '-' + tStartDate.getDate() + '-' + tStartDate.getFullYear();
    console.log('report start date:' + this.startDate);

    let tEndDate: Date = new Date(this.userViewReportForm.controls['endDateFormControl'].value);
    this.endDate = tEndDate.getMonth() + 1 + '-' + tEndDate.getDate() + '-' + tEndDate.getFullYear();
    console.log('report end date:' + this.endDate);

    this.service.GetAllUserStatus(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      this.startDate, this.userType, this.endDate).subscribe(uReport => {
        if (uReport) {
          console.log('Get all user status');
          console.log(uReport);
          this.infoTrackerGridData = <InfoTrackUserStatusReport[]>uReport;
        }
        this.showRefreshSpinner = false;
      });
  }


  configColDef() {
    const res = [
      {
        headerName: 'User Name', field: 'userName', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Reported Date', field: 'reportedDate', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Status', field: 'recordStatus', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Last Critical Report Date', field: 'lastCriticalReportedDate', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'TrackerId', field: 'trackerId', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'View Summary', field: 'viewSummary', width: 50,
        cellRenderer: 'viewHealthCheckSummaryRenderer', cellStyle: this.changeRowColor
      }
    ]
    this.domLayout = 'autoHeight';
    this.context = { componentParent: this };
    return res;
  }

  changeRowColor(params) {
    if (params.data.recordStatus === 'at-risk') {
      return { 'background-color': '#DE2A2A', 'text-align': "left" };
    } else if (params.data.recordStatus === 'unknown') {
      return { 'background-color': '#D0D0D0', 'text-align': "left" };
    } else if (params.data.recordStatus === 'cleared') {
      return { 'background-color': '#97FBB6', 'text-align': "left" };
    } else if (params.data.recordStatus === 'need assistance') {
      return { 'background-color': '#FBE197', 'text-align': "left" };
    }
  }

  downloadInfoTrackCSVReport() {
    let params = {
      fileName: 'InfoTrackerCSV',
      columnKeys: ['reportedDate', 'formName', 'userName', 'recordStatus',
        'lastCriticalReportedDate', 'location', 'finalResult', 'trackerId']
    };
    this.infoTrackerGridApi.exportDataAsCsv(params);
  }

  navigateInfoTracker() {
    const url = 'main/infotracker/home';
    this.router.navigateByUrl(url);
  }
  onDownloadAsSelection() {
    console.log('onDownloadAsSelection');
    console.log(this.downloadAs);
  }

  downloadReport() {
    console.log('download report');
    if (this.downloadAs === 'CSV') {
      this.downloadInfoTrackCSVReport();
    }
  }
  getReportedDateInfo() {
    console.log('date selection change');
    this.loadInfoTrackUserReport();
  }
  resizeAll() {
    this.infoTrackerGridApi.columnApi.autoSizeColumns(this.infoTrackerGridApi.columnApi.getAllColumns());
  }

  fitsizeAll() {
    this.infoTrackerGridApi.api.sizeColumnsToFit();
  }

  openColumnConfig(api) {
    console.log('open column config');
    this.dialog.open(InfotrackerGridcolpopupComponent, { width: '200', data: api });
  }

  onGridReady(params) {
    this.infoTrackerGridApi = params.api;
    this.infoTrackerGridApi.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.infoTrackerGridApi.cols = [];
    this.infoTrackerGridApi.columnApi.getAllColumns().forEach(cc => {
      this.infoTrackerGridApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
    });
  }
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
    this.infoTrackerGridApi.api = params.api;
    this.infoTrackerGridApi.columnApi = params.columnApi;
    this.infoTrackerGridApi.cols = [];
    this.infoTrackerGridApi.columnApi.getAllColumns().forEach(cc => {
      this.infoTrackerGridApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
    });
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

  viewHealthCheckSummary(trackerId: string) {
    console.log('viewHealthCheckSummary');
    console.log(trackerId);
    const dialogRef = this.dialog.open(SelfreportsummaryComponent, {
      width: '700px', height: '900px'
    });
    dialogRef.componentInstance.iTReportForOtherViewRptRef = this;
    dialogRef.componentInstance.setData(trackerId, 'selfreported');
  }

}
