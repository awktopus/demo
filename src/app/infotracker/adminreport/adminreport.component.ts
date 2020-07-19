import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoTrackerService } from '../service/infotracker.service';
import {
  InfoTrackUserStatusReport, InfoTrackerReviewFormResource,
  InfoTrackerReviewHistoryResource, InfoTrackerReviewFormSubmitResource, ReviewTracker,
  InfoTrackerReviewReportResource, ReviewReportResource
} from '../../esign/beans/ESignCase';
import { InfotrackerComponent } from '../infotracker.component';
import { InfotrackerConfirmDialogComponent } from '../shared/infotracker-confirm-dialog/infotracker-confirm-dialog.component';
import { InfotrackerGridcolpopupComponent } from '../shared/infotracker-gridcolpopup/infotracker-gridcolpopup.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ViewReportRendererComponent } from '../shared/ViewReportRenderer.component';
import { SelfreportsummaryComponent } from '../selfreportsummary/selfreportsummary.component';
import { InfotrackeragreementComponent } from '../shared/infotrackeragreement/infotrackeragreement.component';
import { InfotrackerEsignatureComponent } from '../infotracker-esignature/infotracker-esignature.component';
import { ViewDocumentRendererComponent } from '../shared/ViewDocumentRenderer.component';
import { InfotrackerPdfPopupComponent } from '../shared/infotracker-pdf-popup/infotracker-pdf-popup.component';

@Component({
  selector: 'app-adminreport',
  templateUrl: './adminreport.component.html',
  styleUrls: ['./adminreport.component.scss']
})
export class AdminreportComponent implements OnInit, AfterViewInit {

  infoTrackerRef: InfotrackerComponent;

  infoTrackerGridData: InfoTrackerReviewFormResource[];
  iTReadyForReviewGridData: InfoTrackerReviewFormResource[];
  iTUnknownGridData: InfoTrackerReviewFormResource[];
  reviewReportResource: InfoTrackerReviewReportResource[];
  iTReviewedGridData: ReviewReportResource[];
  reviewSubmitRes: InfoTrackerReviewFormSubmitResource;
  reviewTrackers: ReviewTracker[];

  iTReadyForReviewGridApi: any = {};
  iTReadyForReviewGridColumnApi: any = {};

  iTUnknownGridApi: any = {};
  iTUnknownGridColumnApi: any = {};

  iTReviewedGridApi: any = {};
  iTReviewedGridColumnApi: any = {};


  readyForReviewGridColumnDefs: any;
  unknownGridColumnDefs: any;
  reviewedGridColumnDefs: any;

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
  startDate: any;
  endDate: any;
  domLayout: any;
  rowSelection: any;
  readyToReviewCount: number;
  unknownCount: number;
  reviewedCount: number;
  curReviewStatus: InfoTrackerReviewHistoryResource;
  stDate = (new Date()).toISOString();
  selectedIndex = 0;
  showReviewSpinner = false;
  showAddendumSpinner = false;
  reviewStatus: string;
  addendumCount = 0;
  readyToReviewForm: FormGroup = new FormGroup({
    readyToReviewStartDateControl: new FormControl({ value: this.stDate, disabled: true }, Validators.required),
    // readyToReviewEndDateControl: new FormControl({ value: this.stDate, disabled: true }, Validators.required)
    // startDateFormControl: new FormControl((new Date()).toISOString(), Validators.required),
    // endDateFormControl: new FormControl((new Date()).toISOString(), Validators.required)
  });

  unknownForm: FormGroup = new FormGroup({
    unknownStartDateControl: new FormControl({ value: this.stDate, disabled: true }, Validators.required)
  });

  reviewedForm: FormGroup = new FormGroup({
    reviewedStartDateControl: new FormControl({ value: this.stDate, disabled: true }, Validators.required),
    reviewedEndDateControl: new FormControl({ value: this.stDate, disabled: true }, Validators.required)
    // startDateFormControl: new FormControl((new Date()).toISOString(), Validators.required),
    // endDateFormControl: new FormControl((new Date()).toISOString(), Validators.required)
  });

