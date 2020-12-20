import { Component, OnInit,ViewChild,ElementRef,Output,EventEmitter,ViewChildren,QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../service/esignservice.service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-casesigning',
  templateUrl: './casesigning.component.html',
  styleUrls: ['./casesigning.component.scss']
})
export class CaseSigningComponent implements OnInit {
  mycase:any;
  seq:any;
  form:any;
  signer:any;
  pdfUrl:any=null;
  size_pdf:any = {};
  size_container:any ={};
  myinput = {};
  mysigs = {};
  signcapform: FormGroup = new FormGroup({});
  @ViewChild('pdfviewcontainer') ele_pdfview: ElementRef;
  @Output("switchToGridView") switchToGrid: EventEmitter<any> = new EventEmitter();
  @ViewChildren(SignaturePad) public sigPadList :QueryList< SignaturePad>;
  public signaturePadOptions: any = {
    'minWidth': 2,
    'canvasHeight': 160,
    'backgroundColor': '#ffffff'
  };
  constructor(private route: ActivatedRoute, private router: Router, private service: EsignserviceService) {
   }

  ngOnInit() {
    this.mycase=this.service.getCacheData("case");
    this.signer=this.service.getCacheData("signer");
    this.form=this.service.getCacheData("form");
    this.seq=this.form.seqNo;
    this.prepareData();
  }

  prepareData(){
    this.filterSignerFields();
    this.displayPDFDocPage(this.form.docId,this.form.seqNo);
    this.setUpSigCap();
  }

  filterSignerFields() {
    let filtered_fields = [];
    let presubmit = false;
    console.log(this.form);
    console.log(this.signer);
    this.form.formFields.forEach(fd => {
      if (fd.receiverId === this.signer.receiverId) {
        if(((this.signer.type=="PRIMARY_SIGNER")&&(fd.fieldTypeName.indexOf("_TP_")>-1))||
        ((this.signer.type=="SECONDARY_SIGNER")&&(fd.fieldTypeName.indexOf("_SP_")>-1)))
        {
          filtered_fields.push(fd);
        }
      }
    });

    this.form.filterFields = filtered_fields;
    this.form.filterFields.forEach(ffd => {
        if (ffd.fieldStatus === "Presigned" && (!this.form.presignstatus)) {
          this.form.presignstatus = true;
        }
    });
    console.log(this.form);
 }

 displayPDFDocPage(docId, seq) {
  let url = this.service.auth.baseurl + '/Contents/' + docId +"/" + seq;
  console.log(url);
  this.service.getPDFBlob(url).subscribe(resp => {
    console.log('got data back!!');
    const file = new Blob([<any>resp], {type: 'application/pdf'});
    const fileURL = URL.createObjectURL(file);
    this.pdfUrl = fileURL;
  });

  }

  pageRendered(eve) {
    console.log("rendering pdf ...");
    console.log(eve);
    this.size_pdf = {width: eve.source.div.clientWidth, height: eve.source.div.clientHeight, scale:
      eve.source.viewport.scale};
    console.log(this.size_pdf);
    this.size_container = {width: this.ele_pdfview.nativeElement.clientWidth, height: this.ele_pdfview.nativeElement.clientHeight};
    console.log(this.size_container);
    this.form.filterFields.forEach(ff => {
        ff.adjustPosX = ff.posX * this.size_pdf.scale + (this.size_container.width - this.size_pdf.width) / 2;
        ff.adjustposY = ff.posY * this.size_pdf.scale;
    });
  }
  setUpSigCap() {

    this.signcapform = new FormGroup({});
   
    let str_today = new Date().toISOString().split('T')[0];
    let values = {};
    this.form.filterFields.forEach(field => {
      field.eleId = "ele_" + field.fieldSeqNo;
      this.signcapform.addControl(field.eleId, new FormControl('', Validators.required));
      if (field.fieldControlType === "DATE") {
        values[field.eleId] = str_today;
        console.log("set default date");
      } else {
        values[field.eleId]  = "";
      }
      if (field.fieldValue !== null && field.fieldValue !== "") {
        console.log("set value from store value");
        values[field.eleId] = field.fieldValue;
      }
    });
    console.log("form values:--->");
    console.log(values);
    this.signcapform.setValue(values);
    // iinitialized signaturepad
  
    this.initSigCap();
   }
  
   initSigCap() {
     this.myinput = {};
     this.mysigs = {};
     let index = 0;
     this.form.filterFields.forEach( fd => {
      this.myinput[fd.eleId] = "";
      if (fd.fieldControlType === "SIGNATURE" ) {
        if (fd.fieldValue !== "") {
       //   res[index].fromDataURL(fd.fieldValue);
        }
        index = index + 1;
      }
  
    });
  
    console.log(this.mysigs);
    console.log(this.myinput);
    setTimeout(() => { this.loadPreSignature();}, 100);
  }
  
  loadPreSignature() {
    let res = this.sigPadList.toArray();
    let index = 0;
    this.form.filterFields.forEach( fd => {
      this.myinput[fd.eleId] = "";
      if (fd.fieldControlType === "SIGNATURE" ) {
        if (fd.fieldValue !== "") {
         res[index].fromDataURL(fd.fieldValue);
        }
        index = index + 1;
      }
    });
  }
  
pickField(event) {
  console.log(event);
    let fldseq = event.source.value;
    this.form.filterFields.forEach(ff => {
      if (fldseq === ff.fieldSeqNo) {
        ff.picked = event.checked;
        if (ff.picked === true) {
          ff.bgcolor = "#eeffee";
        } else {
          ff.bgcolor = "";
        }
      } else {
        ff.picked = false;
        ff.bgcolor = "";
      }
    });

  }

  clearSigCap(field) {
    console.log(this.sigPadList.toArray());
    let id = field.eleId;
    console.log(id);
    let index = 0;
    let res = this.sigPadList.toArray();
    this.form.filterFields.forEach(fd => {
      if (fd.eleId === id) {
        console.log(fd.eleId, "  ", id , index);
        res[index].clear();
      }
      if (fd.fieldControlType === "SIGNATURE") {index = index + 1; }
    });
    }
}
