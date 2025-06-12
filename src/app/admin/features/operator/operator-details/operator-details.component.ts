import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { EditLcoComponent } from '../../channel_setting/_Dialogue/operator/edit-lco/edit-lco.component';
import { SpecialPermissionComponent } from '../../channel_setting/_Dialogue/operator/special-permission/special-permission.component';
import { AddLcoBusinessComponent } from '../../channel_setting/_Dialogue/operator/add-lco-business/add-lco-business.component';
import { NewLcoComponent } from '../../channel_setting/_Dialogue/operator/new-lco/new-lco.component';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { Router } from '@angular/router';
import { LcodashboardComponent } from '../../channel_setting/_Dialogue/operator/lcodashboard/lcodashboard.component';
import { DataService } from 'src/app/_core/service/Data.service';
import { OperatordialogueComponent } from '../../channel_setting/_Dialogue/operator/operatordialogue/operatordialogue.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OperatorcancelsubreportComponent } from '../../channel_setting/_Dialogue/operator/operatorcancelsubreport/operatorcancelsubreport.component';
import { SwalService } from 'src/app/_core/service/swal.service';
@Component({
  selector: 'app-operator-details',
  templateUrl: './operator-details.component.html',
  styleUrls: ['./operator-details.component.scss']
})
export class OperatorDetailsComponent implements OnInit, AfterViewInit {
  isSystem: boolean = false;
  ismobile: boolean = true;
  edit_dialog: boolean = false;
  permission_dialog: boolean = false
  role: any;
  username: any;
  operatorid: any = 0;
  operatorname: any = 'ALL Operator';
  operator_name: any;
  area: any;
  mobilenumber: any;
  Businessname: any;
  userid: any;
  password: any;
  isactive: boolean = false;
  Balance: any;
  onlinepaymebt: any;
  enablebefore: boolean = false;
  sublcorecharge: boolean = false;
  connectioncount: any;
  activecount: any;
  expirecount: any;
  newcount: any;
  blockcount: any;
  boxinhand: any;
  totalbox: any;
  activeItem: any;
  searchText: any = '';

  showDropdown: boolean = false;
  operatorList: any[] = [];
  originalPagedOperators: any[] = [];
  businessList: any[] = [];
  dashboardDetails: any;
  operatorNameList: any;
  filteredOperators: any[] = [];
  selectedOperator: any;


  id: any;

  operator_details: any = [];
  pagedOperators: any = [];
  pageSize = 10;
  pageIndex = 0;
  totalLength = 0;
  paginatedData: any;

  operator: any;

  constructor(public responsive: BreakpointObserver, private dataService: DataService, private cdr: ChangeDetectorRef, private router: Router, public dialog: MatDialog, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.loadOperators();
    this.onBusinessList();
    this.operatorDeatils('');
  }
  ngAfterViewInit(): void {
    ($('#ltb')as any).select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#ltb').on('change', (event: any) => {
      this.selectedOperator = event.target.value;
      console.log(this.selectedOperator);

      this.onoperatorchange(this.selectedOperator);
    });
  }
  setOperator(data: { isactive: string }) {
    this.operator.isactive = data.isactive === 'true';
  }
  ngOnDestroy(): void {
    ($('#ltb') as any).select2('destroy');
  }

  ngOnInit(): void {



    const response = { isactive: 'true' };
    this.setOperator(response);
    this.responsive
      .observe([Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          console.log(
            'This is the Handset Portrait point at max-width: 599.98 px and portrait orientation.'
          );
        }
      });
    this.checkDeviceType();
    this.loadOperators();
    this.updatePageData();

  }
  operatorDeatils(event: any) {
    console.log(event);
    this.swal.Loading();
    this.userservice.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
      (data: any) => {
        this.operator_details = data;
        this.dashboardDetails = data.map((item: any) => item.list);
        this.totalLength = data.length;
        // this.pagedOperators = data;
        if (!this.originalPagedOperators || this.originalPagedOperators.length === 0) {
          this.originalPagedOperators = [...data];
        }
        // this.originalPagedOperators = [...data]; 
        this.pagedOperators = [...data];
        this.updatePageData();
        this.swal.Close();
      });
  }
  onBusinessList() {
    this.userservice.getLcoBusinesslist(this.role, this.username).subscribe((data: any) => {
      this.businessList = data;
      console.log(data);

    })
  }
  // fetchData() {
  //   this.operator_details = [
  //   ];
  //   this.cdr.detectChanges();
  //   this.updatePage();
  // }

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
    this.userservice.getOeratorList(this.role, this.username, 2).subscribe((data: any) => {
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
    console.log(this.operatorid);

    // this.onoperatorchange({ value });
  }

  onoperatorchange(operator: any): void {
    console.log(operator);
    this.swal.Loading();
    const match = operator.match(/\((\d+)\)/);
    this.selectedOperator = operator;
    console.log(this.selectedOperator);
    if (match) {
      this.operatorid = parseInt(match[1]);
    }
    // this.operatorid = operator.value;
    if (this.operatorid == 0) {
      this.pagedOperators = [...this.originalPagedOperators];
      this.swal.Close();
    } else {
      this.pagedOperators = this.originalPagedOperators.filter(op => op.operatorid === this.operatorid);
      this.swal.Close();
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


  toggleedit(operatorid: any) {
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
    const selectedOperator = this.operator_details.find((operator: any) => operator.operatorid === operatorid);
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

  // New_lco(event: any) {
  New_lco(type: any) {
    console.log(event);
    let dialogData = {
      data: this.businessList,
      type: type
    }
    const dialogRef = this.dialog.open(NewLcoComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: dialogData
      // data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  New_lco_business() {
    const dialogRef = this.dialog.open(AddLcoBusinessComponent, {
      width: '410px',
      panelClass: 'custom-dialog-container',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  cancel_edid_lco() {
    this.edit_dialog = !this.edit_dialog;
  }
  cancel_special_permission() {
    this.permission_dialog = !this.permission_dialog;
  }
  navgetToUrl(operatorid: number) {
    const detailsList = this.operator_details.find((op: any) => op.operatorid === operatorid);
    this.dataService.setDialogData({ detailsList });
    this.router.navigateByUrl(`/admin/lcodashboard/${operatorid}`);
    console.log(detailsList);

  }

  lcodashoard(type: string): void {
    let dialogData = { type: type, detailsList: this.operator_details, };

    const dialogRef = this.dialog.open(LcodashboardComponent, {
      width: '1000px',
      panelClass: 'custom-dialog-container',
      data: dialogData,
    });
  }
  openDialog(type: string, operatorid: any): void {
    const detailsList = this.operator_details.find((op: any) => op.operatorid === operatorid);
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