  constructor(private service: InfoTrackerService, public dialog: MatDialog,
    private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    console.log('Admin report initialization...');
    this.readyForReviewGridColumnDefs = this.readyForReviewGridConfigColDef();
    this.unknownGridColumnDefs = this.unknownGridConfigColDef();
    this.reviewedGridColumnDefs = this.reviewedGridConfigColDef();

    this.frameworkComponents = {
      viewHealthCheckSummaryRenderer: ViewReportRendererComponent,
      viewReviewDocumentRenderer: ViewDocumentRendererComponent
    };

    let tStartDate: Date = new Date(this.readyToReviewForm.controls['readyToReviewStartDateControl'].value);
    this.startDate = tStartDate.getMonth() + 1 + '-' + tStartDate.getDate() + '-' + tStartDate.getFullYear();
    console.log('report start date:' + this.startDate);

    // let tEndDate: Date = new Date(this.readyToReviewForm.controls['readyToReviewEndDateControl'].value);
    // this.endDate = tEndDate.getMonth() + 1 + '-' + tEndDate.getDate() + '-' + tEndDate.getFullYear();
    // console.log('report end date:' + this.endDate);

    this.service.GetInfoTrackReviewHistory(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      this.startDate).subscribe(curStatus => {
        this.curReviewStatus = <InfoTrackerReviewHistoryResource>curStatus;
        console.log('Current review status');
        console.log(this.curReviewStatus);
        if (this.curReviewStatus) {
          this.reviewStatus = "addendum";
        } else {
          this.reviewStatus = "review";
        }
        if (this.curReviewStatus && this.curReviewStatus.ammendments) {
          this.addendumCount = this.curReviewStatus.ammendments.length;
        }
      });

    this.service.GetAdminReviewForms(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      this.startDate).subscribe(uReport => {
        if (uReport) {
          console.log('Get admin review forms');
          console.log(uReport);
          this.infoTrackerGridData = <InfoTrackerReviewFormResource[]>uReport;
          if (this.infoTrackerGridData) {
            this.iTReadyForReviewGridData = [];
            this.iTUnknownGridData = [];

            this.infoTrackerGridData.forEach(cc => {
              if ((cc.recordStatus === 'at-risk' || cc.recordStatus === 'cleared') &&
                cc.isReviewed !== 'Y') {
                this.iTReadyForReviewGridData.push(cc);
              }
              if (cc.recordStatus === 'unknown' && cc.isReviewed !== 'Y') {
                this.iTUnknownGridData.push(cc);
              }
            });
            console.log('ready to review forms');
            console.log(this.iTReadyForReviewGridData);
            console.log('unknown forms');
            console.log(this.iTUnknownGridData);
            this.iTReadyForReviewGridApi.api.sizeColumnsToFit();
            this.iTUnknownGridApi.api.sizeColumnsToFit();
            this.readyToReviewCount = this.iTReadyForReviewGridData.length;
            this.unknownCount = this.iTUnknownGridData.length;
          }
          this.isInfoTrackerDataFetched = true;
        }
      });

  }

  ngAfterViewInit() {
  }

