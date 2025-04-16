import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { NewLcoComponent } from '../../channel_setting/_Dialogue/operator/new-lco/new-lco.component';
import { DiscountdialogComponent } from '../Dialog/discountdialog/discountdialog.component';
import { DistributordiscountComponent } from '../Dialog/distributordiscount/distributordiscount.component';
import { EditLcoComponent } from '../../channel_setting/_Dialogue/operator/edit-lco/edit-lco.component';
import { DistribtorupdatediscountComponent } from '../Dialog/distribtorupdatediscount/distribtorupdatediscount.component';
import { LogarithmicScale } from 'chart.js';
import { SpecialPermissionComponent } from '../../channel_setting/_Dialogue/operator/special-permission/special-permission.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OperatordialogueComponent } from '../../channel_setting/_Dialogue/operator/operatordialogue/operatordialogue.component';
import { OperatorcancelsubreportComponent } from '../../channel_setting/_Dialogue/operator/operatorcancelsubreport/operatorcancelsubreport.component';

@Component({
  selector: 'app-distributorsetting',
  templateUrl: './distributorsetting.component.html',
  styleUrls: ['./distributorsetting.component.scss']
})
export class DistributorsettingComponent implements OnInit {
  role: any;
  username: any;
  lcoDeatails: any;
  operatorid: any;
  businessList: any[] = [];


  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  rowData: any;
  gridApi: any;

