import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EsignserviceService } from '../../../service/esignservice.service';
import {MatDialog} from '@angular/material';
import { PdfpopupComponent } from '../../casemain/esigncase/pdfpopup/pdfpopup.component';
@Component({
  selector: 'app-casepdf',
  templateUrl: './casepdf.component.html',
  styleUrls: ['./casepdf.component.scss']
})
export class CasepdfComponent implements OnInit {
  mycaseID: string;
  mypdfs: any;
  constructor( private service: EsignserviceService,
      private route: ActivatedRoute, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(para => {
      this.mycaseID = para.get('caseId');
      this.service.getESignReviewPDF(this.mycaseID).subscribe(resp => {
        this.mypdfs = resp;
        console.log(this.mypdfs);
      });
    });
  }

  showDoc(docId: string) {
    console.log(docId);
    const dialogRef = this.dialog.open(PdfpopupComponent, { width: '520pt'});
    dialogRef.componentInstance.setPDF(this.service.auth.baseurl + '/Contents/' + docId);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
