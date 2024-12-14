import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-subscription-based',
  templateUrl: './subscription-based.component.html',
  styleUrls: ['./subscription-based.component.scss']
})
export class SubscriptionBasedComponent implements OnInit {
  type: any;
  packageType: any;
  returndata: any;
  username: any;
  role: any;
  rowData: any;
  msodetails: any;
  productType: any = '';

  operatorNameList: any;
  filteredOperators: any[] = [];
  operatorList: any[] = [];
  selectedOperator: any;
  operatorid: any;
  pagedOperators: any;


  product: any = [
    { lable: "Base", value: 1 },
    { lable: "Addon", value: 2 },
    { lable: "Alacarte", value: 3 },
    { lable: "All", value: 4 },
  ];

  
  constructor(public dialogRef: MatDialogRef<SubscriptionBasedComponent>, private swal: SwalService, @Inject(MAT_DIALOG_DATA) public data: any, private excelService: ExcelService, public userService: BaseService, private cdr: ChangeDetectorRef, public storageservice: StorageService,) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(data);
    this.type = data.type
    // this.setType(this.type);
    // if (this.type === 'package') {
    //   this.packageType = 1;
    // } else if (this.type === 'addon_package') {
    //   this.packageType = 2;
    // } else {
    //   this.packageType = 0;
    // }
    this.getHeaderTitle(this.type);

  }
  ngOnInit(): void {
    this.loadOperators();
  }
  getHeaderTitle(type: string): string {
    switch (type) {
      case 'base_package':
        return 'As on Date Base Package Subscriber';
      case 'addon_package':
        return 'As on Date Addon Package Subscriber';
      case 'alacarte':
        return 'As-on-Date A-la-carte Active/Deactive Subscriber Report';
      case 'date_subscription':
        return 'As on Date Active/Deactive Subscription Report (All Types of Products)';
      default:
        return 'Unknown Type'; // Optional: Handle unexpected types
    }
  }

  onNoClick(): void {
    this.dialogRef.close(this.returndata);
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.operatorList.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
  }
  loadOperators() {
    this.userService.getOeratorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        return { name: key, value: value };
      });
      console.log(this.filteredOperators);

      this.filteredOperators = this.operatorList;
    });
  }
  onoperatorchange(operator: any): void {
    console.log(operator);
    this.selectedOperator = operator;
    this.operatorid = operator.value;
    // if (operator.value === 0) {
    //   this.operatorid = 0;
    //   this.selectedOperator = { name: 'ALL Operator', value: 0 };
    // } else {
    //   this.operatorid = operator.value;
    // }
    // this.userService.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
    //   (data: any) => {
    //     console.log(data);
    //     // this.operator_details = data;
    //     this.pagedOperators = data;
    //   },
    //   (error) => {
    //     console.error('Error fetching operator details', error);
    //   }
    // );
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  getExcel() {

  }
  getPDF() {

  }
}
