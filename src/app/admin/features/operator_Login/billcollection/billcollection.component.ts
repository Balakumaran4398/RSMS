import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { LcoSmartcardDialogComponent } from '../Dialog/lco-smartcard-dialog/lco-smartcard-dialog.component';

@Component({
  selector: 'app-billcollection',
  templateUrl: './billcollection.component.html',
  styleUrls: ['./billcollection.component.scss']
})
export class BillcollectionComponent implements OnInit {
  columnnDefs: any[] = [];
  rowData: any[] = [];
  @ViewChild('agGrid') agGrid: any;
  gridApi: any;
  role: any;
  username: any;
  selectedTab: string = 'lco';
  selectedLCO: any;
  selectedSubLCO: any;
  selectedSubscriber: any;

  fromdate: any;
  todate: any;

  recharge: any = '0';
  paid: any = '0';
  unpaid: any = '0';
  excess: any = '0';


  lcoDeatails: any;
  lcoId: any;
  bill_type: any = -1;
  useragent: any = 2;
  searchname: any;

  constructor(private dialog: MatDialog, private userService: BaseService, private storageService: StorageService, private swal: SwalService, private router: Router,) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }

  ngOnInit(): void {
    this.operatorIdoperatorId();
  }
  getFromDate(event: any) {
    console.log(event.value);
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date
    console.log(this.fromdate);
  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    console.log(this.todate);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.agGrid) {
      let newRowData;
      if (this.selectedTab === 'lco') {
        this.useragent = 2;
        this.rowData = [];
        this.onOperatorChange(this.selectedLCO);
        newRowData = this.getLCO('lco');
      } else if (this.selectedTab === 'sub_lco') {
        this.useragent = 4;
        this.rowData = [];
        this.onOperatorChange(this.selectedSubscriber);
        newRowData = this.getSubLCO('sub_lco');
      } else if (this.selectedTab === 'subscriber') {
        this.useragent = 5;
        this.rowData = [];
        newRowData = this.getSubscriber('subscriber');
        this.onOperatorChange(this.selectedSubscriber);
      }
    }
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.loadTableData("");
  }
  getLCO(operator: any) {
    console.log(operator);
  }
  getSubLCO(operator: any) {
    console.log(operator);
  }
  getSubscriber(operator: any) {
    console.log(operator);
  }

  onOperatorChange(selectedOperator: any) {
    // this.selectedOperator = selectedOperator;
    // this.lcomembershipid = selectedOperator.value;
    // if (this.selectedTab === 'lco') {

    //   this.rowData = [];
    //   this.userService.getDistributorCommissionListByLcoGroupId(this.role, this.username, this.lcomembershipid).subscribe(
    //     (response: HttpResponse<any[]>) => {
    //       if (response.status === 200) {
    //         this.rowData = response.body;

    //       } else if (response.status === 204) {
    //       }
    //     },
    //     (error) => this.handleError(error)
    //   );
    //   console.log(this.selectedOperator);

    // } else if (this.selectedTab === 'sub_lco') {
    //   if (this.lcomembershipid === '0') {
    //     this.lcomembershipid = 0;
    //   }
    //   this.rowData = [];
    //   this.userService.getLcoCommissionListByLcoGroupId(this.role, this.username, this.lcomembershipid)
    //     .subscribe(
    //       (response: HttpResponse<any[]>) => {
    //         if (response.status === 200) {
    //           this.rowData = response.body;
    //         } else if (response.status === 204) {
    //         }
    //       },
    //       (error) => this.handleError(error)
    //     );
    // }else if (this.selectedTab === 'subscriber') {
    //   if (this.lcomembershipid === '0') {
    //     this.lcomembershipid = 0;
    //   }
    //   this.rowData = [];
    //   this.userService.getLcoCommissionListByLcoGroupId(this.role, this.username, this.lcomembershipid)
    //     .subscribe(
    //       (response: HttpResponse<any[]>) => {
    //         if (response.status === 200) {
    //           this.rowData = response.body;
    //         } else if (response.status === 204) {
    //         }
    //       },
    //       (error) => this.handleError(error)
    //     );
    // }

  }

  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.lcoId = this.lcoDeatails?.operatorid;
      console.log(this.lcoId);
    })
  }
  total_paid: any;
  total_unpaid: any;
  total_recharge: any;
  total_excess: any;
  getreport() {
    console.log(this.lcoId);
    console.log(this.bill_type);
    this.userService.getbillCollectionReport(this.role, this.username, this.lcoId, this.bill_type || 0, this.useragent, this.fromdate, this.todate, this.searchname || null).subscribe((data: any) => {
      // this.rowData = data[0].list[0];
      this.rowData = data[0].list;
      this.total_paid = data[0].total_paid;
      this.total_unpaid = data[0].total_unpaid;
      this.total_recharge = data[0].total_recharge;
      this.total_excess = data[0].total_excess;
    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error);
    });
    this.rowData = [];
    // this.useragent = [], this.fromdate = [], this.todate = [], this.searchname = []
  }


  loadTableData(selectedTab: any) {
    console.log(`Selected Tab: ${selectedTab}`);

    this.columnnDefs = [
      {
        headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false
      },
      {
        headerName: "PAY OPTION", field: 'productname', width: 100, cellStyle: { textAlign: 'left' },
        cellRenderer: (params: any) => {
          const isActive = params.data.extra_amount === '0' || params.data.new_balance >= params.data.paid_amount;

          const payButton = document.createElement('button');
          payButton.innerHTML = '<img src="/assets/images/icons/Pay2.png" style="width:70px">';
          payButton.style.backgroundColor = 'transparent';
          payButton.style.color = 'rgb(2 85 13)';
          payButton.style.border = 'none';
          payButton.style.cursor = 'pointer';
          payButton.style.marginRight = '6px';
          payButton.addEventListener('click', () => {
            this.openEditDialog(params.data);
          });
          if (!isActive) {
            payButton.disabled = true;
            payButton.style.opacity = '0.5';
            payButton.title = 'Cannot pay, status is Deactive';

          } else {
            payButton.addEventListener('click', () => {
              this.openEditDialog(params.data);
            });
            payButton.title = 'Pay Now, status is Active';

          }
          const div = document.createElement('div');
          div.appendChild(payButton);
          return div;
        }

      },
      {
        headerName: "SMARTCARD", field: 'smartcard', width: 220,
        cellStyle: (params: any) => {
          if (params.data.someCondition) {
            return { backgroundColor: '#f4cccc' };
          } else {
            return null;
          }
        },

      },
      { headerName: "SUBSCRIBER NAME", field: 'customer_name', width: 180 },
      {
        headerName: "PAID", field: 'paid_amount', width: 120,
      },
      {
        headerName: "UN PAID", field: 'new_balance', width: 120,
      },
      {
        headerName: "EXCESS PAID", field: 'extra_amount',
        width: 150,
      },
      {
        headerName: "LAST COLLECTION DATE", field: 'collection_date', width: 200,
      },
      {
        headerName: "EXPIRY DATE", field: 'expiry_date', width: 180,
      },
      {
        headerName: "PACKAGE NAME", field: 'packages', width: 170,
      },
      {
        headerName: "STATUS", field: 'expiry_status', width: 170,
      },

    ]
  }

  openEditDialog(data: any): void {
    console.log(data);
    let dialalogData = { data: data, lcoid: this.lcoId, userarant: this.useragent }
    const dialogRef = this.dialog.open(LcoSmartcardDialogComponent, {
      width: '500px',
      data: dialalogData

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleError(error: any) {
    if (error.status === 400) {
      this.swal.Error_400();
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }


  getLcoInvoiceReport(reportType: number) {
    this.swal.Loading();
    this.userService.getBillCollectionReport(this.role, this.username, this.lcoId, this.bill_type, this.useragent, this.fromdate, this.todate, this.searchname || null, reportType).
      subscribe({
        next: (x: Blob) => {
          this.swal.Close();
          if (reportType === 1) {
            this.reportMaking(x, `Bill Collection_${this.lcoId}.pdf`, 'application/pdf');
          } else if (reportType === 2) {
            this.reportMaking(x, `Bill Collection_${this.lcoId}.xlsx`, 'application/xlsx');
          }
        },
        error: (error: any) => {
          this.swal.Close();
          this.pdfswalError(error?.error.message);
        }
      });
  }

  // -----------------------------------------------------common method for pdf and excel------------------------------------------------------------------------

  reportMaking(x: Blob, reportname: any, reporttype: any) {
    const blob = new Blob([x], { type: reporttype });
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = data;
    link.download = reportname.toUpperCase();
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    setTimeout(() => {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
    Swal.close();
  }
  pdfswalError(error: any) {
    console.log(error);

    Swal.close();
    Swal.fire({
      title: 'Error!',
      text: error?.message || 'There was an issue generating the PDF CAS form report.',
      icon: 'error',
      confirmButtonText: 'Ok',
      timer: 2000,
      timerProgressBar: true,
    });
  }
  processingSwal() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }
}
