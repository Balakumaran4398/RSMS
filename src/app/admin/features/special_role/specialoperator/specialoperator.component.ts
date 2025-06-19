
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { SpecialoperatordialogueComponent } from '../Dialogue/specialoperatordialogue/specialoperatordialogue.component';
import { PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/_core/service/swal.service';
@Component({
  selector: 'app-specialoperator',
  templateUrl: './specialoperator.component.html',
  styleUrls: ['./specialoperator.component.scss']
})
export class SpecialoperatorComponent {
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
  filteredOperators: any[] = [];
  showDropdown: boolean = false;
  operatorList: any[] = [];
  operator_details: any = [];
  businessList: any[] = [];
  dashboardDetails: any;

  selectedOperator: any;
  // --------------------------role based----------------------
  isUser: boolean = false;
  isReception: boolean = false;
  isSpecial: boolean = false;
  // ---------------------------------
  pagedOperators: any = [];
  pageSize = 10;
  pageIndex = 0;
  totalLength = 0;
  paginatedData: any;

  constructor(public responsive: BreakpointObserver, private dataService: DataService, private cdr: ChangeDetectorRef, private swal: SwalService,
    private router: Router, public dialog: MatDialog, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }
  ngOnInit(): void {
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

    this.getOplist();
    this.operatorlist();
    this.getLcoList();
  }

  getOplist() {
    this.swal.Loading();
    this.userservice.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
      (data: any) => {
        this.operator_details = data;
        this.dashboardDetails = data.map((item: any) => item.list);
        this.totalLength = data.length;
        this.swal.Close();
        this.updatePageData();
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // this.updatePage();
    this.updatePageData();

  }
  updatePageData() {
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedOperators = this.operator_details.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }

  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.operatorList.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
  }
  getLcoList() {
    this.swal.Loading();
    this.userservice.getLcoBusinesslist(this.role, this.username).subscribe((data: any) => {
      this.businessList = data;
      this.swal.Close();
    })
  }
  operatorlist() {
    this.swal.Loading();
    this.userservice.getOeratorList(this.role, this.username, 2).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        // const name = key.replace(/\(\d+\)$/, '').trim();
        const name = key;


        return { name: name, value: value };
      });
      this.swal.Close();
      this.cdr.detectChanges();
      this.filteredOperators = this.operatorList
    })
  }
  selectOperator(value: string, name: any) {

    console.log(this.filteredOperators);
    this.showDropdown = false;
    this.operatorid = value;
    this.operatorname = name;
    this.onoperatorchange({ value });
  }

  onoperatorchange(operator: any): void {
    console.log(operator);
    this.selectedOperator = operator;
    this.operatorid = operator.value;
    if (operator.value === 0) {
      this.operatorid = 0;
      this.selectedOperator = { name: 'ALL Operator', value: 0 };
    } else {
      this.operatorid = operator.value;
    }


    this.swal.Loading();
    this.userservice.OperatorDetails(this.role, this.username, this.operatorid).subscribe(
      (data: any) => {
        console.log(data);
        // this.operator_details = data;
        this.pagedOperators = data;
        this.swal.Close();
        this.cdr.detectChanges();
      },

      (error) => {

        console.error('Error fetching operator details', error);
        this.swal.Close();
      }
    );
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

  New_lco(type: any) {
    console.log(this.businessList);
    let dialogData = {
      data: this.businessList,
      type: type
    }
    const dialogRef = this.dialog.open(NewLcoComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
       data: dialogData
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
  navgetTosublcoUrl(operatorid: number) {
    const detailsList = this.operator_details.find((op: any) => op.operatorid === operatorid);
    this.dataService.setDialogData({ detailsList });
    this.router.navigateByUrl(`/admin/sublcodashboard/${operatorid}`);
    console.log(detailsList);
  }

  lcodashoard(type: string): void {
    let dialogData = { type: type, detailsList: this.operator_details, };

    const dialogRef = this.dialog.open(LcodashboardComponent, {
      width: '1000px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
  }
  openDialog(type: string): void {
    let dialogData = { type: type, detailsList: this.operator_details, };

    const dialogRef = this.dialog.open(SpecialoperatordialogueComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
  }
}