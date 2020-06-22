import { AuthGuard } from './../core/auth/auth.guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from '../pages/main-page/main-page.component';
import { DashboardPageComponent } from '../pages/dashboard-page/dashboard-page.component';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';
import { LoginPageComponent } from '../pages/login-page/login-page.component';

const APP_ROUTES: Routes = [
  {
    path: 'main', canActivate: [AuthGuard], component: MainPageComponent, children: [
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'esign', loadChildren: 'app/esign/esign.module#EsignModule' },
      { path: 'ezsign', loadChildren: 'app/ezsign/ezsign.module#EZSignModule' },
      { path: 'incomeexpense', loadChildren: 'app/income-and-expense/income-and-expense.module#IncomeExpenseModule' },
      { path: 'infotracker', loadChildren: 'app/infotracker/infotracker.module#InfoTrackerModule' },
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'prefix' }
    ]
  },
  { path: '404', component: PageNotFoundComponent },
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: '/main/dashboard', pathMatch: 'prefix' },
  { path: '**', redirectTo: '/main/dashboard', pathMatch: 'prefix' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules }),
  ]
})
export class AppRoutesModule {
}
