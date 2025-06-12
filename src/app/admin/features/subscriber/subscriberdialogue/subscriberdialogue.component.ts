import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { NgZone } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { default as _rollupMoment, Moment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2';
import { BehaviorSubject, filter, map, Observable, startWith } from 'rxjs';
import { SwalService } from 'src/app/_core/service/swal.service';
import { dateToNumber } from 'ag-charts-community/dist/types/src/module-support';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavComponent } from '../../nav/nav.component';
declare var $: any;
const moment = _rollupMoment || _moment;
interface requestBodylogs {
  access_ip: any;
  action: any;
  remarks: any;
  data: any;

}
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-subscriberdialogue',
  templateUrl: './subscriberdialogue.component.html',
  styleUrls: ['./subscriberdialogue.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SubscriberdialogueComponent implements OnInit, OnDestroy {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  readonly date = new FormControl<string>(moment().format('YYYY-MM'));

  columnDefs: any;
  finalrow: any = [];

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: any) {
    const formattedDate = normalizedMonthAndYear.format('YYYY-MM');
    this.date.setValue(formattedDate);
    datepicker.close();
  }

  type: number = 1;
  isDisabled: boolean = true;
  isActive: boolean = false;
  filteredPackageList: Observable<any[]> | undefined;
  filterControl = new FormControl();
  addonConfirmationData: any;
  alacarteConfirmationData: any;

  isEditSubscriberDetails: boolean = false;
  islogindetails: boolean = false;
  isConfirmationReport: boolean = false;
  isaddSmartcard: boolean = false;
  ischangeoperator: boolean = false;
  ischange_lco: boolean = false;
  addonconfirmation: boolean = false;
  alacarteconfirmation: boolean = false;
  removeproduct: boolean = false;
  confirmation: boolean = false;
  isConfirmationComplete = false;
  isSelectionMade: boolean = false;
  rechargeToggle: boolean = false;
  isaddalacarte: boolean = false;
  isaddaddon: boolean = false;
  isRemove: boolean = false;

  add_proof_array: Array<{ key: string; value: number }> = [];
  id_proof_array: Array<{ key: string; value: number }> = [];

  filteredSmartcard: any[] = [];
  filteredOperators: any[] = [];
  filteredPackagenameList: any[] = [];
  filteredAreas: any[] = [];
  filteredStreet: any[] = [];
  filteredSub: any[] = [];
  selectedPackageName: any;
  selectedSmartcard: any;
  selectedOperator: any;
  selectedArea: any;
  selectedStreet: any;
  selectedSub: any;

  showOperators = false;

  pair: boolean = false;
  unpair: boolean = false;
  ischeck: boolean = false;
  pairedSmartcard: any;
  packageMessage: any;
  sendMessageName: any;
  pairedBoxid: any;

  cardOldBalance: any;
  newexpiryDate: any;
  oldExpiryDate: any;
  msoAmount: any;

  returndata: any;

  First_list: any;
  changebase: any;
  changebase_msoAmount: any;
  changebase_totalRefundToLco: any;
  changebase_expiryDate: any;
  LoginForm!: FormGroup;
  Editform!: FormGroup;
  Sendmseform!: FormGroup;
  signinform!: FormGroup;
  addsmartcardform!: FormGroup;
  role: any;
  username: any;
  castype: any;
  castypeSmartcard: any = 0;
  lconame: any;

  smartcard: any = 0;
  submitted: boolean = false;
  // smartcard: any = 0;
  boxid: any = "";
  cas: any[] = [];
  lcoid: any = 0;
  lcoareaid: any = 0;
  lcostreetid: any = 0;
  withsubscription = false;
  area: any[] = [];
  searchTerm: any;
  lco_list: any[] = [];
  sub_list: any[] = [];
  area_list: any[] = [];
  street_list: any[] = [];

  pairBoxList: any[] = [];
  pairSmartcardList: any[] = [];
  packageMessageList: any[] = [];
  subSmartcard: any;
  subBoxid: any;
  isUnpairDialogue: any;
  operatorid: any;
  subid: any;
  islock = false;
  password: any;
  subscribername: any;
  boxstatus: any;
  subusername: any;
  Wallet: any;

  currentstatus: any;
  subscribernameLast: any;
  dateofbirth: any;
  fathername: any;
  customerid: any;
  address: any;
  mobileno: any;
  landlineno: any;
  installaddress: any;
  email: any;
  casformid: any
  livetv = false;
  addressproof: any;

  idproof: any;
  addressprooftypeid: any;
  idprooftypeid: any;
  areaid: any;
  streetid: any;
  areaname: any;
  streetname: any;

  packageid: any;
  plan: any;
  f_smartcard: any;
  f_plantype: any;
  f_date: any;
  today: any;
  tomorrow: any;
  f_subid: any;
  boxno: any;
  message: any;
  smart: boolean = false;
  box: boolean = false;
  status: any;
  smartcardno: any;
  operatorname: any;
  mobile: any;
  cardbalance: any;
  currentPackagename: any;
  noOfDays: any;
  customwerAmount: any;
  expirydate: any;
  packagename: any;
  newpackagename: any = 0;
  statusdisplay: any;
  baseplan: any;
  newpin: any;
  statusValue: any;
  statusSus: any;
  oldpin: any;
  PVRstatus: boolean = false;
  forcemsg: any;
  plantype: any;
  rechargetype: any[] = [];
  packagenameList: any[] = [];
  subid_1: any;
  newSubid: any;
  p_name: any;
  selectedRechargetype: string = '0';
  selectedpackagetype: string = '0';
  datetype = false;
  isplantype = false;

  isSelectplanType = false;
  isSelectDateType = false;
  isSelectdateToDateType = false;
  billtype: number = 0;
  paid: any;
  unpaid: any;
  iscollected = false;
  showData = false
  timegap: any;
  duration: any;
  forcemessage: any;
  repeatfor: any;
  sus_reason: any;
  block_reason: any;
  new_boxid: any;
  errorMessage: string = '';
  errorMessage1: string = '';

  lcoreFund: any;
  lcoreExpirydate: any;
  rowData: any;
  rowData1: any[] = [];
  rowData3: any[] = [];
  selectedIds: number[] = [];
  gridApi: any;
  public rowSelection: any = "multiple";
  isAnyRowSelected: any = false;
  rows: any;

  lcoDeatails: any;
  operatorId: any;
  isplan = false;
  isdate = false;
  isdateTodate = false;
  subAddonAdd = false;
  subAlacarte = false;
  subChangeBase = false;

  SublcopermissionObj: any;
  Subwallet = false;
  sublcoDiscount: any;
  selectedtypes: number[] = [];

  billTypeValue: any;
  collectedPayAmount: any = 0;
  customerPayAmount: any;
  balanceamount: any;
  excessAmount: any;
  oldexcessAmount: any;
  newExcessAmount: any;


  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 320,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },

  }
  gridOptions1 = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 320,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 5,
    pagination: true,
  }
  gridOptions2 = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        if (!isNaN(valueA) && !isNaN(valueB)) {
          return Number(valueA) - Number(valueB);
        }
        if (!valueA) valueA = '';
        if (!valueB) valueB = '';
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      },
    },
    paginationPageSize: 3,
    pagination: true,
  }
  sType: any
  typeData: any;
  TotalLcoAmount: any;
  BTNFormControl = new FormControl('');
  remainingChars: number = 117;
  plantypeSubject = new BehaviorSubject<{ displayKey: string; id: number }[]>([]);
  plantype$ = new BehaviorSubject<{ key: string, value: number }[]>([]);

  selectedaddproof_1: any;

  selectedAddProofType: string = '';
  selectedIDProofType: string = '';
  idproofid: any;
  removeProductList: any;
  removeProductList_expiryDate: any;
  removeProductList_refund: any;

  maskPattern: string = '';
  maxLength: number | undefined;
  exampleFormat: string | undefined;
  form!: FormGroup;

  id_proof_list: { [key: string]: number } = {};
  add_proof_list: { [key: string]: number } = {};

  newRefreshSmartcard: any;
  packageStatus: any;
  Smartcard_operatorid: any;
  operatname: any;
  servicename: any;
  cancel_current: any;
  basePackageId: any;
  isCancelCurrentVisible: boolean = false;
  subscriberdata: any;
  cancelSubRemark: any
  commentList: string[] = [
    'Package Wrongly Recharged To this card',
    'STB Physically Damaged',
    'Customer Shifted or Returned STB',
    'Customer TV Repaired',
    'Chane Base For Month'
  ];
  isPlanTypeSelected(): boolean {
    if (this.selectedRechargetype === '3') return true;
    if ((this.datetype && this.f_date)) return true;
    if (!!this.newpackagename && this.newpackagename !== '0') return true;
    // return !!this.newpackagename && this.newpackagename !== '0' && !!this.selectedRechargetype && this.selectedRechargetype !== '0' &&
    //   ((this.isplantype ) ||
    //     (this.datetype && this.f_date));
    return !!this.newpackagename && this.newpackagename != '0' && !!this.selectedRechargetype && this.selectedRechargetype != '0' &&
      ((this.isplantype && !!this.plantype && this.plantype != '0') ||
        (this.datetype && this.f_date));
  }

  isDateSelected(): boolean {
    return !!this.f_date || this.datetype;
  }
  get f(): { [key: string]: AbstractControl } {
    return this.Editform.controls;
  }
  @ViewChild(NavComponent) navComponent!: NavComponent;
  operatorIdValue: any = '';

  constructor(private router: Router, public dialogRef: MatDialogRef<SubscriberdialogueComponent>, private swal: SwalService,
    @Inject(MAT_DIALOG_DATA) public data: any, public userservice: BaseService, private cdr: ChangeDetectorRef, public storageService: StorageService, private fb: FormBuilder, private zone: NgZone) {
    console.log(data);
    this.subscriberdata = data;
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    console.log(this.role);
    this.newRefreshSmartcard = data.refresh;
    this.subid_1 = data.subId;
    this.newSubid = data.newsubid;
    this.sType = data?.type;
    this.pairBoxList = data['pairBoxlist'].map((item: any) => item);
    this.pairSmartcardList = data['pairSmartcardlist'].map((item: any) => item);
    this.packageMessage = data['packageMessage'];
    console.log('packagemessage', this.packageMessage);
    this.iscollected = this.subscriberdata?.detailsList?.iscollected;
    console.log('isCollected', this.iscollected);

    this.subSmartcard = data.subSmartcarList;
    this.subBoxid = data.subBoxList;
    this.pairedSmartcard = this.pairSmartcardList;
    this.pairedBoxid = this.pairBoxList;
    this.subscribername = data['detailsList'].customername;
    this.packageStatus = data['detailsList'].package_status;
    this.operatorid = data['detailsList'].operatorid;
    this.subid = data['detailsList'].subid;
    this.baseplan = data['detailsList'].baseplan;
    this.mobile = data['detailsList'].mobileno;
    this.Wallet = data['detailsList'].balance;
    this.password = data['detailsList'].password;
    this.islock = data['detailsList'].islock;
    this.boxstatus = data['detailsList'].boxstatus;
    this.subusername = data['detailsList'].username;
    this.subscribernameLast = data['detailsList'].customernamelast;
    this.casformid = data['detailsList'].casformid;
    this.dateofbirth = data['detailsList'].dateofbirth;
    this.fathername = data['detailsList'].fathername;
    this.lconame = data['detailsList'].operatorname;
    this.cardbalance = data['detailsList'].cardbalance;
    this.currentPackagename = data['detailsList'].smartpackagename;
    this.noOfDays = data['detailsList'].noofdays
    this.customerid = data['detailsList'].customerid ? data['detailsList'].customerid : 0;
    this.address = data['detailsList'].address;
    this.mobileno = data['detailsList'].mobileno;
    this.landlineno = data['detailsList'].landlineno;
    this.installaddress = data['detailsList'].installaddress;
    this.email = data['detailsList'].email;
    this.livetv = data['detailsList'].islivetv;
    this.addressproof = data['detailsList'].addressproof;
    this.addressprooftypeid = data['detailsList'].addressprooftypeid;
    this.idproof = data['detailsList'].idproof;
    this.idprooftypeid = data['detailsList'].idprooftypeid;
    this.areaid = data['detailsList'].areaid;
    this.streetid = data['detailsList'].streetid;
    this.areaname = data['detailsList'].areaname;
    this.streetname = data['detailsList'].streetname;
    this.statusSus = data['detailsList'].statusSus;
    this.smartcardno = data['detailsList'].smartcard;
    this.statusdisplay = data['detailsList'].statusdisplay;
    this.boxno = data['detailsList'].boxid;
    this.castype = data['detailsList'].castype;
    this.operatname = data['detailsList'].operatorname;
    // console.log(this.operatname);

    this.servicename = data['detailsList'].customername;
    this.basePackageId = data['detailsList'].packageid;
    if (this.boxno && this.smartcardno == 'No Smartcard') {
      this.box = false
      this.smart = true
    } else {
      this.smart = false;
      this.box = true
    }
    if (this.statusdisplay == 'Active' && this.packageStatus == 'Not Expired') {
      this.rechargeToggle = false;
    } else if (this.statusdisplay == 'Active' || this.statusdisplay == 'Deactive' && this.packageStatus == 'Expired') {
      this.rechargeToggle = true;
    }
    this.expirydate = data['detailsList'].expirydate;
    this.operatorname = data['detailsList'].operatorname;
    this.packagename = data['subdetaillist']?.[0]?.packagename;
    this.message = data['accountsList']?.msgcontent;
    this.status = data['detailsList'].status;
    this.oldpin = data['detailsList'].pinnumber;
    this.PVRstatus = data['detailsList'].pvrsupport;
    this.forcemsg = data['detailsList'].isdeleteforcemessage;
    this.islogindetails = data.islogindetails || false;
    this.isEditSubscriberDetails = data.isEditSubscriberDetails || false;
    this.isConfirmationReport = data.isConfirmationReport || false;
    this.isaddSmartcard = data.isaddSmartcard || false;
    this.ischangeoperator = data.ischangeoperator || false;
    this.ischange_lco = data.ischange_lco || false;
    this.Editform = this.fb.group(
      {
        id: this.subid_1 || this.newSubid,
        customername: ['', Validators.required],
        customerlastname: ['', Validators.required],
        dateofbirth: ['', [Validators.required]],
        address: ['', [Validators.required]],
        landlineno: ['', [Validators.required, Validators.pattern('^0\\d{8,10}$')]],
        islivetv: [false, [Validators.required]],
        casformid: ['', Validators.required],
        fathername: ['', [Validators.required]],
        mobileno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        installaddress: ['', [Validators.required]],
        // email: ['', [Validators.required, Validators.email]],
        email: ['', [Validators.required, Validators.email, this.customEmailValidator()]],
        addressproof: ['', [Validators.required]],
        areaid: [this.areaid, [Validators.required]],
        streetid: [this.streetid, [Validators.required]],
        idproof: ['', [Validators.required]],
        idprooftypeid: ['', Validators.required],
        addressprooftypeid: ['', Validators.required],
        // areaid: ['', Validators.required],
        // customerid: ['', Validators.required],
        role: this.role,
        username: this.username
      },
    )

    this.Sendmseform = this.fb.group({
      smartcard: [this.smartcardno, [Validators.required]],
      duration: [0, [Validators.required, Validators.min(1)]],
      timegap: [0, [Validators.required, Validators.min(1)]],
      repeatfor: [0, [Validators.required, Validators.min(1)]],
      forcemessage: [false, [Validators.requiredTrue]],
      message: ['', [Validators.required, Validators.minLength(3)]],
      role: [this.role],
      username: [this.username]
    });

    // this.onSubscriberStatusChange(this.operatorid);

    this.addsmartcardform == this.fb.group({
    })
    this.updateColumnDefs(this.sType);
  }


  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.packagenameList.filter((option: any) =>
      option.packagename.toLowerCase().includes(filterValue)
    );
  }
  ngOnDestroy(): void {
    ($('#smartcard') as any).select2('destroy');
    ($('#package') as any).select2('destroy');
    ($('#LCO') as any).select2('destroy');
    ($('#subscriber') as any).select2('destroy');
    ($('#Area') as any).select2('destroy');
    ($('#Street') as any).select2('destroy');
  }

  ngOnInit(): void {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];

    const tomorrowDate = new Date();
    tomorrowDate.setDate(currentDate.getDate() + 1); // Add 1 day

    this.tomorrow = tomorrowDate.toISOString().split('T')[0];
    $("#single").select2({
      placeholder: "Select a programming language",
      allowClear: true
    });
    this.filteredPackageList = this.filterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    const params = {
      api: this.gridApi
    };

    if (this.sType == 'smartcardchange') {
      this.onOperatorList();
      this.onSubscriberList();
    }
    else if (this.sType == 'cancelsubscription') {
      this.onCancelSubscription();
    }
    else if (this.sType == 'activation') {
      this.onPlanType();
      this.onAllBaselistByExceptDatasActivation();
      this.onPackageplanList()
    } else if (this.sType == 'BASE') {
      this.onPlanType();
      this.onAllBaselistByExceptDatas();
      this.onPackageplanList()
    } else if (this.sType == 'packagactivation') {
      this.onPlanType();
      this.onAllBaselistByExceptDatasActivation();
      this.onPackageplanList()
    } else if (this.sType == 'addSmartcard') {
      this.onCasList();
    } else if (this.sType == 'change_lco') {
      this.onOperatorList();
    } else if (this.sType == 'editDetails') {
      this.loadIdProofList();
      this.loadAddProofList();
      this.onoperatorchange1(this.operatorid);
      this.onAreaStatusChange1(this.areaid);
    }

    this.onGridReady(params);
    if (this.role == 'ROLE_OPERATOR') {
      console.log('ADFGHJKRTYUJKL ', this.role);
      this.operatorIdoperatorId();
      this.onPlanType();
    } else if (this.role == 'ROLE_SUBLCO') {
      console.log('ADFGHJKRTYUJKL ', this.role);
      this.subLCOdetails();
      this.onPlanType();
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      console.log('ADFGHJKRTYUJKL ', this.role);
      this.getSubscriberDetails();
      this.onPlanType();
    }

  }
  customEmailValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(in|com)$/;

      if (email && !emailPattern.test(email)) {
        return { invalidEmail: true };
      }
      return null;
    };
  }
  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      console.log(this.operatorId);
      this.isplan = this.lcoDeatails?.isplan;
      this.isdate = this.lcoDeatails?.isdate;
      this.isdateTodate = this.lcoDeatails?.isdatetodate;
      console.log('PLAN', this.isplan);
      console.log('DATE', this.isdate);
      console.log('DATE TO DATE', this.isdateTodate);
      this.onoperatorchange_LCO(this.operatorId);
    })
  }
  retailerId: any;
  subLCOdetails() {
    this.userservice.getSublcoDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      console.log('32423432432423423432');

      this.retailerId = this.lcoDeatails?.retailerid;
      this.operatorId = this.lcoDeatails?.retailerid;
      this.operatorname = this.lcoDeatails?.retailername;
      this.SublcopermissionObj = this.lcoDeatails?.permissionlist;
      console.log('dfdsfdsfjkhsdfkhdsjk', this.SublcopermissionObj);

      this.Subwallet = this.SublcopermissionObj?.wallet;
      this.sublcoDiscount = this.lcoDeatails?.sublcodiscount;
      this.isplan = this.SublcopermissionObj.plan;
      this.isdate = this.SublcopermissionObj.date;
      this.isdateTodate = this.SublcopermissionObj.datetodate;



      console.log('sublcoDiscount', this.sublcoDiscount);
      console.log('Subwallet', this.Subwallet);
      console.log('PLAN', this.isplan);
      console.log('DATE', this.isdate);
      console.log('DATE TO DATE', this.isdateTodate);

    })
  }
  sub_subscriberid: any;
  getSubscriberDetails() {
    this.userservice.getSubscriberDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.sub_subscriberid = this.lcoDeatails.subid;
      this.isplan = true;
      this.isdate = this.lcoDeatails.date;
      this.isdateTodate = this.lcoDeatails.datetodate;
      console.log('PLAN', this.isplan);
      console.log('DATE', this.isdate);
      console.log('DATE TO DATE', this.isdateTodate);
      console.log('ADDON ADD', this.subAddonAdd);
      console.log('ALACARTE', this.subAlacarte);
    })
  }
  onoperatorchange_LCO(operator: any): void {
    // this.selectedOperator = operator;
    // this.lcoid = operator.value;
    this.userservice.getAreaListByOperatorid(this.role, this.username, operator).subscribe((data: any) => {
      this.area_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredAreas = this.area_list;
      this.cdr.detectChanges();
    })
  }

  getAreaStatusChange_LCO(area: any): void {
    console.log(area);
    this.selectedArea = area;
    this.lcoareaid = area.value;
    this.userservice.getStreetListByAreaid(this.role, this.username, area).subscribe((data: any) => {
      this.street_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredStreet = this.street_list;
      console.log(this.filteredStreet);

      this.cdr.detectChanges();
    })
  }
  onAllBaselistByExceptDatasActivation() {
    this.userservice.getAllBaselistbyOperatorIdCastypeType(this.role, this.username, this.operatorid, this.castype, this.type)
      .subscribe((data) => {
        this.packagenameList = Object.entries(data).map(([name, id]) => ({
          packagename: name,
          packageid: id as number
        }));
        this.cdr.detectChanges();
        this.filteredPackagenameList = this.packagenameList;
      });
  }
  onAllBaselistByExceptDatas() {
    this.userservice.getAllBaselistByExceptPackId(this.role, this.username, this.operatorid, this.castype, this.type, this.basePackageId)
      .subscribe((data) => {
        this.packagenameList = Object.entries(data).map(([name, id]) => ({
          packagename: name,
          packageid: id as number
        }));
        this.cdr.detectChanges();
        this.filteredPackagenameList = this.packagenameList;
      });
  }
  onCasList() {
    this.userservice.getActiveCasList(this.role, this.username).subscribe((data: any) => {
      let v = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      this.cas = v
      this.cdr.detectChanges();
    });
  }
  onOperatorList() {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      this.lco_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredOperators = this.lco_list;


      this.cdr.detectChanges;
    })
  }
  onPlanType() {
    console.log(this.sType);
    this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      if (this.role != 'ROLE_OPERATOR' && this.role != 'ROLE_SUBLCO' && this.role != 'ROLE_SUBSCRIBER') {
        this.rechargetype = Object.keys(data).map(key => {
          const id = data[key];
          const name = key.replace(/\(\d+\)$/, '').trim();
          return { name: name, id: id };
        });
      } else if (this.role == 'ROLE_OPERATOR' || this.role == 'ROLE_SUBLCO') {
        console.log('123456789rfrd1234567', this.role);
        const rawList = Object.keys(data).map(key => {
          const id = data[key];
          const name = key.replace(/\(\d+\)$/, '').trim();
          return { name, id };
        });

        this.rechargetype = rawList.filter(item => {
          const name = item.name.toLowerCase();
          if (name === 'plan' && this.isplan) return true;
          if (name === 'date' && this.isdate) return true;
          if (name === 'date-to-date' && this.isdateTodate) return true;
          return false;
        });
      } else if (this.role == 'ROLE_SUBSCRIBER') {
        console.log('1234567890', this.role);
        const rawList = Object.keys(data).map(key => {
          const id = data[key];
          const name = key.replace(/\(\d+\)$/, '').trim();
          return { name, id };
        });
        console.log(rawList);
        this.rechargetype = rawList.filter(item => {
          const name = item.name.toLowerCase();
          if (name === 'plan' && this.isplan) return true;
          if (name === 'date' && this.isdate) return true;
          if (name === 'date-to-date' && this.isdateTodate) return true;
          return false;
        });
      }

      console.log(this.rechargetype);
    })
  }

  onPlanType1() {
    console.log(this.sType);

    this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      this.rechargetype = Object.keys(data).map(key => {
        const id = data[key];
        const name = key.replace(/\(\d+\)$/, '').trim();
        return { name: name, id: id };
      });
    })
  }
  onPackageplanList() {
    this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      const sortedData = Object.entries(data)
        .map(([key, value]) => ({
          key: key.replace(/\(\d+\)/, '').trim(),
          value: value as number
        }))
      this.plantype$.next(sortedData);
    });
  }
  onSubscriberList() {
    this.userservice.getSubscriberIdListByOperatorid(this.role, this.username, this.operatorid).subscribe((data: any) => {
      this.sub_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredSub = this.sub_list;
    })
  }
  onCancelSubscription() {
    this.userservice.cancelSubscriptionOfSmartcardDetails(this.role, this.username, this.smartcardno).subscribe((data: any) => {
      this.TotalLcoAmount = data.totallcoamount;
      this.rowData1 = data.cancelproduct;
      this.cdr.detectChanges();
    })
  }

  ngAfterViewInit() {
    $('#smartcard').select2({
      placeholder: 'Select a Smartcard',
      allowClear: true
    });
    $('#smartcard').on('change', (event: any) => {
      this.smartcard = event.target.value;
      this.onSmartcardList(this.smartcard);
    });
    $('#package').select2({
      placeholder: 'Select a Package Name',
      allowClear: true
    });
    $('#package').on('change', (event: any) => {
      this.newpackagename = event.target.value;
      this.onSelectionrechargetype(event);
    });
    $('#lco').select2({
      placeholder: 'Select a Operator',
      allowClear: true
    });
    $('#lco').on('change', (event: any) => {
      this.lcoid = event.target.value;
      console.log(this.lcoid);

      this.onSubscriberStatusChange(event);
    });
    $('#subscriber').select2({
      placeholder: 'Select a Subscriber',
      allowClear: true
    });
    $('#subscriber').on('change', (event: any) => {
      this.subid = event.target.value;
      console.log(this.subid);

      this.onsublist(this.subid);
    });

    $('#Area').select2({
      placeholder: 'Select Area',
      allowClear: true
    });
    $('#Area').on('change', (event: any) => {
      this.areaid = event.target.value;
      console.log(this.areaid);
      this.onAreaStatusChange1(this.areaid);
      console.log('AREA', this.areaid);
    });
    $('#Street').select2({
      placeholder: 'Select Street',
      allowClear: true
    });
    // $('#Street').on('change', (event: any) => {
    //   this.streetid = event.target.value;
    //   console.log(this.streetid);
    //   this.onStreetStatusChange1(this.streetid);
    //   console.log('Street', this.streetid);
    // });

    $('#Street').on('select2:open', () => {
      console.log('111');
      setTimeout(() => {
        $('.select2-results__option').on('mouseup', (e: any) => {
          const selectedValue = $(e.target).attr('id')?.replace('select2-Street-result-', '');
          this.streetid = selectedValue;
          console.log('Forced select:', this.streetid);
          this.onStreetStatusChange1(this.streetid);
        });
      });
    });
  }
  loadIdProofList(): void {
    this.userservice.getIdProofList(this.role, this.username).subscribe(
      (data: any) => {
        this.id_proof_list = data.idprooftypeid;
        console.log('idproof list', this.id_proof_list);

        this.id_proof_array = Object.entries(this.add_proof_list).map(([key, value]) => ({
          key,
          value
        }));
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching ID Proof List', error);
      }
    );
  }
  loadAddProofList(): void {
    this.userservice.getAddresProofList(this.role, this.username).subscribe(
      (data: any) => {
        this.add_proof_list = data.addressprooftypeid;
        this.add_proof_array = Object.entries(this.add_proof_list).map(([key, value]) => ({
          key,
          value
        }));
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching ID Proof List', error);
      }
    );
  }
  filteredIdProofKeys(): string[] {
    return Object.keys(this.id_proof_list);
  }
  filteredADDProofKeys(): string[] {
    return Object.keys(this.add_proof_list);
  }
  onAddProofChange(event: any): void {
    const selectedValue = event.target.value;
    this.selectedAddProofType = selectedValue.replace(/\(\d+\)/, '').trim();
    this.form.get('addressproof')?.reset();
    this.applyValidators(this.selectedAddProofType, 'addressproof');
    const addressProofValue = this.form.get('addressproof')?.value;
    if (addressProofValue && this.selectedAddProofType === this.selectedIDProofType) {
      this.form.get('idproof')?.setValue(addressProofValue);
      this.idproofid = addressProofValue;
    }
  }

  onIDProofChange(event: any): void {
    const selectedValue = event.target.value;
    this.selectedIDProofType = selectedValue.replace(/\(\d+\)/, '').trim();
    this.form.get('idproof')?.reset();
    this.applyValidators(this.selectedIDProofType, 'idproof');
    const addressProofValue = this.form.get('addressproof')?.value;
    if (addressProofValue && this.selectedIDProofType === this.selectedAddProofType) {
      this.form.get('idproof')?.setValue(addressProofValue);
      this.idproofid = addressProofValue;
    }
  }
  getMaxLength(proofType: any) {
    switch (proofType) {
      case 'Aadhaar Card':
        return 12;
      case 'Voter Id':
        return 10;
      case 'Ration Card':
        return 10;
      case 'Driving Licence':
        return 13;
      case 'Passport':
        return 8;
      case 'No Proof':
        return 1;
      default:
        return 20;
    }
  }
  getPattern(proofType: string): string {
    switch (proofType) {
      case 'Aadhaar Card':
        return '\\d{12}';
      case 'Voter Id':
        return '[A-Z]{3}\\d{7}';
      case 'Ration Card':
        return '\\d{2}[A-Z]\\d{7}';
      case 'Driving Licence':
        return '[A-Z]{2}\\d{11}';
      case 'Passport':
        return '[A-PR-WYa-pr-wy][1-9]\\d{4}[1-9]';
      case 'No Proof':
        return '0';
      default:
        return '.*';
    }
  }

  getExampleFormat(proofType: string): string {
    switch (proofType) {
      case 'Aadhaar Card':
        return '123456789123';
      case 'Voter Id':
        return 'ABC1234567';
      case 'Ration Card':
        return '12A3456789';
      case 'Driving Licence':
        return 'DL123456789012';
      case 'Passport':
        return 'A1234567';
      case 'No Proof':
        return '0';
      default:
        return '';
    }
  }
  applyValidators(proofType: string, controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.clearValidators();

      switch (proofType) {
        case 'Aadhaar Card':
          this.maskPattern = '000000000000';
          this.maxLength = 12; // Includes spaces
          this.exampleFormat = '123456789123';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^\d{12}$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'Voter Id':
          this.maskPattern = 'AAA0000000';
          this.maxLength = 10;
          this.exampleFormat = 'ABC1234567';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^[A-Z]{3}\d{7}$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'Ration Card':
          this.maskPattern = '00A0000000';
          this.maxLength = 10;
          this.exampleFormat = '12A3456789';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^\d{2}[A-Z]\d{7}$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'Address proof':
          this.maskPattern = '00A00000000';
          this.maxLength = 11;
          this.exampleFormat = '12A3456789';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^\d{2}[A-Z]\d{7}$/),
            Validators.maxLength(this.maxLength),
            this.validateAddressProof
          ]);
          break;



        case 'Driving Licence':
          this.maskPattern = 'AA00000000000';
          this.maxLength = 13;
          this.exampleFormat = 'DL123456789012';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^[A-Z]{2}\d{11}$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'Passport':
          this.maskPattern = 'A0000000';
          this.maxLength = 8;
          this.exampleFormat = 'A1234567';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^[A-PR-WYa-pr-wy][1-9]\d{4}[1-9]$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'No Proof':
          this.maskPattern = '';
          this.maxLength = 1;
          this.exampleFormat = '0';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^0$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        default:
          this.maskPattern = '';
          this.maxLength = undefined;
          this.exampleFormat = undefined;
          control.setValidators([Validators.required]);
          break;
      }

      control.updateValueAndValidity();
    }
  }
  validateAddressProof(control: AbstractControl): { [key: string]: boolean } | null {
    const ebBillPattern = /^EB\d{9}$/;
    const gasBillPattern = /^GAS\d{8}$/;
    const value = control.value;
    if (ebBillPattern.test(value) || gasBillPattern.test(value)) {
      return { invalidAddressProof: true };
    }
    return null;
  }
  private updateColumnDefs(stype: string): void {
    if (stype === 'remove') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false, headerCheckboxSelection: true, checkboxSelection: true },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
        { headerName: 'PACKAGE TYPE', field: 'producttypename', width: 200 },
        { headerName: 'REFUND AMOUNT', field: 'refundproductrate', width: 200 },
        { headerName: 'DAYS', field: 'days', width: 250 },
      ];
    } else if (stype === 'cancelsubscription') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
        { headerName: 'PACKAGE TYPE', field: 'producttypename', width: 250 },
        // {
        //   headerName: 'REFUND AMOUNT', field: 'refundproductrate', width: 200, valueFormatter: (params: any) => {
        //     return params.value ? params.value.toFixed(2) : '';
        //   }
        // },
        {
          headerName: 'REFUND AMOUNT', field: 'refundproductrate', width: 200,
          valueFormatter: (params: any) => {
            const value = params.value;
            return value !== undefined && value !== null ? value.toFixed(2) : '0.00';
          }
        },
        { headerName: 'DAYS', field: 'days', width: 200 },
      ];
    } else if (stype === 'addon') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false, headerCheckboxSelection: true, checkboxSelection: true },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
        { headerName: 'BROADCASTER NAME', field: 'broadcastername', width: 200 },
        { headerName: 'CAS PRODUCT ID', field: 'casproductid', width: 200 },
        { headerName: 'CUSTOMER AMOUNT', field: 'customeramount', width: 240, filter: false }
      ];
    } else if (stype === 'alacarte') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80, filter: false, headerCheckboxSelection: true, checkboxSelection: true },
        { headerName: 'PACKAGE NAME', field: 'channel_name', width: 200, cellStyle: { textAlign: 'left' }, },
        { headerName: 'CAS PRODUCT ID', field: 'casproductid', width: 200 },
        { headerName: 'BROADCASTER NAME', field: 'broadcastername', width: 210 },
        { headerName: 'CUSTOMER AMOUNT', field: 'customeramount', width: 250, filter: false },
      ];
    }
  }

  columnDefs1: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100,
    },
    {
      headerName: 'SELECTED PACKAGES',
      field: 'channel_name', width: 350,
    },
  ]
  columnDefs2: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100,
    },
    {
      headerName: 'SELECTED PACKAGES',
      field: 'productname', width: 330,
    },
  ]



  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    if (this.sType === 'addon') {
      this.userservice.getAddonpackageDetails(this.role, this.username, this.smartcardno).subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            this.cdr.detectChanges();
            // Swal.fire('Success', 'Data updated successfully!', 'success');
          } else if (response.status === 204) {
            Swal.fire('No Content', 'No data available for the given criteria.', 'info');
          }
        },
        (error) => {
          if (error.status === 400) {
            Swal.fire(error?.error?.message || error?.error?.addonlist || 'Error 400', 'Bad Request. Please check the input.', 'error');
          } else if (error.status === 500) {
            Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        }

      );
    } else if (this.sType === 'alacarte') {
      this.userservice.getAlacarteDetails(this.role, this.username, this.smartcardno).subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            this.cdr.detectChanges();
            // Swal.fire('Success', 'Data updated successfully!', 'success');
          } else if (response.status === 204) {
            Swal.fire('No Content', 'No data available for the given criteria.', 'info');
          }
        },
        (error) => {
          if (error.status === 400) {
            Swal.fire(error?.error?.message || error?.error?.addonlist || 'Error 400', 'Bad Request. Please check the input.', 'error');
          } else if (error.status === 500) {
            Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        }
      );

    } else if (this.sType === 'remove') {
      this.userservice.removeProductDetails(this.role, this.username, this.smartcardno).subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            this.cdr.detectChanges();
            // Swal.fire('Success', 'Data updated successfully!', 'success');
          } else if (response.status === 204) {
            Swal.fire('No Content', 'No data available for the given criteria.', 'info');
          }
        },
        (error) => {
          if (error.status === 400) {
            Swal.fire(error?.error?.message || error?.error?.addonlist || 'Error 400', 'Bad Request. Please check the input.', 'error');
          } else if (error.status === 500) {
            Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        }
      );

    }
  }

  // updateRemainingChars(event: Event) {
  //   this.cdr.detectChanges();
  //   const input = event.target as HTMLTextAreaElement;
  //   const maxLength = input.maxLength;
  //   const currentLength = input.value.length;
  //   this.remainingChars = maxLength - currentLength;
  // }



  onSelectionChanged() {
    console.log('calling');

    if (this.gridApi) {
      console.log('gripd api is not null');

      const selectedRows = this.gridApi.getSelectedRows();
      console.log(selectedRows.length);

      this.isAnyRowSelected = selectedRows.length > 0 ? true : false;
      // if (this.finalrow.length > 0) {
      //   this.rows = this.finalrow;
      // } else {
      //   this.rows = selectedRows;
      // }
      this.rows = selectedRows;
      this.isaddaddon = false;
      this.isaddalacarte = false;
      this.isRemove = false;
      // if (this.addonconfirmation && this.isAnyRowSelected) {
      //   this.isaddaddon = true;
      // } else {
      //   this.isaddaddon = false;
      // }
      // if (this.alacarteconfirmation && this.isAnyRowSelected) {
      //   this.isaddalacarte = true;
      // } else {
      //   this.isaddalacarte = false;
      // }

      // if (this.removeproduct && this.isAnyRowSelected) {
      //   this.isRemove = true;
      // } else {
      //   this.isRemove = false;
      // }
    }

  }
  filteredIntendArea(): any[] {
    if (!this.searchTerm) {
      return this.area;
    }
    return this.area.filter((area: any) =>
      area.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onNoClick(): void {
    this.dialogRef.close(this.returndata);
  }
  getDialogConfirmation() {
    this.addonconfirmation = false;
    this.alacarteconfirmation = false;
    this.removeproduct = false;
    this.isaddaddon = false;
    this.isaddalacarte = false;
    this.isRemove = false;
  }
  onSelectionplantype(selectedValue: string) {
    console.log('selectrdvalue', selectedValue);

    if (selectedValue) {
      this.isplantype = true;
      // this.datetype = false;
    }
  }
  onSelectionrechargetype(selectedValue: string) {
    console.log('selectedValue', selectedValue);
    const rechargetype = Number(selectedValue);
    console.log(rechargetype);
    this.cdr.detectChanges();
    if (rechargetype == 1) {
      this.isplantype = true;
      this.cdr.detectChanges();
      this.datetype = false;
      const defaultPlan = this.plantype$.getValue().find(plan => plan.key === '1month');
      if (defaultPlan) {
        this.plantype = defaultPlan.value;
      }
    }
    if (rechargetype == 2) {
      this.isplantype = false;
      this.datetype = true;
    }
    if (rechargetype == 3) {
      this.datetype = false;
      this.isplantype = false;
    }
    if (this.selectedRechargetype == '2') {
      this.plantype = 0
    }
    if (this.selectedRechargetype == '1') {
      this.f_date = null
    }
    if (this.selectedRechargetype == '3') {
      this.f_date = ''
    }
    if (this.newpackagename != 0) {
      if ((this.selectedRechargetype == '3') || (this.selectedRechargetype == '2') || (this.selectedRechargetype != '3' && this.plantype != 0) || (this.f_date)) {
        this.isDisabled = false
      } else {
        this.isDisabled = true;
      }

    }
    // } else {
    //   this.isDisabled = true
    // }
  }
  loginDetails() {
    this.swal.Loading();
    this.userservice.updatelogindetails(this.role, this.username, this.subid, this.islock, this.password).subscribe(
      (res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });

  }


  addSmartcard() {
    this.submitted = true
    if (!this.smartcard && !this.boxid) {
      return
    }
    Swal.fire({
      title: 'Adding...',
      text: 'Please wait Smartcard Added.',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.addSmartcardToSubscriber(this.role, this.username, this.operatorid, this.castypeSmartcard, this.smartcard, this.boxid, this.subid_1 || this.newSubid).subscribe(
      (res: any) => {
        this.returndata = res;
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }


  onSubmit() {
    // if (this.Editform.invalid) {
    //   this.Editform.markAllAsTouched();
    //   return;
    // }
    console.log(this.Editform.value);

    this.swal.Loading();
    this.userservice.UpdateSubscriberDetails(this.Editform.value)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error?.customername || err?.error?.customerlastname || err?.error?.fathername || err?.error?.idproof || err?.error?.idprooftypeid
          || err?.error?.addressproof || err?.error?.addressprooftypeid || err?.error?.customername || err?.error?.dateofbirth || err?.error?.email
          || err?.error?.installaddress || err?.error?.mobileno
        );
      });
    console.log('222');

  }


  recharge() { }
  submit() { }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onKeydown_landline(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '-', 'Delete'];
    const key = event.key;

    // Allow digits (0-9), hyphen, and control keys
    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  }

  casTypelist(event: any) {
    const target = event.target as HTMLSelectElement;
    const castype = target.value;
    this.cdr.detectChanges;
    this.userservice.getNotallocatedSmartcardListByCastypeAndOperatorid(this.role, this.username, this.operatorid || 0, castype)
      .subscribe((data: any) => {
        if (data && Object.keys(data).length > 0) {
          this.area = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
          this.filteredSmartcard = this.area;
          console.log(this.filteredSmartcard);

        } else {
          this.area = [];
          Swal.fire({
            icon: 'warning',
            title: 'No Smartcards Available',
            text: data?.message || 'No smartcards found for the selected CAS type.',
            confirmButtonText: 'OK',
            // timer: 2000,
            // timerProgressBar: true,
            // showConfirmButton: false
          });

          this.cdr.detectChanges;
        }
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Failed to fetch smartcard list. Please try again later.',
          confirmButtonText: 'OK',
          // timer: 2000,
          // timerProgressBar: true,
          // showConfirmButton: false
        });
      });

  }


  onSearchChange(event: any) {
    this.searchTerm = event.target.value;;
  }

  filteredLcoKeys(): string[] {
    const keys = Object.keys(this.cas);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  onSubscriberStatusChange(operator: any): void {
    console.log('OPERATOR', operator);

    // this.servicename = '';
    this.operatname = operator.name;
    this.selectedOperator = operator;
    this.operatorid = operator.value;
    console.log('lcoid', this.lcoid);

    // this.f_subid = '';
    this.selectedSub = null;
    this.filteredSub = [];
    this.servicename = '';
    this.cdr.detectChanges();
    // this.userservice.getSubscriberIdListByOperatorid(this.role, this.username, this.operatorid).subscribe((data: any) => {
    this.userservice.getSubscriberIdListByOperatorid(this.role, this.username, this.lcoid).subscribe((data: any) => {
      this.sub_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredSub = this.sub_list;
      console.log('filteredSub', this.filteredSub);

    })

  }



  onoperatorchange(operator: any): void {
    this.selectedOperator = operator;
    this.lcoid = operator.value;
    this.userservice.getAreaListByOperatorid(this.role, this.username, this.lcoid || this.operatorId).subscribe((data: any) => {
      this.area_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredAreas = this.area_list;
      this.cdr.detectChanges();
    })
  }
  onoperatorchange1(operator: any): void {
    this.selectedOperator = operator;
    this.lcoid = operator.value;
    this.userservice.getAreaListByOperatorid(this.role, this.username, this.selectedOperator || this.lcoid || this.operatorId).subscribe((data: any) => {
      this.area_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredAreas = this.area_list;
      this.cdr.detectChanges();
    })
  }
  onAreaStatusChange(area: any): void {
    this.selectedArea = area;
    this.lcoareaid = area.value;
    this.userservice.getStreetListByAreaid(this.role, this.username, this.lcoareaid).subscribe((data: any) => {
      this.street_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredStreet = this.street_list;
      this.cdr.detectChanges();
    })
  }

  onStreetStatusChange(street: any) {
    this.selectedStreet = street;
    this.streetid = street.value;
    this.cdr.detectChanges();
  }
  onAreaStatusChange1(area: any): void {
    console.log('selecterd Area', area);
    this.userservice.getStreetListByAreaid(this.role, this.username, area).subscribe((data: any) => {
      this.street_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredStreet = this.street_list;
    })
  }
onStreetStatusChange1(street: any): void {
    console.log(this.streetid);
    const match = street.match(/-(\d+)$/);
    this.streetid = match ? match[1] : null;
    console.log(this.streetid); // 24
    // this.selectedStreet = street;
    // this.streetid = street;
    this.cdr.detectChanges();
  }
  onsublist(sub: any): void {
    // this.f_subid = '';
    this.servicename = sub.name;
    console.log(sub);
    this.subid = sub;
    console.log('subid', this.subid);
    this.cdr.detectChanges();
  }
  filterOperators(event: any): void {
    console.log('event', event);

    // const filterValue = event.target.value.toLowerCase();
    const filterValue = event;
    this.cdr.detectChanges;
    this.filteredOperators = this.lco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);

  }


  filterSmartcard(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.cdr.detectChanges;
    this.filteredSmartcard = this.area.filter((item: any) =>
      item.name.toLowerCase().includes(filterValue)
    );
  }

  filterAreas(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredAreas = this.area_list.filter(area =>
      area.name.toLowerCase().includes(filterValue)
    );

  }
  filterStreet(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredStreet = this.street_list.filter(street =>
      street.name.toLowerCase().includes(filterValue)
    );
  }
  filterSub(event: any): void {
    console.log(event);

    const filterValue = event.target.value.toLowerCase();
    this.filteredSub = this.sub_list.filter(sub =>
      sub.name.toLowerCase().includes(filterValue)
    );
  }
  onInputFocus(): void {
    this.showOperators = true;
  }
  onInputBlur(): void {
    setTimeout(() => {
      this.showOperators = false;
    }, 200);
  }
  onSmartcardList(smartcard: any): void {
    console.log(smartcard);
    this.selectedSmartcard = smartcard;
    // this.smartcard = smartcard.name;
    this.smartcard = smartcard;
    this.userservice.getBoxidBySmartcard(this.role, this.username, this.smartcard)
      .subscribe((data: any) => {
        this.boxid = data.boxid;
        this.cdr.detectChanges();
        let boxidElement: any = document.getElementById("boxid");
        if (boxidElement) {
          boxidElement.value = data;
        }
        // this.swal.success(data?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  onSubscriberPackagename(selectedOperator: any) {
    const operatorString = selectedOperator;
    const lastSpaceIndex = operatorString.lastIndexOf(' ');
    const idMatch = operatorString.match(/\((\d+)\)/);
    this.newpackagename = idMatch ? idMatch[1] : null;
    this.selectedPackageName = selectedOperator;
    this.cdr.detectChanges;
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  displayArea(area: any): string {
    return area ? area.name : '';
  }
  displayStreet(street: any): string {
    return street ? street.name : '';
  }
  displaySub(sub: any): string {
    return sub ? sub.name : '';
  }
  smartcardlist(event: Event) {
    const target = event.target as HTMLSelectElement;
    const smartcard = target.value;
    this.userservice.getBoxidBySmartcard(this.role, this.username, smartcard).subscribe((data: any) => {
      this.boxid = data;
      let boxidElement: any = document.getElementById("boxid");
      if (boxidElement) {
        boxidElement.value = data;
      }
    }, (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.error?.message || 'Failed to fetch box ID. Please try again later.',
        confirmButtonText: 'OK'
      });
    });
  }

  changeOperator() {
    this.swal.Loading();
    // if ((!this.lcoid || this.operatorId) || !this.lcoareaid || !this.lcostreetid) {
    //   this.swal.Error('All fields are required');
    //   return;
    // }
    this.userservice.transferLcoToSmartcard(this.role, this.username, (this.lcoid || this.operatorId), this.lcoareaid, this.lcostreetid, this.subid_1 || this.newSubid, this.withsubscription, this.retailerId || 0, 2, 0, 0, 1, this.comment || 'No Comment')
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  refreshSmartcard() {
    this.swal.Loading();
    this.userservice.refreshSmartcard(this.role, this.username, this.smartcardno || this.newRefreshSmartcard.smartcard, this.retailerId || 0, 3)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          // location.reload();
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]).then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 100);
          });
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });

        });
        // this.dialogRef.close({ success: true });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  deactivationofSmartcard() {
    this.swal.Loading();
    this.userservice.deactivationofSmartcard(this.role, this.username, this.smartcardno, 2)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  pinchange() {
    if (!this.newpin) {
      this.errorMessage = 'please Entered the Pin !!';
      return;
    }
    this.swal.Loading();
    this.userservice.pinchange(this.role, this.username, this.smartcardno, this.newpin, 3, this.retailerId || 0)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  pvrchange() {
    this.swal.Loading();
    this.userservice.pvrChange(this.role, this.username, this.smartcardno, this.PVRstatus, 3, this.retailerId || 0)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  deleteForceMessage() {
    this.swal.Loading();
    this.userservice.deleteForceMessage(this.role, this.username, this.smartcardno)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  forcetuning() {
    this.swal.Loading();
    this.userservice.forceTuning(this.role, this.username, this.smartcardno)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  onBoxIdInputChange() {
    this.errorMessage = '';
    this.errorMessage1 = '';
  }

  sendMessage() {
    this.Sendmseform.markAllAsTouched();
    const formValues = this.Sendmseform.value;
    console.log('formvalues', formValues);
    console.log('message', formValues.message);

    const payload = {
      smartcard: formValues.smartcard,
      duration: formValues.duration || 0,
      timegap: formValues.timegap || 0,
      repeatfor: formValues.repeatfor || 0,
      forcemessage: formValues.forcemessage || false,
      message: formValues.message,
      role: formValues.role,
      username: formValues.username
    };
    this.swal.Loading();
    this.userservice.sendMessage(payload)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  toggleConfirmation() {
    this.confirmation = !this.confirmation;
  }
  paidamount: any;
  onBillTypeChange() {
    this.billtype = this.billtype ? 1 : 0;
    console.log(this.iscollected);
    this.paidamount = this.iscollected ? this.customerPayAmount : 0;
    console.log(this.paidamount);
    console.log(this.iscollected);

  }
  onFirstTimeActivationButtonClick(): void {
    this.getFirstTimeActivationConfirmation();
    this.toggleConfirmation();
  }
  onChangeBaseActivationButtonClick(): void {
    this.baseChangeofSmartcardPackage();
    this.toggleConfirmation();
  }
  onChangeBaseActivationClick(): void {
    this.baseChangeofSmartcardPackage();
  }
  onFirstTimeActivationClick(): void {
    this.getFirstTimeActivationConfirmation();
  }

  onActivationButtonClick(): void {
    this.toggleConfirmation();
    this.getFirstTimeActivationConfirmation();
  }

  onActivationClick(): void {
    this.getFirstTimeActivationConfirmation();
  }

  onAddonConfirmation(): void {
    this.addAddonConfirmation();
    this.toggleAddonConfirmation();
  }
  onAddon(): void {
    this.addAddonConfirmation();
  }
  onAlacarteConfirmation(): void {
    this.addAlacarteConfirmation();
    this.toggleAlacarteConfirmation();
  }
  onAlacarte(): void {
    this.addAlacarteConfirmation();
  }
  onRemoveConfirmation(): void {
    // this.toggleRemoveConfirmation();
    this.removeProductConfirmation();
  }
  onRemove(): void {
    this.removeProductConfirmation();
  }


  ActivationOfCard() {
    let requestBody = {
      packageid: this.newpackagename,
      plantype: this.selectedRechargetype,
      plan: this.plantype || this.f_date || 0,
      billtype: this.billTypeValue?.bill_type || 0,
      dueamt: this.First_list.customerPayAmount,
      // paidamount: this.paidamount || this.collectedPayAmount || 0,
      paidamt: this.paidamount || this.collectedPayAmount || 0,
      retailerid: this.retailerId || 0,
      smartcard: this.smartcardno,
      type: 1,
      comments: this.comment,
      android_id: 0,
      device_id: 0,
      ui_type: 1,
      iscollected: this.iscollected,
      role: this.role,
      username: this.username,
    }
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we activate the card.',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.ActivationOfCard(requestBody).
      subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  customerAmount: any;
  baseChangeofSmartcardPackage() {
    this.isActive = true;
    let plan = this.selectedRechargetype || ''
    let plandata = this.plantype || this.f_date || 4
    // this.swal.Loading();
    this.userservice.getBaseChangeConfirmation(this.role, this.username, this.newpackagename, plan, plandata, this.smartcardno, 8, this.retailerId || 0)
      .subscribe((data: any) => {
        this.changebase = data;
        this.changebase_msoAmount = data.msoAmount;
        // this.customerPayAmount = data.msoAmount;
        this.changebase_totalRefundToLco = data.totalRefundToLco;
        this.changebase_expiryDate = data.expiryDate;
        this.customerAmount = this.changebase?.customerPayAmount
        this.customerPayAmount = this.changebase?.customerPayAmount;
        this.excessAmount = this.changebase?.balance;
        this.oldexcessAmount = this.changebase?.billbalance;
        console.log(this.customerPayAmount);
        console.log(this.subBalance);
        console.log(this.collectedPayAmount);
        this.balanceamount = this.customerPayAmount - this.collectedPayAmount;
        // this.newExcessAmount = this.oldexcessAmount - this.balanceamount;
        this.newExcessAmount = this.oldexcessAmount + this.balanceamount;
        this.setBillType(this.customerPayAmount, this.collectedPayAmount);
        console.log(this.excessAmount);
        console.log(this.balanceamount);
        console.log(this.newExcessAmount);
        this.cdr.detectChanges();
        // this.isActive = true;
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  get formattedBalanceAmount(): string {
    return this.balanceamount?.toFixed(2);
  }

  comment: any = 'No Comment';
  baseChangeofSmartcardPackageActivate() {
    let plandata = this.plantype || this.f_date || 4
    console.log(plandata);
    console.log(this.billTypeValue?.bill_type);
    console.log('customerPayAmount', this.changebase?.customerPayAmount);

    this.isActive = true;
    this.confirmation = true;
    this.isConfirmationComplete = true;
    let requestBody = {
      role: this.role,
      username: this.username,
      packageid: this.newpackagename,
      plantype: this.selectedRechargetype,
      plan: plandata,
      // paidamt: this.changebase?.customerPayAmount,
      billtype: this.billTypeValue?.bill_type || 0,
      dueamt: this.changebase?.customerPayAmount || 0,
      paidamt: this.paidamount || this.collectedPayAmount || 0,
      smartcard: this.smartcardno,
      type: 8,
      retailerid: this.retailerId || 0,
      iscollected: this.iscollected,
      comments: this.comment,
      android_id: 0,
      device_id: 0,
      ui_type: 1,
    }
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false, // Disable clicking outside the popup to close it
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.baseChangeofSmartcardPackage(requestBody).subscribe((res: any) => {
      // this.swal.success(res?.message);
      Swal.fire({
        title: 'Success!',
        text: res.message,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
        this.dialogRef.close({ success: true, smartcard: this.smartcardno });
      });
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  subBalance: any;
  getFirstTimeActivationConfirmation() {
    // this.swal.Loading();
    console.log('2423423423432423432432432432');

    this.isActive = true;
    console.log(this.f_date);
    console.log(this.plantype);
    console.log(this.retailerId);

    this.userservice.getFirstTimeActivationConfirmation(this.role, this.username, this.newpackagename, this.selectedRechargetype, this.f_date || this.plantype || 4, this.smartcardno, 1, this.retailerId || 0)
      .subscribe((data: any) => {
        this.First_list = data;
        this.customerPayAmount = this.First_list?.customerPayAmount;
        console.log(this.customerPayAmount);
        this.excessAmount = this.First_list?.balance;
        this.oldexcessAmount = this.First_list?.billbalance;
        this.balanceamount = this.customerPayAmount - this.collectedPayAmount;
        // this.newExcessAmount = this.oldexcessAmount - this.balanceamount;
        this.newExcessAmount = this.oldexcessAmount + this.balanceamount;
        this.setBillType(this.customerPayAmount, this.collectedPayAmount);
        // this.swal.success_1(data?.message);
        this.cdr.detectChanges();

      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error?.getFirstTimeActivationConfirmation.plan);
      });
    // this.cdr.detectChanges();
  }

  firsttimeActivationOfCard() {
    console.log('213213213');
    console.log(this.billTypeValue?.bill_type);
    console.log('collectedPayAmount', this.collectedPayAmount);

    console.log(this.plantype);
    // this.plantype || this.f_date || 4,
    this.confirmation = true;
    this.finalrow = this.rows
    this.isConfirmationComplete = true;
    let requestBody = {
      packageid: this.newpackagename,
      plantype: this.selectedRechargetype,
      plan: this.plantype || this.f_date || 4,
      billtype: this.billTypeValue?.bill_type || 0,
      dueamt: this.First_list.customerPayAmount,
      // paidamount: this.paidamount || this.collectedPayAmount || 0,
      paidamt: this.paidamount || this.collectedPayAmount || 0,
      retailerid: this.retailerId || 0,
      smartcard: this.smartcardno,
      type: 1,
      comments: this.comment,
      android_id: 0,
      device_id: 0,
      ui_type: 1,
      iscollected: this.iscollected,
      role: this.role,
      username: this.username,
    }
    this.swal.Loading();
    this.userservice.firsttimeActivationOfCard(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
          // location.reload();
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  lcotransferSinglesmartcard() {
    // Validate that both fields are selected
    // if (this.operatname || this.lcoid === 0) {
    //   this.errorMessage = 'Please Select LCO Name!';
    // } else if ( this.servicename || this.f_subid === 0) {
    //   this.errorMessage1 = 'Please Select Subscriber Name!';
    // } else {
    let isFirstCall = true;
    let subscriptionId: string;
    let subscriptionOperatorid: string;
    if (isFirstCall) {
      console.log('if');
      subscriptionId = this.subid;
      subscriptionOperatorid = this.operatorid;
      isFirstCall = false;
    } else {
      console.log('else');
      subscriptionId = this.f_subid;
      subscriptionOperatorid = this.lcoid;
    }
    console.log(subscriptionId);
    console.log(subscriptionOperatorid);
    console.log(this.lcoid);
    console.log(this.subid);
    console.log('OPERATOR ID', this.operatorid);

    this.errorMessage = '';
    this.swal.Loading();
    // this.userservice.lcotransferSinglesmartcard(this.role, this.username, subscriptionOperatorid, this.subid, this.withsubscription, this.smartcardno, 0, 2
    this.userservice.lcotransferSinglesmartcard(this.role, this.username, subscriptionOperatorid || this.lcoid, this.subid, this.withsubscription, this.smartcardno, this.retailerId || 0, 2, 0, 0, 1, this.comment || 'No Comment'
    ).subscribe((res: any) => {
      this.swal.success(res?.message);
      Swal.fire({
        title: 'Success!',
        text: res.message,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
        this.dialogRef.close({ success: true, smartcard: this.smartcardno });
      });
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
    // }
  }

  boxIdChange() {
    if (!this.new_boxid) {
      this.errorMessage = 'please Entered the Boxid !!';
      return;
    }
    this.errorMessage = '';
    this.swal.Loading();
    this.userservice.boxIdChange(this.role, this.username, this.smartcardno, this.new_boxid, this.retailerId || 0, 2)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error?.boxidchange.boxid);
      });
  }
  smartcardSuspend() {
    if (!this.sus_reason) {
      this.errorMessage = 'please Entered the Reason !!';
      return;
    }
    this.swal.Loading();
    this.userservice.smartcardSuspend(this.role, this.username, this.smartcardno, this.retailerId || 0, 4, this.sus_reason)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  reactivationofSmartcard() {
    this.swal.Loading();
    this.userservice.reactivationofSmartcard(this.role, this.username, this.smartcardno, this.retailerId || 0, 3)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  resume() {
    this.swal.Loading();
    this.userservice.smartcardResume(this.role, this.username, this.smartcardno, this.retailerId || 0, 5,)
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  block() {
    if (!this.block_reason) {
      this.errorMessage = 'please Entered the Reason !!';
      return;
    }
    this.swal.Loading();
    this.userservice.blockSmartcard(this.role, this.username, this.smartcardno, 2, this.block_reason).subscribe(
      (res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });

  }
  cancelSmartcard() {
    this.swal.Loading();
    this.userservice.cancelSmartcard(this.role, this.username, this.smartcardno, 2, this.retailerId || 0, 0, 0, 1, this.cancelSubRemark || 'No Comment')
      .subscribe((res: any) => {
        // this.swal.success(res?.message);
        Swal.fire({
          title: 'Success!',
          text: res.message,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate([`/admin/subscriber-full-info/${this.smartcardno}/subsmartcard`]);
          this.dialogRef.close({ success: true, smartcard: this.smartcardno });
        });
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  toggleAddonConfirmation() {
    this.addonconfirmation = !this.addonconfirmation;
  }
  toggleAlacarteConfirmation() {
    this.alacarteconfirmation = !this.alacarteconfirmation;
  }
  toggleRemoveConfirmation() {
    this.removeproduct = !this.removeproduct;
  }
  // --------------------------------------------------addon--------------------------------------
  addAddonConfirmation() {
    this.isaddaddon = true;
    this.finalrow = this.rows

    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 6,
      retailerid: this.retailerId || 0,
      addonlist: this.rows,
      managepackagelist: this.rowData,
      iscollected: this.iscollected,
      dueamount: this.changebase?.customerPayAmount || 0,
      paidamount: this.paidamount || this.collectedPayAmount || 0,
      android_id: 0,
      device_id: 0,
      ui_type: 1,
      comments: this.comment,
      billtype: this.billTypeValue?.bill_type || 0,
    }

    console.log(this.rows);

    this.userservice.addAddonConfirmation(requestBody).subscribe(
      (res: any) => {
        this.addonConfirmationData = res;
        console.log('response came', this.addonConfirmationData);
        this.cdr.detectChanges;
        console.log('dect changes completed');
        this.excessAmount = this.addonConfirmationData?.balance;
        this.oldexcessAmount = this.addonConfirmationData?.billbalance;
        console.log(this.addonConfirmationData);
        this.customerPayAmount = this.addonConfirmationData?.customerPayAmount;
        this.balanceamount = this.customerPayAmount - this.collectedPayAmount;
        // this.newExcessAmount = this.oldexcessAmount - this.balanceamount;
        this.newExcessAmount = this.oldexcessAmount + this.balanceamount;
        this.setBillType(this.customerPayAmount, this.collectedPayAmount);

      }, (err) => {
        this.swal.Error(err?.error?.message);
      });


  }
  addAddonForSmartcard() {
    this.confirmation = true;
    this.isConfirmationComplete = true;
    this.finalrow = this.rows;

    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 6,
      retailerid: this.retailerId || 0,
      iscollected: this.iscollected,
      addonlist: this.rows,
      managepackagelist: this.rowData,
      dueamount: this.addonConfirmationData?.customerPayAmount || 0,
      paidamount: this.paidamount || this.collectedPayAmount || 0,
      android_id: 0,
      device_id: 0,
      ui_type: 1,
      comments: this.comment,
      billtype: this.billTypeValue?.bill_type || 0,
    }
    Swal.fire({
      title: 'Adding...',
      text: 'Please wait Smartcard Added.',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false, // Hide the confirm button
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.addAddonForSmartcard(requestBody).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.typeData = response.body;

          this.swal.Successadd_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.rowData = [];
        }
      },
      (error) => {
        this.handleApiError(error);
      }
    );
  }
  // ----------------------------------alacarte-----------------------------------------
  addAlacarteConfirmation() {
    this.isaddalacarte = true;
    this.finalrow = this.rows
    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 6,
      retailerid: this.retailerId || 0,
      iscollected: this.iscollected,
      alacartelist: this.rows,
      android_id: 0,
      device_id: 0,
      ui_type: 1,
      billtype: this.billTypeValue?.bill_type || 0,
      comments: this.comment || 'No Comment',
    }
    this.userservice.addAlacarteConfirmation(requestBody).subscribe(
      (res: any) => {
        this.alacarteConfirmationData = res;
        // this.excessAmount = this.alacarteConfirmationData?.balance;
        this.oldexcessAmount = this.alacarteConfirmationData?.billbalance;
        console.log(this.alacarteConfirmationData);
        this.customerPayAmount = this.alacarteConfirmationData?.customerPayAmount;
        this.balanceamount = this.customerPayAmount - this.collectedPayAmount;
        // this.newExcessAmount = this.oldexcessAmount - this.balanceamount;
        this.newExcessAmount = this.oldexcessAmount + this.balanceamount;
        this.setBillType(this.customerPayAmount, this.collectedPayAmount);
        this.cdr.detectChanges;
        this.showData = true;
        // this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  addAlacarteSmartcard() {
    console.log(';213123213k;lkfsd;gjkfdskgjfdkjm');

    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 6,
      retailerid: this.retailerId || 0,
      iscollected: this.iscollected,
      alacartelist: this.rows,
      dueamt: this.alacarteConfirmationData?.customerPayAmount,
      paidamount: this.paidamount || this.collectedPayAmount || 0,
      android_id: 0,
      device_id: 0,
      ui_type: 1,
      comments: this.comment,
      billtype: this.billTypeValue?.bill_type || 0,
    }
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Recurring is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.addAlacarteForSmartcard(requestBody).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          this.swal.Successadd_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.rowData = [];
        }
      },
      (error) => {
        this.handleApiError(error);
      }
    );
  }
  // -------------------------------------------------remove------------------------------------------------

  removeProductConfirmation() {
    this.removeproduct = true;
    this.isRemove = this.removeproduct && this.isAnyRowSelected ? true : false;
    this.finalrow = this.rows;
    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 7,
      retailerid: this.retailerId || 0,
      iscollected: this.iscollected,
      removeproductlist: this.rows,
      android_id: 0,
      device_id: 0,
      ui_type: 1,
      billtype: this.billTypeValue?.bill_type || 0,
      comments: this.comment || 'No Comment',
    }

    this.userservice.removeProductConfirmation(requestBody).subscribe(
      (res: any) => {
        console.log(res);

        const resposne = res.body;
        this.lcoreFund = resposne.totalRefundToLco;
        console.log(this.lcoreFund);

        this.lcoreExpirydate = resposne.expiryDate;
        this.cdr.detectChanges;
        this.showData = true;
        // this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  removeProductForSmartcard() {
    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 7,
      retailerid: this.retailerId || 0,
      iscollected: this.iscollected,
      removeproductlist: this.rows,
      android_id: 0,
      device_id: 0,
      ui_type: 1,
      // dueamt: this.changebase?.customerPayAmount,
      // paidamount: this.paidamount || this.collectedPayAmount || 0,
      comments: this.comment,
      billtype: this.billTypeValue?.bill_type || 0,
    }

    this.swal.Loading();
    this.userservice.removeProductForSmartcard(requestBody).subscribe(
      (res: any) => {
        this.cdr.detectChanges;
        this.showData = true;
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  pairSmartcard() {
    this.swal.Loading();
    this.userservice.PairSmartcardOrBoxid(this.role, this.username, !this.ischeck, this.pairedSmartcard, this.subBoxid, this.retailerId || 0, 1).subscribe((res: any) => {
      // this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  pairBox() {
    this.swal.Loading();
    this.userservice.PairSmartcardOrBoxid(this.role, this.username, this.ischeck, this.subSmartcard, this.pairedBoxid, this.retailerId || 0, 2).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  handleUnpair() {
    if (this.ischeck) {
      this.unPairBox();
    } else {
      this.unPairSmartcard();
    }
  }
  unPairSmartcard() {
    this.swal.Loading();
    this.userservice.UnpairSmartcardOrBoxId(this.role, this.username, !this.ischeck, this.subSmartcard, this.retailerId || 0, 1, 0, 0, 1, this.comment || 'No Comment').subscribe((res: any) => {
      this.swal.success(res?.message);
      this.isUnpairDialogue = res?.message;
      this.unpairtoggle();
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  unPairBox() {
    this.swal.Loading();
    this.userservice.UnpairSmartcardOrBoxId(this.role, this.username, this.ischeck, this.subBoxid, this.retailerId || 0, 2, 0, 0, 1, this.comment || 'No Comment').subscribe((res: any) => {
      this.swal.success(res?.message);
      this.isUnpairDialogue = res?.message;
      this.unpairtoggle();
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }

  unpairtoggle() {
    this.isUnpairDialogue = !this.isUnpairDialogue;
  }

  getPdfSubscriberRechargeDetails() {
    const dataObject = {
      selectedDate: this.date.value,
    };
    this.userservice.getPdfSubscriberRechargeDetails(this.role, this.username, this.subid_1, dataObject.selectedDate).subscribe((x: Blob) => {
      let requestBodylogs: requestBodylogs = { access_ip: "", action: " PDF Bill Report", data: "From Date", remarks: "PDF Bill Report  ", };
      const blob = new Blob([x], { type: 'application/pdf' });
      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = "PDF Bill Report.pdf";
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      setTimeout(function () {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    })




  }


  handleApiError(error: any) {
    console.log(error);

    if (error.status === 400) {
      this.Error_400(error.error.message);
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }

  Error_400(message: any) {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    });
  }


  resetData(type: any) {
    console.log(this.subscriberdata.detailsList.idproof);
    console.log(this.subscriberdata.detailsList.addressproof);

    if (type == 'addressproof') {
      if (this.addressprooftypeid == this.subscriberdata.detailsList.addressprooftypeid) {
        this.addressproof = this.subscriberdata.detailsList.addressproof
      } else {
        this.addressproof = 0
      }
    } else if (type == 'idproof') {
      if (this.idprooftypeid == this.subscriberdata.detailsList.idprooftypeid) {
        this.idproof = this.subscriberdata.detailsList.idproof
      } else {
        this.idproof = ''
      }
    }
  }
  onCancel() { }
  onUpdate() { }
  rechargeTypeDialog = false;
  dialogType: any;
  onRechargeType(type: any) {
    console.log(type);
    this.dialogType = type;
    console.log(this.dialogType);
    this.rechargeTypeDialog = true;
    console.log('scroll--11');

    setTimeout(() => {
      const dialogElement = document.querySelector('.recharge-dialog1');
      if (dialogElement) {
        dialogElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
    this.cdr.detectChanges();
  }
  onRechargeType1() {
    this.rechargeTypeDialog = false;
    console.log('scroll');

    setTimeout(() => {
      const dialogElement = document.querySelector('.recharge-dialog');
      if (dialogElement) {
        dialogElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
    this.cdr.detectChanges();
  }
  onBalaceAmount(type: any) {
    console.log(type)
    console.log(this.customerPayAmount)
    console.log(this.collectedPayAmount)
    this.balanceamount = this.customerPayAmount - this.collectedPayAmount;
    // this.newExcessAmount = this.oldexcessAmount - this.balanceamount;
    this.newExcessAmount = this.oldexcessAmount + this.balanceamount;
    this.setBillType(this.customerPayAmount, this.collectedPayAmount);
    console.log(this.excessAmount);
    console.log(this.balanceamount);
    console.log(this.newExcessAmount);
  }
  // setBillType(customerPayAmount: any, collectedPayAmount: any): void {
  //   if (customerPayAmount === 0 && collectedPayAmount > 0) {
  //     this.billTypeValue = {
  //       bill_type: 1,
  //       description: 'Fully Paid'
  //     };
  //   } else if (customerPayAmount > 0 && collectedPayAmount === 0) {
  //     this.billTypeValue = {
  //       bill_type: 0,
  //       description: 'Unpaid'
  //     };
  //   } else if (collectedPayAmount < customerPayAmount) {
  //     this.billTypeValue = {
  //       bill_type: 3,
  //       description: 'Partially Paid'
  //     };
  //   } else if (collectedPayAmount > customerPayAmount) {
  //     this.billTypeValue = {
  //       bill_type: 4,
  //       description: 'Excess Paid'
  //     };
  //   } else if (collectedPayAmount === customerPayAmount) {
  //     this.billTypeValue = {
  //       bill_type: 1,
  //       description: 'Fully Paid'
  //     };
  //   } else {
  //     this.billTypeValue = {
  //       bill_type: 0,
  //       description: 'Unknown'
  //     };
  //   }

  //   console.log('Bill Type:', this.billTypeValue?.bill_type);
  // }

  setBillType(customerPayAmount: any, collectedPayAmount: any): void {
    if (customerPayAmount == collectedPayAmount) {
      // Fully Paid
      this.billTypeValue = {
        bill_type: 1,
        description: 'Fully Paid'
      };
    } else if (customerPayAmount > 0 && collectedPayAmount === 0) {
      // Unpaid
      this.billTypeValue = {
        bill_type: 2,
        description: 'Unpaid'
      };
    } else if (collectedPayAmount < customerPayAmount) {
      // Partially Paid
      this.billTypeValue = {
        bill_type: 3,
        description: 'Partially Paid'
      };
    } else if (collectedPayAmount > customerPayAmount) {
      // Excess Paid
      this.billTypeValue = {
        bill_type: 4,
        description: 'Excess Paid'
      };
    } else if (collectedPayAmount === customerPayAmount) {
      // Fully Paid (Exact match)
      this.billTypeValue = {
        bill_type: 1,
        description: 'Fully Paid'
      };
    }
    // else {
    //   // Default fallback
    //   this.billTypeValue = {
    //     bill_type: 0,
    //     description: 'Unknown'
    //   };
    // }

    console.log('Bill Type:', this.billTypeValue?.bill_type);
  }
}

