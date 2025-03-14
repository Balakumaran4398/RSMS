import { Component } from '@angular/core';
import { TaxdetailsComponent } from '../Dialogue/taxdetails/taxdetails.component';
import { BaseService } from 'src/app/_core/service/base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent {
  rowData: any;
  public rowSelection: any = "multiple";

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

  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  username: any;
  id: any;
  role: any;
  type: number = 0;
  constructor(public dialog: MatDialog, public userservice: BaseService, storageService: StorageService, private swal: SwalService,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  columnDefs: any[] = [
    {
      headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, checkboxSelection: true,filter: false
    },
    { headerName: 'TAX NAME	', field: 'taxname', width: 220,cellStyle: { textAlign: 'left' } },
    {
      headerName: 'PERCENTAGE	', field: 'percentage', width: 300, cellRenderer: (params: { value: any }) => {
        return `<span>${params.value}%</span>`;
      }
    },
    {
      headerName: 'TAX APPLICABLE	', field: 'taxapplicable', width: 200,
      cellRenderer: (params: { value: any; data: any }) => {
        const color = params.value ? 'green' : 'red';
        const text = params.value ? 'True' : 'False';
        return `<span style="color: ${color};">${text}</span>`;
      }
    },
    { headerName: 'TAX TYPE	', field: 'taxtype', width: 250, cellStyle: { textAlign: 'left' }},
    {
      headerName: 'STATUS', field: 'statusdisplay', width: 200,

      cellRenderer: (params: { value: any; data: any }) => {
        const status = params.data?.statusdisplay; 
        const color = status === 'Active' ? 'green' : 'red';
        const text = status === 'Active' ? 'Active' : 'Deactive';
        return `<span style="color: ${color}; ">${text}</span>`; 
      }
    },
    {
      headerName: 'EDIT', minWidth: 200, filter: false,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(1 31 78)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the TAX Master';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "30px";
        editButton.addEventListener('click', () => {
          this.openaddedlogue('editTax', params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
  ];
  ngOnInit(): void {
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.userservice.getAllTaxList(this.role, this.username).subscribe((data: any) => {
      this.rowData = data;
    })
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
    }
  }


  Active() {
    this.swal.Loading();
    this.userservice.activeORDeactiveTax(this.role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  Deactive() {
    this.swal.Loading();
    this.userservice.activeORDeactiveTax(this.role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  openaddedlogue(type: any, data: any) {
    let width = '500px';
    if (type === 'createtax') {
      width = '500px';
    } else if (type === 'editTax') {
      width = '500px';
    }
    let dialogData = { type: type, data: data, selectedid: this.selectedIds };
    console.log(dialogData);
    const dialogRef = this.dialog.open(TaxdetailsComponent, {
      width: width,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
