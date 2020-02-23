import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Component, ViewEncapsulation, ViewChild, ElementRef, PipeTransform, Pipe, OnInit, Inject } from '@angular/core';
import {FormControl} from '@angular/forms';
import { EsignserviceService } from '../../../../service/esignservice.service';
import { EsignuiserviceService } from '../../../../service/esignuiservice.service';
import { ESignCase, ESignDoc, ClassifyPage, ESignField } from '../../../../beans/ESignCase';
import { SafePipe } from '../../../../esign.component';
@Component({
  selector: 'app-pdfpopup',
  templateUrl: './pdfpopup.component.html',
  styleUrls: ['./pdfpopup.component.scss']
})
export class PdfpopupComponent implements OnInit {
  pdfSrc = '';
  showclassify: boolean;
  pageObj: ClassifyPage;
  fcctrl: FormControl = new FormControl();
  formval: string;
  formlist: string[];
  selectedForm: string;
  constructor( private uiservice: EsignuiserviceService, private service: EsignserviceService,
     public dialogRef: MatDialogRef<PdfpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
     }

  ngOnInit() {
    this.fcctrl.valueChanges.subscribe(val => {
      if (val && typeof val !== 'object') {
        // console.log(val);
         if ( this.formval === val.trim()) {
           return;
         } else {
           this.uiservice.searchFormcodes( val).subscribe(resp => {
              const rr = <{formCodes: string[]}> resp;
              this.formlist = rr.formCodes;
           });
         }
       }
    });
  }

  setPDF(loc: string): void {
    console.log(loc);
    this.service.getPDFBlob(loc).subscribe(resp => {
       // console.log(resp);
       const file = new Blob([<any>resp], {type: 'application/pdf'});
       const fileURL = URL.createObjectURL(file);
       console.log('set pdf:' + fileURL);
       this.pdfSrc = fileURL;
    });
   }

  setclassify(page: ClassifyPage, sc: boolean) {
    this.pageObj = page;
    console.log('====', page);
    this.showclassify = sc;
  }
  closeme(): void {
    this.dialogRef.close();
  }

  assignForm(): void {
        this.service.classifyDocForm(this.pageObj.docId, this.pageObj.seqNo, this.selectedForm).subscribe(resp => {
        const res_c = <{classification: ESignDoc[]}> resp;
        this.service.updateClassificationPages(res_c.classification);
    });
  }
}
