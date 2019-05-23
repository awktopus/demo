import { Component, OnInit, ViewChild , AfterViewInit} from '@angular/core';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../../service/esignservice.service';
@Component({
  selector: 'app-casesigcap',
  templateUrl: './casesigcap.component.html',
  styleUrls: ['./casesigcap.component.scss']
})
export class CasesigcapComponent implements OnInit, AfterViewInit  {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  public signaturePadOptions: any = {
    'minWidth': 1,
    'canvasWidth': 420,
    'canvasHeight': 220
    // 'backgroundColor': '#f6fbff'
  };
  public signatureImage: string;
  imageData: any;
  form: any;
  signer: any;
  securitypin = '';
  myDate:  Date = new Date();
  caseID: string;
  type: string;
  constructor( private service: EsignserviceService,
    private route: ActivatedRoute, private router: Router) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EsignsigcapPage');
  }

  goformview() {
    console.log('go to form view');
    // this.navCtrl.setRoot(EsignformviewPage,{form:this.form,caseID:this.form.caseId});
  }

  savedrawing() {
    this.signatureImage = this.signaturePad.toDataURL();
    this.service.saveSignature(this.signer.clientId, this.form.caseId, this.signatureImage).subscribe(resp => {
      console.log(resp);
    });
  }

  loadDrawing() {
    this.service.loadSignature(this.form.caseId, this.signer.clientId).subscribe(resp => {
      const data: any = resp;
      this.signatureImage = data.dataUrl;
      this.signaturePad.fromDataURL(this.signatureImage);
    });
   // this.signaturePad.fromData(this.imageData);
  }

  drawClear() {
    this.signaturePad.clear();
  }

  canvasResize() {
    const canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
    // this.canvasResize();
  }
  ngOnInit() {
    this.route.paramMap.subscribe(para => {
      this.caseID = para.get('caseId');
      const docId = para.get('docId');
      const seq = Number(para.get('seq'));
      const type = para.get('signertype');
      this.service.getClientInfo(docId, seq).subscribe(resp => {
        console.log(resp);
        this.form = resp;
        // now process signature
          if (this.form.esigners) {
            this.form.esigners.forEach(element => {
              if (element.type === type) {
                this.signer = element;
              } else {
              }
          });
          }
        });
    });
  }
  submitCap() {
      console.log(this.myDate);
      console.log(this.securitypin);
      console.log(this.form);
      const data = {
        'clientId': this.signer.clientId,
        'caseId': this.form.caseId,
        'docId': this.form.docId,
        'seqNo': this.form.seqNo,
        'formId': this.form.formId,
        'templateId': this.form.templateId,
        'dateSigned': this.myDate,
        'securedPin': this.securitypin,
        'type': this.signer.type,
        'contentMergeFlag': 'Y',
        'dataUrl': this.signaturePad.toDataURL()
      };
      console.log(data);
      this.service.submitSignatureForm(data).subscribe(resp => {
        console.log(resp);
        // route back to the form
        this.router.navigate(['/main/esign/mycases/caseformview/' + this.form.caseId + '/' +
        this.form.docId + '/' + this.form.seqNo]);
            });
  }
}
