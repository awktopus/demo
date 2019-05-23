import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../../service/esignservice.service';

@Component({
  selector: 'app-caseformview',
  templateUrl: './caseformview.component.html',
  styleUrls: ['./caseformview.component.scss']
})
export class CaseformviewComponent implements OnInit {
  form: any;
  primary: any = null;
  secondary: any = null;
  caseID: string;
  pdfSrc = '';
  constructor(private service: EsignserviceService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(para => {
      this.caseID = para.get('caseId');
      const docId = para.get('docId');
      const seq = Number(para.get('seq'));
      this.service.getClientInfo(docId, seq).subscribe(resp => {
        console.log(resp);
        this.form = resp;
        // now process signature
          if (this.form.esigners) {
            this.form.esigners.forEach(element => {
              if (element.type === 'PRIMARY_SIGNER') {
                this.primary = element;
              } else {
                 this.secondary = element;
              }
          });
          }
          this.displayDoc(this.form.docId, this.form.seqNo, this.form.contentMergeFlag);
        });
    });
  }

  displayDoc(docID: string, pageSeq: number, mergeFlag: string) {
    const seq: number = pageSeq;
    let url = this.service.auth.baseurl + '/Contents/' + docID + '/' + seq;
    if (mergeFlag === 'Y') {
      url = url + '/mergedform'
    }
    console.log(url);
    this.service.getPDFBlob(url).subscribe(resp => {
      console.log('got data back!!');
      const file = new Blob([<any>resp], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      this.pdfSrc = fileURL;
    });
  }
  goSigCap(signer: any) {
    console.log(signer);
    const url = '/main/esign/mycases/casesigcap/' + this.caseID + '/' +
    this.form.docId + '/' + this.form.seqNo + '/' + signer.type;
    console.log(url);
    this.router.navigate(['/main/esign/mycases/casesigcap/' + this.caseID + '/' +
    this.form.docId + '/' + this.form.seqNo + '/' + signer.type]);
  }
}
