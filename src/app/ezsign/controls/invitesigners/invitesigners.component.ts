import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { AddfieldsComponent } from '../addfields/addfields.component';
import { Router } from '@angular/router';
import {
Signer
} from '../../../esign/beans/ESignCase';
@Component({
  selector: 'app-invitesigners',
  templateUrl: './invitesigners.component.html',
  styleUrls: ['./invitesigners.component.scss']
})
export class InvitesignersComponent implements OnInit, AfterViewInit {

  addFieldsComp: AddfieldsComponent;
  viewControl: any;
  subject: string;
  body: string;
  ezSignTrackingId: string;
  title: string;
  eZSigners: Signer[];
  showProcessSpinner = false;
  status: string;
  constructor(private service: EzsigndataService, private router: Router,
    public dialogRef: MatDialogRef<InvitesignersComponent>) {
      dialogRef.disableClose = true;
      this.viewControl = {
        view: true,
        edit: false,
        createNew: false
      }
    }

ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.service.getEZSignSigners(this.ezSignTrackingId).subscribe(respSigners => {
      console.log(respSigners);
      this.eZSigners = respSigners;
      this.subject = "Signature for ezfile authorization";
      this.service.GetCoverLetter(this.service.auth.getOrgUnitID(), "ezsign_client_communication").subscribe(resp => {
        console.log('Get cover letter');
        console.log(resp);
        if (resp) {
        this.body = resp.content;
      }
      });
    });

  }
  setData(ezSignTrackingId: string, title: string, status: string) {
    this.ezSignTrackingId = ezSignTrackingId;
    this.title = title;
    this.status = status;
  }
  editDocument() {
    const url = '/main/ezsign/addfields/' + this.ezSignTrackingId;
    this.router.navigateByUrl(url);
    this.closeMe();
  }

  sendInvite() {
    this.showProcessSpinner = true;
    console.log('sendInvite');
    const coverLetterInfo = {
      body: this.body,
      subject: this.subject,
    };
    this.service.sendInviteToSigners(this.ezSignTrackingId, coverLetterInfo).subscribe(resp => {
      console.log(resp);
      if (resp && resp.statusCode === "200") {
        this.showProcessSpinner = false;
        const url = 'main/ezsign/senderdocuments';
        this.router.navigateByUrl(url);
        this.closeMe();
      }
    });
  }

  closeMe() {
    this.dialogRef.close();
  }
}
