import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../service/esignservice.service';

@Component({
  selector: 'app-casepapersign',
  templateUrl: './casepapersign.component.html',
  styleUrls: ['./casepapersign.component.scss']
})
export class CasePaperSignComponent implements OnInit {
  mycaseID: string;
  docId: string;
  seq: string;
  constructor(private route: ActivatedRoute, private router: Router, private service: EsignserviceService) {
    this.route.paramMap.subscribe(para => {
      this.mycaseID = para.get('caseId');
      this.docId = para.get('docId');
      this.seq = para.get('seq');
    });
   }

  ngOnInit() {
  }

  goFormPage() {
    //this.router.navigate(['/main/esign/mycases/caseform/' + this.mycaseID]);
  }

  goFormViewPage() {
    // first do the post request
    this.service.postESignAgreement(this.docId, Number(this.seq)).subscribe(resp => {
      console.log(resp);
      this.router.navigate(['/main/esign/mycases/caseformview/' + this.mycaseID + '/' +
      this.docId + '/' + this.seq]);
    });
  }
}
