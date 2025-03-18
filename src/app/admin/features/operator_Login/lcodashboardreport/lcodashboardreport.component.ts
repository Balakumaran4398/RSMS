import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lcodashboardreport',
  templateUrl: './lcodashboardreport.component.html',
  styleUrls: ['./lcodashboardreport.component.scss']
})
export class LcodashboardreportComponent implements OnInit {

  role: any;
  username: any;
  type: any;
  columnDefs: any[] = [];
  rowData: any[] = [];

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
  msodetails: any;
  operatorname: any;
  gridApi: any;
  OType: any;
  operatorid: any;

  path: any;

  lcoDeatails: any;
  lcoId: any;
  constructor(private route: ActivatedRoute, private location: Location, private userService: BaseService,private router: Router, private storageservice: StorageService, private excelService: ExcelService, private swal: SwalService,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.type = this.route.snapshot.paramMap.get('id');
    console.log(this.type);

  }
  getHeader(): string {
    switch (this.type) {
      case '1': return 'SUSPEND REPORT';
      case '2': return 'ACTIVE REPORT';
      case '3': return 'DEACTIVE REPORT';
      case '4': return 'TODAY RECHARGE REPORT';
      case '5': return 'YESTERDAY RECHARGE REPORT';
      case '6': return 'TODAY EXPIRY REPORT';
      case '7': return 'TOMORROW EXPIRY REPORT';
      case '8': return 'YESTERDAY EXPIRY REPORT';
      case '9': return 'AREA CHANGE REPORT';
      case '10': return 'NEW SUBSCRIBER REPORT';
      default: return 'UNKNOWN TYPE';
    }
  }
  ngOnInit(): void {
    this.onColumnDefs();
    this.operatorIdoperatorId();
    this.onMSODetails();
    // this.setType(this.type);

  }
  goBack(): void {
    this.location.back();
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }

