import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

import Swal from 'sweetalert2';
import { ChannelCreateComponent } from '../_Dialogue/Channel_dialog/channel-create/channel-create.component';
import { ChannelEditComponent } from '../_Dialogue/Channel_dialog/channel-edit/channel-edit.component';
import { ChannelUploadComponent } from '../_Dialogue/Channel_dialog/channel-upload/channel-upload.component';
import { MatSelectChange } from '@angular/material/select';
import { SwalService } from 'src/app/_core/service/swal.service';
import { HttpResponse } from '@angular/common/http';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { LcologinpageComponent } from '../../subscriber/lcologinpage/lcologinpage.component';
import { LoginrefundComponent } from '../_Dialogue/LCO_Recharge/loginrefund/loginrefund.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent {
  isupload: boolean = false;
  isaddnew: boolean = false;



  // gridOptions = {
  //   defaultColDef: {
  //     sortable: true,
  //     resizable: true,
  //     filter: true,
  //     floatingFilter: true,
  //     comparator: (valueA: any, valueB: any) => {
  //       const isNumberA = !isNaN(valueA) && valueA !== null;
  //       const isNumberB = !isNaN(valueB) && valueB !== null;
  
  //       if (isNumberA && isNumberB) {
  //         return valueA - valueB;
  //       } else {
  //         const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
  //         const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
  //         if (normalizedA < normalizedB) return -1;
  //         if (normalizedA > normalizedB) return 1;
  //         return 0;
  //       }
  //     },
  //   },
  // };

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

  };
  
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  hasSelectedRows: boolean = true;
  selectCount: any;
  public rowSelection: any = "multiple";
  username: string;
  role: string;
  rowData: any;
  msodetails: any;
  type: string[] = ['All', 'Active', 'Deactive'];
  selectType: any = 'All';
  selectedType: string = 'All';

  IsOperator: boolean = false;
  Isuser: boolean = false;

  constructor(public dialog: MatDialog, public userService: BaseService, storageService: StorageService, private swal: SwalService, private excelService: ExcelService,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(this.username)
    console.log(this.role);

  }
  ngOnInit(): void {

    this.userService.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
    if (this.role === 'ROLE_ADMIN' || this.role === 'ROLE_SPECIAL') {
      this.Isuser = true;
      this.IsOperator = false;
      this.getChannelList(this.selectedType);
    } else if (this.role === 'ROLE_OPERATOR') {
      this.Isuser = false;
      this.IsOperator = true;
      this.getLCOChannelList();
    }
  }
  getChannelList(selectedType: string): void {
    this.userService.ChannelList(this.role, this.username, selectedType).subscribe((data) => {
      console.log(data);
      this.rowData = data;
    });
  }
  getLCOChannelList(): void {
    this.userService.ChannelList(this.role, this.username, 'All').subscribe((data) => {
      console.log(data);
      this.rowData = data;
    });
  }


  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedType = selectElement.value;

    this.selectedType = selectedType;
    this.getChannelList(this.selectedType);
    this.rowData = [];
  }

  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  columnDefs: any[] = [
    {
      headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true, filter: false
    },
    {
      headerName: "CHANNEL NAME",
      field: 'channel_name',
      width: 250,
      cellStyle: { textAlign: 'left' },
      // cellStyle: (params: any) => {
      //   if (params.data.paidstatus === "Not Paid") {
      //     return { color: 'block', textAlign: 'left' };
      //   } else if (params.data.paidstatus === "Paid") {
      //     return { color: 'green', textAlign: 'left' };
      //   }
      //   return { textAlign: 'left' }; 
      // }
    },
    { headerName: "SERVICE ID", field: 'service_id', cellStyle: { textAlign: 'center' }, width: 185 },
    { headerName: "PRODUCT ID", field: 'product_id', cellStyle: { textAlign: 'center' }, width: 200, },
    { headerName: "BROADCASTER", field: 'broadcastername', cellStyle: { textAlign: 'left' }, width: 250, },
    { headerName: "INR AMOUNT", field: 'inr_amt', cellStyle: { textAlign: 'center' }, width: 200, },
    {
      headerName: 'ACTION', cellStyle: { textAlign: 'center' }, width: 140,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'var(--active-edit-icon)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "30px";
        editButton.addEventListener('click', () => {
          this.openEditDialog(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },

    {
      headerName: "STATUS", field: 'statusdisplay', width: 250,
      cellRenderer: (params: { value: any; }) => {
        const isActive = params.value === 'Active';
        const color = isActive ? 'green' : 'red';
        return `<span style="color: ${color}">${params.value}</span>`;
      }
    },

    // { headerName: "STATUS", field: 'paidstatus', width: 200,},
    // { headerName: "LOGO", field: 'channel_logo', editable: true },


  ];
  columnDefs1: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true, filter: false
    },
    {
      headerName: "CHANNEL NAME", field: 'channel_name', width: 250,
      cellStyle: (params: any) => {
        if (params.data.paidstatus === "Not Paid") {
          return { color: 'block', textAlign: 'left' };
        } else if (params.data.paidstatus === "Paid") {
          return { color: 'green', textAlign: 'left' };
        }
        return { textAlign: 'left' };
      }
    },
    { headerName: "FREQUENCY", field: 'channel_freq', cellStyle: { textAlign: 'center' }, width: 185 },
    { headerName: "DESCRIPTION", field: 'channel_desc', cellStyle: { textAlign: 'center' }, width: 200, },
    { headerName: "PRODUCT ID", field: 'product_id', cellStyle: { textAlign: 'left' }, width: 250, },
    { headerName: "TRANSPORT ID", field: 't_id', cellStyle: { textAlign: 'center' }, width: 200, },
    { headerName: "SERVICE ID", field: 'service_id', cellStyle: { textAlign: 'center' }, width: 200, },
    { headerName: "INR AMOUNT", field: 'inr_amt', cellStyle: { textAlign: 'center' }, width: 200, },
    {
      headerName: "STATUS", field: 'statusdisplay', width: 250,
      cellRenderer: (params: { value: any; }) => {
        const isActive = params.value === 'Active';
        const color = isActive ? 'green' : 'red';
        return `<span style="color: ${color}">${params.value}</span>`;
      }
    }, { headerName: "LOGO", field: 'channel_logo', cellStyle: { textAlign: 'center' }, width: 200, },

  ];
  onSelectionChange(event: MatSelectChange): void {
    this.selectedType = event.value;
    this.getChannelList(this.selectedType);
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.selectCount = selectedRows.length
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      console.log("selectCount:", this.selectCount);

      this.selectedIds = selectedRows.map((e: any) => e.channel_id);
      this.selectedtypes = selectedRows.map((e: any) => e.statusdisplay);
      console.log(this.selectedIds);
    }
  }
  openEditDialog(data: any): void {
    const dialogRef = this.dialog.open(ChannelEditComponent, {
      // width: '500px',
      // height: '600px',
      maxWidth: "500px",
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  upload(data: any): void {
    const dialogRef = this.dialog.open(ChannelUploadComponent, {
      width: '800px',
      // height: '500px',
      // panelClass: 'custom-dialog-container',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  addnew() {
    this.isaddnew = !this.isaddnew;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ChannelCreateComponent, {
      width: '700px',
      // maxHeight: 700,
      // height: '900px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
          text: 'Please wait while the Channel is being updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.ActiveChannel(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          Swal.fire({
            title: 'Activated!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });

          this.ngOnInit();
        }, (err) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message,
            icon: 'error'
          });
        });
      }
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
      confirmButtonText: "Yes, Deactivate it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deactivating...',
          text: 'Please wait while the Channel is being Deactivated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.deleteChannel(this.role, this.username, this.selectedIds).subscribe((res: any) => {
          Swal.fire({
            title: 'Deactivated!',
            text: res.message,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          this.ngOnInit();
        }, (err) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message,
            icon: 'error'
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
    this.userService.getChannelExcelReport(this.role, this.username, this.selectedType)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            // const title = (this.type + ' REPORT').toUpperCase();
            const title = (`${this.selectedType} CHANNEL DETAILS REPORT`).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:K1';
            // areasub = 'A2:L2';
            header = ['TS ID', 'FREQUENCY', 'SERVICE NAME', 'SERVICE ID', 'PRODUCT ID', 'INR AMOUNT', 'CATEGORY NAME', 'BROADCASTER NAME', 'CHANNEL TYPE NAME', 'DISTRIBUTOR NAME', 'CHANNEL STATUS'];

            this.rowData.forEach((d: any, index: number) => {
              const row = [d.t_id, d.channel_freq, d.channel_name, d.service_id, d.product_id, d.inr_amt, d.categoryname, d.broadcastername, d.channeltypename, d.distributorname, d.statusdisplay];
              // console.log('type 1 and 4', row);
              datas.push(row);
            });
            Swal.close();
            this.excelService.generateChannelExcel(areatitle, header, datas, title,);

          } else if (response.status === 204) {
            // this.swal.Success_204();
            this.rowData = response.body;
            console.log(this.type);
            // const title = (this.type + ' REPORT').toUpperCase();
            const title = (`${this.selectedType} CHANNEL DETAILS REPORT`).toUpperCase();
            const sub = 'MSO ADDRESS:' + this.msodetails;
            let areatitle = '';
            let areasub = '';
            let header: string[] = [];
            const datas: Array<any> = [];
            // if (this.type == 1) {
            areatitle = 'A1:L2';
            areasub = 'A3:L3';
            header = ['S.NO', 'TS ID', 'FREQUENCY', 'SERVICE NAME', 'SERVICE ID', 'PRODUCT ID', 'INR AMOUNT', 'CATEGORY NAME', 'BROADCASTER NAME', 'CHANNEL TYPE NAME', 'DISTRIBUTOR NAME', 'CHANNEL STATUS'];
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
    this.userService.getChannelPDFReport(this.role, this.username, this.selectedType)

      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/xlsx' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        // link.download = (this.reportTitle + ".pdf").toUpperCase();
        link.download = `${this.selectedType} CHANNEL DETAILS REPORT.pdf`.toUpperCase();

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
  generateExcel() {
    const dialogRef = this.dialog.open(LoginrefundComponent, {
      data: '1'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.excelService.generateChannelDetailsExcel();
      } else {
        console.log('Dialog closed without success');
      }
    });
  }
  // generateExcel() {
  //   const dialogData = {
  //     type: 'someTypeValue',
  //     newsubid: 'newSubidValue',
  //     subId: 'subIdValue',
  //     detailsList: [],
  //     pairBoxlist: [],
  //     pairSmartcardlist: [],
  //     plantype: []
  //   };

  //   const dialogRef = this.dialog.open(LcologinpageComponent, {
  //     data: dialogData,
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed', result);
  //     this.excelService.generateChannelDetailsExcel();
  //   });
  // }


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
}
