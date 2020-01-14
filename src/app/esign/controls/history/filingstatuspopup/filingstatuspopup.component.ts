import { Component, OnInit } from '@angular/core';
import { HistoryComponent } from '../history.component';
import { EsignserviceService } from '../../../service/esignservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-filingstatuspopup',
  templateUrl: './filingstatuspopup.component.html',
  styleUrls: ['./filingstatuspopup.component.scss']
})
export class FilingstatuspopupComponent implements OnInit {

  mycaseId: string;
  status: string;
  historyref: HistoryComponent;

  filingStatusForm: FormGroup = new FormGroup({
    statusFormControl: new FormControl('', Validators.required)
  });

  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<FilingstatuspopupComponent>,
  ) { }

  ngOnInit() {
  }

  setData(caseId: string) {
    this.mycaseId = caseId;
  }

  updateCaseFilingStatus() {
    console.log('save filing status');
    this.service.changeCaseStatus(this.mycaseId,
      this.filingStatusForm.controls['statusFormControl'].value).subscribe(resp => {
        if (resp) {
          if (this.historyref) {
            this.historyref.updateGridCaseFilingStatus(this.mycaseId,
              this.filingStatusForm.controls['statusFormControl'].value);
              this.dialogRef.close();
          } else {
            this.dialogRef.close();
          }
        } else {
          this.dialogRef.close();
        }
      });
  }

  closeme() {
    this.dialogRef.close();
  }

}
