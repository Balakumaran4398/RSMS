import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CoreModule } from "../_core/core/core.module";
// import { AgGridModule } from "ag-grid-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatMaterialModule } from "../_core/core/mat-material/mat-material.module";
import { AdminBaseComponent } from "./admin.base.component";
import { NavComponent } from "./features/nav/nav.component";
import { BarChartComponent } from "../_core/charts/bar-chart/bar-chart.component";
import { InventoryChartComponent } from "../_core/charts/inventory-chart/inventory-chart.component";
import { PackageChartComponent } from "../_core/charts/package-chart/package-chart.component";
import { StbChartComponent } from "../_core/charts/stb-chart/stb-chart.component";
import { AdminRoutingModule } from "./admin.routing.module";
import { OperatorDetailsComponent } from "./features/operator/operator-details/operator-details.component";
import { LcoRechargeComponent } from "./features/operator/lco-recharge/lco-recharge.component";
import { BroadMasterComponent } from "./features/channel_setting/broad-master/broad-master.component";
import { CategoryComponent } from "./features/channel_setting/category/category.component";
import { ChannelTypeComponent } from "./features/channel_setting/channel-type/channel-type.component";
import { ChannelComponent } from "./features/channel_setting/channel/channel.component";
import { DistributorMasterComponent } from "./features/channel_setting/distributor-master/distributor-master.component";
import { PackageCreationComponent } from "./features/channel_setting/package-creation/package-creation.component";
import { PackageMasterComponent } from "./features/channel_setting/package-master/package-master.component";
import { PackageReferenceComponent } from "./features/channel_setting/package-reference/package-reference.component";
import { AddonPackageComponent } from "./features/channel_setting/addon-package/addon-package.component";
import { CreateSubscriberComponent } from "./features/subscriber/create-subscriber/create-subscriber.component";
import { ExpiryDetailsComponent } from "./features/subscriber/expiry-details/expiry-details.component";
import { SubDashboardComponent } from "./features/subscriber/sub-dashboard/sub-dashboard.component";
import { SubscriberDetailsComponent } from "./features/subscriber/subscriber-details/subscriber-details.component";
import { FingerPrintComponent } from "./features/cas_operaion/finger-print/finger-print.component";
import { ForceTuningComponent } from "./features/cas_operaion/force-tuning/force-tuning.component";
import { MailComponent } from "./features/cas_operaion/mail/mail.component";
import { MessageComponent } from "./features/cas_operaion/message/message.component";
import { ScrollingComponent } from "./features/cas_operaion/scrolling/scrolling.component";
import { AllocatedComponent } from "./features/inventory/allocated/allocated.component";
import { DefectiveSmartcardComponent } from "./features/inventory/defective-smartcard/defective-smartcard.component";
import { InsertSubComponent } from "./features/inventory/insert-sub/insert-sub.component";
import { NotAllocatedComponent } from "./features/inventory/not-allocated/not-allocated.component";
import { SmartcardAllocationComponent } from "./features/inventory/smartcard-allocation/smartcard-allocation.component";
import { SmartcardReallocationComponent } from "./features/inventory/smartcard-reallocation/smartcard-reallocation.component";
import { LcoCommissionComponent } from "./features/channel_setting/lco-commission/lco-commission.component";
import { ChipidModelComponent } from "./features/vc/stc/chipid-model/chipid-model.component";
import { StbBillComponent } from "./features/vc/stc/stb-bill/stb-bill.component";
import { TopSubDetailComponent } from "./features/top-sub-detail/top-sub-detail.component";
import { CategoryDialogComponent } from "./features/channel_setting/_Dialogue/category_master/category-dialog/category-dialog.component";
import { BroadCreateDialogComponent } from "./features/channel_setting/_Dialogue/broad-create-dialog/broad-create-dialog.component";
import { ChannelEditComponent } from "./features/channel_setting/_Dialogue/Channel_dialog/channel-edit/channel-edit.component";
import { ChannelUploadComponent } from "./features/channel_setting/_Dialogue/Channel_dialog/channel-upload/channel-upload.component";
import { ChannelCreateComponent } from "./features/channel_setting/_Dialogue/Channel_dialog/channel-create/channel-create.component";
import { CreateChannelTypeComponent } from "./features/channel_setting/_Dialogue/channel_Type/create-channel-type/create-channel-type.component";
import { CreateDistributorComponent } from "./features/channel_setting/_Dialogue/Distributor_dialog/create-distributor/create-distributor.component";
import { EditDistributorComponent } from "./features/channel_setting/_Dialogue/Distributor_dialog/edit-distributor/edit-distributor.component";
import { PackageBaseViewComponent } from "./features/channel_setting/_Dialogue/package Creation/package-base-view/package-base-view.component";
import { PackageCloneComponent } from "./features/channel_setting/_Dialogue/package Creation/package-clone/package-clone.component";
import { PackageCreateComponent } from "./features/channel_setting/_Dialogue/package Creation/package-create/package-create.component";
import { PackageEditComponent } from "./features/channel_setting/_Dialogue/package Creation/package-edit/package-edit.component";
import { PackageBASEDEMOComponent } from "./features/channel_setting/_Dialogue/package Creation/package-base-demo/package-base-demo.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { AddonViewComponent } from "./features/channel_setting/_Dialogue/Addon_package/addon-view/addon-view.component";
import { AddonEditComponent } from "./features/channel_setting/_Dialogue/Addon_package/addon-edit/addon-edit.component";
import { AddonCreationComponent } from "./features/channel_setting/_Dialogue/Addon_package/addon-creation/addon-creation.component";
import { UpdatePackageMasterComponent } from "./features/channel_setting/_Dialogue/package_master/update-package-master/update-package-master.component";
import { AddLcoComponent } from "./features/channel_setting/_Dialogue/LCO-Commission/add-lco/add-lco.component";
import { ChangeMembershipComponent } from "./features/channel_setting/_Dialogue/LCO-Commission/change-membership/change-membership.component";
import { HomeComponent } from "./features/home/home.component";
import { AgChartsAngularModule } from "ag-charts-angular";
import { PaymentChannelComponent } from "./features/local_broadcasting/payment-channel/payment-channel.component";
import { LocalPaymentComponent } from "./features/local_broadcasting/local-payment/local-payment.component";
import { AddLtbComponent } from "./features/channel_setting/_Dialogue/local+broadcasting/add-ltb/add-ltb.component";
import { UpdateLtbComponent } from "./features/channel_setting/_Dialogue/local+broadcasting/update-ltb/update-ltb.component";
import { SubscriberImportComponent } from "./features/Bulk_operation/subscriber-import/subscriber-import.component";
import { ActivationComponent } from "./features/Bulk_operation/activation/activation.component";
import { AddonActivationComponent } from "./features/Bulk_operation/addon-activation/addon-activation.component";
import { AlacarteActivationComponent } from "./features/Bulk_operation/alacarte-activation/alacarte-activation.component";
import { BulkBaseChangeComponent } from "./features/Bulk_operation/bulk-base-change/bulk-base-change.component";
import { BulkPageUpdationComponent } from "./features/Bulk_operation/bulk-page-updation/bulk-page-updation.component";
import { DeactivationComponent } from "./features/Bulk_operation/deactivation/deactivation.component";
import { RecurringComponent } from "./features/Bulk_operation/recurring/recurring.component";
import { RefreshComponent } from "./features/Bulk_operation/refresh/refresh.component";
import { SubscriptionExdendComponent } from "./features/Bulk_operation/subscription-exdend/subscription-exdend.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { EditLcoComponent } from "./features/channel_setting/_Dialogue/operator/edit-lco/edit-lco.component";
import { SpecialPermissionComponent } from "./features/channel_setting/_Dialogue/operator/special-permission/special-permission.component";
import { NewLcoComponent } from "./features/channel_setting/_Dialogue/operator/new-lco/new-lco.component";
import { AddLcoBusinessComponent } from "./features/channel_setting/_Dialogue/operator/add-lco-business/add-lco-business.component";
import { UpdateInventoryComponent } from "./features/channel_setting/_Dialogue/Inventory/update-inventory/update-inventory.component";
import { AllocatedInventoryComponent } from "./features/channel_setting/_Dialogue/Inventory/allocated-inventory/allocated-inventory.component";
import { EditInventoryComponent } from "./features/channel_setting/_Dialogue/Inventory/edit-inventory/edit-inventory.component";
import { SubInventoryComponent } from "./features/channel_setting/_Dialogue/Inventory/sub-inventory/sub-inventory.component";
import { DefectiveInventoryComponent } from "./features/channel_setting/_Dialogue/Inventory/defective-inventory/defective-inventory.component";
import { ReplaceInventoryComponent } from "./features/channel_setting/_Dialogue/Inventory/replace-inventory/replace-inventory.component";
import { InsertSubDialogComponent } from "./features/channel_setting/_Dialogue/Inventory/insert_sub/insert-sub-dialog/insert-sub-dialog.component";
import { ReallocationComponent } from "./features/channel_setting/_Dialogue/Inventory/Smartcard_Reallocation/reallocation/reallocation.component";
import { AgGridModule } from "ag-grid-angular";
import { LcoRechargePageComponent } from "./features/channel_setting/_Dialogue/LCO_Recharge/lco-recharge-page/lco-recharge-page.component";
import { LcoRechargeReportComponent } from "./features/channel_setting/_Dialogue/LCO_Recharge/lco-recharge-report/lco-recharge-report.component";


