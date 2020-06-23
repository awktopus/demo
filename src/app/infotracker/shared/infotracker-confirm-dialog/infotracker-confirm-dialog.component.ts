import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-infotracker-confirm-dialog',
  templateUrl: './infotracker-confirm-dialog.component.html',
  styleUrls: ['./infotracker-confirm-dialog.component.scss']
})
export class InfotrackerConfirmDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<InfotrackerConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) {
      dialogRef.disableClose = true;
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
