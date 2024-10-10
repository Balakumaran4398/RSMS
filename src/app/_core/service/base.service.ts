import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import URLs from "src/app/URL";
import { Observable, Subscriber } from 'rxjs';
const AUTH_URL = URLs.AUTH_URL();
const BASE_URL = URLs.BASE_URL();
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class BaseService {
  someOtherApiCall(role: any, username: string): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/someOtherApiEndpoint?role=" + role + "&username=" + username,
      { observe: 'response' }
    );
  }

  private defaultLogoUrl = 'https://via.placeholder.com/150';
  constructor(private http: HttpClient) {
    // this.get()
  }
  getDefaultLogoFile(): Promise<File | null> {
    return this.http.get(this.defaultLogoUrl, { responseType: 'blob' }).toPromise().then(blob => {
      if (blob) {
        return new File([blob], 'default-logo.png', { type: 'image/png' });
      } else {
        console.error('Error: Blob is undefined.');
        return null; // Handle the undefined case
      }
    }).catch(error => {
      console.error('Error fetching default logo:', error);
      return null;
    });
  }
  // ========================================================OPERATOR=============================================
  // ----------------------------------------------------Operator Details---------------------------------------------

  OperatorDetails(role: any, username: string, operatorid: number): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getOperatorDetails?role=" + role + "&username=" + username + "&operatorid=" + operatorid);
  }
  // --------------------------------------------- New Operator-----------------------------------------
  NewOperator(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/createOperator", requestBody, {});
  }
  getLcoBusinesslist(role: any, username: string): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getlcoBusinesslist?role=" + role + "&username=" + username);
  }
  getOeratorList(role: any, username: string): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getOperatorlist?role=" + role + "&username=" + username);
  }
  // ----------------------------------------Edit Operator----------------------------------------
  getpaymentgatwaylist(role: any, username: string): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getPaymentGatewayList?role=" + role + "&username=" + username);
  }
  EditOperator(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/EditOperator", requestBody, {})
  }

  // ---------------------------------------SetOperatorPermission------------------------------
  SetOperatorPermission(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/setOperatorPermission", requestBody, {})
  }
  // -------------------------------------------------NEW LCO Business---------------------------------------------
  NewLCObusiness(businessname: any, role: any, username: string): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/CreateLcoBussiness?businessname=" + businessname + "&role=" + role + "&username=" + username, {});
  }
  // ---------------------------------------LCO RECHARGE--------------------------------------------------
  LCOLogin(role: any, username: any, userid: any, password: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/CheckRechargeCredentials?role=" + role + "&username=" + username + "&userid=" + userid + "&password=" + password)
  }
  getRechargeDetailsByFdTdOpid(role: any, username: any, fromdate: any, todate: any, operatorid: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/GetRechargeDetailsByFdTdOpid?role=" + role + "&username=" + username + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid, { observe: 'response' })
  }
  getRechargeDetailsByDate(role: any, username: any, date: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRechargeDetailsByDate?role=" + role + "&username=" + username + "&date=" + date, { observe: 'response' })
  }
  getRecharegDetailsByYearAndMonth(role: any, username: any, year: any, month: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRecharegDetailsByYearAndMonth?role=" + role + "&username=" + username + "&year=" + year + "&month=" + month, { observe: 'response' })
  }
  getRechargeDetailsByYear(role: any, username: any, year: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRechargeDetailsByYear?role=" + role + "&username=" + username + "&year=" + year, { observe: 'response' })
  }
  getRechargeDetailsById(role: any, username: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRechargeDetailsById?role=" + role + "&username=" + username + "&id=" + id)
  }
  getRefundListByOperatorIdAndSmartcard(role: any, username: any, operatorid: any, smartcard: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRefundListByOperatorIdAndSmartcard?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&smartcard=" + smartcard, { observe: 'response' })
  }
  getPackagewiseRechargeDetailsforBarchart(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/GetPackagewiseRechargeDetailsforBarchart?role=" + role + "&username=" + username + "&operatorid=" + operatorid)
  }
  getPackagewiseRechargeDetailsforPiechart(role: any, username: any, packageid: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/GetPackagewiseRechargeDetailsforPiechart?role=" + role + "&username=" + username + "&packageid=" + packageid + "&operatorid=" + operatorid)
  }
  getStreetListByAreaId(role: any, username: any, areaid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/GetStreetListByAreaId?role=" + role + "&username=" + username + "&areaid=" + areaid)
  }
  createArea(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/CreateArea", requestBody, {});
  }
  createStreet(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/CreateStreet", requestBody, {});
  }
  updateStreet(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/UpdateStreet", requestBody, {});
  }
  updateArea(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/UpdateArea", requestBody, {});
  }
  getAreaDetailsById(role: any, username: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/operator/getAreaDetailsById?role=" + role + "&username=" + username + "&id=" + id);
  }
  getAreaListByOperatorId(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/operator/getAreaListByOperatorId?role=" + role + "&username=" + username + "&operatorid=" + operatorid);
  }
  // ----------------------------------------------New Recharge------------------------------------------
  Newrecharge(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/singleOperatorRecharge", requestBody, {})
  }
  // --------------------------------------------------BULK RECHARGE----------------------------------------------
  bulkOperatorRecharge(role: any, username: string, operatorlist: any, amount: any, remarks: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/bulkOperatorRecharge?role=" + role + "&username=" + username + "&operatorlist=" + operatorlist + "&amount=" + amount + "&remarks=" + remarks, {});
  }

  // ---------------------------------------------------------Refund-------------------------------------------------

  getRefund(role: any, username: any, id: any, amount: any, remarks: any, operatorid: any, isenablesmartcard: boolean): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/refundAmount?role=" + role + "&username=" + username + "&id=" + id + "&amount=" + amount + "&remarks=" + remarks + "&operatorid=" + operatorid + "&isenablesmartcard=" + isenablesmartcard)
  }
  // =======================================================CHANNEL SETTING======================================================
  // ---------------------------------------------------------------Broad_caster-------------------------------------

  BroadcasterList(role: any, username: string, type: number): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/master/broadcasterList?role=" + role + "&username=" + username + "&type=" + type);
  }


  Broadcaster(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/broadcaster", requestBody, {});
  }
  Broadcaster_update(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateBroadcaster", requestBody, {});
  }

  deleteBroadcaster(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/master/deleteBroadcaster?role=" + role + "&username=" + username + "&id=" + id);
  }

  ActiveBroadcaster(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/master/multiselectBroadcasterActive?role=" + role + "&username=" + username + "&id=" + id, {})
  }
  // ===============================================================CATEGORY=================================================================
  CategoryList(role: any, username: string, type: number): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/master/categoryList?role=" + role + "&username=" + username + "&type=" + type);
  }
  Category(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/category", requestBody, {});
  }
  Category_update(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateCategory", requestBody, {});
  }
  deleteCategory(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/master/deleteCategory?role=" + role + "&username=" + username + "&id=" + id);
  }
  ActiveCategory(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/master/multiselectCategoryActive?role=" + role + "&username=" + username + "&id=" + id, {})
  }
  // =====================================================================CHANNEL==========================================================================

  deleteChannel(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/package/deleteChannel?role=" + role + "&username=" + username + "&id=" + id);
  }

  ActiveChannel(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/master/multiselectChannelActive?role=" + role + "&username=" + username + "&id=" + id, {})
  }
  CREATE_CHANNEL(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/createChannel", requestBody, {});
  }
  UPDATE_CHANNEL(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/updateChannel", requestBody, {});
  }
  ChannelList(role: any, username: string, type: string): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getallChannellist?role=" + role + "&username=" + username + "&type=" + type);
  }
  uploadChannellist(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/uploadChannellist", requestBody, {});
  }
  Upload_channel_list(role: any, u_name: any, filepath: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/saveUploadchannellist?&role=" + role + "&username=" + u_name + "&filepath=" + filepath, {});
  }
  // ===========================================================CHANNELTYPE LIST-========================================================
  ChannelTypeList(role: any, username: string, type: number): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/master/channeltypeList?role=" + role + "&username=" + username + "&type=" + type);
  }
  ServiceList(role: any, username: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/GetServicelist?role=" + role + "&username=" + username);
  }
  Channel_Type(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/channeltype", requestBody, {});
  }
  ChannelType_update(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateChanneltype", requestBody, {});
  }

  deleteChannelType(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/master/deleteChannelType?role=" + role + "&username=" + username + "&id=" + id);
  }
  ActiveChannelTpe(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/master/multiselectChanneltypeActive?role=" + role + "&username=" + username + "&id=" + id, {})
  }

  // ===============================================================Distributor list=================================================================
  DistributorList(role: any, username: string, type: number): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/master/distributorList?role=" + role + "&username=" + username + "&type=" + type);
  }

  Distributor(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/distributor", requestBody, {});
  }
  Distributor_update(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateDistributor", requestBody, {});
  }
  deleteDistributor(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/master/deleteDistributor?role=" + role + "&username=" + username + "&id=" + id);
  }

  ActivateDistributor(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/master/multiselectDistributorActive?role=" + role + "&username=" + username + "&id=" + id, {})
  }
  // =================================================================Product Reference=========================================================
  ProductTeference(role: any, username: string, castype: any, type: any,): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/GetAllProductReferenceDetails?role=" + role + "&username=" + username + "&castype=" + castype + "&type=" + type);
  }
  ProductTeference_SaveAll(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/saveAllProductReference", requestBody, {});
  }
  // =================================================================PackageWise Operator=========================================================
  ProductTypeList(role: any, username: string,): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getProductTypeList?role=" + role + "&username=" + username);
  }
  ProductList(role: any, username: string, producttype: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getProductListForOperatorByType?role=" + role + "&username=" + username + "&producttype=" + producttype);
  }
  ProductListForOperator(role: any, username: string, producttype: any, referenceid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/getOperatorProductListByTypeAndProductId?role=" + role + "&username=" + username + "&producttype=" + producttype + "&referenceid=" + referenceid, {});
  }
  ProductListForOperator_allocate_to_notallocate(role: any, username: string, producttype: any, referenceid: any, selectedoplist: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/AddingOperatorForProduct?role=" + role + "&username=" + username + "&producttype=" + producttype + "&referenceid=" + referenceid + "&selectedoplist=" + selectedoplist, {});
  }
  // =================================================================Package=========================================================
  PackageList(role: any, username: string, type: number): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getpackageList?role=" + role + "&username=" + username + "&type=" + type);
  }
  Package_CloneList(role: any, username: string, packageid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getBasePackDetailsByPackageId?role=" + role + "&username=" + username + "&packageid=" + packageid);
  }
  Package_Update(p_name: any, p_desc: any, p_rate: any, o_id: any, role: any, u_name: any, commission: any, ispercentage: any, package_id: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/updatePackages?package_name=" + p_name + "&package_desc=" + p_desc + "&package_rate=" + p_rate + "&order_id=" + o_id + "&commission=" + commission + "&ispercentage=" + ispercentage + "&package_id=" + package_id + "&role=" + role + "&username=" + u_name,
      {}
    );
  }
  CREATE_BASE_PACKAGE(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/createPackage", requestBody, {});
  }
  Base_PackageChannelList(role: any, username: string, type: number, package_id: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getChannelistbyPackageView?role=" + role + "&username=" + username + "&packageid=" + package_id + "&type=" + type);
  }
  MANAGE_PACKAGE(package_id: any, role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/managePackages?packageid=" + package_id + "&role=" + role + "&username=" + username, {});
  }
  AddingdAlacarteTo_Base_Package(modified: any, selectedchannellist: any, role: any, u_name: any, package_id: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/AddingdAlacarteToPackage?role=" + role + "&username=" + u_name + "&packageid=" + package_id + "&selectedchannellist=" + selectedchannellist + "&modified=" + modified,
      {}
    );
  }
  AddingdbouquetTo_Base_Package(modified: any, selectedbouquetlist: any, role: any, u_name: any, package_id: any, removedchannellist: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/AddingBouquetToPackage?role=" + role + "&username=" + u_name + "&packageid=" + package_id + "&selectedbouquetlist=" + selectedbouquetlist + "&modified=" + modified + "&removedchannellist=" + removedchannellist,
      {}
    );
  }
  AddingdAlacarteTo_Addon_Package(modified: any, selectedchannellist: any, role: any, u_name: any, package_id: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/AddingAlacarteToAddonpackage?role=" + role + "&username=" + u_name + "&packageid=" + package_id + "&selectedchannellist=" + selectedchannellist + "&modified=" + modified,
      {}
    );
  }
  AddingdbouquetTo_Addon_Package(modified: any, selectedbouquetlist: any, role: any, u_name: any, package_id: any, removedchannellist: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/AddingBouquetToAddonPackage?role=" + role + "&username=" + u_name + "&packageid=" + package_id + "&selectedbouquetlist=" + selectedbouquetlist + "&modified=" + modified + "&removedchannellist=" + removedchannellist,
      {}
    );
  }
  RcasPackageChannelList(role: any, username: string, type: number, package_id: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getverifyRcasChanlistPackage?role=" + role + "&username=" + username + "&packageid=" + package_id + "&type=" + type);
  }
  Clone_create(p_id: any, p_name: any, p_desc: any, p_rate: any, o_id: any, role: any, u_name: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/clonePackages?packageid=" + p_id + "&packagename=" + p_name + "&package_desc=" + p_desc + "&package_rate=" + p_rate + "&order_id=" + o_id + "&role=" + role + "&username=" + u_name, {});
  }

  // ==========================================================================ADDON PACKAGE==================================================================

  AddonPackageList(role: any, username: string, type: number): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getaddonpackageList?role=" + role + "&username=" + username + "&type=" + type);
  }
  Addon_PackageChannelList(package_id: any, role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getChannellistByAddonpackageView?role=" + role + "&username=" + username + "&packageid=" + package_id,);
  }
  UPDATE_ADDON_PACKAGE(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/updateAddonpack", requestBody, {});
  }
  ADDON_MANAGE_PACKAGE(package_id: any, role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/manageAddonpackage?id=" + package_id + "&role=" + role + "&username=" + username,);
  }
  CREATE_ADDON_PACKAGE(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/createAddonpackage", requestBody, {});
  }
  // ========================================================================Product-Reference====================================================

  PackagemasterList(role: any, username: string, type: any, castype: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getpackagemasterList?role=" + role + "&username=" + username + "&type=" + type + "&castype=" + castype);
  }
  // ============================================================Package Master=========================================
  UpdatePackagemasterList(role: any, username: string, id: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/updatepackagemaster?role=" + role + "&username=" + username + "&id=" + id);
  }

  // ==============================Fingerprint=======================================
  Cas_type(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/cas/getcaslist?role=" + role + "&username=" + username,
      {}
    );
  }
  Finger_area(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/area/getallactivearea?role=" + role + "&username=" + username,

    );
  }
  Finger_print_List(role: any, username: string,): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/fingerprint/getfingerprint?role=" + role + "&username=" + username);
  }
  Finger_datas(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/fingerprint/getfingerprint?role=" + role + "&username=" + username,

    );
  }
  // ==========================================SUBSCRIBER====================================
  // -----------------------------------------------Subscriber Dashboard-------------------------------------------------
  getSearchDetailsSubscriber(role: any, username: any, searchname: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSearchDetails?role=" + role + "&username=" + username + "&searchname=" + searchname,);
  }
  getQuickOperationDetailsBySearchname(role: any, username: any, searchname: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getQuickOperationDetailsBySearchname?role=" + role + "&username=" + username + "&searchname=" + searchname,);
  }
  getBoxidBySmartcard(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getBoxidBySmartcard?role=" + role + "&username=" + username + "&smartcard=" + smartcard,);
  }
  getNotallocatedSmartcardListByCastypeAndOperatorid(role: any, username: any, operatorid: any, castype: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getNotallocatedSmartcardListByCastypeAndOperatorid?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&castype=" + castype,);
  }
  getNotinOperatorList(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getNotinOperatorList?role=" + role + "&username=" + username + "&operatorid=" + operatorid,);
  }
  getAllBaselistbyOperatorIdCastypeType(role: any, username: any, operatorid: any, castype: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAllBaselistbyOperatorIdCastypeType?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&castype=" + castype + "&type=" + type,);
  }
  updatelogindetails(role: any, username: any, subid: any, islock: any, password: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/updatelogindetails?role=" + role + "&username=" + username + "&subid=" + subid + "&islock=" + islock + "&password=" + password, {});
  }
  addSmartcardToSubscriber(role: any, username: any, operatorid: any, castype: any, smartcard: any, boxid: any, subid: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/addSmartcardToSubscriber?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&castype=" + castype + "&smartcard=" + smartcard + "&boxid=" + boxid + "&subid=" + subid, {});
  }
  transferLcoToSmartcard(role: any, username: any, operatorid: any, areaid: any, streetid: any, subid: any, withsubscription: boolean, retailerid: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/transferLcoToSmartcard?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&areaid=" + areaid + "&streetid=" + streetid + "&subid=" + subid + "&withsubscription=" + withsubscription + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  getSubDetailsBySubId(role: any, username: any, subid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSubDetailsBySubId?role=" + role + "&username=" + username + "&subid=" + subid);
  }
  getActivePackagePlanList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getActivePackagePlanList?role=" + role + "&username=" + username);
  }
  getPlanTypeList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getPlanTypeList?role=" + role + "&username=" + username, {}
    );
  }
  getActiveCasList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getActiveCasList?role=" + role + "&username=" + username);
  }
  getSmartcardListBySubId(role: any, username: any, subid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSmartcardListBySubId?role=" + role + "&username=" + username + "&subid=" + subid);
  }
  getNewsubscriberDetails(role: any, username: any, subid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/GetNewsubscriberDetails?role=" + role + "&username=" + username + "&subid=" + subid);
  }
  getQuickOperationDetailsBySmartcard(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getQuickOperationDetailsBySmartcard?role=" + role + "&username=" + username + "&smartcard=" + smartcard);
  }

  UpdateSubscriberDetails(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/UpdateSubscriberDetails", requestBody, {});
  }

  refreshSmartcard(role: any, username: any, smartcard: any, retailerid: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/RefreshSmartcard?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type);
  }
  deactivationofSmartcard(role: any, username: any, smartcard: any, type: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/DeactivationofSmartcard?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&type=" + type, {});
  }
  cancelSubscriptionOfSmartcardDetails(role: any, username: any, smartcard: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/CancelSubscriptionOfSmartcardDetails?role=" + role + "&username=" + username + "&smartcard=" + smartcard, {});
  }
  cancelSmartcard(role: any, username: any, smartcard: any, type: any, retailerid: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/CancelSmartcard?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&type=" + type + "&retailerid=" + retailerid, {});
  }
  pinchange(role: any, username: any, smartcard: any, pinnumber: any, type: any, retailerid: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/Pinchange?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&pinnumber=" + pinnumber + "&type=" + type + "&retailerid=" + retailerid, {});
  }
  pvrChange(role: any, username: any, smartcard: any, pvrstatus: boolean, type: any, retailerid: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/PVRChange?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&pvrstatus=" + pvrstatus + "&type=" + type + "&retailerid=" + retailerid, {});
  }
  reactivationofSmartcard(role: any, username: any, smartcard: any, retailerid: any, type: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/ReactivationofSmartcard?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type, {});
  }

  deleteForceMessage(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/deleteForceMessage?role=" + role + "&username=" + username + "&smartcard=" + smartcard, {});
  }
  boxIdChange(role: any, username: any, smartcard: any, boxid: any, retailerid: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/BoxIdChange?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&boxid=" + boxid + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  forceTuning(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/ForceTuning?role=" + role + "&username=" + username + "&smartcard=" + smartcard, {});
  }

  sendMessage(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/sendMessage", requestBody, {});
  }

  firsttimeActivationOfCard(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/FirsttimeActivationOfCard", requestBody, {});
  }
  ActivationOfCard(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/ActivationOfCard", requestBody, {});
  }
  ManagePackageCalculation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/ManagePackageCalculation", requestBody, {});
  }
  ManagePackageRecharge(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/ManagePackageRecharge", requestBody, {});
  }

  getFirstTimeActivationConfirmation(role: any, username: any, packageid: any, plantype: any, plan: any, smartcard: any, type: any, retailerid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getFirstTimeActivationConfirmation?role=" + role + "&username=" + username + "&packageid=" + packageid + "&plantype=" + plantype + "&plan=" + plan + "&smartcard=" + smartcard + "&type=" + type + "&retailerid=" + retailerid);
  }
  smartcardSuspend(role: any, username: any, smartcard: any, retailerid: any, type: any, reason: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/SmartcardSuspend?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type + "&reason=" + reason, {});
  }
  smartcardResume(role: any, username: any, smartcard: any, retailerid: any, type: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/SmartcardResume?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  blockSmartcard(role: any, username: any, smartcard: any, type: any, reason: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/BlockSmartcard?role=" + role + "&username=" + username + "&smartcard=" + smartcard + "&type=" + type + "&reason=" + reason, {});
  }
  getSubscriberIdListByOperatorid(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSubscriberIdListByOperatorid?role=" + role + "&username=" + username + "&operatorid=" + operatorid);
  }
  getPdfBillReport(role: any, username: any, subid: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getPdfBillReport?role=" + role + "&username=" + username + "&subid=" + subid + "&smartcard=" + smartcard);
  }
  lcotransferSinglesmartcard(role: any, username: any, operatorid: any, oldsubid: boolean, newsubid: any, withsubscription: any, smartcard: any, retailerid: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/lcotransferSinglesmartcard?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&oldsubid=" + oldsubid + "&newsubid=" + newsubid + "&withsubscription=" + withsubscription + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  checkLoginCredenticals(role: any, username: any, userid: any, password: boolean, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/checkLoginCredenticals?role=" + role + "&username=" + username + "&userid=" + userid + "&password=" + password + "&type=" + type, {});
  }
  PairSmartcardOrBoxid(role: any, username: any, ischeck: any, smartcard: boolean, boxid: any, retailerid: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/PairSmartcardOrBoxid?role=" + role + "&username=" + username + "&ischeck=" + ischeck + "&smartcard=" + smartcard + "&boxid=" + boxid + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  UnpairSmartcardOrBoxId(role: any, username: any, ischeck: any, smartcard: boolean, retailerid: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/UnpairSmartcardOrBoxId?role=" + role + "&username=" + username + "&ischeck=" + ischeck + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  getChannellistByPackageIdAndProductType(role: any, username: any, packageid: any, producttype: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getChannellistByPackageIdAndProductType?role=" + role + "&username=" + username + "&packageid=" + packageid + "&producttype=" + producttype);
  }
  getBaseChangeConfirmation(role: any, username: any, packageid: any, plantype: any, plan: any, smartcard: any, type: any, retailerid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getBaseChangeConfirmation?role=" + role + "&username=" + username + "&packageid=" + packageid + "&plantype=" + plantype + "&plan=" + plan + "&smartcard=" + smartcard + "&type=" + type + "&retailerid=" + retailerid);
  }
  getAddonpackageDetails(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAddonpackageDetails?role=" + role + "&username=" + username + "&smartcard=" + smartcard);
  }
  getAlacarteDetails(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAlacarteDetails?role=" + role + "&username=" + username + "&smartcard=" + smartcard);
  }
  removeProductDetails(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/removeProductDetails?role=" + role + "&username=" + username + "&smartcard=" + smartcard);
  }

  baseChangeofSmartcardPackage(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/baseChangeofSmartcardPackage", requestBody, {});
  }
  addAddonForSmartcard(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/addAddonForSmartcard", requestBody, { observe: "response" });
  }
  addAddonConfirmation(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/addAddonConfirmation", requestBody, { observe: "response" });
  }
  addAlacarteConfirmation(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/addAlacarteConfirmation", requestBody, { observe: "response" });
  }
  addAlacarteForSmartcard(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/addAlacarteForSmartcard", requestBody, { observe: "response" });
  }
  removeProductConfirmation(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/removeProductConfirmation", requestBody, { observe: "response" });
  }
  removeProductForSmartcard(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/removeProductForSmartcard", requestBody, { observe: "response" });
  }
  // -------------------------------------------------------------------------------------------------


  createSubscriber(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/createSubscriber", requestBody, {});
  }

  getsubscriberlist_subscriber(role: any, username: any, status: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSubscriberList?role=" + role + "&username=" + username + "&status=" + status,);
  }
  getOperatorListforSubInsert(role: any, username: any,): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getOperatorListforSubInsert?role=" + role + "&username=" + username,);
  }
  getAreaListByOperatorid(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAreaListByOperatorid?role=" + role + "&username=" + username + "&operatorid=" + operatorid);
  }
  getStreetListByAreaid(role: any, username: any, areaid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getStreetListByAreaid?role=" + role + "&username=" + username + "&areaid=" + areaid);
  }
  getIdProofList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getIdProofList?role=" + role + "&username=" + username, {}
    );
  }
  getAddresProofList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAddresProofList?role=" + role + "&username=" + username, {}
    );
  }

  getExpirySubscriberByOperator(role: any, username: any, operatorid: any, fromdate: any, todate: any, format: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getExpirySubscriberByOperator?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&fromdate=" + fromdate + "&todate=" + todate + "&format=" + format, {}
    )
  }

  // -------------------------------------_Expiry getExpirySubscriberByOperator----------------------------------------------
  // =============================================LCO COMMISSION================================================
  getLcoGroupMasterList(role: any, username: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/GetLcoGroupMasterList?role=" + role + "&username=" + username)
  }
  getLcoCommissionListByLcoGroupId(role: any, username: any, lcogroupid: any,): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getLcoCommissionListByLcoGroupId?role=" + role + "&username=" + username + "&lcogroupid=" + lcogroupid,)
  }

  // -------------------------------Update lco commission---------------------------
  updateLcoCommission(role: any, username: any, id: any, istax: boolean, ispercentage: boolean, commission: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/updateLcoCommission?role=" + role + "&username=" + username + "&id=" + id + "&istax=" + istax + "&ispercentage=" + ispercentage + "&commission=" + commission, {})
  }
  // -----------------------------------------------ADD PRODUCT / COMMISSION MEMBERSHIP-----------------------------------------
  getproductMembershipList(role: any, username: any, producttype: any, lcogroupid: any,): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getproductMembershipList?role=" + role + "&username=" + username + "&producttype=" + producttype + "&lcogroupid=" + lcogroupid, { observe: "response" })
  }

  addProductMembership(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/addProductMembership", requestBody, {});
  }

  // ====================================LCO MEMBERSHIP==========================
  // -------------------pie chart-------------------------
  getMembershipcountForPiechart(role: any, username: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getMembershipcountForPiechart?role=" + role + "&username=" + username)
  }
  // --------------------------------------------------------------------
  getLcoGroupDetails(role: any, username: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/GetLcoGroupDetails?role=" + role + "&username=" + username)
  }
  createLcoGroup(role: any, username: any, groupname: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/createLcoGroup?role=" + role + "&username=" + username + "&groupname=" + groupname, {})
  }
  getLcoGroupMasterListNotInLcogroupId(role: any, username: any, lcogroupid: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/GetLcoGroupMasterListNotInLcogroupId?role=" + role + "&username=" + username + "&lcogroupid=" + lcogroupid)
  }
  getOperatorlistByGroupId(role: any, username: any, lcogroupid: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getOperatorlistByGroupId?role=" + role + "&username=" + username + "&lcogroupid=" + lcogroupid)
  }
  // -------------------------------------------LCO MEMBERSHIP FUP----------------------------------
  getOperatorMembershipFUP(role: any, username: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getOperatorMembershipFUP?role=" + role + "&username=" + username)
  }
  createlcomembershipFUP(role: any, username: any, operatorid: any, usedcount: any, sharecount: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/createlcomembershipFUP?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&usedcount=" + usedcount + "&sharecount=" + sharecount, {})
  }
  UpdatecomembershipFUP(role: any, username: any, id: any, sharecount: any, lcogroupid: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/updateLcoMembershipFUPDetails?role=" + role + "&username=" + username + "&id=" + id + "&sharecount=" + sharecount + "&lcogroupid=" + lcogroupid, {})
  }
  updateLcoMembership(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/updateLcoMembership", requestBody, {});
  }
  // ==============================================Inventory=======================================================

  // -------------------------------------------------------GET----------------------------------
  Not_Allocated(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getNotAllocatedList?role=" + role + "&username=" + username,
      {}
    );
  }
  Smart_Allocated(role: any, username: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getNotAllocationSmartDetails?role=" + role + "&username=" + username + "&id=" + id,
      {}
    );
  }

  Allocated_smartcard_List(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getallocatedSmartcardList?role=" + role + "&username=" + username, {}
    );
  }
  getsearchforallocated_smartcard_List(role: any, username: any, operatorid: any, searchname: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/allocation/getsearchforallocatedSmartcardList?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&searchname=" + searchname, {}
    );
  }
  getDeallocate_smartcard_List(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getDeallocatedsmartcardlist?role=" + role + "&username=" + username, {}
    );
  }
  getsmartcardReallocationlist(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getsmartcardReallocationlist?role=" + role + "&username=" + username, {}
    );
  }
  getsmartcardallocationSubscriberList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getsmartcardallocationSubscriberList?role=" + role + "&username=" + username, {}
    );
  }
  getOperatorWiseSubscriberList(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getOperatorWiseSubscriberList?role=" + role + "&username=" + username + "&operatorid=" + operatorid, {}
    );
  }
  getsubscriberlist_allocation(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getsubscriberlist?role=" + role + "&username=" + username + "&operatorid=" + operatorid, {}
    );
  }
  getCastypeforUnPair(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getCastypeforUnPair?role=" + role + "&username=" + username, {}
    );
  }

  GetcasListforPacakge(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/GetcasListforPacakge?role=" + role + "&username=" + username, {}
    );
  }
  Defective_Smartcard_list(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getAllSmartcardForSetDefectiveSmartcardlist?role=" + role + "&username=" + username, {}
    );
  }
  // -----------------------------------------------------------POST--------------------------------------------------------------

  UploadInventory(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/uploadInventoryfile", requestBody, {});
  }
  Update_smartcard_Allocated(role: any, username: any, id: any, smartcard: any, boxid: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/allocation/updateNotallocatedsmartcard?role=" + role + "&username=" + username + "&id=" + id + "&smartcard=" + smartcard + "&boxid=" + boxid,
      {}
    );
  }
  ALLOCATED_SMARTCARD_TO_LCO(smartcardlist: any, role: any, username: any, isemi: boolean, totalamount: any, operatorid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/allocateSmartcardToOperator?smartcardlist=" + smartcardlist + "&role=" + role + "&username=" + username + "&isemi=" + isemi + "&totalamount=" + totalamount + "&operatorid=" + operatorid, {});
  }
  Create_Allocated(operatorid: any, castype: any, smartcard: any, boxid: any, role: any, username: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/createNewSmartcardAllocation?role=" + role + "&username=" + username + "&castype=" + castype + "&operatorid=" + operatorid + "&smartcard=" + smartcard + "&boxid=" + boxid, {});
  }
  Defective_remark_Allocated(id: any, remarks: any, role: any, username: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/setDefectiveSmartcard?role=" + role + "&username=" + username + "&id=" + id + "&remarks=" + remarks, {});
  }
  Defective_Replace_Allocated(role: any, username: any, id: any, smartcard: any, boxid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/setReplaceSmartcardBoxid?role=" + role + "&username=" + username + "&id=" + id + "&smartcard=" + smartcard + "&boxid=" + boxid, {});
  }
  Defective_Insert_Allocated(role: any, username: any, subid: any, id: any, operatorid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/allocateSmartcardToSubscriber?role=" + role + "&username=" + username + "&subid=" + subid + "&id=" + id + "&operatorid=" + operatorid, {});
  }
  ReAllocate_Smartcard(role: any, username: any, smartcardlist: any, operatorid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/reallocateSmartcard?role=" + role + "&username=" + username + "&smartcardlist=" + smartcardlist + "&operatorid=" + operatorid, {});
  }
  DeAllocate_Smartcard(role: any, username: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/smartcardDeallocation?role=" + role + "&username=" + username + "&id=" + id, {});
  }
  // -----------------------------------------------------___DELETE -------------------------------------------------------------
  delete_Smartcard_boxid(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/allocation/deleteDeallocatedSmartcard?role=" + role + "&username=" + username + "&id=" + id);
  }
  // =======================================================CAS OPERATION=================================================
  // ----------------------------- Finger Print------------------------

  SendFingerPrint(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/fingerprint/sendFingerPrint", requestBody, {});
  }

  StopFingerPrint(requestBody: any): Observable<any[]> {
    console.log('stop API');

    return this.http.post<any[]>(BASE_URL + "/fingerprint/stopFingerPrint", requestBody, {});
  }
  // -------------------------------------------MAIL---------------------------------
  GetMail(role: any, username: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/mail/getMail?role=" + role + "&username=" + username + "&id=" + id, {}
    );
  }
  GetMail_List(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/mail/getMailList?role=" + role + "&username=" + username, {}
    );
  }
  CreateMail(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/mail/sendMail", requestBody, {});
  }
  // ----------------------------------------------_SCROLL----------------------------------
  CreateScroll(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/scroll/sendscroll", requestBody, {});
  }
  Get_Scroll_version(id: any, role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/scroll/getScrollversion?id=" + id + "&role=" + role + "&username=" + username, {}
    );
  }
  Get_Scroll_version_List(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/scroll/getScrollversionList?role=" + role + "&username=" + username, {}
    );
  }
  // ---------------------------------MESSAGE-----------------------------------------------
  GetMessage(role: any, username: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/message/getMessage?role=" + role + "&username=" + username + "&id=" + id, {}
    );
  }
  GetMessageList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/message/getMessageList?role=" + role + "&username=" + username, {}
    );
  }
  CreateMessage(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/message/sendmessage", requestBody, {});
  }
  // --------------------------------------Force Tuning--------------------------------
  CreateForce(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/force/sendforce", requestBody, {});
  }
  // -----------------------TOP Subscription Details------------------------------------------
  getAllSubscriptionDetails(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/package/getAllSubscriptionDetails?role=" + role + "&username=" + username, {}
    );
  }



  // =======================================================================Bulk operation===========================================================

  getBulkOperationRefreshList(role: any, username: any, remarks: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getBulkOperationRefreshList?role=" + role + "&username=" + username + "&remarks=" + remarks, { observe: 'response' }
    );
  }

  getBulkOperationListByDate(role: any, username: any, remarks: any, date: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getBulkOperationListByDate?role=" + role + "&username=" + username + "&remarks=" + remarks + "&date=" + date,
      { observe: 'response' }
    );
  }
  getDeactivationRefresh(role: any, username: any, remarks: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getDeactivationRefresh?role=" + role + "&username=" + username + "&remarks=" + remarks,
      { observe: 'response' }
    );
  }
  getDeactivationFilterlist(role: any, username: any, remarks: any, date: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getDeactivationFilterlist?role=" + role + "&username=" + username + "&remarks=" + remarks + "&date=" + date, { observe: 'response' }
    );
  }
  getRecurringListByOperatorIdSearchnameAndIsrecurring(role: any, username: any, operatorid: any, searchname: any, type: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getRecurringListByOperatorIdSearchnameAndIsrecurring?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&searchname=" + searchname + "&type=" + type, { observe: 'response' }
    );
  }
  getAddonlistByCasType(role: any, username: any, castype: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getAddonlistByCasType?role=" + role + "&username=" + username + "&castype=" + castype, {});
  }

  uploadFileforDeactivation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/uploadFileforDeactivation", requestBody, {});
  }
  uploadFirsttimeActivation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/uploadFirsttimeActivation", requestBody, {});
  }
  bulkSubscriberInsert(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/bulkSubscriberInsert", requestBody, {});
  }
  // ====================================================Local Channel===============================
  getAllLocalChannelList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getAllLocalChannelList?role=" + role + "&username=" + username, {});
  }
  getLocalChannelList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getLocalChannelList?role=" + role + "&username=" + username, {});
  }
  getLocalChannelOperatorList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getLocalChannelOperatorList?role=" + role + "&username=" + username, {});
  }
  getLocalCreationAmountDetails(role: any, username: any, channelrate: any, istax: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getLocalCreationAmountDetails?role=" + role + "&username=" + username + "&channelrate=" + channelrate + "&istax=" + istax, {});
  }
  createLocalChannel(role: any, username: any, channelid: any, operatorid: any, tax: any, lcoprice: any, lcn: any, channelrate: any, istax: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/localchannel/createLocalChannel?role=" + role + "&username=" + username + "&channelid=" + channelid + "&operatorid=" + operatorid + "&tax=" + tax + "&lcoprice=" + lcoprice + "&lcn=" + lcn + "&channelrate=" + channelrate + "&istax=" + istax, {});
  }
  updateLocalChannel(role: any, username: any, channelid: any, operatorid: any, tax: any, lcoprice: any, lcn: any, channelrate: any, istax: any, id: any, isactive: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/localchannel/updateLocalChannel?role=" + role + "&username=" + username + "&channelid=" + channelid + "&operatorid=" + operatorid + "&tax=" + tax + "&lcoprice=" + lcoprice + "&lcn=" + lcn + "&channelrate=" + channelrate + "&istax=" + istax + "&id=" + id + "&isactive=" + isactive, {});
  }
  getLocalChannelPayConfirmation(role: any, username: any, serviceid: any, paidamount: any, iscredit: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getLocalChannelPayConfirmation?role=" + role + "&username=" + username + "&serviceid=" + serviceid + "&paidamount=" + paidamount + "&iscredit=" + iscredit, {});
  }
  payLocalChannel(role: any, username: any, serviceid: any, paidamount: any, iscredit: any, days: any, expirydate: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/localchannel/payLocalChannel?role=" + role + "&username=" + username + "&serviceid=" + serviceid + "&paidamount=" + paidamount + "&iscredit=" + iscredit + "&days=" + days + "&expirydate=" + expirydate, {});
  }
}