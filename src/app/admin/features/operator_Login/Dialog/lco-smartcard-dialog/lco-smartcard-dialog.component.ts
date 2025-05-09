import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lco-smartcard-dialog',
  templateUrl: './lco-smartcard-dialog.component.html',
  styleUrls: ['./lco-smartcard-dialog.component.scss']
})
export class LcoSmartcardDialogComponent implements OnInit {
  role: any;
  username: any;
  lcoPaymentList: any;

  pay: string = '0.0';
  iscredit: boolean = true;
  confirmation: boolean = false;
  op_id: any;
  smartcard: any;
  status: any;
  retailerid: any;
  useragent: any;
  operatorId: any;
  type: any;
  fromdate: any;
  todate: any;
  lcoName: any;
  lcoid: any;
  gridApi: any;
  rowData: any[] = [];

  total_paid: any;
  total_unpaid: any;
  total_recharge: any;
  total_excess: any;
  dateRangeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LcoSmartcardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService, private fb: FormBuilder,
    private cdr: ChangeDetectorRef) {
    console.log(data);
    this.lcoPaymentList = data.data;
    this.op_id = data.lcoid;
    this.useragent = data.userarant;
    this.smartcard = this.lcoPaymentList?.smartcard;
    this.status = this.lcoPaymentList?.status;
    this.retailerid = this.lcoPaymentList?.useragentid;
    this.lcoName = this.lcoPaymentList?.customer_name;
    this.lcoid = data?.lcoid;
    console.log('lcoid', this.lcoid);

    this.type = data?.type;
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();

    this.dateRangeForm = this.fb.group({
      fromdate: [new Date('2024-03-01')],
      todate: [new Date('2024-03-15')]
    });
  }
  ngOnInit(): void {
    console.log(this.type);
    if (this.type == 'smartcardDetails') {
      this.getreport();
      this.dateRangeForm.patchValue({
        fromdate: this.fromdate,
        todate: this.todate
      })
      console.log(this.fromdate);
      console.log(this.todate);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
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

  getBillCollectionReport(type: any) {
    this.userService.getBillCollectionSmartcardReport(this.role, this.username, this.lcoid, this.smartcard, this.fromdate, this.todate, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Bill Collection (" + this.smartcard + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Bill Collection (" + this.smartcard + ").xlsx", 'application/xlsx');
        }
        this.swal.Close()
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }
  getreport() {
    if (this.role == 'ROLE_OPERATOR') {
      this.userService.getBillCollectionSmartcardReportList(this.role, this.username, this.lcoid, this.smartcard, this.fromdate, this.todate, 3).subscribe((data: any) => {
        this.rowData = data[0].list;
        this.total_paid = data[0].total_paid;
        this.total_unpaid = data[0].total_unpaid;
        this.total_recharge = data[0].total_recharge;
        this.total_excess = data[0].total_excess;
        console.log(this.rowData);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
      this.rowData = [];
    } else if (this.role == 'ROLE_SUBLCO') {
      this.userService.getBillCollectionSmartcardReportList(this.role, this.username, this.retailerid, this.smartcard, this.fromdate, this.todate, 3).subscribe((data: any) => {
        this.rowData = data[0].list;
        this.total_paid = data[0].total_paid;
        this.total_unpaid = data[0].total_unpaid;
        this.total_recharge = data[0].total_recharge;
        this.total_excess = data[0].total_excess;
        console.log(this.rowData);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
      this.rowData = [];
    }
  }

  submit() {
    this.swal.Loading();
    if (this.role == 'ROLE_OPERATOR') {
      this.userService.getupdatePaybillUpdate(this.role, this.username, this.op_id, this.smartcard, this.pay, this.status, 2, this.retailerid, 0)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    } else if (this.role == 'ROLE_SUBLCO') {
      this.userService.getupdatePaybillUpdate(this.role, this.username, this.op_id, this.smartcard, this.pay, this.status, 4, this.retailerid, 0)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }
  }
  update() {
    this.swal.Loading();
    if (this.role == 'ROLE_OPERATOR') {
      this.userService.getupdatePaybillUpdate(this.role, this.username, this.op_id, this.smartcard, this.pay, this.status, 2, this.retailerid, 1)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    } else if (this.role == 'ROLE_SUBLCO') {
      this.userService.getupdatePaybillUpdate(this.role, this.username, this.op_id, this.smartcard, this.pay, this.status, 4, this.retailerid, 2)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }

  columnnDefs = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false },
    { headerName: "DUE PERIOD", field: 'due_date', width: 180 },
    { headerName: "DUE", field: 'recharge_totalamount_card', width: 120, },
    { headerName: "PAID", field: 'paid_amount', width: 120, },
    { headerName: "BALANCE", field: 'old_balance', width: 150, },
    { headerName: "EXCESS", field: 'extra_amount', width: 180, },
    { headerName: "COLLECTION DATE", field: 'collection_date', width: 170, },
    { headerName: "PACKAGE NAME", field: 'packages', width: 170, },
  ]
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
