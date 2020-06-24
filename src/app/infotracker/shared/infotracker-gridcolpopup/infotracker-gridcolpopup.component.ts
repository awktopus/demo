import {Component, Inject, OnInit , ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-infotracker-gridcolpopup',
  templateUrl: './infotracker-gridcolpopup.component.html',
  styleUrls: ['./infotracker-gridcolpopup.component.scss']
})
export class InfotrackerGridcolpopupComponent implements OnInit {

  api: any;
  cols: any;
  constructor(
    public dialogRef: MatDialogRef<InfotrackerGridcolpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
      console.log(data);
        this.api = data;
        this.cols = data.cols;
    }

  ngOnInit() {
  }

  closeme(): void {
    this.dialogRef.close();
  }

  selCol (ev,  col) {
    console.log(ev);
    console.log(col);
    if (ev.checked) {
      this.api.columnApi.setColumnVisible(col.colId, true);
      col.checked = true;
    } else {
      this.api.columnApi.setColumnVisible(col.colId, false);
      col.checked = false;
    }
    /*
    this.api.cols.forEach(cc => {
      if (cc.colID === col.colId) {
        cc.checked = ev.checked;
      }
    });
    */
  }
}
