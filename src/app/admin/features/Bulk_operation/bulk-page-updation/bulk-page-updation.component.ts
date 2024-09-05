import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-bulk-page-updation',
  templateUrl: './bulk-page-updation.component.html',
  styleUrls: ['./bulk-page-updation.component.scss']
})
export class BulkPageUpdationComponent {
  selectedTab: string = 'all_operator';
  package_select: boolean = false;
  cas: any[] = [];
  type: any = [
    { label: "Select filter Type", value: 0 },
    { lable: "LCO", value: 1 },
    { lable: "SMARTCARD/BoxID", value: 2 },
    { lable: "Datewise", value: 3 },
  ];
  lco: any = [
    { label: "Select filter Lco", value: 0 },
    { lable: "fdsfdsfdsf", value: 1 },
    { lable: "sfdsfdsfdsewrwr", value: 2 },
    { lable: "jhdjhsdsad", value: 3 },
  ];
  alltype: any = [
    { label: "ALL", value: 1 },
    { label: "Failure", value: 2 }
  ]
  smartcard: any;
  form!: FormGroup;
  username: any;
  role: any;
  CasFormControl: any;
  typeFormControl:any;
  LcoFormControl:any;
  columnDefs1: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "CUSTOMER NAME", field: 'intend_to' },
    { headerName: "SMARTCARD", field: '' },
    { headerName: "BOX ID", field: '' },
    { headerName: "PACKAGE NAME", field: '' },
    { headerName: "EXPIRY DATE", field: '' },
  ];
  rowData = [
    {
      intend_to: 'Example Value',
    },
  ];
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 250,
      floatingFilter: true
    },
    // paginationPageSize: 15,
    // pagination: true,
  }
  columnDefs: any;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService) {

    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.columnDefs = [
      { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
      { headerName: "CUSTOMER NAME", field: 'intend_to' },
      { headerName: "SMARTCARD", field: '' },
      { headerName: "BOX ID", field: '' },
      { headerName: "PACKAGE NAME", field: '' },
      { headerName: "EXPIRY DATE", field: '' },
    ];
  }

  private updateColumnDefs(tab: string): void {
    if (tab === 'bulk_package') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
        { headerName: "CUSTOMER NAME", field: 'intend_to' },
        { headerName: "SMARTCARD", field: '' },
        { headerName: "BOX ID", field: '' },
        { headerName: "PACKAGE NAME", field: '' },
        { headerName: "EXPIRY DATE", field: '' },
      ];
    } else if (tab === 'pending') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
        { headerName: "OPERATOR NAME	", field: 'intend_to' },
        { headerName: "CUSTOMER NAME	", field: '' },
        { headerName: "SMARTCARD", field: '' },
        { headerName: "BOX ID", field: '' },
        { headerName: "CREATED DATE", field: '' },
        { headerName: "PACKAGE NAME", field: '' },
        { headerName: "EXPIRY DATE", field: '' },
        { headerName: "STATUS", field: '' },
      ];
    } else if (tab === 'archive') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
        { headerName: "OPERATOR NAME	", field: 'intend_to' },
        { headerName: "CUSTOMER NAME	", field: '' },
        { headerName: "SMARTCARD", field: '' },
        { headerName: "BOX ID", field: '' },
        { headerName: "ECREATED DATE", field: '' },
        { headerName: "PACKAGE NAME	", field: '' },
        { headerName: "EXPIRY DATE	", field: '' },
        { headerName: "STATUS", field: '' },
      ];
    }
  }
  ngOnInit() {
    this.form = this.fb.group({
      package_select: [false],
      casSelect: [{ value: '', disabled: true }] // initially disabled
    });

    this.form.get('package_select')?.valueChanges.subscribe(checked => {
      if (checked) {
        this.form.get('casSelect')?.enable();
      } else {
        this.form.get('casSelect')?.disable();
      }
    });

    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.cas = data.map((item: any) => item.casname);
      console.log(this.cas);
    });

  }
  ngAfterViewInit(): void {
    this.loadData(this.selectedTab);
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    this.loadData(tab);  

  }
  private loadData(tab: any): void {
    // this.userService.PackagemasterList(this.user_role, this.username, tab).subscribe((data) => {
    // console.log(data);
    this.updateColumnDefs(tab);
    // });
  }
  // onCheckboxChange(event: Event): void {
  //   this.package_select = (event.target as HTMLInputElement).checked;
  // }
  handleFileInput(event: Event): void {

  }
  onGridReady = () => {
    // this.userservice.GetAllUser('all',this.token.getUsername(),'0000-00-00','0000-00-00').subscribe((data) => {
    //   this.gridApi.setRowData(data);
    //   this.listUser = data;      
    // });
  }
  maxDate = new Date();
  fromdate: any = "null";
  todate: any = 'null';

  getFromDate(event: any) {
    // console.log(event.value);
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date

  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate();
    const month = new Date(event.value).getMonth() + 1;
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    // console.log(this.fromdate + "---" + this.todate);
    // this.filterDistributorList()
    this.filterDistributorListByMultiple()
  }
  filterDistributorListByMultiple() {
    let payload = {
      // "statelist": this.allSelectedStateList,
      // "districtlist": this.allSelectedDistrictList,
      // "citylist": this.allSelectedCityList,
      // "locationlist": this.allSelectedLocationList,
      "fromdate": this.fromdate,
      "todate": this.todate
    }
    // this.clientService.getAllDistributorListByList(payload).subscribe(res => {
      // console.log(res);
      // this.rowData = res;
      // this.rowDatafilter = res;
    // })
  }
 
}