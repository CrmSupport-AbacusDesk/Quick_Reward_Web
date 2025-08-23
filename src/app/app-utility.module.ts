import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { LoaderComponent } from './loader/loader.component';
import { MasterTabListComponent } from './master-tab-list/master-tab-list/master-tab-list.component';
import { MasterTabComponent } from './master-tab/master-tab/master-tab.component';
import { NotResultFoundComponent } from './not-result-found/not-result-found.component';
import { MyFilterPipe } from './shared/pipes/my-filter.pipe';
import { StatusModalComponent } from './order/status-modal/status-modal.component';
import { LeadModalComponent } from './lead/lead-modal/lead-modal.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialModule } from './material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatDialogModule } from '@angular/material';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { RedeemStatusModalComponent } from './redeem-status-modal/redeem-status-modal.component';
import { ImageModuleComponent } from './image-module/image-module.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { AgmCoreModule } from '@agm/core';
import { DistributionDetailComponent } from './distribution/distribution-detail/distribution-detail.component';
import { RouterModule } from '@angular/router';
import { RedeemRequestDetailComponent } from './redeem/redeem-request-detail/redeem-request-detail.component';
import { InfluencerDetailComponent } from './Influencer/influencer-detail/influencer-detail.component';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';
// import { SalesReturnListComponent } from './sales-return/sales-return-list/sales-return-list.component';
import { CouponCodeAddComponent } from './coupon/coupon-code-add/coupon-code-add.component';
import { CouponCodeDetailComponent } from './coupon/coupon-code-detail/coupon-code-detail.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { GatepassAddComponent } from './company-dispatch/gatepass-add/gatepass-add.component';
import { SecondaryOrderDetailComponent } from './order/secondary-order-detail/secondary-order-detail.component';
import { DesignationComponent } from './user/designation/designation.component';
import { AddDistributionComponent } from './distribution/add-distribution/add-distribution.component';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { AddGrandMasterBoxComponent } from './company-dispatch/add-grand-master-box/add-grand-master-box.component';
import { ViewMasterBoxDispatchDetailComponent } from './company-dispatch/view-master-box-dispatch-detail/view-master-box-dispatch-detail.component';
import { DistPrimaryOrderAddComponent } from './distribution/dist-primary-order-add/dist-primary-order-add.component';
import { CheckindocumentComponent } from './checkindocument/checkindocument.component';
import { TrackerComponent } from './attendence/tracker/tracker.component';
import { ZingchartAngularModule } from 'zingchart-angular';
import { AttendanceDetailComponent } from './attendance-detail/attendance-detail.component';
import { AttendenceComponent } from './attendence/attendence.component';
import { CheckinComponent } from './checkin/checkin.component';
import { LeavesComponent } from './user_leaves/leaves/leaves.component';
import { TravelListComponent } from './travel/travel-list/travel-list.component';
import { ListExpenseComponent } from './expense/list-expense/list-expense.component';
import { ContractorMeetListComponent } from './contractor-meet/contractor-meet-list/contractor-meet-list.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { DistributionListComponent } from './distribution/distribution-list/distribution-list.component';
import { InstallationAddComponent } from './installation/installation-add/installation-add.component';
// import { ProgressBarModule } from "angular-progress-bar"
import { SecondaryOrderListComponent } from './order/secondary-order-list/secondary-order-list.component';
import { SecondaryOrderAddComponent } from './order/secondary-order-add/secondary-order-add.component';
import { SupportListComponent } from './support/support-list/support-list.component';
import { SupportStatusComponent } from './support/support-status/support-status.component';
import { WarrantyDetailComponent } from './warranty/warranty-detail/warranty-detail.component';
import { InstallationDetailComponent } from './installation/installation-detail/installation-detail.component';
import { ComplaintDetailComponent } from './service/complaint-detail/complaint-detail.component';
import { SiteOrderListComponent } from './site-order-list/site-order-list.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AttendancemodalComponent } from './attendancemodal/attendancemodal.component';
import { CheckinViewComponent } from './checkin-view/checkin-view.component';
import { DesignationModalComponent } from './userdesignation/designation-modal/designation-modal.component';
import { SecondaryOrderAddQuantityComponent } from './order/secondary-order-add-quantity/secondary-order-add-quantity.component';
import { ProfileAccountModalComponent } from './profile-modal/profile-account-modal.component';
import { DistPrimaryOrderAddQtyComponent } from './distribution/dist-primary-order-add-qty/dist-primary-order-add-qty.component';
import { SecondaryBillUploadListComponent } from './Secondary-Bill-Upload/secondary-bill-upload-list/secondary-bill-upload-list.component';
import { SecondaryBillUploadDetailComponent } from './Secondary-Bill-Upload/secondary-bill-upload-detail/secondary-bill-upload-detail.component';
import { UpdateKycComponent } from './Influencer/update-kyc/update-kyc.component';
import { FaqListComponent } from './faq/faq-list/faq-list.component';
import { FaqAddComponent } from './faq/faq-add/faq-add.component';
import { FaqModuleModule } from './faq/faq-module/faq-module.module';
import { NgxEditorModule } from 'ngx-editor';
import { LeadDetailComponent } from './lead/lead-detail/lead-detail.component';
import { HeaderSettingModalComponent } from './header-setting-modal/header-setting-modal.component';
import { SaleUserDetailComponent } from './user/sale-user-detail/sale-user-detail.component';
import { SiteDetailComponent } from './site/site-detail/site-detail.component';
import { environment } from 'src/environments/environment';
import { AddInfluencerComponent } from './add-influencer/add-influencer.component';
import { SiteAddComponent } from './site/site-add/site-add.component';
import { AddLeadComponent } from './lead/add-lead/add-lead.component';
import { DashboardModalComponent } from './dashboard-modal/dashboard-modal.component';
import { InfluencerListComponent } from './Influencer/influencer-list/influencer-list.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';




