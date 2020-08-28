import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { SenderdocumentsComponent } from '../../senderdocuments/senderdocuments.component';
import { EzSignClientReminder } from '../../../../esign/beans/ESignCase';
import { EzsigndataService } from '../../../service/ezsigndata.service';
import { EzsigndataService } from '../../../service/ezsigndata.service';
import { EzsigndataService } from '../../../service/ezsigndata.service';
@Component({
  selector: 'app-ezsign-client-reminder',
  templateUrl: './ezsign-client-reminder.component.html',
  styleUrls: ['./ezsign-client-reminder.component.scss']
})
export class EzsignClientReminderComponent implements OnInit {
  viewControl: any;
  mycaseId: string;
  status: string;
  primarySigner: ESignClient;
  secondarySigner: ESignClient;
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
      this.mycaseId = clientReminder.ezSignTrackingId;
      this.status = clientReminder.status;
      this.primarySigner = null;
      this.secondarySigner = null;
      clientReminder.clients.forEach(ele => {
        if (ele.esignAccountability === 'PRIMARY_SIGNER') {
          this.primarySigner = ele;
          if (ele.selectedForReminder === 'Y') {
            const priSigCheck = true;
          } else {
            const priSigCheck = false;
          }
        }
        if (ele.esignAccountability === 'SECONDARY_SIGNER') {
          this.secondarySigner = ele;
          if (ele.selectedForReminder === 'Y') {
            const secSigCheck = true;
          } else {
            const secSigCheck = false;
            console.log('sec sig check:' + secSigCheck);
          }
        }
      });
      this.lastReminderDateTime = clientReminder.lastReminderDateTime;
      this.subject = clientReminder.subject;
      this.body = clientReminder.body;
      this.recurrenceInDays = clientReminder.recurrenceInDays.toString();
    }
  }
  saveSchedule() {
    let newClientReminder: ClientReminder;
    newClientReminder = new ClientReminder();
    newClientReminder.caseId = this.mycaseId;
    const clients: ESignClient[] = new Array(2);
    if (this.priSigCheck === true) {
      clients.push(this.primarySigner);
    }
    if (this.secSigCheck === true) {
      clients.push(this.secondarySigner);
    }
    newClientReminder.clients = clients;
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
      if (this.step4panelComp) {
        this.step4panelComp.mycase.clientReminderFlag = 'Y';
      }
      if (this.historyref) {
        this.historyref.updateClientReminderFlag(this.mycaseId, 'Y');
      }
      this.dialogRef.close();
    });
  }

  deleteSchedule(caseId: string) {
    console.log('delete schedule:' + caseId);
    this.service.deleteScheduleClientReminder(caseId).subscribe(resp => {
      console.log(resp);
      if (this.historyref) {
        this.historyref.updateClientReminderFlag(this.mycaseId, 'N');
      }
      this.dialogRef.close();
    });
  }

  closeme() {
    this.dialogRef.close();
  }
}
