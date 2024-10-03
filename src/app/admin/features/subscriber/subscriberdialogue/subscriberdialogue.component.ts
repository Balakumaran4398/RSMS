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
declare var $: any;
const moment = _rollupMoment || _moment;

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


  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  confirmation: boolean = false;
  type: number = 1;

  filteredPackageList: Observable<any[]> | undefined;
  filterControl = new FormControl();


  isEditSubscriberDetails: boolean = false;
  islogindetails: boolean = false;
  isConfirmationReport: boolean = false;
  isaddSmartcard: boolean = false;
  ischangeoperator: boolean = false;
  ischange_lco: boolean = false;


  cardOldBalance: any;
  newexpiryDate: any;
  oldExpiryDate: any;
  msoAmount: any;

  returndata: any;

  First_list: any;

  LoginForm!: FormGroup;
  Editform!: FormGroup;
  Sendmseform!: FormGroup;
  signinform!: FormGroup;
  addsmartcardform!: FormGroup;
  role: any;
  username: any;
  castype: any;
  lconame: any;
  smartcard: any = 0;
  boxid: any = "";
  cas: any[] = [];
  lcoid: any;
  lcoareaid: any;
  lcostreetid: any;
  withsubscription = false;
  area: any[] = [];
  searchTerm: any;
  lco_list: any[] = [];
  sub_list: any[] = [];
  area_list: any[] = [];
  street_list: any[] = [];
  operatorid: any;
  subid: any;
  islock = false;
  password: any;
  subscribername: any;
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
  status: any;
  smartcardno: any;
  mobile: any;
  cardbalance: any;
  expirydate: any;
  packagename: any;
  newpackagename: any;
  statusdisplay: any
  newpin: any;
  statusValue: any;
  statusSus: any;
  oldpin: any;
  PVRstatus = false;
  forcemsg: any;
  plantype: any[] = [];
  rechargetype: any[] = [];
  packagenameList: any = [];
  p_name: any;
  selectedRechargetype: string = '';
  selectedpackagetype: string = '';
  datetype = false;
  isplantype = false;
  billtype: number = 0;
  paid: any;
  unpaid: any;

  timegap: any;
  duration: any;
  forcemessage: any;
  repeatfor: any;
  sus_reason: any;
  block_reason: any;
  new_boxid: any;
  rowData: any[] = [];
  rowData1: any[] = [];
  rowData3: any[] = [];
  selectedIds: number[] = [];
  gridApi: any;
  isAnyRowSelected: any = false;
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
  TotalLcoAmount: any;
  BTNFormControl = new FormControl('');

  plantypeSubject = new BehaviorSubject<{ [key: string]: number }>({});
  plantype$ = this.plantypeSubject.asObservable();
  selectedaddproof_1: any;

  selectedAddProofType: string = '';
  selectedIDProofType: string = '';

  maskPattern: string = '';
  maxLength: number | undefined;
  exampleFormat: string | undefined;
  form!: FormGroup;

  id_proof_list: { [key: string]: number } = {};
  add_proof_list: { [key: string]: number } = {};
  constructor(public dialogRef: MatDialogRef<SubscriberdialogueComponent>, private swal: SwalService,
    @Inject(MAT_DIALOG_DATA) public data: any, public userService: BaseService, public storageService: StorageService, private fb: FormBuilder, private zone: NgZone) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    console.log(data);
    this.sType = data?.type;
    this.subscribername = data['detailsList'].customername;
    this.operatorid = data['detailsList'].operatorid;
    this.subid = data['detailsList'].subid;
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
        id: this.subid,
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
        addressproof: ['', [Validators.required] || 0],
        idproof: ['', [Validators.required] || 0],
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




    this.userService.PackageList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      // this.p_name=data;
      console.log(data);
      this.packagenameList = data
      // this.packagenameList = data.map((item: any) => ({
      //   packagename: item.packagename,
      //   packageid: item.packageid
      // }));
      // this.p_name = this.packagenameList;
    })
    this.userService.getActiveCasList(this.role, this.username).subscribe((data: any) => {
      let v = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      // this.cas = data;
      this.cas = v
      console.log(this.cas);

    });


    this.userService.getNotinOperatorList(this.role, this.username, this.operatorid).subscribe((data: any) => {
      this.lco_list = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    })
    // this.userService.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
    //   this.plantype = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    //   this.selectedRechargetype = data;
    // })
    // this.userService.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
    //   this.plantype = data;

    //   console.log(this.plantype);
    // });
    this.userService.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      this.plantypeSubject.next(data);
    });
    this.userService.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      this.rechargetype = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    })
    this.userService.cancelSubscriptionOfSmartcardDetails(this.role, this.username, this.smartcardno).subscribe((data: any) => {
      console.log(data);
      this.TotalLcoAmount = data.totallcoamount;
      console.log(this.TotalLcoAmount);
      this.rowData1 = data.cancelproduct;
    })
    this.loadIdProofList();
    this.loadAddProofList();
  }
  loadIdProofList(): void {
    this.userService.getIdProofList(this.role, this.username).subscribe(
      (data: any) => {
        this.id_proof_list = data.idprooftypeid;
        console.log("ID Proof List", this.id_proof_list);
      },
      error => {
        console.error('Error fetching ID Proof List', error);
      }
    );
  }
  loadAddProofList(): void {
    this.userService.getAddresProofList(this.role, this.username).subscribe(
      (data: any) => {
        this.add_proof_list = data.addressprooftypeid;
        console.log("ADD Proof List", this.add_proof_list);
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
  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80, filter: false

    },
    {
      headerName: 'PACKAGE NAME	',
      field: 'productname', width: 200,
    },
    {
      headerName: 'CAS PRODUCT ID	 ', width: 200,
      field: 'ptype',
    },
    {
      headerName: 'BROADCASTER NAME	', width: 200,
      field: 'casproductid',
    },
    {
      headerName: 'CUSTOMER AMOUNT', width: 150, filter: false,
      field: 'noofdays',
    },
    {
      headerName: 'PROGRAMS', width: 150, filter: false,
      field: 'noofdays',
    },

  ]
  columnDefs2: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false

    },
    {
      headerName: 'PACKAGE NAME	',
      field: 'productname', width: 150,
    },
    {
      headerName: 'PACKAGE TYPE		 ', width: 250,
      field: 'ptype',
    },
    {
      headerName: 'REFUND AMOUNT		', width: 250,
      field: 'casproductid',
    },
    {
      headerName: 'DAYS', width: 250,
      field: 'noofdays',
    },


  ]

  private updateColumnDefs(type: string): void {
    if (type === 'remove') {
      this.columnDefs = [
        {
          headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false

        },
        {
          headerName: 'PACKAGE NAME	',
          field: 'productname', width: 150,
        },
        {
          headerName: 'PACKAGE TYPE		 ', width: 250,
          field: 'ptype',
        },
        {
          headerName: 'REFUND AMOUNT		', width: 250,
          field: 'casproductid',
        },
        {
          headerName: 'DAYS', width: 250,
          field: 'noofdays',
        },
      ]
    } else if (type === 'cancelsubscription') {
      this.columnDefs = [
        {
          headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false

        },
        {
          headerName: 'PACKAGE NAME	',
          field: 'productname', width: 150,
        },
        {
          headerName: 'PACKAGE TYPE		 ', width: 250,
          field: 'ptype',
        },
        {
          headerName: 'REFUND AMOUNT		', width: 250,
          field: 'casproductid',
        },
        {
          headerName: 'DAYS', width: 250,
          field: 'noofdays',
        },
      ]
    }
  }
  columnDefs1: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 200,

    },
    {
      headerName: 'SELECTED PACKAGES',
      field: 'productname', width: 200,
    },
  ]


  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.operatorid);
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
    this.userService.updatelogindetails(this.role, this.username, this.subid, this.islock, this.password).subscribe(
      (res: any) => {
        Swal.fire({
          title: 'Login details updated!',
          text: res?.message || 'The login details have been successfully updated.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          willClose: () => {
            window.location.reload();
          }
        });

      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error?.message || 'Failed to update login details. Please try again.',
          icon: 'error',
          confirmButtonText: 'Okay'
        });
      }
    );
  }


  // addSmartcard() {
  //   this.userService.addSmartcardToSubscriber(this.role, this.username, this.operatorid, this.castype, this.smartcard, this.boxid, this.subid)
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
      title: 'Uploading...',
      text: 'Please wait while your file is being uploaded.',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false, // Hide the confirm button
      didOpen: () => {
        Swal.showLoading(); // Show loading animation
      }
    });

    this.userService.addSmartcardToSubscriber(this.role, this.username, this.operatorid, this.castype, this.smartcard, this.boxid, this.subid).subscribe(
      (res: any) => {
        this.returndata = res;
        Swal.fire({
          icon: 'success',
          title: 'Smartcard Added Successfully',
          text: res?.message,
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.reload(); // Reload the page
        });
      },
      (err) => {
        this.returndata = err?.error;

        // On error, show error message
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add Smartcard',
          text: err?.error?.message,
          confirmButtonText: 'OK'
        });
      }
    );
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
    this.userService.UpdateSubscriberDetails(this.Editform.value)
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

  // smartcardlist(event: Event) {
  //   const target = event.target as HTMLSelectElement;
  //   const smartcard = target.value;
  //   this.userService.getBoxidBySmartcard(this.role, this.username, this.smartcard).subscribe((data: any) => {
  //     this.boxid = data;
  //     let boxid: any = document.getElementById("boxid");
  //     boxid!.value = data;
  //   })

  // }
  // casTypelist(event: Event) {
  //   const target = event.target as HTMLSelectElement;
  //   const castype = target.value;
  //   this.userService.getNotallocatedSmartcardListByCastypeAndOperatorid(this.role, this.username, this.operatorid, castype).subscribe((data: any) => {
  //     this.area = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
  //     console.log(this.area);

  //   })
  // }
  casTypelist(event: Event) {
    const target = event.target as HTMLSelectElement;
    const castype = target.value;

    // Call API to fetch smartcard list based on selected CAS type
    this.userService.getNotallocatedSmartcardListByCastypeAndOperatorid(this.role, this.username, this.operatorid, castype)
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
    this.userService.getBoxidBySmartcard(this.role, this.username, smartcard).subscribe((data: any) => {
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
    this.userService.getAreaListByOperatorid(this.role, this.username, lco)
      .subscribe((data: any) => {
        this.area_list = Object.entries(data.areaid).map(([key, value]) => ({ name: key, id: value }));

      });
  }
  onAreaStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const area = target.value;
    this.userService.getStreetListByAreaid(this.role, this.username, area)
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
    this.userService.getSubscriberIdListByOperatorid(this.role, this.username, lco).subscribe((data: any) => {
      this.sub_list = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    })

  }
  changeOperator() {
    this.userService.transferLcoToSmartcard(this.role, this.username, this.operatorid, this.lcoid, this.lcoareaid, this.lcostreetid, this.withsubscription, 0, 2)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  refreshSmartcard() {
    this.userService.refreshSmartcard(this.role, this.username, this.smartcardno, 0, 3)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  deactivationofSmartcard() {
    this.userService.deactivationofSmartcard(this.role, this.username, this.smartcardno, 2)

      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  pinchange() {
    this.userService.pinchange(this.role, this.username, this.smartcardno, this.newpin, 3, 0)

      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  pvrchange() {
    this.userService.pvrChange(this.role, this.username, this.smartcardno, this.PVRstatus, 3, 0)

      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  deleteForceMessage() {
    this.userService.deleteForceMessage(this.role, this.username, this.smartcardno)

      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  forcetuning() {
    this.userService.forceTuning(this.role, this.username, this.smartcardno)

      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  boxIdChange() {
    this.userService.boxIdChange(this.role, this.username, this.smartcardno, this.new_boxid, 0, 2)

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
    this.userService.sendMessage(payload)

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
  onActivationButtonClick(): void {
    
    this.getFirstTimeActivationConfirmation();
    this.toggleConfirmation();
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
        Swal.showLoading();
      }
    });
    this.userService.firsttimeActivationOfCard(requestBody).subscribe(
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
        Swal.showLoading();
      }
    });
    this.userService.ActivationOfCard(requestBody).subscribe(
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
  getFirstTimeActivationConfirmation() {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false, // Disable clicking outside the popup to close it
      didOpen: () => {
        Swal.showLoading(); // Display the loading spinner
      }
    });
    this.userService.getFirstTimeActivationConfirmation(this.role, this.username, this.newpackagename, this.selectedRechargetype, this.plantype || this.f_date, this.smartcardno, 1, 0)
      .subscribe((data: any) => {
        this.First_list = data;
        this.swal.success(data?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  lcotransferSinglesmartcard() {
    this.userService.lcotransferSinglesmartcard(this.role, this.username, this.operatorid, this.subid, this.f_subid, this.withsubscription, this.smartcardno, 0, 2)

      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  smartcardSuspend() {
    this.userService.smartcardSuspend(this.role, this.username, this.smartcardno, 0, 4, this.sus_reason)

      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  reactivationofSmartcard() {
    this.userService.reactivationofSmartcard(this.role, this.username, this.smartcardno, 0, 3)

      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  resume() {
    this.userService.smartcardResume(this.role, this.username, this.smartcardno, 0, 5,)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  block() {
    this.userService.blockSmartcard(this.role, this.username, this.smartcardno, 2, this.block_reason,)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  cancelSmartcard() {
    this.userService.cancelSmartcard(this.role, this.username, this.smartcardno, 2, 0,)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
}