  public loadReadyToReviewDocuments() {
    let tStartDate: Date = new Date(this.readyToReviewForm.controls['readyToReviewStartDateControl'].value);
    this.startDate = tStartDate.getMonth() + 1 + '-' + tStartDate.getDate() + '-' + tStartDate.getFullYear();
    console.log('report start date:' + this.startDate);

    // let tEndDate: Date = new Date(this.readyToReviewForm.controls['endDateFormControl'].value);
    // this.endDate = tEndDate.getMonth() + 1 + '-' + tEndDate.getDate() + '-' + tEndDate.getFullYear();
    // console.log('report end date:' + this.endDate);

    this.service.GetInfoTrackReviewHistory(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      this.startDate).subscribe(curStatus => {
        this.curReviewStatus = <InfoTrackerReviewHistoryResource>curStatus;
        console.log('Current review status');
        console.log(this.curReviewStatus);
        if (this.curReviewStatus) {
          this.reviewStatus = "addendum";
        } else {
          this.reviewStatus = "review";
        }
        if (this.curReviewStatus && this.curReviewStatus.ammendments) {
          this.addendumCount = this.curReviewStatus.ammendments.length;
        }
      });

    this.service.GetAdminReviewForms(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      this.startDate).subscribe(uReport => {
        if (uReport) {
          console.log('GetAdminReviewForms');
          console.log(uReport);
          this.infoTrackerGridData = <InfoTrackerReviewFormResource[]>uReport;
          if (this.infoTrackerGridData) {
            this.iTReadyForReviewGridData = [];
            this.iTUnknownGridData = [];
            this.infoTrackerGridData.forEach(cc => {
              if ((cc.recordStatus === 'at-risk' || cc.recordStatus === 'cleared') &&
                cc.isReviewed !== 'Y') {
                this.iTReadyForReviewGridData.push(cc);
              }
              if (cc.recordStatus === 'unknown' && cc.isReviewed !== 'Y') {
                this.iTUnknownGridData.push(cc);
              }
            });
            console.log('ready to review forms');
            console.log(this.iTReadyForReviewGridData);
            console.log('unknown forms');
            console.log(this.iTUnknownGridData);
            this.iTReadyForReviewGridApi.api.sizeColumnsToFit();
            this.iTUnknownGridApi.api.sizeColumnsToFit();
            this.readyToReviewCount = this.iTReadyForReviewGridData.length;
            this.unknownCount = this.iTUnknownGridData.length;
          }
        }
      });
  }

  public loadUnknownDocuments() {
    let tStartDate: Date = new Date(this.unknownForm.controls['unknownStartDateControl'].value);
    this.startDate = tStartDate.getMonth() + 1 + '-' + tStartDate.getDate() + '-' + tStartDate.getFullYear();
    console.log('report start date:' + this.startDate);
    this.iTUnknownGridApi.api.sizeColumnsToFit();
    this.service.GetAdminReviewForms(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      this.startDate).subscribe(uReport => {
        if (uReport) {
          console.log('GetAdminReviewForms');
          console.log(uReport);
          this.infoTrackerGridData = <InfoTrackerReviewFormResource[]>uReport;
          if (this.infoTrackerGridData) {
            this.iTReadyForReviewGridData = [];
            this.iTUnknownGridData = [];
            this.infoTrackerGridData.forEach(cc => {
              if ((cc.recordStatus === 'at-risk' || cc.recordStatus === 'cleared') &&
                cc.isReviewed !== 'Y') {
                this.iTReadyForReviewGridData.push(cc);
              }
              if (cc.recordStatus === 'unknown' && cc.isReviewed !== 'Y') {
                this.iTUnknownGridData.push(cc);
              }
            });
            console.log('ready to review forms');
            console.log(this.iTReadyForReviewGridData);
            console.log('unknown forms');
            console.log(this.iTUnknownGridData);
           // this.iTReadyForReviewGridApi.api.sizeColumnsToFit();
           // this.readyToReviewCount = this.iTReadyForReviewGridData.length;
            this.unknownCount = this.iTUnknownGridData.length;
          }
        }
      });
  }

