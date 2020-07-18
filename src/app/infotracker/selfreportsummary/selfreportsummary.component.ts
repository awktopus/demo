import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InfotrackerComponent } from '../infotracker.component';
import { InfoTrackerService } from '../service/infotracker.service';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { FormTemplateResource, PageQuestionResource, InfoTrackerAnswerResource, InfoTrackerResource } from '../../esign/beans/ESignCase';
import { InfotrackerViewreportComponent } from '../infotracker-viewreport/infotracker-viewreport.component';
import { AdminreportComponent } from '../adminreport/adminreport.component';
import { ReportforothersummaryComponent } from '../reportforothersummary/reportforothersummary.component';


@Component({
  selector: 'app-selfreportsummary',
  templateUrl: './selfreportsummary.component.html',
  styleUrls: ['./selfreportsummary.component.scss']
})
export class SelfreportsummaryComponent implements OnInit {
  infoTrackerRef: InfotrackerComponent;
  iTUserViewRptRef: InfotrackerViewreportComponent;
  iTReportForOtherViewRptRef: ReportforothersummaryComponent;
  iTAdminViewRptRef: AdminreportComponent;
  isDataFetched = false;
  infoTrackerId: string;
  formInfo: InfoTrackerResource;
  questions:  InfoTrackerAnswerResource[];
  userName: string;
  formName: string;
  reportDate: string;
  message: string;
  recordStatus: string;
  reportStatus: string;
  selfReportSummaryForm: FormGroup = new FormGroup({
     formNameControl: new FormControl(),
     trackerIdControl: new FormControl(),
     reportDateControl: new FormControl(),
     userNameControl: new FormControl(),
     messageControl: new FormControl()
   });

  @ViewChild('focusField') focusField: ElementRef;

  constructor(private service: InfoTrackerService,
    public dialogRef: MatDialogRef<SelfreportsummaryComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log('Self report summary init');
    if (!this.infoTrackerId) {
      this.isDataFetched = true;
    } else {
    this.service.GetFormInfo(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.infoTrackerId).subscribe(resp => {
        this.formInfo = <InfoTrackerResource>resp;
        console.log('GetFormTemplateConfig response');
        console.log(this.formInfo);
        if (this.formInfo) {
          this.formName = this.formInfo.templateName;
          this.infoTrackerId = this.formInfo.trackerId;
          this.reportDate = this.formInfo.reportedDate;
          this.userName = this.formInfo.firstName + " " + this.formInfo.lastName;
          this.message = this.formInfo.finalResult;
          this.recordStatus = this.formInfo.recordStatus;
        if (this.formInfo.answers) {
          this.questions = this.formInfo.answers;
        }
      }
        this.isDataFetched = true;
      });
    }
  }

  setData(infoTrackerId: string, reportStatus: string) {
    this.infoTrackerId = infoTrackerId;
    this.reportStatus = reportStatus;
  }

  cancelSelfReport() {
    this.dialogRef.close();
  }

}
