import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoTrackerService } from '../service/infotracker.service';
import { InfoTrackUserStatusReport } from '../../esign/beans/ESignCase';
import { InfotrackerComponent } from '../infotracker.component';
import { InfotrackerConfirmDialogComponent } from '../shared/infotracker-confirm-dialog/infotracker-confirm-dialog.component';
import { InfotrackerGridcolpopupComponent } from '../shared/infotracker-gridcolpopup/infotracker-gridcolpopup.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-infotracker-viewreport',
  templateUrl: './infotracker-viewreport.component.html',
  styleUrls: ['./infotracker-viewreport.component.scss']
})
export class InfotrackerViewreportComponent implements OnInit {

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
  stDate = (new Date()).toISOString();
  adminViewReportForm: FormGroup = new FormGroup({
    startDateFormControl: new FormControl({value: this.stDate, disabled: true}, Validators.required),
    endDateFormControl: new FormControl({value: this.stDate, disabled: true}, Validators.required)
  });
  constructor(private service: InfoTrackerService, public dialog: MatDialog,
    private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    // console.log('Info tracker viewreport initialization...');
    // this.route.paramMap.subscribe(para => {
    //   this.templateId = para.get('templateId');
    // });
    // console.log('templateId: ' + this.templateId);
    this.gridColumnDefs = this.configColDef();
    this.service.GetReportedDates(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.templateId).subscribe(resp2 => {
        this.reportedDates = resp2;
        console.log(this.reportedDates);
        if (resp2 && this.reportedDates.length > 0) {
          this.reportedDate = this.reportedDates[0];
          console.log('default fiscal year:' + this.reportedDate);
          // let rDate: Date = new Date(this.reportedDate);
          // console.log('date:' + rDate.getDate());
          // console.log('month:' + rDate.getMonth());
          // console.log('year:' + rDate.getFullYear());
          // let month = Number(rDate.getMonth()) + 1;
          // let tDate = rDate.getFullYear() + '-' + month + '-' + rDate.getDate();
          // // console.log('formatted start date:');
          // console.log(tDate);
          // let tDate2 = rDate.getFullYear() + '-' + month + '-' + rDate.getDate();
          // console.log('formatted end date:');
          // console.log(tDate2);

          let date1: Date = new Date();
          let month = Number(date1.getMonth()) + 1;
          let sDate1 = month + "-"  +  date1.getDate() + '-' + date1.getFullYear();
          let sDate2 = month + "-"  +  date1.getDate() + '-' + date1.getFullYear();
          console.log(sDate1);
          console.log(sDate2);
          this.service.GetAllUserStatus(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
          sDate1, "ALL",  sDate2).subscribe(uReport => {
              if (uReport) {
                console.log('Get all user status');
                console.log(uReport);
                this.infoTrackerGridData = <InfoTrackUserStatusReport[]>uReport;
                //  if (this.infoTrackerGridData) {
                //     this.gridColumnDefs = this.generateColumns(this.infoTrackerGridData);
                //   }
                this.isInfoTrackerDataFetched = true;
              }
            });
        }
      });
  }

  // generateColumns(data: any[]) {
  //   let columnDefinitions = [];

  //   data.map(object => {
  //     // console.log('object');
  //     // console.log(object);
  //     Object
  //       .keys(object)
  //       .map(key => {
  //         // console.log('key');
  //         // console.log(key);
  //         let headerName;
  //         let width;
  //         let cellStyle;
  //         if (key === 'reportedDate') {
  //           headerName = 'Reported Date';
  //           width = 100;
  //           cellStyle = this.changeRowColor;
  //           let mappedColumn = {
  //             headerName: headerName,
  //             field: key,
  //             width: width,
  //             cellStyle: cellStyle
  //           }
  //           columnDefinitions.push(mappedColumn);
  //         } else {
  //         let mappedColumn = {
  //           headerName: key.toUpperCase(),
  //           field: key,
  //         }
  //         columnDefinitions.push(mappedColumn);
  //       }
  //       })
  //   })
  //   columnDefinitions = columnDefinitions.filter((column, index, self) =>
  //     index === self.findIndex((colAtIndex) => (
  //       colAtIndex.field === column.field
  //     ))
  //   )
  //   return columnDefinitions;
  // }

  loadInfoTrackUserReport() {
    let rDate: Date = new Date(this.reportedDate);
    console.log('date:' + rDate.getDate());
    console.log('month:' + rDate.getMonth());
    console.log('year:' + rDate.getFullYear());
    let month = Number(rDate.getMonth()) + 1;
    let tDate = rDate.getFullYear() + '-' + month + '-' + rDate.getDate();
    console.log('formatted date:');
    console.log(tDate);
    let date1: Date = new Date();
          let sDate1 = date1.getDate() + '-' + date1.getMonth() + '-' + date1.getFullYear();
          let sDate2 = date1.getDate() + '-' + date1.getMonth() + '-' + date1.getFullYear();
          this.service.GetAllUserStatus(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      "ALL", sDate1, sDate2).subscribe(uReport => {
        if (uReport) {
          console.log('Get all user status');
          console.log(uReport);
          this.infoTrackerGridData = <InfoTrackUserStatusReport[]>uReport;
        }
      });
  }


  configColDef() {
    const res = [
      {
        headerName: 'Reported Date', field: 'reportedDate', width: 100,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Form Name', field: 'formName', width: 200,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'User Name', field: 'userName', width: 200, cellStyle: this.changeRowColor,
      },
      {
        headerName: 'Status', field: 'recordStatus', width: 200,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Question1', field: 'question1', width: 200,
        cellStyle: this.changeRowColor, hide: true
      },
      {
        headerName: 'Answer1', field: 'answer1', width: 200,
        cellStyle: this.changeRowColor, hide: true
      },
      {
        headerName: 'Question2', field: 'question2', width: 200,
        cellStyle: this.changeRowColor, hide: true
      },
      {
        headerName: 'Answer2', field: 'answer2', width: 200,
        cellStyle: this.changeRowColor, hide: true
      },
      {
        headerName: 'Question3', field: 'question3', width: 200,
        cellStyle: this.changeRowColor, hide: true
      },
      {
        headerName: 'Answer3', field: 'answer3', width: 200,
        cellStyle: this.changeRowColor, hide: true
      },
      {
        headerName: 'Question4', field: 'question4', width: 200,
        cellStyle: this.changeRowColor, hide: true
      },
      {
        headerName: 'Answer4', field: 'answer4', width: 200,
        cellStyle: this.changeRowColor, hide: true
      },
      {
        headerName: 'Last Critical Report Date', field: 'lastCriticalReportedDate', width: 200,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Location', field: 'location', width: 200,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Final Result', field: 'finalResult',
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'TrackerId', field: 'trackerId', width: 100,
        cellStyle: this.changeRowColor
      },
    ]
    this.context = { componentParent: this };
    return res;
  }

  changeRowColor(params) {
    console.log('params');
    console.log(params);
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
}
