import { AuthGuard } from './../core/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { EzsignComponent } from './ezsign.component';
import { ModuleWithProviders } from '@angular/core';
import { SenderdocumentsComponent } from './controls/senderdocuments/senderdocuments.component';
import { ESignGuard } from './../esign/service/esignauth';
import { AddfieldsComponent } from './controls/addfields/addfields.component';
import { MyEzsignDocsComponent } from './controls/myezsigndocs/myezsigndocs.component';
import { EzsignMainComponent } from './controls/ezsignmain/ezsignmain.component';
import { InvitesignersComponent } from './controls/invitesigners/invitesigners.component';
import { UploadDocumentComponent } from './controls/upload-document/upload-document.component';
export const EZSignRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: EzsignComponent,
        data: {
            pageTitle: 'EZSign',
            canActivate: [AuthGuard]
        }
    },
    {
        path: 'senderdocuments',
        canActivate: [AuthGuard, ESignGuard],
        component: SenderdocumentsComponent
    },
    {
        path: 'addfields',
        canActivate: [AuthGuard, ESignGuard],
        component: AddfieldsComponent
    },
    {
        path: 'addfields/:trackingId',
        canActivate: [AuthGuard, ESignGuard],
        component: AddfieldsComponent
    },
    {
        path: 'ezsigndocs',
        canActivate: [AuthGuard, ESignGuard],
        component: MyEzsignDocsComponent
    },
    {
        path: 'ezsignmain',
        canActivate: [AuthGuard, ESignGuard],
        component: EzsignMainComponent
    },
    {
        path: 'invite/:trackingId',
        canActivate: [AuthGuard, ESignGuard],
        component: InvitesignersComponent
    },
    {
        path: 'upload',
        canActivate: [AuthGuard, ESignGuard],
        component: UploadDocumentComponent
    }
];

export const EZSignRouting: ModuleWithProviders = RouterModule.forChild(EZSignRoutes);

