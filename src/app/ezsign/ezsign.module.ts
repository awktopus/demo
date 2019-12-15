import { EzsignComponent, SafePipe} from './../ezsign/ezsign.component';
import { EZSignRouting } from './ezsign.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  MatDividerModule, MatTableModule,
  MatStepperModule, MatFormFieldModule, MatSortModule, MatDatepickerModule,
   MatNativeDateModule
} from '@angular/material';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { SharedBaseModule } from '../shared/shared.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { NgxEditorModule } from 'ngx-editor';
import { AgGridModule } from 'ag-grid-angular';
import { AngularDraggableModule } from 'angular2-draggable';
import { ESignGuard } from './../esign/service/esignauth';
import { ReceiverdocumentsComponent } from './controls/receiverdocuments/receiverdocuments.component';
import { SenderdocumentsComponent } from './controls/senderdocuments/senderdocuments.component';
import { UploadDocumentComponent } from './controls/upload-document/upload-document.component';
import { DragDropDirective } from './../ezsign/controls/upload-document/drag-drop.directive';
@NgModule({
  imports: [
    CommonModule,
    EZSignRouting,
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
    AgGridModule.withComponents([])
  ],
  declarations: [
    EzsignComponent,
    SafePipe,
    SenderdocumentsComponent,
    ReceiverdocumentsComponent,
    UploadDocumentComponent,
    DragDropDirective,
    UploadDocumentComponent
    ],
  entryComponents: [],
  providers: [
    ESignGuard,
    // AuthGuard,
    // EsignserviceService,
    // EsignuiserviceService
  ],
  exports: [SafePipe, MatDatepickerModule]
})
export class EZSignModule { }
