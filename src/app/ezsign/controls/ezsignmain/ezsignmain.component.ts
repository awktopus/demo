import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { GridColConfigPopupComponent } from './../../../esign/controls/history/gridcolpopup/grid-col-config-popup.component';
import { RouterLinkRendererComponent } from './../../../esign/controls/history/RouterLinkRenderer.component';
import { AddsignersComponent } from './../addsigners/addsigners.component'
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { EZSignDocResource } from '../../../esign/beans/ESignCase'
import { ViewChild, AfterViewInit } from '@angular/core';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { EzsignAddSignersButtonRendererComponent } from '../Ezsignaddsignersbutton-renderer.component';
import { EzsignConfirmationDialogComponent } from '../shared/ezsign-confirmation-dialog/ezsign-confirmation-dialog.component';
import { EzsignDeleteButtonRendererComponent } from '../Ezsigndeletebutton-renderer.component';
import { EzsignHistoryButtonRendererComponent } from '../Ezsignhistorybutton-renderer.component';

import { EzsignLinkRendererComponent } from '../EzsignLinkRenderer.component';
import { EzsignViewButtonRendererComponent } from '../Ezsignviewbutton-renderer.component';
import { EzsignPdfPopupComponent } from '../shared/ezsign-pdf-popup/ezsign-pdf-popup.component';
import { EzsignGridcolpopupComponent } from '../shared/ezsign-gridcolpopup/ezsign-gridcolpopup.component';
import { EzSignReminderRendererComponent } from '../EzsignReminderRenderer.component';
import { EzsignClientReminderComponent } from '../shared/ezsign-client-reminder/ezsign-client-reminder.component';

@Component({
  selector: 'app-ezsignmain',
  templateUrl: './ezsignmain.component.html',
  styleUrls: ['./ezsignmain.component.scss']
})
export class EzsignMainComponent implements OnInit {
  selectedIndex: any;
  userRole: string;
  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private ezSignDataService: EzsigndataService) {

  }
  ngOnInit() {
  console.log('ezmain OnInit and user role:');
  console.log(this.ezSignDataService.auth.getUserRole());
  this.userRole = this.ezSignDataService.auth.getUserRole();
    if (typeof this.userRole === "undefined" || this.userRole === null) {
      console.log(window.location.href);
      if(window.location.href.indexOf("localhost")!=-1){
        this.userRole="ADMIN";
      }
    } else {
      this.userRole = this.userRole.toUpperCase();
    }
    console.log('converted role');
    console.log(this.userRole);
  }
  changeTab(event) {
  }
}