  onMSODetails() {
    this.userService.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
    })
  }
  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.lcoId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.onTableData(this.lcoId);
    })
  }

  onTableData(lcoid: any) {
    this.swal.Loading();
    console.log(this.lcoId);

    this.userService.getOpLoginReportByOpid(this.role, this.username, lcoid, this.type, 3)
      .subscribe((res: any) => {
        this.rowData = res;
        console.log(this.rowData);

        // this.swal.success(res?.message);
        this.swal.Close();
      }, (err) => {
        this.swal.Error(err?.error?.message);
        this.swal.Close();
      });
  }

  getLcoInvoiceReport(reportType: number) {
    this.swal.Loading();
    this.userService.getOpLoginReportByReport(this.role, this.username, this.lcoId, this.type, reportType).
      subscribe({
        next: (x: Blob) => {
          this.swal.Close();
          const reportName = this.getHeader().replace(/\s+/g, '_');
          // if (this.type === '1') {  // Correct comparison
            if (reportType === 1) {
              this.reportMaking(x, `${reportName}_${this.lcoId}.pdf`, 'application/pdf');
            } else if (reportType === 2) {
              this.reportMaking(x, `${reportName}_${this.lcoId}.xlsx`, 'application/xlsx');
            }
          // } else if (this.type === '2') {
          //   // Handle other types if needed
          // }
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

  private onColumnDefs() {
    console.log(this.type)

    if (this.type == 1 || this.type == 2 || this.type == 3) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 220, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
          cellStyle: (params:any) => {
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

          onCellClicked: (params:any) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`])
              .then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`])
              .then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            }
          }
        },
        { headerName: 'SUBSCRIBER ID', field: 'id', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', }, width: 200, },
        { headerName: 'ADDRESS ', field: 'address', Flex: 1, cellStyle: { textAlign: 'center', }, width: 150, },
        { headerName: 'AREA NAME ', field: 'address', Flex: 1, cellStyle: { textAlign: 'center', }, width: 150, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 150, },
        { headerName: 'BOX ID', field: 'boxid', width: 180, },
        { headerName: 'ACTIVATION DATE', field: 'activationdate', width: 200, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
        {
          headerName: 'STATUS',
          field: 'statusdisplay',
          width: 150,
          cellStyle: (params: any) => {
            if (params.value === 'Active') {
              return { backgroundColor: 'lightgreen', color: 'green', fontWeight: 'bold' };
            } else if (params.value === 'Deactive') {
              return { backgroundColor: 'lightcoral', color: 'white', fontWeight: 'bold' };
            } else if (params.value === 'Suspended') {
              return { color: 'blue', fontWeight: 'bold' };
            }
            return {};
          }
        }
      ]
    } else if (this.type == 5 || this.type == 6) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 180, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
          cellStyle: (params:any) => {
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

          onCellClicked: (params:any) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`])
              .then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`])
              .then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            }
          }
        },
        { headerName: 'SUBSCRIBER ID', field: 'subid', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS ', field: 'address', Flex: 1, cellStyle: { textAlign: 'center', }, width: 200, },
        { headerName: 'AREA NAME', field: 'areaname', width: 220, },
        { headerName: 'MOBILE NUMBER	', field: 'mobileno', width: 150, },
        { headerName: 'BOX ID', field: 'boxid', width: 200, },
        { headerName: 'ACTIVATION DATE', field: 'activationdate', width: 200, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
        { headerName: 'STATUS', field: 'statusdisplay', width: 200, },
      ]
    }

    else if (this.type == 7) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 220, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
          cellStyle: (params:any) => {
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

          onCellClicked: (params:any) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`])
              .then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`])
              .then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            }
          }
        },
        { headerName: 'SUBSCRIBER ID', field: 'id', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS	', field: 'address', width: 150, },
        { headerName: 'AREA NAME', field: 'areaname', width: 200, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 200, },
        { headerName: 'BOX ID', field: 'boxid', width: 180, },
        { headerName: 'ACTIVATION DATE', field: 'activationdate', width: 200, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
        {
          headerName: 'STATUS',
          field: 'statusdisplay',
          width: 150,
          cellStyle: (params: any) => {
            if (params.value === 'Active') {
              return { color: 'green', fontWeight: 'bold' };
            } else if (params.value === 'Deactive') {
              return { color: 'red', fontWeight: 'bold' };
            }
            return {};
          }
        }
      ]
    }
    else if (this.type == 9) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD ', field: 'smartcard', Flex: 1, cellStyle: { textAlign: 'center', }, width: 150, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
          cellStyle: (params:any) => {
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

          onCellClicked: (params:any) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`])
              .then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`])
              .then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              });
            }
          }
        },
        { headerName: 'SUBSCRIBER ID', field: 'id', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'EMAIL', field: 'email', width: 150, },
        { headerName: 'ADDRESS', field: 'address', width: 150, },
        { headerName: 'AREA NAME ', field: 'areaname', Flex: 1, cellStyle: { textAlign: 'center', }, width: 150, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 150, },
        { headerName: 'BOX ID', field: 'boxid', width: 230, },
        { headerName: 'ACTIVATION DATE', field: 'activationdate', width: 180, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 230, },
        {
          headerName: 'STATUS',
          field: 'statusdisplay',
          width: 150,
          cellStyle: (params: any) => {
            if (params.value === 'Active') {
              return { color: 'green', fontWeight: 'bold' };
            } else if (params.value === 'Deactive') {
              return { color: 'red', fontWeight: 'bold' };
            }
            return {};
          }
        }

      ]
    }
    else if (this.type == 10) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SUBSCRIBER NAME', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        {
          headerName: 'SUBSCRIBER NAME',
          field: 'customername',
          cellStyle: (params:any) => {
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
          onCellClicked: (params:any) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`]);
            }
          }
        },
        { headerName: 'SUBSCRIBER ID', field: 'id', Flex: 1, width: 150, },
        { headerName: 'EMAIL', field: 'email', width: 150, },
        { headerName: 'ADDRESS', field: 'address', width: 150, },
        { headerName: 'AREA NAME ', field: 'areaname', Flex: 1, cellStyle: { textAlign: 'center', }, width: 150, },
        { headerName: 'STREET NAME ', field: 'streetname', Flex: 1, cellStyle: { textAlign: 'center', }, width: 150, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 150, },
        { headerName: 'OPERATOR NAME', field: 'operatorname', width: 230, },
        { headerName: 'USER NAME', field: 'username', width: 180, },
        { headerName: 'PASSWORD', field: 'password', width: 230, },
        {
          headerName: 'STATUS',
          field: 'statusdisplay',
          width: 150,
          cellStyle: (params: any) => {
            if (params.value === 'Active') {
              return { color: 'green', fontWeight: 'bold' };
            } else if (params.value === 'Deactive') {
              return { color: 'red', fontWeight: 'bold' };
            }
            return {};
          }
        }

      ]
    }
  }
}
