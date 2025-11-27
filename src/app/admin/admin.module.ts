import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CoreModule } from "../_core/core/core.module";
// import { AgGridModule } from "ag-grid-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatMaterialModule } from "../_core/core/mat-material/mat-material.module";
import { AdminBaseComponent } from "./admin.base.component";
import { NavComponent } from "./features/nav/nav.component";
import { BarChartComponent } from "../_core/charts/bar-chart/bar-chart.component";

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
import { LcoRechargeReportComponent } from "./features/channel_setting/_Dialogue/LCO_Recharge/lco-recharge-report/lco-recharge-report.component";
import { NewRechargeComponent } from "./features/channel_setting/_Dialogue/LCO_Recharge/new-recharge/new-recharge.component";
import { BulkRechargeComponent } from "./features/channel_setting/_Dialogue/LCO_Recharge/bulk-recharge/bulk-recharge.component";
import { RefundComponent } from "./features/channel_setting/_Dialogue/LCO_Recharge/refund/refund.component";
import { UpdateLcoCommissionComponent } from "./features/channel_setting/_Dialogue/LCO-Commission/update-lco-commission/update-lco-commission.component";
import { CreateLcoComponent } from "./features/channel_setting/_Dialogue/LCO-Commission/create-lco/create-lco.component";
import { UpdateLcoComponent } from "./features/channel_setting/_Dialogue/LCO-Commission/update-lco/update-lco.component";
import { CreateLcoMembershipComponent } from "./features/channel_setting/_Dialogue/LCO-Commission/create-lco-membership/create-lco-membership.component";
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { InventoryChartComponent } from "../_core/charts/inventory-chart/inventory-chart.component";
import { LcoCommissionChartComponent } from "../_core/charts/lco-commission-chart/lco-commission-chart.component";
import { SubscriberdialogueComponent } from "./features/subscriber/subscriberdialogue/subscriberdialogue.component";
import { LcodashboardComponent } from "./features/channel_setting/_Dialogue/operator/lcodashboard/lcodashboard.component";
import { SubloginComponent } from "./features/subscriber/sublogin/sublogin.component";
import { LcochartComponent } from "../_core/charts/lcochart/lcochart.component";
import { LcopiechartComponent } from "../_core/charts/lcopiechart/lcopiechart.component";
import { OperatordialogueComponent } from "./features/channel_setting/_Dialogue/operator/operatordialogue/operatordialogue.component";
import { StreetComponent } from "./features/channel_setting/_Dialogue/operator/street/street.component";
import { NewstreetComponent } from "./features/channel_setting/_Dialogue/operator/newstreet/newstreet.component";
import { PackagewiseOperatorComponent } from "./features/channel_setting/packagewise-operator/packagewise-operator.component";
import { ChannellistComponent } from "./features/subscriber/channellist/channellist.component";
import { PaymentUpdateComponent } from "./features/channel_setting/_Dialogue/local+broadcasting/payment-update/payment-update.component";
import { CreateltbComponent } from "./features/channel_setting/_Dialogue/local+broadcasting/createltb/createltb.component";
import { EditareaComponent } from "./features/channel_setting/_Dialogue/operator/editarea/editarea.component";
import { OperatorlistComponent } from "./features/operator/operatorlist/operatorlist.component";
import { NavbarComponent } from "./features/navbar/navbar.component";
import { CasDialogueComponent } from "./features/channel_setting/_Dialogue/cas-dialogue/cas-dialogue.component";
import { MsodetailsComponent } from "./features/special_role/msodetails/msodetails.component";
import { CasmasterComponent } from "./features/special_role/casmaster/casmaster.component";
import { LcoinvoiceComponent } from "./features/special_role/lcoinvoice/lcoinvoice.component";
import { CasdialogueComponent } from "./features/special_role/Dialogue/casdialogue/casdialogue.component";
import { EditmsoComponent } from "./features/special_role/Dialogue/editmso/editmso.component";
import { SpecialoperatorComponent } from "./features/special_role/specialoperator/specialoperator.component";
import { SpecialoperatordialogueComponent } from "./features/special_role/Dialogue/specialoperatordialogue/specialoperatordialogue.component";
import { SublcooperatorComponent } from "./features/special_role/Dialogue/sublcooperator/sublcooperator.component";
import { SublcooperatordialogueComponent } from "./features/special_role/Dialogue/sublcooperatordialogue/sublcooperatordialogue.component";
import { AddednotaddedComponent } from "./features/special_role/Dialogue/addednotadded/addednotadded.component";
import { PackageplanComponent } from "./features/special_role/packageplan/packageplan.component";
import { PackageplandialogueComponent } from "./features/special_role/Dialogue/packageplandialogue/packageplandialogue.component";
import { ChanneldetailsComponent } from "./features/special_role/channeldetails/channeldetails.component";
import { ChanneldialogueComponent } from "./features/special_role/Dialogue/channeldialogue/channeldialogue.component";
import { AdsdetailsComponent } from "./features/special_role/adsdetails/adsdetails.component";
import { AdsdialogueComponent } from "./features/special_role/Dialogue/adsdialogue/adsdialogue.component";
import { LoginsettingsComponent } from "./features/special_role/loginsettings/loginsettings.component";
import { TaxComponent } from "./features/special_role/tax/tax.component";
import { ProofComponent } from "./features/special_role/proof/proof.component";
import { ProofdetailsComponent } from "./features/special_role/Dialogue/proofdetails/proofdetails.component";
import { TaxdetailsComponent } from "./features/special_role/Dialogue/taxdetails/taxdetails.component";
import { LogindialogueComponent } from "./features/special_role/Dialogue/logindialogue/logindialogue.component";
import { EditDismembershipComponent } from "./features/channel_setting/_Dialogue/LCO-Commission/edit-dismembership/edit-dismembership.component";
import { SpecialBulkpackageComponent } from "./features/special_role/Bulk operaton/special-bulkpackage/special-bulkpackage.component";
import { SpecialcancelsubscriptionComponent } from "./features/special_role/Bulk operaton/specialcancelsubscription/specialcancelsubscription.component";
import { SpecialareachangeComponent } from "./features/special_role/Bulk operaton/specialareachange/specialareachange.component";
import { SpeciallcochangeComponent } from "./features/special_role/Bulk operaton/speciallcochange/speciallcochange.component";
import { SpecialeditbulkpackageComponent } from "./features/special_role/Dialogue/Bulk operation/specialeditbulkpackage/specialeditbulkpackage.component";
import { SpeciallcotransferComponent } from "./features/special_role/Bulk operaton/speciallcotransfer/speciallcotransfer.component";
import { OperatorcancelsubreportComponent } from "./features/channel_setting/_Dialogue/operator/operatorcancelsubreport/operatorcancelsubreport.component";
import { LcologinpageComponent } from "./features/subscriber/lcologinpage/lcologinpage.component";
import { LoginrefundComponent } from "./features/channel_setting/_Dialogue/LCO_Recharge/loginrefund/loginrefund.component";
import { BulkpackageupdationComponent } from "./features/channel_setting/_Dialogue/BULK OPERATION/bulkpackageupdation/bulkpackageupdation.component";
import { TraiReportComponent } from "./features/channel_setting/Reports/trai-report/trai-report.component";
import { ChartInventoryReportComponent } from "../_core/Chart-Reports/chart-inventory-report/chart-inventory-report.component";
import { ChartPackageReportComponent } from "../_core/Chart-Reports/chart-package-report/chart-package-report.component";
import { ChartSTBReportComponent } from "../_core/Chart-Reports/chart-stbreport/chart-stbreport.component";
import { HistoryReportsComponent } from "./features/channel_setting/Reports/history-reports/history-reports.component";
import { PackageBasedComponent } from "./features/channel_setting/Reports_page/Trai/package-based/package-based.component";
import { SubscriptionBasedComponent } from "./features/channel_setting/Reports_page/Trai/subscription-based/subscription-based.component";
import { BroadcasterReportsComponent } from "./features/channel_setting/Reports_page/Trai/broadcaster-reports/broadcaster-reports.component";
import { HistoryAllReportsComponent } from "./features/channel_setting/Reports_page/Trai/History/history-all-reports/history-all-reports.component";
import { MsoreportsComponent } from "./features/channel_setting/Reports/msoreports/msoreports.component";
import { TopSubLoginComponent } from "./features/top_sub_login/top-sub-login/top-sub-login.component";
import { MsorDialogueportsComponent } from "./features/channel_setting/Reports_page/MSO/msor-dialogueports/msor-dialogueports.component";
import { CortonboxComponent } from "./features/inventory_role/cortonbox/cortonbox.component";
import { InventoryroleComponent } from "./features/inventory_role/inventoryrole/inventoryrole.component";
import { LicenseComponent } from "./features/inventory_role/license/license.component";
import { InventoryloginComponent } from "./features/inventory_role/Dialogue/inventorylogin/inventorylogin.component";
import { InventorycortonboxComponent } from "./features/inventory_role/Dialogue/inventorycortonbox/inventorycortonbox.component";
import { InventoryDialogueComponent } from "./features/inventory_role/Dialogue/inventory-dialogue/inventory-dialogue.component";
import { LicenseexpireComponent } from "./features/inventory_role/Dialogue/licenseexpire/licenseexpire.component";
import { ServiceComponent } from "./features/Service_center_role/service/service.component";
import { OperatordashboardComponent } from "./features/operator_Login/operatordashboard/operatordashboard.component";
import { ServicecenterEditComponent } from "./features/Service_center_role/Dialog/servicecenter-edit/servicecenter-edit.component";
import { OnlinerechargeComponent } from "./features/operator_Login/onlinerecharge/onlinerecharge.component";
import { OnlinecustomerdetailsComponent } from "./features/operator_Login/onlinecustomerdetails/onlinecustomerdetails.component";
import { RechagelogComponent } from "./features/operator_Login/rechagelog/rechagelog.component";
import { AreaStreetComponent } from "./features/operator_Login/area-street/area-street.component";
import { OperatorWalletComponent } from "./features/operator_Login/Dialog/operator-wallet/operator-wallet.component";
import { LcoDashboardComponent } from "./features/operator_Login/Dialog/lco-dashboard/lco-dashboard.component";
import { ForcemessageComponent } from "./features/operator_Login/forcemessage/forcemessage.component";
import { LcoChangePasswordComponent } from "./features/operator_Login/lco-change-password/lco-change-password.component";
import { LcodiscountComponent } from "./features/operator_Login/lcodiscount/lcodiscount.component";
import { LcoReportComponent } from "./features/operator_Login/lco-report/lco-report.component";
import { LcologinReportComponent } from "./features/operator_Login/Dialog/lcologin-report/lcologin-report.component";
import { DistributorsettingComponent } from "./features/operator_Login/distributorsetting/distributorsetting.component";
import { BillcollectionComponent } from "./features/operator_Login/billcollection/billcollection.component";
import { LcoSmartcardDialogComponent } from "./features/operator_Login/Dialog/lco-smartcard-dialog/lco-smartcard-dialog.component";
import { LcoSmartcardpayDialogComponent } from "./features/operator_Login/Dialog/lco-smartcardpay-dialog/lco-smartcardpay-dialog.component";
import { SmrtBoxidChangeComponent } from "./features/operator_Login/smrt-boxid-change/smrt-boxid-change.component";
import { LcodashboardreportComponent } from "./features/operator_Login/lcodashboardreport/lcodashboardreport.component";
import { OperatorareachangeComponent } from "./features/operator_Login/operatorareachange/operatorareachange.component";
import { DiscountdialogComponent } from "./features/operator_Login/Dialog/discountdialog/discountdialog.component";
import { DiscountsmartcardComponent } from "./features/operator_Login/Dialog/discountsmartcard/discountsmartcard.component";
import { DistributordiscountComponent } from "./features/operator_Login/Dialog/distributordiscount/distributordiscount.component";
import { DistribtorupdatediscountComponent } from "./features/operator_Login/Dialog/distribtorupdatediscount/distribtorupdatediscount.component";
import { LcoDummycmpComponent } from "./features/operator_Login/lco-dummycmp/lco-dummycmp.component";
import { DialogChipidComponent } from "./features/vc/stc/dialog/dialog-chipid/dialog-chipid.component";
import { LcodashboardsublcoreportComponent } from "./features/operator_Login/lcodashboardsublcoreport/lcodashboardsublcoreport.component";
import { LcocommisiomddiscountComponent } from "./features/channel_setting/lcocommisiomddiscount/lcocommisiomddiscount.component";
import { LogincredentialComponent } from "./features/special_role/logincredential/logincredential.component";
import { LcocommissioncredentialComponent } from "./features/channel_setting/lcocommissioncredential/lcocommissioncredential.component";
import { SidenavpermissionComponent } from "./features/special_role/Dialogue/sidenavpermission/sidenavpermission.component";
import { SmartcardrefreshComponent } from "./features/Bulk_operation/smartcardrefresh/smartcardrefresh.component";
import { version } from "moment";
import { VersionComponent } from "./features/version/version.component";
import { BobbulechartComponent } from "../_core/charts/bobbulechart/bobbulechart.component";
import { VersionLoginCredentialComponent } from "./features/version/dialog/version-login-credential/version-login-credential.component";
import { HomeLoginCredentialComponent } from "./features/home_Dialog/home-login-credential/home-login-credential.component";
import { RechargeConfirmationComponent } from "./features/channel_setting/_Dialogue/recharge-confirmation/recharge-confirmation.component";
import { BulkoperatorcreationComponent } from "./features/Bulk_operation/bulkoperatorcreation/bulkoperatorcreation.component";
import { VoicerecognizeComponent } from "./features/voicerecognize/voicerecognize.component";
import { PaymentcustomerComponent } from "./features/Add payment/paymentcustomer/paymentcustomer.component";
import { LogmaintainComponent } from "./features/logmaintain/logmaintain.component";
import { AccountInfoComponent } from "./features/account-info/account-info.component";
import { BulkQrComponent } from "./features/Bulk_operation/bulk-qr/bulk-qr.component";
@NgModule({
    declarations: [
        AdminBaseComponent, NavComponent, HomeComponent, NavbarComponent, MsodetailsComponent, CasmasterComponent, HomeLoginCredentialComponent,
        // -------------------------Dashboard-----------------------------
        BarChartComponent, InventoryChartComponent, LcoCommissionChartComponent,
        PackageChartComponent, StbChartComponent, BobbulechartComponent,
        // -------------------------------------Dashboard Report--------------------------------
        ChartSTBReportComponent, ChartPackageReportComponent, ChartInventoryReportComponent,
        // -------------------------------------Top_subscriber_Details------------------------------------
        TopSubDetailComponent,
        // -----------------------------------------operator----------------------------------
        OperatorlistComponent, OperatorDetailsComponent, LcoRechargeComponent, TopSubLoginComponent, EditLcoComponent, SpecialPermissionComponent, NewLcoComponent, NewstreetComponent,
        AddLcoBusinessComponent, LcodashboardComponent, LcochartComponent, LcopiechartComponent, OperatordialogueComponent, StreetComponent, EditareaComponent,
        OperatorcancelsubreportComponent, LoginrefundComponent,
        // --------------LCO RECHARGE-----------------
        LcoRechargeReportComponent, NewRechargeComponent, BulkRechargeComponent, RefundComponent, BulkpackageupdationComponent,
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
        AddLcoComponent, ChangeMembershipComponent, UpdateLcoCommissionComponent, CreateLcoComponent, UpdateLcoComponent, CreateLcoMembershipComponent,
        // -------------------------------Subscriber---------------------------------
        CreateSubscriberComponent, SubscriberDetailsComponent, ExpiryDetailsComponent, SubDashboardComponent, SubscriberdialogueComponent,
        SubloginComponent, ChannellistComponent, LcologinpageComponent,
        // -----------------------------------------Cas Operation---------------------------------
        FingerPrintComponent, ScrollingComponent, MessageComponent, ForceTuningComponent, MailComponent, CasDialogueComponent,
        // -------------------------------Inventory---------------------------------
        AllocatedComponent, NotAllocatedComponent, DefectiveSmartcardComponent, InsertSubComponent, SmartcardAllocationComponent, ReplaceInventoryComponent, InsertSubDialogComponent,
        SmartcardReallocationComponent, UpdateInventoryComponent, AllocatedInventoryComponent, EditInventoryComponent, SubInventoryComponent, DefectiveInventoryComponent, ReallocationComponent,
        // // -------------------------------VC/STB master---------------------------------
        ChipidModelComponent, StbBillComponent,
        // ----------------------------------Local Broadcasting---------------------------------
        LocalPaymentComponent, PaymentChannelComponent, AddLtbComponent, UpdateLtbComponent,

        // -----------------------------------bulk operation-------------------------------
        SubscriberImportComponent, AlacarteActivationComponent, AddonActivationComponent, ActivationComponent, BulkBaseChangeComponent, BulkPageUpdationComponent,
        DeactivationComponent, SubscriptionExdendComponent, RefreshComponent, RecurringComponent, SmartcardrefreshComponent, BulkoperatorcreationComponent,BulkQrComponent,

        // --------------------------------------------Local Broadcasting-------------------------------------------------------------------------------
        PaymentUpdateComponent, CreateltbComponent, UpdateLtbComponent,
        // ----------------------------------------------Special role-----------------------------------------
        LcoinvoiceComponent, CasdialogueComponent, EditmsoComponent, SpecialoperatorComponent, SpecialoperatordialogueComponent, SublcooperatorComponent, SublcooperatordialogueComponent,
        AddednotaddedComponent, PackageplanComponent, PackageplandialogueComponent, ChanneldetailsComponent, ChanneldialogueComponent, AdsdetailsComponent, AdsdialogueComponent, LoginsettingsComponent,
        TaxComponent, ProofComponent, ProofdetailsComponent, TaxdetailsComponent, LogindialogueComponent, EditDismembershipComponent, SpecialBulkpackageComponent,
        SpecialcancelsubscriptionComponent, SpecialareachangeComponent, SpeciallcochangeComponent, SpecialeditbulkpackageComponent, SpeciallcotransferComponent, SidenavpermissionComponent,
        // =====================================================Reports=========================================
        TraiReportComponent, SubscriptionBasedComponent, HistoryReportsComponent, PackageBasedComponent, BroadcasterReportsComponent, HistoryAllReportsComponent, MsoreportsComponent, MsorDialogueportsComponent,
        InventoryroleComponent, LicenseComponent, CortonboxComponent, InventoryloginComponent, InventorycortonboxComponent, InventoryDialogueComponent, LicenseexpireComponent, ServiceComponent,
        // =========================================================ONLINE ROLE============================================
        OperatordashboardComponent, LcoDashboardComponent,
        ServicecenterEditComponent, OnlinerechargeComponent, OnlinecustomerdetailsComponent, RechagelogComponent, AreaStreetComponent, OperatorWalletComponent, ForcemessageComponent,
        LcoChangePasswordComponent, LcodiscountComponent, LcoReportComponent, LcologinReportComponent, DistributorsettingComponent, BillcollectionComponent,
        LcoSmartcardDialogComponent, LcoSmartcardpayDialogComponent, SmrtBoxidChangeComponent, LcodashboardreportComponent, OperatorareachangeComponent, DiscountdialogComponent, DiscountsmartcardComponent,
        DistributordiscountComponent, DistribtorupdatediscountComponent, LcoDummycmpComponent, DialogChipidComponent, LcodashboardsublcoreportComponent, LcocommisiomddiscountComponent, LogincredentialComponent, LcocommissioncredentialComponent,
        // ===============================================version======================================
        VersionComponent, VersionLoginCredentialComponent, RechargeConfirmationComponent, VoicerecognizeComponent, PaymentcustomerComponent, AccountInfoComponent,
        // ===========================================Logs===========================================
        LogmaintainComponent

    ],
    imports: [
        CommonModule,
        CoreModule,
        DragDropModule,
        AgGridModule,
        AdminRoutingModule,
        ReactiveFormsModule,
        MatMaterialModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        CanvasJSAngularChartsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})

export class AdminModule { }