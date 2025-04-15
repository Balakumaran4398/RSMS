import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lcodashboardsublcoreport',
  templateUrl: './lcodashboardsublcoreport.component.html',
  styleUrls: ['./lcodashboardsublcoreport.component.scss']
})
export class LcodashboardsublcoreportComponent implements OnInit {
  role: any;
  username: any;
  userId: any;
  type: any;
  columnDefs: any[] = [];
  columnDefs1: any[] = [];
  rowData: any;
  rowData1: any;
  rows: any[] = [];
  selectedtypes: any[] = [];
  area_list: any[] = [];
  street_list: any[] = [];
  filteredStreet: any[] = [];
  filteredAreas: any[] = [];
  areaid: any;
  streetid: any;

  public rowSelection: any = "multiple";
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
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectsmartcard: number[] = [];
  retailerId:any;
  constructor(private route: ActivatedRoute, private location: Location, private userService: BaseService, private router: Router, private storageservice: StorageService, private excelService: ExcelService, private swal: SwalService,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.type = this.route.snapshot.paramMap.get('id');
    this.userId = this.route.snapshot.paramMap.get('userid');
    this.retailerId = this.route.snapshot.paramMap.get('retailerid');
    console.log(this.type);
    console.log(this.userId);
    console.log(this.retailerId);
  }
  getHeader(): string {
    switch (this.type) {
      case '1': return 'SUSPEND REPORT';
      case '2': return 'ACTIVE REPORT';
      case '3': return 'DEACTIVE REPORT';
      case '4': return 'TODAY RECHARGE REPORT';
      case '5': return 'YESTERDAY RECHARGE REPORT';
      case '6': return 'TODAY RECHARGE REPORT';
      case '7': return 'TOMORROW EXPIRY REPORT';
      case '8': return 'YESTERDAY EXPIRY REPORT';
      case '9': return 'AREA DETAILS';
      case '10': return 'NEW SUBSCRIBER REPORT';
      case '11': return 'NOT EXPIRED SUBSCRIBER ';
      case '12': return 'EXPIRED SUBSCRIBER ';
      default: return 'UNKNOWN TYPE';
    }
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    }
  }
  updateSelectedRows(selectedRows: any[]) {
    this.isAnyRowSelected = selectedRows.length > 0;
    this.selectedIds = selectedRows.map((e: any) => e.id);
    this.selectsmartcard = selectedRows.map((e: any) => e.smartcard);
  }
  ngOnInit(): void {
    if (this.role == 'ROLE_OPERATOR') {
      this.operatorIdoperatorId();
    } else if (this.role == 'ROLE_SUBLCO') {
      this.getSubLCODetails();
    }
    this.onColumnDefs();
    this.onMSODetails();
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
      this.lcoId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.onTableData();

    })
  }
  getSubLCODetails() {
    this.userService.getSublcoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.lcoId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.onTableData();
      if (this.type == '9') {
        this.getLcobyAreaid(this.lcoId);
      }
    })
  }
  onTableData() {
    // console.log('111111111111111', lcoid);
    this.swal.Loading();
    this.userService.getOpLoginReportByOpid('ROLE_SUBLCO', this.userId, this.retailerId, this.type, 3)
      .subscribe((res: any) => {
        if (this.type == 5 || this.type == 4) {
          console.log('type ', this.type, res);
          this.rowData = res.flatMap((customer: any) =>
            customer.content.map((data: any) => ({
              customeranme: data.customeranme,
              address: data.address,
              mobileno: data.mobileno,
              smartcard: data.smartcard,
              boxid: data.boxid
            }))
          );
          console.log("Extracted Customer Data:", this.rowData);
        } else {
          this.rowData = res;
        }
        console.log(this.rowData);
        this.swal.Close();
      }, (err) => {
        this.swal.Error(err?.error?.message);
        this.swal.Close();
      });
  }

  getLcoInvoiceReport(reportType: number) {
    this.swal.Loading();
    console.log(this.userId);
    
    this.userService.getOpLoginReportByReport('ROLE_SUBLCO', this.userId, this.retailerId, this.type, reportType).
      subscribe({
        next: (x: Blob) => {
          this.swal.Close();
          const reportName = this.getHeader();
          if (reportType === 1) {
            this.reportMaking(x, `${reportName}_${this.retailerId}.pdf`, 'application/pdf');
          } else if (reportType === 2) {
            this.reportMaking(x, `${reportName}_${this.retailerId}.xlsx`, 'application/xlsx');
          }

          // if (reportType === 1) {
          //   this.reportMaking(x, `Bill Collection_${this.lcoId}.pdf`, 'application/pdf');
          // } else if (reportType === 2) {
          //   this.reportMaking(x, `Bill Collection_${this.lcoId}.xlsx`, 'application/xlsx');
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

  // private getColumnDefs() {
  private onColumnDefs() {
    console.log(this.type)

    if (this.type == 1 || this.type == 2 || this.type == 3) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 220, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 250,
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
    } else if (this.type == 5 || this.type == 4) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 180, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 300,
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
        // { headerName: 'SUBSCRIBER ID', field: 'subid', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customeranme', cellStyle: { textAlign: 'center', color: 'green' }, width: 300, },
        { headerName: 'ADDRESS ', field: 'address', cellStyle: { textAlign: 'center', }, width: 300, },
        // { headerName: 'AREA NAME', field: 'areaname', width: 220, },
        { headerName: 'MOBILE NUMBER	', field: 'mobileno', width: 300, },
        { headerName: 'BOX ID', field: 'boxid', width: 300, },
        // { headerName: 'ACTIVATION DATE', field: 'activationdate', width: 200, },
        // { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
        // { headerName: 'STATUS', field: 'statusdisplay', width: 200, },
      ]
    }

    else if (this.type == 7) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 220, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
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
      this.columnDefs1 = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 100, filter: false },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
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


        //  { headerName: "S.No", valueGetter: 'node.rowIndex+1', lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 100, filter: false },
        // { headerName: "SMARTCARD", field: 'smartcard', width: 250 },
        { headerName: "BOXID", field: 'boxid', width: 200 },
        { headerName: "CORTON BOX", field: 'cartonbox', width: 200 },
        { headerName: "SUBSCRIBER NAME	", field: 'customername', width: 250 },
        { headerName: "MOBILE NO", field: 'mobileno', width: 250 },
        { headerName: "AREA NAME", field: 'areaname', width: 250 },
        { headerName: "STREET NAME", field: 'streetname', width: 250 },
        { headerName: "EXPIRY DATE", field: 'expirydate', width: 200 },
      ]
    }
    else if (this.type == 10) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SUBSCRIBER NAME', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        {
          headerName: 'SUBSCRIBER NAME',
          field: 'customername',
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
    } else if (this.type == 11) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
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
        { headerName: 'SUBSCRIBER ID', field: 'sub_id', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customer_name', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS	', field: 'address', width: 150, },
        { headerName: 'AREA NAME', field: 'areaname', width: 200, },
        { headerName: 'MOBILE NO', field: 'mobile_no', width: 200, },
        { headerName: 'BOX ID', field: 'boxid', width: 180, },
        { headerName: 'STATUS', field: 'statusdisplay', width: 200, },
        { headerName: 'CREATION DATE', field: 'activationdate', width: 200, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
      ]
    } else if (this.type == 12) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
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
        { headerName: 'SUBSCRIBER ID', field: 'sub_id', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customer_name', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS	', field: 'address', width: 150, },
        { headerName: 'AREA NAME', field: 'areaname', width: 200, },
        { headerName: 'MOBILE NO', field: 'mobile_no', width: 200, },
        { headerName: 'BOX ID', field: 'boxid', width: 180, },
        { headerName: 'STATUS', field: 'statusdisplay', width: 200, },
        { headerName: 'CREATION DATE', field: 'activationdate', width: 200, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
      ]
    }

  }

  getArealist(operator: any) {
    console.log(operator);
    this.userService.getAreaListByOperatorId(this.role, this.username, operator).subscribe((data: any) => {
      console.log(data);
      this.area_list = data;
      console.log(this.area_list);
      this.filteredAreas = this.area_list;
    })
  }
  filterAreas(event: any): void {
    console.log(this.area_list);
    console.log(event);

    const filterValue = event.target.value.toLowerCase();
    this.filteredAreas = this.area_list.filter((area: any) =>
      area.name.toLowerCase().includes(filterValue)
    );
    this.areaid = Object.keys(event).map(key => {
      const value = event[key];
      const name = key;
      return { name: name, value: value };
    });

  }
  getstreetList(event: any) {
    console.log(this.areaid);

    this.swal.Loading();
    this.userService.getStreetListByAreaId(this.role, this.username, this.areaid).subscribe((data: any) => {
      if (data?.length > 0) {
        // this.rowData = data;
        console.log(data);
        this.street_list = data;
        this.filteredStreet = this.street_list
      } else {
        this.swal.Error('Street list is empty.');
      }
      this.swal.Close();
    },
      (error) => {
        console.error('API Error:', error);
        this.swal.Close();
        if (error.status === 204 || error.status === 404) {
          this.swal.Error('Street list not found.');
        } else {
          this.swal.Error(error?.error?.message || 'Something went wrong.');
        }
      })
  }

  filterStreet(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredStreet = this.street_list.filter((street: any) =>
      street.name.toLowerCase().includes(filterValue)
    );
    this.streetid = Object.keys(event).map(key => {
      const value = event[key];
      const name = key;
      return { name: name, value: value };
    });
  }

  onAreaStatusChange() {
    this.street_list = [];
    this.rowData = [];
    if (this.areaid) {
      this.userService.getStreetListByAreaid(this.role, this.username, this.areaid)
        .subscribe((data: any) => {
          console.log(data);
          console.log(data?.streetid);
          this.street_list = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.street_list);
        });
    }
    this.userService.getLcochangeSubscriberList(this.role, this.username, this.lcoId, this.areaid, 0).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          // this.updateColumnDefs(this.selectedTab);
          this.rowData = response.body;
          console.log(this.rowData);
          // this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
        }
      },
      (error) => {
        if (error.status === 400) {
          this.swal.Error_400();
        } else if (error.status === 500) {
          this.swal.Error_500();
        } else {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      }
    );

    // this.userService.getAreaListByOperatorId(this.role, this.username, this.lcoId).subscribe((data: any) => {
    //   console.log(data);
    //   this.area_list = data;
    //   console.log(this.area_list);
    //   this.filteredAreas = this.area_list;
    // })
  }

  onSubscriberStreetLCOChange() {
    this.rowData1 = [];
    this.rowData = [];
    console.log('1111111');

    console.log(this.streetid);
    this.userService.getLcochangeSubscriberList(this.role, this.username, this.lcoId, this.areaid, this.streetid).subscribe(
      // this.userservice.getLcochangeSubscriberList(this.role, this.username, this.lco, this.area, this.street).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          console.log(this.rowData1);
          // this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
        }
      },
      (error) => {
        if (error.status === 400) {
          this.swal.Error_400();
        } else if (error.status === 500) {
          this.swal.Error_500();
        } else {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      }
    );
  }
  getLcobyAreaid(lco: any) {
    this.rowData1 = [];
    this.rowData = [];
    if (lco) {
      this.userService.getAreaListByOperatorid(this.role, this.username, lco)
        .subscribe((data: any) => {
          // this.rowData1 = data;
          console.log(this.rowData1);
          console.log(data?.areaid);
          this.area_list = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.area_list);
        });
    }
    this.userService.getAreaChangeSubscriberList(this.role, this.username, lco,).subscribe(
      // this.userService.getLcochangeSubscriberList(this.role, this.username, lco, 0, 0).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          // this.updateColumnDefs(this.selectedTab);
          this.rowData1 = response.body;
          // this.swal.Success_200();
        } else if (response.status === 204) {
          this.swal.Success_204();
        }
      },
      (error) => {
        if (error.status === 400) {
          this.swal.Error_400();
        } else if (error.status === 500) {
          this.swal.Error_500();
        } else {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      }
    );
  }


  updateArea() {
    let requestBody = {
      role: this.role,
      username: this.username,
      operatorid: this.lcoId,
      areaid: this.areaid,
      streetid: this.streetid,
      subscriberlist: this.rows,
    }
    this.swal.Loading();
    this.userService.updateAreaChangeSubscriber(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error?.areaid || err?.error?.streetid);
      });
  }


  ngOnDestroy(): void {
    ($('#Area') as any).select2('destroy');
    ($('#Street') as any).select2('destroy');
  }

  ngAfterViewInit() {
    $('#Area').select2({
      placeholder: 'Select Area',
      allowClear: true
    });
    $('#Area').on('change', (event: any) => {
      this.areaid = event.target.value;
      this.getArealist(this.areaid);
    });
    $('#Street').select2({
      placeholder: 'Select Street',
      allowClear: true
    });
    $('#Street').on('change', (event: any) => {
      this.streetid = event.target.value;
      this.getstreetList(this.streetid);
    });
  }
}
