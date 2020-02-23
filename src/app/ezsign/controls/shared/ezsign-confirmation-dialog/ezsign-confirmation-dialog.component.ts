import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ezsign-confirmation-dialog',
  templateUrl: './ezsign-confirmation-dialog.component.html',
  styleUrls: ['./ezsign-confirmation-dialog.component.scss']
})
export class EzsignConfirmationDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<EzsignConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) {
      dialogRef.disableClose = true;
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
