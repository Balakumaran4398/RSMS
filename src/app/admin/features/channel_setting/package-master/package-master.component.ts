import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { UpdatePackageMasterComponent } from '../_Dialogue/package_master/update-package-master/update-package-master.component';
// import { filter } from 'node_modules1/jszip';
import { isTemplateMiddle } from 'typescript';
import { HttpResponse } from '@angular/common/http';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-package-master',
  templateUrl: './package-master.component.html',
  styleUrls: ['./package-master.component.scss']
})
export class PackageMasterComponent {
  selectedTab: string = '0';
  gridApi: any;
  selectedIds: number[] = [];
  selectedtypes: any;
  act_deact_type: any;
  isAnyRowSelected: boolean = false;
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
          return normalizedA.localeCompare(normalizedB);
        }
      },
      filterParams: {
        textFormatter: (value: string) => {
          return value ? value.toString().toLowerCase() : '';
        },
        debounceMs: 200,
      },
    },
    // paginationPageSize: 10,
    // paginationPageSizeSelector:[10,20,50],
    // pagination: true,
  };
  username: any;
  user_role: any;
  rowData: any;
  msodetails: any;

  selectType: any;

  type: number = 0;
  Castype: any = 0;
  cas: any[] = [];
  userid: any;
  accessip: any;
  public rowSelection: any = "multiple";
  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService, private swal: SwalService, private excelService: ExcelService,) {
    this.username = storageService.getUsername();
    this.user_role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
  }
  ngOnInit(): void {
    // this.userService.getpackagemasterBaseList(this.user_role, this.username, this.type, this.Castype).subscribe((data) => {
    //   this.rowData = data;


    // })
    this.onSubscriberStatusChange("");
    this.userService.Cas_type(this.user_role, this.username).subscribe((data) => {
      this.cas = data;
    });

    this.userService.getMsoDetails(this.user_role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
  }

  ngAfterViewInit(): void {
    this.loadData(this.selectedTab);
  }
  private loadData(tab: any): void {

  }
  onGridReady(params: { api: any; }) {
    // this.gridApi.sizeColumnsToFit();
    this.gridApi = params.api;
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows[0]?.statusdisplay;
      console.log(this.selectedtypes);
      console.log(selectedRows);


    }
  }
  onSubscriberStatusChange(event: any) {
    this.userService.getpackagemasterBaseList(this.user_role, this.username, this.selectedTab, this.Castype).subscribe((data) => {
      this.updateColumnDefs(this.selectedTab);
      this.rowData = data;
      const rowCount = this.rowData.length;
      // if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
      //   this.gridOptions.paginationPageSizeSelector.push(rowCount);
      // }
    });

  }

  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, filter: false,
      checkboxSelection: true,
    },
    { headerName: "PRODUCT NAME", field: 'productname', width: 150, },
    { headerName: "CAS TYPE", field: 'casname', },
    { headerName: "REFERENCE ID", field: 'referenceid', },
    { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
    { headerName: "TYPE", field: 'type', },
    { headerName: "RATE", field: 'rate', },
    { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
    { headerName: "MSO AMOUNT", field: 'msoamount', },
    { headerName: "LCO COMMISSION", field: 'lcocommission', },
    { headerName: "CREATED DATE", field: 'createddate', },

    {
      headerName: 'IS DELETE',
      field: 'isdelete',
      cellRenderer: (params: { value: any }) => {
        const color = params.value ? 'blue' : 'red';
        const text = params.value ? 'YES' : 'NO';
        return `<span style="color: ${color}">${text}</span>`;
      }
    },

    {
      headerName: 'ISACTIVE',
      field: 'isactive',
      cellRenderer: (params: { value: any; }) => {
        const color = params.value ? 'green' : 'red';
        const text = params.value ? 'Active' : 'Deactive';
        return `<span style="color: ${color}">${text}</span>`;
      }
    },


  ]
  // selectTab(tab: string): void {
  //   this.selectedTab = tab;
  //   this.loadData(tab);
  // }

  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.gridOptions) {
      let newRowData;
      if (this.selectedTab === '1') {
        newRowData = this.getBasePackageData('1');
      } else if (this.selectedTab === '2') {
        newRowData = this.getAddonPackageData('2');
      } else if (this.selectedTab === '3') {
        newRowData = this.getAlacarteData('3');
      } else if (this.selectedTab === '0') {
        newRowData = this.getAllData('0');
      }
    }
  }
  getBasePackageData(event: any) {
    this.onSubscriberStatusChange(event)
    return [this.rowData];
  }
  getAddonPackageData(event: any) {
    this.onSubscriberStatusChange(event)
    return [this.rowData];
  }
  getAlacarteData(event: any) {
    this.onSubscriberStatusChange(event)
    return [this.rowData];
  }
  getAllData(event: any) {
    this.onSubscriberStatusChange(event)
    return [this.rowData];
  }
  private updateColumnDefs(tab: string): void {
    if (tab === '0') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, filter: false,
          checkboxSelection: true,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
        {
          headerName: 'ACTION', width: 150,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            // editButton.innerHTML = '<i class="bx bx-edit-alt"></i>';
            editButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.color = '(rgb(29 1 11)';
            editButton.style.border = 'none';
            editButton.title = 'Edit the Customer';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.style.fontSize = "30px";

            editButton.addEventListener('click', () => {
              this.openUpdatepackage(params.data);
            });

            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
        { headerName: "CAS TYPE", field: 'casname', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
        {
          headerName: "TYPE", field: 'type',
          cellRenderer: (params: { value: any }) => {
            const typeMap: Record<number, { name: string; color: string }> = {
              1: { name: "BASE", color: "blue" },
              2: { name: "ADDON", color: "green" },
              3: { name: "ALACARTE", color: "purple" }
            };

            const typeData = typeMap[params.value] || { name: "UNKNOWN", color: "red" };

            return `<span style="color: ${typeData.color}; font-weight: bold;">${typeData.name}</span>`;
          }
        },
        { headerName: "RATE", field: 'rate', },
        { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
        { headerName: "MSO AMOUNT", field: 'msoamount', },
        { headerName: "LCO COMMISSION", field: 'lcocommission', },
        { headerName: "CREATED DATE", field: 'createddate', },

        {
          headerName: 'IS DELETE',
          field: 'isdelete', width: 120,
          cellRenderer: (params: { value: any }) => {
            const color = params.value ? 'green' : 'red';
            const text = params.value ? 'YES' : 'NO';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
        {
          headerName: 'ISACTIVE',
          field: 'statusdisplay', width: 150,
          cellRenderer: (params: { value: any }) => {
            const value = params.value?.toString().toLowerCase();
            const color = value === 'active' ? 'green' : 'blue';
            return `<span style="color: ${color}">${params.value}</span>`;
          }
        },
      ]
    } else if (tab === '1') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, filter: false,
          checkboxSelection: true,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
        {
          headerName: 'ACTION', width: 150,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            // editButton.innerHTML = '<i class="bx bx-edit-alt"></i>';
            editButton.innerHTML = '<i class="fa fa-pen-square" aria-hidden="true"></i>';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.color = 'rgb(2 85 13)';
            editButton.style.border = 'none';
            editButton.title = 'Edit the Customer';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.style.fontSize = "30px";

            editButton.addEventListener('click', () => {
              this.openUpdatepackage(params.data);
            });

            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },

        { headerName: "CAS TYPE", field: 'casname', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
        // { headerName: "TYPE", field: 'type', },
        {
          headerName: "TYPE", field: 'type',
          cellRenderer: (params: { value: any }) => {
            const typeMap: Record<number, { name: string; color: string }> = {
              1: { name: "BASE", color: "blue" },
              2: { name: "ADDON", color: "green" },
              3: { name: "ALACARTE", color: "purple" }
            };

            const typeData = typeMap[params.value] || { name: "UNKNOWN", color: "red" };

            return `<span style="color: ${typeData.color}; font-weight: bold;">${typeData.name}</span>`;
          }
        },
        { headerName: "RATE", field: 'rate', },
        { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
        { headerName: "MSO AMOUNT", field: 'msoamount', },
        { headerName: "LCO COMMISSION", field: 'lcocommission', },
        { headerName: "CREATED DATE", field: 'createddate', },

        {
          headerName: 'IS DELETE',
          field: 'isdelete', width: 120,
          cellRenderer: (params: { value: any }) => {
            const color = params.value ? 'blue' : 'red';
            const text = params.value ? 'YES' : 'NO';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
        {
          headerName: 'ISACTIVE',
          field: 'statusdisplay', width: 150,
          cellRenderer: (params: { value: any }) => {
            const value = params.value?.toString().toLowerCase();
            const color = value === 'active' ? 'green' : 'blue';
            return `<span style="color: ${color}">${params.value}</span>`;
          }
        },
      ]
    } else if (tab === '2') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, filter: false,
          checkboxSelection: true,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
        {
          headerName: 'ACTION', width: 150,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            // editButton.innerHTML = '<i class="bx bx-edit-alt"></i>';
            editButton.innerHTML = '<i class="fa fa-pen-square" aria-hidden="true"></i>';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.color = 'rgb(2 85 13)';
            editButton.style.border = 'none';
            editButton.title = 'Edit the Customer';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.style.fontSize = "30px";

            editButton.addEventListener('click', () => {
              this.openUpdatepackage(params.data);
            });

            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
        { headerName: "CAS TYPE", field: 'casname', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
        // { headerName: "TYPE", field: 'type', },
        {
          headerName: "TYPE", field: 'type',
          cellRenderer: (params: { value: any }) => {
            const typeMap: Record<number, { name: string; color: string }> = {
              1: { name: "BASE", color: "blue" },
              2: { name: "ADDON", color: "green" },
              3: { name: "ALACARTE", color: "purple" }
            };

            const typeData = typeMap[params.value] || { name: "UNKNOWN", color: "red" };

            return `<span style="color: ${typeData.color}; font-weight: bold;">${typeData.name}</span>`;
          }
        },
        { headerName: "RATE", field: 'rate', },
        { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
        { headerName: "MSO AMOUNT", field: 'msoamount', },
        { headerName: "LCO COMMISSION", field: 'lcocommission', },
        { headerName: "CREATED DATE", field: 'createddate', },

        {
          headerName: 'IS DELETE',
          field: 'isdelete', width: 120,
          cellRenderer: (params: { value: any }) => {
            const color = params.value ? 'blue' : 'red';
            const text = params.value ? 'YES' : 'NO';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
        {
          headerName: 'ISACTIVE',
          field: 'statusdisplay', width: 150,
          cellRenderer: (params: { value: any }) => {
            const value = params.value?.toString().toLowerCase();
            const color = value === 'active' ? 'green' : 'blue';
            return `<span style="color: ${color}">${params.value}</span>`;
          }
        },
      ]
    } else if (tab === '3') {
      this.columnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, filter: false,
          checkboxSelection: true,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
        {
          headerName: 'ACTION', width: 150,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            // editButton.innerHTML = '<i class="bx bx-edit-alt"></i>';
            editButton.innerHTML = '<i class="fa fa-pen-square" aria-hidden="true"></i>';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.color = 'rgb(2 85 13)';
            editButton.style.border = 'none';
            editButton.title = 'Edit the Customer';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.style.fontSize = "30px";

            editButton.addEventListener('click', () => {
              this.openUpdatepackage(params.data);
            });

            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
        { headerName: "CAS TYPE", field: 'casname', },
        { headerName: "REFERENCE ID", field: 'referenceid', },
        { headerName: "CAS PRODUCT_ID", field: 'casproductid', },
        {
          headerName: "TYPE", field: 'type',
          cellRenderer: (params: { value: any }) => {
            const typeMap: Record<number, { name: string; color: string }> = {
              1: { name: "BASE", color: "blue" },
              2: { name: "ADDON", color: "green" },
              3: { name: "ALACARTE", color: "purple" }
            };

            const typeData = typeMap[params.value] || { name: "UNKNOWN", color: "red" };

            return `<span style="color: ${typeData.color}; font-weight: bold;">${typeData.name}</span>`;
          }
        },
        { headerName: "RATE", field: 'rate', },
        { headerName: "CUSTOMER AMOUNT", field: 'customeramount', },
        { headerName: "MSO AMOUNT", field: 'msoamount', },
        { headerName: "LCO COMMISSION", field: 'lcocommission', },
        { headerName: "CREATED DATE", field: 'createddate', },
        {
          headerName: 'IS DELETE',
          field: 'isdelete', width: 120,
          cellRenderer: (params: { value: any }) => {
            const color = params.value ? 'blue' : 'red';
            const text = params.value ? 'YES' : 'NO';
            return `<span style="color: ${color}">${text}</span>`;
          }
        },
        {
          headerName: 'ISACTIVE',
          field: 'statusdisplay', width: 150,
          cellRenderer: (params: { value: any }) => {
            const value = params.value?.toString().toLowerCase();
            const color = value === 'active' ? 'green' : 'blue';
            return `<span style="color: ${color}">${params.value}</span>`;
          }
        },
      ]
    }
  }
  openUpdatepackage(data: any) {
    const dialogRef = this.dialog.open(UpdatePackageMasterComponent, {
      width: '400px',
      height: '280px',
      maxWidth: '100vw',
      data: data
    });
    console.log('DATA', data);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  Deactive() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delated it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updateing...',
          text: 'Please wait while the package master is being deleted',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.UpdatePackagemasterList(this.user_role, this.username, this.selectedIds, 'false').subscribe((res: any) => {
          Swal.fire({
            title: 'Deactivated!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          this.ngOnInit();
          this.logCreate('Package Master Deactive Button Clicked', 'Deactive', this.selectedtypes);

        }, (err) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message,
            icon: 'error',
            timer: 2000,
            timerProgressBar: true,
          });
        });
      }
    });
  }

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
          text: 'Please wait while the package master is being Updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.UpdatePackagemasterList(this.user_role, this.username, this.selectedIds, 'true').subscribe((res: any) => {
          Swal.fire({
            title: 'Activated!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          });
          this.ngOnInit();

          this.logCreate('Package Master Active Button Clicked', 'Active', this.selectedtypes);
        }, (err) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message,
            icon: 'error',
            timer: 2000,
            timerProgressBar: true,
          });
        });
      }
    });
  }
  // -------------------------------report-------------------------
  getExcel() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    if (this.selectedTab === '0') {
      this.selectType = 'ALL';
    } else if (this.selectedTab === '1') {
      this.selectType = 'BASE';
    } else if (this.selectedTab === '2') {
      this.selectType = 'ADDON';
    } else if (this.selectedTab === '3') {
      this.selectType = 'ALACARTE';
    } else {
      return;
    }

    this.userService.getPackageExcelReport(this.user_role, this.username, this.selectedTab, this.Castype).subscribe(
      (response: HttpResponse<any[]>) => {
        console.log(this.type);
        if (response.status === 200) {
          this.rowData = response.body;
          console.log(this.rowData);
          // const title = (this.type + ' REPORT').toUpperCase();
          const title = (`${this.selectType} PRODUCT DETAILS REPORT`).toUpperCase();
          const sub = 'MSO ADDRESS:' + this.msodetails;
          let areatitle = '';
          let areasub = '';
          let header: string[] = [];
          const datas: Array<any> = [];
          // if (this.type == 1) {
          areatitle = 'A1:F2';
          areasub = 'A3:F3';
          header = ['S.NO', 'PRODUCT ID', 'PRODUCT NAME', 'PRODUCT STATUS', 'PROGRAMS', 'MSO AMOUNT'];

          this.rowData.forEach((d: any, index: number) => {
            const row = [index + 1, d.casproductid, d.productname, d.statusdisplay, d.msoamount, d.msoamount];
            datas.push(row);
          });
          Swal.close();
          this.excelService.generateSuspendBasedExcel(areatitle, header, datas, title, areasub, sub);

        } else if (response.status === 204) {
          // this.swal.Success_204();
          this.rowData = response.body;
          console.log(this.type);
          // const title = (this.type + ' REPORT').toUpperCase();
          const title = (`${this.selectType} PRODUCT DETAILS REPORT`).toUpperCase();
          const sub = 'MSO ADDRESS:' + this.msodetails;
          let areatitle = '';
          let areasub = '';
          let header: string[] = [];
          const datas: Array<any> = [];
          // if (this.type == 1) {
          areatitle = 'A1:F2';
          areasub = 'A3:F3';
          header = ['S.NO', 'PRODUCT ID', 'PRODUCT NAME', 'PRODUCT STATUS', 'PROGRAMS', 'MSO AMOUNT'];
          Swal.close();
          this.excelService.generateSuspendBasedExcel(areatitle, header, datas, title, areasub, sub);
          this.rowData = [];
        }
      },
      (error) => {
        this.handleApiError(error);
      }
    );
  }


  getPDF() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    // this.userService.getChannelPDFReport(this.user_role, this.username, this.selectedTab)

    //   .subscribe((x: Blob) => {
    //     const blob = new Blob([x], { type: 'application/pdf' });
    //     const data = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = data;
    //     // link.download = (this.selectType + ".pdf").toUpperCase();
    //     link.download = `${this.selectedTab} PRODUCT DETAILS REPORT.pdf`.toUpperCase();

    //     link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    //     setTimeout(() => {
    //       window.URL.revokeObjectURL(data);
    //       link.remove();
    //     }, 100);
    //     Swal.close();
    //   },
    //     (error: any) => {
    //       Swal.close();
    //       Swal.fire({
    //         title: 'Error!',
    //         text: error?.error?.message || 'There was an issue generating the PDF.',
    //         icon: 'error',
    //         confirmButtonText: 'Ok'
    //       });
    //     });
  }
  // ---------------------------------------------------------------------------------------------------------------------------------------
  handleApiError(error: any) {
    if (error.status === 400) {
      this.swal.Error_400();
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }

  reportDownload(type: number) {
    if (this.Castype > 0) {
      this.processingSwal();
      this.userService.getPakcageHistoryDownload(this.user_role, this.username, this.Castype, type)
        .subscribe((x: Blob) => {
          if (type == 1) {
            this.reportMaking(x, "PRODUCT DETAILS REPORT.pdf", 'application/pdf');
          } else if (type == 2) {
            this.reportMaking(x, "PRODUCT DETAILS REPORT.xlsx", 'application/xlsx');
          }
        },
          (error: any) => {
            this.pdfswalError(error?.error.message);
          });
    } else {
      this.swal.Custom_Error_400("Kindly select the cas!!");
    }
  }

  reportMaking(x: Blob, reportname: any, reporttype: any) {
    const blob = new Blob([x], { type: reporttype });
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = data;
    link.download = reportname.toUpperCase();
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    setTimeout(() => {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
    Swal.close();
  }
  pdfswalError(error: any) {
    Swal.close();
    Swal.fire({
      title: 'Error!',
      text: error || 'There was an issue generating the PDF CAS form report.',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
  processingSwal() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

  }

  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userService.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }

}
