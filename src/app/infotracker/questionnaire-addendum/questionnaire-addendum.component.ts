import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InfoTrackerService } from '../service/infotracker.service';
import { SelfreportComponent } from '../selfreport/selfreport.component';
import { SelfreportsummaryComponent } from '../selfreportsummary/selfreportsummary.component';
import { InfoTrackerResource } from '../../esign/beans/ESignCase';
import { ReportforothersComponent } from '../reportforothers/reportforothers.component';

@Component({
  selector: 'app-questionnaire-addendum',
  templateUrl: './questionnaire-addendum.component.html',
  styleUrls: ['./questionnaire-addendum.component.scss']
})
export class QuestionnaireAddendumComponent implements OnInit {

  trackerId: string;
  reviewedBy: string;
  notes: string;
  newnotes: string;
  splitAddendumLines: string[];
  selfReportSummaryRef: SelfreportsummaryComponent;
  reportForOthersRef: ReportforothersComponent
  sourceComponentName: string;
  constructor(private service: InfoTrackerService,
    public dialogRef: MatDialogRef<QuestionnaireAddendumComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  setData(trackerId: string, reviewedBy: string, sourceComponentName: string) {
    this.trackerId = trackerId;
    this.reviewedBy = reviewedBy;
    this.sourceComponentName = sourceComponentName;
  }

  questionnaireAddendum() {
    console.log('questionnaireAddendum', this.newnotes);
    const addendumNotes = {
      reviewedBy: this.reviewedBy,
      notes: this.newnotes
    };
    this.service.QuestionnaireAddendum(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.trackerId, addendumNotes).subscribe(resp => {
        const rr = <InfoTrackerResource>resp;
        if (this.sourceComponentName === 'selfreport') {
        if (this.selfReportSummaryRef) {
          this.selfReportSummaryRef.questionnaireAddendum(rr.notes);
        }
        } else if (this.sourceComponentName === 'reportforothers') {
          if (this.reportForOthersRef) {
            this.reportForOthersRef.questionnaireAddendum(rr.notes);
          }
        }
          this.closePopup();
      });
  }

  closePopup() {
    this.dialogRef.close();
  }

}
