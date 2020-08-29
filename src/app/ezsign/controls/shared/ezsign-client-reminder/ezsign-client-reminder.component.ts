import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { SenderdocumentsComponent } from '../../senderdocuments/senderdocuments.component';
import { EzSignClientReminder, EZSignDocSigner, Signer } from '../../../../esign/beans/ESignCase';
import { EzsigndataService } from '../../../service/ezsigndata.service';
import { InvitesignersComponent } from '../../invitesigners/invitesigners.component';
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
  inviteSignersRef: InvitesignersComponent
  clientReminder: EzSignClientReminder;
  priSigCheck: any = true;
  secSigCheck: any = true;
  eZSigners: Signer[];
  constructor(private service: EzsigndataService,
    public dialogRef: MatDialogRef<EzsignClientReminderComponent>,
    private snackBar: MatSnackBar) {
    dialogRef.disableClose = true;
    this.viewControl = {
      view: true,
      edit: false,
      createNew: false
    }
  }

  ngOnInit() {
  }

  setClientReminderInfo(clientReminder: EzSignClientReminder): void {
    console.log('set client reminder info');
    console.log(clientReminder);
    if (clientReminder) {
      this.ezSignTrackingId = clientReminder.ezSignTrackingId;
      this.service.getEZSignSigners(this.ezSignTrackingId).subscribe(respSigners => {
        this.eZSigners = respSigners;
        this.eZSigners.forEach(cc => {
          if (cc.isEmailReminderScheduled === 'Y') {
            cc.isChecked = true;
          }
        });
        console.log(this.eZSigners);
      });
      this.status = clientReminder.status;
      this.lastReminderDateTime = clientReminder.lastReminderDateTime;
      this.subject = clientReminder.subject;
      this.body = clientReminder.body;
      this.recurrenceInDays = clientReminder.recurrenceInDays.toString();
    }
  }

  saveSchedule() {
    console.log('save schedule');
    let newClientReminder: EzSignClientReminder;
    newClientReminder = new EzSignClientReminder();
    newClientReminder.ezSignTrackingId = this.ezSignTrackingId;
    const tSigners: Signer[] = [];
    let isReceiversNotSelected = true;
    this.eZSigners.forEach(cc => {
      console.log(cc);
      if (cc.isChecked) {
        cc.isEmailReminderScheduled = "Y";
        tSigners.push(cc);
      } else {
        tSigners.push(cc);
        cc.isEmailReminderScheduled = "N";
      }
    });

    if (tSigners && tSigners.length !== 0) {
      tSigners.forEach(cc => {
        if (cc.isEmailReminderScheduled === "Y") {
          isReceiversNotSelected = false;
        }
      });
    }
    if (isReceiversNotSelected) {
      this.snackBar.open("Please select ezsign receiver", '', { duration: 3000 });
      return;
    }
    newClientReminder.signers = tSigners;
    newClientReminder.recurrenceInDays = this.recurrenceInDays;
    newClientReminder.subject = this.subject;
    newClientReminder.body = this.body;
    if (this.sendReminderNow === true) {
      newClientReminder.sendReminderNow = 'Y';
    } else {
      newClientReminder.sendReminderNow = 'N';
    }
    console.log('save schedule:');
    console.log(newClientReminder);
    this.service.saveScheduleClientReminder(newClientReminder).subscribe(resp => {
      console.log(resp);
      if (this.senderDocRef) {
        this.senderDocRef.updateClientReminderFlag(this.ezSignTrackingId, 'Y');
      }
      this.dialogRef.close();
    });
  }

  deleteSchedule(ezSignTrackingId: string) {
    console.log('delete schedule:' + ezSignTrackingId);
    this.service.deleteScheduleClientReminder(ezSignTrackingId).subscribe(resp => {
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
