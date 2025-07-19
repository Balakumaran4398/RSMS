import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { EditInventoryComponent } from '../../channel_setting/_Dialogue/Inventory/edit-inventory/edit-inventory.component';
import { BulkpackageupdationComponent } from '../../channel_setting/_Dialogue/BULK OPERATION/bulkpackageupdation/bulkpackageupdation.component';
import { from, Observable } from 'rxjs';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bulk-page-updation',
  templateUrl: './bulk-page-updation.component.html',
  styleUrls: ['./bulk-page-updation.component.scss']
})
export class BulkPageUpdationComponent implements OnInit {
  selectedTab: string = 'bulk_package';
  package: any = '';
  operatorid: any;
  selectoperator: any;
  package_select: boolean = false;
  isCheckboxChecked: boolean = false;
  packageList: any[] = [];
  filteredPackageList: any[] = [];
  filteredOperatorList: any[] = [];
  operatorList: any[] = [];
  cas: any[] = [];
  castype: any;
  casname: any = '';
  typelist: any;
  alltypelist: any;
  packageSearch: string = '';
  maxDate = new Date(2400, 11, 31);
  fromdate: any;
  todate: any;
  date: any;
  selectedDate: any;
  gridApi: any;
  gridColumnApi: any;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  rows: any[] = [];
  isAnyRowSelected: boolean = false;
  isSelectRow: boolean = false;
  searchTerm: any;
  filteredCasList: { name: string; id: number }[] = [];

  retailerid: any;
  lcoDeatails: any;
  lcoId: any;
  operatorname: any;
  isplan: any;
  isdate: any;
  isDatetoDate: any;

  file: File | null = null;
  filePath: string = '';
  isFileSelected: boolean = false;

  type: any = [
    { label: "Select filter Type", value: 0 },
    { label: "LCO", value: 1 },
    { label: "SMARTCARD/BoxID", value: 2 },
    { label: "Datewise", value: 3 },
  ];

