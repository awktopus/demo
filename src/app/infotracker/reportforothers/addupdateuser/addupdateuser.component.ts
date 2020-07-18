import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CompanyType, ESignCPA, CompanyStaff, Company, InfoTrackLocation, InfoTrackerUser } from './../../../esign/beans/ESignCase';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InfoTrackerService } from '../../service/infotracker.service';
import { ReportforothersComponent } from '../reportforothers.component';
@Component({
  selector: 'app-addupdateuser',
  templateUrl: './addupdateuser.component.html',
  styleUrls: ['./addupdateuser.component.scss']
})
export class AddupdateuserComponent implements OnInit {

  showAddUserspinner = false;
  showEditUserspinner = false;
  operation: string;
  title: string;
  userRec: InfoTrackerUser;
  reportForOtherRef: ReportforothersComponent;

  firstName: string;
  lastName: string;
  emailId: string;
  phone: string;
  bardgeId: string;
  userForm: FormGroup = new FormGroup({
    firstNameFormControl: new FormControl('', Validators.required),
    lastNameFormControl: new FormControl('', Validators.required),
    emailIdFormControl: new FormControl(''),
    phoneFormControl: new FormControl(''),
    badgeIdFormControl: new FormControl('')
  });
  @ViewChild('focusField') focusField: ElementRef;

  constructor(private service: InfoTrackerService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, public dialogRef: MatDialogRef<AddupdateuserComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {

    if (this.operation === 'edituser' && this.userRec) {
      console.log('addupdate user ngOnInit()');
      console.log(this.operation);
      console.log(this.userRec);
      this.userForm.controls['firstNameFormControl'].setValue(this.userRec.firstName);
      this.userForm.controls['lastNameFormControl'].setValue(this.userRec.lastName);
      this.userForm.controls['emailIdFormControl'].setValue(this.userRec.emailId);
      this.userForm.controls['phoneFormControl'].setValue(this.userRec.phone);
      this.userForm.controls['badgeIdFormControl'].setValue(this.userRec.badgeId);
    }
    this.focusField.nativeElement.focus();
  }

  setData(operation: string, title: string, userRec: any) {
    this.operation = operation;
    this.title = title;
    this.userRec = userRec;
  }

  addUpdateUser() {
    this.showAddUserspinner = true;
    console.log('Add User');
    console.log('first Name:' + this.userForm.controls['firstNameFormControl'].value);
    console.log('last Name:' + this.userForm.controls['lastNameFormControl'].value);
    console.log('email Id:' + this.userForm.controls['emailIdFormControl'].value);
    console.log('phone:' + this.userForm.controls['phoneFormControl'].value);
    console.log('badge:' + this.userForm.controls['badgeIdFormControl'].value);
    const userJson = {
      firstName: this.userForm.controls['firstNameFormControl'].value,
      lastName: this.userForm.controls['lastNameFormControl'].value,
      emailId: this.userForm.controls['emailIdFormControl'].value,
      phone: this.userForm.controls['phoneFormControl'].value,
      badgeId: this.userForm.controls['badgeIdFormControl'].value
    };
    this.service.AddUpdateUser(this.service.auth.getOrgUnitID(), this.service.auth.getUserID(),
      userJson).subscribe(resp => {
        console.log(resp);
        this.reportForOtherRef.loadUsers();
        this.dialogRef.close();
        this.showAddUserspinner = false;
      });
  }

  cancelPopup() {
    this.dialogRef.close();
  }
}
