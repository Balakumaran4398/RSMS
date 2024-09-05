import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-bulk-base-change',
  templateUrl: './bulk-base-change.component.html',
  styleUrls: ['./bulk-base-change.component.scss']
})
export class BulkBaseChangeComponent {
  file: boolean = false;
  filePath: string = '';
  isCheckboxChecked: boolean = false;

  cas: any[] = [];
  area: any;
  CasFormControl: any;
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "EXTENDED DATE", field: 'intend_to' },
    { headerName: "STATUS", field: '' },
    { headerName: "REMARKS", field: '' },
    { headerName: "CREATED DATE	", field: '' },
    { headerName: "UPDATED DATE	", field: '' },
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
      width: 180,
      floatingFilter: true
    },
    // paginationPageSize: 15,
    // pagination: true,
  }
  username:any;
  role:any;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService) {

    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit() {
    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.cas = data.map((item: any) => item.casname);
      console.log(this.cas);
    });
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.area = data[0].arealist;
      console.log(this.area);

    })
  }
  onGridReady = () => {
    // this.userservice.GetAllUser('all',this.token.getUsername(),'0000-00-00','0000-00-00').subscribe((data) => {
    //   this.gridApi.setRowData(data);
    //   this.listUser = data;      
    // });
  }
  onCheckboxChange(event: Event): void {
    this.isCheckboxChecked = (event.target as HTMLInputElement).checked;
  }
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = true;
      this.filePath = input.files[0].name;
    } else {
      this.file = false;
      this.filePath = '';
    }
  }
}
