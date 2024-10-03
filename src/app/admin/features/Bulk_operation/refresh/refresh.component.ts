import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.scss']
})
export class RefreshComponent {
  username: any;
  role: any;
  cas: any;
  CasFormControl:any;
  type: any = [
    { label: "Select filter Type", value: 0 },
    { lable: "LCO", value: 1 },
    { lable: "SMARTCARD/BoxID", value: 2 },
    { lable: "Datewise", value: 3 },
  ];
  
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
      floatingFilter: true
    },
    // paginationPageSize: 15,
    // pagination: true,
  }
 
  constructor(public dialog: MatDialog, private fb: FormBuilder,private userservice:BaseService, private storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'intend_to' },
    { headerName: "OPERATOR ID", field: '' },
    { headerName: "STATUS", field: '' },
    { headerName: "REMARKS", field: '' },
    { headerName: "CREATED DATE", field: '' },
  ];
  rowData = [
    {
      intend_to: 'Example Value',
    },
  ];
  ngOnInit() {

    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.cas = data.map((item: any) => item.casname);
      console.log(this.cas);
    });

  }
  onGridReady() {

  }
  Submit(){
    
  }
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };
}
