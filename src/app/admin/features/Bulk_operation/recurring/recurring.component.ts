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
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss']
})
export class RecurringComponent implements OnInit {
  username: any;
  role: any;
  cas: any;
  smartcard: any;
  CasFormControl: any;
  operatorid: any = '';
  submitted: boolean = false;
  searchname: any;
  operatorList: any[] = [];
  reccuringData: any;
  isrecurring = false;
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: any[] = [];
  selectedtypes: any[] = [];
  hasSelectedRows: boolean = true;

  filteredOperators: any[] = [];
  selectedOperator: any;
  lco_list: any;
  selectedLcoName: any[] = [];

  columnDefs: ColDef[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', headerCheckboxSelection: true,
      checkboxSelection: true,width:100
    },
    { headerName: "SUBSCRIBER NAME", field: 'customername',width:250 },
    { headerName: "ADDRESS", field: 'address',width:250  },
    { headerName: "SMARTCARD", field: 'smartcard',width:300  },
    {
      headerName: "RECURRING", field: 'isrecurring',width:300 ,
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: green; font-weight: bold;">Activate</span>`;
        } else {
          return `<span style="color: red; font-weight: bold;">Deactivate</span>`;
        }
      }
    },
    { headerName: "BOXID	", field: 'boxid',width:300  },
    { headerName: "EXPIRY DATE	", field: 'expirydate',width:300  },
  ];
  rowData: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }

  onSelectionChanged() {
    console.log('zdfdsjfhsdjfhjksdhfjkdsh');

    if (this.gridApi) {
      console.log('1228986676');

      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      console.log(this.isAnyRowSelected);

      this.selectedIds = selectedRows;

    }
  }
  ngOnInit(): void {
    this.userservice.getOeratorList(this.role, this.username,1).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredOperators = this.operatorList;
    })
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.operatorList.filter((operator: any) =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    console.log(this.selectedLcoName);
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  submit(type: any) {
    this.reccuringData=[];
    this.submitted= true;
    this.userservice.getRecurringListByOperatorIdSearchnameAndIsrecurring(this.role, this.username, this.operatorid, this.searchname || 0, type)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.reccuringData = response.body;
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
          // this.callAnotherApi();
        }
      );
  }
  // callAnotherApi() {
  //   this.userservice.someOtherApiCall(this.role, this.username).subscribe(
  //     (response: HttpResponse<any[]>) => {
  //       if (response.status === 200) {
  //         console.log('Second API call successful');
  //       }
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 3000);
  //     },
  //     (error: any) => {
  //       console.log('Second API call failed', error);
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 3000);
  //     }
  //   );
  // }

  Active() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Active this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Active it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updateing...',
          text: 'Please wait while the Recurring is being updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });

        let requestBody = {
          role: this.role,
          username: this.username,
          recurringlist: this.selectedIds,
        }
        this.userservice.bulkIsRecurring(requestBody).subscribe((res: any) => {
          Swal.fire({
            title: 'Activated!',
            text: res.message,
            icon: 'success'
          });
          this.ngOnInit();
        }, (err) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message,
            icon: 'error'
          });
        });
      }
    });
  }
}
