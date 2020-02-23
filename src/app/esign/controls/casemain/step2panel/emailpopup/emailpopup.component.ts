import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Component, ViewEncapsulation, ViewChild, ElementRef, PipeTransform, Pipe, OnInit, Inject } from '@angular/core';
import {FormControl} from '@angular/forms';
import { EsignserviceService } from '../../../../service/esignservice.service';
import { EsignuiserviceService } from '../../../../service/esignuiservice.service';
import { ESignCase, ESignCPA, ESignDoc, ClassifyPage, ESignField } from '../../../../beans/ESignCase';
import { SafePipe } from '../../../../esign.component';
import {CoverletterComponent} from '../../coverletter/coverletter.component';

@Component({
  selector: 'app-emailpopup',
  templateUrl: './emailpopup.component.html',
  styleUrls: ['./emailpopup.component.scss']
})

export class EmailpopupComponent implements OnInit {
  mycase: ESignCase = null;
  mydocs: any[] = [];
  emailsubject: string;
  pcheck = true;
  scheck = false;
  ccheck = [];
  @ViewChild(CoverletterComponent) cover: CoverletterComponent;
  constructor( private service: EsignserviceService,
     public dialogRef: MatDialogRef<EmailpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
     }

  ngOnInit() {
  }
  closeme() {
    this.dialogRef.close();
  }
  setCase(ecase: ESignCase) {
    this.mycase = ecase;
    // this.mycase.cpa = this.service.getCAPLocal(this.mycase.cpaId);
    // console.log(this.mycase);
    this.mydocs = [];
    if (this.mycase.coverLetters) {
      this.mycase.coverLetters.forEach( ele  => {
        this.mydocs.push({type: 'Cover', id: ele.docId, name: ele.fileName});
      })
    };
    if (this.mycase.reviewDocs) {
      this.mycase.reviewDocs.forEach( ele  => {
        this.mydocs.push({type: 'Review', id: ele.docId, name: ele.fileName});
      })
    };
    if (this.mycase.esignDocs) {
      this.mycase.esignDocs.forEach( ele  => {
        this.mydocs.push({type: 'ESign', id: ele.docId, name: ele.fileName});
      })
    };
    if (this.mycase.paymentDocs) {
      this.mycase.paymentDocs.forEach( ele  => {
        this.mydocs.push({type: 'Payment', id: ele.docId, name: ele.fileName});
      })
    };
    if (this.mycase.paperDocs) {
      this.mycase.paperDocs.forEach( ele  => {
        this.mydocs.push({type: 'Paper', id: ele.docId, name: ele.fileName});
      })
    };
    console.log(this.mydocs);
    if (this.mycase.recipientClients) {
      this.ccheck = [];
      this.mycase.recipientClients.forEach(ele => {
        this.ccheck.push(false);
      });
    }
    const yy = (new Date()).getFullYear() - 1;
    const vv = [];
    vv.push({name: 'ContactFirstName', value: this.mycase.primarySigner.firstName });
    vv.push({name: 'Year', value: yy });
    this.cover.setInputValues(vv);
  }

  sendEmail() {
    if (this.cover.checkInputs() === false) {
      return;
    } else {
      console.log('send email to clients');
      const json = this.cover.buildCoverJson();
      console.log(this.buildEmailClientList());
      const docs = [];
      this.mydocs.forEach(doc => {
        docs.push(doc.id);
      });
      const ninputs = [];
      this.cover.myInputs.forEach(ele => {
        ninputs.push({key: ele.name, value: ele.value});
      });
      const ejson = {
        caseId: this.mycase.caseId,
        clients: this.buildEmailClientList(),
        cpa: this.service.auth.getUserID(),
        docIds: docs,
        OrgUnitId: this.service.auth.getOrgUnitID(),
        TemplateName: json.TType,
        Subject: this.emailsubject,
        TemplateId: json.templateID,
        content: json.content,
        inputs: ninputs,
        OrgUnitName: this.service.auth.getOrgUnitName()
      };
      console.log(ejson);
      this.service.sendCaseByEmail(ejson).subscribe(resp => {
        console.log(resp);
        this.service.updateCaseStatus(this.mycase.caseId, 'Emailed');
        this.closeme();
      });
    }
  }
  buildEmailClientList(): string[] {
    const res = [];
    // add primary signer
    res.push(this.mycase.primarySigner.clientId);
    if (this.scheck && this.mycase.secondarySigner) {
      res.push(this.mycase.secondarySigner.clientId);
    }
    if (this.ccheck && this.mycase.recipientClients) {
      for (let i = 0 ; i < this.mycase.recipientClients.length; i++ ) {
        if (this.ccheck[i]) {
          res.push(this.mycase.recipientClients[i].clientId);
        }
      }
    }
    return res;
  }

   checkP(event, person) {
     console.log(event);
     console.log(person);
   }
}
