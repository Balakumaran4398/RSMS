import { Component, Inject, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { DiscountdialogComponent } from '../discountdialog/discountdialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SwalService } from 'src/app/_core/service/swal.service';
import { data } from 'jquery';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-discountsmartcard',
  templateUrl: './discountsmartcard.component.html',
  styleUrls: ['./discountsmartcard.component.scss']
})
export class DiscountsmartcardComponent implements OnInit {
  role: any;
  username: any;

  gridApi: any;
  rowData: any;
  rowData1: any;

  smartcard: any;
  packageid: any;
  lcoDeatails: any;
  lcoId: any;
  areaid: any;

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
  type: any;
  data_details: any;
  areaid1: any;


  orderid: any;
  customeramount: any;
  lcocommission: any;
  msoAmount: any;
  constructor(public dialogRef: MatDialogRef<DiscountdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute, private userService: BaseService, private storageService: StorageService, private swal: SwalService, public dialog: MatDialog,) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    this.type = data.type;
    this.data_details = data.data;
    this.smartcard = this.data_details?.smartcard;
    this.areaid = this.data_details?.area_id;
    this.areaid1 = this.data_details?.area_id;
    this.getColumnDefs(this.type);
    console.log(data.data);
    this.lcocommission = data?.data?.lco_commission;
    this.orderid = data?.data?.order_id;
    this.customeramount = data?.data?.customer_amount;
    this.msoAmount = data?.data?.mso_amount;



  }
  ngOnInit(): void {
    this.operatorIdoperatorId();
    //  if (this.type == 'smartcard') {
    //   this.getSmartcardDetails();
    // } else if (this.type == 'plan') {
    //   this.getplanwiseDetails()
    // }
  }

  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.lcoId = this.lcoDeatails?.operatorid;
      console.log(this.lcoId);
      // this.getSmartcardDetails();
      // this.getplanwiseDetails();
      if (this.type == 'smartcard') {
        this.getSmartcardDetails(this.lcoId);
      } else if (this.type == 'plan') {
        this.getplanwiseDetails()
      }
    })
  }
  getSmartcardDetails(lcoid:any) {
    console.log(lcoid);

    this.userService.getSmartcardWiseDiscountList(this.role, this.username, lcoid, this.areaid, this.smartcard).subscribe((data: any) => {
      console.log(data);
      this.rowData = data
    })
  }

  getplanwiseDetails() {
    this.userService.getPlanDiscountDetailsByOpidPackageid(this.role, this.username, this.lcoId, this.orderid, this.customeramount, this.lcocommission, false,this.msoAmount).subscribe((data: any) => {
      console.log(data);
      this.rowData1 = data
    })
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  columnDefs: any[] = [];
  private getColumnDefs(type: any) {
    console.log(type);

    if (type === 'smartcard') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, },
        { headerName: "PACKAGE NAME", field: 'product_name', width: 200, },
        { headerName: 'CUSTOMER AMOUNT', width: 200, field: 'customer_amount', },
        { headerName: 'RATE', width: 250, field: 'package_rate' },
        { headerName: 'MSO AMOUNT', width: 200, field: 'mso_amount', },
        { headerName: 'LCO COMMISSION', field: 'new_commission_value', width: 200, },
        { headerName: 'CUSTOMER SELLING PRICE', field: 'cusdiscprice', width: 200, },
        { headerName: 'DISCOUNT', width: 250, field: 'discount_value', },
        {
          headerName: 'ACTION', field: '', width: 200, filter: false,
          cellRenderer: (params: any) => {
            const updateButton = document.createElement('button');
            updateButton.innerHTML = '<button style="width: 7em;background-color: #4c6b79;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Edit</p></button>';
            updateButton.style.backgroundColor = 'transparent';
            updateButton.style.border = 'none';
            updateButton.title = 'EDIT';
            updateButton.style.cursor = 'pointer';
            updateButton.addEventListener('click', () => {
              const packageId = params.data.packageid;
              const smartcard = params.data.smartcard;
              console.log(smartcard);
              this.openaddedlogue('smartcard', params.data);
              console.log(params.data.smartcard);
            });
            const div = document.createElement('div');
            div.appendChild(updateButton);
            return div;
          },
        },
      ];
    } else {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, },
        { headerName: "PACKGE NAME", field: 'package_name', width: 200, },
        { headerName: 'RATE', width: 200, field: 'customer_amount', },
        {
          headerName: 'ACTION', field: '', width: 200, filter: false,
          cellRenderer: (params: any) => {
            const updateButton = document.createElement('button');
            updateButton.innerHTML = '<button style="width: 7em;background-color: #4c6b79;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Discount</p></button>';
            updateButton.style.backgroundColor = 'transparent';
            updateButton.style.border = 'none';
            updateButton.title = 'Discount';
            updateButton.style.cursor = 'pointer';
            updateButton.addEventListener('click', () => {
              const packageId = params.data.packageid;
              const smartcard = params.data.smartcard;
              console.log(smartcard);
              this.openaddedlogue('plan', params.data);
              console.log(params.data.smartcard);
            });
            const div = document.createElement('div');
            div.appendChild(updateButton);

            return div;
          },
        },
      ];
    }
  }


  openaddedlogue(type: any, data: any) {
    console.log(this.areaid);
    let dialogData = { type: type, data: data, area: this.areaid, smartcard: this.smartcard };
    console.log(dialogData);
    const dialogRef = this.dialog.open(DiscountdialogComponent, {
      panelClass: 'custom-dialog-container',
      data: dialogData,
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
