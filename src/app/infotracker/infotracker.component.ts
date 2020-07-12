import { Component, OnInit, ViewChild, AfterViewInit, PipeTransform, Pipe } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormControl } from '@angular/forms';
import { resolveRendererType2 } from '@angular/core/src/view/util';
import { EsignserviceService } from '../esign/service/esignservice.service';
import { EsignuiserviceService } from '../esign/service/esignuiservice.service';
import { InfoTrackerService } from './service/infotracker.service';
import { FormassignmentComponent } from './formassignment/formassignment.component';
import { InfoTrackForm } from '../esign/beans/ESignCase';
import { DesignatedusersComponent } from './designatedusers/designatedusers.component';
import { DomSanitizer } from '@angular/platform-browser';
import { InfotrackerlocationsComponent } from './infotrackerlocations/infotrackerlocations.component';
import { InfotrackerViewreportComponent } from './infotracker-viewreport/infotracker-viewreport.component';
import { SelfreportComponent } from './selfreport/selfreport.component';
import { StringMapWithRename } from '@angular/core/src/render3/jit/compiler_facade_interface';

@Component({
  selector: 'app-infotracker',
  templateUrl: './infotracker.component.html',
  styleUrls: ['./infotracker.component.scss']
})
export class InfotrackerComponent implements OnInit, AfterViewInit {
  hasForms = false;
  addForm = false;
  isITDataFetched = false;
  orgInfoTrackForms: InfoTrackForm[];
  formName: string;
  displayedColumns: string[] = ['formName', 'selfReport', 'view'];
  // displayedColumns: string[] = ['formName', 'submitForm',
  // 'viewReport', 'options', 'delete'];
  userRole: string;
  constructor(private service: InfoTrackerService, public dialog: MatDialog, private route: ActivatedRoute,
    private router: Router,
    private uiservice: EsignuiserviceService
  ) { }

  ngAfterViewInit() {
  }

  ngOnInit() {
    console.log('Info track init');
    console.log('actual role');
    this.userRole = this.service.auth.getUserRole();
    console.log(this.userRole);
    if (typeof this.userRole === "undefined" || this.userRole === null) {
      this.userRole = 'ADMIN';
    } else {
      this.userRole = this.userRole.toUpperCase();
    }
    console.log('converted role');
    console.log(this.userRole);
    this.service.GetOrgInfoTrackForms(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID()).subscribe(resp => {
        console.log('Info track forms');
        console.log(resp);
        this.orgInfoTrackForms = resp;
        if (this.orgInfoTrackForms) {
          this.hasForms = true;
        } else {
          this.hasForms = false;
        }
        this.isITDataFetched = true;
      });
  }

  activateInfoTrackFunction() {
    console.log('activateInfoTrackFunction:');
    const dialogRef = this.dialog.open(FormassignmentComponent, {
      width: '900px', height: '600px'
    });
    dialogRef.componentInstance.infoTrackerRef = this;
    dialogRef.componentInstance.setData('activate', "COVID-19 Information Tracker Activation", this.service.auth.getOrgUnitName(),
      this.service.auth.getUserID());
  }

  addRemoveForms() {
    console.log('addRemoveForms:');
    const dialogRef = this.dialog.open(FormassignmentComponent, {
      width: '900px', height: '600px'
    });
    dialogRef.componentInstance.infoTrackerRef = this;
    dialogRef.componentInstance.setData('editform', "Information Tracker Form Configuration", this.service.auth.getOrgUnitName(),
      this.service.auth.getUserID());
  }

  loadForms() {
    console.log('load forms');
    this.service.GetOrgInfoTrackForms(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID()).subscribe(resp => {
        console.log('Info track forms');
        console.log(resp);
        this.orgInfoTrackForms = resp;
        if (this.orgInfoTrackForms) {
          this.hasForms = true;
        } else {
          this.hasForms = false;
        }
      });
  }

  selfReport(templateId: number) {
    console.log('self report:');
    console.log(templateId);
    const dialogRef = this.dialog.open(SelfreportComponent, {
      width: '700px', height: '950px'
    });
    dialogRef.componentInstance.infoTrackerRef = this;
    dialogRef.componentInstance.setData(templateId);
  }

  view(templateId: string, formName: string) {
    console.log('view');
    console.log(templateId);
    console.log(formName);
    this.formName = formName;
    //   const dialogRef = this.dialog.open(InfotrackerViewreportComponent, {
    //      width: '1200px'
    //    });
    //  dialogRef.componentInstance.infoTrackerRef = this;
    //  dialogRef.componentInstance.setData(templateId, formName);
    const url = 'main/infotracker/userreport/' + templateId;
    this.router.navigateByUrl(url);
  }

  openConfirmationDialogforCompanyDeletion(templateId: string): void {
    //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //     width: '450px', height: '150px',
    //     data: "Do you confirm the deletion of this company?"
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       console.log('Yes clicked');
    //        this.deleteCompany(cmpnyId);
    //     }
    //   });
  }

  manageDesignatedUsers() {
    console.log('manageDesignatedUsers:');
    const dialogRef = this.dialog.open(DesignatedusersComponent, {
      width: '900px', height: '600px'
    });
    dialogRef.componentInstance.infoTrackerRef = this;
    dialogRef.componentInstance.setData(this.service.auth.getOrgUnitName(), "Add/Update Designated Users");
  }

  manageLocations() {
    console.log('manageLocations:');
    const dialogRef = this.dialog.open(InfotrackerlocationsComponent, {
      width: '900px', height: '600px'
    });
    dialogRef.componentInstance.infoTrackerRef = this;
    dialogRef.componentInstance.setData("Add/Update Organization Location",
      this.service.auth.getOrgUnitName());
  }

  adminDashboard() {
    console.log('adminDashboard');
    const url = 'main/infotracker/adminreport';
    this.router.navigateByUrl(url);
  }

}

@Pipe({ name: 'safe' })
export class InfoTrackSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
