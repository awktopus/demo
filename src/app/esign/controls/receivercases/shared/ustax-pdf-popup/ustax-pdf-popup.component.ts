import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EsignserviceService } from '../../../../service/esignservice.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ustax-pdf-popup',
  templateUrl: './ustax-pdf-popup.component.html',
  styleUrls: ['./ustax-pdf-popup.component.scss']
})
export class UstaxPdfPopupComponent implements OnInit {

  pdfSrc = '';
  showclassify: boolean;
  FormContrFormControl = new FormControl();
  formval: string;
  formlist: string[];
  selectedForm: string;
  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<UstaxPdfPopupComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
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

   closeme(): void {
    this.dialogRef.close();
  }


}
