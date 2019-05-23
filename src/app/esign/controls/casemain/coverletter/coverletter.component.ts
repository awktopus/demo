import { Component, OnInit, Input,  } from '@angular/core';
import { EsignserviceService } from '../../../service/esignservice.service';
import { ESignCoverletterConfig} from '../../../beans/ESignCoverletterConfig';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-coverletter',
  templateUrl: './coverletter.component.html',
  styleUrls: ['./coverletter.component.scss']
})
export class CoverletterComponent implements OnInit {
  myInputs: any;
  viewControl: any;
  covers: any;
  editcontent: any;
  selectedCover: any;
  newTemplateType: string;
  newT: any;
  cnew = false;
  errorMessage: string = null;
  inputValues: any = [];
  noedit = false;
  constructor(private service: EsignserviceService) {
    this.viewControl = {
      view: true,
      edit: false,
      createNew: false
    }
   }

  buildInputs() {

  }
  ngOnInit() {
    this.service.getCoverLetters().subscribe(resp => {
      console.log(resp);
      this.covers = resp;
      this.selectedCover = this.covers[0].templateId;
      this.setTemplate(this.selectedCover);
    });
  }

  updateViewControl(event) {
    // console.log(event);
    if (event.checked) {
      this.viewControl.view = true;
    } else {
      this.viewControl.view = false;
    }
  }

  updateEditControl(event) {
    // console.log(event);
    if (event.checked) {
      this.viewControl.edit = true;
      this.viewControl.view = true;
    } else {
      this.viewControl.edit = false;
      // this.viewControl.view = false;
    }
    this.covers.forEach(cv => {
      if (cv.templateId === this.selectedCover) {
        if (this.viewControl.edit) {
          this.editcontent = cv.content;
        } else {
          this.editcontent = this.buildContent(cv.content);
        }
      }
    });
  }
  updateSaveAsControl(event) {
    if (event.checked) {
      this.viewControl.createNew = true;
    } else {
      this.viewControl.createNew = false;
      // this.viewControl.view = false;
    }
  }

  selectTmplt(event) {
    const tn = event.value;
    this.setTemplate(tn);
  }
  setTemplate(tid: number) {
    this.covers.forEach(cv => {
      if (cv.templateId === tid) {
        if (this.viewControl.edit) {
          this.editcontent = cv.content;
        } else {
          this.editcontent = this.buildContent(cv.content);
        }
        this.myInputs = [];
        cv.inputs.forEach(input => {
          this.inputValues.forEach(vv => {
            if (vv.name === input) {
              this.myInputs.push({name: input, value: vv.value});
            }
          });
        });
        if (cv.isSystemTemplate === 'Y') {
          this.noedit = true;
        } else {
          this.noedit = false;
        }
        // console.log(this.noedit);
      }
    });
  }

  buildCoverJson(): any {
    const res: any = {};
    res.inputs = [];
    this.myInputs.forEach(ele => {
      res[ele.name] = ele.value;
      res.inputs.push(ele.name);
    });
    res['OrgUnitId'] = this.service.auth.getOrgUnitID();
     this.covers.forEach(ele => {
       if (ele.templateId === this.selectedCover) { res['TType'] = ele.templateName; }});
    res['templateID'] = this.selectedCover;
    res['content'] = this.buildContent(this.editcontent);
    res['newTType'] = this.newTemplateType;
    return res;
  }
  buildTemplateJson(): any {
    const json = this.buildCoverJson();
    json.content = this.editcontent;
    return json;
  }

  saveTemplate(): any {
    if (this.viewControl.createNew) {
      const json = this.buildTemplateJson();
      console.log(json);
      console.log('create new Template');
      json.isSystemTemplate = 'N';
      this.service.createNewTemplate(json).subscribe( resp => {
        const ct = <any> resp;
        this.covers.push(ct);
        this.selectedCover = ct.templateId;
        this.newTemplateType = '';
        this.cnew = false;
        this.viewControl.createNew = false;
        this.setTemplate(ct.templateId);
      });
    } else {
      // here doing the update
      const json = this.buildTemplateJson();
      console.log('update template!');
      console.log(json);
      json.isSystemTemplate = 'N';
      this.service.updateCoverTemplate(json).subscribe( resp => {
        const ct = <any> resp;
        for (let i = 0; i < this.covers.length; i++) {
          if (this.covers[i].templateId === ct.templateId) {
            this.covers[i] = ct;
          }
        }
      });
    }
  }
  deleteCoverTmplt(): any {
    this.service.deleteCoverTemplate(this.selectedCover).subscribe(resp => {
      console.log(resp);
      this.covers = resp;
      this.selectedCover = this.covers[0].templateId;
      this.setTemplate(this.selectedCover);
    });
  }
  checkInputs(): boolean {
    this.errorMessage = null;
    this.myInputs.forEach(ele => {
      if (ele.value === null || ele.value === '' ) {
        this.errorMessage = 'Missing Input Values.';
      }
    });
    if (this.errorMessage) {
      return false;
    } else {
      return true;
    }
  }
  setInputValues(values: any) {
    this.inputValues = values;
  }

  buildContent(cc: string): string {
    let res: string = cc;
    this.inputValues.forEach(input => {
      const token = '[@' + input.name + ']';
      // res = res.replace(token, input.value)
      res = res.split(token).join(input.value);
      if (input.name === 'Year') {
        const tk2 = '[@YearPlus1]';
       // res = res.replace(tk2, (input.value + 1));
       res = res.split(tk2).join(input.value + 1);
      }
    });
    res = res.replace('[@CPAFirmName]', 'CPA Firm');
    res = res.replace('[@OrgWebsiteUrl]', this.service.auth.getOrgUnitName());
    // console.log('resssss:' + res);
    return res;
  }
}

