import { AuthGuard } from './../core/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { EsignComponent } from './esign.component';
import { ModuleWithProviders } from '@angular/core';
import { HistoryComponent } from './controls/history/history.component';
import { CasemainComponent } from './controls/casemain/casemain.component';
import { ESignGuard } from './service/esignauth';
import { MycasesComponent } from './controls/mycases/mycases.component';
import { CasepdfComponent } from './controls/mycases/casepdf/casepdf.component';
import { CaseformComponent } from './controls/mycases/caseform/caseform.component';
import { CaseagreementComponent } from './controls/mycases/caseagreement/caseagreement.component';
import { CaseformviewComponent } from './controls/mycases/caseformview/caseformview.component';
import { CasesigcapComponent } from './controls/mycases/casesigcap/casesigcap.component';
import { EsignSettingsComponent } from './controls/settings/esign-settings.component';
import { IdentityComponent } from './controls/settings/identity/identity.component';
import { EmailsettingsComponent } from './controls/settings/emailsettings/emailsettings.component';
import { ArchiveComponent } from './controls/archive/archive.component';
import { ReceivercasesComponent } from './controls/receivercases/receivercases.component';
export const esignRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: EsignComponent,
        data: {
            pageTitle: 'Esign',
            canActivate: [AuthGuard]
        }
    },
    {
        path: 'settings',
        canActivate: [AuthGuard, ESignGuard],
        component: EsignSettingsComponent
    },
    {
        path: 'history',
        canActivate: [AuthGuard, ESignGuard],
        component: HistoryComponent
    },
    {
        path: 'history/case/:caseId',
        canActivate: [AuthGuard, ESignGuard],
        component: CasemainComponent
    },
    {
        path: 'case/:caseId',
        canActivate: [AuthGuard, ESignGuard],
        component: CasemainComponent
    },
    {
        path: 'history/:type/:id',
        canActivate: [AuthGuard, ESignGuard],
        component: HistoryComponent
    },
    {
        path: 'mycases',
        canActivate: [AuthGuard, ESignGuard],
        component: MycasesComponent
    },
    {
        path: 'mycases/casepdf/:caseId',
        canActivate: [AuthGuard, ESignGuard],
        component: CasepdfComponent
    },
    {
        path: 'mycases/caseform/:caseId',
        canActivate: [AuthGuard, ESignGuard],
        component: CaseformComponent
    },
    {
        path: 'mycases/caseagreement/:caseId/:docId/:seq',
        canActivate: [AuthGuard, ESignGuard],
        component: CaseagreementComponent
    },
    {
        path: 'mycases/caseformview/:caseId/:docId/:seq',
        canActivate: [AuthGuard, ESignGuard],
        component: CaseformviewComponent
    },
    {
        path: 'mycases/casesigcap/:caseId/:docId/:seq/:signertype',
        canActivate: [AuthGuard, ESignGuard],
        component: CasesigcapComponent
    },
    {
        path: 'identity',
        canActivate: [AuthGuard, ESignGuard],
        component: IdentityComponent
    },
    {
        path: 'emailsettings',
        canActivate: [AuthGuard, ESignGuard],
        component: EmailsettingsComponent
    },
    {
        path: 'history/:type',
        canActivate: [AuthGuard, ESignGuard],
        component: HistoryComponent
    },
    {
        path: 'archive',
        canActivate: [AuthGuard, ESignGuard],
        component: ArchiveComponent
    },
    {
        path: 'archive/:type',
        canActivate: [AuthGuard, ESignGuard],
        component: ArchiveComponent
    },
    {
        path: 'receivercases',
        canActivate: [AuthGuard, ESignGuard],
        component: ReceivercasesComponent
    },
];

export const esignRouting: ModuleWithProviders = RouterModule.forChild(esignRoutes);

