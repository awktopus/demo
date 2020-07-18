import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InfoTrackerService } from '../../service/infotracker.service';
import { AdminreportComponent } from '../../adminreport/adminreport.component';
@Component({
  selector: 'app-infotrackeragreement',
  templateUrl: './infotrackeragreement.component.html',
  styleUrls: ['./infotrackeragreement.component.scss']
})
export class InfotrackeragreementComponent implements OnInit {
auditTrailId: number;
  constructor( public dialogRef: MatDialogRef<InfotrackeragreementComponent>,
    private service: InfoTrackerService,
    @Inject(MAT_DIALOG_DATA) public message: string) {
      dialogRef.disableClose = true;
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAgreeClick() {
    const agreementRes = {
      isAgreementAccepted: "Y"
    };
    console.log(agreementRes);
    this.service.PostAuditAgreement(this.service.auth.getOrgUnitID(),
    this.service.auth.getUserID(), agreementRes).subscribe(resp => {
      this.auditTrailId = resp.auditTrailId;
      console.log('auditTrailId');
      console.log(this.auditTrailId);
      this.dialogRef.close({ event: 'close', data: this.auditTrailId });
    })
  }
}
