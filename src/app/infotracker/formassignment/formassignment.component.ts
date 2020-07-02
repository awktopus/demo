import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { InfoTrackerService } from '../service/infotracker.service';
import { InfotrackerComponent } from '../infotracker.component';
import { InfoTrackForm, ELCompanyStaff } from '../../esign/beans/ESignCase';
import { SelectionModel } from '@angular/cdk/collections';
import { InfotrackerPdfPopupComponent } from '../shared/infotracker-pdf-popup/infotracker-pdf-popup.component';

@Component({
  selector: 'app-formassignment',
  templateUrl: './formassignment.component.html',
  styleUrls: ['./formassignment.component.scss']
})
export class FormassignmentComponent implements OnInit {

  infoTrackerRef: InfotrackerComponent;
  operation: string;
  orgUnitName: string;
  orgUnitId: string;
  itform: InfoTrackForm = null;
  ITID = '';
  itForm_var = '';
  infoTrackForms: InfoTrackForm[];
  cacheInfoTrackForms: InfoTrackForm[];
  selectedInfoTrackForms: InfoTrackForm[];
  removable = true;
  showAssignFormspinner = false;
  showEditFormsspinner = false;
  isFormsLoaded = false;
  desigUsers: ELCompanyStaff[];
  selDesigUsers: ELCompanyStaff[];
  cacheDesigUsers: ELCompanyStaff[];
  title: string;
  displayedColumns: string[] = ['select', 'formName',
    'viewForm'];
  newInfoTrackForms: InfoTrackForm[];
  assignmentForm: FormGroup = new FormGroup({
    orgNameFormControl: new FormControl(''),
    itFormControl: new FormControl(''),
    desigUserFormControl: new FormControl('')
  });
  @ViewChild('focusField') focusField: ElementRef;
  @ViewChild('itFormInput') itFormInput: ElementRef;
  constructor(private service: InfoTrackerService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router, public dialogRef: MatDialogRef<FormassignmentComponent>
  ) {
    this.selectedInfoTrackForms = [];
    this.newInfoTrackForms = [];
    this.selDesigUsers = [];
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log('Form assignment ng on init');
    console.log(this.operation);
    console.log(this.orgUnitName);
    console.log(this.orgUnitId);
    this.assignmentForm.controls['orgNameFormControl'].setValue(this.orgUnitName);

    this.service.GetOrgAllInfoTrackForms(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID()).subscribe(resp => {
        this.newInfoTrackForms = <InfoTrackForm[]>resp;
       console.log('selected newInfoTrackForms');
        console.log(this.newInfoTrackForms);
        if (this.operation !== 'editform') {
          if (this.newInfoTrackForms) {
            this.newInfoTrackForms.forEach(cc => {
              if (cc.isDefaultCheckedForm === true) {
                cc.isOrgActiveForm = true;
              }
            });
          }
        }
         this.isFormsLoaded = true;
      });

    this.service.GetOrgInfoTrackForms(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID()).subscribe(resp => {
        this.selectedInfoTrackForms = <InfoTrackForm[]>resp;
        console.log('selected info track forms');
        console.log(this.selectedInfoTrackForms);
      });


    this.service.GetInfoTrackFormTemplates(this.service.auth.getUserID()).subscribe(resp => {
      this.infoTrackForms = <InfoTrackForm[]>resp;
      this.cacheInfoTrackForms = <InfoTrackForm[]>resp;
      console.log('info track forms');
      console.log(this.infoTrackForms);
      console.log('cache info track forms');
      console.log(this.cacheInfoTrackForms);
    });

    this.service.GetOrgStaff(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID()).subscribe(results => {
        this.desigUsers = <ELCompanyStaff[]>results;
        this.cacheDesigUsers = <ELCompanyStaff[]>results;
        console.log('company staff');
        console.log(this.desigUsers);
      });

  }

