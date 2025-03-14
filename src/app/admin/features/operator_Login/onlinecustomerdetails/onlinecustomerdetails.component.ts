import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-onlinecustomerdetails',
  templateUrl: './onlinecustomerdetails.component.html',
  styleUrls: ['./onlinecustomerdetails.component.scss']
})
export class OnlinecustomerdetailsComponent {
  selectedStatusId: any = '0';
  rowData: any[] = [];
  username: any;
  role: any;
  sub_list: any;
  searchTerm: string = '';
  gridApi: any;
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
  constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router, private swal: SwalService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();

  }
  ngOnInit(): void {
    // this.updateColumnDefs(this.selectedStatusId);
    this.onSubscriberStatusChange();
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onSubscriberStatusChange() {
    if (this.selectedStatusId === 0) {
      return;
    }
    this.rowData = [];
    this.swal.Loading();
    this.userservice.getsubscriberlist_subscriber(this.role, this.username, this.selectedStatusId)
      .subscribe((data: any) => {
        console.log(data);
        this.rowData = data;
        this.swal.Close();
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to retrieve subscriber list.',
        });
        console.error(error);
      });
    this.updateColumnDefs(this.selectedStatusId);
  }

  columnDefs: ColDef[] = []
  private updateColumnDefs(selectedStatusId: string): void {
    if (selectedStatusId === '0') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, },
        {
          headerName: 'SUBSCRIBER NAME',width: 200,
          field: 'customername',
          cellStyle: params => {
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
          onCellClicked: (params) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`]);
            }
          }
        },
        { headerName: 'AREA NAME', field: 'areaname',width: 200, },
        { headerName: 'SMARTCARD', field: 'address', width: 290,},
        { headerName: 'BOX ID', field: 'mobileno', width: 300,},
        { headerName: 'PACKAGE NAME', field: 'username', cellStyle: { textAlign: 'left' },width: 300, },
        { headerName: 'EXPIRY DATE', field: 'password',width: 200, },
      ]
    } else if (selectedStatusId === '1') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, },
        {
          headerName: 'SUBSCRIBER NAME',
          field: 'customername',

        },
        { headerName: 'AREA', field: 'smartcard', width: 220 },

        { headerName: 'STREET', field: 'operatorname',width: 220 },
        { headerName: 'ADDRESS', field: 'address',width: 200 },
        { headerName: 'MOBILE NUMBER', field: 'mobileno',width: 200 },
        { headerName: 'OPERATOR', field: 'username', cellStyle: { textAlign: 'left' },width: 220 },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
          cellStyle: params => {
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

          onCellClicked: (params) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`]).then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`]).then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            }
          }
        },
      ]
    } else if (selectedStatusId === '2') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 500, },
        { headerName: 'BOX ID', field: 'operatorname', width: 490,  },
        { headerName: 'CAS TYPE', field: 'areaname', width: 500, },
      ]
    } else if (selectedStatusId === '3') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, },
        { headerName: 'SUBSCRIBER NAME', field: 'smartcard', width: 400, },
        { headerName: 'AREA NAME', field: 'areaname', width: 290, },
        { headerName: 'ADDRESS', field: 'address', width: 400, },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', width: 400, },
      ]
    } 
  }

  getReport(type: number) {
    this.processingSwal();
    this.swal.Loading();
    // this.userservice.getWalletShareReportDownload(this.role, this.username,  type)
    //   .subscribe((x: Blob) => {
    //     if (type == 1) {
    //       this.reportMaking(x, "Wallet_Share_Report(" + ").pdf", 'application/pdf');
    //     } else if (type == 2) {
    //       this.reportMaking(x, "Wallet_Share_Report("  + ").xlsx", 'application/xlsx');
    //     }
    //     this.swal.Close();
    //   },
    //     (error: any) => {
    //       this.pdfswalError(error?.error.message);
    //     });
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
}
