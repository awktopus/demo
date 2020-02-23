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
    });

  }
  setData(ezSignTrackingId: string, title: string) {
    this.ezSignTrackingId = ezSignTrackingId;
    this.title = title;
  }
  editDocument() {
    const url = '/main/ezsign/addfields/' + this.ezSignTrackingId;
    this.router.navigateByUrl(url);
    this.closeMe();
  }

  sendInvite() {
    this.showProcessSpinner = true;
    console.log('sendInvite');
    this.service.sendInviteToSigners(this.ezSignTrackingId).subscribe(resp => {
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
