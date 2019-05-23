import {Component, Inject, OnInit , ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-grid-col-config-popup',
  templateUrl: './grid-col-config-popup.component.html',
  styleUrls: ['./grid-col-config-popup.component.scss']
})
export class GridColConfigPopupComponent implements OnInit {
  api: any;
  cols: any;
  constructor(
    public dialogRef: MatDialogRef<GridColConfigPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
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