  loadReviewedDocuments() {
    this.iTReviewedGridApi.api.sizeColumnsToFit();
    this.service.GetReviewStatusReports(this.service.auth.getOrgUnitID(), this.service.auth.getUserID()).subscribe(rReport => {
      console.log('Get already reviewed status reports');
      console.log(rReport);
      if (rReport) {
        this.reviewReportResource = <InfoTrackerReviewReportResource[]>rReport;
        if (this.reviewReportResource) {
          this.iTReviewedGridData = [];
          this.reviewReportResource.forEach(cc => {
            cc.reviewReports.forEach(rr => {
              let rrRes = new ReviewReportResource();
              rrRes.reviewTrackerId = rr.reviewTrackerId;
              rrRes.docId = rr.docId;
              rrRes.addendumCount = rr.addendumCount;
              rrRes.auditTrailId = rr.auditTrailId;
              rrRes.docId = rr.docId;
              rrRes.reviewedBy = rr.reviewedBy;
              rrRes.reviewedDateTime = rr.reviewedDateTime;
              rrRes.reviewTrackerId = rr.reviewTrackerId;
              rrRes.status = rr.status;
              this.iTReviewedGridData.push(rrRes);
            });
          });
        }
       } else {
        this.iTReviewedGridData = [];
      }
    });
  }
  readyForReviewGridConfigColDef() {
    const res = [
      {
        headerName: 'User Name', field: 'userName', width: 50,
        cellStyle: this.changeRowColor, checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
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
    this.rowSelection = 'multiple';
    this.context = { componentParent: this };
    return res;
  }


  unknownGridConfigColDef() {
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

  reviewedGridConfigColDef() {
    const res = [
      {
        headerName: 'Review Tracker Id', field: 'reviewTrackerId', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Reviewed Date', field: 'reviewedDateTime', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Reviewed By', field: 'reviewedBy', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Status', field: 'status', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'Addendum Count', field: 'addendumCount', width: 50,
        cellStyle: this.changeRowColor
      },
      {
        headerName: 'View Review Documents', field: 'viewReviewDocs', width: 50,
        cellRenderer: 'viewReviewDocumentRenderer', cellStyle: this.changeRowColor
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

  downloadITReadyForReviewCSVReport() {
    let params = {
      fileName: 'InfoTrackerReadyForReviewCSV',
      columnKeys: ['reportedDate', 'formName', 'userName', 'recordStatus',
        'lastCriticalReportedDate', 'location', 'finalResult', 'trackerId']
    };
    this.iTReadyForReviewGridApi.exportDataAsCsv(params);
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
      this.downloadITReadyForReviewCSVReport();
    }
  }
  // getReportedDateInfo() {
  //   console.log('date selection change');
  //   this.loadInfoTrackUserReport();
  // }
  resizeAll(tabName: string) {
    console.log(tabName);
    switch (tabName) {
      case 'ReadyForReview':
        this.iTReadyForReviewGridApi.columnApi.autoSizeColumns(this.iTReadyForReviewGridApi.columnApi.getAllColumns());
        break;
      case 'Unknown':
        this.iTUnknownGridApi.columnApi.autoSizeColumns(this.iTUnknownGridApi.columnApi.getAllColumns());
        break;
      case 'Reviewed':
        this.iTReviewedGridApi.columnApi.autoSizeColumns(this.iTReviewedGridApi.columnApi.getAllColumns());
        break;
    }
  }

  fitsizeAll(tabName: string) {
    switch (tabName) {
      case 'ReadyForReview':
        this.iTReadyForReviewGridApi.api.sizeColumnsToFit(); break;
      case 'Unknown':
        this.iTUnknownGridApi.api.sizeColumnsToFit(); break;
      case 'Reviewed':
        this.iTReviewedGridApi.api.sizeColumnsToFit(); break;
    }
  }

  openColumnConfig(api) {
    console.log('open column config');
    this.dialog.open(InfotrackerGridcolpopupComponent, { width: '200', data: api });
  }

  onGridReady(params, gridname) {
    console.log('onGridReady');
    console.log(params);
    console.log(gridname);
    params.api.sizeColumnsToFit();
    if (gridname === 'ReadyForReview') {
      console.log('ready for review');
      this.iTReadyForReviewGridApi.api = params.api;
      this.iTReadyForReviewGridApi.columnApi = params.columnApi;
      this.iTReadyForReviewGridApi.cols = [];
      this.iTReadyForReviewGridApi.columnApi.getAllColumns().forEach(cc => {
        this.iTReadyForReviewGridApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
    if (gridname === 'Unknown') {
      this.iTUnknownGridApi.api = params.api;
      this.iTUnknownGridApi.columnApi = params.columnApi;
      this.iTUnknownGridApi.cols = [];
      this.iTUnknownGridApi.columnApi.getAllColumns().forEach(cc => {
        this.iTUnknownGridApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
    if (gridname === 'Reviewed') {
      this.iTReviewedGridApi.api = params.api;
      this.iTReviewedGridApi.columnApi = params.columnApi;
      this.iTReviewedGridApi.cols = [];
      this.iTReviewedGridApi.columnApi.getAllColumns().forEach(cc => {
        this.iTReviewedGridApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
  }

  onFirstDataRendered(params, gridname) {
    console.log('onfirst data rendered');
    console.log(params);
    params.api.sizeColumnsToFit();
    if (gridname === 'ReadyForReview') {
      console.log('ready for review rendered');
      this.iTReadyForReviewGridApi.api = params.api;
      this.iTReadyForReviewGridApi.columnApi = params.columnApi;
      this.iTReadyForReviewGridApi.cols = [];
      this.iTReadyForReviewGridApi.columnApi.getAllColumns().forEach(cc => {
        this.iTReadyForReviewGridApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
    if (gridname === 'Unknown') {
      this.iTUnknownGridApi.api = params.api;
      this.iTUnknownGridApi.columnApi = params.columnApi;
      this.iTUnknownGridApi.cols = [];
      this.iTUnknownGridApi.columnApi.getAllColumns().forEach(cc => {
        this.iTUnknownGridApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
    }
    if (gridname === 'Reviewed') {
      this.iTReviewedGridApi.api = params.api;
      this.iTReviewedGridApi.columnApi = params.columnApi;
      this.iTReviewedGridApi.cols = [];
      this.iTReviewedGridApi.columnApi.getAllColumns().forEach(cc => {
        this.iTReviewedGridApi.cols.push({ colId: cc.colId, checked: true, headerName: cc.colDef.headerName });
      });
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

  viewHealthCheckSummary(trackerId: string) {
    console.log('viewHealthCheckSummary');
    console.log(trackerId);
    const dialogRef = this.dialog.open(SelfreportsummaryComponent, {
      width: '700px', height: '900px'
    });
    dialogRef.componentInstance.iTAdminViewRptRef = this;
    dialogRef.componentInstance.setData(trackerId, 'selfreported');
  }
  public changeTab(e) {
    console.log(e);
    switch (e.index) {
      case 0:
        console.log('tab:' + e.index);
        this.loadReadyToReviewDocuments();
        break;
      case 1:
        console.log('tab:' + e.index);
        this.loadUnknownDocuments();
        break;
      case 2:
        console.log('tab:' + e.index);
        this.loadReviewedDocuments();
        break;
    }
  }


  openAgreementDialogforReview() {
    console.log('openAgreementDialogforReview');
    let selectedTrackers: any;
    console.log(this.iTReadyForReviewGridApi);
    selectedTrackers = this.iTReadyForReviewGridApi.api.getSelectedNodes();
    console.log(selectedTrackers);
    if (selectedTrackers && selectedTrackers.length > 0) {
      this.reviewSubmitRes = new InfoTrackerReviewFormSubmitResource();
      if (this.reviewStatus === 'review') {
        this.reviewSubmitRes.orgUnitName = this.service.auth.getOrgUnitName();
        this.reviewSubmitRes.orgUnitId = this.service.auth.getOrgUnitID();
        this.reviewSubmitRes.reportedDate = this.startDate;
        this.reviewSubmitRes.reviewedBy = this.service.auth.getUserFirstName() + " " + this.service.auth.getUserLastName();
        this.reviewSubmitRes.actionType = this.reviewStatus;
        this.reviewTrackers = [];
        selectedTrackers.forEach(cc => {
          let reviewTracker = new ReviewTracker();
          reviewTracker.recordStatus = cc.data.recordStatus;
          reviewTracker.formName = cc.data.formName;
          reviewTracker.templateId = cc.data.templateId;
          reviewTracker.userName = cc.data.userName;
          reviewTracker.trackerId = cc.data.trackerId;
          reviewTracker.displayPriority = cc.data.displayPriority;
          this.reviewTrackers.push(reviewTracker);
        });
        this.reviewSubmitRes.reviewTrackers = this.reviewTrackers;
        console.log('review submit resource');
        console.log(this.reviewSubmitRes);
        const dialogRef = this.dialog.open(InfotrackeragreementComponent, {
          width: '600px', height: '350px',
          data: "By confirming, I agree that my electronic signatures on the following document are my own" +
            " and are legally valid as if I had signed the document with ink on paper, in accordance with " +
            "the Electronic Signatures in Global and National Commerce Act (E-SIGN) of 2000 and the Uniform" +
            "Electronic Transactions Act(UETA). I have read and agree to the above."
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('dialog box result');
          console.log(result);
          if (result) {
            console.log('Yes clicked');
            console.log(result);
            this.reviewSubmitRes.auditTrailId = result.data;
            const dialogRef2 = this.dialog.open(InfotrackerEsignatureComponent, {
              width: '700px', height: '900px'
            });
            dialogRef2.componentInstance.adminReportRef = this;
            dialogRef2.componentInstance.setData(this.reviewSubmitRes);
          }
        });
      } else if (this.reviewStatus === 'addendum') {
        this.reviewSubmitRes.orgUnitName = this.service.auth.getOrgUnitName();
        this.reviewSubmitRes.orgUnitId = this.service.auth.getOrgUnitID();
        this.reviewSubmitRes.reportedDate = this.startDate;
        this.reviewSubmitRes.reviewedBy = this.service.auth.getUserFirstName() + " " + this.service.auth.getUserLastName();
        this.reviewSubmitRes.actionType = this.reviewStatus;
        this.reviewTrackers = [];
        selectedTrackers.forEach(cc => {
          let reviewTracker = new ReviewTracker();
          reviewTracker.recordStatus = cc.data.recordStatus;
          reviewTracker.formName = cc.data.formName;
          reviewTracker.templateId = cc.data.templateId;
          reviewTracker.userName = cc.data.userName;
          reviewTracker.trackerId = cc.data.trackerId;
          reviewTracker.displayPriority = cc.data.displayPriority;
          this.reviewTrackers.push(reviewTracker);
        });
        this.reviewSubmitRes.reviewTrackers = this.reviewTrackers;
        console.log('review addendum resource');
        console.log(this.reviewSubmitRes);
        const dialogRef2 = this.dialog.open(InfotrackerEsignatureComponent, {
          width: '700px', height: '900px'
        });
        dialogRef2.componentInstance.adminReportRef = this;
        dialogRef2.componentInstance.setData(this.reviewSubmitRes);
      }
    } else {
      this.snackBar.open("Please select review forms for submission", '', { duration: 3000 });
      return;
      // pop up message to the user to select review records
    }
  }

  viewDocument(docId: string) {
    console.log('viewDocument');
    const dialogRef = this.dialog.open(InfotrackerPdfPopupComponent, { width: '520pt' });
    dialogRef.componentInstance.getInfoTrackerDocumentPDF(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), docId);
  }

  viewReviewedDocument() {
    console.log('viewReviewedDocument');
    const dialogRef = this.dialog.open(InfotrackerPdfPopupComponent, { width: '520pt' });
    dialogRef.componentInstance.getInfoTrackerDocumentPDF(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.curReviewStatus.docId);
  }
}
