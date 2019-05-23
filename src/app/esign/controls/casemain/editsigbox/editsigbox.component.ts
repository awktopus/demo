import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../service/esignservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ESignCase, ESignDoc, ESignCPA, ESignClient, ClientReminder } from '../../../beans/ESignCase';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-editsigbox',
  templateUrl: './editsigbox.component.html',
  styleUrls: ['./editsigbox.component.scss']
})
export class EditSigboxComponent implements OnInit {
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
  clientReminder: ClientReminder;
  priSigCheck: any = true;
  secSigCheck: any = true;
  left1 = 100;
  top1 = 400;
  showbox = false;
  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<EditSigboxComponent>) {
    this.viewControl = {
      view: true,
      edit: false,
      createNew: false
    }
  }

  ngOnInit() {

  }
  enableEdit() {
    this.showbox = true;
  }
  saveEdit() {
    this.showbox = false;
  }
  dragStop(event) {
    console.log(event);
  }

  closeme() {
    this.dialogRef.close();
  }
}
