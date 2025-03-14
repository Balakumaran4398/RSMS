import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { OperatordialogueComponent } from '../../channel_setting/_Dialogue/operator/operatordialogue/operatordialogue.component';
import { StreetComponent } from '../../channel_setting/_Dialogue/operator/street/street.component';
import { EditareaComponent } from '../../channel_setting/_Dialogue/operator/editarea/editarea.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NavComponent } from '../../nav/nav.component';
import { OperatorService } from 'src/app/_core/service/operator.service';

@Component({
  selector: 'app-area-street',
  templateUrl: './area-street.component.html',
  styleUrls: ['./area-street.component.scss']
})
export class AreaStreetComponent implements OnInit {
  role: any;
  username: any;

  operatorDetails: any[] = [];
  operatorid: any;
  areaid: any;
  operatorname: any;
  mobile: any;
  mailid: any;
  userid: any;
  address: any;
  pincode: any;
  password: any;
  area: any;
  state: any;
  Totalamount: any;


  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        if (!isNaN(valueA) && !isNaN(valueB)) {
          return Number(valueA) - Number(valueB);
        }
        if (!valueA) valueA = '';
        if (!valueB) valueB = '';
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      },
    },
    paginationPageSize: 5,
    pagination: true,
    paginationPageSizeOptions: [5, 10, 15, 20, 25],
  }
  gridOptions1 = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        if (!isNaN(valueA) && !isNaN(valueB)) {
          return Number(valueA) - Number(valueB);
        }
        if (!valueA) valueA = '';
        if (!valueB) valueB = '';
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      },
    },
    paginationPageSize: 10,
    pagination: true,
    paginationPageSizeOptions: [5, 10, 15, 20, 25],
  }
  rowData: any[] = [];
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedname: any[] = [];
  rows: any[] = [];


  isactive: boolean = false;
  Areaname: any;
  Areapincode: any;

  lco: any;

  lcoDeatails: any;
  lcoId: any;
  lcoName: any;

  IsOperator: boolean = false;
  Isuser: boolean = false;

  constructor(private route: ActivatedRoute, private swal: SwalService, private navComponent: NavComponent, public dialog: MatDialog, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();


  }

  ngOnInit(): void {

    if (this.role === 'ROLE_ADMIN' || this.role === 'ROLE_SPECIAL') {
      this.Isuser = true;
      this.IsOperator = false;
      this.tableData();
      console.log('ROLE_ADMIN');

    }
    if (this.role === 'ROLE_OPERATOR') {
      this.Isuser = false;
      this.IsOperator = true;
      this.operatorIdoperatorId();
      console.log('ROLE_OPERATOR');
    }
  }

  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.operatorid = this.lcoDeatails?.operatorid;
      console.log(this.operatorid);
      this.tableLcoData(this.operatorid);
    })
  }


  tableData() {
    this.userservice.getAreaListByOperatorId(this.role, this.username, this.operatorid).subscribe((data: any) => {
      this.rowData = data;
      console.log(data);
      this.isactive = data.find((item: any) => item)?.isactive;
      console.log(this.isactive);

      this.Areaname = data.find((item: any) => item)?.name;
      this.Areapincode = data.find((item: any) => item)?.pincode;
      this.areaid = data.find((item: any) => item)?.id;
    })
  }
  tableLcoData(operator: any) {
    console.log(operator);
    this.userservice.getAreaListByOperatorId(this.role, this.username, operator).subscribe((data: any) => {
      this.rowData = data;
      console.log(data);
      this.isactive = data.find((item: any) => item)?.isactive;
      console.log(this.isactive);

      this.Areaname = data.find((item: any) => item)?.name;
      this.Areapincode = data.find((item: any) => item)?.pincode;
      this.areaid = data.find((item: any) => item)?.id;
    })
  }
  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, filter: false,

    },
    { headerName: 'AREA NAME', width: 300, field: 'name', filter: true, },

    {
      headerName: 'STREET DETAILS', width: 250, filter: false,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<img src="/assets/images/icons/streetlist2.webp" style="width:30px;background-color:none">';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Street List';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.street(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },

    {
      headerName: 'EDIT', width: 200, filter: false,

      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<img src="/assets/images/icons/editstreet2.png" style="width:30px;background-color:none">';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Street List';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.editarea(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      },
    },
    {
      headerName: 'STATUS', field: 'statusdisplay', width: 200, filter: false,
      cellRenderer: (params: { value: any; data: any }) => {
        const status = params.data?.statusdisplay === 'Active';

        const toggleContainer = document.createElement('div');
        toggleContainer.style.display = 'flex';
        toggleContainer.style.alignItems = 'center';
        toggleContainer.style.justifyContent = 'center';

        const toggleSwitch = document.createElement('div');
        toggleSwitch.style.width = '45px';
        toggleSwitch.style.height = '20px';
        toggleSwitch.style.borderRadius = '15px';
        toggleSwitch.style.backgroundColor = status ? '#4CAF50' : '#616060';
        toggleSwitch.style.position = 'relative';
        toggleSwitch.style.cursor = 'pointer';
        toggleSwitch.style.transition = 'background-color 0.3s ease';

        const toggleCircle = document.createElement('div');
        toggleCircle.style.width = '15px';
        toggleCircle.style.height = '15px';
        toggleCircle.style.borderRadius = '50%';
        toggleCircle.style.backgroundColor = '#fff';
        toggleCircle.style.position = 'absolute';
        toggleCircle.style.top = '50%';
        toggleCircle.style.transform = 'translateY(-50%)';
        toggleCircle.style.left = status ? 'calc(100% - 22px)' : '3px';
        toggleCircle.style.transition = 'left 0.3s ease';

        toggleSwitch.appendChild(toggleCircle);
        toggleContainer.appendChild(toggleSwitch);
        return toggleContainer;
      }
    },
    { headerName: 'SUBSCRIBER COUNT	', width: 250, field: 'subscribercount', filter: true, },
    { headerName: 'PINCODE ', field: 'pincode', width: 250, filter: true, },

  ];
  validatePincode(pincode: string): boolean {
    const pincodePattern = /^\d{6}$/;
    return pincodePattern.test(pincode);
  }
  saveRow(rowData: any) {
    const requestBody = {
      role: this.role,
      username: this.username,
      name: rowData.name,
      operatorid: this.operatorid,
      pincode: rowData.pincode,
      isactive: rowData.isactive,
      id: this.areaid
    };

    this.userservice.updateArea(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  newArea(type: any): void {
    let dialogData = { type: type, operatorid: this.operatorid };
    const dialogRef = this.dialog.open(OperatordialogueComponent, {
      width: '400px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  street(data: any): void {
    const dialogRef = this.dialog.open(StreetComponent, {
      width: '1000px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  editarea(data: any): void {
    const dialogRef = this.dialog.open(EditareaComponent, {
      width: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((row: any) => row.packageid);
      this.selectedname = selectedRows.map((row: any) => row.productname);

    }
  }
  updateArea() {
    let requestBody = {
      role: this.role,
      username: this.username,
      name: this.Areaname,
      operatorid: this.operatorid,
      pincode: this.Areapincode,
      isactive: this.isactive,

    } as any;
    this.userservice.updateArea(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
}
