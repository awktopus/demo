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
    MatProgressSpinnerModule, MatDialogModule, CurrencyMaskModule
   ],
  declarations: [InfotrackerComponent, InfoTrackSafePipe,
     FormassignmentComponent, InfotrackeroptionsComponent,
     InfotrackerPdfPopupComponent, DesignatedusersComponent,
     InfotrackerlocationsComponent,
     AddupdatelocationComponent,
     InfotrackerConfirmDialogComponent
  ],
  entryComponents: [FormassignmentComponent, InfotrackerPdfPopupComponent,
    DesignatedusersComponent, InfotrackerlocationsComponent,
    AddupdatelocationComponent, InfotrackerConfirmDialogComponent
    ],
  providers: [
  ESignGuard,
  InfoTrackerService
  ],
  exports: [MatDatepickerModule]
})
export class InfoTrackerModule { }
