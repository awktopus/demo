import { HistoryComponent } from './controls/history/history.component';
import { EsignComponent, SafePipe } from './../esign/esign.component';
import { esignRouting } from './esign.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  MatDividerModule, MatTableModule,
  MatStepperModule, MatFormFieldModule, MatSortModule, MatDatepickerModule,
   MatNativeDateModule,
   MatTreeModule,
   MatIconModule,
   MatButtonModule
} from '@angular/material';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CasemainComponent } from './controls/casemain/casemain.component';
import { Step1panelComponent } from './controls/casemain/step1panel/step1panel.component';
import { Step2panelComponent } from './controls/casemain/step2panel/step2panel.component';
import { Step3panelComponent } from './controls/casemain/step3panel/step3panel.component';
import { Step5panelComponent } from './controls/casemain/step5panel/step5panel.component';
import { Step4panelComponent } from './controls/casemain/step4panel/step4panel.component';
import { EsigncaseComponent } from './controls/casemain/esigncase/esigncase.component';
import { AddnotepopupComponent } from './controls/history/addnotepopup/addnotepopup.component';
import { Cover1Component } from './controls/casemain/step3panel/coverletter/cover1/cover1.component';
import { PdfpopupComponent } from './controls/casemain/esigncase/pdfpopup/pdfpopup.component';
import { SharedBaseModule } from '../shared/shared.module';
import { ESignGuard } from './service/esignauth';
import { MycasesComponent } from './controls/mycases/mycases.component';
import { CasepdfComponent } from './controls/mycases/casepdf/casepdf.component';
import { CaseformComponent } from './controls/mycases/caseform/caseform.component';
import { CaseagreementComponent } from './controls/mycases/caseagreement/caseagreement.component';
import { CaseformviewComponent } from './controls/mycases/caseformview/caseformview.component';
import { CasesigcapComponent } from './controls/mycases/casesigcap/casesigcap.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { RejectreasonpopupComponent } from './controls/casemain/step4panel/rejectreasonpopup/rejectreasonpopup.component';
import { CoverletterComponent } from './controls/casemain/coverletter/coverletter.component';
import { NgxEditorModule } from 'ngx-editor';
import { EmailpopupComponent } from './controls/casemain/step2panel/emailpopup/emailpopup.component';
import { UploadscanpopupComponent } from './controls/casemain/step2panel/uploadscanpopup/uploadscanpopup.component';
import { ClientreminderComponent } from './controls/casemain/esigncase/clientreminder/clientreminder.component';
import { EsignSettingsComponent } from './controls/settings/esign-settings.component';
import { IdentityComponent } from './controls/settings/identity/identity.component';
import { IdentityQuestionsComponent } from './controls/settings/identity/identity-questions/identity-questions.component';
import { ClientAnswerComponent } from './controls/settings/identity/client-answer/client-answer.component';
import { SetClientAnswerComponent } from './controls/settings/identity/set-client-answer/set-client-answer.component';
import { NewidentityQuestionComponent } from './controls/settings/identity/newidentity-question/newidentity-question.component';
import { EmailsettingsComponent } from './controls/settings/emailsettings/emailsettings.component';
import { SignerselectionComponent } from './controls/casemain/esigncase/signerselection/signerselection.component';
import { AgGridModule } from 'ag-grid-angular';
import { RouterLinkRendererComponent } from './controls/history/RouterLinkRenderer.component';
import { ReminderRendererComponent } from './controls/history/ReminderRenderer.component';
import { NotesRendererComponent } from './controls/history/NotesRenderer.component';
import { NewCaseRendererComponent } from './controls/history/NewCaseRenderer.component';
import { GridColConfigPopupComponent } from './controls/history/gridcolpopup/grid-col-config-popup.component';
import { AuditpopupComponent } from './controls/history/auditpopup/auditpopup.component';
import { AuditRendererComponent } from './controls/history/AuditRenderer.component';
import { EditSigboxComponent } from './controls/casemain/editsigbox/editsigbox.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { CasetemplatesComponent } from './controls/history/casetemplates/casetemplates.component';
import { ConfirmationDialogComponent } from './controls/shared/confirmation-dialog/confirmation-dialog.component';
import { FilingStatusRendererComponent } from './controls/history/FilingStatusRenderer.component';
import { FilingstatuspopupComponent } from './controls/history/filingstatuspopup/filingstatuspopup.component';
import { ArchiveComponent } from './controls/archive/archive.component';
import { BulkarchiveComponent } from './controls/archive/bulkarchive/bulkarchive.component';
import { MoreOptionsRendererComponent } from './controls/history/MoreOptionsRenderer.component';
import { MoreOptionsRenderer2Component } from './controls/archive/MoreOptionsRenderer2.component';
import { BrowserModule } from '@angular/platform-browser';
import { SinglecasearchiveComponent } from './controls/archive/singlecasearchive/singlecasearchive.component';
@NgModule({
  imports: [
    CommonModule,
    esignRouting,
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
    AngularDraggableModule, MatTreeModule, MatIconModule, MatButtonModule,
    AgGridModule.withComponents([AuditRendererComponent, RouterLinkRendererComponent,
      ReminderRendererComponent, NotesRendererComponent, NewCaseRendererComponent,
    FilingStatusRendererComponent, MoreOptionsRendererComponent, MoreOptionsRenderer2Component]),
  ],
  declarations: [
    GridColConfigPopupComponent,
    AuditpopupComponent,
    AuditRendererComponent,
    RouterLinkRendererComponent,
    ReminderRendererComponent,
    NotesRendererComponent,
    EsignComponent,
    HistoryComponent,
    CasemainComponent,
    Step1panelComponent,
    Step2panelComponent,
    Step3panelComponent,
    Step5panelComponent,
    Step4panelComponent,
    EsigncaseComponent,
    AddnotepopupComponent,
    Cover1Component,
    PdfpopupComponent,
    SafePipe,
    MycasesComponent,
    CasepdfComponent,
    CaseformComponent,
    CaseagreementComponent,
    CaseformviewComponent,
    CasesigcapComponent,
    RejectreasonpopupComponent,
    CoverletterComponent,
    EmailpopupComponent,
    UploadscanpopupComponent,
    ClientreminderComponent,
    EsignSettingsComponent,
    IdentityComponent,
    IdentityQuestionsComponent,
    ClientAnswerComponent,
    SetClientAnswerComponent,
    NewidentityQuestionComponent,
    EmailsettingsComponent,
    SignerselectionComponent,
    EditSigboxComponent,
    NewCaseRendererComponent,
    CasetemplatesComponent,
    FilingStatusRendererComponent,
    FilingstatuspopupComponent,
    ArchiveComponent,
    BulkarchiveComponent, MoreOptionsRendererComponent, MoreOptionsRenderer2Component, SinglecasearchiveComponent
    ],
  entryComponents: [AddnotepopupComponent, Cover1Component, PdfpopupComponent,
     RejectreasonpopupComponent, EmailpopupComponent, UploadscanpopupComponent,
     ClientreminderComponent, ClientAnswerComponent, IdentityQuestionsComponent,
     SetClientAnswerComponent, NewidentityQuestionComponent, HistoryComponent,
     SignerselectionComponent,
    GridColConfigPopupComponent, AuditpopupComponent, EditSigboxComponent,
    CasetemplatesComponent, FilingstatuspopupComponent, ArchiveComponent,
    BulkarchiveComponent, MoreOptionsRendererComponent, MoreOptionsRenderer2Component, SinglecasearchiveComponent],
  providers: [
    ESignGuard,
    // AuthGuard,
    // EsignserviceService,
    // EsignuiserviceService
    CoverletterComponent,
    EditSigboxComponent
  ],
  exports: [SafePipe, MatDatepickerModule]
})
export class EsignModule { }
