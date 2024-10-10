import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-alacarte-activation',
  templateUrl: './alacarte-activation.component.html',
  styleUrls: ['./alacarte-activation.component.scss']
})
export class AlacarteActivationComponent {
  file: boolean = false;
  filePath: string = '';
  form: FormGroup;
  isCheckboxChecked: boolean = false;
  username: any;
  role: any;
  castype: any;
  cas: any[] = [];
  area: any;
  casFormControl: any
  type = ["Type1", "Type2", "Type3"];
  toppings = new FormControl([]);
  toppingList: any[] = [];
  casItem: any;
  // rowData: any;
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'intend_to' },
    { headerName: "ADD PRODUCTS", field: '' },
    { headerName: "CHANNEL NAME", field: '' },
    { headerName: "ADDED PRODUCTS	", field: '' },
    { headerName: "STATUS	", field: '' },
    { headerName: "REMARKS", field: '' },
    { headerName: "CREATED DATE	", field: '' },
    { headerName: "UPDATE DATE", field: '' },
  ];
  columnDefs1: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "SMARTCARD", field: 'intend_to' },
    { headerName: "CHANNEL NAME", field: '' },
    { headerName: "STATUS	", field: '' },
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
  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService, private excelService: ExcelService) {
    this.form = this.fb.group({
      billingAddressCheckbox: [false]

    });
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  selectedTab: string = 'activation';
  ngOnInit() {
    // this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
    //   console.log(data);
    //   this.cas = data.map((item: any) => ({
    //     casname: item.casname,
    //     id: item.id
    // }));
    console.log(this.cas);
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.cas);
      
    });
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.area = data[0].arealist;
      console.log(this.area);

    })
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  get billingAddressCheckbox() {
    return this.form.get('billingAddressCheckbox');
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
  casPackageList() {
    console.log(this.casItem);
    console.log(event);
    this.userservice.getAddonlistByCasType(this.role, this.username, this.castype).subscribe((data: any) => {
      console.log(data);
      this.toppingList = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      // this.toppingList = data;
      console.log(this.toppingList);
      
    })
  }
  generateExcel() {
    this.excelService.generatealacarteactivationExcel();
  }
}
