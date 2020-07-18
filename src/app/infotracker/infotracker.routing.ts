import { AuthGuard } from './../core/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { ESignGuard } from '../esign/service/esignauth';
import { InfotrackerComponent } from './infotracker.component';
import { InfotrackerViewreportComponent } from './infotracker-viewreport/infotracker-viewreport.component';
import { AdminreportComponent } from './adminreport/adminreport.component';
import { ReportforothersummaryComponent } from './reportforothersummary/reportforothersummary.component';

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
    },
    {
        path: 'userreport/:templateId',
        canActivate: [AuthGuard, ESignGuard],
        component: InfotrackerViewreportComponent
    },
    {
        path: 'adminreport',
        canActivate: [AuthGuard, ESignGuard],
        component: AdminreportComponent
    },
    {
        path: 'othersreport/:templateId',
        canActivate: [AuthGuard, ESignGuard],
        component: ReportforothersummaryComponent
    }
];

export const InfoTrackerRouting: ModuleWithProviders = RouterModule.forChild(InfoTrackerRoutes);

