import { Component, OnInit } from '@angular/core';
import { ESignCase, ESignDoc, ESignCPA } from '../../../beans/ESignCase';
import { EsignserviceService } from '../../../service/esignservice.service';
import { EsignuiserviceService } from '../../../service/esignuiservice.service';

@Component({
  selector: 'app-step5panel',
  templateUrl: './step5panel.component.html',
  styleUrls: ['./step5panel.component.scss']
})
export class Step5panelComponent implements OnInit {

  mycase: ESignCase;
  constructor(private service: EsignserviceService, private uiservice: EsignuiserviceService) { }
  ngOnInit() {
    this.service.cur_case.subscribe(c => {
      this.mycase = c;
    });
    }

    finalizeCase() {
      this.mycase.rejectReason = '';
      this.service.updateCaseStatus(this.mycase.caseId, 'Filed');
    }
}
