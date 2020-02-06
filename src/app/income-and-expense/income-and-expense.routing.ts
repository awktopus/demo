import { AuthGuard } from './../core/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { ESignGuard } from '../esign/service/esignauth';
import { IncomeExpenseComponent } from './income-and-expense.component';
import { IncomeExpenseSettingsComponent } from './controls/settings/iet-settings.component';
import { IetViewreportComponent } from './controls/iet-viewreport/iet-viewreport.component';


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
        path: 'viewreport/:companyId',
        canActivate: [AuthGuard, ESignGuard],
        component: IetViewreportComponent
    },
    {
        path: 'settings',
        canActivate: [AuthGuard, ESignGuard],
        component: IncomeExpenseSettingsComponent
    }
];

export const IETRouting: ModuleWithProviders = RouterModule.forChild(IETRoutes);