@NgModule({
    declarations: [
        AdminBaseComponent, NavComponent, HomeComponent,
        // -------------------------Dashboard-----------------------------
        BarChartComponent, InventoryChartComponent,
        PackageChartComponent, StbChartComponent,
        // -------------------------------------Top_subscriber_Details------------------------------------
        TopSubDetailComponent,
        // -----------------------------------------operator----------------------------------
        OperatorDetailsComponent, LcoRechargeComponent, EditLcoComponent, SpecialPermissionComponent, NewLcoComponent, AddLcoBusinessComponent,
        // --------------LCO RECHARGE-----------------
        LcoRechargePageComponent,LcoRechargeReportComponent,
        //==========================================channel_setting==============================================
        AddonPackageComponent, BroadMasterComponent, ChannelComponent, ChannelTypeComponent, DistributorMasterComponent,
        CreateDistributorComponent, LcoCommissionComponent, PackageReferenceComponent, PackageCreationComponent, PackageMasterComponent,
        CategoryComponent, EditDistributorComponent,
        //  -----------------------------------------------------package----------------------------------------
        PackageEditComponent, PackageCreateComponent, PackageCloneComponent, PackageBASEDEMOComponent, PackageBaseViewComponent,
        // -----------------------------------------Addon package---------------------------------------------
        AddonViewComponent, AddonEditComponent, AddonCreationComponent,
        // -------------------------broad-caster(dialog)----------------------------------------
        BroadCreateDialogComponent,

        // -------------------------Category(dialog)----------------------------------------
        CategoryDialogComponent,
        // -------------------------------CHANNEL (DIALOG)-----------------------------------------------
        ChannelEditComponent, ChannelUploadComponent, ChannelCreateComponent, CreateChannelTypeComponent,
        // -------------------------packade-master-----------------------
        UpdatePackageMasterComponent,
        // ------------------------------------LCO Commission----------------------------------
        AddLcoComponent, ChangeMembershipComponent,
        // -------------------------------Subscriber---------------------------------
        CreateSubscriberComponent, SubscriberDetailsComponent, ExpiryDetailsComponent, SubDashboardComponent,
        // -----------------------------------------Cas Operation---------------------------------
        FingerPrintComponent, ScrollingComponent, MessageComponent, ForceTuningComponent, MailComponent,
        // -------------------------------Inventory---------------------------------
        AllocatedComponent, NotAllocatedComponent, DefectiveSmartcardComponent, InsertSubComponent, SmartcardAllocationComponent, ReplaceInventoryComponent, InsertSubDialogComponent,
        SmartcardReallocationComponent, UpdateInventoryComponent, AllocatedInventoryComponent, EditInventoryComponent, SubInventoryComponent, DefectiveInventoryComponent, ReallocationComponent,
        // // -------------------------------VC/STB master---------------------------------
        ChipidModelComponent, StbBillComponent,
        // ----------------------------------Local Broadcasting---------------------------------
        LocalPaymentComponent, PaymentChannelComponent, AddLtbComponent, UpdateLtbComponent,

        // -----------------------------------bulk operation-------------------------------
        SubscriberImportComponent, AlacarteActivationComponent, AddonActivationComponent, ActivationComponent, BulkBaseChangeComponent, BulkPageUpdationComponent,
        DeactivationComponent, SubscriptionExdendComponent, RefreshComponent, RecurringComponent



    ],
    imports: [
        CommonModule,
        CoreModule,
        DragDropModule,
        AgGridModule, AgChartsAngularModule,
        AdminRoutingModule,
        ReactiveFormsModule,
        MatMaterialModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AdminModule { }