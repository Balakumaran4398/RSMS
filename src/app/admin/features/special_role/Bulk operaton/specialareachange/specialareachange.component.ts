import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { SpecialeditbulkpackageComponent } from '../../Dialogue/Bulk operation/specialeditbulkpackage/specialeditbulkpackage.component';

@Component({
  selector: 'app-specialareachange',
  templateUrl: './specialareachange.component.html',
  styleUrls: ['./specialareachange.component.scss']
})
export class SpecialareachangeComponent implements OnInit {
  selectedTab: string = 'areachange';
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
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
  };


  operatorid: any;

  lco: string = '';
  area: string = '';
  street: string = '';
  selectoperator: any;
  selectArea: any;
  selectStreet: any;
  lcoList: Array<{ name: string, value: string }> = [];
  areaList: Array<{ name: string, value: string }> = [];
  streetList: Array<{ name: string, value: string }> = [];

  filteredOperators: any[] = [];
  filteredOperatorList: any[] = [];
  filteredAreaList: any[] = [];
  filteredStreetList: any[] = [];
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  isRowSelected: boolean = false;

  columnDefs: any[] = [];
  rows: any[] = [];
  constructor(public dialog: MatDialog, private userservice: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.columnDefs = [
      { headerName: "S.No", valueGetter: 'node.rowIndex+1', lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 100, },
      { headerName: "CUSTOMER NAME", field: 'customername', width: 250 },
      { headerName: "FATHER NAME	", field: 'fathername', width: 200 },
      { headerName: "SMARTCARD", field: 'smartcard', width: 250 },
      { headerName: "AREA NAME", field: 'areaname', width: 250 },
      { headerName: "STREET NAME", field: 'streetname', width: 250 },
      { headerName: "ADDRESS", field: 'address', width: 250 },
      { headerName: "MOBILE NO", field: 'mobileno', width: 220 },
    ];
  }
  ngOnInit(): void {
    this.operatorlist();
    this.selectTab('lcochange');
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    this.lco = '';
    this.area = '';
    this.street = '';
    this.updateColumnDefs(tab);
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  private updateColumnDefs(tab: string): void {
    console.log(this.rowData = []);
    if (tab === 'areachange') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 100, filter: false },
        { headerName: "CUSTOMER NAME", field: 'customername', width: 250 },
        { headerName: "FATHER NAME	", field: 'fathername', width: 200 },
        { headerName: "SMARTCARD", field: 'smartcard', width: 250 },
        { headerName: "AREA NAME", field: 'areaname', width: 250 },
        { headerName: "STREET NAME", field: 'streetname', width: 250 },
        { headerName: "ADDRESS", field: 'address', width: 250 },
        { headerName: "MOBILE NO", field: 'mobileno', width: 220 },
      ];
    } else if (tab === 'lcochange') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', lockPosition: true, headerCheckboxSelection: true, checkboxSelection: true, width: 100, filter: false },
        { headerName: "SMARTCARD", field: 'smartcard', width: 250 },
        { headerName: "BOXID", field: 'boxid', width: 200 },
        { headerName: "SUBSCRIBER NAME	", field: 'customername', width: 250 },
        { headerName: "MOBILE NO", field: 'mobileno', width: 250 },
        { headerName: "AREA NAME", field: 'areaname', width: 250 },
        { headerName: "STREET NAME", field: 'streetname', width: 250 },
        { headerName: "EXPIRY DATE", field: 'expirydate', width: 200 },
      ];
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
  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.lcoList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      // this.filteredOperators = this.lcoList
      this.filteredOperatorList = this.lcoList
    })
  }





  onSubscriberStatusLCOChange() {
    console.log(this.lco);
    this.rowData = [];
    this.selectoperator = '';
    this.selectArea = '';
    if (this.lco) {
      this.userservice.getAreaListByOperatorid(this.role, this.username, this.lco)
        .subscribe((data: any) => {
          this.rowData = data;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
          console.log(this.rowData);
          console.log(data?.areaid);
          this.areaList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.areaList);
          this.filteredAreaList = this.areaList;
        });

      this.filteredAreaList = [];
      this.filteredStreetList = [];
    }
    this.userservice.getLcochangeSubscriberList(this.role, this.username, this.lco, 0, 0).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          // this.updateColumnDefs(this.selectedTab);
          this.rowData = response.body;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
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


  onAreaStatusChange() {
    console.log(this.area);
    this.streetList = [];
    this.areaList = [];

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
          this.filteredStreetList = this.streetList
        });
    }
  }
  onAreaStatusLCOChange() {
    console.log(this.area);
    this.rowData = [];
    this.streetList = [];
    if (this.area) {
      this.userservice.getStreetListByAreaid(this.role, this.username, this.area)
        .subscribe((data: any) => {
          console.log(data?.streetid);
          this.streetList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.streetList);
          this.filteredStreetList = this.streetList
        });
    }
    this.userservice.getLcochangeSubscriberList(this.role, this.username, this.lco, this.area, 0).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
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
  onSubscriberStreetLCOChange() {
    // this.rowData = [];
    console.log('1111111');

    console.log(this.street);
    this.userservice.getLcochangeSubscriberList(this.role, this.username, this.lco, this.area, this.street).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
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





  onTableData() {
    this.rowData = [];
    this.selectoperator = '';
    this.selectArea = '';
    if (this.lco) {
      this.userservice.getAreaListByOperatorid(this.role, this.username, this.lco)
        .subscribe((data: any) => {
          this.rowData = data;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
          console.log(this.rowData);
          console.log(data?.areaid);
          this.areaList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.areaList);
          this.filteredAreaList = this.areaList;
        });
      this.filteredAreaList = [];
      this.filteredStreetList = [];
    }
    this.userservice.getAreaChangeSubscriberList(this.role, this.username, this.lco,).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          // this.updateColumnDefs(this.selectedTab);
          this.rowData = response.body;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }
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
  filteredOperator() {
    const searchTerm = this.selectoperator?.toLowerCase() || '';
    if (!searchTerm) {
      this.filteredOperatorList = [...this.lcoList];
    } else {
      console.log('Filtered List', this.filteredOperatorList);
      console.log('LCO List', this.lcoList);

      this.filteredOperatorList = this.lcoList.filter(op =>
        op.name.toLowerCase().includes(searchTerm) ||
        op.value.toString().toLowerCase().includes(searchTerm)
      );
    }
  }
  filteredArea() {
    const searchTerm = this.selectArea?.toLowerCase() || '';
    console.log(this.selectArea);

    if (!searchTerm) {
      this.filteredAreaList = this.areaList;
    } else {
      console.log('Filtered List', this.filteredAreaList);
      console.log('area List', this.areaList);

      this.filteredAreaList = this.areaList.filter(area =>
        area.name.toLowerCase().includes(searchTerm) ||
        area.value.toString().toLowerCase().includes(searchTerm)
      );
    }
  }
  filteredStreet() {
    const searchTerm = this.selectStreet?.toLowerCase() || '';
    if (!searchTerm) {
      this.filteredStreetList = [...this.streetList];
    } else {
      console.log('Filtered List', this.filteredStreetList);
      console.log('Street List', this.streetList);

      this.filteredStreetList = this.streetList.filter(str =>
        str.name.toLowerCase().includes(searchTerm) ||
        str.value.toString().toLowerCase().includes(searchTerm)
      );
    }
  }

  change(type: any) {
    let width = '500px';
    if (type === 'areachange') {
      width = '500px';
    } else if (type === 'lcochange') {
      width = '500px';
    }
    let data = { type: type, row: this.rows };
    console.log(data);
    const dialogRef = this.dialog.open(SpecialeditbulkpackageComponent, {
      width: '1200px',
      data: data,
      panelClass: 'custom-dialog-container',
    });
  }
  updateArea() {
    let requestBody = {
      role: this.role,
      username: this.username,
      operatorid: this.lco,
      areaid: this.area,
      streetid: this.street,
      subscriberlist: this.rows,
    }

    this.swal.Loading();
    if (!this.lco) {
      this.swal.Error("Please select LCO");
      return;
    }

    if (!this.area) {
      this.swal.Error("Please select Area");
      return;
    }

    if (!this.street) {
      this.swal.Error("Please enter Street");
      return;
    }

    this.userservice.updateAreaChangeSubscriber(requestBody)
      .subscribe(
        (res: any) => {
          this.swal.success(res?.message);
        },
        (err) => {
          this.swal.Error(err?.error?.message);
        }
      );

  }
  tableData() {
    this.userservice.getAreaListByOperatorId(this.role, this.username, this.operatorid).subscribe((data: any) => {
      this.rowData = data;
      console.log(data);
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
  }

}