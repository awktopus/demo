import { Component, OnInit } from '@angular/core';
import { ViewChild, AfterViewInit } from '@angular/core';
import { EsignserviceService } from '../../service/esignservice.service';
import { ESignCase, ESignUI, ESignDoc} from '../../beans/ESignCase';
import { Router, ActivatedRoute } from '@angular/router';
import {Step1panelComponent} from './step1panel/step1panel.component';
import { EsignuiserviceService } from '../../service/esignuiservice.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-casemain',
  templateUrl: './casemain.component.html',
  styleUrls: ['./casemain.component.scss']
})
export class CasemainComponent implements OnInit, AfterViewInit {
  ui_ctrl: ESignUI = new ESignUI();
  coverletter_type: String;
  mycaseID: string;
  @ViewChild(Step1panelComponent) cstep1: Step1panelComponent;
  constructor(private service: EsignserviceService,
    private uiservice: EsignuiserviceService, private router: Router,
    private route: ActivatedRoute) {
   }

  ngOnInit() {
      this.uiservice.cur_ui.subscribe(c => {
      this.ui_ctrl = c;
    });
  }
  ngAfterViewInit() {
      this.route.paramMap.subscribe(para => {
      this.mycaseID = para.get('caseId');
      if (this.mycaseID === 'newcaseID') {
        const cc = new ESignCase();
        this.service.updateCase(cc);
        this.cstep1.setInitCase(cc);
        this.uiservice.setStepper(0);
        // setTimeout (() => {
        //   console.log("Hello from setTimeout");
        //   this.caseDataloading = false;
        //   console.log('BRAND NEW CASE DATA LOADING END...');
        //   console.log(this.caseDataloading);
        // }, 4000);
      } else if (this.mycaseID.includes('-') === true) {
         const cc = new ESignCase();
        this.service.updateCase(cc);
        this.cstep1.setInitCase(cc);
        this.uiservice.setStepper(0);
        // setTimeout (() => {
        //   console.log("Hello from setTimeout");
        //   this.caseDataloading = false;
        //   console.log('NEW CASE DATA FROM PREVIOUS CASE DATA LOADING END...');
        //   console.log(this.caseDataloading);
        // }, 4000);
      } else {
        console.log(this.mycaseID);
        this.service.getESignCase(this.mycaseID).subscribe(resp => {
          const cc: ESignCase = <ESignCase> resp;
          console.log(resp);
         const rr: any = <{classification: ESignDoc[]}> resp;
          console.log(rr);
          this.service.updateCase(cc);
          this.service.updateClassificationPages(rr.classification);
          this.cstep1.setInitCase(cc);
          this.uiservice.setStepper(this.getStepByStatus(cc.status));
          // setTimeout (() => {
          //   console.log("Hello from setTimeout");
          //   this.caseDataloading = false;
          //   console.log('Existing CASE DATA LOADING END...');
          //   console.log(this.caseDataloading);
          // }, 4000);
        });
      }
    });
  }

  getStepByStatus(s: string) {
    if (s === 'Preparation' || s === '') {
      return 0;
    }
    if (s === 'Classify' || s === 'Upload') {
      return 1;
    }
    if (s === 'Classified') {
      return 2;
    }
    if (s === 'Review') {
      return 3;
    }
    if (s === 'Signed' || s === 'ESign' || s === 'Emailed') {
    return 4;
  }
  }
  navigateCaseManagement() {
    this.router.navigateByUrl('main/esign/history/reviewcases');
  }
}
