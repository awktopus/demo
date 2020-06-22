import { AuthGuard } from './../core/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { ESignGuard } from '../esign/service/esignauth';
import { InfotrackerComponent } from './infotracker.component';

export const InfoTrackerRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: InfotrackerComponent,
        data: {
            pageTitle: 'Info Tracker',
            canActivate: [AuthGuard]
        }
    },
    {
        path: 'home',
        canActivate: [AuthGuard, ESignGuard],
        component: InfotrackerComponent
    }
];

export const InfoTrackerRouting: ModuleWithProviders = RouterModule.forChild(InfoTrackerRoutes);

