import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriberdialogueComponent implements OnInit {
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  readonly date = new FormControl(moment());
  columnDefs: any;
  finalrow: any = [];
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  type: number = 1;

  filteredPackageList: Observable<any[]> | undefined;
  filterControl = new FormControl();


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
  isSelectionMade: boolean = false;

  pair: boolean = false;
  unpair: boolean = false;
  ischeck: boolean = false;
  pairedSmartcard: any = 0;
  pairedBoxid: any = 0;

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
  castype: any = 0;
  lconame: any;
  smartcard: any = 0;
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
  subSmartcard: any;
  subBoxid: any;
  isUnpairDialogue: any;
  operatorid: any;
  subid: any;
  islock = false;
  password: any;
  subscribername: any;
  baseplan: any;
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
  areaid: any = 0;
  streetid: any = 0;

  packageid: any;
  plan: any;
  f_smartcard: any;
  f_plantype: any;
  f_date: any;
  f_subid: any;
  boxno: any;
  message: any;
  smart: boolean = false;
  box: boolean = false;
  status: any;
  smartcardno: any;
  mobile: any;
  cardbalance: any;
  expirydate: any;
  packagename: any;
  newpackagename: any = 0;
  statusdisplay: any
  newpin: any;
  statusValue: any;
  statusSus: any;
  oldpin: any;
  PVRstatus = false;
  forcemsg: any;
  plantype: any = " ";
  rechargetype: any[] = [];
  packagenameList: any = [];
  subid_1: any;
  newSubid: any;
  p_name: any;
  selectedRechargetype: string = '0';
  selectedpackagetype: string = '0';
  datetype = false;
  isplantype = false;
  billtype: number = 0;
  paid: any;
  unpaid: any;
  iscollected = false;
  timegap: any;
  duration: any;
  forcemessage: any;
  repeatfor: any;
  sus_reason: any;
  block_reason: any;
  new_boxid: any;
  rowData: any;
  rowData1: any[] = [];
  rowData3: any[] = [];
  selectedIds: number[] = [];
  gridApi: any;
  public rowSelection: any = "multiple";
  isAnyRowSelected: any = false;
  rows: any;
  selectedtypes: number[] = [];
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 320,
      floatingFilter: true
    },
  }
  sType: any
  typeData: any;
  TotalLcoAmount: any;
  BTNFormControl = new FormControl('');

  plantypeSubject = new BehaviorSubject<{ [key: string]: number }>({});
  plantype$ = this.plantypeSubject.asObservable();
  selectedaddproof_1: any;

  selectedAddProofType: string = '';
  selectedIDProofType: string = '';

  removeProductList: any;
  removeProductList_expiryDate: any;
  removeProductList_refund: any;

  maskPattern: string = '';
  maxLength: number | undefined;
  exampleFormat: string | undefined;
  form!: FormGroup;

  id_proof_list: { [key: string]: number } = {};
  add_proof_list: { [key: string]: number } = {};
  constructor(public dialogRef: MatDialogRef<SubscriberdialogueComponent>, private swal: SwalService,
    @Inject(MAT_DIALOG_DATA) public data: any, public userservice: BaseService, private cdr: ChangeDetectorRef, public storageService: StorageService, private fb: FormBuilder, private zone: NgZone) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    console.log(data);
    this.subid_1 = data.subId;
    console.log(this.subid_1);
    this.newSubid = data.newsubid;
    this.sType = data?.type;
    this.pairBoxList = data['pairBoxlist'].map((item: any) => item);
    // this.pairSmartcardList = data['pairSmartcardlist'].map((item: any) => item);
    this.subSmartcard = data.subSmartcarList;
    this.subBoxid = data.subBoxList;

    // this.ischeck = data.subBoxList || data.subSmartcarList
    console.log(this.subSmartcard);
    console.log(this.subBoxid);
    this.pairSmartcardList = data['detailsList'].smartcardlist;
    console.log(this.pairSmartcardList);

    this.subscribername = data['detailsList'].customername;
    this.operatorid = data['detailsList'].operatorid;
    this.subid = data['detailsList'].subid;
    this.baseplan = data['detailsList'].baseplan;
    this.mobile = data['detailsList'].mobileno;
    this.Wallet = data['detailsList'].balance;
    this.password = data['detailsList'].password;
    this.islock = data['detailsList'].islock;
    this.subusername = data['detailsList'].username;
    this.subscribernameLast = data['detailsList'].customernamelast;
    this.casformid = data['detailsList'].casformid;
    this.dateofbirth = data['detailsList'].dateofbirth;
    this.fathername = data['detailsList'].fathername;
    this.lconame = data['detailsList'].operatorname;
    this.cardbalance = data['detailsList'].cardbalance;
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
    this.statusSus = data['detailsList'].statusSus;
    this.smartcardno = data['detailsList'].smartcard;
    this.statusdisplay = data['detailsList'].statusdisplay;
    this.boxno = data['detailsList'].boxid;
    if (this.boxno) {
      this.box = true
      this.smart = false
    } else if (this.smartcardno) {
      this.smart = true;
      this.box = false
    }

    this.expirydate = data['detailsList'].expirydate;
    this.packagename = data['subdetaillist']?.[0]?.packagename;
    console.log(this.packagename);

    this.message = data['accountsList']?.msgcontent;
    this.status = data['detailsList'].status;
    this.oldpin = data['detailsList'].pinnumber;
    this.PVRstatus = data['detailsList'].pvrstatus;
    this.forcemsg = data['detailsList'].isdeleteforcemessage;
    this.islogindetails = data.islogindetails || false;
    this.isEditSubscriberDetails = data.isEditSubscriberDetails || false;
    this.isConfirmationReport = data.isConfirmationReport || false;
    this.isaddSmartcard = data.isaddSmartcard || false;
    this.ischangeoperator = data.ischangeoperator || false;
    this.ischange_lco = data.ischange_lco || false;





    this.Editform = this.fb.group(
      {
        id: this.newSubid,
        customername: ['', Validators.required],
        customerlastname: ['', Validators.required],
        dateofbirth: ['', [Validators.required]],
        address: ['', [Validators.required]],
        landlineno: ['', [Validators.required, Validators.pattern('^0\\d{8,10}$')]],
        livetv: [false, [Validators.required]],
        casformid: ['', Validators.required],
        fathername: ['', [Validators.required]],
        mobileno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        installaddress: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        addressproof: ['', [Validators.required]],
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
  ngOnInit(): void {
    $("#single").select2({
      placeholder: "Select a programming language",
      allowClear: true
    });
    this.filteredPackageList = this.filterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    console.log(this.filteredPackageList);
    const params = {
      api: this.gridApi
    };
    this.onGridReady(params);
    this.userservice.PackageList(this.role, this.username, this.type).subscribe((data) => {
      this.packagenameList = data;
      this.cdr.detectChanges();
    })
    this.userservice.getActiveCasList(this.role, this.username).subscribe((data: any) => {
      let v = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      this.cas = v
      this.cdr.detectChanges();
    });


    this.userservice.getNotinOperatorList(this.role, this.username, this.operatorid).subscribe((data: any) => {
      this.lco_list = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      this.cdr.detectChanges();
    })
    // this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
    //   this.plantype = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    //   this.selectedRechargetype = data;
    // })
    // this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
    //   this.plantype = data;

    //   console.log(this.plantype);
    // });
    this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      this.plantypeSubject.next(data);
    });
    this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      this.rechargetype = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      this.cdr.detectChanges();
    })
    this.userservice.cancelSubscriptionOfSmartcardDetails(this.role, this.username, this.smartcardno).subscribe((data: any) => {
      this.TotalLcoAmount = data.totallcoamount;
      this.rowData1 = data.cancelproduct;
      console.log(this.rowData1);
      this.cdr.detectChanges();
    })
    this.loadIdProofList();
    this.loadAddProofList();
  }
  loadIdProofList(): void {
    this.userservice.getIdProofList(this.role, this.username).subscribe(
      (data: any) => {
        this.id_proof_list = data.idprooftypeid;
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
        console.log("ADD Proof List", this.add_proof_list);
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
  onIDProofChange(event: any): void {
    const selectedValue = event.target.value;
    const match = selectedValue.match(/\((\d+)\)/);
    const value = match ? match[1] : null;
    this.selectedIDProofType = selectedValue.replace(/\(\d+\)/, '').trim();
    this.form.get('idproof')?.reset();
    this.applyValidators(this.selectedIDProofType, 'idproof');
  }
  onAddProofChange(event: any): void {
    const selectedValue = event.target.value;
    const match = selectedValue.match(/\((\d+)\)/);
    const value = match ? match[1] : null;
    this.selectedAddProofType = selectedValue.replace(/\(\d+\)/, '').trim();
    this.form.get('addressproof')?.reset();
    this.applyValidators(this.selectedAddProofType, 'addressproof');
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
    // console.log("getPattern           " + proofType);

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
        return '.*'; // Accept anything by default
    }
  }

  getExampleFormat(proofType: string): string {
    // console.log("getExampleFormat        " + proofType);

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
    console.log(proofType);

    if (control) {
      control.clearValidators();

      switch (proofType) {
        case 'Aadhaar Card':
          this.maskPattern = '000000000000';
          this.maxLength = 12; // Includes spaces
          this.exampleFormat = '123456789123';
          control.setValidators([
            Validators.required,
            // Validators.pattern(/^\d{4} \d{4} \d{4}$/),
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
  // columnDefs: any[] = [
  //   {
  //     headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80, filter: false, headerCheckboxSelection: true,
  //     checkboxSelection: true,
  //   },

  //   {
  //     headerName: 'PACKAGE NAME	',
  //     field: 'packagename', width: 200,
  //   },
  //   {
  //     headerName: 'CAS PRODUCT ID	 ', width: 200,
  //     field: 'casproductid',
  //   },
  //   {
  //     headerName: 'BROADCASTER NAME	', width: 200,
  //     field: 'broadcastername',
  //   },
  //   {
  //     headerName: 'CUSTOMER AMOUNT', width: 150, filter: false,
  //     field: 'customeramount',
  //   },
  //   {
  //     headerName: 'PROGRAMS', width: 100, filter: false,
  //     field: '',
  //   },

  // ]
  // columnDefs2: any[] = [
  //   {
  //     headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false, headerCheckboxSelection: true, checkboxSelection: true,
  //   },
  //   {
  //     headerName: 'PACKAGE NAME	',
  //     field: 'packagename', width: 150,
  //   },
  //   {
  //     headerName: 'BROADCASTER NAME	 ', width: 250,
  //     field: 'broadcastername',
  //   },
  //   {
  //     headerName: 'CAS PRODUCT ID		', width: 250,
  //     field: 'casproductid',
  //   },
  //   {
  //     headerName: ' CUSTOMER AMOUNT ', width: 250, filter: false,
  //     field: 'customeramount',
  //   },


  // ]

  // private updateColumnDefs(stype: string): void {
  //   console.log(stype);

  //   if (stype === 'remove') {
  //     this.columnDefs = [
  //       {
  //         headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false, headerCheckboxSelection: true, checkboxSelection: true,

  //       },
  //       {
  //         headerName: 'PACKAGE NAME	',
  //         field: 'productname', width: 150,
  //       },
  //       {
  //         headerName: 'PACKAGE TYPE		 ', width: 250,
  //         field: 'producttypename',
  //       },
  //       {
  //         headerName: 'REFUND AMOUNT		', width: 250,
  //         field: 'refundproductrate',
  //       },
  //       {
  //         headerName: 'DAYS', width: 250,
  //         field: 'days',
  //       },
  //     ]
  //   } else if (stype === 'cancelsubscription') {
  //     this.columnDefs = [
  //       {
  //         headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false

  //       },
  //       {
  //         headerName: 'PACKAGE NAME	', field: 'productname', width: 150,        },
  //       {
  //         headerName: 'PACKAGE TYPE		 ', width: 250,
  //         field: 'producttype',
  //       },
  //       {
  //         headerName: 'REFUND AMOUNT		', width: 250,
  //         field: 'refundproductrate',
  //       },
  //       {
  //         headerName: 'DAYS', width: 250,
  //         field: 'days',
  //       },
  //     ]
  //   } else if (this.sType === 'addon') {
  //     this.columnDefs = [
  //       { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false, headerCheckboxSelection: true, checkboxSelection: true },
  //       { headerName: 'PACKAGE NAME', field: 'channel_name', width: 150 },
  //       { headerName: 'BROADCASTER NAME', field: 'broadcastername', width: 250 },
  //       { headerName: 'CAS PRODUCT ID', field: 'casproductid', width: 250 },
  //       { headerName: 'CUSTOMER AMOUNT', field: 'customeramount', width: 250, filter: false }
  //     ];
  //   } else if (this.sType === 'alacarte') {
  //     this.columnDefs = [
  //       { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80, filter: false, headerCheckboxSelection: true, checkboxSelection: true },
  //       { headerName: 'PACKAGE NAME', field: 'channel_name', width: 200 },
  //       { headerName: 'CAS PRODUCT ID', field: 'casproductid', width: 200 },
  //       { headerName: 'BROADCASTER NAME', field: 'broadcastername', width: 200 },
  //       { headerName: 'CUSTOMER AMOUNT', field: 'customeramount', width: 200, filter: false },
  //       { headerName: 'PROGRAMS', field: '', width: 100, filter: false }
  //     ];
  //   } else if (this.sType === 'remove') {
  //     this.columnDefs = [
  //       // Define the column definitions for the 'remove' case here
  //       { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80, filter: false, headerCheckboxSelection: true, checkboxSelection: true },
  //       { headerName: 'PACKAGE NAME', field: 'channel_name', width: 200 },
  //       { headerName: 'CAS PRODUCT ID', field: 'casproductid', width: 200 },
  //       { headerName: 'BROADCASTER NAME', field: 'broadcastername', width: 200 },
  //       { headerName: 'CUSTOMER AMOUNT', field: 'customeramount', width: 200, filter: false },
  //       { headerName: 'PROGRAMS', field: '', width: 100, filter: false }
  //     ];
  //   }
  // }
  private updateColumnDefs(stype: string): void {
    console.log(stype);

    if (stype === 'remove') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false, headerCheckboxSelection: true, checkboxSelection: true },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 150 },
        { headerName: 'PACKAGE TYPE', field: 'producttypename', width: 250 },
        { headerName: 'REFUND AMOUNT', field: 'refundproductrate', width: 250 },
        { headerName: 'DAYS', field: 'days', width: 250 },
      ];
    } else if (stype === 'cancelsubscription') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 150 },
        { headerName: 'PACKAGE TYPE', field: 'producttype', width: 250 },
        { headerName: 'REFUND AMOUNT', field: 'refundproductrate', width: 250 },
        { headerName: 'DAYS', field: 'days', width: 250 },
      ];
    } else if (stype === 'addon') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false, headerCheckboxSelection: true, checkboxSelection: true },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 150 },
        { headerName: 'BROADCASTER NAME', field: 'broadcastername', width: 250 },
        { headerName: 'CAS PRODUCT ID', field: 'casproductid', width: 250 },
        { headerName: 'CUSTOMER AMOUNT', field: 'customeramount', width: 250, filter: false }
      ];
    } else if (stype === 'alacarte') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80, filter: false, headerCheckboxSelection: true, checkboxSelection: true },
        { headerName: 'PACKAGE NAME', field: 'channel_name', width: 200 },
        { headerName: 'CAS PRODUCT ID', field: 'casproductid', width: 200 },
        { headerName: 'BROADCASTER NAME', field: 'broadcastername', width: 200 },
        { headerName: 'CUSTOMER AMOUNT', field: 'customeramount', width: 200, filter: false },
        { headerName: 'PROGRAMS', field: '', width: 100, filter: false }
      ];
    }
  }

  columnDefs1: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100,
    },
    {
      headerName: 'SELECTED PACKAGES',
      field: 'channel_name', width: 200,
    },
  ]
  columnDefs2: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100,
    },
    {
      headerName: 'SELECTED PACKAGES',
      field: 'productname', width: 200,
    },
  ]



  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    console.log(this.sType);

    if (this.sType === 'addon') {
      this.userservice.getAddonpackageDetails(this.role, this.username, this.smartcardno).subscribe(
        //   (res: any) => {
        //   this.swal.success(res?.message);
        //   this.rowData = res;
        //   this.cdr.detectChanges();
        // }, (err) => {
        //   this.swal.Error(err?.error?.message);
        // }
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            this.cdr.detectChanges();
            Swal.fire('Success', 'Data updated successfully!', 'success');
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
        //   (res: any) => {
        //   this.swal.success(res?.message);
        //   this.rowData = res;
        //   this.cdr.detectChanges();
        // }, (err) => {
        //   this.swal.Error(err?.error?.message);
        // }
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            this.cdr.detectChanges();
            Swal.fire('Success', 'Data updated successfully!', 'success');
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
        //   (res: any) => {
        //   this.swal.success(res?.message);
        //   this.rowData = res;
        //   this.cdr.detectChanges();
        // }, (err) => {
        //   this.swal.Error(err?.error?.message);
        // }
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            this.cdr.detectChanges();
            Swal.fire('Success', 'Data updated successfully!', 'success');
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

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows;
      if (this.finalrow.length > 0) {
        console.log('if');
        this.rows = this.finalrow;
      } else {
        console.log('else');

        this.rows = selectedRows;
      }
      console.log(this.rows);
      console.log(this.isAnyRowSelected);
      console.log(this.finalrow);


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

  onSelectionrechargetype(selectedValue: string) {
    const rechargetype = Number(selectedValue);
    if (rechargetype == 1) {
      this.isplantype = true;
      this.datetype = false;
    }
    if (rechargetype == 2) {
      this.isplantype = false;
      this.datetype = true;
    }
    if (rechargetype == 3) {
      this.datetype = false;
      this.isplantype = false;
    }
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


  // addSmartcard() {
  //   this.userservice.addSmartcardToSubscriber(this.role, this.username, this.operatorid, this.castype, this.smartcard, this.boxid, this.subid)
  //     .subscribe((res: any) => {
  //       this.returndata = res;

  //       this.swal.success(res?.message);
  //     }, (err) => {
  //       this.returndata = err?.error;
  //       this.swal.Error(err?.error?.message);
  //     });
  // }
  addSmartcard() {
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
    this.userservice.addSmartcardToSubscriber(this.role, this.username, this.operatorid, this.castype, this.smartcard, this.boxid, this.subid_1 || this.newSubid).subscribe(
      (res: any) => {
        this.returndata = res;
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });

  }


  onSubmit() {
    // if (this.Editform.invalid) {
    //   Swal.fire({
    //     title: 'Invalid Form!',
    //     text: 'Please fill in all required fields correctly.',
    //     icon: 'error',
    //     confirmButtonText: 'Okay'
    //   });
    //   return; 
    // }
    this.swal.Loading();
    this.userservice.UpdateSubscriberDetails(this.Editform.value)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
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
  // smartcardlist(event: Event) {
  //   const target = event.target as HTMLSelectElement;
  //   const smartcard = target.value;
  //   this.userservice.getBoxidBySmartcard(this.role, this.username, this.smartcard).subscribe((data: any) => {
  //     this.boxid = data;
  //     let boxid: any = document.getElementById("boxid");
  //     boxid!.value = data;
  //   })

  // }
  // casTypelist(event: Event) {
  //   const target = event.target as HTMLSelectElement;
  //   const castype = target.value;
  //   this.userservice.getNotallocatedSmartcardListByCastypeAndOperatorid(this.role, this.username, this.operatorid, castype).subscribe((data: any) => {
  //     this.area = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
  //     console.log(this.area);

  //   })
  // }
  casTypelist(event: Event) {
    const target = event.target as HTMLSelectElement;
    const castype = target.value;

    // Call API to fetch smartcard list based on selected CAS type
    this.userservice.getNotallocatedSmartcardListByCastypeAndOperatorid(this.role, this.username, this.operatorid, castype)
      .subscribe((data: any) => {
        // Check if any data is returned
        if (data && Object.keys(data).length > 0) {
          // Populate the smartcard select options
          this.area = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
        } else {
          // Show an alert if no data is available
          Swal.fire({
            icon: 'warning',
            title: 'No Smartcards Available',
            text: data?.message || 'No smartcards found for the selected CAS type.',
            confirmButtonText: 'OK'
          });
          // Clear the smartcard list if no data is returned
          this.area = [];
        }
      }, (err) => {
        // Handle error and show an alert if the API call fails
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Failed to fetch smartcard list. Please try again later.',
          confirmButtonText: 'OK'
        });
      });
  }

  smartcardlist(event: Event) {
    const target = event.target as HTMLSelectElement;
    const smartcard = target.value;

    // Call API to fetch box ID based on the selected smartcard
    this.userservice.getBoxidBySmartcard(this.role, this.username, smartcard).subscribe((data: any) => {
      // Set the box ID in the input field
      this.boxid = data;

      let boxidElement: any = document.getElementById("boxid");
      if (boxidElement) {
        boxidElement.value = data;
      }
    }, (err) => {
      // Handle error and show an alert if the API call fails
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.error?.message || 'Failed to fetch box ID. Please try again later.',
        confirmButtonText: 'OK'
      });
    });
  }
  onSubscriberStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const lco = target.value;
    this.userservice.getAreaListByOperatorid(this.role, this.username, lco)
      .subscribe((data: any) => {
        this.area_list = Object.entries(data.areaid).map(([key, value]) => ({ name: key, id: value }));

      });
  }
  onAreaStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const area = target.value;
    this.userservice.getStreetListByAreaid(this.role, this.username, area)
      .subscribe((data: any) => {
        this.street_list = Object.entries(data.streetid).map(([key, value]) => ({ name: key, id: value }));
      });
  }
  onStreetStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.lcostreetid = target.value;
  }
  onSubscriberlcoChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const lco = target.value;
    this.userservice.getSubscriberIdListByOperatorid(this.role, this.username, lco).subscribe((data: any) => {
      this.sub_list = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    })

  }
  changeOperator() {
    this.swal.Loading();
    this.userservice.transferLcoToSmartcard(this.role, this.username, this.lcoid, this.lcoareaid, this.lcostreetid, this.subid_1, this.withsubscription, 0, 2)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  refreshSmartcard() {
    this.swal.Loading();
    this.userservice.refreshSmartcard(this.role, this.username, this.smartcardno, 0, 3)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  deactivationofSmartcard() {
    this.swal.Loading();
    this.userservice.deactivationofSmartcard(this.role, this.username, this.smartcardno, 2)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  pinchange() {
    this.swal.Loading();
    this.userservice.pinchange(this.role, this.username, this.smartcardno, this.newpin, 3, 0)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  pvrchange() {
    this.swal.Loading();
    this.userservice.pvrChange(this.role, this.username, this.smartcardno, this.PVRstatus, 3, 0)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  deleteForceMessage() {
    this.swal.Loading();
    this.userservice.deleteForceMessage(this.role, this.username, this.smartcardno)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  forcetuning() {
    this.swal.Loading();
    this.userservice.forceTuning(this.role, this.username, this.smartcardno)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  boxIdChange() {
    this.swal.Loading();
    this.userservice.boxIdChange(this.role, this.username, this.smartcardno, this.new_boxid, 0, 2)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  sendMessage() {
    // if (this.Sendmseform.invalid) {
    //   this.Sendmseform.markAllAsTouched();
    //   return;
    // }
    // if (this.Sendmseform.invalid) {
    this.Sendmseform.markAllAsTouched();
    // return;
    // }
    const formValues = this.Sendmseform.value;
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
    this.userservice.sendMessage(payload)

      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  toggleConfirmation() {
    this.confirmation = !this.confirmation;
  }
  onBillTypeChange() {
    this.billtype = this.billtype ? 1 : 0;
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
    this.baseChangeofSmartcardPackage();
  }

  onActivationButtonClick(): void {
    this.getFirstTimeActivationConfirmation();
    this.toggleConfirmation();
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
    this.removeProductConfirmation();
    this.toggleRemoveConfirmation();
  }
  onRemove(): void {
    this.removeProductConfirmation();
  }
  firsttimeActivationOfCard() {
    let requestBody = {
      packageid: this.newpackagename,
      plantype: this.selectedRechargetype,
      plan: this.plantype,
      billtype: this.billtype,
      dueamt: 0.0,
      paidamt: this.First_list.customerPayAmount,
      smartcard: this.smartcard,
      type: 0,
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
    this.userservice.firsttimeActivationOfCard(requestBody).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Success',
          text: res?.message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();
        });
      },
      (err) => {
        Swal.fire({
          title: 'Error',
          text: err?.error?.message || 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
  ActivationOfCard() {
    let requestBody = {
      packageid: this.newpackagename,
      plantype: this.selectedRechargetype,
      plan: this.plantype,
      billtype: this.billtype,
      dueamt: 0.0,
      paidamt: this.First_list.customerPayAmount,
      smartcard: this.smartcard,
      type: 0,
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
    this.userservice.ActivationOfCard(requestBody).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Success',
          text: res?.message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.reload();
        });
      },
      (err) => {
        Swal.fire({
          title: 'Error',
          text: err?.error?.message || 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }
  baseChangeofSmartcardPackage() {
    // Swal.fire({
    //   title: 'Loading...',
    //   text: 'Please wait while we process your request.',
    //   allowOutsideClick: false, // Disable clicking outside the popup to close it
    //   didOpen: () => {
    //     Swal.showLoading(null);
    //   }
    // });

    this.userservice.getBaseChangeConfirmation(this.role, this.username, this.newpackagename, this.selectedRechargetype, this.plantype || this.f_date, this.smartcardno, 8, 0)
      .subscribe((data: any) => {
        this.changebase = data;
        console.log(this.changebase);
        this.changebase_msoAmount = data.msoAmount;
        this.changebase_totalRefundToLco = data.totalRefundToLco;
        this.changebase_expiryDate = data.expiryDate;
        this.cdr.detectChanges();
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  baseChangeofSmartcardPackageActivate() {
    let requestBody = {
      role: this.role,
      username: this.username,
      packageid: this.newpackagename,
      plantype: this.selectedRechargetype,
      plan: this.plantype,
      billtype: 1,
      dueamt: 0.0,
      paidamt: this.changebase?.customerPayAmount,
      smartcard: this.smartcardno,
      type: 8,
      retailerid: 0,
      iscollected: this.iscollected,
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
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  getFirstTimeActivationConfirmation() {
    // Swal.fire({
    //   title: 'Loading...',
    //   text: 'Please wait while we process your request.',
    //   allowOutsideClick: false, // Disable clicking outside the popup to close it
    //   didOpen: () => {
    //     Swal.showLoading(null);
    //   }
    // });
    this.swal.Loading();
    this.userservice.getFirstTimeActivationConfirmation(this.role, this.username, this.newpackagename, this.selectedRechargetype, this.plantype || this.f_date, this.smartcardno, 1, 0)
      .subscribe((data: any) => {
        this.First_list = data;
        this.swal.success_1(data?.message);
        this.cdr.detectChanges();
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
    // this.cdr.detectChanges();
  }
  lcotransferSinglesmartcard() {
    this.swal.Loading();
    this.userservice.lcotransferSinglesmartcard(this.role, this.username, this.operatorid, this.subid, this.f_subid, this.withsubscription, this.smartcardno, 0, 2)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  smartcardSuspend() {
    this.swal.Loading();
    this.userservice.smartcardSuspend(this.role, this.username, this.smartcardno, 0, 4, this.sus_reason)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  reactivationofSmartcard() {
    this.swal.Loading();
    this.userservice.reactivationofSmartcard(this.role, this.username, this.smartcardno, 0, 3)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  resume() {
    this.swal.Loading();
    this.userservice.smartcardResume(this.role, this.username, this.smartcardno, 0, 5,)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  block() {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Block  this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait ',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.blockSmartcard(this.role, this.username, this.smartcardno, 2, this.block_reason,).subscribe(
          (res) => {
            console.log(res);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Your update was successful",
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: err?.error?.message,
              showConfirmButton: false,
              timer: 1500
            });
          }
        );
      }
    });

    // this.userservice.blockSmartcard(this.role, this.username, this.smartcardno, 2, this.block_reason,)
    //   .subscribe((res: any) => {
    //     this.swal.success(res?.message);
    //   }, (err) => {
    //     this.swal.Error(err?.error?.message);
    //   });
  }
  cancelSmartcard() {
    this.swal.Loading();
    this.userservice.cancelSmartcard(this.role, this.username, this.smartcardno, 2, 0,)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
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
    this.finalrow = this.rows
    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 6,
      retailerid: 0,
      addonlist: this.rows,
      managepackagelist: this.rowData,
    }
    this.userservice.addAddonConfirmation(requestBody).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          console.log(this.rowData);
          // const selectedRows = this.gridApi.getSelectedRows();
          // this.rowData3 = selectedRows.filter((row: any) => row.packagename);
          console.log(this.rows?.length);
          this.cdr.detectChanges();
          console.log(this.rowData3);
          this.swal.Success_200();
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
  addAddonForSmartcard() {
    this.finalrow = this.rows
    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 6,
      retailerid: 0,
      iscollected: this.iscollected,
      addonlist: this.rows,
      managepackagelist: this.rowData
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

          this.swal.Success_200();
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
    this.finalrow = this.rows
    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 6,
      retailerid: 0,
      iscollected: this.iscollected,
      alacartelist: this.rows,
    }
    console.log(requestBody);
    this.swal.Loading();
    this.userservice.addAlacarteConfirmation(requestBody).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          console.log(this.rowData);
          this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.rowData = [];
        }
      },
      (error) => {
        this.handleApiError(error);
      }
    );
    // this.cdr.detectChanges();
  }
  addAlacarteSmartcard() {
    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 6,
      retailerid: 0,
      iscollected: this.iscollected,
      alacartelist: this.rows,
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
          this.swal.Success_200();
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
    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 7,
      retailerid: 0,
      iscollected: this.iscollected,
      removeproductlist: this.rows,
    }
    this.userservice.removeProductConfirmation(requestBody).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.rowData = [];
        }
      },
      (error) => {
        this.handleApiError(error);
      }
    );
    //   (response: HttpResponse<any[]>) => {
    //     if (response.status === 200) {
    //       this.rowData = response.body;
    //       const selectedRows = this.gridApi.getSelectedRows();
    //       this.rowData3 = selectedRows.filter((row: any) => row.packagename);
    //       console.log(this.rowData3);
    //       Swal.fire('Success', 'Data updated successfully!', 'success');
    //     } else if (response.status === 204) {
    //       Swal.fire('No Content', 'No data available for the given criteria.', 'info');
    //     }
    //   },
    //   (error) => {
    //     if (error.status === 400) {

    //       Swal.fire(error?.error?.message || error?.error?.addonlist || 'Error 400', 'Bad Request. Please check the input.', 'error');
    //     } else if (error.status === 500) {
    //       Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
    //     } else {
    //       Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    //     }
    //   }
    // );
  }
  removeProductForSmartcard() {
    let requestBody = {
      role: this.role,
      username: this.username,
      smartcard: this.smartcardno,
      type: 7,
      retailerid: 0,
      iscollected: this.iscollected,
      removeproductlist: this.rows,
    }
    this.userservice.removeProductForSmartcard(requestBody).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          this.swal.Success_200();
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
  pairSmartcard() {
    this.userservice.PairSmartcardOrBoxid(this.role, this.username, !this.ischeck, this.pairedSmartcard, this.subBoxid, 0, 2).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  unPairSmartcard() {
    this.userservice.UnpairSmartcardOrBoxId(this.role, this.username, !this.ischeck, this.subSmartcard, 0, 2).subscribe((res: any) => {
      // this.swal.success(res?.message);
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
    this.userservice.getPdfSubscriberRechargeDetails(this.role, this.username, this.subid_1, this.date).subscribe((x: any) => {
      console.log(x);
      let requestBodylogs: requestBodylogs = { access_ip: "", action: " PDF Bill Report", data: "From Date", remarks: "PDF Bill Report  ", };
      console.log(requestBodylogs);
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
    if (error.status === 400) {
      this.swal.Error_400();
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }

}

