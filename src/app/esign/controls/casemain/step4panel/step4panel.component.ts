import { Component, OnInit } from '@angular/core';
import { ESignCase, ESignDoc, ESignCPA } from '../../../beans/ESignCase';
import { EsignserviceService } from '../../../service/esignservice.service';
import { EsignuiserviceService } from '../../../service/esignuiservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RejectreasonpopupComponent } from './rejectreasonpopup/rejectreasonpopup.component';
import { ClientreminderComponent } from '../../casemain/esigncase/clientreminder/clientreminder.component';
import { MatButtonModule } from '@angular/material/button';
import { EmailpopupComponent } from '../../casemain/step2panel/emailpopup/emailpopup.component'
@Component({
  selector: 'app-step4panel',
  templateUrl: './step4panel.component.html',
  styleUrls: ['./step4panel.component.scss']
})
export class Step4panelComponent implements OnInit {
  mycase: ESignCase;
  sendToClientOption: any;
  constructor(public dialog: MatDialog,
    private service: EsignserviceService, private uiservice: EsignuiserviceService) { }
  ngOnInit() {
    this.service.cur_case.subscribe(c => {
      this.mycase = c;
    });
    this.sendToClientOption = '0';
  }

  sendToClient() {
    if (this.sendToClientOption === '0') {
      this.mycase.rejectReason = '';
      this.service.sendToESign(this.mycase.caseId);
    } else if (this.sendToClientOption === '1') {
      this.openEmailPop();
    }
  }

  showRejectReasonPopup() {
    const dialogRef = this.dialog.open(RejectreasonpopupComponent, {
      width: '380px',
    });
    dialogRef.componentInstance.step4panelComp = this;
    dialogRef.componentInstance.setRejectReason(this.mycase.caseId, this.mycase.rejectReason);
    // dialogRef.afterClosed().subscribe(result => {
    // console.log('The dialog was closed');
    // });
  }
  updateRejectReason(caseId: string, rejectReason: string, caseStatus: string) {
    console.log('case id:' + caseId + ';reject reason:' + rejectReason + ';casestatus: + caseStatus');
    this.mycase.caseId = caseId;
    this.mycase.rejectReason = rejectReason;
    if (this.mycase.rejectReason) {
      this.mycase.splitRejectReason = this.mycase.rejectReason.split(';');
    }
    this.mycase.status = caseStatus;
  }
  createClientReminder(caseId: string): void {
    console.log('create client remider:' + caseId);
    const dialogRef = this.dialog.open(ClientreminderComponent, {
      width: '980px',
    });
    dialogRef.componentInstance.step4panelComp = this;
    this.service.getClientScheduleReminder(caseId).subscribe(resp => {
      const res_c = <any>resp;
      console.log(res_c);
      dialogRef.componentInstance.setClientReminderInfo(res_c);
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openEmailPop() {
    /*
    this.service.getCPAs().subscribe(res => {
      const cpas: ESignCPA[] = <ESignCPA[]> res;
      cpas.forEach(cpa => {
        if ( cpa.cpaId === this.mycase.cpaId) {
          this.mycase.cpa = cpa;
        }
      });
    });
    */
    const dialogRef = this.dialog.open(EmailpopupComponent, {
      width: '900px'
    });
    dialogRef.componentInstance.setCase(this.mycase);
  }
}
