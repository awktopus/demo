import { Routes, RouterModule } from '@angular/router';
import { GuestEzsignComponent } from './guestezsign.component';
import { ModuleWithProviders } from '@angular/core';
import { EzsignGuestDocComponent } from './guestdoc/guestdoc.component';
import { GuestEzsignGuard } from './service/guestezsignauth';

export const GuestEzsignRoutes: Routes = [
    {
        path: '',
        component: GuestEzsignComponent,
        data: {
            pageTitle: 'GuestEzsign',
        },
    } ,
    {
        path: 'guestdoc',
        canActivate: [GuestEzsignGuard],
        component: EzsignGuestDocComponent,
        data: {
            pageTitle: " Guest Ezsign Doc"
        }
    },
];

export const GuestEZSignRouting: ModuleWithProviders = RouterModule.forChild(GuestEzsignRoutes);

