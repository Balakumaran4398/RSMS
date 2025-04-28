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
import { OperatorService } from 'src/app/_core/service/operator.service';

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
  lcoName: any;
  bill_type: any = -1;
  useragent: any = 2;
  searchname: any;
  subLcoDetails: any;
  retailerId: any;
  retailerName: any;
  mobilenumber: any;
  address: any;
  balance: any;

  total_paid: any;
  total_unpaid: any;
  total_recharge: any;
  total_excess: any;

  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  selectCount: number[] = [];

  public rowSelection: any = "multiple";
  constructor(private dialog: MatDialog, private userService: BaseService, private storageService: StorageService, private swal: SwalService, private router: Router, private operator: OperatorService) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    console.log(operator);
    // this.subLcoDetails = operator?.lcoDeatails;
    // this.retailerId = operator?.retailerId;
    // console.log(this.retailerId);
    // this.retailerName = this.subLcoDetails?.retailername;
    // this.mobilenumber = this.subLcoDetails?.contactnumber;
    // this.address = this.subLcoDetails?.address;
    // this.balance = this.subLcoDetails?.balance;
  }

  ngOnInit(): void {
    if (this.role == 'ROLE_OPERATOR') {
      this.operatorIdoperatorId();
    } else if (this.role == 'ROLE_SUBLCO') {
      this.SubLCOIdoperatorId()
    }
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

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.selectCount = selectedRows.length
      // Extracting IDs from selected rows
      this.selectedIds = selectedRows.map((e: any) => e.id);

      // Extracting 'isactive' from selected rows
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);

      console.log("Selected IDs:", this.selectedIds);
      console.log("Selected Types:", this.selectedtypes);
    }
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
      this.lcoName = this.lcoDeatails?.operatorname;
      console.log(this.lcoId);
    })
  }

  SubLCOIdoperatorId() {
    this.userService.getSublcoDetails(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.lcoDeatails = data;
      this.retailerId = this.lcoDeatails?.retailerid;
      this.lcoId = this.lcoDeatails?.operatorid;
      console.log(this.retailerId);
    })
  }


  getreport() {
    if (this.role == 'ROLE_OPERATOR') {
      this.userService.getbillCollectionReport(this.role, this.username, this.lcoId, this.bill_type || 0, this.useragent, this.fromdate, this.todate, this.searchname || null).subscribe((data: any) => {
        this.rowData = data[0].list;
        this.total_paid = data[0].total_paid;
        this.total_unpaid = data[0].total_unpaid;
        this.total_recharge = data[0].total_recharge;
        this.total_excess = data[0].total_excess;
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
      this.rowData = [];
    } else if (this.role == 'ROLE_SUBLCO') {
      this.userService.getbillCollectionReport(this.role, this.username, this.retailerId, this.bill_type || 0, 4, this.fromdate, this.todate, this.searchname || null).subscribe((data: any) => {
        this.rowData = data[0].list;
        this.total_paid = data[0].total_paid;
        this.total_unpaid = data[0].total_unpaid;
        this.total_recharge = data[0].total_recharge;
        this.total_excess = data[0].total_excess;
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
      this.rowData = [];
    }
  }


  loadTableData(selectedTab: any) {
    console.log(`Selected Tab: ${selectedTab}`);

    this.columnnDefs = [
      {
        headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, filter: false, width: 100,
        checkboxSelection: true,
      },
      {
        headerName: "PAY OPTION", field: 'productname', width: 100, cellStyle: { textAlign: 'left' },
        cellRenderer: (params: any) => {
          // const isActive = params.data.extra_amount === '0' || params.data.new_balance >= params.data.paid_amount;
          const isActive = params.data.paid_amount === '0' || params.data.extra_amount <= '0';
          const payButton = document.createElement('button');
          payButton.innerHTML = '<img src="/assets/images/icons/Pay2.png" style="width:70px">';
          payButton.style.backgroundColor = 'transparent';
          payButton.style.color = 'rgb(2 85 13)';
          payButton.style.border = 'none';
          payButton.style.cursor = 'pointer';
          payButton.style.marginRight = '6px';
          // payButton.addEventListener('click', () => {
          //   this.openEditDialog(params.data, 'pay_option');
          // });
          if (!isActive) {
            console.log('isActive');

            payButton.style.opacity = '0.5';
            payButton.title = 'Cannot pay, status is Deactive';
          } else {
            payButton.addEventListener('click', () => {
              this.openEditDialog(params.data, 'pay_option');
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

        cellRenderer: (params: any) => {
          return `<a href="javascript:void(0)" style="color: blue; text-decoration: none;color:#0d6efd">
                    ${params.value}
                  </a>`;
        },
        onCellClicked: (params: any) => {
          const subid = params.data.id;
          const smartcard = params.data.smartcard;
          console.log('Sub ID:', subid);
          console.log('Smartcard:', smartcard);
          this.openEditDialog(params.data, 'smartcardDetails')

        }
      },


      {
        headerName: "Edit", width: 100, cellStyle: { textAlign: 'left' },
        cellRenderer: (params: any) => {
          const { paid_amount, new_balance, extra_amount } = params.data;
          console.log('paid_amount', paid_amount);
          console.log('new_balance', new_balance);
          console.log('extra_amount', extra_amount);

          const shouldHide = ((paid_amount == '0.00' || '0') && new_balance == '0' && (extra_amount == '0.00' || '0')) && (paid_amount == '0.00' || '0') && new_balance != '0' && (extra_amount == '0.00' || '0');
          const shouldEnable = ((paid_amount == '0.00' || '0') && new_balance != '0' && (extra_amount != '0.00' || '0') && (paid_amount == '0.00' || '0') && new_balance == '0' && (extra_amount != '0.00' || '0'));

          const div = document.createElement('div');

          if (shouldHide) {
            // Don't render the button at all
            return div;
          }

          const payButton = document.createElement('button');
          payButton.innerHTML = '<img src="/assets/images/icons/EditLTP.png" style="width:70px">';
          payButton.style.backgroundColor = 'transparent';
          payButton.style.color = 'rgb(2 85 13)';
          payButton.style.border = 'none';
          payButton.style.cursor = 'pointer';
          payButton.style.marginRight = '6px';

          if (shouldEnable) {
            payButton.title = 'Pay Now, status is Active';
            payButton.addEventListener('click', () => {
              this.openEditDialog(params.data, 'pay_edit');
            });
          } else {
            payButton.disabled = true;
            payButton.style.opacity = '0.5';
            payButton.title = 'Cannot pay, status is not valid';
          }

          div.appendChild(payButton);
          return div;
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
        headerName: "EXCESS PAID", field: 'extra_amount', width: 150,
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
        cellRenderer: (params: any) => {
          if (params.value === 'Expired') {
            return `<span style="color: red;">${params.value}</span>`;
          } else if (params.value === 'Active') {
            return `<span style="color: green;">${params.value}</span>`;
          } else {
            return `<span>${params.value}</span>`;
          }
        }
      },

    ]
  }

  openEditDialog(data: any, type: any): void {
    console.log(data);
    let dialogWidth = '500px'; // default
    if (type === 'smartcardDetails') {
      dialogWidth = '1350px';
    }
    let dialalogData = { data: data, lcoid: this.lcoId, userarant: this.useragent, type: type }
    console.log(dialalogData);
    const dialogRef = this.dialog.open(LcoSmartcardDialogComponent, {
      width: dialogWidth,
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
    if (this.role == 'ROLE_OPERATOR') {
      this.userService.getBillCollectionReport(this.role, this.username, this.lcoId || this.retailerId, this.bill_type, this.useragent, this.fromdate, this.todate, this.searchname || null, reportType).
        subscribe({
          next: (x: Blob) => {
            this.swal.Close();
            if (reportType === 1) {
              this.reportMaking(x, `Bill Collection_${this.lcoName || this.retailerName}.pdf`, 'application/pdf');
            } else if (reportType === 2) {
              this.reportMaking(x, `Bill Collection_${this.lcoName || this.retailerName}.xlsx`, 'application/xlsx');
            }
          },
          error: (error: any) => {
            this.swal.Close();
            this.pdfswalError(error?.error.message);
          }
        });
    } else if (this.role == 'ROLE_SUBLCO') {
      this.userService.getBillCollectionReport(this.role, this.username, this.lcoId || this.retailerId, this.bill_type, 4, this.fromdate, this.todate, this.searchname || null, reportType).
        subscribe({
          next: (x: Blob) => {
            this.swal.Close();
            if (reportType === 1) {
              this.reportMaking(x, `Bill Collection_${this.lcoName || this.retailerName}.pdf`, 'application/pdf');
            } else if (reportType === 2) {
              this.reportMaking(x, `Bill Collection_${this.lcoName || this.retailerName}.xlsx`, 'application/xlsx');
            }
          },
          error: (error: any) => {
            this.swal.Close();
            this.pdfswalError(error?.error.message);
          }
        });
    }
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

  Active(ids: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Reset this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reset it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updateing...',
          text: 'Please wait , updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.getresetPayBill(this.role, this.username, ids).subscribe((res: any) => {
          Swal.fire({
            title: 'Activated!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          this.ngOnInit();
        }, (err) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message,
            icon: 'error',
            timer: 2000,
            timerProgressBar: true,
          });
        });
      }
    });
  }
}
