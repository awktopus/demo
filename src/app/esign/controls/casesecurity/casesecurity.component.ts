import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../service/esignservice.service';

@Component({
  selector: 'app-casesecurity',
  templateUrl: './casesecurity.component.html',
  styleUrls: ['./casesecurity.component.scss']
})
export class CaseSecurityComponent implements OnInit {
  mycase:any;
  signer:any;
  signer_type:any;
  formSeq:any;

  constructor(private route: ActivatedRoute, private router: Router, private service: EsignserviceService) {

  }

  ngOnInit() {
  }

  goFormPage() {
  }

  goFormViewPage() {
  }
}
