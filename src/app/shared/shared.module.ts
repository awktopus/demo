import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomFormsModule } from 'ng2-validation';
import {
  CovalentCommonModule,
  CovalentDataTableModule,
  CovalentFileModule,
  CovalentMediaModule,
  CovalentNotificationsModule,
  CovalentPagingModule,
  CovalentSearchModule,
  CovalentStepsModule
} from '@covalent/core';
import { ResizeModule } from './../resize/resize.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDatepickerModule
} from '@angular/material';
import { PortalModule } from '@angular/cdk/portal';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PermissionDirective } from '../core/directives/permission.directive';
import { TreeModule } from 'angular-tree-component';
import { Select2Module } from 'ng2-select2';
import { RelativeDatePipe } from '../core/pipe/relative-date.pipe';
import { FileSizePipe } from '../core/pipe/file-size.pipe';
import { OrgAvatarComponent } from '../core/ui/org-avatar/org-avatar';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

// AoT requires an exported function for factories for translate module
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './../assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    OverlayModule,
    PortalModule,
    PerfectScrollbarModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CustomFormsModule,
    NgxEchartsModule,
    CovalentMediaModule,
    CovalentFileModule,
    CovalentStepsModule,
    CovalentDataTableModule,
    CovalentSearchModule,
    CovalentPagingModule,
    CovalentNotificationsModule,
    CovalentCommonModule,
    ResizeModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    TreeModule.forRoot(),
    Select2Module
  ],
  declarations: [
    PermissionDirective,
    OrgAvatarComponent,
    RelativeDatePipe,
    FileSizePipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    OverlayModule,
    PortalModule,
    PerfectScrollbarModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CustomFormsModule,
    NgxEchartsModule,
    CovalentMediaModule,
    CovalentFileModule,
    CovalentStepsModule,
    CovalentDataTableModule,
    CovalentSearchModule,
    CovalentPagingModule,
    CovalentNotificationsModule,
    CovalentCommonModule,
    ResizeModule,
    HttpClientModule,
    TreeModule,
    PermissionDirective,
    Select2Module,
    OrgAvatarComponent,
    RelativeDatePipe,
    FileSizePipe,
  ],
  entryComponents: [
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }],
})
export class SharedBaseModule { }
