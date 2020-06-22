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
import { InfotrackerComponent } from './infotracker.component';
import { SafePipe } from '../ezsign/ezsign.component';
import { FormassignmentComponent } from './formassignment/formassignment.component';
import { InfoTrackerService } from './service/infotracker.service';
import { InfotrackeroptionsComponent } from './infotrackeroptions/infotrackeroptions.component';
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
  declarations: [InfotrackerComponent, FormassignmentComponent, InfotrackeroptionsComponent
  ],
  entryComponents: [FormassignmentComponent
    ],
  providers: [
  ESignGuard,
  InfoTrackerService
  ],
  exports: [ MatDatepickerModule]
})
export class InfoTrackerModule { }