  constructor(private userService: BaseService, private storageService: StorageService, public dialog: MatDialog, private cdr: ChangeDetectorRef,) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }

  ngOnInit(): void {
    this.onBusinessList();
    this.operatorIdoperatorId();

  }
  columnDefs = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "OPERATOR NAME	", field: 'operatorname', width: 200, },
    { headerName: "AREA	", field: 'address', width: 200, },
    { headerName: "BALANCE", field: 'balance', width: 200, },
    {
      headerName: "USER NAME", field: 'userid', width: 200,
      cellStyle: { color: "#0F5132" }
    },
    {
      headerName: "PASSWORD", field: 'password', width: 200,
      cellStyle: { color: "#842029" }
    },
    { headerName: "MOBILE NUMBER", field: 'contactnumber1', width: 200, },
    { headerName: "CREATED DATE", field: 'createddate', width: 200, },

    {
      headerName: "PERCENTAGE", width: 200, cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-percent" aria-hidden="true" style="font-size: 23px;color: darkcyan;cursor: pointer;"></i>';

        // <img src="/assets/images/icons/editstreet2.png" style="width:30px;background-color:none">';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Edit';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.openaddedlogue('packageDetails', params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      },
    },
    {
      headerName: "EDIT", width: 200, cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        // editButton.innerHTML = '<img src="/assets/images/icons/editstreet2.png" style="width:30px;background-color:none">';
        editButton.innerHTML = '<i class="far fa-edit" style="font-size: 23px;color: #ff4081;cursor: pointer;"></i> ';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Edit';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.toggleedit('editlco', params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    {
      headerName: "ACTION", width: 200,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        // editButton.innerHTML = '<img src="/assets/images/icons/editstreet2.png" style="width:30px;background-color:none">';
        editButton.innerHTML = '<i class="fas fa-tachometer-alt" style="font-size: 23px;color:rgb(2, 86, 107);cursor: pointer;"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Edit';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.toggleedit('lco_dashboard', params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
  ];

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorid = this.lcoDeatails?.operatorid;
      this.onOperatorList();
    })
  }
  onBusinessList() {
    this.userService.getLcoBusinesslist(this.role, this.username).subscribe((data: any) => {
      this.businessList = data;
      console.log(data);

    })
  }
  // New_lco() {
  //   const dialogRef = this.dialog.open(NewLcoComponent, {
  //     width: '600px',
  //     panelClass: 'custom-dialog-container',
  //     data: this.businessList
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  New_lco(event: any) {
    console.log(event);
    let dialogData = {
      data: this.businessList,
      type: event
    }
    const dialogRef = this.dialog.open(NewLcoComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      // data: this.businessList,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openaddedlogue(type: any, data: any) {
    let dialogData = { type: type, data: data };
    console.log(dialogData);
    const dialogRef = this.dialog.open(DistributordiscountComponent, {
      panelClass: 'custom-dialog-container',
      data: dialogData,
      width: type === 'packageDetails' ? '1300px' : 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  operatorList: any[] = [];
  onOperatorList() {
    this.userService.getAllLcoList(this.role, this.username, this.operatorid).subscribe((data: any) => {
      this.rowData = data;
      this.pagedOperators = data;
      // this.pagedOperators = [...this.originalPagedOperators];
    })
    // this.userService.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
    //   (data: any) => {
    //     console.log(data);
    //     // this.operator_details = data;
    //     // this.pagedOperators = data;
    //   },
    //   (error) => {
    //     console.error('Error fetching operator details', error);
    //   }
    // );
  }

  toggleedit(type: any, data: any,) {
    // const selectedOperator = this.operator_details.find((operator: any) => operator.operatorid === operatorid);
    let dialalogData = { type: type, data: data, }
    console.log(dialalogData);

    const dialogRef = this.dialog.open(DistribtorupdatediscountComponent, {
      panelClass: 'custom-dialog-container',
      data: dialalogData,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  // ============================================grid option ====================================

  operator_details: any = [];
  pagedOperators: any = [];
  originalPagedOperators: any[] = [];
  pageSize = 10;
  pageIndex = 0;
  totalLength = 0;
  paginatedData: any;
  operatorname: any;
  selectedOperator: any;
  filteredOperators: any[] = [];


  isSystem: boolean = false;
  ismobile: boolean = true;
  edit_dialog: boolean = false;
  permission_dialog: boolean = false;

  showDropdown: boolean = false;

  onPageChange(event: PageEvent): void {
    this.cdr.detectChanges();
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePageData();
  }

  updatePageData() {
    this.cdr.detectChanges();
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedOperators = this.operator_details.slice(startIndex, startIndex + this.pageSize);
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.operatorList.filter(operator => operator.name.toLowerCase().includes(filterValue));
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  loadOperators() {
    this.userService.getOeratorList(this.role, this.username, 2).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        return { name: key, value: value };
      });
      this.filteredOperators = this.operatorList;
    });
  }


  onFilterChange(filteredData: any): void {
    this.filteredOperators = filteredData;
  }
  selectOperator(value: string, name: any) {
    this.showDropdown = false;
    this.operatorid = value;
    this.operatorname = name;
    this.onoperatorchange({ value });
  }

  onoperatorchange(operator: any): void {
    this.selectedOperator = operator;
    this.operatorid = operator.value;
    if (operator.value === 0) {
      this.pagedOperators = [...this.originalPagedOperators];
    } else {
      this.pagedOperators = this.originalPagedOperators.filter(op => op.operatorid === this.operatorid);
    }
    console.log('Filtered Operators:', this.pagedOperators);
  }

  checkDeviceType(): void {
    const width = window.innerWidth;
    if (width <= 660) {
      this.ismobile = true;
      this.isSystem = false;
    } else {
      this.ismobile = false;
      this.isSystem = true;
    }
  }


  toggleedit1(operatorid: any) {
    console.log('Editing operator with ID:', operatorid);
    const selectedOperator = this.operator_details.find((operator: any) => operator.operatorid === operatorid);
    console.log(selectedOperator);
    if (selectedOperator) {
      const dialogRef = this.dialog.open(EditLcoComponent, {
        width: '800px',
        panelClass: 'custom-dialog-container',
        data: selectedOperator
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
          console.log('Dialog result:', result);
        }
      });
    } else {
      console.error('Operator not found for the provided ID.');
    }
  }
  togglepermission(operatorid: any) {
    console.log('Editing operator with ID:', operatorid);
    // const selectedOperator = this.operator_details.find((operator: any) => operator.operatorid === operatorid);
    const selectedOperator = operatorid;
    console.log(selectedOperator);

    if (selectedOperator) {
      const dialogRef = this.dialog.open(SpecialPermissionComponent, {
        width: '800px',
        panelClass: 'custom-dialog-container',
        data: selectedOperator
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
          console.log('Dialog result:', result);
        }
      });
    }
  }
  openDialog(type: string, operator: any): void {
    console.log(type);
    console.log(operator);
    const detailsList = operator;
    console.log(detailsList);
    console.log(detailsList.operatorname);

    let dialogData = { type: type, detailsList: this.operator_details, operatorid: detailsList.operatorid, operatorname: detailsList.operatorname, };
    console.log(dialogData);
    const dialogRef = this.dialog.open(OperatordialogueComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: dialogData,
    });
  }
  opencancelsubDialog(type: string, operatorid: any): void {
    const detailsList = this.operator_details.find((op: any) => op.operatorid === operatorid);
    let dialogData = { type: type, detailsList: this.operator_details, operator: detailsList.operatorid, operatorname: detailsList.operatorname, };
    const dialogRef = this.dialog.open(OperatorcancelsubreportComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
  }

}
