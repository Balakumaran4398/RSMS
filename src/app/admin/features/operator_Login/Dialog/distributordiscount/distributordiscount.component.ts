import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { DistribtorupdatediscountComponent } from '../distribtorupdatediscount/distribtorupdatediscount.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-distributordiscount',
  templateUrl: './distributordiscount.component.html',
  styleUrls: ['./distributordiscount.component.scss']
})
export class DistributordiscountComponent implements OnInit {
  role: any;
  username: any;
  type: any;
  data_details: any;
  customeramount: any = '0.0';
  paymentMode: any = 'Cash';
  selectpackage: any = 0;
  selectOperator: any;
  lcoDeatails: any;
  operatorid: any;
  packageList: any[] = [];
  filteredPackageList: any;
  operatorList: any[] = [];
  selectedType: string = ''
  packageid: any;
  msoamount: any;
  oldmsoamount: any = '0.0';
  newmsoamount: any;
  gridApi: any;
  rowData: any;
  packageDetails: any;

  retailerid: any = 0;
  rechargeAmount: any;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;

        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          if (normalizedA < normalizedB) return -1;
          if (normalizedA > normalizedB) return 1;
          return 0;
        }
      },
    },
    paginationPageSize: 10,
    pagination: true,
  };
  lco_operatorId: any;

  toppings = new FormControl([]);
  toppingList: any[] = [];

  lcoOperatorId: any;
  lcoParentOperatorId: any;

  constructor(public dialogRef: MatDialogRef<DistributordiscountComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, public dialog: MatDialog, private userService: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.type = data.type;
    console.log(data);
    this.data_details = data;
    console.log(this.type);
    this.lco_operatorId = data?.data;
    console.log(this.lco_operatorId);


    // this.lcoOperatorId = this.data_details.operatorid;
    this.lcoParentOperatorId = data?.opId;
    console.log(this.lcoOperatorId);
    console.log('lcoParentOperatorId', this.lcoParentOperatorId);
  }

  ngOnInit(): void {
    this.operatorIdoperatorId();
  }

  filterToppings(event: any) {
    console.log(event);
    const filterValue = event.target.value.toLowerCase();

    this.operatorList = this.toppingList.filter(topping =>
      topping.name.toLowerCase().includes(filterValue)
    );
    console.log(this.operatorList);

  }
  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorid = this.lcoDeatails?.operatorid;
      this.distributorid = this.lcoDeatails?.distributorid;

      this.getDistributorPackageList();
      this.onOperatorList();

      // if (this.type = 'sub_lco_recharge') {
      this.getRetailerList();
      // this.onPackageChangeList()
      // }
    })
  }
  onOperatorChange() {
    console.log('all', this.selectOperator);
    if (this.selectOperator == "0") {
      this.selectOperator = this.operatorList.map(op => op.operatorid);
    }
  }
  filteredPackage: any[] = [];
  onPackageChangeList(selectedPackageId: number) {
    this.selectpackage = selectedPackageId;
    if (!this.packageList || this.packageList.length === 0) {
      console.error("Error: packageList is empty or not loaded yet.");
      return;
    }
    const selectedPackage = this.packageList.find(pkg => pkg.packid == selectedPackageId);
    if (!selectedPackage) {
      console.error(`Error: No package found with packid = ${selectedPackageId}`);
      return;
    }
    const selectedProductId = selectedPackage.productid;
    this.filteredPackageList = this.packageList.filter(pkg => pkg.productid === selectedProductId);
    this.filteredPackage = this.filteredPackageList.length > 0 ? this.filteredPackageList[0] : null;
    this.customeramount = this.filteredPackageList[0]?.customeramount;
    this.oldmsoamount = this.filteredPackageList[0].msoamount;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  distributorid: any;
  productid: any;
  productname: any;
  lcolistid: any;
  retailerList: any[] = [];
  getDistributorPackageList() {
    this.userService.getDistributorPackageList(this.role, this.username, this.lco_operatorId || this.operatorid, this.distributorid).subscribe((data: any) => {
      // this.userService.getDistributorPackageList(this.role, this.username, this.lco_operatorId , this.operatorid).subscribe((data: any) => {
      this.packageList = data;
      this.filteredPackageList = data;
      this.rowData = data;
      this.packageDetails = data;
      // this.productid = data.productid;
      this.productid = data.packid;
      this.productname = data.productname;
      console.log(data);
    })
  }
  onOperatorList() {
    this.userService.getAllLcoList(this.role, this.username, this.operatorid).subscribe((data: any) => {
      this.operatorList = data;
      this.lcolistid = data.operatorid;
    })
  }




  getDistributorPackage(packageId?: number) {
    this.userService.getDistributorPackageList(this.role, this.username, this.lco_operatorId, packageId || this.distributorid || 1)
      // this.userService.getDistributorPackageList(this.role, this.username, this.operatorid, packageId || this.distributorid || 1)
      .subscribe((data: any) => {
        this.packageList = data;
        this.rowData = data;
        this.packageDetails = data;

        // Ensure product details update correctly
        if (data.length > 0) {
          this.productid = data[0]?.productid;
          this.productname = data[0]?.productname;
        }

        console.log("Updated Data:", data);
      });
  }
  getDistributorDiscount() {
    if (!this.validateAmount()) {
      return;
    }
    this.swal.Loading();
    this.userService.getupdatedistributorDiscount(this.role, this.username, this.selectOperator, this.operatorid, this.selectpackage, this.customeramount || 0, this.oldmsoamount || 0,
      this.newmsoamount).subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
  }

  getPackageDistributorDiscount() {
    this.userService.getupdatedistributorDiscount(this.role, this.username, this.operatorid, this.lcolistid, this.productid, this.msoamount || 0, this.oldmsoamount || 0,
      this.newmsoamount).subscribe((res: any) => {
        this.swal.success_1(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
  }

  retailerError: boolean = false;
  amountError: boolean = false;
  amountErrorMessage: string = '';

  clearRetailerError() {
    this.retailerError = false;
  }

  clearAmountError() {
    this.amountError = false;
    this.amountErrorMessage = '';
  }
  validateAndRecharge() {
    this.retailerError = false;
    this.amountError = false;
    this.amountErrorMessage = '';

    // if (!this.retailerid || this.retailerid === 0) {
    //   this.retailerError = true;
    //   return;
    // }

    const amount = Number(this.rechargeAmount);
    if (!this.rechargeAmount || isNaN(amount)) {
      this.amountError = true;
      this.amountErrorMessage = 'Please enter a valid amount.';
      return;
    }
    if (amount <= 0) {
      this.amountError = true;
      this.amountErrorMessage = 'Amount must be greater than zero.';
      return;
    }
    this.amountError = false;
    // If validation passes, proceed with recharge
    this.getRetailerRecharge();
  }

  ngAfterViewInit() {
   ($('#operator') as any).select2({
      placeholder: 'Select Retailer',
      allowClear: true
    });
    $('#operator').on('change', (event: any) => {
      console.log(event);
      this.selectOperator = event.target.value;
      console.log(this.selectOperator)
      if (this.selectOperator == 0 || this.selectOperator == '') {
        this.selectOperator = this.operatorList.map(op => op.operatorid);
        console.log(this.selectOperator);
      }
    });
    ($('#package')as any).select2({
      placeholder: 'Select Package',
      allowClear: true
    });
    $('#package').on('change', (event: any) => {
      this.selectpackage = event.target.value;
      console.log(this.selectpackage)
      this.onPackageChangeList(this.selectpackage);
    });
  }
  getRetailerRecharge() {
    this.swal.Loading();
    this.userService.getretailerOfflineRecharge(this.role, this.username, this.operatorid, this.retailerid || this.selectOperator, this.rechargeAmount).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error);
    });
  }

  getRetailerList() {
    this.userService.getRetailerListByOpid(this.role, this.username, this.operatorid).subscribe((data: any) => {
      console.log(data);
      this.retailerList = data;
      // this.swal.success_1(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error);
    });
  }

  columnDefs = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "PACKAGE NAME	", field: 'productname', width: 200, },

    { headerName: "AMOUNT", field: 'packagerate', width: 200, },
    { headerName: "MSO AMOUNT", field: 'msoamount', width: 200, },
    { headerName: "LCO AMOUNT	", field: 'subdisamt', width: 200, },
    { headerName: "COMMISSION", field: 'subdiscommission', width: 200, },
    {
      headerName: "ACTION", width: 200, cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<img src="/assets/images/icons/editstreet2.png" style="width:30px;background-color:none">';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Edit';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.openaddedlogue('edit_Package', params.data);

        });

        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      },
    },
  ];

  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  openaddedlogue(type: any, data: any,) {
    let dialogData = { type: type, data: data, opId: this.lco_operatorId };
    console.log(dialogData);
    const dialogRef = this.dialog.open(DistribtorupdatediscountComponent, {
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  errorMessage: any = '';

  validateAmount(): boolean {
    if (!this.newmsoamount || this.newmsoamount.toString().trim() === '') {
      this.errorMessage = 'Please enter the LCO Amount';
      return false;
    } else if (this.newmsoamount < this.oldmsoamount) {
      this.errorMessage = `Enter LCO Amount Above Rs.${this.oldmsoamount}`;
      return false;
    } else if (this.newmsoamount > this.customeramount) {
      this.errorMessage = `Enter  LCO Amount Below  Rs.${this.customeramount}`;
      return false;
    } else {
      this.errorMessage = '';
      return true;
    }
  }
}
