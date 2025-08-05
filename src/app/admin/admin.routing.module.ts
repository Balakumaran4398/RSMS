import { NgModule } from '@angular/core';
import { HomeComponent } from './features/home/home.component';
import { OperatorDetailsComponent } from './features/operator/operator-details/operator-details.component';
import { LcoRechargeComponent } from './features/operator/lco-recharge/lco-recharge.component';
import { AddonPackageComponent } from './features/channel_setting/addon-package/addon-package.component';
import { BroadMasterComponent } from './features/channel_setting/broad-master/broad-master.component';
import { CategoryComponent } from './features/channel_setting/category/category.component';
import { ChannelTypeComponent } from './features/channel_setting/channel-type/channel-type.component';
import { ChannelComponent } from './features/channel_setting/channel/channel.component';
import { DistributorMasterComponent } from './features/channel_setting/distributor-master/distributor-master.component';
import { PackageCreationComponent } from './features/channel_setting/package-creation/package-creation.component';
import { PackageMasterComponent } from './features/channel_setting/package-master/package-master.component';
import { PackageReferenceComponent } from './features/channel_setting/package-reference/package-reference.component';
import { CreateSubscriberComponent } from './features/subscriber/create-subscriber/create-subscriber.component';
import { ExpiryDetailsComponent } from './features/subscriber/expiry-details/expiry-details.component';
import { SubDashboardComponent } from './features/subscriber/sub-dashboard/sub-dashboard.component';
import { SubscriberDetailsComponent } from './features/subscriber/subscriber-details/subscriber-details.component';
import { FingerPrintComponent } from './features/cas_operaion/finger-print/finger-print.component';
import { ForceTuningComponent } from './features/cas_operaion/force-tuning/force-tuning.component';
import { MailComponent } from './features/cas_operaion/mail/mail.component';
import { MessageComponent } from './features/cas_operaion/message/message.component';
import { ScrollingComponent } from './features/cas_operaion/scrolling/scrolling.component';
import { AllocatedComponent } from './features/inventory/allocated/allocated.component';
import { DefectiveSmartcardComponent } from './features/inventory/defective-smartcard/defective-smartcard.component';
import { InsertSubComponent } from './features/inventory/insert-sub/insert-sub.component';
import { NotAllocatedComponent } from './features/inventory/not-allocated/not-allocated.component';
import { SmartcardAllocationComponent } from './features/inventory/smartcard-allocation/smartcard-allocation.component';
import { SmartcardReallocationComponent } from './features/inventory/smartcard-reallocation/smartcard-reallocation.component';
import { LcoCommissionComponent } from './features/channel_setting/lco-commission/lco-commission.component';
import { ChipidModelComponent } from './features/vc/stc/chipid-model/chipid-model.component';
import { StbBillComponent } from './features/vc/stc/stb-bill/stb-bill.component';
import { TopSubDetailComponent } from './features/top-sub-detail/top-sub-detail.component';
import { PackageBaseViewComponent } from './features/channel_setting/_Dialogue/package Creation/package-base-view/package-base-view.component';
import { PackageManageComponent } from './features/channel_setting/_Dialogue/package Creation/package-manage/package-manage.component';
import { AddonManageComponent } from './features/channel_setting/_Dialogue/Addon_package/addon-manage/addon-manage.component';
import { PackagewiseOperatorComponent } from './features/channel_setting/packagewise-operator/packagewise-operator.component';
import { PaymentChannelComponent } from './features/local_broadcasting/payment-channel/payment-channel.component';
import { LocalPaymentComponent } from './features/local_broadcasting/local-payment/local-payment.component';
import { SubscriberImportComponent } from './features/Bulk_operation/subscriber-import/subscriber-import.component';
import { ActivationComponent } from './features/Bulk_operation/activation/activation.component';
import { DeactivationComponent } from './features/Bulk_operation/deactivation/deactivation.component';
import { AddonActivationComponent } from './features/Bulk_operation/addon-activation/addon-activation.component';
import { BulkPageUpdationComponent } from './features/Bulk_operation/bulk-page-updation/bulk-page-updation.component';
import { SubscriptionExdendComponent } from './features/Bulk_operation/subscription-exdend/subscription-exdend.component';
import { BulkBaseChangeComponent } from './features/Bulk_operation/bulk-base-change/bulk-base-change.component';
import { RefreshComponent } from './features/Bulk_operation/refresh/refresh.component';
import { RecurringComponent } from './features/Bulk_operation/recurring/recurring.component';
import { AlacarteActivationComponent } from './features/Bulk_operation/alacarte-activation/alacarte-activation.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LcodashboardComponent } from './features/channel_setting/_Dialogue/operator/lcodashboard/lcodashboard.component';
import { SubloginComponent } from './features/subscriber/sublogin/sublogin.component';
import { OperatorlistComponent } from './features/operator/operatorlist/operatorlist.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import { LcoRechargeReportComponent } from './features/channel_setting/_Dialogue/LCO_Recharge/lco-recharge-report/lco-recharge-report.component';
import { MsodetailsComponent } from './features/special_role/msodetails/msodetails.component';
import { CasmasterComponent } from './features/special_role/casmaster/casmaster.component';
import { LcoinvoiceComponent } from './features/special_role/lcoinvoice/lcoinvoice.component';
import { SpecialoperatorComponent } from './features/special_role/specialoperator/specialoperator.component';
import { SublcooperatorComponent } from './features/special_role/Dialogue/sublcooperator/sublcooperator.component';
import { PackageplanComponent } from './features/special_role/packageplan/packageplan.component';
import { ChanneldetailsComponent } from './features/special_role/channeldetails/channeldetails.component';
import { AdsdetailsComponent } from './features/special_role/adsdetails/adsdetails.component';
import { LoginsettingsComponent } from './features/special_role/loginsettings/loginsettings.component';
import { TaxComponent } from './features/special_role/tax/tax.component';
import { ProofComponent } from './features/special_role/proof/proof.component';
import { SpecialBulkpackageComponent } from './features/special_role/Bulk operaton/special-bulkpackage/special-bulkpackage.component';
import { SpecialareachangeComponent } from './features/special_role/Bulk operaton/specialareachange/specialareachange.component';
import { SpecialcancelsubscriptionComponent } from './features/special_role/Bulk operaton/specialcancelsubscription/specialcancelsubscription.component';
import { SpeciallcochangeComponent } from './features/special_role/Bulk operaton/speciallcochange/speciallcochange.component';
import { SpeciallcotransferComponent } from './features/special_role/Bulk operaton/speciallcotransfer/speciallcotransfer.component';
import { HistoryReportsComponent } from './features/channel_setting/Reports/history-reports/history-reports.component';
import { MsoreportsComponent } from './features/channel_setting/Reports/msoreports/msoreports.component';
import { TraiReportComponent } from './features/channel_setting/Reports/trai-report/trai-report.component';
import { ChartInventoryReportComponent } from '../_core/Chart-Reports/chart-inventory-report/chart-inventory-report.component';
import { ChartPackageReportComponent } from '../_core/Chart-Reports/chart-package-report/chart-package-report.component';
import { ChartSTBReportComponent } from '../_core/Chart-Reports/chart-stbreport/chart-stbreport.component';
import { PackageBasedComponent } from './features/channel_setting/Reports_page/Trai/package-based/package-based.component';
import { HistoryAllReportsComponent } from './features/channel_setting/Reports_page/Trai/History/history-all-reports/history-all-reports.component';
import { BroadcasterReportsComponent } from './features/channel_setting/Reports_page/Trai/broadcaster-reports/broadcaster-reports.component';
import { TopSubLoginComponent } from './features/top_sub_login/top-sub-login/top-sub-login.component';
import { LoginrefundComponent } from './features/channel_setting/_Dialogue/LCO_Recharge/loginrefund/loginrefund.component';
import { MsorDialogueportsComponent } from './features/channel_setting/Reports_page/MSO/msor-dialogueports/msor-dialogueports.component';
import { CortonboxComponent } from './features/inventory_role/cortonbox/cortonbox.component';
import { InventoryroleComponent } from './features/inventory_role/inventoryrole/inventoryrole.component';
import { LicenseComponent } from './features/inventory_role/license/license.component';
import { LicenseexpireComponent } from './features/inventory_role/Dialogue/licenseexpire/licenseexpire.component';
import { ServiceComponent } from './features/Service_center_role/service/service.component';
import { OperatordashboardComponent } from './features/operator_Login/operatordashboard/operatordashboard.component';
import { OnlinerechargeComponent } from './features/operator_Login/onlinerecharge/onlinerecharge.component';
import { OnlinecustomerdetailsComponent } from './features/operator_Login/onlinecustomerdetails/onlinecustomerdetails.component';
import { RechagelogComponent } from './features/operator_Login/rechagelog/rechagelog.component';
import { AreaStreetComponent } from './features/operator_Login/area-street/area-street.component';
import { LcoDashboardComponent } from './features/operator_Login/Dialog/lco-dashboard/lco-dashboard.component';
import { ForcemessageComponent } from './features/operator_Login/forcemessage/forcemessage.component';
import { LcoChangePasswordComponent } from './features/operator_Login/lco-change-password/lco-change-password.component';
import { LcodiscountComponent } from './features/operator_Login/lcodiscount/lcodiscount.component';
import { LcoReportComponent } from './features/operator_Login/lco-report/lco-report.component';
import { LcologinReportComponent } from './features/operator_Login/Dialog/lcologin-report/lcologin-report.component';
import { DistributorsettingComponent } from './features/operator_Login/distributorsetting/distributorsetting.component';
import { BillcollectionComponent } from './features/operator_Login/billcollection/billcollection.component';
import { LcoSmartcardDialogComponent } from './features/operator_Login/Dialog/lco-smartcard-dialog/lco-smartcard-dialog.component';
import { LcowalletshareComponent } from './features/operator_Login/lcowalletshare/lcowalletshare.component';
import { SmrtBoxidChangeComponent } from './features/operator_Login/smrt-boxid-change/smrt-boxid-change.component';
import { LcodashboardreportComponent } from './features/operator_Login/lcodashboardreport/lcodashboardreport.component';
import { OperatorareachangeComponent } from './features/operator_Login/operatorareachange/operatorareachange.component';
import { DiscountsmartcardComponent } from './features/operator_Login/Dialog/discountsmartcard/discountsmartcard.component';
import { LcoDummycmpComponent } from './features/operator_Login/lco-dummycmp/lco-dummycmp.component';
import { LcodashboardsublcoreportComponent } from './features/operator_Login/lcodashboardsublcoreport/lcodashboardsublcoreport.component';
import { LcocommisiomddiscountComponent } from './features/channel_setting/lcocommisiomddiscount/lcocommisiomddiscount.component';
import { LogincredentialComponent } from './features/special_role/logincredential/logincredential.component';
import { LcocommissioncredentialComponent } from './features/channel_setting/lcocommissioncredential/lcocommissioncredential.component';
import { SmartcardrefreshComponent } from './features/Bulk_operation/smartcardrefresh/smartcardrefresh.component';
import { BulkoperatorcreationComponent } from './features/Bulk_operation/bulkoperatorcreation/bulkoperatorcreation.component';
import { VersionComponent } from './features/version/version.component';
import { VoicerecognizeComponent } from './features/voicerecognize/voicerecognize.component';
import { PaymentcustomerComponent } from './features/Add payment/paymentcustomer/paymentcustomer.component';
import { LogmaintainComponent } from './features/logmaintain/logmaintain.component';


