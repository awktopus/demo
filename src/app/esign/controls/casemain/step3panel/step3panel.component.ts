import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Cover1Component} from './coverletter/cover1/cover1.component';
import {ESignCoverletterConfig} from '../../../beans/ESignCoverLetterConfig';
import { ESignCase, ESignDoc, ESignCPA } from '../../../beans/ESignCase';
import { EsignserviceService } from '../../../service/esignservice.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Router, ActivatedRoute } from '@angular/router';
import { CasetemplatesComponent } from './../../history/casetemplates/casetemplates.component';
import { EsignuiserviceService } from '../../../service/esignuiservice.service';
@Component({
  selector: 'app-step3panel',
  templateUrl: './step3panel.component.html',
  styleUrls: ['./step3panel.component.scss']
})
export class Step3panelComponent implements OnInit {
  cpas: ESignCPA[];
  cl_types: string[];
  cl_config: ESignCoverletterConfig;
  mycase: ESignCase;
  coverletter_type: string;
  caseValidated = false;
  reviewcpa: ESignCPA;
  showSavespinner = false;
  showAnotherCasespinner = false;
  @Output("parentCaseControl") parentCaseControl: EventEmitter<any> = new EventEmitter();
  constructor( public dialog: MatDialog, private service: EsignserviceService,
    private uiservice: EsignuiserviceService, private router: Router) {

    this.cpas = []; // need service to pull this data
    this.coverletter_type = null;
    this.cl_types = ['Individual', 'C Corporation', 'Partnership and S corporation'];
    this.cl_config = {
      clientContact: '',
      year: '',
      sCorpName: '',
      cCorpName: '',
      cpaOrfirmname: '',
      OrgUnitId: ''
    };
    this.service.getReviewers().subscribe(resp => {
      this.cpas = <ESignCPA[]> resp;
    });
  }

   openCover(covertype): void {
    const dialogRef = this.dialog.open(Cover1Component, {
      width: '900px',
    });
    dialogRef.componentInstance.setCase(this.mycase);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  ngOnInit() {
    this.service.cur_case.subscribe(c => {
      this.mycase = c;
      this.processCaseStatus();
    });
  }

  processCaseStatus() {
    console.log(this.mycase.status);
    this.caseValidated = false;
    if (this.mycase.status) {
      if ( this.mycase.status === 'Validated' || this.mycase.status === 'Review'
       || this.mycase.status === 'Esign' || this.mycase.status === 'Completed') {
        this.caseValidated = true;
      }
    }
  }

  updateStatus(event) {
    // console.log(event);
    let sta: string;
    if (event.checked) {
      sta = 'Validated';
      this.service.updateCaseStatus(this.mycase.caseId, sta);
    } else {
      sta = 'Classified';
      this.service.updateCaseStatus(this.mycase.caseId, sta);
    }
  }

  sendToReview() {
    this.showSavespinner = true;
    console.log(this.reviewcpa);
    if (this.reviewcpa) {
      this.service.sendToReview(this.mycase.caseId, this.reviewcpa).subscribe(resp => {
        this.service.updateCaseStatusLocal('Review');
        this.showSavespinner = false;
      });
    }
  }

  setReviewCPA(event) {
    // console.log(event);
    if (event.isUserInput) {
      const cpa_id = event.source.value;
      this.cpas.forEach (ele => { if (ele.cpaId === cpa_id) { this.reviewcpa = ele; }});
    }
    // this.cpas.forEach(ele => ())
  }

  createAnotherCase() {
    this.parentCaseControl.emit({"value": "newCaseEvent"});
    // this.router.navigateByUrl('main/esign/case/newcaseID');
  }
}

