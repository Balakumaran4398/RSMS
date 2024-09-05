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


const routes: Routes = [
  {
    path: "", children: [
      { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
      // ---------------------------------------------Operator-----------------------------------
      { path: 'operator_details', component: OperatorDetailsComponent ,canActivate: [AuthGuard] },
      { path: 'lco_recharge', component: LcoRechargeComponent,canActivate: [AuthGuard]  },
      // --------------------------------------------Top-Subscriber-Details---------------------------------
      { path: 'top_sub_detail', component: TopSubDetailComponent,canActivate: [AuthGuard]  },
      // -------------------------Channel-Setting----------------------------
      { path: 'Addon', component: AddonPackageComponent,canActivate: [AuthGuard] },
      { path: 'Broadcast', component: BroadMasterComponent ,canActivate: [AuthGuard]},
      { path: 'Channel', component: ChannelComponent ,canActivate: [AuthGuard] },
      { path: 'Channeltype', component: ChannelTypeComponent,canActivate: [AuthGuard]  },
      { path: 'Distributer', component: DistributorMasterComponent ,canActivate: [AuthGuard] },
      { path: 'LcoCommission', component: LcoCommissionComponent,canActivate: [AuthGuard]  },
      { path: 'PackageCreation', component: PackageCreationComponent,canActivate: [AuthGuard]  },
      { path: 'PackageMaster', component: PackageMasterComponent,canActivate: [AuthGuard]  },
      { path: 'packagemanage/:id', component: PackageManageComponent,canActivate: [AuthGuard]  },
      { path: 'addonmanage/:id', component: AddonManageComponent,canActivate: [AuthGuard]  },
      { path: 'PackageReference', component: PackageReferenceComponent,canActivate: [AuthGuard]  },
      { path: 'PackagewiseOperator', component: PackagewiseOperatorComponent ,canActivate: [AuthGuard] },
      { path: 'categery', component: CategoryComponent,canActivate: [AuthGuard]  },
      // -------------------------------Inventory---------------------------------
      { path: 'allocate_smartcard', component: AllocatedComponent ,canActivate: [AuthGuard] },
      { path: 'not_allacate_smartcard', component: NotAllocatedComponent ,canActivate: [AuthGuard] },
      { path: 'defective_smart', component: DefectiveSmartcardComponent,canActivate: [AuthGuard]  },
      { path: 'insert_sub', component: InsertSubComponent ,canActivate: [AuthGuard] },
      { path: 'smartcard_declaration', component: SmartcardAllocationComponent ,canActivate: [AuthGuard] },
      { path: 'smartcard_reallocation', component: SmartcardReallocationComponent ,canActivate: [AuthGuard] },
      // // -------------------------------Cas Operation---------------------------------
      { path: 'finger_print', component: FingerPrintComponent,canActivate: [AuthGuard]  },
      { path: 'scrolling', component: ScrollingComponent ,canActivate: [AuthGuard] },
      { path: 'message', component: MessageComponent ,canActivate: [AuthGuard] },
      { path: 'fource_tuning', component: ForceTuningComponent,canActivate: [AuthGuard]  },
      { path: 'mail', component: MailComponent, canActivate: [AuthGuard] },
      // // -------------------------------Subscriber---------------------------------
      { path: 'Create_sub', component: CreateSubscriberComponent },
      { path: 'subscriber', component: SubscriberDetailsComponent },
      { path: 'expiry', component: ExpiryDetailsComponent },
      { path: 'sub_dashboard', component: SubDashboardComponent },
         // // -------------------------------VC/STB master---------------------------------
      { path: 'chipid', component: ChipidModelComponent },
      { path: 'stb_bill', component: StbBillComponent },
      // ---------------------------------------Local-broadcasting-------------------------------
      { path: 'payment_channel', component: PaymentChannelComponent },
      { path: 'local_payment', component: LocalPaymentComponent },
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
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },]

})
export class AdminRoutingModule { }
