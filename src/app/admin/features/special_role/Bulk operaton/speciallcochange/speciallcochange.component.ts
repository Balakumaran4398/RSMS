
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-speciallcochange',
  templateUrl: './speciallcochange.component.html',
  styleUrls: ['./speciallcochange.component.scss']
})
export class SpeciallcochangeComponent implements OnInit {

  username: any;
  role: any;

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, },
    { headerName: "SMARTCARD", field: 'smartcard' },
    { headerName: "BOXID", field: 'boxid' },
    { headerName: "SUBSCRIBER NAME	", field: 'areaname' },
    { headerName: "MOBILE NO", field: 'mobileno' },
    { headerName: "AREA NAME", field: 'areaname' },
    { headerName: "STREET NAME", field: 'streetname' },
    { headerName: "EXPIRY DATE", field: 'expirydate' },
  ];
  rowData: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 200,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
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
  agGrid: any;
  constructor(public dialog: MatDialog, private userservice: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {
    this.operatorlist();

  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    }
  }
  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username,1).subscribe((data: any) => {
      console.log(data);
      this.lcoList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredOperators = this.lcoList
    })
  }


  onSubscriberStatusChange() {
    console.log(this.lco);
    this.areaList = [];
    this.streetList = [];
    if (this.lco) {
      this.userservice.getAreaListByOperatorid(this.role, this.username, this.lco)
        // this.userservice.getLcochangeSubscriberList(this.role, this.username, this.lco, 0, 0)
        .subscribe((data: any) => {
          console.log(data?.areaid);
          this.areaList = Object.keys(data?.areaid || {}).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data.areaid[key];
            return { name, value };
          });
          console.log(this.areaList);
        });
    }
    this.userservice.getLcochangeSubscriberList(this.role, this.username, this.lco, 0, 0)
      .subscribe((data: any) => {
        console.log(data?.areaid);
        this.areaList = Object.keys(data?.areaid || {}).map(key => {
          const name = key.replace(/\(\d+\)$/, '').trim();
          const value = data.areaid[key];
          return { name, value };
        });
        console.log(this.areaList);
      });
  }


  onAreaStatusChange() {
    console.log(this.area);

    this.streetList = [];
    if (this.area) {
      // this.userservice.getStreetListByAreaid(this.role, this.username, this.area)
      this.userservice.getLcochangeSubscriberList(this.role, this.username, 0, this.area, 0)
        .subscribe((data: any) => {
          console.log(data?.streetid);
          this.streetList = Object.keys(data?.streetid || {}).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data.streetid[key];
            return { name, value };
          });
          console.log(this.streetList);
        });
    }

  }

  onTableData() {
    this.userservice.getLcochangeSubscriberList(this.role, this.username, this.lco, this.area, this.street).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          // this.updateColumnDefs(this.selectedTab);
          this.rowData = response.body;
          this.swal.Success_200();
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



}