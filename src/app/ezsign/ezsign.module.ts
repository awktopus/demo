import { EzsignComponent, SafePipe} from './../ezsign/ezsign.component';
import { EZSignRouting } from './ezsign.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ESignGuard } from './../esign/service/esignauth';
import { ReceiverdocumentsComponent } from './controls/receiverdocuments/receiverdocuments.component';
import { SenderdocumentsComponent } from './controls/senderdocuments/senderdocuments.component';
import { UploadDocumentComponent } from './controls/upload-document/upload-document.component';
import { DragDropDirective } from './../ezsign/controls/upload-document/drag-drop.directive';
import { AddsignersComponent } from './controls/addsigners/addsigners.component';
import { EzsigndataService } from './service/ezsigndata.service';
import { EzsignConfirmationDialogComponent } from './controls/shared/ezsign-confirmation-dialog/ezsign-confirmation-dialog.component';
import { EzsignHistoryButtonRendererComponent } from './controls/Ezsignhistorybutton-renderer.component';
import { AddfieldsComponent } from './controls/addfields/addfields.component';
import { ResizableModule } from 'angular-resizable-element';
import { InvitesignersComponent } from './controls/invitesigners/invitesigners.component';
import { EzsignAddSignersButtonRendererComponent } from './controls/Ezsignaddsignersbutton-renderer.component';
import { EzsignDeleteButtonRendererComponent } from './controls/Ezsigndeletebutton-renderer.component';
import { DocumenthistoryComponent } from './controls/senderdocuments/documenthistory/documenthistory.component';
import { RouterLinkRendererComponent } from '../esign/controls/history/RouterLinkRenderer.component';
import { EzsignLinkRendererComponent } from './controls/EzsignLinkRenderer.component';
import { EzsignViewButtonRendererComponent } from './controls/Ezsignviewbutton-renderer.component';
import { EzsignPdfPopupComponent } from './controls/shared/ezsign-pdf-popup/ezsign-pdf-popup.component';
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
    AgGridModule.withComponents([EzsignHistoryButtonRendererComponent,
      EzsignAddSignersButtonRendererComponent, EzsignDeleteButtonRendererComponent,
      EzsignViewButtonRendererComponent,
    EzsignLinkRendererComponent]),
    ResizableModule
  ],
  declarations: [
    EzsignComponent,
    SafePipe,
    SenderdocumentsComponent,
    ReceiverdocumentsComponent,
    UploadDocumentComponent,
    DragDropDirective,
    UploadDocumentComponent,
    AddsignersComponent,
    EzsignConfirmationDialogComponent,
    EzsignAddSignersButtonRendererComponent,
    EzsignDeleteButtonRendererComponent,
    EzsignHistoryButtonRendererComponent,
    EzsignViewButtonRendererComponent,
    AddfieldsComponent,
    InvitesignersComponent,
    DocumenthistoryComponent,
    EzsignLinkRendererComponent,
    EzsignPdfPopupComponent
    ],
  entryComponents: [AddsignersComponent, UploadDocumentComponent, EzsignPdfPopupComponent,
    EzsignConfirmationDialogComponent, InvitesignersComponent, DocumenthistoryComponent],
  providers: [
    ESignGuard,
    EzsigndataService
    // AuthGuard,
    // EsignserviceService,
    // EsignuiserviceService
  ],
  exports: [SafePipe, MatDatepickerModule, MatMenuModule]
})
export class EZSignModule { }
