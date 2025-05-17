import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { FormsModule } from '@angular/forms';
import { SwalService } from 'src/app/_core/service/swal.service';
import { MatDialog } from '@angular/material/dialog';
import { DiscountdialogComponent } from '../Dialog/discountdialog/discountdialog.component';
import { Router } from '@angular/router';
import { DiscountsmartcardComponent } from '../Dialog/discountsmartcard/discountsmartcard.component';

@Component({
  selector: 'app-lcodiscount',
  templateUrl: './lcodiscount.component.html',
  styleUrls: ['./lcodiscount.component.scss']
})
export class LcodiscountComponent implements OnInit, AfterViewInit {
  role: any;
  username: any;
  rowData: any[] = [];
  gridApi: any;
  columnDefs: any[] = [];
  operatorname: any;
  discountType: any = {};
  isdiscount: boolean = true;
  lcoDeatails: any;
  lcoId: any;
  type: any = '1';
  selectedOption = '1';
  isTabDisabled = false;
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
    pagination: true,
  };


  filteredAreas: any[] = [];
  areaid: any;
  smartcard: any;
  searchTerm: string = '';
  selectedArea: any = null;
  area_list: any;

  selectedAreaName: string = '';
  constructor(private userService: BaseService, private router: Router, private storageService: StorageService, private swal: SwalService, public dialog: MatDialog,) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }
  ngOnInit(): void {
    this.onColumnDefs();
    this.operatorIdoperatorId();

  }
  onSmartcardChange() {

  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  onRadioChange(event: any) {
    this.isdiscount = event.value === true;
    // this.isTabDisabled = event.value === 'false';
  }
  onTabChange(event: any) {
    this.discountType.index = event.index;
    this.type = event.index + 1


    this.onColumnDefs();
    this.getListOfDatas();
    // this.getDiscountOption(this.type);
    this.getDiscountOption(this.discountType.index);

    if ($('#Area').data('select2')) {
      $('#Area').select2('destroy');
    }


  }
  initSelect2() {
    $('#Area').select2({
      placeholder: 'Select Area',
      allowClear: true
    });

    $('#Area').on('change', (event: any) => {
      this.areaid = event.target.value;
      this.onAreaStatusChange(this.areaid);
    });
  }
  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.lcoId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.discountType.index = this.lcoDeatails?.discounttype;
      this.onTabChange(this.discountType)
      this.isdiscount = this.lcoDeatails?.isdiscount;
      console.log(this.lcoId);
      console.log(this.isdiscount);
      console.log('sedsdnsadgsadagdj', this.discountType);

      this.getDiscountOption(this.discountType.index);

      this.userService.getAreaListByOperatorid(this.role, this.username, this.lcoId).subscribe((data: any) => {
        this.area_list = Object.keys(data).map(key => ({
          name: key,
          value: data[key]
        }));
        this.filteredAreas = this.area_list;
      });
    })
  }
  getListOfDatas() {
    console.log("this.type :" + this.type);
    if (this.type == '1') {
      this.rowData = [];
      console.log('all area', this.type);
      this.userService.getOpDiscountListByOpidAreaid(this.role, this.username, this.lcoId, 0, 1, false).subscribe((res: any) => {
        console.log(res);
        this.rowData = res;
      })
    } else if (this.type == '2') {
      this.rowData = [];
      console.log('area', this.type);
      this.rowData = [];
      this.onAreaStatusChange(this.lcoId);
    } else if (this.type == '3') {
      this.rowData = [];
      console.log('smartcard', this.type);
      // this.onAreaStatusChange(this.lcoId);
      this.userService.getOpDiscountListByOpidAreaid(this.role, this.username, this.lcoId, 0, 3, false).subscribe((res: any) => {
        console.log(res);
        this.rowData = res;
      })
    } else if (this.type == '4') {
      console.log('package', this.type);
      // this.onAreaStatusChange(this.lcoId);
      this.rowData = [];
      this.userService.getOpDiscountListByOpidAreaid(this.role, this.username, this.lcoId, 0, 4, false).subscribe((res: any) => {
        console.log(res);
        this.rowData = res;
      })
    }
  }
  getDiscountOption(discountType: any) {
    console.log(discountType);

    this.userService.getupdateLcoDiscountBytype(this.role, this.username, this.lcoId, discountType, true)
      .subscribe((res: any) => {
        // this.swal.success_1(res?.message);
      }, (err) => {
        // this.swal.Error(err?.error?.message);
      });
  }
  ngOnDestroy(): void {
    if ($('#Area').data('select2')) {
      $('#Area').select2('destroy');
    }
  }

  ngAfterViewInit() {
    if (this.type === 2) {
      this.initSelect2();
    }
  }
  private onColumnDefs() {
    if (this.type == '1') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, },
        { headerName: 'PACKAGE NAME', width: 200, field: 'product_name', },
        { headerName: 'CUSTOMER AMOUNT', width: 250, field: 'customer_amount' },
        { headerName: 'MSO RATE', field: 'mso_amount', width: 150, },
        { headerName: 'LCO-COMMISION', width: 200, field: 'new_commission_value' },
        { headerName: 'DISCOUNT', width: 150, field: 'discount_value', },
        { headerName: 'PERCENTAGE', width: 150, field: 'ispercentage', },
        {
          headerName: 'CUSTOMER SELLING PRICE', field: 'cusdiscprice', width: 230, valueFormatter: (params: any) => parseFloat(params.value).toFixed(2)
        },
        {
          headerName: 'ACTION', field: '', width: 150, filter: false,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            editButton.innerHTML = '<img src="/assets/images/icons/editstreet2.png" style="width:30px;background-color:none">';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.border = 'none';
            editButton.title = 'Edit';
            editButton.style.cursor = 'pointer';
            editButton.addEventListener('click', () => {
              this.openaddedlogue('all_area', params.data);

            });
            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          },
        },
      ];
    } else if (this.type == '2') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, },
        { headerName: 'PACKAGE NAME', width: 200, field: 'product_name', },
        { headerName: 'CUSTOMER AMOUNT', width: 250, field: 'customer_amount', },
        { headerName: 'MSO RATE', field: 'mso_amount', width: 200, },
        { headerName: 'LCO-COMMISION', width: 200, field: 'new_commission_value', },
        { headerName: 'DISCOUNT', width: 250, field: 'discount_value', },
        { headerName: 'PERCENTAGE', width: 250, field: 'ispercentage', },
  {
          headerName: 'CUSTOMER SELLING PRICE', field: 'cusdiscprice', width: 230, valueFormatter: (params: any) => parseFloat(params.value).toFixed(2)
        },        {
          headerName: 'ACTION', field: '', width: 150, filter: false,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            editButton.innerHTML = '<img src="/assets/images/icons/editstreet2.png" style="width:30px;background-color:none">';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.border = 'none';
            editButton.title = 'Edit';
            editButton.style.cursor = 'pointer';
            editButton.addEventListener('click', () => {
              this.openaddedlogue('area', params.data);

            });
            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          },
        },
      ];
    } else if (this.type == '3') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 90, },
        { headerName: "CUSTOMER NAME", field: 'customer_name', width: 200, },
        { headerName: 'AREA', width: 200, field: 'area_name', },
        { headerName: 'MOBILE NUMBER', width: 250, field: 'mobile_no' },
        { headerName: 'SMARTCARD', width: 200, field: 'smartcard', },
        { headerName: 'BOX ID', field: 'boxid', width: 200, },
        { headerName: 'CAS NAME', width: 250, field: 'cas_name', },
        {
          headerName: 'ACTION', field: '', width: 200, filter: false,
          cellRenderer: (params: any) => {
            // const deleteButton = document.createElement('button');
            const updateButton = document.createElement('button');
            updateButton.innerHTML = '<button style="width: 7em;background-color: #4c6b79;border-radius: 5px;height: 2em;color: white;"><p style="margin-top:-6px">Discount</p></button>';
            updateButton.style.backgroundColor = 'transparent';
            updateButton.style.border = 'none';
            updateButton.title = 'Discount';
            updateButton.style.cursor = 'pointer';
            updateButton.addEventListener('click', () => {
              const packageId = params.data.packageid;
              const smartcard = params.data.smartcard;
              console.log(smartcard);
              this.openSmartcardDetails(params.data, 'smartcard');
              // this.openSmartcardDetails(smartcard);
              console.log(params.data);
            });
            const div = document.createElement('div');
            div.appendChild(updateButton);
            return div;
          },
        },
      ];
    } else if (this.type == '4') {
      this.columnDefs = [
        { headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, },
        { headerName: 'PACKAGE NAME', width: 300, field: 'package_name', },
        { headerName: 'RATE', width: 300, field: 'customer_amount', },
        { headerName: 'MSO RATE', field: 'mso_amount', width: 300, },
        { headerName: 'LCO-COMMISION', width: 300, field: 'lco_commission' },
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
    }
  }

  openSmartcardDetails(data: any, type: any,) {
    let dialogData = { type: type, data: data, };
    console.log(dialogData);

    const dialogRef = this.dialog.open(DiscountsmartcardComponent, {
      panelClass: 'custom-dialog-container',
      data: dialogData,
      width: '1000px'
    });
  }


  onAreaStatusChange(input: any): void {
    const searchTerm = (input && typeof input === 'string') ? input.toLowerCase() : '';

    this.filteredAreas = this.area_list.filter((area: any) =>
      area.name.toLowerCase().includes(searchTerm)
    );
  }


  onAreaSelected(selectedArea: any): void {
    this.selectedArea = selectedArea;
    this.areaid = selectedArea.value;

    this.userService.getOpDiscountListByOpidAreaid(this.role, this.username, this.lcoId, this.areaid, 1, false)
      .subscribe((res: any) => {
        this.rowData = res;
      });
  }

  displayAreaName(area: any): string {
    console.log(area);

    return area ? area.name : '';
  }

  filterAreas(query: string) {
    this.filteredAreas = this.area_list.filter((area: any) =>
      area.name.toLowerCase().includes(query.toLowerCase())
    );
  }
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
