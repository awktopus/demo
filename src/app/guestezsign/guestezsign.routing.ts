import { AuthGuard } from './../core/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { GuestEzsignComponent } from './guestezsign.component';
import { ModuleWithProviders } from '@angular/core';

export const GuestEzsignRoutes: Routes = [
    {
        path: '',
        component: GuestEzsignComponent,
        data: {
            pageTitle: 'GuestEzsign',
        }
    }
];

export const GuestEZSignRouting: ModuleWithProviders = RouterModule.forChild(GuestEzsignRoutes);

