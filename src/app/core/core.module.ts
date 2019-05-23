import { OUService } from './services/ou.service';
import { UserService } from './services/user.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { LocalStorageService } from './localStorage/local-storage.service';
import { ApiService } from './api/api.service';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// import { CurrentOUComponent } from './ui/current-ou/current-ou.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [
    ApiService,
    LocalStorageService,
    AuthService,
    OUService,
    UserService,
    AuthGuard
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {

  }
}
