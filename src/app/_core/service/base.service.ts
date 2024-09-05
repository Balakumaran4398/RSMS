import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import URLs from "src/app/URL";
import { Observable } from 'rxjs';
const AUTH_URL = URLs.AUTH_URL();
const BASE_URL = URLs.BASE_URL();
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class BaseService {
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
  Upload_CHANNEL(requestBody: any): Observable<any[]> {
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
    return this.http.get<any[]>(BASE_URL + "/package/getChannellistByAddonpackageView?role=" + role + "&username=" + username + "&packageid=" + package_id, {});
  }
  UPDATE_ADDON_PACKAGE(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/package/updateAddonpack", requestBody, {});
  }
  ADDON_MANAGE_PACKAGE(package_id: any, role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + "/package/manageAddonpackage?id=" + package_id + "&role=" + role + "&username=" + username, {});
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
      {}
    );
  }
  Finger_print_List(role: any, username: string,): Observable<any[]> {
    console.log(role);
    return this.http.get<any[]>(BASE_URL + "/fingerprint/getfingerprint?role=" + role + "&username=" + username);
  }
  Finger_datas(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/fingerprint/getfingerprint?role=" + role + "&username=" + username,
      {}
    );
  }
  // ==========================================SUBSCRIBER====================================
  Create_Subscriber(requestBody: any): Observable<any[]> {
    return this.http.post<any[]>(BASE_URL + "/subscriber/createSubscriber", requestBody, {});
  }

  getsubscriberlist_subscriber(role: any, username: any, status: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getSubscriberList?role=" + role + "&username=" + username + "&status=" + status, {}
    );
  }
  Create_subscriber_list(role: any, username: any,): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getOperatorListforSubInsert?role=" + role + "&username=" + username, {}
    );
  }
  Create_Area_list(role: any, username: any, operatorid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAreaListByOperatorid?role=" + role + "&username=" + username + "&operatorid=" + operatorid, {}
    );
  }
  Create_Street_list(role: any, username: any, areaid: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getStreetListByAreaid?role=" + role + "&username=" + username + "&areaid=" + areaid, {}
    );
  }
  Create_Idproof_list(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getIdProofList?role=" + role + "&username=" + username, {}
    );
  }
  Create_AddressProof_list(role: any, username: any): Observable<any[]> {
    return this.http.get<any[]>(
      BASE_URL + "/subscriber/getAddresProofList?role=" + role + "&username=" + username, {}
    );
  }
  Expiry_subscriber(role: any, username: any, operatorid: any, fromdate: any, todate: any, format: any): Observable<any> {
    return this.http.get<any[]>(BASE_URL + "/subscriber/getExpirySubscriberByOperator?role=" + role + "&username=" + username + "&operatorid=" + operatorid + "&fromdate=" + fromdate + "&todate=" + todate + "&format=" + format, {}
    )
  }

  // -------------------------------------_Expiry getExpirySubscriberByOperator----------------------------------------------

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
}