const routes: Routes = [
  {
    path: "", children: [
      { path: 'home', component: HomeComponent, },
      // --------------------------------------------Dashboard  Reports -------------------------------------
      { path: 'inventoryReport/:id', component: ChartInventoryReportComponent, },
      { path: 'packageReport/:id', component: ChartPackageReportComponent, },
      { path: 'STBReport/:id', component: ChartSTBReportComponent, },
      { path: 'packageBase', component: PackageBasedComponent, },
      // ---------------------------------------------Operator-------------------lcoCommissionDashboard
      { path: 'operator_details', component: OperatorDetailsComponent, },
      { path: 'lco_recharge/:id', component: LcoRechargeComponent, },
      { path: 'top_subscription', component: TopSubLoginComponent, },
      { path: 'operatorlist', component: OperatorlistComponent, },
      { path: 'nav', component: NavbarComponent, },
      { path: 'lcorecharge/:id', component: LcoRechargeReportComponent, },
      { path: 'loginreund/:id', component: LoginrefundComponent, },
      // --------------------------------------------Top-Subscriber-Details---------------------------------
      { path: 'top_sub_detail', component: TopSubDetailComponent, },
      // -------------------------Channel-Setting----------------------------
      { path: 'Addon', component: AddonPackageComponent, },
      { path: 'Broadcast', component: BroadMasterComponent, },
      { path: 'Channel', component: ChannelComponent, },
      { path: 'Channeltype', component: ChannelTypeComponent, },
      { path: 'Distributer', component: DistributorMasterComponent, },
      { path: 'LcoCommission', component: LcoCommissionComponent, },
      { path: 'LcoCommission_credential', component: LcocommissioncredentialComponent, },
      { path: 'PackageCreation', component: PackageCreationComponent, },
      { path: 'PackageMaster', component: PackageMasterComponent, },
      { path: 'packagemanage/:id', component: PackageManageComponent, },
      { path: 'addonmanage/:id', component: AddonManageComponent, },
      { path: 'PackageReference', component: PackageReferenceComponent, },
      { path: 'PackagewiseOperator', component: PackagewiseOperatorComponent, },
      { path: 'categery', component: CategoryComponent, },
      // -------------------------------Inventory---------------------------------
      { path: 'allocate_smartcard', component: AllocatedComponent, },
      { path: 'not_allacate_smartcard', component: NotAllocatedComponent, },
      { path: 'defective_smart', component: DefectiveSmartcardComponent, },
      { path: 'insert_sub', component: InsertSubComponent, },
      { path: 'smartcard_declaration', component: SmartcardAllocationComponent, },
      { path: 'smartcard_reallocation', component: SmartcardReallocationComponent },
      // // -------------------------------Cas Operation---------------------------------
      { path: 'finger_print', component: FingerPrintComponent, },
      { path: 'scrolling', component: ScrollingComponent },
      { path: 'message', component: MessageComponent, },
      { path: 'fource_tuning', component: ForceTuningComponent },
      { path: 'mail', component: MailComponent, },
      // // -------------------------------Subscriber---------------------------------
      { path: 'Create_sub', component: CreateSubscriberComponent },
      { path: 'subscriber', component: SubscriberDetailsComponent },
      { path: 'expiry', component: ExpiryDetailsComponent },
      // { path: 'subscriber-full-info/:subid', component: SubDashboardComponent },
      // { path: 'subscriber-full-info/:smartcard', component: SubDashboardComponent },
      { path: 'subscriber-full-info/:smartcard/:status', component: SubDashboardComponent },

      { path: 'sublogin', component: SubloginComponent },
      // -------------------------------VC/STB master---------------------------------
      { path: 'chipid', component: ChipidModelComponent },
      { path: 'stb_bill', component: StbBillComponent },
      // ---------------------------------------Local-broadcasting-------------------------------
      { path: 'payment_channel', component: PaymentChannelComponent },
      { path: 'local_payment', component: LocalPaymentComponent },
      { path: 'lcodashboard/:operatorid', component: LcodashboardComponent },
      // -----------------------------------Bulk operation----------------------------------------------
      { path: 'subscriber_import', component: SubscriberImportComponent },
      { path: 'smartcard_refresh', component: SmartcardrefreshComponent },
      { path: 'bulk_smartcard_creation', component: BulkoperatorcreationComponent },
      { path: 'activation', component: ActivationComponent },
      { path: 'deactivation', component: DeactivationComponent },
      { path: 'addon_activation', component: AddonActivationComponent },
      { path: 'Bulk_Package_Updation', component: BulkPageUpdationComponent },
      { path: 'Subscription_Extend', component: SubscriptionExdendComponent },
      { path: 'Bulk_Base_Change', component: BulkBaseChangeComponent },
      { path: 'Bulk_Refresh', component: RefreshComponent },
      { path: 'Recurring', component: RecurringComponent },
      { path: 'Alacarte_Activation', component: AlacarteActivationComponent },
      // --------------------------------------Reports-----------------------------------
      { path: 'traiReports', component: TraiReportComponent },
      { path: 'msoReports', component: MsoreportsComponent },
      { path: 'historyReports', component: HistoryReportsComponent },
      { path: 'historyAllReports/:id', component: HistoryAllReportsComponent },
      { path: 'broadcasterReports/:id', component: BroadcasterReportsComponent },
      { path: 'msodialogueReports/:id', component: MsorDialogueportsComponent },

      // ------------------------------------Special role-------------------------------------------
      { path: 'msodetails', component: MsodetailsComponent },
      { path: 'casmaster', component: CasmasterComponent },
      { path: 'invoice', component: LcoinvoiceComponent },
      { path: 'special_operator', component: SpecialoperatorComponent },
      { path: 'sublcodashboard/:operatorid', component: SublcooperatorComponent },
      { path: 'Packageplan', component: PackageplanComponent },
      { path: 'channeldetails', component: ChanneldetailsComponent },
      { path: 'adsdetails', component: AdsdetailsComponent },
      { path: 'tax', component: TaxComponent },
      { path: 'proof', component: ProofComponent },
      { path: 'loginsettings', component: LoginsettingsComponent },
      { path: 'loginsettings_credential', component: LogincredentialComponent },
      // { path: 'loginsettings', component: ServiceComponent },
      { path: 'special_bulk_package', component: SpecialBulkpackageComponent },
      { path: 'special_area_package', component: SpecialareachangeComponent },
      { path: 'special_lco_package', component: SpeciallcochangeComponent },
      { path: 'special_cancel_subscription', component: SpecialcancelsubscriptionComponent },
      { path: 'special_lcotransfer', component: SpeciallcotransferComponent },

      // -------------------------------------Inventory Role------------------------------------
      { path: 'inventor_inventory', component: InventoryroleComponent },
      { path: 'service_center', component: ServiceComponent },
      // { path: 'inventor_inventory', component: ServiceComponent },
      { path: 'inventory_license', component: LicenseexpireComponent },
      { path: 'inventory_cortonbox', component: CortonboxComponent },
      { path: 'inventory_cortonbox_data', component: LicenseComponent },
      // ---------------------------------------------Operator login------------------------------
      { path: 'operator_dashboard', component: OperatordashboardComponent },
      { path: 'online_recharge', component: OnlinerechargeComponent },
      { path: 'online_customer_details', component: OnlinecustomerdetailsComponent },
      { path: 'rechargelog', component: RechagelogComponent },
      { path: 'area_street', component: AreaStreetComponent },
      { path: 'lco_dashboard/:id', component: LcoDashboardComponent },
      { path: 'forcemessage', component: ForcemessageComponent },
      { path: 'lcoChangePassword', component: LcoChangePasswordComponent },
      { path: 'lcoDashboard', component: LcodiscountComponent },
      { path: 'lcoCommissionDashboard', component: LcocommisiomddiscountComponent },
      { path: 'dummy', component: LcoDummycmpComponent },
      { path: 'lcoReports', component: LcoReportComponent },
      { path: 'lcologinReports/:id', component: LcologinReportComponent },
      { path: 'distributor_setting', component: DistributorsettingComponent },
      { path: 'bill_collection', component: BillcollectionComponent },
      { path: 'lco_dashboard/:smartcard/:status', component: LcoSmartcardDialogComponent },
      { path: 'lcowallet_share', component: LcowalletshareComponent },
      { path: 'smrt_boxid_change', component: SmrtBoxidChangeComponent },
      { path: 'lco_dashboard_report/:id', component: LcodashboardreportComponent },
      { path: 'sublco_dashboard_report/:id/:userid/:retailerid', component: LcodashboardsublcoreportComponent },
      { path: 'operator_areachange', component: OperatorareachangeComponent },
      { path: 'discount_smartcard_details/:smartcard', component: DiscountsmartcardComponent },

      // ---------------------------   version  ------------------------------
      { path: 'version', component: VersionComponent },
      { path: 'voice', component: VoicerecognizeComponent },
      { path: 'logs', component: LogmaintainComponent },
      // { path: 'payment_customer', component: PaymentcustomerComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },]
})
export class AdminRoutingModule { }
