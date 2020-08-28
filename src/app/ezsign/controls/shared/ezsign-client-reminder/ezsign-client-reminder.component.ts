import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { SenderdocumentsComponent } from '../../senderdocuments/senderdocuments.component';
import { EzSignClientReminder, EZSignDocSigner } from '../../../../esign/beans/ESignCase';
import { EzsigndataService } from '../../../service/ezsigndata.service';
@Component({
  selector: 'app-ezsign-client-reminder',
  templateUrl: './ezsign-client-reminder.component.html',
  styleUrls: ['./ezsign-client-reminder.component.scss']
})
export class EzsignClientReminderComponent implements OnInit {
  viewControl: any;
  ezSignTrackingId: string;
  status: string;
  primarySigner: EZSignDocSigner;
  secondarySigner: EZSignDocSigner;
  recurrenceInDays: any;
  subject: string;
  body: string;
  lastReminderDateTime: string;
  sendReminderNow: any;
  senderDocRef: SenderdocumentsComponent;
  clientReminder: EzSignClientReminder;
  priSigCheck: any = true;
  secSigCheck: any = true;
  constructor(private service: EzsigndataService,
    public dialogRef: MatDialogRef<EzsignClientReminderComponent>) {
    dialogRef.disableClose = true;
    this.viewControl = {
      view: true,
      edit: false,
      createNew: false
    }
  }

  ngOnInit() { }

  setClientReminderInfo(clientReminder: EzSignClientReminder): void {
    if (clientReminder) {
      this.ezSignTrackingId = clientReminder.ezSignTrackingId;
      this.status = clientReminder.status;
      this.primarySigner = null;
      this.secondarySigner = null;
      this.lastReminderDateTime = clientReminder.lastReminderDateTime;
      this.subject = clientReminder.subject;
      this.body = clientReminder.body;
      this.recurrenceInDays = clientReminder.recurrenceInDays.toString();
    }
  }
  saveSchedule() {
    let newClientReminder: EzSignClientReminder;
    newClientReminder = new EzSignClientReminder();
    newClientReminder.ezSignTrackingId = this.ezSignTrackingId;
    const clients: EZSignDocSigner[] = new Array(2);
    if (this.priSigCheck === true) {
      clients.push(this.primarySigner);
    }
    if (this.secSigCheck === true) {
      clients.push(this.secondarySigner);
    }
    newClientReminder.signers = clients;
    newClientReminder.recurrenceInDays = this.recurrenceInDays;
    newClientReminder.subject = this.subject;
    newClientReminder.body = this.body;
    if (this.sendReminderNow === true) {
      newClientReminder.sendReminderNow = 'Y';
    } else {
      newClientReminder.sendReminderNow = 'N';
    }
    console.log('save schedule:' + newClientReminder);
    this.service.saveScheduleClientReminder(newClientReminder).subscribe(resp => {
      console.log(resp);
      // if (this.step4panelComp) {
      //   this.step4panelComp.mycase.clientReminderFlag = 'Y';
      // }
      // if (this.historyref) {
      //   this.historyref.updateClientReminderFlag(this.mycaseId, 'Y');
      // }
      this.dialogRef.close();
    });
  }

  deleteSchedule(caseId: string) {
    console.log('delete schedule:' + caseId);
    this.service.deleteScheduleClientReminder(caseId).subscribe(resp => {
      console.log(resp);
      if (this.senderDocRef) {
        this.senderDocRef.updateClientReminderFlag(this.ezSignTrackingId, 'N');
      }
      this.dialogRef.close();
    });
  }

  closeme() {
    this.dialogRef.close();
  }
}
