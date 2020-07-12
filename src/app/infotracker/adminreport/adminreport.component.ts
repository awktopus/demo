import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoTrackerService } from '../service/infotracker.service';
import { InfoTrackUserStatusReport } from '../../esign/beans/ESignCase';
import { InfotrackerComponent } from '../infotracker.component';
import { InfotrackerConfirmDialogComponent } from '../shared/infotracker-confirm-dialog/infotracker-confirm-dialog.component';
import { InfotrackerGridcolpopupComponent } from '../shared/infotracker-gridcolpopup/infotracker-gridcolpopup.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ViewReportRendererComponent } from '../shared/ViewReportRenderer.component';
import { SelfreportsummaryComponent } from '../selfreportsummary/selfreportsummary.component';

@Component({
  selector: 'app-adminreport',
  templateUrl: './adminreport.component.html',
  styleUrls: ['./adminreport.component.scss']
})
export class AdminreportComponent implements OnInit {

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
  isInfoTrackerDataFetched = false;
  downloadAs: any;
  rowClassRules: any;
  templateId: any;
  reportedDate: any;
  reportedDates: string[];
  tooltipShowDelay;
  startDate: any;
  endDate: any;
  domLayout: any;

  adminViewReportForm: FormGroup = new FormGroup({
  startDateFormControl: new FormControl((new Date()).toISOString(), Validators.required),
    endDateFormControl: new FormControl((new Date()).toISOString(), Validators.required)
  });
  constructor(private service: InfoTrackerService, public dialog: MatDialog,
    private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
   console.log('Admin report initialization...');
    this.gridColumnDefs = this.configColDef();
    this.frameworkComponents = {
      viewHealthCheckSummaryRenderer: ViewReportRendererComponent
    };
    let tStartDate: Date = new Date(this.adminViewReportForm.controls['startDateFormControl'].value);
    this.startDate = tStartDate.getMonth() + 1 + '-' + tStartDate.getDate() + '-' + tStartDate.getFullYear();
    console.log('report start date:' + this.startDate);

    let tEndDate: Date = new Date(this.adminViewReportForm.controls['endDateFormControl'].value);
    this.endDate = tEndDate.getMonth() + 1 + '-' + tEndDate.getDate() + '-' + tEndDate.getFullYear();
    console.log('report end date:' + this.endDate);

    this.service.GetAllUserStatus(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      this.startDate, "ALL", this.endDate).subscribe(uReport => {
        if (uReport) {
          console.log('Get all user status');
          console.log(uReport);
          this.infoTrackerGridData = <InfoTrackUserStatusReport[]>uReport;
          this.isInfoTrackerDataFetched = true;
        }
      });
  }


   loadInfoTrackUserReport() {
    let tStartDate: Date = new Date(this.adminViewReportForm.controls['startDateFormControl'].value);
    this.startDate = tStartDate.getMonth() + 1 + '-' + tStartDate.getDate() + '-' + tStartDate.getFullYear();
    console.log('report start date:' + this.startDate);

    let tEndDate: Date = new Date(this.adminViewReportForm.controls['endDateFormControl'].value);
    this.endDate = tEndDate.getMonth() + 1 + '-' + tEndDate.getDate() + '-' + tEndDate.getFullYear();
    console.log('report end date:' + this.endDate);

    this.service.GetAllUserStatus(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      this.startDate, "EMPLOYEE", this.endDate).subscribe(uReport => {
        if (uReport) {
          console.log('Get all user status');
          console.log(uReport);
          this.infoTrackerGridData = <InfoTrackUserStatusReport[]>uReport;
          this.isInfoTrackerDataFetched = true;
        }
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

  setData(templateId: number) {
    this.templateId = templateId;
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
    dialogRef.componentInstance.iTAdminViewRptRef = this;
    dialogRef.componentInstance.setData(trackerId);
  }
  public changeTab(e) {
    console.log(e);
    switch (e.index) {
      case 0:
        console.log('tab:' + e.index);
        break;
      case 1:
        console.log('tab:' + e.index);
        break;
      case 2:
      console.log('tab:' + e.index);
      break;
    }
  }
}
