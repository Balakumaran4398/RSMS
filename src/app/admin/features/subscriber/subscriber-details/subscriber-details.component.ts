import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-subscriber-details',
  templateUrl: './subscriber-details.component.html',
  styleUrls: ['./subscriber-details.component.scss']
})
export class SubscriberDetailsComponent {
  selectedStatusId: any=-1;
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
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }

  status = {
    0: 'new subscriber list',
    1: 'active subscriber list',
    2: 'deactive subscriber list',
    3: 'suspend subscriber list',
    4: 'block subscriber list'
  };
  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();

  }
  columnDefs: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
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

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  // subscriber_list() {
  //   this.userservise.getsubscriberlist_subscriber(this.role, this.username, status).subscribe((data:any)=>{
  //     console.log(data);

  //   })
  // }
  onSubscriberStatusChange() {
    if (this.selectedStatusId === -1) {
      return; // No status selected, do nothing
    }

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
  }
  statusKeys(): number[] {
    return Object.keys(this.status).map(key => parseInt(key, 10));
  }
}
