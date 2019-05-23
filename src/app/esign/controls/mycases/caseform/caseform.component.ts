import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../../service/esignservice.service';
@Component({
  selector: 'app-caseform',
  templateUrl: './caseform.component.html',
  styleUrls: ['./caseform.component.scss']
})
export class CaseformComponent implements OnInit {
  mycaseID: string;
  myforms: any;
  constructor(private service: EsignserviceService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(para => {
      this.mycaseID = para.get('caseId');
      this.service.getESignForms(this.mycaseID).subscribe(resp => {
        this.myforms = resp;
        console.log(this.myforms);
      });
    });
  }
  goCaseAgreement(form: any) {
    this.router.navigate(['/main/esign/mycases/caseagreement/' + this.mycaseID + '/' +
     form.docId + '/' + form.seqNo]);
  }
}
