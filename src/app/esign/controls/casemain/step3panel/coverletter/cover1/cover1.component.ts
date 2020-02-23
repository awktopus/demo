import {Component, Inject, OnInit , ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ESignCoverletterConfig} from '../../../../../beans/ESignCoverLetterConfig';
import { EsignserviceService } from '../../../../../service/esignservice.service';
import { ESignCase, ESignDoc, ClassifyPage, ESignField } from '../../../../../beans/ESignCase';
import { CoverletterComponent } from '../../../coverletter/coverletter.component';

@Component({
  selector: 'app-cover1',
  templateUrl: './cover1.component.html',
  styleUrls: ['./cover1.component.scss']
})
export class Cover1Component implements OnInit {
  cl_type: String;
  config: ESignCoverletterConfig;
  @ViewChild(CoverletterComponent) cover: CoverletterComponent;
  showspinner = false;
  constructor(
    private service: EsignserviceService,
    public dialogRef: MatDialogRef<Cover1Component>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
     }

  ngOnInit() {
  }
  closeme(): void {
    this.dialogRef.close();
  }

  buildCoverLetter() {
    this.showspinner = true;
    if (!this.cover.checkInputs()) {
      console.log('missing some input');
      return;
    }
    const json = this.cover.buildCoverJson();
    // check inputsf
    const ninputs = [];
    this.cover.myInputs.forEach(ele => {
      ninputs.push({key: ele.name, value: ele.value});
    });
    const cjson = {
      OrgUnitId: this.service.auth.getOrgUnitID(),
      templateName: json.TType,
      templateId: json.templateID,
      cpa: this.service.auth.getUserID(),
      inputs: ninputs,
      content: json.content
    } ;
    console.log(cjson);
    this.service.buildCoverLetter(cjson).subscribe(resp => {
      const res = <{files: ESignDoc[]}> resp;
      this.service.updateCoverLetter(res.files);
      this.showspinner = false;
      this.dialogRef.close();
    });

  }

  setCase (cc: ESignCase): void {
    const yy = (new Date()).getFullYear() - 1;
    const vv = [];
    vv.push({name: 'ContactFirstName', value: cc.primarySigner.firstName });
    vv.push({name: 'Year', value: yy });
    this.cover.setInputValues(vv);
  }
}
