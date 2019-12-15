import { AuthGuard } from './../core/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { EzsignComponent } from './ezsign.component';
import { ModuleWithProviders } from '@angular/core';
import { SenderdocumentsComponent } from './controls/senderdocuments/senderdocuments.component';
import { ReceiverdocumentsComponent } from './controls/receiverdocuments/receiverdocuments.component';
import { ESignGuard } from './../esign/service/esignauth';
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
        path: 'receiverdocuments',
        canActivate: [AuthGuard, ESignGuard],
        component: ReceiverdocumentsComponent
    }
];

export const EZSignRouting: ModuleWithProviders = RouterModule.forChild(EZSignRoutes);

