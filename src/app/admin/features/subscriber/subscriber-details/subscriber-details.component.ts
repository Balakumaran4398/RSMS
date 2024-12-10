import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
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
      width: 220,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }

  // status = {
  //   0: 'new subscriber list',
  //   1: 'active subscriber list',
  //   2: 'deactive subscriber list',
  //   3: 'suspend subscriber list',
  //   4: 'block subscriber list'
  // };
  constructor(private userservice: BaseService, private storageservice: StorageService, private router: Router) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();

  }
  ngOnInit(): void {
    // this.updateColumnDefs(this.selectedStatusId);
    this.onSubscriberStatusChange();
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100 },
    { headerName: 'SUBSCRIBER NAME', field: 'customername', },
    { headerName: 'LCO NAME', field: 'operatorname', },
    { headerName: 'AREA NAME', field: 'areaname', },
    { headerName: 'ADDRESS', field: 'address', },
    { headerName: 'MOBILE NUMBER', field: 'mobileno', },
    { headerName: 'USER NAME', field: 'username', },
    { headerName: 'PASSWORD', field: 'password', },
    { headerName: 'BALANCE', field: 'balance', },
    { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

  ]
  private updateColumnDefs(selectedStatusId: string): void {
    if (selectedStatusId === '0') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
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
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: underline;">
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
        { headerName: 'USER NAME', field: 'username', },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '1') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
        },
        {
          headerName: 'SMARTCARD', field: 'smartcard',
          cellStyle: params => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: underline;">
                      ${params.value}
                    </a>`;
          },

          onCellClicked: (params) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`]);
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`]);
            }
          }
        },

        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '2') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
        },
        {
          headerName: 'SMARTCARD', field: 'smartcard',
          cellStyle: params => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: underline;">
                      ${params.value}
                    </a>`;
          },

          onCellClicked: (params) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`]);
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`]);
            }
          }
        },
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '3') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
        },
        {
          headerName: 'SMARTCARD', field: 'smartcard',
          cellStyle: params => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: underline;">
                      ${params.value}
                    </a>`;
          },

          onCellClicked: (params) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`]);
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`]);
            }
          }
        },
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '4') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
        },
        {
          headerName: 'SMARTCARD', field: 'smartcard',
          cellStyle: params => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: underline;">
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
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`]);
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`]);
            }
          }
        },
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', },
        { headerName: 'VERIFICATION STATUS', field: 'vstatus_display', }

      ]
    } else if (selectedStatusId === '5') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
        },
        {
          headerName: 'SMARTCARD', field: 'smartcard',
          cellStyle: params => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: underline;">
                      ${params.value}
                    </a>`;
          },

          onCellClicked: (params) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`]);
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`]);
            }
          },
          width: 200
        },
        { headerName: 'LCO NAME', field: 'operatorname', },
        { headerName: 'AREA NAME', field: 'areaname', },
        { headerName: 'ADDRESS', field: 'address', },
        { headerName: 'MOBILE NUMBER', field: 'mobileno', },
        { headerName: 'USER NAME', field: 'username', },
        { headerName: 'PASSWORD', field: 'password', },
        { headerName: 'BALANCE', field: 'balance', },
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
    this.rowData=[];
    this.userservice.getsubscriberlist_subscriber(this.role, this.username, this.selectedStatusId)
      .subscribe((data: any) => {
        console.log(data);
        this.rowData = data;
        // Handle the response (e.g., display the report data)
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
