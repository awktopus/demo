import { AuthGuard } from './core/auth/auth.guard';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedBaseModule } from './shared/shared.module'

import { AppComponent } from './app.component';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MainPageComponent } from './pages/main-page/main-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { AppRoutesModule } from './routes/app-routes.module';
import { SidemenuModule } from './sidemenu/sidemenu.module';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PortalModule } from '@angular/cdk/portal';
import { NgxEchartsModule } from 'ngx-echarts';
import { CurrentOUComponent } from './core/ui/current-ou/current-ou.component';
import { EsignserviceService } from './esign/service/esignservice.service';
import { EsignuiserviceService } from './esign/service/esignuiservice.service';
import { EsignAuthService } from './esign/service/esignauth.service';
import { TreeTableModule } from 'primeng/treetable';
import { NgIdleModule } from '@ng-idle/core'
import { ConfirmationDialogComponent } from './esign/controls/shared/confirmation-dialog/confirmation-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EsignStateSelector } from './esign/service/esign.state.selector';
import { AbstractStateSelector } from './core/states/abstract.state.selector';
import { PubSub } from './core/services/pubsub.service';
import { InfotrackerComponent } from './infotracker/infotracker.component';
import { GuestEzsignService } from './pages/guestezsign/service/guestezsign.service';
import { GuestEzsignGuard } from './pages/guestezsign/service/guestezsignauth';
import { GuestEZsignAuthService } from './pages/guestezsign/service/guestezsignauth.service';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

// AoT requires an exported function for factories for translate module
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    PageNotFoundComponent,
    DashboardPageComponent,
    LoginPageComponent,
    CurrentOUComponent,
    SignUpPageComponent,
    ConfirmationDialogComponent
  ],
  entryComponents: [ConfirmationDialogComponent],
  imports: [
    SharedBaseModule,
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    SidemenuModule,
    PortalModule,
    PerfectScrollbarModule,
    NgxEchartsModule,
    HttpClientModule,
    TreeTableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgIdleModule.forRoot(),
    AppRoutesModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
  }, AuthGuard, PubSub,
    EsignserviceService,
    EsignuiserviceService,
    EsignAuthService,
    GuestEzsignService,
    GuestEzsignGuard,
    GuestEZsignAuthService,
      { provide: AbstractStateSelector, useClass: EsignStateSelector }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
