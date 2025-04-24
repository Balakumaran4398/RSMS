import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { DiscountdialogComponent } from '../../operator_Login/Dialog/discountdialog/discountdialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lcocommisiomddiscount',
  templateUrl: './lcocommisiomddiscount.component.html',
  styleUrls: ['./lcocommisiomddiscount.component.scss']
})
export class LcocommisiomddiscountComponent implements OnInit {
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;

        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          if (normalizedA < normalizedB) return -1;
          if (normalizedA > normalizedB) return 1;
          return 0;
        }
      },
    },
    paginationPageSize: 10,
    paginationPageSizeSelector:[10,20,50],
    pagination: true,
  };

  rowData: any[] = [];
  gridApi: any;
  role: any;
  username: any;
  constructor(private userService: BaseService, private storageService: StorageService, public dialog: MatDialog) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }
  ngOnInit(): void {
    this.userService.getOpDiscountListByOpidAreaid(this.role, this.username, 0, 0, 4,true).subscribe((res: any) => {
      console.log(res);
      this.rowData = res;
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
  }


  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  columnDefs = [
    { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, },
    { headerName: 'PACKAGE NAME', width: 300, field: 'package_name', },
    { headerName: 'RATE', width: 300, field: 'customer_amount', },
    { headerName: 'LCO-COMMISION', width: 300, field: 'lco_commission' },
    { headerName: 'MSO RATE', field: 'mso_amount', width: 300, },
    {
      headerName: 'ACTION', field: '', width: 290, filter: false,
      cellRenderer: (params: any) => {
        const updateButton = document.createElement('button');
        updateButton.innerHTML = '<button style="width: 7em;background-color: #4c6b79;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Discount</p></button>';
        updateButton.style.backgroundColor = 'transparent';
        updateButton.style.border = 'none';
        updateButton.title = 'Discount';
        updateButton.style.cursor = 'pointer';
        updateButton.addEventListener('click', () => {
          const packageId = params.data.order_id;
          this.openaddedlogue('plan', params.data);
        });
        const div = document.createElement('div');
        div.appendChild(updateButton);
        return div;
      },
    },
  ];
  areaid: any;
  openaddedlogue(type: any, data: any,) {
    console.log(this.areaid);
    let dialogData = { type: type, data: data, area: this.areaid };
    console.log(dialogData);
    const dialogRef = this.dialog.open(DiscountdialogComponent, {
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
