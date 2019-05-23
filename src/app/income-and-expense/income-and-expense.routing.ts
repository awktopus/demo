import { AuthGuard } from './../core/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { ESignGuard } from '../esign/service/esignauth';
import { IncomeExpenseComponent } from './income-and-expense.component';
import { IncomeExpenseSettingsComponent } from './controls/settings/iet-settings.component';


export const IETRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: IncomeExpenseComponent,
        data: {
            pageTitle: 'Income and Expense',
            canActivate: [AuthGuard]
        }
    },
    {
        path: 'settings',
        canActivate: [AuthGuard, ESignGuard],
        component: IncomeExpenseSettingsComponent
    }
];

export const IETRouting: ModuleWithProviders = RouterModule.forChild(IETRoutes);

