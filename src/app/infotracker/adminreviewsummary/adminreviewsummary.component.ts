import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InfotrackerComponent } from '../infotracker.component';
import { InfoTrackerService } from '../service/infotracker.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { InfoTrackerReviewStatusResource } from '../../esign/beans/ESignCase';
import { InfotrackerViewreportComponent } from '../infotracker-viewreport/infotracker-viewreport.component';
import { AdminreportComponent } from '../adminreport/adminreport.component';
import { ReportforothersummaryComponent } from '../reportforothersummary/reportforothersummary.component';
import { InfotrackerPdfPopupComponent } from '../shared/infotracker-pdf-popup/infotracker-pdf-popup.component';

@Component({
  selector: 'app-adminreviewsummary',
  templateUrl: './adminreviewsummary.component.html',
  styleUrls: ['./adminreviewsummary.component.scss']
})
export class AdminreviewsummaryComponent implements OnInit {
  adminreportComponent: AdminreportComponent;
  infoTrackerReviewStatus: InfoTrackerReviewStatusResource;

  reviewTrackerId: string;
  docId: string;
  reviewedBy: string;
  reviewedDateTime: string;
  status: string;
  addendumCount: number;

  // selfReportSummaryForm: FormGroup = new FormGroup({
  //   reviewTrackerId: new FormControl(),
  //   docId: new FormControl(),
  //   reportDateControl: new FormControl(),
  //   userNameControl: new FormControl(),
  //   messageControl: new FormControl()
  // });

  @ViewChild('focusField') focusField: ElementRef;

  constructor(private service: InfoTrackerService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminreviewsummaryComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log('Admin review summary');
    console.log(this.infoTrackerReviewStatus);
    if (this.infoTrackerReviewStatus) {
      this.reviewTrackerId = this.infoTrackerReviewStatus.reviewTrackerId;
      this.docId = this.infoTrackerReviewStatus.docId;
      this.reviewedBy = this.infoTrackerReviewStatus.reviewedBy;
      this.reviewedDateTime = this.infoTrackerReviewStatus.reviewedDateTime;
      this.status = this.infoTrackerReviewStatus.status;
      this.addendumCount = this.infoTrackerReviewStatus.addendumCount;
    }
  }

  setData(infoTrackerReviewStatus: InfoTrackerReviewStatusResource) {
    this.infoTrackerReviewStatus = infoTrackerReviewStatus;
  }

  viewReviewedDocument() {
    console.log('viewReviewedDocument');
    const dialogRef = this.dialog.open(InfotrackerPdfPopupComponent, { width: '520pt' });
    dialogRef.componentInstance.getInfoTrackerDocumentPDF(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.docId);
  }
  closePopup() {
    this.dialogRef.close();
    this.adminreportComponent.loadReadyToReviewDocuments();
  }

}
