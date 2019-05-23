import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../service/esignservice.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HistoryComponent } from '../history.component';

@Component({
  selector: 'app-addnotepopup',
  templateUrl: './addnotepopup.component.html',
  styleUrls: ['./addnotepopup.component.scss']
})
export class AddnotepopupComponent implements OnInit {

  mycaseId: string;
  notes: string;
  newnotes: string;
  splitLines: string[];
  historyref: HistoryComponent;
  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<AddnotepopupComponent>,
  ) { }

  ngOnInit() {
  }

  setCaseInfo(caseId: string, notes: string) {
    this.mycaseId = caseId;
    this.notes = notes;
    if (this.notes) {
      this.splitLines = this.notes.split(';');
    }
  }

  saveNotes() {
    console.log('----->', this.newnotes);
    this.service.saveNote(this.mycaseId, this.newnotes).subscribe(resp => {
      const rr = <{caseId: string, notes: string}> resp;
      if (this.historyref) {
      this.historyref.updateNotes(rr.caseId, rr.notes);
    }
    });
    this.dialogRef.close();
  }

  closeme() {
    this.dialogRef.close();
  }
}