  lco: any = [
    { label: "Select filter Lco", value: 0 },
    { lable: "fdsfdsfdsf", value: 1 },
    { lable: "sfdsfdsfdsewrwr", value: 2 },
    { lable: "jhdjhsdsad", value: 3 },
  ];
  alltype: any = [
    { label: "ALL", value: 0 },
    { label: "Success", value: 1 },
    { label: "Failure", value: 2 }
  ]
  smartcard: any;
  form!: FormGroup;
  username: any;
  role: any;
  status: any;
  serviceStatus: any;
  CasFormControl: any;
  typeFormControl: any;
  LcoFormControl: any;
  columnDefs1: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "CUSTOMER NAME", field: 'intend_to' },
    { headerName: "SMARTCARD", field: '' },
    { headerName: "BOX ID", field: '' },
    { headerName: "PACKAGE NAME", field: '' },
    { headerName: "EXPIRY DATE", field: '' },
  ];
  rowData: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 250,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20],
    pagination: true,
    rowClassRules: {
      'always-selected': (params: any) => params.data,
    },
    onFirstDataRendered: (params: { api: { forEachNode: (arg0: (node: any) => void) => void; }; }) => {
      this.selectRowsBasedOnUsername(params);
    },

  }

  selectRowsBasedOnUsername(params: { api: { forEachNode: (arg0: (node: any) => void) => void; }; }) {
    params.api.forEachNode((node) => {
      if (node.data) {
        node.setSelected(true);
      }
    });
  }
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filteredCasList = this.filteredcas();
  }
  filteredcas(): { name: string; id: number }[] {
    if (!this.searchTerm) {
      return this.cas;
    }
    return this.cas.filter(casItem =>
      casItem.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onSelectionFingerPrint(selectedValue: any) {
    console.log(selectedValue);
    this.castype = selectedValue.id;
    this.casname = selectedValue.name;
    console.log(this.casname);
    console.log(this.castype);
    this.fetchPackageList();
  }
  columnDefs: any;
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private fb: FormBuilder, private excelService: ExcelService, private userservice: BaseService, private cdr: ChangeDetectorRef, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.columnDefs = [
      { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
      { headerName: "CUSTOMER NAME", field: 'customername', width: 250, cellStyle: { textAlign: 'center' }, },
      { headerName: "SMARTCARD", field: 'smartcard', width: 300 },
      { headerName: "BOX ID", field: 'boxid', width: 250 },
      { headerName: "PACKAGE NAME", field: 'productname', width: 250, cellStyle: { textAlign: 'center' }, },
      { headerName: "EXPIRY DATE", field: 'expirydate', width: 350 },
    ];
  }
  onTypeChanged() {
    console.log('1111111111');

    this.rowData = [];
  }
  private updateColumnDefs(tab: string): void {
    if (tab === 'bulk_package') {
      console.log(this.rowData = []);
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100,
          headerCheckboxSelection: true, checkboxSelection: true
        },
        { headerName: "CUSTOMER NAME", field: 'customername', width: 250, cellStyle: { textAlign: 'left' } },
        { headerName: "SMARTCARD", field: 'smartcard', width: 300 },
        { headerName: "BOX ID", field: 'boxid', width: 330 },
        { headerName: "PACKAGE NAME", field: 'productname', width: 250, cellStyle: { textAlign: 'left' } },
        { headerName: "EXPIRY DATE", field: 'expirydate', width: 300 },
      ];
    } else if (tab === 'pending') {
      console.log(this.rowData = []);
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80 },
        { headerName: "CUSTOMER NAME	", field: 'customername', width: 250, cellStyle: { textAlign: 'left' } },
        { headerName: "SMARTCARD", field: 'smartcard', width: 250 },
        { headerName: "BOX ID", field: 'boxid', width: 250 },
        { headerName: "CREATED DATE", field: 'createddate', width: 250 },
        { headerName: "PACKAGE NAME", field: 'packagename', width: 250, cellStyle: { textAlign: 'left' } },
        { headerName: "EXPIRY DATE", field: 'expirydate', width: 250 },
        {
          headerName: "STATUS", width: 230,
          field: 'casresponse',

        }

      ];
    } else if (tab === 'archive') {
      console.log(this.rowData = []);
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80 },
        { headerName: "OPERATOR NAME	", field: 'operatorname', width: 250, cellStyle: { textAlign: 'left' } },
        { headerName: "CUSTOMER NAME	", field: 'customername', width: 250, cellStyle: { textAlign: 'left' } },
        { headerName: "SMARTCARD", field: 'smartcard', width: 250 },
        { headerName: "BOX ID", field: 'boxid', width: 200 },
        { headerName: "CREATED DATE", field: 'createddate', width: 200 },
        { headerName: "PACKAGE NAME", field: 'packagename', width: 200, cellStyle: { textAlign: 'left' } },
        { headerName: "EXPIRY DATE", field: 'expirydate', width: 200, cellStyle: { textAlign: 'left' } },
        {
          headerName: "STATUS",
          field: 'casresponse', width: 180
          // field: 'status',
          // cellRenderer: (params: any) => {
          //   return params.value === 1 ? 'Active' : 'Deactive';
          // },
          // cellStyle: (params: any) => {
          //   if (params.value === 1) {
          //     return { color: 'green', fontWeight: 'bold' };
          //   } else if (params.value === 0) {
          //     return { color: 'red', fontWeight: 'bold' };
          //   }
          //   return null;
          // }
        }

      ];
    }
  }

  callApi(
    apiMethod: Observable<HttpResponse<any[]>>,
    successCallback: () => void,
    errorCallback: () => void
  ) {
    apiMethod.subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.updateColumnDefs(this.selectedTab);
          this.rowData = response.body;
          const rowCount = this.rowData.length;
          if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
            this.gridOptions.paginationPageSizeSelector.push(rowCount);
          }

          // this.swal.Success_200();
          successCallback();
        } else if (response.status === 204) {
          this.swal.Success_204();
          successCallback();
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
        errorCallback();
      }
    );
  }

  ngOnInit() {

    this.date = new Date().toISOString().split('T')[0];
    this.selectedDate = this.date;
    this.form = this.fb.group({
      package_select: [false],
      casSelect: [{ value: '', disabled: true }] // initially disabled
    });
    this.form.get('package_select')?.valueChanges.subscribe((checked) => {
      const casSelectControl = this.form.get('casSelect');
      checked ? casSelectControl?.enable() : casSelectControl?.disable();
    });

    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
      this.filteredCasList = this.cas;
    })
    const dateToPass = this.selectedDate || this.fromdate;
    const dateToPass1 = this.selectedDate || this.todate;
    this.callApi(
      this.userservice.getAllBulkPackageListByFromdateTodateAndStatus(
        this.role, this.username, this.selectedDate, this.selectedDate, 0, 3
      ),
      () => console.log('Success for Bulk Package 1'),
      () => console.log('Error for Bulk Package 1')
    );

    this.callApi(
      this.userservice.getAllBulkPackageListByFromdateTodateAndStatus(
        this.role, this.username, dateToPass, dateToPass1, 0, 2
      ),
      () => console.log('Success for Bulk Package 2'),
      () => console.log('Error for Bulk Package 2')
    );
    this.service();
    // this.fetchPackageList();
    this.fetchOperatorList();
    this.fetchPackageList();
    this.updateColumnDefs('archive');
    this.fromdate = this.fromdate ? this.formatDate(this.fromdate) : this.formatDate(new Date());
    this.todate = this.todate ? this.formatDate(this.todate) : this.formatDate(new Date());
    if (this.role == 'ROLE_OPERATOR') {
      this.operatorIdoperatorId();
    } else if (this.role == 'ROLE_SUBLCO') {
      this.getSubLCOdetails();
    }

  }


  getSubLCOdetails() {
    this.userservice.getSublcoDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.retailerid = this.lcoDeatails?.operatorid;
      this.isplan = this.lcoDeatails?.permissionlist?.plan;
      this.isdate = this.lcoDeatails?.permissionlist?.date;
      this.isDatetoDate = this.lcoDeatails?.permissionlist?.datetodate;

    })
  }

  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.lcoId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.isplan = this.lcoDeatails?.isplan;
      this.isdate = this.lcoDeatails?.isdate;
      this.isDatetoDate = this.lcoDeatails?.isdatetodate;
    })
  }
  setCheckboxState(checked: boolean): void {
    this.isCheckboxChecked = checked;
    console.log('fdgdfgdf');

    if (!checked) {
      console.log('fdgdfgddfgdsdsfdsf');
      this.package = null;
      // this.packageSearch = '';
      // this.filteredPackageList = [];
    }
    //  else {
    //   console.log('fdgd45545454fgddfgdsdsfdsf');
    //   this.fetchPackageList();
    // }
  }



  fetchPackageList() {
    console.log(this.castype);
    this.userservice.getBulkPackageUpdationList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.packageList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      console.log(this.packageList);
      this.filteredPackageList = [...this.packageList];
    });

  }
  filteredPackage() {
    this.filteredPackageList = this.packageList.filter(pkg =>
      pkg.name.toLowerCase().includes(this.packageSearch.toLowerCase())
    );
  }
  filteredOperator() {
    this.filteredOperatorList = this.operatorList.filter(pkg =>
      pkg.name.toLowerCase().includes(this.selectoperator.toLowerCase())
    );
  }
  onDropdownClosed() {
    this.packageSearch = '';
    this.filteredPackageList = [...this.packageList];
  }
  onDropdownClosed1() {
    this.selectoperator = '';
    this.filteredOperatorList = [...this.operatorList];
  }
  fetchOperatorList() {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.cdr.detectChanges();
      this.filteredOperatorList = [...this.operatorList];
    });
  }

  selectbulk(tab: string) {
    this.selectedTab = tab;
    this.package = '';
    this.typelist = '';
    this.fromdate = '';
    this.todate = '';
    this.operatorid = '';
    this.updateColumnDefs(tab);
  }
  selectPending(tab: string) {
    this.selectedTab = tab;
    this.typelist = '';
    this.fromdate = '';
    this.todate = '';
    this.operatorid = '';
    this.rowData = [];
    this.updateColumnDefs(tab);
    this.service();
  }
  selectArchive(tab: string) {
    this.selectedTab = tab;
    this.typelist = '';
    this.alltypelist = '';
    this.fromdate = '';
    this.todate = '';
    this.operatorid = '';

    this.updateColumnDefs(tab);
  }


  onSelectionChanged() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node: any) => node.data);
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
    }
    console.log('defsfdsfds', this.isAnyRowSelected);

    if (this.isAnyRowSelected) {
      this.isSelectRow = true;
    } else {
      this.isSelectRow = false;
    }

  }


  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.selectAll()
  }

  // getFromDate(event: any) {
  //   this.fromdate = this.formatDate(event.value);
  // }

  // getToDate(event: any) {
  //   this.todate = this.formatDate(event.value);
  // }


  getFromDate(event: any) {
    console.log(event.value);
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date
    console.log(this.fromdate);
  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    console.log(this.todate);
  }
  // formatDate(date: Date): string {
  //   const d = new Date(date);
  //   const year = d.getFullYear();
  //   const month = (d.getMonth() + 1).toString().padStart(2, '0');
  //   const day = d.getDate().toString().padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  filterData(apiCall: Observable<HttpResponse<any[]>>, successMessage?: string, errorMessage?: string) {
    this.swal.Loading();
    apiCall.subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.updateColumnDefs(this.selectedTab);
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


  submit() {
    console.log("Submitting with values: ", {
      fromdate: this.fromdate,
      todate: this.todate,
      package: this.package,
      operatorid: this.operatorid || this.lcoId || this.retailerid
    });
    console.log(this.operatorid);
    console.log(this.lcoId);
    console.log(this.retailerid);

    this.rowData = [];
    const apiCall = this.userservice.getExpirySubscriberDetailsByDatePackAndOperatorId(
      this.role, this.username, this.fromdate || null, this.todate || null, this.package || 0, this.operatorid || this.lcoId || this.retailerid || 0
    );

    this.filterData(apiCall, 'Submission data fetched successfully.');
  }


  pendingFilter() {
    const apiCalls = [
      { condition: this.typelist === 1, method: this.userservice.getAllBulkPackageListByOperatoridAndStatus(this.role, this.username, this.operatorid || this.lcoId || this.retailerid || null, 0, 1) },
      { condition: this.typelist === 2, method: this.userservice.getAllBulkPackageListBySearchnameAndStatus(this.role, this.username, this.smartcard, 0, 1) },
      { condition: this.typelist === 3, method: this.userservice.getAllBulkPackageListByFromdateTodateAndStatus(this.role, this.username, this.fromdate, this.todate, 0, 1) }
    ];

    apiCalls.forEach(({ condition, method }) => {
      if (condition) {
        this.filterData(method, 'Pending data fetched successfully.');
      }
    });
    this.rowData = [];
  }

  archiveFilter() {
    this.swal.Loading();
    let apiCall;
    if (this.typelist === 1) {
      apiCall = this.userservice.getAllBulkPackageListByOperatoridAndStatus(
        this.role, this.username, this.operatorid || this.lcoId || this.retailerid, this.alltypelist, 2
      );
    } else if (this.typelist === 2) {
      apiCall = this.userservice.getAllBulkPackageListBySearchnameAndStatus(
        this.role, this.username, this.smartcard, this.alltypelist, 2
      );
    } else if (this.typelist === 3) {
      const dateToPass = this.fromdate;
      const dateToPass1 = this.todate;
      apiCall = this.userservice.getAllBulkPackageListByFromdateTodateAndStatus(
        this.role, this.username, dateToPass, dateToPass1, this.alltypelist, 2
      );
    }

    if (apiCall) {
      this.filterData(apiCall);
    }
    this.rowData = [];
  }

  service() {
    this.userservice.getBulkPackageServiceStatus(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.status = data.serviceState;
      this.serviceStatus = data.serviceStatus;
      console.log(this.status);

    })
  }
  start() {
    this.swal.Loading();
    this.userservice.StartOrStopBulkPackageService(this.role, this.username, this.status).subscribe((data: any) => {
      console.log(data);
    })
  }
  stop() {
    this.swal.Loading();
    this.userservice.StartOrStopBulkPackageService(this.role, this.username, this.status).subscribe((data: any) => {
      console.log(data);
    })
  }

  openLoginPage(data: any, rowData: any): void {
    console.log(data);

    const dataToSend = {
      status: data,
      rowData: this.rows,
      packageid: this.package,
      castype: this.castype,
      fromdate: this.fromdate,
      todate: this.todate,
      plan: this.isplan,
      date: this.isdate,
      dateTodate: this.isDatetoDate,
      retailerid: this.retailerid,
      lcoid: this.lcoId,
      operatorid: this.operatorid,
      file: this.file
    };
    let width = '600px';
    console.log(dataToSend);

    if (data === 'bulk') {
      width = '2000px';
    } else if (data === 'excel_upload') {
      width = '800px';
    }

    if (data === 'excel_upload') {
      if (this.file) {
        const dialogRef = this.dialog.open(BulkpackageupdationComponent, {
          width: width,
          maxWidth: '100vw',
          panelClass: 'custom-dialog-container',
          data: dataToSend
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      } else {
        console.error('Please select a file to upload.');
        this.snackBar.open('Please select a valid file before uploading.', 'Close', {
          duration: 3000,
        });
      }
    } else {
      const dialogRef = this.dialog.open(BulkpackageupdationComponent, {
        width: width,
        maxWidth: '100vw',
        panelClass: 'custom-dialog-container',
        data: dataToSend
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }



  generateExcel() {
    this.excelService.generateBulkPackageUpdationExcel();
  }
  handleFileInput(event: Event): void {
    console.log(event);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.isFileSelected = true;
      this.file = input.files[0];
      this.filePath = input.files[0].name;
      console.log(this.file);
    } else {
      this.isFileSelected = false;
      this.file = null;
      this.filePath = '';
    }
  }
}