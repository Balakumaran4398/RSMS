import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-subscriber-details',
  templateUrl: './subscriber-details.component.html',
  styleUrls: ['./subscriber-details.component.scss']
})
export class SubscriberDetailsComponent implements OnInit {
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
    paginationPageSize: 15,
    paginationPageSizeSelector:[10,20,50],
    pagination: true,
  };

  constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router, private swal: SwalService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();

  }
  ngOnInit(): void {
    // this.updateColumnDefs(this.selectedStatusId);
    this.onSubscriberStatusChange();
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false },
    { headerName: 'SUBSCRIBER NAME', field: 'customername', cellStyle: { textAlign: 'left' }, },
    { headerName: 'LCO NAME', field: 'operatorname', },
    { headerName: 'AREA NAME', field: 'areaname', },
    { headerName: 'ADDRESS', field: 'address', },
    { headerName: 'MOBILE NUMBER', field: 'mobileno', },
    { headerName: 'USER NAME', field: 'username', cellStyle: { textAlign: 'left' }, },
    { headerName: 'PASSWORD', field: 'password', },
    { headerName: 'BALANCE', field: 'balance', cellStyle: { textAlign: 'left' }, },
    { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

  ]
  private updateColumnDefs(selectedStatusId: string): void {
    if (selectedStatusId === '0') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false},
        {
          headerName: 'SUBSCRIBER NAME',
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
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', cellStyle: { textAlign: 'left' }, },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', cellStyle: { textAlign: 'left' }, },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '1') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false },
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

        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', cellStyle: { textAlign: 'left' }, },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', cellStyle: { textAlign: 'left' }, },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '2') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false
        },
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
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', cellStyle: { textAlign: 'left' }, },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', cellStyle: { textAlign: 'left' }, },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '3') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false
        },
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
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', cellStyle: { textAlign: 'left' }, },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', cellStyle: { textAlign: 'left' }, },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '4') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false
        },
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
            const status = params.data.status;
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
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', cellStyle: { textAlign: 'left' }, },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', cellStyle: { textAlign: 'left' }, },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '5') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false
        },
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
          },

        },
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', cellStyle: { textAlign: 'left' }, },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', cellStyle: { textAlign: 'left' }, },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '6') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false
        },

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
          },

        },
        {
          headerName: 'SUBSCRIBER NAME',
          field: 'customername',
          cellStyle: params => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
        },
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', cellStyle: { textAlign: 'left' }, },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', cellStyle: { textAlign: 'left' }, },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    }
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  // subscriber_list() {
  //   this.userservise.getsubscriberlist_subscriber(this.role, this.username, status).subscribe((data:any)=>{
  //     console.log(data);

  //   })
  // }
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
        const rowCount = this.rowData.length;
        if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
          this.gridOptions.paginationPageSizeSelector.push(rowCount);
        }
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

}