@NgModule({
  declarations: [
    AddInfluencerComponent,
    NotResultFoundComponent,
    LoaderComponent,
    AddDistributionComponent,
    MyFilterPipe,
    EditUserComponent,
    MasterTabComponent,
    MasterTabListComponent,
    StatusModalComponent,
    DashboardModalComponent,
    LeadModalComponent,
    ProfileAccountModalComponent,
    DesignationComponent,
    AddLeadComponent,
    SiteAddComponent,
    RedeemStatusModalComponent,
    ImageModuleComponent,
    DistributionDetailComponent,
    RedeemRequestDetailComponent,
    InfluencerDetailComponent,
    OrderDetailComponent,
    SecondaryOrderDetailComponent,
    DistPrimaryOrderAddComponent,
    DistPrimaryOrderAddQtyComponent,
    BillingDetailComponent,
    CouponCodeAddComponent,
    // SalesReturnListComponent,
    GatepassAddComponent,
    InstallationAddComponent,
    CouponCodeDetailComponent,
    BottomSheetComponent,
    AddGrandMasterBoxComponent,
    ViewMasterBoxDispatchDetailComponent,
    CheckindocumentComponent,
    TrackerComponent,
    InfluencerListComponent,
    AttendanceDetailComponent,
    AttendenceComponent,
    CheckinComponent,
    LeavesComponent,
    TravelListComponent,
    ListExpenseComponent,
    ContractorMeetListComponent,
    TaskListComponent,
    DistributionListComponent,
    SecondaryOrderListComponent,
    SecondaryOrderAddComponent,
    SecondaryOrderAddQuantityComponent,
    SupportListComponent,
    SupportStatusComponent,
    WarrantyDetailComponent,
    InstallationDetailComponent,
    ComplaintDetailComponent,
    SiteOrderListComponent,
    AttendancemodalComponent,
    CheckinViewComponent,
    AddItemComponent,
    DesignationModalComponent,
    SecondaryBillUploadListComponent,
    SecondaryBillUploadDetailComponent,
    FaqListComponent,
    FaqAddComponent,
    UpdateKycComponent,
    LeadDetailComponent,
    HeaderSettingModalComponent,
    SaleUserDetailComponent,
    SiteDetailComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey
      
    }),
    CommonModule,
    FilterPipeModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    MaterialModule,
    AutocompleteLibModule,
    MatIconModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    NgxBarcodeModule,
    NgxQRCodeModule,
    ZingchartAngularModule,
    NgxEditorModule
    // FaqModuleModule
    // ProgressBarModule
  ],
  exports: [
    NotResultFoundComponent,
    LoaderComponent,
    MyFilterPipe,
    FilterPipeModule,
    MasterTabComponent,
    MasterTabListComponent,
    DistributionDetailComponent,
    InfluencerDetailComponent,
    OrderDetailComponent,
    TrackerComponent,
    AttendenceComponent,
    CheckinComponent,
    LeavesComponent,
    TravelListComponent,
    ListExpenseComponent,
    ContractorMeetListComponent,
    TaskListComponent,
    DistributionListComponent,
    SecondaryOrderListComponent,
    SupportListComponent,
    SupportStatusComponent,
    WarrantyDetailComponent,
    InstallationDetailComponent,
    ComplaintDetailComponent,
    AddItemComponent,
    SiteOrderListComponent,
    AttendancemodalComponent,
    CheckinViewComponent,
    FaqListComponent,
    FaqAddComponent,
    SaleUserDetailComponent
  ],
  entryComponents: [StatusModalComponent,DashboardModalComponent, HeaderSettingModalComponent, LeadModalComponent,FaqListComponent,FaqAddComponent, UpdateKycComponent, ProfileAccountModalComponent, CheckinViewComponent, AttendancemodalComponent, AttendanceDetailComponent, ViewMasterBoxDispatchDetailComponent, GatepassAddComponent, RedeemStatusModalComponent, CheckindocumentComponent, ImageModuleComponent, DesignationComponent, BottomSheetComponent,DesignationModalComponent,FaqAddComponent, FaqListComponent]

})
export class AppUtilityModule { }