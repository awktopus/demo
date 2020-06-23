import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { InfoTrackerService } from '../service/infotracker.service';
import { InfotrackerComponent } from '../infotracker.component';
import { InfoTrackForm, ELCompanyStaff, InfoTrackLocation } from '../../esign/beans/ESignCase';
import { SelectionModel } from '@angular/cdk/collections';
import { InfotrackerPdfPopupComponent } from '../shared/infotracker-pdf-popup/infotracker-pdf-popup.component';
import { AddupdatelocationComponent } from './addupdatelocation/addupdatelocation.component';
import { InfotrackerConfirmDialogComponent } from '../shared/infotracker-confirm-dialog/infotracker-confirm-dialog.component';

@Component({
  selector: 'app-infotrackerlocations',
  templateUrl: './infotrackerlocations.component.html',
  styleUrls: ['./infotrackerlocations.component.scss']
})
export class InfotrackerlocationsComponent implements OnInit {

  title: string;
  orgUnitName: string;
  locationData: InfoTrackLocation[];
  infoTrackerRef: InfotrackerComponent;
  isLocationsLoaded = false;
  displayedColumns: string[] = ['location', 'address',
  'zipCode', 'edit', 'delete'];
  constructor(private service: InfoTrackerService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, public dialogRef: MatDialogRef<InfotrackerlocationsComponent>) {
      dialogRef.disableClose = true;
     }

  ngOnInit() {

    this.service.GetOrgLocations(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID()).subscribe(resp => {
        this.locationData = <InfoTrackLocation[]>resp;
        console.log('location data');
        console.log(this.locationData);
        this.isLocationsLoaded = true;
      });


  }


  setData(title: string, orgUnitName: string) {
    this.orgUnitName = orgUnitName;
    this.title = title;
  }

  loadLocations() {
    this.service.GetOrgLocations(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID()).subscribe(resp => {
        this.locationData = <InfoTrackLocation[]>resp;
        console.log('location data');
        console.log(this.locationData);
        this.isLocationsLoaded = true;
      });
  }
  addLocation() {
    console.log('addLocation:');
    const dialogRef = this.dialog.open(AddupdatelocationComponent, {
      width: '700px', height: '500px'
    });
    dialogRef.componentInstance.infoTrackerLocRef = this;
    dialogRef.componentInstance.setData("addlocation", "Add Location", null);
   }

  updateLocation(row: any) {
    console.log('updateLocation:');
    const dialogRef = this.dialog.open(AddupdatelocationComponent, {
      width: '700px', height: '500px'
    });
    dialogRef.componentInstance.infoTrackerLocRef = this;
    dialogRef.componentInstance.setData("editlocation", "Update Location", row);
   }

   openConfirmationDialogforLocationDeletion(locationSeqNo: number): void {
    const dialogRef = this.dialog.open(InfotrackerConfirmDialogComponent, {
      width: '450px', height: '150px',
      data: "Do you confirm the deletion of this location?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
         this.deleteLocation(locationSeqNo);
      }
    });
  }
  deleteLocation(locationSeqNo: number) {
      console.log('deleteLocation:' + locationSeqNo);
      this.service.DeleteLocation(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), locationSeqNo).subscribe(resp => {
        console.log(resp);
        this.loadLocations();
      });
  }
  cancelPopup() {
    this.dialogRef.close();
  }
}
