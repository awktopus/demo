import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InfoTrackerService } from '../service/infotracker.service';
import { MatDialog, MatDialogRef, MatOptionSelectionChange, MatSelect } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ELCompanyStaff } from '../../esign/beans/ESignCase';
import { InfotrackerComponent } from '../infotracker.component';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-designatedusers',
  templateUrl: './designatedusers.component.html',
  styleUrls: ['./designatedusers.component.scss']
})
export class DesignatedusersComponent implements OnInit {
  desigUsers: ELCompanyStaff[];
  selDesigUsers: ELCompanyStaff[];
  cacheDesigUsers: ELCompanyStaff[];
  orgUnitName: string;
  isUsersLoaded = false;
  showUpdateUsersSpinner = false;
  infoTrackerRef: InfotrackerComponent;
  title: string;
  removable = true;
  emptySearchToken = '';
  designatedUserForm: FormGroup = new FormGroup({
    desigUserFormControl: new FormControl('')
  });
  @ViewChild("designatedUserInput") designatedUserInput: ElementRef;
  @ViewChild('focusField') focusField: MatSelect;
  constructor(private service: InfoTrackerService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, public dialogRef: MatDialogRef<DesignatedusersComponent>
  ) {
    this.selDesigUsers = [];
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log('Designated users ng on init');
    console.log(this.orgUnitName);

    this.service.GetOrgStaff(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID()).subscribe(results => {
        this.desigUsers = <ELCompanyStaff[]>results;
        this.cacheDesigUsers = <ELCompanyStaff[]>results;
        console.log('company staff');
        console.log(this.desigUsers);
        this.service.GetDesignatedOrgStaff(this.service.auth.getOrgUnitID(),
          this.service.auth.getUserID()).subscribe(results2 => {
            if (results2) {
            this.selDesigUsers = <ELCompanyStaff[]>results2;
            console.log('company designated staff');
            console.log(this.selDesigUsers);
            }
          });
        this.isUsersLoaded = true;
      });

      this.designatedUserForm.controls['desigUserFormControl'].valueChanges.subscribe(searchToken => {
        console.log('designated user search called')
        console.log('search Token:' + searchToken.trim())
        console.log('emptySearchToken');
        console.log(this.emptySearchToken);
        if (searchToken && typeof searchToken !== 'object') {
          if (this.emptySearchToken === searchToken.trim()) {
            return;
          } else {
            console.log('desinated user searching...');
            this.desigUsers = [];
            this.cacheDesigUsers.forEach(cc => {
              if ((cc.firstName && cc.firstName.toLowerCase().search(searchToken.toLowerCase()) !== -1) ||
                (cc.lastName && cc.lastName.toLowerCase().search(searchToken.toLowerCase()) !== -1)) {
                this.desigUsers.push(cc);
              }
            });
            console.log(this.desigUsers);
          }
        } else {
          this.desigUsers = <ELCompanyStaff[]>this.cacheDesigUsers;
        }
      });
  }

  setData(orgUnitName: string, title: string) {
    this.orgUnitName = orgUnitName;
    this.title = title;
  }

  addDesigUser(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add desig user value:');
    console.log(value);
    console.log(event);
    console.log('add desig users:');
    console.log(this.desigUsers);
    if ((value && event.isUserInput)) {
      let c: ELCompanyStaff = null;
      let ec: ELCompanyStaff = null;
      this.desigUsers.forEach(cc => { if (cc.employeeId === value) { c = cc; } });
      if (this.selDesigUsers) {
        this.selDesigUsers.forEach(cc => { if (cc.employeeId === c.employeeId) { ec = cc; } });
      } else {
        this.selDesigUsers = [];
      }
      if (!ec) {
        this.selDesigUsers.push(c);
      }
      this.designatedUserForm.controls['desigUserFormControl'].setValue('')
      this.designatedUserInput.nativeElement.value = "";
    }
  }

  removeDesigUser(c: ELCompanyStaff): void {
    console.log('remove company staff');
    const index = this.selDesigUsers.indexOf(c);
    if (index >= 0) {
      this.selDesigUsers.splice(index, 1);
    }
    this.desigUsers = <ELCompanyStaff[]>this.cacheDesigUsers;
  }

  desigUserfocusOut() {
    console.log('desigUserfocusOut event');
  }

  desigUserOnKey(event) {
    console.log('desigUserOnKey event');
  }

  updateDesinatedUsers() {
    this.showUpdateUsersSpinner = true;
    console.log('updateDesinatedUsers');
    console.log('orgUnitId:' + this.service.auth.getOrgUnitID());
    console.log('orgUnitName:' + this.orgUnitName);
    console.log('selected designated users');
    console.log(this.selDesigUsers);
    // let templateIds: number[] = [];
    // if (this.selDesigUsers) {
    //   this.newInfoTrackForms.forEach(cc => {
    //     if (cc.isOrgActiveForm) {
    //       templateIds.push(cc.templateId);
    //     }
    //   });
    // }
    // const assignFormjson = {
    //   templateIds: templateIds
    // };
    this.service.AddDesignatedStaff(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(),
      this.selDesigUsers).subscribe(resp => {
        console.log(resp);
        this.infoTrackerRef.addForm = false;
        this.infoTrackerRef.hasForms = true;
        this.infoTrackerRef.loadForms();
        this.dialogRef.close();
        this.showUpdateUsersSpinner = false;
      });
  }

  cancelPopup() {
    this.dialogRef.close();
  }
}
