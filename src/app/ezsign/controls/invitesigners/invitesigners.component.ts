import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { AddfieldsComponent } from '../addfields/addfields.component';
import { Router, ActivatedRoute } from '@angular/router';
import {
Signer
} from '../../../esign/beans/ESignCase';
import { EzsignClientReminderComponent } from '../shared/ezsign-client-reminder/ezsign-client-reminder.component';
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
 // status: string;
  isInvitationReadyToShow = false;
  constructor(private service: EzsigndataService, private router: Router, public dialog: MatDialog,
    private route: ActivatedRoute) {
      this.viewControl = {
        view: true,
        edit: false,
        createNew: false
      }
    }

ngOnInit() {
  console.log('invite signers ngOnInit event');
    this.route.paramMap.subscribe(para => {
      this.ezSignTrackingId = para.get('trackingId');
      console.log(this.ezSignTrackingId);
      this.service.GetEZSignTrackingSource(this.ezSignTrackingId).subscribe(resp => {
       console.log(resp);
        if (resp) {
          this.title = resp.documentName;
        }
      })
    });
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.service.getEZSignSigners(this.ezSignTrackingId).subscribe(respSigners => {
      console.log(respSigners);
      this.eZSigners = respSigners;
      this.subject = "You have a new EZSign document";
      this.service.GetCoverLetter(this.service.auth.getOrgUnitID(), "ezsign_client_communication").subscribe(resp => {
        console.log('Get cover letter');
        console.log(resp);
        if (resp) {
        this.body = resp.content;
      }
      this.isInvitationReadyToShow = true;
      });
    });
  }
  setData(ezSignTrackingId: string, title: string) {
    this.ezSignTrackingId = ezSignTrackingId;
    this.title = title;
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
        const url = 'main/ezsign/ezsignmain';
        this.router.navigateByUrl(url);
       // this.closeMe();
      }
    });
  }

  createEzSignReceiverReminder() {
    console.log('createEzSignReceiverReminder:' + this.ezSignTrackingId);
    const dialogRef = this.dialog.open(EzsignClientReminderComponent, {
      width: '980px',
    });
    dialogRef.componentInstance.inviteSignersRef = this;
    this.service.getClientScheduleReminder(this.ezSignTrackingId).subscribe(resp => {
      const res_c = <any>resp;
      console.log(res_c);
      dialogRef.componentInstance.setClientReminderInfo(res_c);
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  goBack() {
    const url = '/main/ezsign/addfields/' + this.ezSignTrackingId;
    this.router.navigateByUrl(url);
  }

  goToEZSignDocumentsView() {
    this.router.navigateByUrl('main/ezsign/ezsignmain');
  }
}
