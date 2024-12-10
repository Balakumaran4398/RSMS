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
import { AuthGuard } from '../_core/service/auth.guard';
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
import { TraiComponent } from './features/channel_setting/Reports/trai/trai.component';
import { HistoryReportsComponent } from './features/channel_setting/Reports/history-reports/history-reports.component';
import { MsoreportsComponent } from './features/channel_setting/Reports/msoreports/msoreports.component';
import { TraiReportComponent } from './features/channel_setting/Reports/trai-report/trai-report.component';
import { HistoryComponent } from './features/channel_setting/Reports/history/history.component';


const routes: Routes = [
  {
    path: "", children: [
      { path: 'home', component: HomeComponent, },
      // ---------------------------------------------Operator-----------------------------------
      { path: 'operator_details', component: OperatorDetailsComponent, },
      { path: 'lco_recharge', component: LcoRechargeComponent, },
      { path: 'operatorlist', component: OperatorlistComponent, },
      { path: 'nav', component: NavbarComponent, },
      { path: 'lcorecharge', component: LcoRechargeReportComponent, },
      // --------------------------------------------Top-Subscriber-Details---------------------------------
      { path: 'top_sub_detail', component: TopSubDetailComponent, },
      // -------------------------Channel-Setting----------------------------
      { path: 'Addon', component: AddonPackageComponent, },
      { path: 'Broadcast', component: BroadMasterComponent, },
      { path: 'Channel', component: ChannelComponent, },
      { path: 'Channeltype', component: ChannelTypeComponent, },
      { path: 'Distributer', component: DistributorMasterComponent, },
      { path: 'LcoCommission', component: LcoCommissionComponent, },
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
      { path: 'historyReports', component: HistoryComponent },
      
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
      { path: 'special_bulk_package', component: SpecialBulkpackageComponent },
      { path: 'special_area_package', component: SpecialareachangeComponent },
      { path: 'special_lco_package', component: SpeciallcochangeComponent },
      { path: 'special_cancel_subscription', component: SpecialcancelsubscriptionComponent },
      { path: 'special_lcotransfer', component: SpeciallcotransferComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },]

})
export class AdminRoutingModule { }
