import { Component, OnInit,ViewChild,ElementRef,Output,EventEmitter,ViewChildren,QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../service/esignservice.service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-casesigning',
  templateUrl: './casesigning.component.html',
  styleUrls: ['./casesigning.component.scss']
})
export class CaseSigningComponent implements OnInit {
  mycase:any;
  showReviewSpinner=false;
  seq:any;
  form:any;
  signer:any;
  pdfUrl:any=null;
  size_pdf:any = {};
  size_container:any ={};
  myinput = {};
  mysigs = {};
  signcapform: FormGroup = new FormGroup({});
  showProcessSpinner:any;
  viewType='signing';
  @ViewChild('pdfviewcontainer') ele_pdfview: ElementRef;
  @Output("switchToGridView") switchToGrid: EventEmitter<any> = new EventEmitter();
  @ViewChildren(SignaturePad) public sigPadList :QueryList< SignaturePad>;
  public signaturePadOptions: any = {
    'minWidth': 2,
    'canvasHeight': 160,
    'backgroundColor': '#ffffff'
  };
  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
    private service: EsignserviceService) {
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

    setTimeout(() => { this.loadPreSignature();}, 100);
  }
  
  loadPreSignature() {
    let res = this.sigPadList.toArray();
    let index = 0;
    this.form.filterFields.forEach( fd => {
      this.myinput[fd.eleId] = "";
      if (fd.fieldControlType === "SIGNATURE" ) {
        if(fd.fieldValue==null){
          fd.fieldValue="";
        }
        if (fd.fieldValue !== "") {
         res[index].fromDataURL(fd.fieldValue);
         console.log(fd.value);
        }
        index = index + 1;
       // console.log(res[index].isEmpty());
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

    getInput() {
      let fields = this.form.filterFields;
      let allfilled = true;
       console.log(fields);
      let sigindex = 0;
      let res = this.sigPadList.toArray();
      this.form.filterFields.forEach( fd => {
        if (fd.fieldControlType === 'SIGNATURE') {
          this.mysigs[fd.eleId] = res[sigindex];
          sigindex = sigindex + 1;
        }
      });
      this.myinput = this.signcapform.value;
      fields.forEach(fd => {
        const lbl = fd.eleId;
        if (fd.fieldControlType === 'SIGNATURE') {
          if (this.mysigs[lbl].isEmpty()) {
              this.myinput[lbl] = "";
            allfilled = false;
          } else {
            this.myinput[lbl] = this.mysigs[lbl].toDataURL();
          }
        } else {
          if (this.myinput[lbl] == null || this.myinput[lbl] === "") {
            allfilled = false;
          }
        }
      });
      //console.log(this.myinput);
      return allfilled;
    }
  
    buildJson() {
      // build fields
      console.log(this.signcapform);
      var fddata = [];
      this.form.filterFields.forEach( fd => {
          fd.fieldValue = this.myinput[fd.eleId];
          fddata.push(fd);
      });
      let json = {
        caseId: this.form.caseId,
        status: "",
        docId: this.form.docId,
        type: this.signer.type,
        form: {
          seqNo: this.form.seqNo,
          pageStatus: "",
          contentMergeFlag: "",
          formFields: fddata
        }
      };
      return json;
    }

    gotoNextForm(nextform){
      console.log("goto next form");
      this.service.setCacheData("case",this.mycase);
      this.service.setCacheData("form",nextform);
      this.service.setCacheData("seq",nextform.seqNo);
      // signer are the same
      this.form=nextform;
      this.form.caseId=this.mycase.caseId;
      this.form.docId=this.mycase.docId;
      this.seq=this.form.seqNo;
      this.prepareData();
    }

    async submitSignCapData(){
  
      if(this.getInput()){
        console.log(this.myinput);
        let json=this.buildJson();
       console.log(json);
        
        this.service.preSubmitSigningForm(json).subscribe(async res=>{
            console.log(this.mycase);
            let ary_seq=this.mycase.signedformseq;
            ary_seq.push(this.form.seqNo);
            this.mycase=res;
            // fix pagefield issues
            this.mycase.signedformseq=ary_seq;
            console.log(this.mycase);
            //this.pubSubEsignService.next(PubSubEsignService.EZSIGNDOC_UPDATE,{case:this.case});
            console.log(this.mycase);
            console.log(this.signer);
            let newform=this.findNextSigningForm(this.mycase,this.signer);
            console.log("the next form");
            console.log(newform);
            if(newform!=null){
                // here we navigate 
                console.log("goto next form");
                this.gotoNextForm(newform);
            } else{
                // all signing done
                //this.goEZSign();
                // this should go to finalization pages
                //console.log(" go to finalize");
                this.goFinalize();
            }
        });
       
      } 
      else 
      {
        this.showProcessSpinner = false;
        console.log("Missing data");
        this.dialog.open(DialogMissingEsignDataComponent);
      }
    }
  
  findNextSigningForm(cc, ss)
  {
    let frm=null;
    cc.forms.forEach(pp => {
      let alreadysigned = cc.signedformseq.includes(pp.seqNo);
      if ( pp.pageStatus !== "Signed" && (!alreadysigned)) {
        if (pp.formFields) {
          pp.formFields.forEach(fd => {
            if ((fd.receiverId === ss.receiverId) && (fd.fieldStatus !== 'Signed')) {
              if(((ss.type=="PRIMARY_SIGNER")&&(fd.fieldTypeName.indexOf("_TP_")>-1))||
              ((ss.type=="SECONDARY_SIGNER")&&(fd.fieldTypeName.indexOf("_SP_")>-1)))
              {
                if(frm==null)
                {
                  frm=pp;
                }
              }
            }
          });
        }
      }
    });
    return frm;
  }


  viewPreSignPage() {
    var caseId = this.mycase.caseId;
    var docId = this.mycase.docId;
    var pageseq = this.form.seqNo;
    //http://localhost:55940/api/cases/orgunit/4a55653e-fcab-4736-91af-30f25ab208d3/receiver/cf0907c8-dafd-4235-a793-5afce024b1f0/case/CS2012030362/document/DOC202012030518011066/page/6/signedpage/preview
    const url=this.service.auth.baseurl+"/cases/orgunit/"+this.service.auth.getUserID()+"/receiver/"+this.service.auth.getUserID()
    +"/case/"+caseId+"/document/"+docId+"/page/"+pageseq+"/signedpage/preview";
    this.service.getPDFBlob(url).subscribe(resp=>{
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    });
  }

  SkipPage() {
    this.mycase.signedformseq.push(this.seq);
    let nextform = this.findNextSigningForm(this.mycase, this.signer);
    if (nextform!=null) {
       // this.paramRouter.navigate('/tools/ezsign/ezsignsigningview', {case: this.mycase,pageSeq:nextseq,signer:this.signer});
      this.gotoNextForm(nextform);
    } else {
        // all signing done for this form
        // show final page
      this.goFinalize();
    }
    this.showProcessSpinner = false;
  }

  goFinalize(){
    console.log("finalize signing");
    this.viewType='finalview';
  }

  previewDoc() {
    this.service.previewUSTaxDocument(this.form.caseId,this.form.docId);
  }

  async finalize(){
    
    this.service.finalizeSigning(this.form.caseId,this.form.docId,this.signer.type).subscribe(resp=>{
      console.log(resp);
      this.switchToGrid.emit({view:'grid',refresh:true});
    });
    
  }
}

@Component({
  selector: 'dialog-missing-esign-data',
  templateUrl: 'dialog-missing-esign-data.html',
})
export class DialogMissingEsignDataComponent {}