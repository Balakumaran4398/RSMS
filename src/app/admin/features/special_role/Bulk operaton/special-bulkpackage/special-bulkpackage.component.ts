
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { SpecialeditbulkpackageComponent } from '../../Dialogue/Bulk operation/specialeditbulkpackage/specialeditbulkpackage.component';
@Component({
  selector: 'app-special-bulkpackage',
  templateUrl: './special-bulkpackage.component.html',
  styleUrls: ['./special-bulkpackage.component.scss']
})
export class SpecialBulkpackageComponent implements OnInit {
  selectedTab: string = 'bulk_package';
  package: any;
  operatorid: any;
  package_select: boolean = false;
  isCheckboxChecked: boolean = false;
  packageList: any[] = [];
  operatorList: any[] = [];
  cas: any[] = [];
  typelist: any;
  alltypelist: any;

  maxDate = new Date(2400, 11, 31);
  fromdate: any;
  todate: any;

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
  status: boolean=false;
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
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  columnDefs: any;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService, private swal: SwalService) {

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
    console.log(tab);

    if (tab === 'bulk_package') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
        { headerName: "CUSTOMER NAME", field: 'customername' },
        { headerName: "SMARTCARD", field: 'smartcard' },
        { headerName: "BOX ID", field: 'boxid' },
        { headerName: "PACKAGE NAME", field: 'productname' },
        { headerName: "EXPIRY DATE", field: 'expirydate' },
      ];
    } else if (tab === 'pending') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
        { headerName: "OPERATOR NAME	", field: 'operatorname' },
        { headerName: "CUSTOMER NAME	", field: 'customername' },
        { headerName: "SMARTCARD", field: 'smartcard' },
        { headerName: "BOX ID", field: 'boxid' },
        { headerName: "CREATED DATE", field: 'createddate' },
        { headerName: "PACKAGE NAME", field: 'expirydate' },
        { headerName: "EXPIRY DATE", field: 'packagename' },
        {
          headerName: "STATUS",
          field: 'status',
          cellRenderer: (params: any) => {
            return params.value === 1 ? 'Active' : 'Deactive';
          },
          cellStyle: (params: any) => {
            if (params.value === 1) {
              return { color: 'green', fontWeight: 'bold' };
            } else if (params.value === 0) {
              return { color: 'red', fontWeight: 'bold' };
            }
            return null;
          }
        }

      ];
    } else if (tab === 'archive') {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
        { headerName: "OPERATOR NAME	", field: 'operatorname' },
        { headerName: "CUSTOMER NAME	", field: 'customername' },
        { headerName: "SMARTCARD", field: 'smartcard' },
        { headerName: "BOX ID", field: 'boxid' },
        { headerName: "CREATED DATE", field: 'createddate' },
        { headerName: "PACKAGE NAME", field: 'expirydate' },
        { headerName: "EXPIRY DATE", field: 'packagename' },
        {
          headerName: "STATUS",
          field: 'status',
          cellRenderer: (params: any) => {
            return params.value === 1 ? 'Active' : 'Deactive';
          },
          cellStyle: (params: any) => {
            if (params.value === 1) {
              return { color: 'green', fontWeight: 'bold' };
            } else if (params.value === 0) {
              return { color: 'red', fontWeight: 'bold' };
            }
            return null;
          }
        }

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


    this.fetchPackageList();
    this.fetchOperatorList();

  }
  fetchPackageList() {
    this.userservice.getPackageList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      // this.packageList = Object.keys(data.packageid); // Assuming packageid contains the necessary values
      this.packageList = Object.keys(data.packageid).map(key => {
        const value = data.packageid[key]; // Access the value for the corresponding key
        // const name = key.split('(')[0].trim(); // Extract the name from the key, trimming any whitespace
        const name = key
        return { name: name, value: value }; // Return an object with separated name and value
      });
      console.log(this.packageList);
    });
  }

  fetchOperatorList() {
    this.userservice.getOeratorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      console.log(this.operatorList);
    });
  }
  // ngAfterViewInit(): void {
  //   this.loadData(this.selectedTab);
  // }
  selectbulk(tab: string) {
    this.selectedTab = tab;
    this.updateColumnDefs(tab);
  }
  selectPending(tab: string) {
    this.selectedTab = tab;
    this.updateColumnDefs(tab);
    this.service();
  }
  selectArchive(tab: string) {
    this.selectedTab = tab;
    this.updateColumnDefs(tab);
  }





  onGridReady = () => {


  }

  getFromDate(event: any) {
    this.fromdate = this.formatDate(event.value);
  }

  getToDate(event: any) {
    this.todate = this.formatDate(event.value);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is 2 digits
    const day = d.getDate().toString().padStart(2, '0'); // Ensure day is 2 digits
    return `${year}-${month}-${day}`; // Return date in "YYYY-MM-DD" format
  }

  submit() {
    console.log("Submitting with values: ", {
      fromdate: this.fromdate,
      todate: this.todate,
      package: this.package,
      operatorid: this.operatorid
    });


    this.userservice.getExpirySubscriberDetailsByDatePackAndOperatorId(
      this.role, this.username, this.fromdate || null, this.todate || null, this.package || 0, this.operatorid || null
    ).subscribe(
      (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
        if (response.status === 200) {
          this.updateColumnDefs(this.selectedTab);
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
  pendingFilter() {
    console.log(this.typelist);
    if (this.typelist === 1) {
      this.userservice.getAllBulkPackageListByOperatoridAndStatus(this.role, this.username, this.operatorid || null, 0).subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
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
    } else if (this.typelist === 2) {
      this.userservice.getAllBulkPackageListBySearchnameAndStatus(this.role, this.username, this.smartcard, 0).subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
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
    } else if (this.typelist === 3) {
      this.userservice.getAllBulkPackageListByFromdateTodateAndStatus(this.role, this.username, this.fromdate || null, this.todate, 0).subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
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
  archiveFilter() {
    console.log(this.typelist);
    if (this.typelist === 1) {
      this.userservice.getAllBulkPackageListByOperatoridAndStatus(this.role, this.username, this.operatorid, this.alltypelist).subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
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
    } else if (this.typelist === 2) {
      this.userservice.getAllBulkPackageListBySearchnameAndStatus(this.role, this.username, this.smartcard, this.alltypelist).subscribe(

        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
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
    } else if (this.typelist === 3) {
      this.userservice.getAllBulkPackageListByFromdateTodateAndStatus(this.role, this.username, this.fromdate || null, this.todate || null, this.alltypelist).subscribe(

        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.updateColumnDefs(this.selectedTab);
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

  service() {
    this.userservice.getBulkPackageServiceStatus(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.status = data.serviceState;
      console.log(this.status);

    })
  }
  start() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to proceed with starting the bulk package service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, start it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userservice.StartOrStopBulkPackageService(this.role, this.username, this.status).subscribe((data: any) => {
          console.log(data);
          Swal.fire('Started!', 'The bulk package service has been started.', 'success');
        }, (error) => {
          Swal.fire('Error!', 'There was a problem stopping the bulk package service.', 'error');
        });
      }
    });


  }
  stop() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to proceed with stopping the bulk package service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, stop it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userservice.StartOrStopBulkPackageService(this.role, this.username, this.status).subscribe((data: any) => {
          console.log(data);
          Swal.fire('Stopped!', 'The bulk package service has been stopped.', 'success');
        }, (error) => {
          Swal.fire('Error!', 'There was a problem stopping the bulk package service.', 'error');
        });
      }
    });
  }
  
}