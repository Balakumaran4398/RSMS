import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { RechargeConfirmationComponent } from '../../recharge-confirmation/recharge-confirmation.component';
declare var $: any;
// const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-bulkpackageupdation',
  templateUrl: './bulkpackageupdation.component.html',
  styleUrls: ['./bulkpackageupdation.component.scss']
})
export class BulkpackageupdationComponent implements OnInit {
  stopDialogue: boolean = false;
  startDialogue: boolean = false;
  ischeck: boolean = false;
  role: any;
  username: any;
  status: any;
  Type: any;
  rowData: any;
  rowData1: any[] = [];
  packageid: any = '';
  newpackagename: any = 0;
  packagenameList: any[] = [];
  filteredPackagenameList: any[] = [];
  lcomembershipList: any[] = [];
  filteredPackageList: any[] = [];
  filteredPackage: any[] = [];
  selectedPackage: any;
  selectedPackageName: any;
  isCheckboxPackageChecked: boolean = false;
  isCheckboxPlanChecked: boolean = false;
  plantype: any = 0;
  bulkDatas: any;
  operatorid: any;
  castype: any = '';
  casname: any = '';
  isallpack: boolean = false;
  searchTerm: any;
  cas: any;
  filteredCasList: { name: string; id: number }[] = [];
  plantype$ = new BehaviorSubject<{ key: string, value: number }[]>([]);
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 320,
      floatingFilter: true
    },
    paginationPageSize: 5,
    pagination: true,

  }


  datetype = false;
  isSubmit = false;
  lcodatetype: any;
  noofdays: any;
  f_date: any;
  dateTodateType: any;
  subdetailsList: any;
  plan = false;
  date = false;
  dateTodate = false;
  selectedRechargetype: any = 0;
  isplantype = false;

  isDisabled: boolean = true;
  isRecharge = false;
  rechargetype: any;
  rechargeType: any;
  planRechargeType: any[] = [
    { name: "Plan", id: 1 },
  ]
  lcoid: any;
  fromdate: any;
  todate: any;

  file: File | null = null;
  filePath: string = '';
  isFileSelected: boolean = false;
  submitted: boolean = false;

  amount_status: any;
  lco_Balance: any;
  totalLCO_amount: any;
  opid: any;
  retailerid: any;
  packagePlan: any;
  constructor(public dialogRef: MatDialogRef<BulkpackageupdationComponent>, private swal: SwalService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, public userservice: BaseService, private cdr: ChangeDetectorRef, public storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(data);
    this.plan = data?.plan;
    this.date = data?.date;
    this.file = data?.file;
    this.dateTodate = data?.dateTodate;
    console.log('plan=', this.plan + '     ' + 'date=', this.date + '     ' + 'dateTodate=', this.dateTodate);
    this.retailerid = data.retailerid;
    this.opid = data.operatorid;
    this.lcoid = data.lcoid;
    console.log('123214324324', this.opid);
    console.log('gjkfdgjkl', this.lcoid);
    console.log('gjkfdgjkl', this.retailerid);

    console.log(this.lcoid);
    this.fromdate = data.fromdate;
    this.todate = data.todate;
    this.Type = data?.status;
    this.castype = data?.castype;
    this.bulkDatas = data?.rowData[0];
    // this.operatorid = data?.rowData[0].operatorid || '';
    console.log(this.operatorid);
    console.log(this.bulkDatas);
    this.rowData = data?.rowData
    console.log(this.bulkDatas?.mobileno);

    // this.datetype = data?.fromdate && data?.todate && data.fromdate === data.todate
    this.lcodatetype = (data?.fromdate && data?.todate && data.fromdate === data.todate)
      ? this.getNextDay(data.fromdate)
      : null;
    this.f_date = this.lcodatetype;

    console.log(this.datetype);
    console.log(this.lcodatetype);

  }

  ngOnInit(): void {
    this.getPlanList();
    // this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
    //   this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
    //   this.filteredCasList = this.cas;
    // })
    // this.userservice.getBulkPackageList(this.role, this.username, this.castype).subscribe((data: any) => {
    //   console.log(data);
    //   this.lcomembershipList = Object.keys(data).map(key => {
    //     const value = data[key];
    //     const name = key;
    //     return { name: name, value: value };
    //   });
    //   console.log(this.lcomembershipList);
    //   this.filteredPackage = this.lcomembershipList
    // });
    this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      this.packagePlan = data;
      const sortedData = Object.entries(data)
        .map(([key, value]) => ({
          key: key.replace(/\(\d+\)/, '').trim(),
          value: value as number
        }))

      this.plantype$.next(sortedData);
      if (this.selectedRechargetype === 1) {
        const defaultPlan = sortedData.find(plan => plan.key === '1month');
        if (defaultPlan) {
          this.plantype = defaultPlan.value;
          console.log(this.plantype);
        }
      }
    });
    console.log(this.Type);

    // if (this.Type == 'bulk') {
    //   this.changePlan();
    // }
  }



  getPlanList() {


    // this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
    //   console.log(data);
    //   if (this.role != 'ROLE_OPERATOR' && this.role != 'ROLE_SUBLCO' && this.role != 'ROLE_SUBSCRIBER') {
    //     this.rechargetype = Object.keys(data).map(key => {
    //       const id = data[key];
    //       const name = key.replace(/\(\d+\)$/, '').trim();
    //       return { name: name, id: id };
    //     });
    //     this.cdr.detectChanges();
    //   } else if (this.role == 'ROLE_OPERATOR' || this.role == 'ROLE_SUBLCO') {
    //     console.log('123456789rfrd1234567', this.role);
    //     const rawList = Object.keys(data).map(key => {
    //       const id = data[key];
    //       const name = key.replace(/\(\d+\)$/, '').trim();
    //       return { name, id };
    //     });

    //     this.rechargetype = rawList.filter(item => {
    //       const name = item.name.toLowerCase();
    //       if (name === 'plan' && this.plan) return true;
    //       if (name === 'date' && this.date) return true;
    //       if (name === 'date-to-date' && this.dateTodate) return true;
    //       return false;
    //     });
    //     this.cdr.detectChanges();
    //   } else if (this.role == 'ROLE_SUBSCRIBER') {
    //     console.log('1234567890', this.role);
    //     const rawList = Object.keys(data).map(key => {
    //       const id = data[key];
    //       const name = key.replace(/\(\d+\)$/, '').trim();
    //       return { name, id };
    //     });
    //     console.log(rawList);
    //     this.rechargetype = rawList.filter(item => {
    //       const name = item.name.toLowerCase();
    //       if (name === 'plan' && this.plan) return true;
    //       if (name === 'date' && this.date) return true;
    //       if (name === 'date-to-date' && this.dateTodate) return true;
    //       return false;
    //     });
    //     this.cdr.detectChanges();
    //   }
    //   this.cdr.detectChanges();
    //   console.log(this.rechargetype);
    // })

    console.log(this.Type);
    console.log(this.role);

    this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      console.log(data);

      if (this.role != 'ROLE_OPERATOR' && this.role != 'ROLE_SUBLCO' && this.role != 'ROLE_SUBSCRIBER' && this.role == 'ROLE_ADMIN') {

        if (this.fromdate == this.todate) {
          this.rechargetype = Object.keys(data).map(key => {
            const id = data[key];
            const name = key.replace(/\(\d+\)$/, '').trim();
            return { name: name, id: id };
          });
        } else {
          const rawList = Object.keys(data).map(key => {
            const id = data[key];
            const name = key.replace(/\(\d+\)$/, '').trim();
            return { name, id };
          });
          console.log('RAW LIST', rawList);

          if (this.fromdate !== this.todate) {
            console.log('1111', rawList);
            this.rechargetype = rawList.filter(item => {
              const name = item.name.toLowerCase();
              console.log(name);
              return (name === 'plan');
            });
            console.log('2222', this.rechargetype);
          } else {
            this.rechargetype = rawList.filter(item => {
              const name = item.name.toLowerCase();
              return (
                (name === 'plan' && this.plan) ||
                (name === 'date' && this.date) ||
                (name === 'date-to-date' && this.dateTodate)
              );
            });
          }
        }
        console.log('RECHARGE TYPE', this.rechargetype);


        this.cdr.detectChanges();
      }
      else if (this.role == 'ROLE_OPERATOR' || this.role == 'ROLE_SUBLCO') {
        console.log('123456789rfrd1234567', this.role);
        const rawList = Object.keys(data).map(key => {
          const id = data[key];
          const name = key.replace(/\(\d+\)$/, '').trim();
          return { name, id };
        });
        if (this.fromdate !== this.todate) {
          this.rechargetype = rawList.filter(item => {
            const name = item.name.toLowerCase();
            if (name === 'plan' && this.plan) return true;
            // if (name === 'date' && this.date) return true;
            // if (name === 'date-to-date' && this.dateTodate) return true;
            return false;
          });
        } else {
          this.rechargetype = rawList.filter(item => {
            const name = item.name.toLowerCase();
            if (name === 'plan' && this.plan) return true;
            if (name === 'date' && this.date) return true;
            if (name === 'date-to-date' && this.dateTodate) return true;
            return false;
          });
        }
        this.cdr.detectChanges();
      } else if (this.role == 'ROLE_SUBSCRIBER') {
        console.log('1234567890', this.role);
        const rawList = Object.keys(data).map(key => {
          const id = data[key];
          const name = key.replace(/\(\d+\)$/, '').trim();
          return { name, id };
        });
        console.log(rawList);
        if (this.fromdate !== this.todate) {
          this.rechargetype = rawList.filter(item => {
            const name = item.name.toLowerCase();
            if (name === 'plan' && this.plan) return true;
            return false;
          });
        } else {
          this.rechargetype = rawList.filter(item => {
            const name = item.name.toLowerCase();
            if (name === 'plan' && this.plan) return true;
            if (name === 'date' && this.date) return true;
            if (name === 'date-to-date' && this.dateTodate) return true;
            return false;
          });
        }
        this.cdr.detectChanges();
      } else if (this.role == 'ROLE_OPERATOR' || this.role == 'ROLE_SUBLCO') {
        console.log('123456789rfrd1234567', this.role);
        const rawList = Object.keys(data).map(key => {
          const id = data[key];
          const name = key.replace(/\(\d+\)$/, '').trim();
          return { name, id };
        });
        if (this.fromdate !== this.todate) {
          this.rechargetype = rawList.filter(item => {
            const name = item.name.toLowerCase();
            if (name === 'plan' && this.plan) return true;
            // if (name === 'date' && this.date) return true;
            // if (name === 'date-to-date' && this.dateTodate) return true;
            return false;
          });
        } else {
          this.rechargetype = rawList.filter(item => {
            const name = item.name.toLowerCase();
            if (name === 'plan' && this.plan) return true;
            if (name === 'date' && this.date) return true;
            if (name === 'date-to-date' && this.dateTodate) return true;
            return false;
          });
        }
        this.cdr.detectChanges();
      }
      this.cdr.detectChanges();
      console.log(this.rechargetype);
    })
  }
  onSelectionrechargetype(selectedValue: string) {
    if (this.Type == 'excel_upload') {
      const rechargetype = Number(selectedValue);
      if (rechargetype == 1) {
        this.isSubmit = true;
        this.isplantype = true;
        this.datetype = false;
        const defaultPlan = this.plantype$.getValue().find(plan => plan.key === '1month');
        if (defaultPlan) {
          this.plantype = defaultPlan.value;
        }
        this.isDisabled = false;

      }
    } else {
      const rechargetype = Number(selectedValue);
      if (rechargetype == 1) {
        this.isSubmit = true;
        this.isplantype = true;
        this.datetype = false;
        const defaultPlan = this.plantype$.getValue().find(plan => plan.key === '1month');
        if (defaultPlan) {
          this.plantype = defaultPlan.value;
        }
        this.isDisabled = false;
      }
      if (rechargetype == 2) {
        this.isSubmit = true;
        this.isplantype = false;
        this.datetype = true;
        this.plantype = 0;
        this.isDisabled = true;
      }
      if (rechargetype == 3) {
        this.isSubmit = true;
        this.dateTodate;
        this.isplantype = false;
        this.datetype = false;
        this.plantype = 0;
        this.f_date = null;
        this.isDisabled = false;
      }
      this.isRecharge = true;
    }
  }


  columnDefs: any[] = [
    { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, },
    { headerName: 'CUSTOMER NAME', field: 'customername', width: 300, cellStyle: { textAlign: 'left' } },
    { headerName: 'SMARTCARD', field: 'smartcard', width: 300, },
    { headerName: 'BOX ID', field: 'boxid', width: 400, },
    { headerName: 'PACKAGE NAME', field: 'productname', width: 400, cellStyle: { textAlign: 'left' } },
    { headerName: 'EXPIRY DATE', field: 'expirydate', width: 350, },
  ]
  columnDefs1: any[] = [
    { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 70 },
    { headerName: 'PACKAGE NAME', field: 'packagename', width: 230, },
    { headerName: 'SUBSCRIBER COUNT', field: 'count', width: 120, },
    { headerName: 'LCO PRICE', field: 'lcoprice', width: 120, },
    { headerName: 'CUSTOMER PRICE', field: 'customeramount', width: 120, },
    { headerName: 'TOTAL LCO AMOUNT', field: 'totallcoamount', width: 100, },
    { headerName: 'TOTAL CUSTOMER AMOUNT  ', field: 'totalcustamount', width: 165, },
  ]
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filteredCasList = this.filteredcas();
  }
  filteredcas(): { name: string; id: number }[] {
    if (!this.searchTerm) {
      return this.cas;
    }
    return this.cas.filter((casItem: any) =>
      casItem.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  onSelectionFingerPrint(selectedValue: any, autocompleteInput: HTMLInputElement) {
    console.log(selectedValue);
    this.castype = selectedValue.id;
    this.casname = selectedValue.name;
    this.fetchPackageList();
    console.log(this.casname);
    console.log(this.castype);
    this.autocompleteTrigger.closePanel();
    autocompleteInput.blur();

  }


  getNextDay(dateString: any): string | null {
    console.log(dateString);
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  getNextDay1(): string | null {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
  fetchPackageList() {
    console.log(this.castype);
    this.userservice.getBulkPackageList(this.role, this.username, this.castype).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200 && response.body) {
          if (typeof response.body === 'object' && response.body !== null) {
            this.lcomembershipList = Object.entries(response.body).map(([key, value]) => ({
              name: key,
              value: value
            }));
            this.cdr.detectChanges();
            this.filteredPackageList = [...this.lcomembershipList];
            this.cdr.detectChanges();
            // this.swal.Success_200();
          } else {
            this.swal.Error_400();
          }
        } else if (response.status === 204) {
          this.swal.Success_204();
          this.filteredPackageList = [];
        }
      },
      (error) => {
        console.error('Error fetching package list:', error);

        if (error.status === 400) {
          this.swal.Error_400(); // Bad request
        } else if (error.status === 500) {
          this.swal.Error_500(); // Internal server error
        } else {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error'); // Generic error
        }
      }
    );
  }
  start() {
    this.swal.Loading();
    this.userservice.StartOrStopBulkPackageService(this.role, this.username, 'true')
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  stop() {
    this.swal.Loading();
    this.userservice.StartOrStopBulkPackageService(this.role, this.username, 'false')
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  ngAfterViewInit() {

    $('#package').select2({
      placeholder: 'Select a Package Name',
      allowClear: true
    });
    $('#package').on('change', (event: any) => {
      this.newpackagename = event.target.value;
      // this.onSelectionrechargetype(event);
    });
  }
  onCheckboxPackageChange(event: Event): void {
    this.isCheckboxPackageChecked = (event.target as HTMLInputElement).checked;
    // this.setCheckboxState(checked); 
  }
  setCheckboxState(checked: boolean): void {
    this.isCheckboxPackageChecked = checked;
    if (!checked) {
      this.packageid = null;
      // this.packageSearch = '';
      this.filteredPackageList = [];
    } else {
      this.fetchPackageList();
    }
  }
  onCheckboxPlanChange(event: Event): void {
    this.isCheckboxPlanChecked = (event.target as HTMLInputElement).checked;
  }
  onproducttypechange(selectedOperator: any) {
    this.selectedPackage = selectedOperator;
    this.selectedPackageName = selectedOperator.name;
  }
  filterPackage(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredPackage = this.lcomembershipList.filter((operator: any) =>
      operator.name.toLowerCase().includes(filterValue)
    );
    // this.filteredPackage = this.operatorList;
    console.log(this.filteredPackage);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  displayCas(casItem: any): string {
    return casItem ? casItem.name : '';
  }


  onSelectiondatetype(selectedValue: string) {
    // this.cdr.detectChanges();
    const rechargetype = Number(selectedValue);
    console.log('selectrdvalue', selectedValue);

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

    if ((this.selectedRechargetype == '3') || (this.selectedRechargetype != '3' && this.plantype != 0) || (this.f_date)) {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }


  }

  Submit() {
    let requestBody = {
      role: this.role,
      username: this.username,
      operatorid: this.operatorid || 0,
      packageid: this.packageid || this.data?.packageid || 0,
      plan: this.plantype || this.f_date || 4,
      plantype: this.selectedRechargetype,
      isallpack: this.isallpack,
      expiredsubscriberlist: this.rowData,
      retailerid: this.retailerid || 0,
    }
    this.swal.Loading();
    this.userservice.bulkPackageUpdation(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  openLoginPage(): void {
    let requestBody = {
      role: this.role,
      username: this.username,
      operatorid: this.opid || this.lcoid || 0,
      packageid: this.packageid || this.data?.packageid || 0,
      plan: this.plantype || this.f_date || 4,
      plantype: this.selectedRechargetype,
      isallpack: this.isallpack,
      expiredsubscriberlist: this.rowData,
      retailerid: this.retailerid || 0,
      lcoBalance: this.lco_Balance,
      TotalLCO_Amount: this.totalLCO_amount,
      Amount_Status: this.amount_status
    }
    let width = '500px';
    console.log(requestBody);
    this.userservice.bulkPackageUpdaionConfirmation(requestBody)
      .subscribe((data: any) => {
        this.amount_status = data?.amountStatus;
        this.totalLCO_amount = data?.totalLcoAmount;
        this.lco_Balance = data?.lcoBalance;
        const dialogRef = this.dialog.open(RechargeConfirmationComponent, {
          width: '500px',
          panelClass: 'custom-dialog-container',
          data: {
            role: this.role,
            username: this.username,
            operatorid: this.opid || this.lcoid || 0,
            packageid: this.packageid || this.data?.packageid || 0,
            plan: this.plantype || this.f_date || 4,
            plantype: this.selectedRechargetype,
            isallpack: this.isallpack,
            expiredsubscriberlist: this.rowData,
            retailerid: this.retailerid || 0,
            lcoBalance: this.lco_Balance,
            TotalLCO_Amount: this.totalLCO_amount,
            Amount_Status: this.amount_status
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });

      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }


  getBulkPackageUpdation() {
    console.log(this.file);
    this.submitted = true;
    if (this.file) {
      console.log(this.file);
      const formData = new FormData();
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('file', this.file);
      formData.append('type', '11');
      formData.append('plan', this.selectedRechargetype);
      formData.append('planid', this.plantype);
      formData.append('retailerid', this.retailerid || 0);
      this.swal.Loading();
      this.userservice.getUploadFileforPackageUpdation(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No file selected. Please choose a file to upload.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
