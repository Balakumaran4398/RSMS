import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { ActivatedRoute } from '@angular/router';
import { ExcelService } from '../../service/excel.service';
import { StorageService } from '../../service/storage.service';
import { SwalService } from '../../service/swal.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chart-inventory-report',
  templateUrl: './chart-inventory-report.component.html',
  styleUrls: ['./chart-inventory-report.component.scss']
})
export class ChartInventoryReportComponent {
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
    paginationPageSize: 100,
    paginationPageSizeSelector: [10, 20],
    pagination: true,
  };
  // columnDefs: any[] = [];
  rowData: any;
  gridApi: any;
  role: any
  username: any;
  type: any;
  reportType: any;
  id: any;
  msodetails: any;
  constructor(private userService: BaseService, storageService: StorageService, private excelService: ExcelService, private route: ActivatedRoute, private location: Location, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.type = this.route.snapshot.paramMap.get('id');
    console.log(this.type);

  }
  ngOnInit(): void {
    this.onColumnDefs();
    switch (this.type) {
      case '11':
        this.id = 'BOX IN MSO HAND';
        break;
      case '12':
        this.id = 'BOX IN LCO HAND';
        break;
      case '13':
        this.id = 'BOX IN CUSTOMER HAND';
        break;
      default:
        this.id = '';

    }
    this.userService.getDashboardReport(this.role, this.username, this.type, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log('sdfdsfdsfdsfdsfds');

          if (response.status === 200) {
            // this.updateColumnDefs(this.type);
            this.rowData = response.body;
            const rowCount = this.rowData.length ;
            if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
              this.gridOptions.paginationPageSizeSelector.push(rowCount);
            }
            console.log(this.rowData);
            // this.swal.Success_200();
          } else if (response.status === 204) {
            this.swal.Success_204();
          }
        },
        (error) => {
          this.handleApiError(error);
        });
    this.userService.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
  }
  columnDefs: any[] = [
    // { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
    // { headerName: "SMARTCARD", field: 'smartcard', width: 250, },
    // { headerName: "BOX ID", field: 'boxid', width: 200, },
    // { headerName: "CARTON BOX", field: 'cottonboxdisplay', width: 200, },
    // { headerName: "CAS NAME", field: 'casname', width: 200, },
    // {
    //   headerName: "IS ALLOCATED", field: 'isallocated', width: 200,
    //   cellRenderer: (params: any) => {
    //     const value = params.value;
    //     const color = value === true || value === 'true' ? 'green' : 'red';
    //     const text = value === true || value === 'true' ? 'TRUE' : 'FALSE';
    //     return `<span style="color: ${color}; font-weight: bold;">${text}</span>`;
    //   }
    // },
    // {
    //   headerName: "STATUS", field: 'statusdisplay', width: 200,

    // },
    // { headerName: "OPERATOR NAME", field: 'operatorname', width: 250, },
  ]

  private onColumnDefs() {
    if (this.type == 11) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, },
        { headerName: "SMARTCARD", field: 'smartcard', width: 300, },
        { headerName: "BOX ID", field: 'boxid', width: 250, },
        { headerName: "CARTON BOX", field: 'cottonboxdisplay', width: 230, },
        { headerName: "CAS NAME", field: 'casname', width: 300, },
        {
          headerName: "IS ALLOCATED", field: 'isallocated', width: 200,
          cellRenderer: (params: any) => {
            const value = params.value;
            const color = value === true || value === 'true' ? 'green' : 'red';
            const text = value === true || value === 'true' ? 'TRUE' : 'FALSE';
            return `<span style="color: ${color}; font-weight: bold;">${text}</span>`;
          }
        },
        {
          headerName: "STATUS", field: 'statusdisplay', width: 200,

        },

      ]
    } else if (this.type == 12) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
        { headerName: "SMARTCARD", field: 'smartcard', width: 250, },
        { headerName: "BOX ID", field: 'boxid', width: 200, },
        { headerName: "CARTON BOX", field: 'cottonboxdisplay', width: 200, },
        { headerName: "CAS NAME", field: 'casname', width: 200, },
        {
          headerName: "IS ALLOCATED", field: 'isallocated', width: 200,
          cellRenderer: (params: any) => {
            const value = params.value;
            const color = value === true || value === 'true' ? 'green' : 'red';
            const text = value === true || value === 'true' ? 'TRUE' : 'FALSE';
            return `<span style="color: ${color}; font-weight: bold;">${text}</span>`;
          }
        },
        {
          headerName: "STATUS", field: 'statusdisplay', width: 200,

        },
        { headerName: "OPERATOR NAME", field: 'operatorname', width: 230, },
      ]
    } else if (this.type == 13) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
        { headerName: "SMARTCARD", field: 'smartcard', width: 250, },
        { headerName: "BOX ID", field: 'boxid', width: 150, },
        { headerName: "SUBSCRIBER NAME", field: 'customername', width: 200, },
        { headerName: "MOBILE NUMBER", field: 'mobilno', width: 200, },
        { headerName: "CAS NAME", field: 'casname', width: 150, },
        {
          headerName: "IS ALLOCATED", field: 'isallocated', width: 150,
          cellRenderer: (params: any) => {
            const value = params.value;
            const color = value === true || value === 'true' ? 'green' : 'red';
            const text = value === true || value === 'true' ? 'TRUE' : 'FALSE';
            return `<span style="color: ${color}; font-weight: bold;">${text}</span>`;
          }
        },
        {
          headerName: "STATUS", field: 'statusdisplay', width: 150,

        },
        { headerName: "OPERATOR NAME", field: 'operatorname', width: 240, },
      ]
    }
  }

  getExcel() {
    console.log(this.type);
    this.swal.Loading();
    this.userService.getDashboardReport(this.role, this.username, this.type, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            if (this.type == 11) {
              console.log(this.type);
              const areatitle = 'A1:G2';
              const areasub = 'A3:G3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['S.NO', 'CARTON BOX', 'SMARTCARD', 'BOX ID', 'CAS TYPE', 'ISALLOCATED', 'STATUS'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any, index: number) => {
                const row = [index + 1, d.cottonboxdisplay, d.smartcard, d.boxid, d.casname, d.isallocated, d.statusdisplay];
                datas.push(row);
              });
              this.excelService.generateDashboardInventoryExcel(areatitle, header, datas, title, areasub, sub);
              this.swal.Close();
            } else if (this.type == 12) {
              const areatitle = 'A1:H2';
              const areasub = 'A3:H3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['S.NO', 'CARTON BOX', 'SMARTCARD', 'BOX ID', 'CAS TYPE', 'ISALLOCATED', 'STATUS', 'OPERATOR NAME'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any, index: number) => {
                const row = [index + 1, d.cottonboxdisplay, d.smartcard, d.boxid, d.casname, d.isallocated, d.statusdisplay, d.operatorname];
                datas.push(row);
              });
              this.excelService.generateboxinlcoExcel(areatitle, header, datas, title, areasub, sub);
              this.swal.Close();
            }
            else if (this.type == 13) {
              const areatitle = 'A1:I2';
              const areasub = 'A3:I3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['S.NO', 'SMARTCARD', 'BOX ID', 'CAS TYPE', 'ISALLOCATED', 'STATUS', 'OPERATOR NAME', 'SUBSCRIBER NAME', ' MOBILE NUMBER'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any, index: number) => {
                const row = [index + 1, d.smartcard, d.boxid, d.casname, d.isallocated, d.statusdisplay, d.operatorname, d.customername, d.mobilno];
                datas.push(row);
              });
              this.excelService.generateboxinCustomerExcel(areatitle, header, datas, title, areasub, sub);
              this.swal.Close();
            }
          }
          else if (response.status === 204) {
            this.swal.Success_204();
            this.rowData = [];
          }
        },
        (error) => {
          this.handleApiError(error);
        }
      );
  }
  getPDF() {
    this.swal.Loading();
    this.userService.getDashboardPDFReport(this.username, this.role, this.type, 1)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.id + ".pdf";
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        this.swal.Close();
      },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }

  goBack(): void {
    this.location.back();
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
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
