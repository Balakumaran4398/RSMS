import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { Location } from '@angular/common';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-rechagelog',
  templateUrl: './rechagelog.component.html',
  styleUrls: ['./rechagelog.component.scss']
})
export class RechagelogComponent implements OnInit {

  fromdate: any;
  todate: any;
  today: any;
  selectedOperator: any;
  selectedLcoName: any;
  lco_list: any[] = [];
  filteredOperators: any[] = [];
  rowData: any[] = [];
  role: any;
  username: any;

  gridApi: any;

  isCheckboxChecked: boolean = false;
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 10,
    pagination: true,
  }

  constructor(private userService: BaseService, private storageService: StorageService, private location: Location, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }

  ngOnInit(): void {
    this.operatorList();
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
  goBack(): void {
    this.location.back();
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  operatorList() {
    this.userService.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.lco_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredOperators = this.lco_list;
    })
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);

  }
  onOperatorStatusChange(selectedOperator: any) {
    if (selectedOperator.value === 0) {
      this.selectedLcoName = 0;
      this.selectedOperator = selectedOperator;
      console.log(this.selectedOperator);

    } else {
      this.selectedLcoName = 0;
    }
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;

  }

  submit() {
    this.swal.Loading();
    this.userService.getWalletShareReport(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, 3)
      .subscribe((res: any) => {
        this.rowData = res;
        this.swal.Close();
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  getExcelReport(type: number) {
    this.processingSwal();
    this.swal.Loading();
    this.userService.getWalletShareReportDownload(this.role, this.username, this.fromdate, this.todate, this.selectedOperator.value, type)
      .subscribe((x: Blob) => {
        if (type == 1) {
          this.reportMaking(x, "Wallet_Share_Report(" + this.fromdate + "-" + this.todate + ").pdf", 'application/pdf');
        } else if (type == 2) {
          this.reportMaking(x, "Wallet_Share_Report(" + this.fromdate + "-" + this.todate + ").xlsx", 'application/xlsx');
        }
        this.swal.Close();
      },
        (error: any) => {
          this.pdfswalError(error?.error.message);
        });
  }

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
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, },
    { headerName: 'OPERATOR NAME', field: 'customername', },
    { headerName: 'AMOUNT', field: 'smartcard', width: 220 },
    { headerName: 'OLD BALANCE', field: 'operatorname', width: 230 },
    { headerName: 'NEW BALANCE', field: 'address', width: 230 },
    { headerName: 'REMARKS 1', field: 'mobileno', width: 300 },
    { headerName: 'TRANSACTION DATE', field: 'username', cellStyle: { textAlign: 'left' }, width: 250 },
  ]
}
