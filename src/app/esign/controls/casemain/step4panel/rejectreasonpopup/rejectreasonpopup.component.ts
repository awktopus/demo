import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EsignserviceService } from '../../../../service/esignservice.service';
import { ESignCase, ESignDoc, ESignCPA } from '../../../../beans/ESignCase';
import { Step4panelComponent } from '../step4panel.component';

@Component({
  selector: 'app-rejectreasonpopup',
  templateUrl: './rejectreasonpopup.component.html',
  styleUrls: ['./rejectreasonpopup.component.scss']
})
export class RejectreasonpopupComponent implements OnInit {
  mycaseId: string;
  rejectReason: string;
  newRejectReason: string;
  splitLines: string[];
  step4panelComp: Step4panelComponent;

  constructor( private service: EsignserviceService,
    public dialogRef: MatDialogRef<RejectreasonpopupComponent>) { 
      dialogRef.disableClose = true;
    }

  ngOnInit() {
    }

  setRejectReason(caseId: string, reason: string) {
    this.mycaseId = caseId;
    this.rejectReason = reason;
    if (this.rejectReason) {
      this.splitLines = this.rejectReason.split(';');
    }
  }
  closeme(): void {
    this.dialogRef.close();
  }

  reject() {
    console.log('Case id in reject reason popup:' + this.mycaseId);
    console.log('----->', this.newRejectReason);
    this.service.rejectCase(this.mycaseId, this.newRejectReason).subscribe(resp => {
      const rr = <{caseId: string, rejectReason: string, status: string}> resp;

      this.step4panelComp.updateRejectReason(rr.caseId, rr.rejectReason, rr.status);
    });
     this.dialogRef.close();
    }
}
