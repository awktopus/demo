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
import { SharedBaseModule } from '../../shared/shared.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { NgxEditorModule } from 'ngx-editor';
import { AgGridModule } from 'ag-grid-angular';
import { AngularDraggableModule } from 'angular2-draggable';
import { GuestEZSignRouting } from './guestezsign.routing';
import { GuestEzsignGuard} from './service/guestezsignauth';
import { GuestEZsignAuthService } from './service/guestezsignauth.service';
// tslint:disable-next-line:max-line-length
import {  DialogNoFormMessageDialogComponent, DialogCompletedEzsignComponent } from './guestdoc/guestdoc.component';
import { EzsignGuestDocComponent, DialogMissingDataMessageDialogComponent, } from './guestdoc/guestdoc.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
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
    GuestEZSignRouting,
    PdfViewerModule
  ],
  declarations: [
    GuestEzsignComponent,
    EzsignGuestDocComponent,
    DialogMissingDataMessageDialogComponent,
    DialogNoFormMessageDialogComponent,
    DialogCompletedEzsignComponent,
    SafePipe,
    ],
  entryComponents: [ DialogMissingDataMessageDialogComponent,
    DialogNoFormMessageDialogComponent, DialogCompletedEzsignComponent],
  providers: [
    // AuthGuard,
    // EsignserviceService,
    // EsignuiserviceService
    DatePipe,
  ],
  exports: [SafePipe, MatDatepickerModule, MatMenuModule]
})
export class GuestEzsignModule { }
