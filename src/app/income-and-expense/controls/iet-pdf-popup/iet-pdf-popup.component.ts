import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, ViewEncapsulation, ViewChild, ElementRef, PipeTransform, Pipe, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EsignserviceService } from '../../../esign/service/esignservice.service';
import { IetSafePipe } from '../../income-and-expense.component';
@Component({
  selector: 'app-iet-pdf-popup',
  templateUrl: './iet-pdf-popup.component.html',
  styleUrls: ['./iet-pdf-popup.component.scss']
})
export class IetPdfPopupComponent implements OnInit {
  pdfSrc = '';
  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<IetPdfPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
  }

  setPDF(loc: string): void {
    console.log(loc);
    this.service.getPDFBlob(loc).subscribe(resp => {
      // console.log(resp);
      const file = new Blob([<any>resp], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      console.log('set pdf:' + fileURL);
      this.pdfSrc = fileURL;
    });
  }

  closeme(): void {
    this.dialogRef.close();
  }

}
