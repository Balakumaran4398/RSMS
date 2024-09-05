import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-deactivation',
  templateUrl: './deactivation.component.html',
  styleUrls: ['./deactivation.component.scss']
})
export class DeactivationComponent {
  file: boolean = false;
  filePath: string = '';
  isCheckboxChecked: boolean = false;
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'intend_to' },
    { headerName: "STATUS", field: '' },
    { headerName: "REMARKS", field: '' },
    { headerName: "CREATED DATE	", field: '' },
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
