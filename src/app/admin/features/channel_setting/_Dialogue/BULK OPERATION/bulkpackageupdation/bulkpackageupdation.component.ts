import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
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
  rowData1: any[]=[];
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
  constructor(public dialogRef: MatDialogRef<BulkpackageupdationComponent>, private swal: SwalService,
    @Inject(MAT_DIALOG_DATA) public data: any, public userservice: BaseService, private cdr: ChangeDetectorRef, public storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(data);
    this.Type = data?.status;
    this.castype = data?.castype;
    this.bulkDatas = data?.rowData[0];
    this.operatorid = data?.rowData[0].operatorid;
    console.log(this.bulkDatas);
    this.rowData = data?.rowData
    console.log(this.bulkDatas?.mobileno);
  }
  ngOnInit(): void {

    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
      this.filteredCasList = this.cas;
    })


    this.userservice.getBulkPackageList(this.role, this.username, this.castype).subscribe((data: any) => {
      console.log(data);
      this.lcomembershipList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      console.log(this.lcomembershipList);
      this.filteredPackage = this.lcomembershipList
    });
    this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      const sortedData = Object.entries(data)
        .map(([key, value]) => ({
          key: key.replace(/\(\d+\)/, '').trim(),
          value: value as number
        }))
      this.plantype$.next(sortedData);
    });
  }
  columnDefs: any[] = [
    { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80, },
    { headerName: 'CUSTOMER NAME', field: 'customername', width: 100, },
    { headerName: 'SMARTCARD', field: 'smartcard', width: 210, },
    { headerName: 'BOX ID', field: 'boxid', width: 150, },
    { headerName: 'PACKAGE NAME', field: 'productname', width: 220, },
    { headerName: 'EXPIRY DATE', field: 'expirydate', width: 160, },
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
  fetchPackageList() {
    console.log(this.castype);
    console.log('checking 1');
    this.userservice.getBulkPackageList(this.role, this.username, this.castype).subscribe(
      (response: HttpResponse<any>) => {
        console.log('checking 2',response);
        if (response.status === 200 && response.body) {
          console.log(response.body);
          if (typeof response.body === 'object' && response.body !== null) {
            console.log('checking 3');
            this.lcomembershipList = Object.entries(response.body).map(([key, value]) => ({
              name: key,
              value: value
            }));
            this.cdr.detectChanges();
            this.filteredPackageList = [...this.lcomembershipList];
            console.log('checking 4');

            console.log('Transformed Package List:', this.lcomembershipList);
            this.cdr.detectChanges();
            console.log('checking 5');

            // this.swal.Success_200();
          } else {
            console.error('Response body is not a valid object:', response.body);
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
    this.changePlan();
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

  changePlan() {
    let requestBody = {
      role: this.role,
      username: this.username,
      operatorid: this.operatorid,
      packageid: this.packageid || this.data?.packageid || 0,
      plantype: this.plantype,
      // isallpack: this.isallpack,
      expiredsubscriberlist: this.rowData

    }
    // this.swal.Loading();
    this.userservice.bulkPackageUpdaionConfirmation(requestBody)
      .subscribe((res: any) => {
        this.rowData1 = res;
        console.log(this.rowData1);

        // this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  Submit() {
    let requestBody = {
      role: this.role,
      username: this.username,
      operatorid: 1,
      packageid: this.packageid || this.data?.packageid || 0,
      plantype: this.plantype,
      isallpack: this.isallpack,
      expiredsubscriberlist: this.rowData,
    }
    this.swal.Loading();
    this.userservice.bulkPackageUpdation(requestBody)
      .subscribe((res: any) => {
        // this.rowData1=res;
        // console.log(this.rowData1);

        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
}
