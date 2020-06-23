import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CompanyType, ESignCPA, CompanyStaff, Company, InfoTrackLocation } from './../../../esign/beans/ESignCase';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InfoTrackerService } from '../../service/infotracker.service';
import { InfotrackerlocationsComponent } from '../infotrackerlocations.component';
@Component({
  selector: 'app-addupdatelocation',
  templateUrl: './addupdatelocation.component.html',
  styleUrls: ['./addupdatelocation.component.scss']
})
export class AddupdatelocationComponent implements OnInit {
  showAddLocationspinner = false;
  showEditLocationspinner = false;
  operation: string;
  title: string;
  locRec: InfoTrackLocation;
  locSequenceNo: any;
  infoTrackerLocRef: InfotrackerlocationsComponent;
  locationName: string;
  address: string;
  zipCode: string;
  locationForm: FormGroup = new FormGroup({
    locationNameFormControl: new FormControl('', Validators.required),
    addressFormControl: new FormControl('', Validators.required),
    zipCodeFormControl: new FormControl('', Validators.required)
  });
  @ViewChild('focusField') focusField: ElementRef;

  constructor(private service: InfoTrackerService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, public dialogRef: MatDialogRef<AddupdatelocationComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

    if (this.operation === 'editlocation' && this.locRec) {
      console.log('addupdate location ngOnInit()');
      console.log(this.operation);
      console.log(this.locRec);
      this.locationName = this.locRec.geoLocation;
      this.address = this.locRec.address;
      this.zipCode = this.locRec.zipCode;
      this.locSequenceNo = this.locRec.locSeqNo;
      this.focusField.nativeElement.focus();
    }
  }

  setData(operation: string, title: string, locRec: any) {
    this.operation = operation;
    this.title = title;
    this.locRec = locRec;
  }

  addUpdateLocation() {
   this.showAddLocationspinner = true;
    console.log('Add location');
    console.log('locaiton Name:' + this.locationForm.controls['locationNameFormControl'].value);
    console.log('address:' + this.locationForm.controls['addressFormControl'].value);
    console.log('zip code:' + this.locationForm.controls['zipCodeFormControl'].value);

    const locationJson = {
      geoLocation: this.locationForm.controls['locationNameFormControl'].value,
      address: this.locationForm.controls['addressFormControl'].value,
      zipCode: this.locationForm.controls['zipCodeFormControl'].value,
      locSeqNo: this.locSequenceNo,
      orgUnitId: this.service.auth.getOrgUnitID()
    };
    this.service.AddUpdateLocation(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
    locationJson).subscribe(resp => {
      console.log(resp);
      this.infoTrackerLocRef.loadLocations();
      this.dialogRef.close();
      this.showAddLocationspinner = false;
    });
  }

  cancelPopup() {
    this.dialogRef.close();
  }
}
