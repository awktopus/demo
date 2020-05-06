import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  MatDividerModule, MatTableModule, MatDialogModule,
  MatStepperModule, MatFormFieldModule, MatSortModule, MatDatepickerModule, MatNativeDateModule
} from '@angular/material';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { SharedBaseModule } from '../shared/shared.module';
import { IETRouting } from './income-and-expense.routing';
import { IncomeExpenseSettingsComponent } from './controls/settings/iet-settings.component';
import { IncomeExpenseComponent, IetSafePipe } from './income-and-expense.component';
import { ESignGuard } from '../esign/service/esignauth';
import { IetAddreceiptComponent } from './controls/iet-addreceipt/iet-addreceipt.component';
import { IetViewreportComponent } from './controls/iet-viewreport/iet-viewreport.component';
import { IetCompanyComponent } from './controls/iet-company/iet-company.component';
import { AgGridModule } from 'ag-grid-angular';
import { GridColConfigPopupComponent } from './../esign/controls/history/gridcolpopup/grid-col-config-popup.component';
import { ButtonRendererComponent } from '../income-and-expense/button-renderer.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { PdfpopupComponent } from '../esign/controls/casemain/esigncase/pdfpopup/pdfpopup.component';
import { IetPdfPopupComponent } from './controls/iet-pdf-popup/iet-pdf-popup.component';
@NgModule({
  imports: [
    CommonModule,
    IETRouting,
    MatDividerModule,
    MatTableModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSortModule,
    CovalentLayoutModule,
    MatSortModule,
    MatTableModule,
    SharedBaseModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule, MatDialogModule, CurrencyMaskModule,
    AgGridModule.withComponents([ButtonRendererComponent])
   ],
  declarations: [
    IncomeExpenseComponent,
    IncomeExpenseSettingsComponent,
    IetAddreceiptComponent,
    IetViewreportComponent,
    IetCompanyComponent, ButtonRendererComponent, IetPdfPopupComponent, IetSafePipe
  ],
  entryComponents: [IetAddreceiptComponent, IetViewreportComponent,
    IetCompanyComponent, IetPdfPopupComponent
    ],
  providers: [
  ESignGuard,
  ],
  exports: [ IetSafePipe, MatDatepickerModule]
})
export class IncomeExpenseModule { }
