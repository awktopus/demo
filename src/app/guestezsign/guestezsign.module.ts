import { GuestEzsignComponent, SafePipe } from './guestezsign.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  MatDividerModule, MatTableModule,
  MatStepperModule, MatFormFieldModule, MatSortModule, MatDatepickerModule,
   MatNativeDateModule, MatMenuModule
} from '@angular/material';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { SharedBaseModule } from '../shared/shared.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { NgxEditorModule } from 'ngx-editor';
import { AgGridModule } from 'ag-grid-angular';
import { AngularDraggableModule } from 'angular2-draggable';
import { GuestEZSignRouting } from './guestezsign.routing';
import { GuestEzsignGuard} from './service/guestezsignauth';
import { GuestEZsignAuthService } from './service/guestezsignauth.service';
import { EzsignGuestDocComponent, DialogMissingDataMessageDialogComponent, DialogNoFormMessageDialogComponent } from './guestdoc/guestdoc.component';
@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatDividerModule,
    MatTableModule,
    MatStepperModule,
    MatFormFieldModule,
    // MDBBootstrapModule.forRoot(),
    SignaturePadModule,
    MatSortModule,
    CovalentLayoutModule,
    MatSortModule,
    MatTableModule,
    SharedBaseModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxEditorModule,
    MatProgressSpinnerModule,
    AngularDraggableModule,
    GuestEZSignRouting
  ],
  declarations: [
    GuestEzsignComponent,
    EzsignGuestDocComponent,
    DialogMissingDataMessageDialogComponent,
    DialogNoFormMessageDialogComponent,
    SafePipe,
    ],
  entryComponents: [ DialogMissingDataMessageDialogComponent,
    DialogNoFormMessageDialogComponent,],
  providers: [
    // AuthGuard,
    // EsignserviceService,
    // EsignuiserviceService
    DatePipe,
  ],
  exports: [SafePipe, MatDatepickerModule, MatMenuModule]
})
export class GuestEzsignModule { }
