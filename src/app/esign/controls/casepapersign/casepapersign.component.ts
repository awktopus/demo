import { Component, OnInit,Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../service/esignservice.service';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { PdfViewerModule, PdfViewerComponent } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-casepapersign',
  templateUrl: './casepapersign.component.html',
  styleUrls: ['./casepapersign.component.scss']
})
export class CasePaperSignComponent implements OnInit {
  pdfUrl: any = null;
  mycase:any;
  form:any;
  seq:any;
  signer:any;
  paperform: FormGroup = new FormGroup({});
  nonEsignfiles: File;
  @Output("switchToGridView") switchToGrid: EventEmitter<any> = new EventEmitter();
  constructor(private route: ActivatedRoute, private router: Router, private service: EsignserviceService) {
   }

  ngOnInit() {
    this.mycase=this.service.getCacheData("case");
    this.form=this.service.getCacheData("form");
    this.seq=this.form.seqNo;
    this.signer=this.service.getCacheData("signer");
    this.prepareData();
  }

  openPDF(){
    let url = this.service.auth.baseurl + '/Contents/' + this.form.docId + '/' +this.seq;
    this.service.getPDFBlob(url).subscribe(resp => {
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
     });
  }
  prepareData(){
    this.displayDoc(this.form.docId,this.seq,"N")
  }
  goFormPage() {
    //this.router.navigate(['/main/esign/mycases/caseform/' + this.mycaseID]);
  }

  displayDoc(docID: string, pageSeq: number, mergeFlag: string) {
    //console.log('inside display Doc:' + vt);
    const seq: number = pageSeq;
    let url = this.service.auth.baseurl + '/Contents/' + docID + '/' + seq;
    if (mergeFlag === 'Y') {
      url = url + '/mergedform';
    }
    console.log('display Doc:' + url);
    this.service.getPDFBlob(url).subscribe(resp => {
      console.log('got data back!!');
      console.log(resp);
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      this.pdfUrl = fileURL;
      //this.viewtype = vt;
    });
  }

  uploadNonEsignForm(form: any, signer: any, type: string, ff: File | FileList) {
    console.log(form);
    this.form = form;
    this.service.uploadNonEsignForm(signer.receiverId, this.form.caseId, this.form.docId, this.form.seqNo, type, ff).subscribe(resp => {
      console.log('upload non esign forms response');
      console.log(resp);
      // the return object has the esign pages
      // will automatically goto the next unsigned page
      const pages = (<any>resp).nonesignFormPages;
      if (pages != null && pages.length > 0) {
        // will route to the next esign page
        // this.navCtrl.setRoot(SigningviewPage,{caseId: this.caseID,form: pages[0],signer:this.signer});
       // this.displaySigningView(pages[0], signer);
        // this.loadCaseContent(this.selectedcase.caseId);
        // here the response object is old.
        this.form=pages[0];
        this.prepareData();
      } else {
       // this.loadCaseContent(this.selectedcase.caseId);
         this.switchToGrid.emit({view:'grid',refresh:true});
      }
    },
      error => console.log(error)
    );
  }
}
