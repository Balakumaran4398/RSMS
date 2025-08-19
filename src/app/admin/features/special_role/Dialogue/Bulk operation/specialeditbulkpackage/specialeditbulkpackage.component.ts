import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-specialeditbulkpackage',
  templateUrl: './specialeditbulkpackage.component.html',
  styleUrls: ['./specialeditbulkpackage.component.scss']
})
export class SpecialeditbulkpackageComponent implements OnInit {
  rowData: any;
  type: any;
  role: any;
  username: any;
  rows: any[] = [];

  lco: string = '';
  area: string = '';
  street: string = '';
  lcoList: Array<{ name: string, value: string }> = [];
  areaList: Array<{ name: string, value: string }> = [];
  streetList: Array<{ name: string, value: string }> = [];

  operatorid: any;
  areaid: any;
  streetid: any;

  filteredOperators: any[] = [];
  selectoperator: any;
  selectArea: any;
  selectStreet: any;
  filteredOperatorList: any[] = [];
  filteredAreaList: any[] = [];
  filteredStreetList: any[] = [];
  constructor(public dialogRef: MatDialogRef<SpecialeditbulkpackageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService, private swal: SwalService,
    private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.rowData = data?.row;
    this.type = data.type;
    console.log(this.rowData);
    console.log(this.type);
    // this.operatorid = this.rowData.map((item: any) => item.operatorid);
    // this.areaid = this.rowData.map((item: any) => item.operatorid);
    // this.streetid = this.rowData.map((item: any) => item.operatorid);
    // console.log(this.operatorid);

  }
  ngOnInit(): void {
    this.operatorlist()
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100 },
    { headerName: "SMARTCARD", field: 'smartcard', width: 250 },
    { headerName: "BOXID", field: 'boxid', width: 200 },
    { headerName: "SUBSCRIBER NAME	", field: 'customername', width: 200 },
    { headerName: "MOBILE NO", field: 'mobileno', width: 200 },
    { headerName: "AREA NAME", field: 'areaname', width: 200 },
  ]

  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.lcoList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredOperatorList = this.lcoList
    })
  }


  onSubscriberStatusChange() {
    console.log(this.lco);
    // this.areaList = [];
    // this.streetList = [];
    if (this.lco) {
      this.userservice.getAreaListByOperatorid(this.role, this.username, this.lco)
        .subscribe((data: any) => {
          console.log(data);
          this.areaList = Object.keys(data || {}).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.areaList);
          this.filteredAreaList = this.areaList;
        });
    }
  }


  onAreaStatusChange() {
    console.log(this.area);
    // this.streetList = [];
    if (this.area) {
      this.userservice.getStreetListByAreaid(this.role, this.username, this.area)
        .subscribe((data: any) => {
          console.log(data);
          this.streetList = Object.keys(data || {}).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.streetList);
          this.filteredStreetList = this.streetList;
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

  updateArea() {
    let requestBody = {
      role: this.role,
      username: this.username,
      operatorid: this.lco,
      areaid: this.area,
      streetid: this.street,
      subscriberlist: this.rowData,

    }
    this.swal.Loading();
    this.userservice.updateAreaChangeSubscriber(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  updateLCO() {
    let requestBody = {
      role: this.role,
      username: this.username,
      retailerid: 0,
      type: 2,
      operatorid: this.lco,
      areaid: this.area,
      streetid: this.street,
      subscriberlist: this.rowData
    }
    this.swal.Loading();
    this.userservice.updateLcoChangeSubscriber(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
}
