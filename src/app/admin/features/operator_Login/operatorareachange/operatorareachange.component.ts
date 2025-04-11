import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-operatorareachange',
  templateUrl: './operatorareachange.component.html',
  styleUrls: ['./operatorareachange.component.scss']
})
export class OperatorareachangeComponent implements OnInit {
  username: any;
  role: any;
  rowData: any;
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
  operatorid: any;
  lco: string = '';
  area: string = '';
  street: string = '';
  lcoList: Array<{ name: string, value: string }> = [];
  areaList: Array<{ name: string, value: string }> = [];
  streetList: Array<{ name: string, value: string }> = [];

  filteredOperators: any[] = [];

  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  isRowSelected: boolean = false;

  columnDefs: any[] = [];
  rows: any[] = [];

  lcoDeatails: any;
  lcoId: any;
  operatorname: any;

  constructor(public dialog: MatDialog, private userservice: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.columnDefs = [
      { headerName: "S.No", valueGetter: 'node.rowIndex+1', lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 100, },
      { headerName: "CUSTOMER NAME", field: 'customername', width: 250 },
      { headerName: "CORTON BOX", field: 'cartonbox', width: 200 },
      { headerName: "SMARTCARD", field: 'smartcard', width: 250 },
      { headerName: "AREA NAME", field: 'areaname', width: 250 },
      { headerName: "STREET NAME", field: 'streetname', width: 250 },
      { headerName: "ADDRESS", field: 'address', width: 250 },
      { headerName: "MOBILE NO", field: 'mobileno', width: 220 },
    ];
  }

  ngOnInit(): void {
    this.operatorIdoperatorId();
  }

  onTableData(lco:any) {
    this.rowData = [];
    if (lco) {
      this.userservice.getAreaListByOperatorid(this.role, this.username, lco)
        .subscribe((data: any) => {
       
          this.areaList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.areaList);
        });
    }
    this.userservice.getAreaChangeSubscriberList(this.role, this.username, lco,).subscribe(
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
  }
  onAreaStatusChange() {
    console.log(this.area);
    this.streetList = [];
    if (this.area) {
      this.userservice.getStreetListByAreaid(this.role, this.username, this.area)
        .subscribe((data: any) => {
          console.log(data);
          console.log(data?.streetid);
          this.streetList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.streetList);
        });
    }
  }
  onSubscriberStatusChange(lco: any) {
    console.log(this.lco);
    this.rowData = [];
    this.areaList = [];
    this.streetList = [];
    if (lco) {
      this.userservice.getAreaListByOperatorid(this.role, this.username, lco)
        .subscribe((data: any) => {
          console.log(data);
          console.log(data?.areaid);
          this.areaList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.areaList);
        });
    }
    this.userservice.getLcochangeSubscriberList(this.role, this.username, lco, 0, 0).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          // this.rowData = response.body;
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
    console.log(this.operatorid);

    let requestBody = {
      role: this.role,
      username: this.username,
      operatorid: this.lcoId,
      areaid: this.area,
      streetid: this.street,
      subscriberlist: this.rows,

    }
    this.swal.Loading();
    this.userservice.updateAreaChangeSubscriber(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error?.areaid || err?.error?.streetid);
      });
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
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.lcoId = this.lcoDeatails?.operatorid;
      console.log(this.lcoId);

      this.operatorname = this.lcoDeatails?.operatorname;
      this.onTableData(this.lcoId);
      // this.getArealist(this.lcoId);
      // this.onAreaStatusLCOChange(this.lcoId);
      this.onSubscriberStatusChange(this.lcoId);
    })
  }

  
}
