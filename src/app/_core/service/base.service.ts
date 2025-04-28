import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import URLs from "src/app/URL";
import { Observable, Subscriber } from 'rxjs';
// import dashboard from "node_modules1/@/material/schematics/ng-generate/dashboard";
var AUTH_URL = URLs.AUTH_URL();
var BASE_URL = URLs.BASE_URL();
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class BaseService {
  // someOtherApiCall(role: any, username: string): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(
  //     BASE_URL + "/someOtherApiEndpoint?role=" + role + "&username=" + encodeURIComponent(username),
  //     { observe: 'response' }
  //   );
  // }

  ip: any;
  domain: any;
  private defaultLogoUrl = 'https://via.placeholder.com/150';
  constructor(private http: HttpClient) {

    // const currentUrl = window.location.href;
    // const { ip, domain } = this.extractIpOrDomain(currentUrl);
    // this.ip = ip;
    // this.domain = domain;
    // if (this.ip) {
    //   localStorage.setItem('globalIp', this.ip);
    // } else {
    //   localStorage.setItem('globalDomain', this.domain);
    // }
    // console.log("Stored IP:", localStorage.getItem('globalIp'));
    // console.log("Stored Domain:", localStorage.getItem('globalDomain'));

    // // AUTH_URL = ip
    // //   ? `http://${this.ip}:8585/rsms/api`
    // //   : `http://${this.domain}:8585/rsms/api`;

    // BASE_URL = ip
    //   ? `http://${this.ip}:8585/rsms/api`
    //   : `http://${this.domain}:8585/rsms/api`;

    // console.log("Final AUTH_API:", BASE_URL);
  }

  extractIpOrDomain(url: string): { ip: string | null; domain: string | null } {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      console.log("Extracted Hostname:", hostname);

      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;

      if (ipPattern.test(hostname)) {
        console.log("Detected IP:", hostname);
        return { ip: hostname, domain: null };
      } else {
        console.log("Detected Domain:", hostname);
        return { ip: null, domain: hostname };
      }
    } catch (error) {
      console.error("Invalid URL:", error);
      return { ip: null, domain: null };
    }
  }
  // ========================================================Dashboard======================================================
  //  ------------------------------STB------------------------------
  getDashboardStbBarChart(role: any, username: string): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getDashboardStbBarChart?role=" + role + "&username=" + encodeURIComponent(username));
  }
  //  ------------------------------Inventory------------------------------
  getDashboardBoxPieChart(role: any, username: string): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getDashboardBoxPieChart?role=" + role + "&username=" + encodeURIComponent(username));
  }
  //  ------------------------------PackageDetails------------------------------
  gettaxdetailsbyRate(role: any, username: string, rate: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/gettaxdetailsbyRate?role=" + role + "&username=" + encodeURIComponent(username) + "&rate=" + rate);
  }
  getCommissionvalue(role: any, username: string, commission: any, customer_amount: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getCommissionvalue?commission=" + commission + "&customer_amount=" + customer_amount + "&role=" + role + "&username=" + encodeURIComponent(username));
  }
  getpercentageValue(role: any, username: string, commission: any, ispercentage: boolean, customer_amount: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getpercentageValue?commission=" + commission + "&ispercentage=" + ispercentage + "&customer_amount=" + customer_amount + "&role=" + role + "&username=" + encodeURIComponent(username));
  }
  getDashboardProductDetails(role: any, username: string): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getDashboardProductDetails?role=" + role + "&username=" + encodeURIComponent(username));
  }
  //  ------------------------------SubscribtionBarChart------------------------------
  getDashboardSubscribtionBarChartDetails(role: any, username: string, date: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getDashboardSubscribtionBarChartDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date);
  }
  // ============================================================================================================================================
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
    return this.http.get<any[]>(BASE_URL + "/operator/getOperatorDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid);
  }
  // --------------------------------------------- New Operator-----------------------------------------
  NewOperator(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/createOperator", requestBody, {});
  }
  getLcoBusinesslist(role: any, username: string): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getlcoBusinesslist?role=" + role + "&username=" + encodeURIComponent(username));
  }
  // getOeratorList(role: any, username: string): Observable<any[]> {
  //   return this.http.get<any[]>(BASE_URL + "/operator/getOperatorlist?role=" + role + "&username=" + encodeURIComponent(username));
  // }
  getOeratorList(role: any, username: string, type: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getOperatorlist?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type);
  }
  getAllOperatorDetails(role: any, username: string, type: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getAllOperatorDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type);
  }
  // ----------------------------------------Edit Operator----------------------------------------
  getpaymentgatwaylist(role: any, username: string): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getPaymentGatewayList?role=" + role + "&username=" + encodeURIComponent(username));
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
    return this.http.post<any[]>(BASE_URL + "/operator/CreateLcoBussiness?businessname=" + businessname + "&role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  // ---------------------------------------LCO RECHARGE--------------------------------------------------
  LCOLogin(role: any, username: any, userid: any, password: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/CheckRechargeCredentials?role=" + role + "&username=" + encodeURIComponent(username) + "&userid=" + encodeURIComponent(userid) + "&password=" + encodeURIComponent(password) + "&type=" + type)
  }

  getRechargeDetailsByFdTdOpid(role: any, username: any, fromdate: any, todate: any, operatorid: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/GetRechargeDetailsByFdTdOpid?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid, { observe: 'response' })
  }
  getRechargeDetailsByDate(role: any, username: any, date: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRechargeDetailsByDate?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date, { observe: 'response' })
  }
  getRecharegDetailsByYearAndMonth(role: any, username: any, year: any, month: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRecharegDetailsByYearAndMonth?role=" + role + "&username=" + encodeURIComponent(username) + "&year=" + year + "&month=" + month, { observe: 'response' })
  }
  getRechargeDetailsByYear(role: any, username: any, year: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRechargeDetailsByYear?role=" + role + "&username=" + encodeURIComponent(username) + "&year=" + year, { observe: 'response' })
  }
  getRechargeDetailsById(role: any, username: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRechargeDetailsById?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id)
  }
  getRefundListByOperatorId(role: any, username: any, operatorid: any, isenablesmartcard: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRefundListByOperatorId?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&isenablesmartcard=" + isenablesmartcard, { observe: 'response' })
  }
  getRefundListByOperatorIdAndSmartcard(role: any, username: any, operatorid: any, smartcard: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/operator/getRefundListByOperatorIdAndSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&smartcard=" + smartcard, { observe: 'response' })
  }
  getPackagewiseRechargeDetailsforBarchart(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/GetPackagewiseRechargeDetailsforBarchart?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid)
  }
  getPackagewiseRechargeDetailsforPiechart(role: any, username: any, packageid: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/GetPackagewiseRechargeDetailsforPiechart?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + packageid + "&operatorid=" + operatorid)
  }
  getStreetListByAreaId(role: any, username: any, areaid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/GetStreetListByAreaId?role=" + role + "&username=" + encodeURIComponent(username) + "&areaid=" + areaid)
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
      BASE_URL + "/operator/getAreaDetailsById?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id);
  }
  getAreaListByOperatorId(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/operator/getAreaListByOperatorId?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid);
  }
  // ----------------------------------------------New Recharge------------------------------------------
  Newrecharge(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/singleOperatorRecharge", requestBody, {})
  }
  // --------------------------------------------------BULK RECHARGE----------------------------------------------
  bulkOperatorRecharge(role: any, username: string, operatorlist: any, amount: any, remarks: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/bulkOperatorRecharge?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorlist=" + operatorlist + "&amount=" + amount + "&remarks=" + remarks, {});
  }

  // ---------------------------------------------------------Refund-------------------------------------------------

  getRefund(role: any, username: any, id: any, amount: any, remarks: any, operatorid: any, isenablesmartcard: boolean): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/refundAmount?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&amount=" + amount + "&remarks=" + remarks + "&operatorid=" + operatorid + "&isenablesmartcard=" + isenablesmartcard, {})
  }
  // =======================================================CHANNEL SETTING======================================================
  // ---------------------------------------------------------------Broad_caster-------------------------------------

  BroadcasterList(role: any, username: string, type: number): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/master/broadcasterList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type);
  }


  Broadcaster(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/broadcaster", requestBody, {});
  }
  Broadcaster_update(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateBroadcaster", requestBody, {});
  }

  deleteBroadcaster(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/master/deleteBroadcaster?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id);
  }

  ActiveBroadcaster(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/master/multiselectBroadcasterActive?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {})
  }
  // ===============================================================CATEGORY=================================================================
  CategoryList(role: any, username: string, type: number): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/master/categoryList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type);
  }
  Category(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/category", requestBody, {});
  }
  Category_update(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateCategory", requestBody, {});
  }
  deleteCategory(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/master/deleteCategory?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id);
  }
  ActiveCategory(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/master/multiselectCategoryActive?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {})
  }
  // =====================================================================CHANNEL==========================================================================

  deleteChannel(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/package/deleteChannel?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id);
  }

  ActiveChannel(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/package/multiselectChannelActive?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {})
  }
  CREATE_CHANNEL(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/createChannel", requestBody, {});
  }
  UPDATE_CHANNEL(requestBody: any): Observable<any[]> {
    return this.http.put<any[]>(BASE_URL + "/package/updateChannel", requestBody, {});
  }
  EditChannelDetails(requestBody: any): Observable<any[]> {
    return this.http.put<any[]>(BASE_URL + "/package/getChannelbyId", requestBody, {});
  }

  ChannelList(role: any, username: string, type: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getallChannellist?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type);
  }
  uploadChannellist(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/uploadChannellist", requestBody, {});
  }
  Upload_channel_list(role: any, u_name: any, filepath: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/saveUploadchannellist?&role=" + role + "&username=" + encodeURIComponent(u_name) + "&filepath=" + filepath, {});
  }
  // getPdfCasformReport(role: any, username: any, subid: any): Observable<Blob> {
  //   return this.http.get(BASE_URL + "/subscriber/getPdfCasformReport?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid, { responseType: 'blob' });
  // }
  getChannelPDFReport(role: any, u_name: any, type: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getChannelReport?&role=" + role + "&username=" + encodeURIComponent(u_name) + "&type=" + type, { responseType: 'blob' });
  }
  getChannelExcelReport(role: any, username: string, type: string): Observable<HttpResponse<any[]>> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getallChannellist?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type, { observe: 'response' });
  }
  // ===========================================================CHANNELTYPE LIST-========================================================
  ChannelTypeList(role: any, username: string, type: number): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/master/channeltypeList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type);
  }
  ServiceList(role: any, username: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/GetServicelist?role=" + role + "&username=" + encodeURIComponent(username));
  }
  Channel_Type(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/channeltype", requestBody, {});
  }
  ChannelType_update(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateChanneltype", requestBody, {});
  }

  deleteChannelType(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/master/deleteChannelType?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id);
  }
  ActiveChannelTpe(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/master/multiselectChanneltypeActive?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {})
  }

  // ===============================================================Distributor list=================================================================
  DistributorList(role: any, username: string, type: number): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/master/distributorList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type);
  }

  Distributor(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/distributor", requestBody, {});
  }
  Distributor_update(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateDistributor", requestBody, {});
  }
  deleteDistributor(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/master/deleteDistributor?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id);
  }

  ActivateDistributor(role: any, username: any, id: any) {
    return this.http.post<any[]>(BASE_URL + "/master/multiselectDistributorActive?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {})
  }
  // =================================================================Product Reference=========================================================
  ProductTeference(role: any, username: string, castype: any, type: any,): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/GetAllProductReferenceDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&castype=" + castype + "&type=" + type);
  }
  ProductTeference_SaveAll(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/saveAllProductReference", requestBody, {});
  }
  // =================================================================PackageWise Operator=========================================================
  ProductTypeList(role: any, username: string,): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getProductTypeList?role=" + role + "&username=" + encodeURIComponent(username));
  }
  ProductList(role: any, username: string, producttype: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getProductListForOperatorByType?role=" + role + "&username=" + encodeURIComponent(username) + "&producttype=" + producttype);
  }
  ProductListForOperator(role: any, username: string, producttype: any, referenceid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/getOperatorProductListByTypeAndProductId?role=" + role + "&username=" + encodeURIComponent(username) + "&producttype=" + producttype + "&referenceid=" + referenceid, {});
  }
  ProductListForOperator_allocate_to_notallocate(role: any, username: string, producttype: any, referenceid: any, selectedoplist: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/AddingOperatorForProduct?role=" + role + "&username=" + encodeURIComponent(username) + "&producttype=" + producttype + "&referenceid=" + referenceid + "&selectedoplist=" + selectedoplist, {});
  }
  // =================================================================Package=========================================================
  // PackageList(role: any, username: string, type: number): Observable<any[]> {
  //   return this.http.get<any[]>(BASE_URL + "/package/getpackageList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type);
  // }
  PackageList(role: any, username: string,): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getpackageList?role=" + role + "&username=" + encodeURIComponent(username));
  }
  // ----------------------------report-------------------
  getPackageReport(role: any, username: any, packageid: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getPackageReport?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + packageid, { responseType: 'blob' });
  }
  Package_CloneList(role: any, username: string, packageid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getBasePackDetailsByPackageId?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + packageid);
  }
  Package_Update(p_name: any, p_desc: any, p_rate: any, o_id: any, role: any, u_name: any, commission: any, ispercentage: any, package_id: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/updatePackages?package_name=" + p_name + "&package_desc=" + p_desc + "&package_rate=" + p_rate + "&order_id=" + o_id + "&commission=" + commission + "&ispercentage=" + ispercentage + "&package_id=" + package_id + "&role=" + role + "&username=" + encodeURIComponent(u_name),
      {}
    );
  }
  CREATE_BASE_PACKAGE(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/createPackage", requestBody, {});
  }
  Base_PackageChannelList(role: any, username: string, type: number, package_id: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getChannelistbyPackageView?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + package_id + "&type=" + type);
  }
  getaddonlistpackage(role: any, username: string, type: number, package_id: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getaddonlistpackage?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + package_id + "&type=" + type);
  }
  managePackage(package_id: any, role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/managePackages?packageid=" + package_id + "&role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  AddingdAlacarteTo_Base_Package(modified: any, selectedchannellist: any = 0, role: any, u_name: any, package_id: any): Observable<any[]> {
    console.log(selectedchannellist);

    return this.http.post<any[]>(BASE_URL + "/package/AddingAlacarteToPackage?role=" + role + "&username=" + encodeURIComponent(u_name) + "&packageid=" + package_id + "&selectedchannellist=" + selectedchannellist + "&modified=" + modified,
      {}
    );
  }
  AddingdbouquetTo_Base_Package(modified: any, selectedbouquetlist: any, role: any, u_name: any, package_id: any, removedchannellist: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/AddingBouquetToPackage?role=" + role + "&username=" + encodeURIComponent(u_name) + "&packageid=" + package_id + "&selectedbouquetlist=" + selectedbouquetlist + "&modified=" + modified + "&removedchannellist=" + removedchannellist,
      {}
    );
  }
  AddingdAlacarteTo_Addon_Package(modified: any, selectedchannellist: any, role: any, u_name: any, package_id: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/AddingAlacarteToAddonpackage?role=" + role + "&username=" + encodeURIComponent(u_name) + "&packageid=" + package_id + "&selectedchannellist=" + selectedchannellist + "&modified=" + modified,
      {}
    );
  }
  AddingdbouquetTo_Addon_Package(modified: any, selectedbouquetlist: any, role: any, u_name: any, package_id: any, removedchannellist: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/AddingBouquetToAddonPackage?role=" + role + "&username=" + encodeURIComponent(u_name) + "&packageid=" + package_id + "&selectedbouquetlist=" + selectedbouquetlist + "&modified=" + modified + "&removedchannellist=" + removedchannellist,
      {}
    );
  }
  RcasPackageChannelList(role: any, username: string, type: number, package_id: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getverifyRcasChanlistPackage?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + package_id + "&type=" + type);
  }
  Clone_create(p_id: any, p_name: any, p_desc: any, p_rate: any, o_id: any, role: any, u_name: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/clonePackages?packageid=" + p_id + "&packagename=" + p_name + "&package_desc=" + p_desc + "&package_rate=" + p_rate + "&order_id=" + o_id + "&role=" + role + "&username=" + encodeURIComponent(u_name), {});
  }

  // ==========================================================================ADDON PACKAGE==================================================================

  AddonPackageList(role: any, username: string, type: number): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getaddonpackageList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type);
  }
  Addon_PackageChannelList(package_id: any, role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/getChannellistByAddonpackageView?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + package_id,);
  }
  UPDATE_ADDON_PACKAGE(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/updateAddonpack", requestBody, {});
  }
  ADDON_MANAGE_PACKAGE(package_id: any, role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/manageAddonpackage?id=" + package_id + "&role=" + role + "&username=" + encodeURIComponent(username),);
  }
  CREATE_ADDON_PACKAGE(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/createAddonpackage", requestBody, {});
  }
  // ========================================================================Product-Reference====================================================

  PackagemasterList(role: any, username: string, type: any, castype: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getpackagemasterList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&castype=" + castype);
  }
  getpackagemasterBaseList(role: any, username: string, type: any, castype: any): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/package/getpackagemasterBaseList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&castype=" + castype);
  }
  // ---------------------------------------REPORTS-----------------------------------------------
  getPackagePDFReport(role: any, u_name: any, type: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getChannelReport?&role=" + role + "&username=" + encodeURIComponent(u_name) + "&type=" + type, { responseType: 'blob' });
  }
  getPackageExcelReport(role: any, username: string, id: any, type: string): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/package/getpackagemasterBaseList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + id + "&castype=" + type, { observe: 'response' });
  }
  // ============================================================Package Master=========================================
  UpdatePackagemasterList(role: any, username: string, id: any, type: any): Observable<any[]> {
    console.log(role);
    return this.http.post<any[]>(BASE_URL + "/package/updatepackagemaster?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&type=" + type, {});
  }
  // poductActiveDeactive(role: any, username: string, id: any,type:any): Observable<any[]> {
  //   console.log(role);
  //   return this.http.post<any[]>(BASE_URL + "/package/updatepackagemaster?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id+"&type="+type,{});
  // }

  // ==============================Fingerprint=======================================
  Cas_type(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/cas/getcaslist?role=" + role + "&username=" + encodeURIComponent(username),
      {}
    );
  }
  Finger_area(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/area/getallactivearea?role=" + role + "&username=" + encodeURIComponent(username),

    );
  }
  Finger_print_List(role: any, username: string,): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/fingerprint/getfingerprint?role=" + role + "&username=" + encodeURIComponent(username));
  }
  Finger_datas(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/fingerprint/getfingerprint?role=" + role + "&username=" + encodeURIComponent(username),

    );
  }
  // ==========================================SUBSCRIBER====================================
  // -----------------------------------------------Subscriber Dashboard-------------------------------------------------
  getSearchDetailsSubscriber(role: any, username: any, searchname: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSearchDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&searchname=" + searchname,);
  }
  getQuickOperationDetailsBySearchname(role: any, username: any, searchname: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getQuickOperationDetailsBySearchname?role=" + role + "&username=" + encodeURIComponent(username) + "&searchname=" + searchname,);
  }
  getBoxidBySmartcard(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getBoxidBySmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard,);
  }
  getNotallocatedSmartcardListByCastypeAndOperatorid(role: any, username: any, operatorid: any, castype: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getNotallocatedSmartcardListByCastypeAndOperatorid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&castype=" + castype,);
  }
  getAllocationMsoSmartcardListByCastype(role: any, username: any, castype: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getAllocationMsoSmartcardListByCastype?role=" + role + "&username=" + encodeURIComponent(username) + "&castype=" + castype,);
  }
  getNotinOperatorList(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getNotinOperatorList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid,);
  }
  getAllBaselistbyOperatorIdCastypeType(role: any, username: any, operatorid: any, castype: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAllBaselistbyOperatorIdCastypeType?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&castype=" + castype + "&type=" + type,);
  }
  getAllBaselistByExceptPackId(role: any, username: any, operatorid: any, castype: any, type: any, packageid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAllBaselistByExceptPackId?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&castype=" + castype + "&type=" + type + "&packageid=" + packageid,);
  }
  updatelogindetails(role: any, username: any, subid: any, islock: any, password: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/updatelogindetails?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid + "&islock=" + islock + "&password=" + password, {});
  }
  addSmartcardToSubscriber(role: any, username: any, operatorid: any, castype: any, smartcard: any, boxid: any, subid: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/addSmartcardToSubscriber?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&castype=" + castype + "&smartcard=" + smartcard + "&boxid=" + boxid + "&subid=" + subid, {});
  }
  transferLcoToSmartcard(role: any, username: any, operatorid: any, areaid: any, streetid: any, subid: any, withsubscription: boolean, retailerid: any, type: any, andorid_id: any, device_id: any, ui_type: any, comments: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/transferLcoToSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&areaid=" + areaid + "&streetid=" + streetid + "&subid=" + subid + "&withsubscription=" + withsubscription + "&retailerid=" + retailerid + "&type=" + type + "&andorid_id=" + andorid_id + "&device_id=" + device_id + "&ui_type=" + ui_type + "&comments=" + comments, {});
  }
  // transferLcoToSmartcard(role: any, username: any, operatorid: any, areaid: any, streetid: any, subid: any, withsubscription: boolean, retailerid: any, type: any): Observable<any[]> {
  //   return this.http.post<any[]>(
  //     BASE_URL + "/subscriber/transferLcoToSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&areaid=" + areaid + "&streetid=" + streetid + "&subid=" + subid + "&withsubscription=" + withsubscription + "&retailerid=" + retailerid + "&type=" + type, {});
  // }
  getSubDetailsBySubId(role: any, username: any, subid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSubDetailsBySubId?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid);
  }
  getActivePackagePlanList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getActivePackagePlanList?role=" + role + "&username=" + encodeURIComponent(username));
  }
  getPlanTypeList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getPlanTypeList?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  getActiveCasList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getActiveCasList?role=" + role + "&username=" + encodeURIComponent(username));
  }
  getSmartcardListBySubId(role: any, username: any, subid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSmartcardListBySubId?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid);
  }
  getNewsubscriberDetails(role: any, username: any, subid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/GetNewsubscriberDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid);
  }
  getQuickOperationDetailsBySmartcard(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getQuickOperationDetailsBySmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard);
  }

  UpdateSubscriberDetails(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/UpdateSubscriberDetails", requestBody, {});
  }

  refreshSmartcard(role: any, username: any, smartcard: any, retailerid: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/RefreshSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type);
  }
  deactivationofSmartcard(role: any, username: any, smartcard: any, type: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/DeactivationofSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&type=" + type, {});
  }
  cancelSubscriptionOfSmartcardDetails(role: any, username: any, smartcard: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/CancelSubscriptionOfSmartcardDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard, {});
  }
  // cancelSmartcard(role: any, username: any, smartcard: any, type: any, retailerid: any): Observable<any[]> {
  //   return this.http.post<any[]>(
  //     BASE_URL + "/subscriber/CancelSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&type=" + type + "&retailerid=" + retailerid, {});
  // }
  cancelSmartcard(role: any, username: any, smartcard: any, type: any, retailerid: any, android_id: any, device_id: any, ui_type: any, comments: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/CancelSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&type=" + type + "&retailerid=" + retailerid + "&android_id=" + android_id + "&device_id=" + device_id + "&ui_type=" + ui_type + "&comments=" + comments, {});
  }
  pinchange(role: any, username: any, smartcard: any, pinnumber: any, type: any, retailerid: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/Pinchange?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&pinnumber=" + pinnumber + "&type=" + type + "&retailerid=" + retailerid, {});
  }
  pvrChange(role: any, username: any, smartcard: any, pvrstatus: boolean, type: any, retailerid: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/PVRChange?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&pvrstatus=" + pvrstatus + "&type=" + type + "&retailerid=" + retailerid, {});
  }
  reactivationofSmartcard(role: any, username: any, smartcard: any, retailerid: any, type: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/ReactivationofSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  deleteForceMessage(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/deleteForceMessage?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard, {});
  }
  boxIdChange(role: any, username: any, smartcard: any, boxid: any, retailerid: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/BoxIdChange?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&boxid=" + boxid + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  forceTuning(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/ForceTuning?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard, {});
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
      BASE_URL + "/subscriber/getFirstTimeActivationConfirmation?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + packageid + "&plantype=" + plantype + "&plan=" + plan + "&smartcard=" + smartcard + "&type=" + type + "&retailerid=" + retailerid);
  }
  smartcardSuspend(role: any, username: any, smartcard: any, retailerid: any, type: any, reason: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/SmartcardSuspend?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type + "&reason=" + reason, {});
  }
  smartcardResume(role: any, username: any, smartcard: any, retailerid: any, type: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/SmartcardResume?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  blockSmartcard(role: any, username: any, smartcard: any, type: any, reason: any,): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/BlockSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&type=" + type + "&reason=" + reason, {});
  }
  getSubscriberIdListByOperatorid(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSubscriberIdListByOperatorid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid, {});
  }
  // getPdfBillReport(role: any, username: any, subid: any, smartcard: any): Observable<Blob> {
  //   return this.http.get(BASE_URL + "/subscriber/getPdfBillReport?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid + "&smartcard=" + smartcard,{responseType: 'blob'});
  // }
  getPdfBillReport(role: any, username: any, subid: any, smartcard: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/subscriber/getPdfBillReport?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid + "&smartcard=" + smartcard, { responseType: 'blob' });
  }


  getPdfCasformReport(role: any, username: any, subid: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/subscriber/getPdfCasformReport?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid, { responseType: 'blob' });
  }

  getPdfSmartcardRechargeReport(role: any, username: any, smartcard: any): Observable<Blob> {
    return this.http.get(
      BASE_URL + "/subscriber/getPdfSmartcardRechargeReport?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard, { responseType: 'blob' });
  }

  getPdfSubscriberRechargeDetails(role: any, username: any, subid: any, input: any): Observable<Blob> {
    return this.http.get(
      BASE_URL + "/subscriber/getPdfSubscriberRechargeDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid + "&input=" + input, { responseType: 'blob' });
  }

  // lcotransferSinglesmartcard(role: any, username: any, operatorid: any, newsubid: any, withsubscription: any, smartcard: any, retailerid: any, type: any): Observable<any[]> {
  //   return this.http.post<any[]>(
  //     BASE_URL + "/subscriber/lcotransferSinglesmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&newsubid=" + newsubid + "&withsubscription=" + withsubscription + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type, {});
  // }
  lcotransferSinglesmartcard(role: any, username: any, operatorid: any, newsubid: any, withsubscription: any, smartcard: any, retailerid: any, type: any, andorid_id: any, device_id: any, ui_type: any, comments: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/lcotransferSinglesmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&newsubid=" + newsubid + "&withsubscription=" + withsubscription + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type + "&andorid_id=" + andorid_id + "&device_id=" + device_id + "&ui_type=" + ui_type + "&comments=" + comments, {});
  }
  // checkLoginCredenticals(role: any, username: any, userid: any, password: boolean, type: any): Observable<any[]> {
  //   return this.http.post<any[]>(
  //     BASE_URL + "/subscriber/checkLoginCredenticals?role=" + role + "&username=" + encodeURIComponent(username) + "&userid=" + userid + "&password=" + password + "&type=" + type, {});
  // }

  checkLoginCredenticals(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/checkLoginCredenticals", requestBody, { observe: "response" });
  }
  PairSmartcardOrBoxid(role: any, username: any, ischeck: any, smartcard: boolean, boxid: any, retailerid: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/PairSmartcardOrBoxid?role=" + role + "&username=" + encodeURIComponent(username) + "&ischeck=" + ischeck + "&smartcard=" + smartcard + "&boxid=" + boxid + "&retailerid=" + retailerid + "&type=" + type, {});
  }
  UnpairSmartcardOrBoxId(role: any, username: any, ischeck: any, smartcard: boolean, retailerid: any, type: any, andorid_id: any, device_id: any, ui_type: any, comments: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/subscriber/UnpairSmartcardOrBoxId?role=" + role + "&username=" + encodeURIComponent(username) + "&ischeck=" + ischeck + "&smartcard=" + smartcard + "&retailerid=" + retailerid + "&type=" + type + "&andorid_id=" + andorid_id + "&device_id=" + device_id + "&ui_type=" + ui_type + "&comments=" + comments, {});
  }
  getChannellistByPackageIdAndProductType(role: any, username: any, packageid: any, producttype: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getChannellistByPackageIdAndProductType?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + packageid + "&producttype=" + producttype);
  }
  getBaseChangeConfirmation(role: any, username: any, packageid: any, plantype: any, plan: any, smartcard: any, type: any, retailerid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getBaseChangeConfirmation?role=" + role + "&username=" + encodeURIComponent(username) + "&packageid=" + packageid + "&plantype=" + plantype + "&plan=" + plan + "&smartcard=" + smartcard + "&type=" + type + "&retailerid=" + retailerid);
  }
  getAddonpackageDetails(role: any, username: any, smartcard: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAddonpackageDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard, { observe: "response" });
  }
  getAlacarteDetails(role: any, username: any, smartcard: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAlacarteDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard, { observe: "response" });
  }
  removeProductDetails(role: any, username: any, smartcard: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/removeProductDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard, { observe: "response" });
  }

  baseChangeofSmartcardPackage(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/baseChangeofSmartcardPackage", requestBody, {});
  }
  addAddonForSmartcard(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/addAddonForSmartcard", requestBody, { observe: "response" });
  }
  addAddonConfirmation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/addAddonConfirmation", requestBody, {});
  }
  addAlacarteConfirmation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/addAlacarteConfirmation", requestBody, {});
  }
  addAlacarteForSmartcard(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/addAlacarteForSmartcard", requestBody, { observe: "response" });
  }
  removeProductConfirmation(requestBody: any): Observable<HttpResponse<any[]>> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/removeProductConfirmation", requestBody, { observe: "response" });
  }
  removeProductForSmartcard(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/removeProductForSmartcard", requestBody, {});
  }
  // -------------------------------------------------------------------------------------------------


  createSubscriber(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/createSubscriber", requestBody, {});
  }

  getsubscriberlist_subscriber(role: any, username: any, status: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSubscriberList?role=" + role + "&username=" + encodeURIComponent(username) + "&status=" + status,);
  }
  getOperatorListforSubInsert(role: any, username: any,): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getOperatorListforSubInsert?role=" + role + "&username=" + encodeURIComponent(username),);
  }
  getOperatorListOP_Dash(role: any, username: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/operator/getOperatorlist?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type,);
  }
  getAreaListByOperatorid(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAreaListByOperatorid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid);
  }
  getStreetListByAreaid(role: any, username: any, areaid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getStreetListByAreaid?role=" + role + "&username=" + encodeURIComponent(username) + "&areaid=" + areaid);
  }
  getIdProofList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getIdProofList?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  getAddresProofList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAddresProofList?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }

  getExpirySubscriberByOperator(role: any, username: any, operatorid: any, fromdate: any, todate: any, format: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getExpirySubscriberByOperator?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&fromdate=" + fromdate + "&todate=" + todate + "&format=" + format, { observe: 'response' }
    )
  }

  // -------------------------------------_Expiry getExpirySubscriberByOperator----------------------------------------------
  // =============================================LCO COMMISSION================================================
  getLcoGroupMasterList(role: any, username: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/GetLcoGroupMasterList?role=" + role + "&username=" + encodeURIComponent(username))
  }
  GetDistributorGroupDetails(role: any, username: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/GetDistributorGroupDetails?role=" + role + "&username=" + encodeURIComponent(username))
  }
  getLcoCommissionListByLcoGroupId(role: any, username: any, lcogroupid: any,): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getLcoCommissionListByLcoGroupId?role=" + role + "&username=" + encodeURIComponent(username) + "&lcogroupid=" + lcogroupid, { observe: "response" })
  }
  getDistributorCommissionListByLcoGroupId(role: any, username: any, lcogroupid: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getDistributorCommissionListByLcoGroupId?role=" + role + "&username=" + encodeURIComponent(username) + "&lcogroupid=" + lcogroupid, { observe: "response" })
  }
  // getDistributroProductMembershipList(role: any, username: any, producttype: any, lcogroupid: any): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(BASE_URL + "/lcocommission/getDistributroProductMembershipList?role=" + role + "&username=" + encodeURIComponent(username) + "&producttype=" + producttype + "&lcogroupid=" + lcogroupid, { observe: "response" })
  // }
  getDistributroProductMembershipList(role: any, username: any, producttype: any, lcogroupid: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getDistributroProductMembershipList?role=" + role + "&username=" + encodeURIComponent(username) + "&producttype=" + producttype + "&lcogroupid=" + lcogroupid, {})
  }
  updateDistributorCommission(role: any, username: any, id: any, msoamount: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/updateDistributorCommission?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&msoamount=" + msoamount, {})
  }

  // -------------------------------Update lco commission---------------------------
  updateLcoCommission(role: any, username: any, id: any, istax: boolean, ispercentage: boolean, commission: any, rate: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/updateLcoCommission?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&istax=" + istax + "&ispercentage=" + ispercentage + "&commission=" + commission + "&rate=" + rate, {})
  }
  // -----------------------------------------------ADD PRODUCT / COMMISSION MEMBERSHIP-----------------------------------------
  // getproductMembershipList(role: any, username: any, producttype: any, lcogroupid: any,): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(BASE_URL + "/lcocommission/getproductMembershipList?role=" + role + "&username=" + encodeURIComponent(username) + "&producttype=" + producttype + "&lcogroupid=" + lcogroupid, { observe: "response" })
  // }
  getproductMembershipList(role: any, username: any, producttype: any, lcogroupid: any,): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getproductMembershipList?role=" + role + "&username=" + encodeURIComponent(username) + "&producttype=" + producttype + "&lcogroupid=" + lcogroupid, {})
  }

  addProductMembership(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/addProductMembership", requestBody, {});
  }

  // ====================================LCO MEMBERSHIP==========================
  // -------------------pie chart-------------------------
  getMembershipcountForPiechart(role: any, username: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getMembershipcountForPiechart?role=" + role + "&username=" + encodeURIComponent(username))
  }
  // --------------------------------------------------------------------
  getLcoGroupDetails(role: any, username: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/GetLcoGroupDetails?role=" + role + "&username=" + encodeURIComponent(username))
  }
  getDistributorListNotInDistributor(role: any, username: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/GetDistributorListNotInDistributor?role=" + role + "&username=" + encodeURIComponent(username))
  }
  createLcoGroup(role: any, username: any, groupname: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/createLcoGroup?role=" + role + "&username=" + encodeURIComponent(username) + "&groupname=" + groupname, {})
  }
  createDistributorGroup(role: any, username: any, distributorgroupid: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/createDistributorGroup?role=" + role + "&username=" + encodeURIComponent(username) + "&distributorgroupid=" + distributorgroupid, {})
  }
  updateDistributor(role: any, username: any, distributorid: any, distributorlist: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/updateDistributor?role=" + role + "&username=" + encodeURIComponent(username) + "&distributorid=" + distributorid + "&distributorlist=" + distributorlist, {})
  }
  getLcoGroupMasterListNotInLcogroupId(role: any, username: any, lcogroupid: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/GetLcoGroupMasterListNotInLcogroupId?role=" + role + "&username=" + encodeURIComponent(username) + "&lcogroupid=" + lcogroupid)
  }
  getOperatorlistByGroupId(role: any, username: any, lcogroupid: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getOperatorlistByGroupId?role=" + role + "&username=" + encodeURIComponent(username) + "&lcogroupid=" + lcogroupid, { observe: 'response' })
  }
  // getOperatorlistByGroupId(role: any, username: any, lcogroupid: any):Observable<any> {
  //   return this.http.get<any[]>(BASE_URL + "/lcocommission/getOperatorlistByGroupId?role=" + role + "&username=" + encodeURIComponent(username) + "&lcogroupid=" + lcogroupid, {  })
  // }
  getAvailableAndNotAvailableDistributorList(role: any, username: any, distributorid: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getAvailableAndNotAvailableDistributorList?role=" + role + "&username=" + encodeURIComponent(username) + "&distributorid=" + distributorid)
  }
  addDistributorProductMembership(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/addDistributorProductMembership", requestBody, {});
  }
  getDistributorMembershipDetailsByLcogroupid(role: any, username: any, lcogroupid: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getDistributorMembershipDetailsByLcogroupid?role=" + role + "&username=" + encodeURIComponent(username) + "&lcogroupid=" + lcogroupid, { observe: 'response' })
  }

  getremoveDistributor(role: any, username: any, distributorid: any, isdistributor: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/removeDistributor?role=" + role + "&username=" + encodeURIComponent(username) + "&distributorid=" + distributorid + "&isdistributor=" + isdistributor, {})
  }

  // -------------------------------------------LCO MEMBERSHIP FUP----------------------------------
  getOperatorMembershipFUP(role: any, username: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/lcocommission/getOperatorMembershipFUP?role=" + role + "&username=" + encodeURIComponent(username), { observe: 'response' })
  }
  createlcomembershipFUP(role: any, username: any, operatorid: any, usedcount: any, sharecount: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/createlcomembershipFUP?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&usedcount=" + usedcount + "&sharecount=" + sharecount, {})
  }
  UpdatecomembershipFUP(role: any, username: any, id: any, sharecount: any, lcogroupid: any): Observable<any> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/updateLcoMembershipFUPDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&sharecount=" + sharecount + "&lcogroupid=" + lcogroupid, {})
  }
  updateLcoMembership(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/updateLcoMembership", requestBody, {});
  }
  updateDistributorMembership(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/lcocommission/updateDistributorMembership", requestBody, {});
  }
  // ==============================================Inventory=======================================================

  // -------------------------------------------------------GET----------------------------------
  Not_Allocated(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getNotAllocatedList?role=" + role + "&username=" + encodeURIComponent(username),
      {}
    );
  }
  Smart_Allocated(role: any, username: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getNotAllocationSmartDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id,
      {}
    );
  }

  // -------------------------------------report-------------------
  getNotAllocatedReport(role: any, username: any, reporttype: any): Observable<Blob> {
    return this.http.get(
      BASE_URL + "/report/getNotAllocatedReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  Allocated_smartcard_List(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getallocatedSmartcardList?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  getsearchforallocated_smartcard_List(role: any, username: any, operatorid: any, searchname: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/allocation/getsearchforallocatedSmartcardList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&searchname=" + searchname, {}
    );
  }
  getAllocatedSmartcardReport(role: any, username: any, operatorid: any, smartcard: any, reporttype: number): Observable<Blob> {
    return this.http.get(
      BASE_URL + "/report/getAllocatedSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&smartcard=" + smartcard + "&reporttype=" + reporttype, { responseType: 'blob' }
    );
  }

  getDeallocatedSmartcardReport(role: any, username: any, reporttype: number): Observable<Blob> {
    return this.http.get(
      BASE_URL + "/report/getDallocatedSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { responseType: 'blob' }
    );
  }

  getReallocatedSmartcardReport(role: any, username: any, reporttype: number): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getReallocatedSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { responseType: 'blob' });

  }



  getDeallocate_smartcard_List(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getDeallocatedsmartcardlist?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  getsmartcardReallocationlist(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getsmartcardReallocationlist?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  getsmartcardallocationSubscriberList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getsmartcardallocationSubscriberList?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  getOperatorWiseSubscriberList(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getOperatorWiseSubscriberList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid, {}
    );
  }
  getsubscriberlist_allocation(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getsubscriberlist?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid, {}
    );
  }
  getCastypeforUnPair(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getCastypeforUnPair?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }

  GetcasListforPacakge(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/GetcasListforPacakge?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  Defective_Smartcard_list(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/allocation/getAllSmartcardForSetDefectiveSmartcardlist?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  // -----------------------------------------------------------POST--------------------------------------------------------------

  UploadInventory(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/uploadInventoryfile", requestBody, {});
  }
  Update_smartcard_Allocated(role: any, username: any, id: any, smartcard: any, boxid: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/allocation/updateNotallocatedsmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&smartcard=" + smartcard + "&boxid=" + boxid,
      {}
    );
  }
  // UploadInventory(requestBody: any): Observable<any[]> {
  //   return this.http.post<any[]>(BASE_URL + "/allocation/uploadInventoryfile", requestBody, {});
  // }
  ALLOCATED_SMARTCARD_TO_LCO(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/allocateSmartcardToOperator", requestBody, {});
  }
  // ALLOCATED_SMARTCARD_TO_LCO(smartcardlist: any, role: any, username: any, isemi: boolean, totalamount: any, operatorid: any): Observable<any[]> {
  //   return this.http.post<any[]>(BASE_URL + "/allocation/allocateSmartcardToOperator?smartcardlist=" + smartcardlist + "&role=" + role + "&username=" + encodeURIComponent(username) + "&isemi=" + isemi + "&totalamount=" + totalamount + "&operatorid=" + operatorid, {});
  // }
  Create_Allocated(operatorid: any, castype: any, smartcard: any, boxid: any, role: any, username: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/createNewSmartcardAllocation?role=" + role + "&username=" + encodeURIComponent(username) + "&castype=" + castype + "&operatorid=" + operatorid + "&smartcard=" + smartcard + "&boxid=" + boxid, {});
  }
  Defective_remark_Allocated(id: any, remarks: any, role: any, username: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/setDefectiveSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&remarks=" + remarks, {});
  }
  Defective_Replace_Allocated(role: any, username: any, id: any, smartcard: any, boxid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/setReplaceSmartcardBoxid?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&smartcard=" + smartcard + "&boxid=" + boxid, {});
  }
  Defective_Insert_Allocated(role: any, username: any, subid: any, id: any, operatorid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/allocateSmartcardToSubscriber?role=" + role + "&username=" + encodeURIComponent(username) + "&subid=" + subid + "&id=" + id + "&operatorid=" + operatorid, {});
  }
  // ReAllocate_Smartcard(role: any, username: any, smartcardlist: any, operatorid: any): Observable<any[]> {
  //   return this.http.post<any[]>(BASE_URL + "/allocation/reallocateSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcardlist=" + smartcardlist + "&operatorid=" + operatorid, {});
  // }
  ReAllocate_Smartcard(role: any, username: any, smartcardlist: any, operatorid: any, totalamount: any, isemi: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/reallocateSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcardlist=" + smartcardlist + "&operatorid=" + operatorid + "&totalamount=" + totalamount + "&isemi=" + isemi, {});
  }
  DeAllocate_Smartcard(role: any, username: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/smartcardDeallocation?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {});
  }
  // -----------------------------------------------------___DELETE -------------------------------------------------------------
  delete_Smartcard_boxid(role: any, username: any, id: any) {
    return this.http.delete<any[]>(BASE_URL + "/allocation/deleteDeallocatedSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id);
  }
  // =======================================================CAS OPERATION=================================================
  // ----------------------------- Finger Print------------------------

  SendFingerPrint(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/fingerprint/sendFingerPrint", requestBody, {});
  }

  StopFingerPrint(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/fingerprint/stopFingerPrint", requestBody, {});
  }
  // -------------------------------------------MAIL---------------------------------
  GetMail(role: any, username: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/mail/getMail?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {}
    );
  }
  GetMail_List(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/mail/getMailList?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }

  CreateMail(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/mail/sendMail", requestBody, {});
  }
  resendMail(role: any, username: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/mail/resendMail?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {}
    );
  }
  // ----------------------------------------------_SCROLL----------------------------------
  CreateScroll(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/scroll/sendscroll", requestBody, {});
  }
  stopScroll(id: any, role: any, username: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/scroll/stopscrollmsg?id=" + id + "&role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  Get_Scroll_version(id: any, role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/scroll/getScrollversion?id=" + id + "&role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  Get_Scroll_version_List(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/scroll/getScrollversionList?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  // ---------------------------------MESSAGE-----------------------------------------------
  GetMessage(role: any, username: any, id: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/message/getMessage?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {}
    );
  }
  resendMessage(role: any, username: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/message/resendMessage?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {}
    );
  }
  stopMessage(role: any, username: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/message/stopMessage?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, {}
    );
  }
  GetMessageList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/message/getMessageList?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  CreateMessage(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/message/sendmessage", requestBody, {});
  }
  // --------------------------------------Force Tuning--------------------------------
  CreateForce(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/force/sendforce", requestBody, {});
  }
  getForceTuningList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/force/getForceTuningList?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  // -----------------------TOP Subscription Details------------------------------------------
  getAllSubscriptionDetails(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/package/getAllSubscriptionDetails?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }



  // =======================================================================Bulk operation===========================================================

  getPackageList(role: any, username: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getPackageListForFirstTimeActivation?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type, {}
    );
  }
  getBulkPackageList(role: any, username: any, castype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getPackageListBulkPackageUpdation?role=" + role + "&username=" + encodeURIComponent(username) + "&castype=" + castype, { observe: 'response' }
    );
  }
  getBulkPackageUpdationList(role: any, username: any,): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/package/getpackageListforbulk?role=" + role + "&username=" + encodeURIComponent(username),
    );
  }
  getAddonListforbulk(role: any, username: any,): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/package/getAddonListforbulk?role=" + role + "&username=" + encodeURIComponent(username),
    );
  }
  getAlacarteListforbulk(role: any, username: any,): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/package/getAlacarteListforbulk?role=" + role + "&username=" + encodeURIComponent(username),
    );
  }
  getBulkPackageServiceStatus(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getBulkPackageServiceStatus?role=" + role + "&username=" + encodeURIComponent(username), {}
    );
  }
  StartOrStopBulkPackageService(role: any, username: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getBulkPackageServiceStatus?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type, {}
    );
  }

  BulkReactivationByOperatorId(role: any, username: any, operatorid: any, retailerid: any, type: any, status: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/bulk/BulkReactivationByOperatorId?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&retailerid=" + retailerid + "&type=" + type + "&status=" + status, {}
    );
  }
  getBulkOperationRefreshList(role: any, username: any, remarks: any, optype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getBulkOperationRefreshList?role=" + role + "&username=" + encodeURIComponent(username) + "&remarks=" + remarks + "&optype=" + optype, { observe: 'response' }
    );
  }
  // getBulkRefreshList(role: any, username: any, remarks: any, optype: any): Observable<any[]> {
  getBulkRefreshList(role: any, username: any, remarks: any, optype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getBulkOperationRefreshList?role=" + role + "&username=" + encodeURIComponent(username) + "&remarks=" + remarks + "&optype=" + optype, { observe: 'response' }
    );
  }

  getSubscriptionDataExtendList(role: any, username: any, date: any, remarks: any, optype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getBulkOperationListByDate?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&remarks=" + remarks + "&optype=" + optype, { observe: 'response' }
    );
  }


  getBulkOperationListByDate(role: any, username: any, remarks: any, date: any, optype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getBulkOperationListByDate?role=" + role + "&username=" + encodeURIComponent(username) + "&remarks=" + remarks + "&date=" + date + "&optype=" + optype,
      { observe: 'response' }
    );
  }
  // getBulkrefreshListByDate(role: any, username: any, remarks: any, date: any, optype: any): Observable<any[]> {
  getBulkrefreshListByDate(role: any, username: any, remarks: any, date: any, optype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getBulkOperationListByDate?role=" + role + "&username=" + encodeURIComponent(username) + "&remarks=" + remarks + "&date=" + date + "&optype=" + optype,
      { observe: 'response' }
    );
  }
  // getDeactivationRefresh(role: any, username: any, remarks: any, optype: any): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(
  //     BASE_URL + "/bulk/getDeactivationRefresh?role=" + role + "&username=" + encodeURIComponent(username) + "&remarks=" + remarks + "&optype=" + optype, { observe: 'response' }
  //   );
  // }
  // getDeactivationFilterlist(role: any, username: any, remarks: any, date: any, optype: any): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(
  //     BASE_URL + "/bulk/getDeactivationRefresh?role=" + role + "&username=" + encodeURIComponent(username) + "&remarks=" + remarks + "&date=" + date + "&optype=" + optype, { observe: 'response' }
  //   );
  // }
  // getRecurringListByOperatorIdSearchnameAndIsrecurring(role: any, username: any, operatorid: any, searchname: any, type: any): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(
  //     BASE_URL + "/bulk/getRecurringListByOperatorIdSearchnameAndIsrecurring?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&searchname=" + searchname + "&type=" + type, { observe: 'response' }
  //   );
  // }
  getRecurringListByOperatorIdSearchnameAndIsrecurring(role: any, username: any, operatorid: any, searchname: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getRecurringListByOperatorIdSearchnameAndIsrecurring?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&searchname=" + searchname + "&type=" + type, {})
  }
  getExpirySubscriberDetailsByDatePackAndOperatorId(role: any, username: any, fromdate: any, todate: any, packageid: any, operatorid: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getExpirySubscriberDetailsByDatePackAndOperatorId?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&packageid=" + packageid + "&operatorid=" + operatorid, { observe: 'response' }
    );
  }
  getAddonlistByCasType(role: any, username: any, castype: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getAddonlistByCasType?role=" + role + "&username=" + encodeURIComponent(username) + "&castype=" + castype, {});
  }
  getAlacartelistByCasType(role: any, username: any, castype: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getAlacartelistByCasType?role=" + role + "&username=" + encodeURIComponent(username) + "&castype=" + castype, {});
  }
  getAllBulkPackageListByOperatoridAndStatus(role: any, username: any, operatorid: any, status: any, type: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getAllBulkPackageListByOperatoridAndStatus?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&status=" + status + "&type=" + type, { observe: 'response' });
  }
  getAllBulkPackageListBySearchnameAndStatus(role: any, username: any, searchname: any, status: any, type: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getAllBulkPackageListBySearchnameAndStatus?role=" + role + "&username=" + encodeURIComponent(username) + "&searchname=" + searchname + "&status=" + status + "&type=" + type, { observe: 'response' });
  }
  getAllBulkPackageListByFromdateTodateAndStatus(role: any, username: any, fromdate: any, todate: any, status: any, type: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getAllBulkPackageListByFromdateTodateAndStatus?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&status=" + status + "&type=" + type, { observe: 'response' });
  }

  uploadFileForSubscriptionExtend(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/uploadFileForSubscriptionExtend", requestBody, {});
  }
  bulkIsRecurring(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/BulkIsRecurring", requestBody, {});
  }
  uploadFileForBaseChange(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/uploadFileForBaseChange", requestBody, {});
  }
  uploadFileForAddonAndAlacarteActivation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/uploadFileForAddonAndAlacarteActivation", requestBody, {});
  }
  uploadFileforDeactivation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/uploadFileforDeactivation", requestBody, {});
  }
  bulkPackageUpdation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/bulkPackageUpdation", requestBody, {});
  }
  bulkPackageUpdaionConfirmation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/bulkPackageUpdaionConfirmation", requestBody, {});
  }
  uploadFirsttimeActivation(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/uploadFirsttimeActivation", requestBody, {});
  }
  bulkSubscriberInsert(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/bulkSubscriberInsert", requestBody, {});
  }

  // ------------------------------------------------SPECIAL ROLE BULK OPERATION------------------------
  getAreaChangeSubscriberList(role: any, username: any, operatorid: any,): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getAreaChangeSubscriberList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid, { observe: 'response' });
  }
  getLcochangeSubscriberList(role: any, username: any, operatorid: any, areaid: any, streetid: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/bulk/getLcochangeSubscriberList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&areaid=" + areaid + "&streetid=" + streetid, { observe: 'response' });
  }

  updateLcoChangeSubscriber(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/updateLcoChangeSubscriber", requestBody, {});
  }
  updateAreaChangeSubscriber(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/updateAreaChangeSubscriber", requestBody, {});
  }
  uploadFileForBulkLcoTransfer(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/uploadFileForBulkLcoTransfer", requestBody, {});
  }
  uploadFileForSubscriptionCancel(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/bulk/uploadFileForSubscriptionCancel", requestBody, {});
  }
  // ====================================================Local Channel===============================
  getAllLocalChannelList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getAllLocalChannelList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  getLocalChannelList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getLocalChannelList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  getLocalChannelOperatorList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getLocalChannelOperatorList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  getLocalCreationAmountDetails(role: any, username: any, channelrate: any, istax: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getLocalCreationAmountDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&channelrate=" + channelrate + "&istax=" + istax, {});
  }
  createLocalChannel(role: any, username: any, channelid: any, operatorid: any, tax: any, lcoprice: any, lcn: any, channelrate: any, istax: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/localchannel/createLocalChannel?role=" + role + "&username=" + encodeURIComponent(username) + "&channelid=" + channelid + "&operatorid=" + operatorid + "&tax=" + tax + "&lcoprice=" + lcoprice + "&lcn=" + lcn + "&channelrate=" + channelrate + "&istax=" + istax, {});
  }
  updateLocalChannel(role: any, username: any, channelid: any, operatorid: any, tax: any, lcoprice: any, lcn: any, channelrate: any, istax: any, id: any, isactive: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/localchannel/updateLocalChannel?role=" + role + "&username=" + encodeURIComponent(username) + "&channelid=" + channelid + "&operatorid=" + operatorid + "&tax=" + tax + "&lcoprice=" + lcoprice + "&lcn=" + lcn + "&channelrate=" + channelrate + "&istax=" + istax + "&id=" + id + "&isactive=" + isactive, {});
  }
  getLocalChannelPayConfirmation(role: any, username: any, serviceid: any, paidamount: any, iscredit: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getLocalChannelPayConfirmation?role=" + role + "&username=" + encodeURIComponent(username) + "&serviceid=" + serviceid + "&paidamount=" + paidamount + "&iscredit=" + iscredit, {});
  }
  getAllLocalChannelBroadcasterList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/localchannel/getAllLocalChannelBroadcasterList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  payLocalChannel(role: any, username: any, serviceid: any, paidamount: any, iscredit: any, days: any, expirydate: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/localchannel/payLocalChannel?role=" + role + "&username=" + encodeURIComponent(username) + "&serviceid=" + serviceid + "&paidamount=" + paidamount + "&iscredit=" + iscredit + "&days=" + days + "&expirydate=" + expirydate, {});
  }
  createLocalChannelLTB(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/localchannel/createLocalChannelLTB", requestBody, {});
  }
  // ===============================================================Special Role==========================================================
  // ------------------------------------------------------------mso details-----------------------------------------
  getMsoDetails(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/mso/getMsoDetails?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  updateMso(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/mso/updateMso", requestBody, {});
  }
  uploadLogo(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/mso/uploadMsoLogo", requestBody, {});
  }
  // ------------------------------------------------------------CAS details-----------------------------------------
  // casmaster(role: any, username: any): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(
  //     BASE_URL + "/cas/getcaslist?role=" + role + "&username=" + encodeURIComponent(username), { observe: 'response' });
  // }
  casmaster(role: any, username: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/cas/getAllCasList?role=" + role + "&username=" + encodeURIComponent(username), { observe: 'response' });
  }

  // ------------------------------------------------------------operator invoice-----------------------------------------
  getAllOperatorInvoiceBillByMonthYear(role: any, username: any, month: any, Year: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/operator/getAllOperatorInvoiceBillByMonthYear?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + Year, { observe: 'response' });
  }
  getAllOperatorInvoiceBillMonthYear(role: any, username: any, month: any, Year: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/operator/getAllOperatorInvoiceBillByMonthYear?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + Year, {});
  }
  // ------------------------------------------------------------bill generation-----------------------------------------
  generateOperatorInvoiceBill(role: any, username: any, month: any, Year: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/operator/generateOperatorInvoiceBill?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + Year, {});
  }
  activeORDeactiveCas(role: any, username: any, id: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/cas/activeORDeactiveCas?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&type=" + type, {});
  }

  createCas(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/cas/createCas", requestBody, {});
  }

  updateCas(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/cas/updateCas", requestBody, {});
  }
  // --------------------------------------------SUBLCO OPERATOR-------------------------------------------------
  getAllSublcoListByOperatorId(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/sublco/getAllSublcoListByOperatorId?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid, {});
  }
  getAllSublcoList(role: any, username: any, operatorid: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/sublco/getAllSublcoListByOperatorId?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid, { observe: 'response' });
  }
  sublcoCreate(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/sublco/sublcoCreate", requestBody, {});
  }
  sublcoUpdate(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/sublco/sublcoUpdate", requestBody, {});
  }
  getAllAreaList(role: any, username: any, retailerid: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/sublco/getallAreaList?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid + "&operatorid=" + operatorid, {});
  }
  sublcoUpdateArea(role: any, username: any, retailerid: any, arealist: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/sublco/sublcoUpdateArea?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid + "&arealist=" + arealist, {});
  }
  getallPermissionList(role: any, username: any, retailerid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/sublco/getallPermissionList?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid, {});
  }

  sublcoUpdatePermission(role: any, username: any, retailerid: any, permissionlist: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/sublco/sublcoUpdatePermission?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid + "&permissionlist=" + permissionlist, {});
  }
  // --------------------------------------------------paymentgatewaylist--------------------------------------

  getPaymentGateWayList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/sublco/getPaymentGateWayList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  sublcoUpdatePaymentGateway(role: any, username: any, retailerid: any, paymentid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/sublco/sublcoUpdatePaymentGateway?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid + "&paymentid=" + paymentid, {});
  }
  sublcoDelete(role: any, username: any, id: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/sublco/sublcoDelete?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&type=" + type, {});
  }

  getsublcoDatewiseReport(role: any, username: any, retailerid: any, operatorid: any, fromdate: any, todate: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/sublco/getsublcoDatewiseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid + '&operatorid=' + operatorid + "&fromdate=" + fromdate + "&todate=" + todate, { observe: 'response' })
  }
  getsublcoMonthwiseReport(role: any, username: any, retailerid: any, operatorid: any, month: any, year: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/sublco/getsublcoMonthwiseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid + '&operatorid=' + operatorid + "&month=" + month + "&year=" + year, { observe: 'response' })
  }
  // getsublcoMonthwisePdfReport(role: any, username: any, retailerid: any, operatorid: any, month: any, year: any, p0: { responseType: string; }): Observable<any[]> {
  //   return this.http.get<any[]>(BASE_URL + "/sublco/getsublcoMonthwisePdfReport?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid + '&operatorid=' + operatorid + "&month=" + month + "&year=" + year, { })
  // }

  getsublcoMonthwisePdfReport(role: any, username: any, retailerid: any, operatorid: any, month: any, year: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/sublco/getsublcoMonthwisePdfReport?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid + '&operatorid=' + operatorid + "&month=" + month + "&year=" + year, { responseType: 'blob' });
  }
  // ---------------------------------------------packaheplan---------------------------------------------------
  getAllPackagePlanList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/master/getAllPackagePlanList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  createPackagePlan(role: any, username: any, months: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/createPackagePlan?role=" + role + "&username=" + encodeURIComponent(username) + "&months=" + months, {});
  }
  updatePackagePlan(role: any, username: any, days: any, isactive: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/updatePackagePlan?role=" + role + "&username=" + encodeURIComponent(username) + "&days=" + days + "&isactive=" + isactive + "&id=" + id, {});
  }
  activeORDeactivePackagePlan(role: any, username: any, id: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/activeORDeactivePackagePlan?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&type=" + type, {});
  }
  // ---------------------------------------------Local Channel----------------------------------------------------------
  getspecialLocalChannelList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/master/getLocalChannelList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  specialCreateLocalChannel(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/createLocalChannel", requestBody, {});
  }
  specialeditLocalChannel(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateLocalChannel", requestBody, {});
  }
  // ---------------------------------------ADS Channel ------------------------------
  getAllAdMasterList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/master/getAllAdMasterList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  createAdMaster(role: any, username: any, adname: any, adurl: any, siteurl: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/createAdMaster?role=" + role + "&username=" + encodeURIComponent(username) + "&adname=" + adname + "&adurl=" + adurl + "&siteurl=" + siteurl, {});
  }
  updateAdmaster(role: any, username: any, adname: any, adurl: any, siteurl: any, isactive: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/updateAdmaster?role=" + role + "&username=" + encodeURIComponent(username) + "&adname=" + adname + "&adurl=" + adurl + "&siteurl=" + siteurl + "&isactive=" + isactive + "&id=" + id, {});
  }
  // -------------------------------------------Login settings-----------------------------------------
  getAllLoginList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/master/getAllLoginList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  getAllRoles(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/master/getAllRoles?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  addNewUser(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/addNewUser", requestBody, {});
  }
  updateUser(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateUser", requestBody, {});
  }
  // ------------------------------------------proofdetails----------------------------------
  getAllIdProofList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/master/getAllIdProofList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  getAllAddressProofList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/master/getAllAddressProofList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  createIdProof(role: any, username: any, idproofname: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/createIdProof?role=" + role + "&username=" + encodeURIComponent(username) + "&idproofname=" + idproofname, {});
  }
  createAddressProof(role: any, username: any, addressproofname: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/createAddressProof?role=" + role + "&username=" + encodeURIComponent(username) + "&addressproofname=" + addressproofname, {});
  }
  updateIdProof(role: any, username: any, idproofname: any, isdelete: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/updateIdProof?role=" + role + "&username=" + encodeURIComponent(username) + "&idproofname=" + idproofname + "&isdelete=" + isdelete + "&id=" + id, {});
  }
  updateAddressProof(role: any, username: any, addressproofname: any, isdelete: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/updateAddressProof?role=" + role + "&username=" + encodeURIComponent(username) + "&addressproofname=" + addressproofname + "&isdelete=" + isdelete + "&id=" + id, {});
  }
  activeORDeactiveIdProof(role: any, username: any, id: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/activeORDeactiveIdProof?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&type=" + type, {});
  }
  activeORDeactiveAddressProof(role: any, username: any, id: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/activeORDeactiveAddressProof?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&type=" + type, {});
  }

  // ---------------------------------------------------TAX--------------------------------------
  getAllTaxList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/master/getAllTaxList?role=" + role + "&username=" + encodeURIComponent(username), {});
  }
  createTax(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/createTax", requestBody, {});
  }
  updateTax(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateTax", requestBody, {});
  }
  activeORDeactiveTax(role: any, username: any, id: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(
      BASE_URL + "/master/activeORDeactiveTax?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&type=" + type, {});
  }
  // ---------------------------------------------------Reports-----------------------------------------------------------------------------
  // ========================================Dashboard Reports=================================================================
  getDashboardReport(role: any, username: any, type: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/report/GetDashboardReportPdf?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getDashboardPDFReport(role: any, username: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetDashboardReportPdf?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // =======================================Operator Dashboard Reports=========================================================

  getOperatorDashboardExcelReport(role: any, username: any, type: any, reporttype: any, operatorid: any, yearmonth: any, fromdate: any, todate: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(
      BASE_URL + "/report/GetOperatorDashboardPdfReport?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&reporttype=" + reporttype + "&operatorid=" + operatorid + '&yearmonth=' + yearmonth + '&fromdate=' + fromdate + '&todate=' + todate, { observe: 'response' });
  }
  getOperatorDashboardPDFReport(role: any, username: any, type: any, reporttype: any, operatorid: any, yearmonth: any, fromdate: any, todate: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetOperatorDashboardPdfReport?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&reporttype=" + reporttype + "&operatorid=" + operatorid + '&yearmonth=' + yearmonth + '&fromdate=' + fromdate + '&todate=' + todate, { responseType: 'blob' });
  }






  // ==================================================Trai Reports================================================================================
  // -------------------------------------------------Package Based & Addon Package Reports------------------------------------------------------------
  getPackageModificationExcelReport(role: any, username: any, fromdate: any, todate: any, castype: any, type: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getPackageModificationPdfReport?role=" + role + "&username=" + encodeURIComponent(username) + '&fromdate=' + fromdate + '&todate=' + todate + "&castype=" + castype + "&type=" + type + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getPackageModificationPdfReport(role: any, username: any, fromdate: any, todate: any, castype: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getPackageModificationPdfReport?role=" + role + "&username=" + encodeURIComponent(username) + '&fromdate=' + fromdate + '&todate=' + todate + "&castype=" + castype + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -------------------------------------------------Channel History Reports------------------------------------------------------------
  getChannelModificationExcelReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getChannelModificationPdfReport?role=" + role + "&username=" + encodeURIComponent(username) + '&fromdate=' + fromdate + '&todate=' + todate + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getChannelModificationPdfReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getChannelModificationPdfReport?role=" + role + "&username=" + encodeURIComponent(username) + '&fromdate=' + fromdate + '&todate=' + todate + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -------------------------------------------------Combo History Reports------------------------------------------------------------
  getComboModificationExcelReport(role: any, username: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getComboModificationPdfReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getComboModificationPdfReport(role: any, username: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getComboModificationPdfReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ------------------------------------------------------SUBSCRIPTION BASED REPORTS-----------------------------------------------------------------------------------
  getBouquetSubscriptionExcelReport(role: any, username: any, fromdate: any, todate: any, producttype: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getProductwiseHistoricalPackAddonAndAlacarteReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&producttype=" + producttype + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getBouquetSubscriptionPdfReport(role: any, username: any, fromdate: any, todate: any, producttype: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getProductwiseHistoricalPackAddonAndAlacarteReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&producttype=" + producttype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  // --------------------------Weekly-------------------
  getWeeklyActiveOrDeactiveSubscriptionExcelReport(role: any, username: any, month: any, year: any, datetype: any, type: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getWeeklyActiveOrDeactiveSubscriptionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&type=" + type + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getWeeklyActiveOrDeactiveSubscriptionPDFReport(role: any, username: any, month: any, year: any, datetype: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getWeeklyActiveOrDeactiveSubscriptionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  // ----------------------------------Base package -------------------------------

  getasOnDateBaseActiveOrDeactiveExcelReport(role: any, username: any, operatorid: any, date: any, type: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/asOnDateBaseActiveOrDeactiveSubscriptionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&date=" + date + "&type=" + type + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getasOnDateBaseActiveOrDeactivePDFReport(role: any, username: any, operatorid: any, date: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/asOnDateBaseActiveOrDeactiveSubscriptionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&date=" + date + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // --------------------------------------Addon Package-----------------------------
  getasOnDateAddonActiveOrDeactiveExcelReport(role: any, username: any, operatorid: any, date: any, type: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/asOnDateAddonActiveOrDeactiveSubscriptionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&date=" + date + "&type=" + type + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getasOnDateAddonActiveOrDeactivePDFReport(role: any, username: any, operatorid: any, date: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/asOnDateAddonActiveOrDeactiveSubscriptionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&date=" + date + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ------------------------------------------------------Alacarte---------------------------------
  getasOnDateAlacarteActiveOrDeactiveSubscriptionExcelReport(role: any, username: any, date: any, type: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/asOnDateAlacarteActiveOrDeactiveSubscriptionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&type=" + type + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getasOnDateAlacarteActiveOrDeactiveSubscriptionPDFReport(role: any, username: any, date: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/asOnDateAlacarteActiveOrDeactiveSubscriptionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ----------------------------------------All product-----------------------------------------
  getasOnDateAllProductActiveOrDeactiveSubscriptionReport(role: any, username: any, operatorid: any, date: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/asOnDateAllProductActiveOrDeactiveSubscriptionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&date=" + date + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // --------------------------------------------------History REPORTS========================
  // ------------------------------------------------All Service Report------------------------------------------------
  getAllServiceHistoryExcelReport(role: any, username: any, fromdate: any, todate: any, smartcard: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetAllServiceHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&smartcard=" + smartcard + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getAllServiceHistoryPDFReport(role: any, username: any, fromdate: any, todate: any, smartcard: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetAllServiceHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&smartcard=" + smartcard + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  // ------------------------------------------------------Total Smartcard------------------------

  getTotalSmartcardExcelReport(role: any, username: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetTotalSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getTotalSmartcardPDFReport(role: any, username: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetTotalSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -------------------------------------------------------paired Smartcard---------------------------------

  getPairedSmartcardExcelReport(role: any, username: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetPairedSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getPairedSmartcardPDFReport(role: any, username: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetPairedSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -------------------------------------------------Blocked Smartcard---------------------------
  getBlockSmartcardExcelReport(role: any, username: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetBlockSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getBlockSmartcardPDFReport(role: any, username: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetBlockSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ======================================CAS OPERATION================
  // -----------------------------------------------scroll------------------------------------------
  getScrollHistoryExcelReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetScrollHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getScrollHistoryPDFReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetScrollHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -------------------------------------------------Mail History---------------------------------------------------
  getMailHistoryExcelReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetMailHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getMaillHistoryPDFReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetMailHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ------------------------------------------------------Finger print-----------------------
  getFingerprintHistoryExcelReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetFingerPrintHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getFingerprintPDFReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetFingerPrintHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -----------------------------------------------Message--------------------------------------------
  getMessageExcelReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetMessageHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getMessageHistoryPDFReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetMessageHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -----------------------------------------------------Count Report-------------------------------------

  getNetworkSmartcardCountReport(role: any, username: any, date: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetNetworkSmartcardCountReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getNetworkSmartcardCountPDFReport(role: any, username: any, date: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetNetworkSmartcardCountReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -----------------------------------------------------Status Count Report-------------------------------------

  getNetworkSmartcardStatusCountReport(role: any, username: any, date: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetNetworkSmartcardStatusCountReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getNetworkSmartcardCountStatusPDFReport(role: any, username: any, date: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetNetworkSmartcardStatusCountReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -----------------------------------------------------OERATOR WISE Count Report-------------------------------------
  getNetworkSmartcardOperatorwiseReport(role: any, username: any, date: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetNetworkSmartcardCountOperatorwiseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getNetworkSmartcardOperatorwisePDFReport(role: any, username: any, date: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetNetworkSmartcardCountOperatorwiseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -----------------------------------------------------ason date suspend report-------------------------------------
  getAsonDateSuspendReport(role: any, username: any, date: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetAsonDateSuspendReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getAsonDateSuspendPDFReport(role: any, username: any, date: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetAsonDateSuspendReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -----------------------------------------------------suspend report particular period-------------------------------------
  getSuspendReportByDurationExcelReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetSuspendReportByDuration?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getSuspendReportByDurationPDFReport(role: any, username: any, fromdate: any, todate: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetSuspendReportByDuration?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ------------------------------------------------------suspend history report-----------------------------------------------
  getSuspendHistoryExcelReport(role: any, username: any, fromdate: any, todate: any, smartcard: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetSuspendHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&smartcard=" + smartcard + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getSuspendHistoryPDFReport(role: any, username: any, fromdate: any, todate: any, smartcard: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetSuspendHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&smartcard=" + smartcard + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ============================================================Broadcaster report==============================
  // -----------------------------------------Monthly broadcaster reception--------------------------------------
  // getBroadcasterReport(role: any, username: any, month: any, year: any, datetype: any, broadcasterid: any, type: any, reporttype: any): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(BASE_URL + "/report/getBroadcasterReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&broadcasterid=" + broadcasterid + "&type=" + type + "&reporttype=" + reporttype, { observe: 'response' });
  // }
  getBroadcasterReport(role: any, username: any, month: any, year: any, datetype: any, broadcasterid: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getBroadcasterReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&broadcasterid=" + broadcasterid + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  getBroadcasterPDFReport(role: any, username: any, month: any, year: any, datetype: any, broadcasterid: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getBroadcasterReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&broadcasterid=" + broadcasterid + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  getBroadcasterVisible(role: any, username: any, month: any, year: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/report/getIsvisible?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year, {});
  }
  // -----------------------------------------Over all product report--------------------------------------
  getOverallBaseReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getOverallBaseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { observe: 'response' });
  }
  // ------------------------------------------------Universal Report-------------------------------------
  // getUniversalExcelReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(BASE_URL + "/report/getOverallUniversalReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { observe: 'response' });
  // }
  getUniversalExcelReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getOverallUniversalReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  getUniversalPDFReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getOverallUniversalReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ----------------------------------------Over All Report---------------------------------------
  getOverAllReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getOverallReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getOverAllExcelReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getOverallBaseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  getOverAllBroadcasterPDFReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getOverallBaseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  getOverAllPDFReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getOverallReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -----------------------------------------------------Over all base report -------------------------------------
  getOverBaseExcelReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getOverallBaseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getOverAllBasePDFReport(role: any, username: any, month: any, year: any, datetype: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getOverallBaseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  // -----------------------------------------MonthlyCASWISE broadcaster reception--------------------------------------
  // getMonthlyBroadcasterCaswiseReport(role: any, username: any, month: any, year: any, datetype: any, castype: any, broadcasterid: any, type: any, reporttype: any): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(BASE_URL + "/report/getBroadcastercaswiseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&broadcasterid=" + broadcasterid + "&type=" + type + "&castype=" + castype + "&reporttype=" + reporttype, { observe: 'response' });
  // }
  getMonthlyBroadcasterCaswiseExcelReport(role: any, username: any, month: any, year: any, datetype: any, broadcasterid: any, type: any, castype: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getBroadcasterReportCaswise?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&broadcasterid=" + broadcasterid + "&type=" + type + "&castype=" + castype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  getMonthlyBroadcasterCaswisePDFReport(role: any, username: any, month: any, year: any, datetype: any, broadcasterid: any, type: any, castype: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getBroadcasterReportCaswise?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&broadcasterid=" + broadcasterid + "&type=" + type + "&castype=" + castype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  // ---------------------------------------------------Synchronizatio Reports-----------------------------
  getSynchronizationExcelReport(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/report/uploadFileForSynchronizationReport", requestBody,);
  }
  getSynchronizationPDFReport(requestBody: any): Observable<Blob> {
    return this.http.post(BASE_URL + "/report/uploadFileForSynchronizationReport", requestBody, { responseType: 'blob' });
  }

  // ====================================================LCO RECHARGE [OPERATOR]===============================================
  // -----------------------------------------------getRechargeLogReport-----------------------------
  getRechargeLogPDFReport(role: any, username: any, fromdate: any, todate: any, operatorid: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getRechargeLogReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid, { responseType: 'blob' });
  }
  getRechargeLogFilterWiseReport(role: any, username: any, date: any, month: any, year: any, type: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getRechargeLogFilterWiseReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&month=" + month + "&year=" + year + "&type=" + type, { responseType: 'blob' });
  }
  getPrintBillReport(role: any, username: any, id: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getPrintBillReport?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, { responseType: 'blob' });
  }
  getBillCollectionSmartcardReport(role: any, username: any, operatorid: any, smartcard: any, fromdate: any, todate: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getBillCollectionSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&smartcard=" + smartcard + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  getBillCollectionSmartcardReportList(role: any, username: any, operatorid: any, smartcard: any, fromdate: any, todate: any, reporttype: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/report/getBillCollectionSmartcardReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&smartcard=" + smartcard + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype,);
  }

  // =============================================================MSO REPORTS+=================================

  getMonthwisePaymentCollection(role: any, username: any, month: any, year: any, reportgentype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getMonthwisePaymentCollection?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&reportgentype=" + reportgentype, { responseType: 'blob' });
  }
  getMonthwisePaymentCollectionData(role: any, username: any, month: any, year: any, reportgentype: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/report/getMonthwisePaymentCollection?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&reportgentype=" + reportgentype,);
  }

  // -----------------------------------------------ExcludingReport-------------------------------------------------------
  getExcluding(role: any, username: any, fromdate: any, todate: any, month: any, year: any, datetype: any, type: any, reporttype: any, operatorid: any, reportgentype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getExcludingReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&type=" + type + "&reporttype=" + reporttype + "&operatorid=" + operatorid + "&reportgentype=" + reportgentype, { observe: 'response' });
  }
  getExcludingReport(role: any, username: any, fromdate: any, todate: any, month: any, year: any, datetype: any, type: any, reporttype: any, operatorid: any, reportgentype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getExcludingReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&type=" + type + "&reporttype=" + reporttype + "&operatorid=" + operatorid + "&reportgentype=" + reportgentype, { responseType: 'blob' });
  }
  // -----------------------------------------------IncludingReport-------------------------------------------------------
  getIncluding(role: any, username: any, fromdate: any, todate: any, month: any, year: any, datetype: any, type: any, reporttype: any, operatorid: any, reportgentype: any): Observable<HttpResponse<any[]>> {
    console.log(reporttype);

    return this.http.get<any>(BASE_URL + "/report/getIncludingReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&type=" + type + "&reporttype=" + reporttype + "&operatorid=" + operatorid + "&reportgentype=" + reportgentype, { observe: 'response' });
  }
  getIncludingReport(role: any, username: any, fromdate: any, todate: any, month: any, year: any, datetype: any, type: any, reporttype: any, operatorid: any, reportgentype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getIncludingReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&month=" + month + "&year=" + year + "&datetype=" + datetype + "&type=" + type + "&reporttype=" + reporttype + "&operatorid=" + operatorid + "&reportgentype=" + reportgentype, { responseType: 'blob' });
  }
  // -----------------------------------------------MSO -LCO WISE -------------------------------------------------------
  getLcowiseActiveSubCount(role: any, username: any, operatorid: any, model: any, reporttype: any, batch: any, castype: any,): Observable<HttpResponse<any[]>> {
    return this.http.get<any>(BASE_URL + "/report/lcowiseactivesubscription?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&model=" + model + "&reporttype=" + reporttype + "&batch=" + batch + "&castype=" + castype, { observe: 'response' });
  }
  getLcowiseActiveSubCountReport(role: any, username: any, operatorid: any, model: any, reporttype: any, batch: any, castype: any,): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/lcowiseactivesubscription?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&model=" + model + "&reporttype=" + reporttype + "&batch=" + batch + "&castype=" + castype, { responseType: 'blob' });
  }


  getLcowiseExpirySubCount(role: any, username: any, month: any, year: any, todate: any, reporttype: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any>(BASE_URL + "/report/lcowiseactiveexpirycount?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&todate=" + todate + "&reporttype=" + reporttype, { observe: 'response' });
  }
  getLcowiseExpirySubCountReport(role: any, username: any, month: any, year: any, todate: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/lcowiseactiveexpirycount?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&todate=" + todate + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -------------------------------------------------------Rechargr History report-------------------------------

  getRechargeHistoryReport(role: any, username: any, type: any, operatorid: any, fromdate: any, todate: any, smartcard: any, useragent: any, sublcoid: any, reporttype: any, subid: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetRechargeHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&operatorid=" + operatorid + "&fromdate=" + fromdate + "&todate=" + todate + "&smartcard=" + smartcard + "&useragent=" + useragent + "&sublcoid=" + sublcoid + "&reporttype=" + reporttype + "&subid=" + subid, { responseType: 'blob' });
  }

  getRechargeHistory(role: any, username: any, type: any, operatorid: any, fromdate: any, todate: any, smartcard: any, useragent: any, sublcoid: any, reporttype: any, subid: any): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetRechargeHistoryReport?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&operatorid=" + operatorid + "&fromdate=" + fromdate + "&todate=" + todate + "&smartcard=" + smartcard + "&useragent=" + useragent + "&sublcoid=" + sublcoid + "&reporttype=" + reporttype + "&subid=" + subid, { observe: 'response' });
  }

  // ---------------------------------------------------------OnlinePaymentHistory--------------------------------------------


  // getOnlinePaymentHistoryReport(role: any, username: any, fromdate: any, todate: any, operatorid: any, sublcoid: any, smartcard: any, type: any, reporttype: any,): Observable<Blob> {
  //   return this.http.get(BASE_URL + "/report/GetOnlinePaymentHistory?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid + "&sublcoid=" + sublcoid + "&smartcard=" + smartcard + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  // }
  getOnlinePaymentHistoryReport(role: any, username: any, fromdate: any, todate: any, operatorid: any, sublcoid: any, smartcard: any, type: any, reporttype: any, isSpecial: any, subid: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetOnlinePaymentHistory?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid + "&sublcoid=" + sublcoid + "&smartcard=" + smartcard + "&type=" + type + "&reporttype=" + reporttype + "&isspecial=" + isSpecial + "&subid=" + subid, { responseType: 'blob' });
  }
  // getOnlinePaymentHistory(role: any, username: any, fromdate: any, todate: any, operatorid: any, sublcoid: any, smartcard: any, type: any, reporttype: any,): Observable<HttpResponse<any[]>> {
  //   return this.http.get<any[]>(BASE_URL + "/report/GetOnlinePaymentHistory?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid + "&sublcoid=" + sublcoid + "&smartcard=" + smartcard + "&type=" + type + "&reporttype=" + reporttype, { observe: 'response' });
  // }
  // getOnlinePaymentHistory(role: any, username: any, fromdate: any, todate: any, operatorid: any, sublcoid: any, smartcard: any, type: any, reporttype: any,): Observable<any[]> {
  //   return this.http.get<any[]>(BASE_URL + "/report/GetOnlinePaymentHistory?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid + "&sublcoid=" + sublcoid + "&smartcard=" + smartcard + "&type=" + type + "&reporttype=" + reporttype,);
  // }
  getOnlinePaymentHistory(role: any, username: any, fromdate: any, todate: any, operatorid: any, sublcoid: any, smartcard: any, type: any, reporttype: any, isSpecial: any, subid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/report/GetOnlinePaymentHistory?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid + "&sublcoid=" + sublcoid + "&smartcard=" + smartcard + "&type=" + type + "&reporttype=" + reporttype + "&isspecial=" + isSpecial + "&subid=" + subid,);
  }
  // ----------------------------------------------------------refresh-----------------------
  getrefreshData(role: any, username: any, operatorid: any, subid: any, transactionid: any, type: any): Observable<any[]> {
    console.log("/report/GetRefreshData?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&subid=" + subid + "&transactionid=" + transactionid + "&type=" + type);
    return this.http.get<any[]>(BASE_URL + "/report/GetRefreshData?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&subid=" + subid + "&transactionid=" + transactionid + "&type=" + type,);
  }

  // -----------------------------------------------Wallet Share report-------------------------------------------------------


  getWalletShareReport(role: any, username: any, fromdate: any, todate: any, operatorid: any, reporttype: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/report/WalletShareReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid + "&reporttype=" + reporttype);
  }

  getWalletShareReportDownload(role: any, username: any, fromdate: any, todate: any, operatorid: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/WalletShareReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // -----------------------------------------------Subscriber bill-------------------------------------------------------

  getSubscriberBill(role: any, username: any, month: any, year: any, reporttype: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/report/getSubscriberBill?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&reportgentype=" + reporttype + "&smartcard=" + smartcard);
  }


  getSubscriberBillDownload(role: any, username: any, month: any, year: any, reporttype: any, smartcard: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getSubscriberBill?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&reportgentype=" + reporttype + "&smartcard=" + smartcard, { responseType: 'blob' });
  }

  // -----------------------------------------------Addon Individual report-------------------------------------------------------

  getAddonExportReportDownload(role: any, username: any, id: number): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getAddonReport?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id, { responseType: 'blob' });
  }

  getAllAddonExportReportDownload(role: any, username: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getAllAddonReport?role=" + role + "&username=" + encodeURIComponent(username), { responseType: 'blob' });
  }
  // -----------------------------------------------Package Master Report Download-------------------------------------------------------


  getPakcageHistoryDownload(role: any, username: any, castype: number, reporttype: number): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getPackageMasterReport?role=" + role + "&username=" + encodeURIComponent(username) + "&castype=" + castype + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  // -----------------------------------------------User Recharge History-------------------------------------------------------

  getUserRecharegeHistory(role: any, username: any, fromdate: any, todate: any, userid: number, reporttype: number): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/report/UserRechargeHistory?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&userid=" + userid + "&reporttype=" + reporttype);
  }


  getUserRecharegeHistoryDownload(role: any, username: any, fromdate: any, todate: any, userid: number, reporttype: number): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/UserRechargeHistory?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&userid=" + userid + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ----------------------------------------Package Reports (lco wise active subscription count - model list)------------------------------------------------------
  getModelList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/report/getModelDetails?role=" + role + "&username=" + encodeURIComponent(username));
  }
  // --------------------------------------getCasFormActivationReport-------------------------

  getCasFormActivationReport(role: any, username: any, searchname: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/subscriber/getCasFormActivationReport?role=" + role + "&username=" + encodeURIComponent(username) + "&searchname=" + searchname + "&reporttype=" + reporttype, { responseType: 'blob' });
  }


  // ------------------------------------------TOTAL LCO REPORT----------------------

  getTotalOperatorReport(role: any, username: any, reporttype: number): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/GetTotalOperatorReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { observe: 'response' });
  }


  getTotalOperatorReportDownload(role: any, username: any, reporttype: number): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/GetTotalOperatorReport?role=" + role + "&username=" + encodeURIComponent(username) + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  // ------------------------------------------getLcoTransferReport----------------------

  getLcoTransferReport(role: any, username: any, smartcard: any, operatorid: any, fromdate: any, todate: any, reporttype: number): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getLcoTransferReport?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&operatorid=" + operatorid + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { observe: 'response' });
  }


  getLcoTransferReportDownload(role: any, username: any, smartcard: any, operatorid: any, fromdate: any, todate: any, reporttype: number): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getLcoTransferReport?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&operatorid=" + operatorid + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ------------------------------------------sublco offline----------------------

  getsubLcoOfflineReport(role: any, username: any, fromdate: any, todate: any, operatorid: any, retailerid: any, reporttype: number): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/offlinepaymentsublco?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid + "&retailerid=" + retailerid + "&reporttype=" + reporttype, { observe: 'response' });
  }


  getsubLcoOfflineDownload(role: any, username: any, fromdate: any, todate: any, operatorid: any, retailerid: any, reporttype: number): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/offlinepaymentsublco?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&operatorid=" + operatorid + "&retailerid=" + retailerid + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ------------------------------------------bulk activation----------------------

  getBulkFirstTimeActivationReport(role: any, username: any, date: any, remark: any, type: any, reporttype: number): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(BASE_URL + "/report/getBulkFirstTimeActivationReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&remark=" + remark + "&type=" + type + "&reporttype=" + reporttype, { observe: 'response' });
  }


  getBulkFirstTimeActivationDownload(role: any, username: any, date: any, remark: any, type: any, reporttype: number): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getBulkFirstTimeActivationReport?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date + "&remark=" + remark + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // ------------------------------------------------------LCO INVOCE-------------------------------------------------
  getLcoInvoiceDetails(role: any, username: any, operatorid: any, month: any, Year: any, reporttype: any): Observable<Blob> {
    return this.http.get(
      BASE_URL + "/report/getLcoInvoice?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&month=" + month + "&year=" + Year + "&reporttype=" + reporttype, { responseType: 'blob' });
  }
  // --------------------------------------------smartcard list----------------------------

  getSearchSmartcardData(role: any, username: any, searchname: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSearchSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&searchname=" + searchname,);
  }

  // ==============================================================================================================================================
  // ----------------------------------------------------------INVENTORY-[LOGIN]-----------------------------------------------------------------------------
  // ----------------------------------------------------------------inventory----------------------------
  getInventoryUpdateDate(role: any, username: any, date: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/master/updateLicense?role=" + role + "&username=" + encodeURIComponent(username) + "&date=" + date, {})
  }
  getInvent_License_Extend(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/master/getLoginList?role=" + role + "&username=" + encodeURIComponent(username));
  }
  // ----------------------------------------------------------------cortonbox-------------------------------------
  cortonBoxUplod(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/cartonBoxUpload", requestBody, {});
  }
  getCortonBoxList(role: any, username: any, model: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getCartonBoxList?role=" + role + "&username=" + encodeURIComponent(username) + "&model=" + model)
  }
  getCortonBoxDetails(role: any, username: any, model: any, cortonBox: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getCartonBoxDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&model=" + model + "&cartonbox=" + cortonBox)
  }

  cortonBoxDetails(role: any, username: any, operatorid: any, isemi: boolean, dueamount: any, type: any, areaid: any, streetid: any, packageid: any, days: any, subscribername: any,
    smartcardlist: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/uploadCartonBox?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&isemi=" + isemi + "&dueamount=" + dueamount + "&type=" + type + "&areaid=" + areaid + "&streetid=" + streetid + "&packageid=" + packageid + "&days=" + days + "&subscribername=" + subscribername + "&smartcardlist=" + smartcardlist, {});
  }
  getLCOportalcortonBoxDetails(role: any, username: any, operatorid: any, isemi: boolean, dueamount: any, type: any, areaid: any, streetid: any, packageid: any, days: any, subscribername: any,
    smartcardlist: any, plantype: any, plan: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/uploadCartonBox?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&isemi=" + isemi + "&dueamount=" + dueamount + "&type=" + type + "&areaid=" + areaid + "&streetid=" + streetid + "&packageid=" + packageid + "&days=" + days + "&subscribername=" + subscribername + "&smartcardlist=" + smartcardlist + "&plantype=" + plantype + "&plan=" + plan, {});
  }

  getAllCartonBoxList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getAllCartonBoxList?role=" + role + "&username=" + encodeURIComponent(username))
  }

  getEmiDetails(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getEmiDetails?role=" + role + "&username=" + encodeURIComponent(username))
  }
  // =============================================Service center Role====================================

  getStbProblemList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getStbProblemList?role=" + role + "&username=" + encodeURIComponent(username))
  }
  getHardwardEmployeeList(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getHardwardEmployeeList?role=" + role + "&username=" + encodeURIComponent(username))
  }
  getSmartcardSearch(role: any, username: any, searchname: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getSmartcardSearch?role=" + role + "&username=" + encodeURIComponent(username) + "&searchname=" + searchname)
  }
  getSmartcardDetails(role: any, username: any, searchname: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getSmartcardDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&searchname=" + searchname)
  }
  getNoSmartcardDetails(role: any, username: any, nosmartcard: boolean): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getNoSmartcardDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&nosmartcard=" + nosmartcard)
  }
  getReplaceSmartcardList(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getReplaceSmartcardList?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard)
  }
  getSmartcardList(role: any, username: any,): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getSmartcardList?role=" + role + "&username=" + encodeURIComponent(username))
  }
  getServiceHistoryDetails(role: any, username: any, operatorid: any, smartcard: any, fromdate: any, todate: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getServiceHistoryDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&smartcard=" + smartcard + "&fromdate=" + fromdate + "&todate=" + todate)
  }
  updateServiceEntry(role: any, username: any, smartcard: any, problemid: any, remarks: any, tokenno: any, replace: any, attenderid: any, boxtype: any, replacesmartcard: any, amount: any, id: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/updateServiceEntry?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&problemid=" + problemid + "&remarks=" + remarks + "&tokenno=" + tokenno + "&replace=" + replace + "&attenderid=" + attenderid + "&boxtype=" + boxtype + "&replacesmartcard=" + replacesmartcard + "&amount=" + amount + "&id=" + id, {});
  }
  updateServiceLog(role: any, username: any, id: any, problemid: any, dispatchremarks: any, deliveryremarks: any, amount: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/allocation/updateServiceLog?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&problemid=" + problemid + "&dispatchremarks=" + dispatchremarks + "&deliveryremarks=" + deliveryremarks + "&amount=" + amount, {});
  }
  getServiceLogDetails(role: any, username: any, id: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/allocation/getServiceLogDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&id=" + id + "&type=" + type)
  }
  // --------------------------------------report-----------------------
  getServiceLogReport(role: any, username: any, fromdate: any, todate: any, smartcard: any, operatorid: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getServiceLogReport?role=" + role + "&username=" + encodeURIComponent(username) + "&fromdate=" + fromdate + "&todate=" + todate + "&smartcard=" + smartcard + "&operatorid=" + operatorid + "&reporttype=" + reporttype, { responseType: 'blob' });
  }

  // =======================================================OPERATOR LOGIN==================================
  getOperatorLoginDashboardCount(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getOperatorLoginDashboardCount?role=" + role + "&username=" + encodeURIComponent(username))
  }
  getOpDetails(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getOpDetails?role=" + role + "&username=" + encodeURIComponent(username))
    // return this.http.get<any[]>(BASE_URL + "/operator/getOpDetails?role=" + role + "&username=" + username)
  }
  // -------------------------------------------------------bar-------------------------------------------------
  getMonthWiseRechargeBarchart(role: any, username: any, month: any, year: any, operator: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getMonthWiseRechargeBarchart?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&operatorid=" + operator)
  }
  getMonthWisePackageRechargePiechart(role: any, username: any, month: any, year: any, operator: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getMonthWisePackageRechargePiechart?role=" + role + "&username=" + encodeURIComponent(username) + "&month=" + month + "&year=" + year + "&operatorid=" + operator)
  }

  // --------------------------------------------------change password-------------------------------
  getChangeLcoPassword(role: any, username: any, oldpassword: any, newpassword: any, confirmpassword: any, operatorid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/ChangeLcoPassword?role=" + role + "&username=" + encodeURIComponent(username) + "&oldpassword=" + oldpassword + "&newpassword=" + newpassword + "&confirmpassword=" + confirmpassword + "&operatorid=" + operatorid, {});
  }
  // ----------------------------------------------------street list--------------------------------------------------------------
  getOperatorAllStreetList(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getOperatorAllStreetList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid)
  }

  // ---------------------------------------package---------------------------------------------------
  getLcoPackageList(role: any, username: any, operatorid: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getPackageList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&type=" + type)
  }
  // -----------------------------------------wallte force message--------------------

  getcheckLcoForceMessage(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/checkLcoForceMessage?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid)
  }

  // ---------------------------------------------getAllLcoList---------------------------

  getAllLcoList(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getAllLcoList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid)
  }
  // ------------------------------------------Operator Dashboard----------------------------
  getOpLoginReportByOpid(role: any, username: any, operatorid: any, type: any, reporttype: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/report/getOpLoginReportByOpid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&type=" + type + "&reporttype=" + reporttype)
  }
  getOpLoginReportByReport(role: any, username: any, operatorid: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getOpLoginReportByOpid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' })
  }
  getLcoDiscountListByOpidAreaid(role: any, username: any, operatorid: any, type: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getLcoDiscountListByOpidAreaid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&type=" + type + "&reporttype=" + reporttype, { responseType: 'blob' })
  }
  // getLcoDiscountListByOpidAreaidReport(role: any, username: any, operatorid: any, type: any, reporttype: any): Observable<any[]> {
  //   return this.http.get<any[]>(BASE_URL + "/report/getLcoDiscountListByOpidAreaid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&type=" + type + "&reporttype=" + reporttype)
  // }
  // -----------------------------------------wallet recharge (requsr)-----------------------
  lcoOnlineInitialRequest(role: any, username: any, amount: any, operatorid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/lcoOnlineInitialRequest?role=" + role + "&username=" + encodeURIComponent(username) + "&amount=" + amount + "&operatorid=" + operatorid, {});
  }
  getLcoPaymentGatewayDetails(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/getLcoPaymentGatewayDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid, {});
  }
  lcoOnlineFailurelRecharge(role: any, username: any, amount: any, operatorid: any, transactionid: any, paymentstatus: any, hash: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/lcoOnlineFailurelRecharge?role=" + role +
      "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&amount=" + amount + "&transactionid=" + transactionid + "&paymentstatus=" + paymentstatus + "&hash=" + hash, {});
  }

  // -------------------------------------------vc smartcard change and boxid change ------------------------

  getDataBysmartcardOrBoxid(role: any, username: any, type: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getDataBysmartcardOrBoxid?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&smartcard=" + smartcard)
  }
  getSmartcardBoxidList(role: any, username: any, type: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getSmartcardBoxidList?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type)
  }

  getSmartcardChange(role: any, username: any, type: any, oldsmartcard: any, newsmartcard: any, boxid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/SmartcardChange?role=" + role + "&username=" + encodeURIComponent(username) + "&type=" + type + "&oldsmartcard=" + oldsmartcard + "&newsmartcard=" + newsmartcard + "&boxid=" + boxid, {});
  }

  getBoxChange(role: any, username: any, oldboxid: any, newboxid: any, smartcard: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/BoxChange?role=" + role + "&username=" + encodeURIComponent(username) + "&oldboxid=" + oldboxid + "&newboxid=" + newboxid + "&smartcard=" + smartcard, {});
  }
  // ------------------------------------------ discount list ------------------------------

  // getAllLcoDiscountList(role: any, username: any, operatorid: any, distributorid: any): Observable<any[]> {
  //   return this.http.get<any[]>(BASE_URL + "/operator/getAllLcoDiscountList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&distributorid=" + distributorid)
  // }
  getDistributorPackageList(role: any, username: any, operatorid: any, distributorid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getDistributorPackageList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&distributorid=" + distributorid)
  }
  getOpDiscountListByOpidAreaid(role: any, username: any, operatorid: any, areaid: any, type: any, ismso: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getLcoDiscountListByOpidAreaid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&areaid=" + areaid + "&type=" + type + "&ismso=" + ismso)
  }
  // updatePlanwiseDiscount(role: any, username: any, operatorid: any, orderid: any, plan_discount: any): Observable<any[]> {
  //   return this.http.post<any[]>(BASE_URL + "/operator/updatePlanwiseDiscount?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&orderid=" + orderid + "&plan_discount=" + plan_discount, {})
  // }
  updatePlanwiseDiscount(role: any, username: any, operatorid: any, orderid: any, plan_discount: any, type: any, ismso: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/updatePlanwiseDiscount?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&orderid=" + orderid + "&plan_discount=" + plan_discount + "&type=" + type + "&ismso=" + ismso, {})
  }
  // getPlanDiscountDetailsByOpidPackageid(role: any, username: any, operatorid: any, orderid: any, customer_amount: any, lco_commission: any): Observable<any[]> {
  //   return this.http.get<any[]>(BASE_URL + "/operator/getPlanDiscountDetailsByOpidPackageid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&orderid=" + orderid + "&customer_amount=" + customer_amount + "&lco_commission=" + lco_commission)
  // }
  getPlanDiscountDetailsByOpidPackageid(role: any, username: any, operatorid: any, orderid: any, customer_amount: any, lco_commission: any, ismso: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getPlanDiscountDetailsByOpidPackageid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&orderid=" + orderid + "&customer_amount=" + customer_amount + "&lco_commission=" + lco_commission + "&ismso=" + ismso)
  }
  getupdateLcoDiscountBytype(role: any, username: any, operatorid: any, discount_type: any, isdiscount: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/updateLcoDiscountBytype?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&discount_type=" + discount_type + "&isdiscount=" + isdiscount, {})
  }
  getLcoDiscountListByOpidAreaidsmartcard(role: any, username: any, operatorid: any, areaid: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getLcoDiscountListByOpidAreaid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&areaid=" + areaid + "&smartcard=" + smartcard)
  }
  getupdateDiscountByArea(role: any, username: any, operatorid: any, areaid: any, packageid: any, ispercentage: any, commission: any, old_customeramount: any, new_customeramount: any, smartcard: any, discount_value: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/updateDiscountByArea?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&areaid=" + areaid + "&packageid=" + packageid + "&ispercentage=" + ispercentage + "&commission=" + commission + "&old_customeramount=" + old_customeramount + "&new_customeramount=" + new_customeramount + "&smartcard=" + smartcard + "&discount_value=" + discount_value, {})
  }

  getSmartcardWiseDiscountList(role: any, username: any, operatorid: any, areaid: any, smartcard: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/getSmartcardWiseDiscountList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&areaid=" + areaid + "&smartcard=" + smartcard)
  }
  // ===========================================Bill Collection=====================
  getbillCollectionReport(role: any, username: any, operatorid: any, bill_type: any, useragent: any, fromdate: any, todate: any, searchname: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/operator/billCollectionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&bill_type=" + bill_type + "&useragent=" + useragent + "&fromdate=" + fromdate + "&todate=" + todate + "&searchname=" + searchname)
  }

  getupdatePaybill(role: any, username: any, operatorid: any, smartcard: any, paid_amount: any, status: any, useragent: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/updatePaybill?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&smartcard=" + smartcard + "&paid_amount=" + paid_amount + "&status=" + status + "&useragent=" + useragent, {})
  }
  getupdatePaybillUpdate(role: any, username: any, operatorid: any, smartcard: any, paid_amount: any, status: any, useragent: any, retailerid: any, type: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/updatePaybill?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&smartcard=" + smartcard + "&paid_amount=" + paid_amount + "&status=" + status + "&useragent=" + useragent + "&retailerid=" + retailerid + "&type=" + type, {})
  }

  getBillCollectionReport(role: any, username: any, operatorid: any, bill_type: any, useragent: any, fromdate: any, todate: any, searchname: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getBillCollectionReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&bill_type=" + bill_type + "&useragent=" + useragent + "&fromdate=" + fromdate + "&todate=" + todate + "&searchname=" + searchname + "&reporttype=" + reporttype, { responseType: 'blob' })
  }


  // ===========================================distributot discount=============================================
  getupdatedistributorDiscount(role: any, username: any, operatorid: any, distributorid: any, packageid: any, msoamount: any, oldmsoamount: any, newmsoamount: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/updatedistributorDiscount?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&distributorid=" + distributorid + "&packageid=" + packageid + "&msoamount=" + msoamount + "&oldmsoamount=" + oldmsoamount + "&newmsoamount=" + newmsoamount, {})
  }


  // getupdateSublcoDiscount(role: any, username: any, operatorid: any, distributorid: any, packageid: any, isgst: any, msoamount: any, old_msoamount: any, new_msoamount: any): Observable<any[]> {
  //   return this.http.post<any[]>(BASE_URL + "/operator/updatedistributorDiscount?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&distributorid=" + distributorid + "&packageid=" + packageid + "&isgst=" + isgst + "&msoamount=" + msoamount + "&oldmsoamount=" + old_msoamount + "&newmsoamount=" + new_msoamount, {})
  // }
  getupdateSublcoDiscount(role: any, username: any, operatorid: any, retailerid: any, packageid: any, isgst: any, msoamount: any, old_msoamount: any, new_msoamount: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/updateSublcoDiscount?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&retailerid=" + retailerid + "&packageid=" + packageid + "&isgst=" + isgst + "&msoamount=" + msoamount + "&old_msoamount=" + old_msoamount + "&new_msoamount=" + new_msoamount, {})
  }

  // ---------------------------Distributor Recharge----------------------  

  getRetailerListByOpid(role: any, username: any, operatorid: any): Observable<any> {
    return this.http.get<any>(BASE_URL + "/operator/getRetailerListByOpid?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid)
  }
  getretailerOfflineRecharge(role: any, username: any, operatorid: any, retailerid: any, amount: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/operator/retailerOfflineRecharge?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&retailerid=" + retailerid + "&amount=" + amount, {})
  }
  getSublcoDiscountList(role: any, username: any, operatorid: any, retailerid: any): Observable<any> {
    return this.http.get<any>(BASE_URL + "/operator/getSublcoDiscountList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&retailerid=" + retailerid)
  }

  // =============================================current balance=======================
  getlcoOfflineWalletShare(role: any, username: any, operatorid: any, selectedopid: any, amount: any, remarks: any): Observable<any> {
    return this.http.post<any>(BASE_URL + "/operator/lcoOfflineWalletShare?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&selectedopid=" + selectedopid + "&amount=" + amount + "&remarks=" + remarks, {})
  }

  // ----------------------------------------------lco reports (monthwise)-----------------------------------------------------
  getlcoMonthwiseActivationReport(role: any, username: any, operatorid: any, fromdate: any, todate: any, reporttype: any): Observable<Blob> {
    return this.http.get(BASE_URL + "/report/getlcoMonthwiseActivationReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype, { responseType: 'blob' })
  }
  getlcoMonthwiseActivationData(role: any, username: any, operatorid: any, fromdate: any, todate: any, reporttype: any): Observable<any[]> {
    return this.http.get<any>(BASE_URL + "/report/getlcoMonthwiseActivationReport?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&fromdate=" + fromdate + "&todate=" + todate + "&reporttype=" + reporttype,)
  }

  // =========================================subLCO wallet updation ========================================
  getUpdateSublcoRate(role: any, username: any, operatorid: any, retailerid: any, discounttype: any): Observable<any[]> {
    return this.http.post<any>(BASE_URL + "/operator/updateSublcoRate?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&retailerid=" + retailerid + "&discounttype=" + discounttype, {})
  }

  // ================================================VC - CHIPID============================

  getmodelSearch(role: any, username: any, searchname: any): Observable<any> {
    return this.http.get<any>(BASE_URL + "/allocation/modelSearch?role=" + role + "&username=" + encodeURIComponent(username) + "&searchname=" + searchname)
  }
  getModelSearchDetails(role: any, username: any, searchname: any): Observable<any> {
    return this.http.get<any>(BASE_URL + "/allocation/getModelSearchDetails?role=" + role + "&username=" + encodeURIComponent(username) + "&searchname=" + searchname)
  }
  getOperatorWiseModelList(role: any, username: any, operatorid: any): Observable<any> {
    return this.http.get<any>(BASE_URL + "/allocation/getOperatorWiseModelList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid)
  }
  getStbModlelList(role: any, username: any): Observable<any> {
    return this.http.get<any>(BASE_URL + "/allocation/getStbModlelList?role=" + role + "&username=" + encodeURIComponent(username))
  }
  getOperatorWiseChipidForceList(role: any, username: any, operatorid: any): Observable<any> {
    return this.http.get<any>(BASE_URL + "/allocation/getOperatorWiseChipidForceList?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid)
  }
  getchipidUpdate(role: any, username: any, smartcard: any, chipid: any, model: any): Observable<any[]> {
    return this.http.post<any>(BASE_URL + "/allocation/chipidUpdate?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard + "&chipid=" + chipid + "&model=" + model, {})
  }
  getCreateModel(role: any, username: any, modelname: any, model: any, mrp: any): Observable<any[]> {
    return this.http.post<any>(BASE_URL + "/allocation/createModel?role=" + role + "&username=" + encodeURIComponent(username) + "&modelname=" + modelname + "&model=" + model + "&mrp=" + mrp, {})
  }
  getUpdateModel(role: any, username: any, modelname: any, model: any, status: any, id: any): Observable<any[]> {
    return this.http.post<any>(BASE_URL + "/allocation/updateModel?role=" + role + "&username=" + encodeURIComponent(username) + "&modelname=" + modelname + "&model=" + model + "&status=" + status + "&id=" + id, {})
  }
  getUpdateModelForOperator(role: any, username: any, operatorid: any, selectedlist: any): Observable<any[]> {
    return this.http.post<any>(BASE_URL + "/allocation/updateModelForOperator?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&selectedlist=" + selectedlist, {})
  }
  getUpdateChipidForce(role: any, username: any, operatorid: any, force: any): Observable<any[]> {
    return this.http.post<any>(BASE_URL + "/allocation/updateChipidForce?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&force=" + force, {})
  }
  getUpdateChipidForceDate(role: any, username: any, operatorid: any, date: any): Observable<any[]> {
    return this.http.post<any>(BASE_URL + "/allocation/updateChipidForceDate?role=" + role + "&username=" + encodeURIComponent(username) + "&operatorid=" + operatorid + "&date=" + date, {})
  }
  getresetPayBill(role: any, username: any, resetid: any,): Observable<any[]> {
    return this.http.post<any>(BASE_URL + "/operator/resetPayBill?role=" + role + "&username=" + encodeURIComponent(username) + "&resetid=" + resetid, {})
  }

  // ======================================================SUBLCO DETAILS====================================================
  // getSublcoDetails(role: any, username: any): Observable<any[]> {
  //   return this.http.get<any>(BASE_URL + "/sublco/getSublcoDetails?role=" + role + "&username=" + encodeURIComponent(username),)
  // }
  getSublcoDetails(role: any, username: any): Observable<any[]> {
    return this.http.get<any>(BASE_URL + "/sublco/getSublcoDetails?role=" + role + "&username=" + username,)
  }
  getSublcoOnlineFailurelRecharge(role: any, username: any, amount: any, retailerid: any, transactionid: any, paymentstatus: any, hash: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/sublco/sublcoOnlineFailurelRecharge?role=" + role +
      "&username=" + encodeURIComponent(username) + "&amount=" + amount + "&retailerid=" + retailerid + "&transactionid=" + transactionid + "&paymentstatus=" + paymentstatus + "&hash=" + hash, {});
  }
  getSublcoOnlineInitialRequest(role: any, username: any, amount: any, retailerid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/sublco/sublcoOnlineInitialRequest?role=" + role + "&username=" + encodeURIComponent(username) + "&amount=" + amount + "&retailerid=" + retailerid, {});
  }

  getSublcoLoginDashboardCount(role: any, username: any, retailerid: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/sublco/getSublcoLoginDashboardCount?role=" + role + "&username=" + encodeURIComponent(username) + "&retailerid=" + retailerid,)
  }
  // --------------------------------------------------SUBLCO change password-------------------------------
  getChangeSubLcoPassword(role: any, username: any, oldpassword: any, newpassword: any, confirmpassword: any, retailerid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/sublco/changeSublcoPassword?role=" + role + "&username=" + encodeURIComponent(username) + "&oldpassword=" + oldpassword + "&newpassword=" + newpassword + "&confirmpassword=" + confirmpassword + "&retailerid=" + retailerid, {});
  }
  // ========================================================== SUBSCRIBER ROLE ==============================
  getSubscriberDetails(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getSubscriberDetails?role=" + role + "&username=" + encodeURIComponent(username),)
  }
  getsubscriberOnlineInitialRequest(role: any, username: any, amount: any, subid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/subscriberOnlineInitialRequest?role=" + role + "&username=" + encodeURIComponent(username) + "&amount=" + amount + "&subid=" + subid, {});
  }
  getsubscriberOnlineFailurelRecharge(role: any, username: any, amount: any, subid: any, transactionid: any, paymentstatus: any, hash: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/subscriberOnlineFailurelRecharge?role=" + role + "&username=" + encodeURIComponent(username) + "&amount=" + amount + "&subid=" + subid + "&transactionid=" + transactionid + "&paymentstatus=" + paymentstatus + "&hash=" + hash, {});
  }
  getchangeSubscriberPassword(role: any, username: any, oldpassword: any, newpassword: any, confirmpassword: any, subid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/changeSubscriberPassword?role=" + role + "&username=" + encodeURIComponent(username) + "&oldpassword=" + oldpassword + "&newpassword=" + newpassword + "&confirmpassword=" + confirmpassword + "&subid=" + subid, {});
  }

  // =================================================Swap==================================
  getSwapSubscriberSmartcard(role: any, username: any, oldsmartcard: any, newsmartcard: any, type: any, retailerid: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/swapSubscriberSmartcard?role=" + role + "&username=" + encodeURIComponent(username) + "&oldsmartcard=" + oldsmartcard + "&newsmartcard=" + newsmartcard + "&type=" + type + "&retailerid=" + retailerid, {});
  }

  // ==================================================QR=================================
  getGenerateQrCode(role: any, username: any, smartcard: any,): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/generateQrCode?role=" + role + "&username=" + encodeURIComponent(username) + "&smartcard=" + smartcard, {});
  }
  // -------------------------------download QR-------------
  getDownloadQR(role: any, username: any, smartcard: any): Observable<any[]> {
    return this.http.get<any>(BASE_URL + "/subscriber/downloadQR?role=" + role + "&username=" + username + "&smartcard=" + smartcard,)
  }
  // ============================================================== comboPackageUpdateHistory =====================================
  getcomboPackageUpdateHistoryReport(role: any, username: any, fromdate: any, todate: any, packageid: any, reporttype: any, packagetype: any): Observable<any[]> {
    return this.http.get<any>(BASE_URL + "/report/getcomboPackageUpdateHistoryReport?role=" + role + "&username=" + username + "&fromdate=" + fromdate + "&todate=" + todate + "&packageid=" + packageid + "&reporttype=" + reporttype + "&packagetype=" + packagetype,)
  }
}