import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Component, ViewEncapsulation, ViewChild, ElementRef, PipeTransform, Pipe, OnInit, Inject } from '@angular/core';
import {FormControl} from '@angular/forms';
import { InfoTrackerService } from '../../service/infotracker.service';

@Component({
  selector: 'app-infotracker-pdf-popup',
  templateUrl: './infotracker-pdf-popup.component.html',
  styleUrls: ['./infotracker-pdf-popup.component.scss']
})
export class InfotrackerPdfPopupComponent implements OnInit {
  pdfSrc = '';
  showclassify: boolean;
  fcctrl: FormControl = new FormControl();
  formval: string;
  formlist: string[];
  selectedForm: string;
  constructor(private service: InfoTrackerService, public dialogRef: MatDialogRef<InfotrackerPdfPopupComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  setPDF(loc: string): void {
    console.log(loc);
    this.service.GetPDFBlob(loc).subscribe(resp => {
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
