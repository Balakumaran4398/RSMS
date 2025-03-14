import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { ReallocationComponent } from '../../channel_setting/_Dialogue/Inventory/Smartcard_Reallocation/reallocation/reallocation.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-smartcard-reallocation',
  templateUrl: './smartcard-reallocation.component.html',
  styleUrls: ['./smartcard-reallocation.component.scss']
})
export class SmartcardReallocationComponent implements OnInit {
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedsmartcard: number[] = [];
  selectedEmi: number[] = [];
  dueamount: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  username: any;
  role: any;
  rowData: any[] = [];
  castype: any;
  count: any;
  lco_list: any;

  sub_emi: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
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
    pagination: true,
  }

  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService, private cdr: ChangeDetectorRef,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userService.getsmartcardReallocationlist(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data[0].reallocatedsmartcard;
      // this.lco_list = data[0].operatorid;
      this.count = data[0].count;
      this.castype = data[0].operatorid;
      this.sub_emi = data[0].isemi;

      console.log('wwwwwwwwwwwwww', this.sub_emi);
      console.log(this.rowData);

      console.log(this.count);
      console.log(this.castype);
    })
  }
  ngOnInit(): void {
    this.fetchOperatorList();
  }

  fetchOperatorList() {
    this.userService.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);

      // this.lco_list = Object.keys(data).map(key => {
      //   console.log(this.lco_list);
      //   const value = data[key];
      //   const name = key;
      //   return { name: name, value: value };
      // });
      this.lco_list = data;
      this.cdr.detectChanges();
      console.log(this.lco_list);
    });
  }
  columnDefs: ColDef[] = [
    { headerCheckboxSelection: true, headerName: 'S.NO', valueGetter: 'node.rowIndex+1', checkboxSelection: true, width: 100, filter: false },
    {
      headerName: 'SMARTCARD', width: 250,
      field: 'smartcard',

    },
    {
      headerName: 'BOX_ID', width: 250, cellStyle: { textAlign: 'left' },
      field: 'boxid',
    },
    {
      headerName: 'CARTON BOX', width: 220, cellStyle: { textAlign: 'center' },
      field: 'cottonbox',
    },

    {
      headerName: 'IS_ALLOCATED',
      field: 'isallocated', width: 200, cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: #06991a;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },
    {
      headerName: 'DE_ALLOCATED', width: 200, cellStyle: { textAlign: 'center' },
      field: 'deallocateddisplay',
      cellRenderer: (params: any) => {
        const value = params.value?.toString().toUpperCase();
        const color = value === 'YES' ? '#06991a' : value === 'NO' ? 'red' : 'black';
        return `<span style="color: ${color};">${value}</span>`;
      },
    },
    {
      headerName: 'IS_DEFECTIVE',
      field: 'defectivedisplay', width: 200, cellStyle: { textAlign: 'center' },
      // cellRenderer: (params: any) => {
      //   if (params.value) {
      //     return `<span style="color: #06991a;">YES</span>`;
      //   } else {
      //     return `<span style="color: red;">NO</span>`;
      //   }
      // },
      cellRenderer: (params: any) => {
        const value = params.value?.toString().toUpperCase();
        const color = value === 'YES' ? '#06991a' : value === 'NO' ? 'red' : 'black';
        return `<span style="color: ${color};">${value}</span>`;
      },
    },

  ]

  onSelectionChanged() {
    if (this.gridApi) {
      let selectedRows: any[] = [];
      this.gridApi.forEachNodeAfterFilter((rowNode: any) => {
        if (rowNode.isSelected()) {
          selectedRows.push(rowNode.data);
        }
      });
      // console.log("Filtered & Selected Rows:", selectedRows);
      if (selectedRows.length === 0) {
        this.gridApi.deselectAll();
      }
      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedsmartcard = selectedRows.map((e: any) => e.smartcard);
      this.selectedEmi = selectedRows.map((e: any) => e.isemi);
      this.dueamount = selectedRows.map((e: any) => e.dueamount);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    }
  }
  onGridReady(params: { api: any; }) {

    this.gridApi = params.api;
  }

  showDisabledMessage(): void {
    if (!this.isAnyRowSelected) {
      Swal.fire({
        icon: 'info',
        title: 'Action Disabled',
        text: 'Please select at least one row before attempting to deallocate.',
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      console.log(this.lco_list);

      const dataToSend = {
        // rowData: this.rowData,
        lco_list: this.lco_list,
        id: this.selectedIds,
        smartcard: this.selectedsmartcard,
        emi: this.selectedEmi,
        dueAmount: this.dueamount,
        sub_emi: this.sub_emi
      };
      console.log(dataToSend);
      const dialogRef = this.dialog.open(ReallocationComponent, {
        width: '450px',
        data: dataToSend
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  generateExcel() {
    this.userService.getReallocatedSmartcardReport(this.role, this.username, 2)
      .subscribe((x: Blob) => {
        console.log(x);

        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        // link.download = (this.reportTitle + ".pdf").toUpperCase();
        link.download = `Smartcard AllocReallocationation Report.xlsx`.toUpperCase();
        console.log("came");
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the Excel for Reallocation report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });

  }

  generatePDF() {
    this.userService.getReallocatedSmartcardReport(this.role, this.username, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        // link.download = (this.reportTitle + ".pdf").toUpperCase();
        link.download = `Smartcard Reallocation Report.pdf`.toUpperCase();

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the Pdf for Reallocation report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });



  }
}