  setData(operation: string, title: string, orgUnitName: string, orgUnitId: string) {
    this.operation = operation;
    this.orgUnitName = orgUnitName;
    this.orgUnitId = orgUnitId;
    this.title = title;
  }

  itFormValidator(): ValidatorFn {
    console.log("itFormValidator");
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const itFrm = control.value;
      console.log('itFrm:' + itFrm);
      if (itFrm === null || itFrm === '') {
        return { 'itForm': false };
      } else {
        return null;
      }
    };
  }

  itFormfocusOut() {
    console.log('itFormfocusOut event');
  }

  itFormOnKey(event) {
    console.log('secondarySignerOnKey event');
  }

  addInfoTrackForm(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add info track form value:');
    console.log(value);
    console.log(event);
    console.log('add info track forms:');
    console.log(this.infoTrackForms);
    if ((value && event.isUserInput)) {
      let c: InfoTrackForm = null;
      let ec: InfoTrackForm = null;
      this.infoTrackForms.forEach(cc => { if (cc.templateId === value) { c = cc; } });
      if (this.selectedInfoTrackForms) {
        this.selectedInfoTrackForms.forEach(cc => { if (cc.templateId === c.templateId) { ec = cc; } });
      } else {
        this.selectedInfoTrackForms = [];
      }
      if (!ec) {
        this.selectedInfoTrackForms.push(c);
      }
    }
  }

  removeInfoTrackForm(c: InfoTrackForm): void {
    console.log('remove infor track form');
    const index = this.selectedInfoTrackForms.indexOf(c);
    if (index >= 0) {
      this.selectedInfoTrackForms.splice(index, 1);
    }
    this.infoTrackForms = <InfoTrackForm[]>this.cacheInfoTrackForms;
  }

  assignInfoTrackForm() {
    this.showAssignFormspinner = true;
    console.log('assignInfoTrackForm');
    console.log('orgUnitId:' + this.orgUnitId);
    console.log('orgUnitName:' + this.orgUnitName);
    console.log(this.infoTrackForms);
    console.log()
    let templateIds: number[] = [];
    if (this.newInfoTrackForms) {
      this.newInfoTrackForms.forEach(cc => {
        if (cc.isOrgActiveForm) {
          templateIds.push(cc.templateId);
        }
      });
    }
    const assignFormjson = {
      templateIds: templateIds,
      OrgUnitName: this.orgUnitName
    };
    console.log(assignFormjson);
    this.service.ActivateInfoTrack(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(),
      assignFormjson).subscribe(resp => {
        console.log(resp);
        this.infoTrackerRef.addForm = false;
        this.infoTrackerRef.hasForms = true;
        this.infoTrackerRef.loadForms();
        this.dialogRef.close();
        this.showAssignFormspinner = false;
      });
  }

  selectForm(event, selFormRow: any) {
    console.log('selected a form');
    console.log(event);
    console.log('selected form row');
    console.log(selFormRow);
    if (selFormRow) {
      this.newInfoTrackForms.forEach(cc => {
        if (cc.templateId === selFormRow.templateId) {
          cc.isOrgActiveForm = event.checked;
        } else {
          if (event.checked === true) {
            cc.isOrgActiveForm = false;
          }
        }
      });
    }
    console.log('changed form list');
    console.log(this.newInfoTrackForms);
  }
  cancelActivatePopup() {
    this.dialogRef.close();
  }

  viewForm(templateId: number) {
    console.log('viewForm');
    console.log(templateId);
    let tTemplateId: number;
    tTemplateId = Number(templateId);
    const dialogRef = this.dialog.open(InfotrackerPdfPopupComponent, { width: '520pt' });
    dialogRef.componentInstance.setPDF(this.service.auth.baseurl +
      '/infotracker/orgunit/' + this.service.auth.getOrgUnitID() +
      '/employee/' + this.service.auth.getUserID() +
      '/formtemplate/' + tTemplateId + '/helpcontent');
  }
}

