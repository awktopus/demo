import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Component, ViewEncapsulation, ViewChild, ElementRef, PipeTransform, Pipe, OnInit, Inject } from '@angular/core';
import {FormControl} from '@angular/forms';
import { EzsigndataService } from '../../../service/ezsigndata.service';
@Component({
  selector: 'app-ezsign-pdf-popup',
  templateUrl: './ezsign-pdf-popup.component.html',
  styleUrls: ['./ezsign-pdf-popup.component.scss']
})
export class EzsignPdfPopupComponent implements OnInit {
  pdfSrc = '';
  showclassify: boolean;
  fcctrl: FormControl = new FormControl();
  formval: string;
  formlist: string[];
  selectedForm: string;
  constructor(private service: EzsigndataService, public dialogRef: MatDialogRef<EzsignPdfPopupComponent>) {
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
