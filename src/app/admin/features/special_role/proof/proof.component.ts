import { Component, ViewChild } from '@angular/core';
import { ProofdetailsComponent } from '../Dialogue/proofdetails/proofdetails.component';
import { BaseService } from 'src/app/_core/service/base.service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-proof',
  templateUrl: './proof.component.html',
  styleUrls: ['./proof.component.scss']
})
export class ProofComponent {
  rowData: any;
  public rowSelection: any = "multiple";
  selectedTab: any = '1';
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

  @ViewChild('agGrid') agGrid: any;
  columnDefs: any;

  constructor(public dialog: MatDialog, public userservice: BaseService, storageService: StorageService, private swal: SwalService,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }

  ngOnInit(): void {
    this.loadTableData('');
  }


  onGridReady(params: { api: any; },) {
    this.gridApi = params.api;
  }



  selectTab(tab: string) {
    this.selectedTab = tab;
    console.log(this.selectedTab);
    this.rowData = [];
    if (this.agGrid) {
      let newRowData;
      if (this.selectedTab === '1') {
        newRowData = this.getrefundData('1');
      } else if (this.selectedTab === '2') {
        newRowData = this.getLogrechargeReport('2');
      }
      this.agGrid.api.setRowData(newRowData);
    }
  }
  getrefundData(event: any) {
    console.log(event);

    this.loadTableData(event);
    return [this.rowData];
  }
  getLogrechargeReport(event: any) {
    console.log(event);

    this.loadTableData(event);
    return [this.rowData];
  }

  loadTableData(selectedTab: any) {
    console.log(`Selected Tab: ${selectedTab}`);

    if (this.selectedTab === '1') {
      this.columnDefs = [
        { headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, checkboxSelection: true, filter: false },
        { headerName: 'ID PROOF NAME', field: 'proofname', width: 450 },
        {
          headerName: 'STATUS', field: 'statusdisplay', width: 450,
          cellRenderer: (params: { value: any; data: any }) => {
            let color, text;
            if (params.value === 'Active') {
              color = 'green';
              text = 'Active';
            } else if (params.value === 'Deactive') {
              color = 'red';
              text = 'Deactive';
            } else {
              color = '';
              text = 'No value';
            }
            return `<span style="color: ${color};">${text}</span>`;
          }
        },
        {
          headerName: 'ACTION', minWidth: 140, filter: false,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.color = 'rgb(1 31 78)';
            editButton.style.border = 'none';
            editButton.title = 'Edit the ID Proof';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.style.fontSize = "30px";
            editButton.addEventListener('click', () => {
              this.openaddedlogue('editidproof', params.data);
            });
            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
      ];

      this.userservice.getAllIdProofList(this.role, this.username).subscribe((data: any) => {
        this.rowData = data;
      });

    } else if (this.selectedTab === '2') {
      this.columnDefs = [
        { headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, checkboxSelection: true, },
        { headerName: 'ADDRESS NAME', field: 'addressname', width: 450 },
        {
          headerName: 'STATUS', field: 'statusdisplay', width: 450,
          cellRenderer: (params: { value: any; data: any }) => {
            let color, text;
            if (params.value === 'Active') {
              color = 'green';
              text = 'Active';
            } else if (params.value === 'Deactive') {
              color = 'red';
              text = 'Deactive';
            } else {
              color = '';
              text = 'No value';
            }
            return `<span style="color: ${color};">${text}</span>`;
          }
        },

        {
          headerName: 'ACTION', minWidth: 140, filter: false,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.color = 'rgb(1 31 78)';
            editButton.style.border = 'none';
            editButton.title = 'Edit the Address Proof';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.style.fontSize = "30px";
            editButton.addEventListener('click', () => {
              this.openaddedlogue('editaddressproof', params.data);
            });
            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
      ];

      // Fetch data for Address Proof list
      this.userservice.getAllAddressProofList(this.role, this.username).subscribe((data: any) => {
        this.rowData = data;
      });
    }
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


  ActiveId() {
    this.userservice.activeORDeactiveIdProof(this.role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  DeactiveId() {
    this.userservice.activeORDeactiveIdProof(this.role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  ActiveAddress() {
    this.userservice.activeORDeactiveAddressProof(this.role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  DeactiveAddress() {
    this.userservice.activeORDeactiveAddressProof(this.role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  openaddedlogue(type: any, data: any) {
    let width = '500px';
    if (type === 'newidproof') {
      width = '500px';
    } else if (type === 'newaddressproof') {
      width = '500px';
    } else if (type === 'editidproof') {
      width = '500px';
    } else if (type === 'editaddressproof') {
      width = '500px';
    }
    let dialogData = { type: type, data: data, selectedid: this.selectedIds };
    console.log(dialogData);
    const dialogRef = this.dialog.open(ProofdetailsComponent, {
      width: width,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
