import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
// import { RouterModule } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { sessionStorage } from './localstorage.service';
import { AppComponent } from './app.component';
import { MaterialModule } from './material';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AuthGuardLog } from './AuthGuardLog';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthComponentGuard } from './auth-component.guard';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AddDiscountComponent } from './discount/add-discount/add-discount.component';
import { DiscountListComponent } from './discount/discount-list/discount-list.component';
import { MatDialogModule, MatIconModule, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material';
import { NgxEditorModule } from 'ngx-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DialogComponent } from './dialog.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChartsModule } from 'ng2-charts';
import { CurrencywordsPipe } from './currencywords.pipe';
import { NumericWordsPipe } from './numeric-words.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ExportexcelService } from './service/exportexcel.service';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { from } from 'rxjs';
import { AgmCoreModule } from '@agm/core';

import { AgmDirectionModule } from 'agm-direction';

import { NgxImageCompressService } from 'ngx-image-compress';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import * as $ from "jquery";
import { MatTimepickerModule } from 'mat-timepicker';
import { UploadFileModalComponent } from './upload-file-modal/upload-file-modal.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { AppUtilityModule } from './app-utility.module';
import { ConvertArray } from 'src/_Pipes/ConvertArray.pipe';
import { DatePikerFormat } from 'src/_Pipes/DatePikerFormat.pipe';
import { StrReplace } from 'src/_Pipes/StrReplace.pipe';
// import { Crypto } from 'src/_Pipes/Crypto.pipe';
import { NumericWords } from 'src/_Pipes/NumericWords.pipe';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ZingchartAngularModule } from 'zingchart-angular';
import { EngineerAssignModelComponentComponent } from './engineer-assign-model-component/engineer-assign-model-component.component';
import { WarrantyUpdateModelComponent } from './warranty/warranty-update-model/warranty-update-model.component';
import { AddComplaintRemarkComponent } from './add-complaint-remark/add-complaint-remark.component';
import { ProductDetailModelComponent } from './installation/product-detail-model/product-detail-model.component';
import { InstallationUpdateModelComponent } from './installation/installation-update-model/installation-update-model.component';
import { ComplaintUpdateModelComponent } from './service/complaint-update-model/complaint-update-model.component';
import { AddSpareComponent } from './spare/add-spare/add-spare.component';
import { AssignQtyComponent } from './spare/assign-qty/assign-qty.component';
import { SchemeModalComponent } from './scheme/scheme-modal/scheme-modal.component';
// import { ProgressBarModule } from "angular-progress-bar";
import { ServiceInvoiceAddComponent } from './service-invoice/service-invoice-add/service-invoice-add.component';
import { ServicePaymentAddComponent } from './service-invoice/service-payment-add/service-payment-add.component';
import { FeedbackAddComponent } from './service/feedback-add/feedback-add.component';
import { InactivityService } from 'src/_services/InactivityService';
import { AuthService } from 'src/_services/AuthService ';
import { ChunksUploaderComponent } from './uploader-new/chunks-uploader/chunks-uploader.component';
import { ErrorLogsComponent } from './error-logs/error-logs.component';
import { SecondarySchemeModalComponent } from './secondary-scheme/secondary-scheme-modal/secondary-scheme-modal.component';
import { LeaverejectstatusComponent } from './leaverejectstatus/leaverejectstatus.component';
import { ExpenseStatusComponent } from './expense-status/expense-status.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InsightsDashboardComponent } from './insights-dashboard/insights-dashboard.component';




@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        InsightsDashboardComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        AddDiscountComponent,
        DiscountListComponent,
        UploadFileModalComponent,
        ChunksUploaderComponent,
        EngineerAssignModelComponentComponent,
        ServiceInvoiceAddComponent,
        WarrantyUpdateModelComponent,
        AddComplaintRemarkComponent,
        ProductDetailModelComponent,
        InstallationUpdateModelComponent,
        ComplaintUpdateModelComponent,
        AddSpareComponent,
        AssignQtyComponent,
        CurrencywordsPipe,
        NumericWordsPipe,
        ConvertArray,
        DatePikerFormat,
        StrReplace,
        SchemeModalComponent,
        // Crypto,
        NumericWords,
        ServicePaymentAddComponent,
        FeedbackAddComponent,
        ErrorLogsComponent,
        SecondarySchemeModalComponent,

        LeaverejectstatusComponent,
        ExpenseStatusComponent
    ],
    imports: [
        AgmCoreModule.forRoot({
        }),
        AgmDirectionModule,
        ZingchartAngularModule,
        BrowserModule,
        FormsModule,
        ChartsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxPaginationModule,
        NoopAnimationsModule,
        MatDialogModule,
        DragDropModule, 
        FilterPipeModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MatButtonToggleModule,
        NgxEditorModule,
        AngularFontAwesomeModule,
        InfiniteScrollModule,
        AutocompleteLibModule,
        RichTextEditorAllModule,
        MatTimepickerModule,
        MatIconModule,
        NgxQRCodeModule,
        NgxBarcodeModule,
        NgxMatSelectSearchModule,
        NgMultiSelectDropDownModule.forRoot(),
        AppUtilityModule,
        // ProgressBarModule
        // FusionChartsModule
    ],
    providers: [
        DatabaseService,
        InactivityService,
        AuthService,
        AuthGuard,
        AuthGuardLog,
        AuthComponentGuard,
        sessionStorage,
        DialogComponent,
        BnNgIdleService,
        ExportexcelService,
        DatePipe,
        NgxImageCompressService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],

    entryComponents: [
        UploadFileModalComponent,
        ChunksUploaderComponent,
        EngineerAssignModelComponentComponent,
        WarrantyUpdateModelComponent,
        AddComplaintRemarkComponent,
        ProductDetailModelComponent,
        InstallationUpdateModelComponent,
        ComplaintUpdateModelComponent,
        AddSpareComponent,
        AssignQtyComponent,
        SchemeModalComponent,
        ServiceInvoiceAddComponent,
        ServicePaymentAddComponent,
        FeedbackAddComponent,
        SecondarySchemeModalComponent
    ],

    exports: [RouterModule],
    bootstrap: [AppComponent]
})
export class AppModule { }
