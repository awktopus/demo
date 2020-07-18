import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  MatDividerModule, MatTableModule, MatDialogModule,
  MatStepperModule, MatFormFieldModule, MatSortModule, MatDatepickerModule, MatNativeDateModule, MatMenuModule
} from '@angular/material';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { SharedBaseModule } from '../shared/shared.module';
import { ESignGuard } from '../esign/service/esignauth';
import { AgGridModule } from 'ag-grid-angular';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { InfoTrackerRouting } from './infotracker.routing';
import { InfotrackerComponent, InfoTrackSafePipe } from './infotracker.component';
import { FormassignmentComponent } from './formassignment/formassignment.component';
import { InfoTrackerService } from './service/infotracker.service';
import { InfotrackeroptionsComponent } from './infotrackeroptions/infotrackeroptions.component';
import { InfotrackerPdfPopupComponent } from './shared/infotracker-pdf-popup/infotracker-pdf-popup.component';
import { DesignatedusersComponent } from './designatedusers/designatedusers.component';
import { InfotrackerlocationsComponent } from './infotrackerlocations/infotrackerlocations.component';
import { AddupdatelocationComponent } from './infotrackerlocations/addupdatelocation/addupdatelocation.component';
import { ConfirmationDialogComponent } from '../esign/controls/shared/confirmation-dialog/confirmation-dialog.component';
import { InfotrackerConfirmDialogComponent } from './shared/infotracker-confirm-dialog/infotracker-confirm-dialog.component';
import { InfotrackerViewreportComponent } from './infotracker-viewreport/infotracker-viewreport.component';
import { InfotrackerGridcolpopupComponent } from './shared/infotracker-gridcolpopup/infotracker-gridcolpopup.component';
import { SelfreportComponent } from './selfreport/selfreport.component';
import { AdminreportComponent } from './adminreport/adminreport.component';
import { SelfreportsummaryComponent } from './selfreportsummary/selfreportsummary.component';
import { ViewReportRendererComponent } from './shared/ViewReportRenderer.component';
import { InfotrackeragreementComponent } from './shared/infotrackeragreement/infotrackeragreement.component';
import { InfotrackerEsignatureComponent } from './infotracker-esignature/infotracker-esignature.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ReportforothersComponent } from './reportforothers/reportforothers.component';
import { ReportforothersummaryComponent } from './reportforothersummary/reportforothersummary.component';
import { AddupdateuserComponent } from './reportforothers/addupdateuser/addupdateuser.component';
import { ViewDocumentRendererComponent } from './shared/ViewDocumentRenderer.component';
import { AdminreviewsummaryComponent } from './adminreviewsummary/adminreviewsummary.component';
@NgModule({
  imports: [
    CommonModule,
    InfoTrackerRouting,
    MatDividerModule,
    MatTableModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSortModule,
    CovalentLayoutModule,
    MatSortModule,
    MatTableModule,
    SharedBaseModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SignaturePadModule,
    MatProgressSpinnerModule, MatDialogModule, CurrencyMaskModule,
    AgGridModule.withComponents([ViewReportRendererComponent, ViewDocumentRendererComponent])
   ],
  declarations: [InfotrackerComponent, InfoTrackSafePipe,
     FormassignmentComponent, InfotrackeroptionsComponent,
     InfotrackerPdfPopupComponent, DesignatedusersComponent,
     InfotrackerlocationsComponent,
     AddupdatelocationComponent,
     InfotrackerConfirmDialogComponent,
     InfotrackerViewreportComponent, InfotrackerGridcolpopupComponent,
     InfotrackerGridcolpopupComponent, SelfreportComponent, AdminreportComponent,
     SelfreportsummaryComponent, ViewReportRendererComponent, ViewDocumentRendererComponent,
     InfotrackeragreementComponent, InfotrackerEsignatureComponent,
     ReportforothersComponent, ReportforothersummaryComponent, AddupdateuserComponent, AdminreviewsummaryComponent
  ],
  entryComponents: [FormassignmentComponent, InfotrackerPdfPopupComponent,
    DesignatedusersComponent, InfotrackerlocationsComponent,
    AddupdatelocationComponent, InfotrackerConfirmDialogComponent,
    InfotrackerViewreportComponent, InfotrackerGridcolpopupComponent,
    SelfreportComponent, AdminreportComponent, SelfreportsummaryComponent,
    InfotrackeragreementComponent, InfotrackerEsignatureComponent,
    ReportforothersComponent, AddupdateuserComponent, AdminreviewsummaryComponent
    ],
  providers: [
  ESignGuard,
  InfoTrackerService
  ],
  exports: [MatDatepickerModule]
})
export class InfoTrackerModule { }
