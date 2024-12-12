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
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
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
    this.userService.getDashboardReport(this.username, this.role, this.type, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log('sdfdsfdsfdsfdsfds');

          if (response.status === 200) {
            // this.updateColumnDefs(this.type);
            this.rowData = response.body;
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
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
    { headerName: "SMARTCARD", field: 'smartcard', width: 350, },
    { headerName: "BOX ID", field: 'boxid', width: 350, },
    { headerName: "CARTON BOX", field: 'cottonboxdisplay', width: 350, },
    { headerName: "CAS NAME", field: 'casname', width: 350, },
    { headerName: "IS ALLOCATED", field: 'isallocated', width: 330, 
      cellRenderer: (params: any) => {
        const value = params.value; 
        const color = value === true || value === 'true' ? 'green' : 'red';
        const text = value === true || value === 'true' ? 'TRUE' : 'FALSE';
        return `<span style="color: ${color}; font-weight: bold;">${text}</span>`;
      }
    },
    {
      headerName: "STATUS", field: 'statusdisplay', width: 330, 
      
    },
    { headerName: "OPERATOR NAME", field: 'operatorname', width: 330, },
  ]
  getExcel() {
    console.log(this.type);
    this.userService.getDashboardReport(this.username, this.role, this.type, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            if (this.type == 11 || this.type == 12 || this.type == 13) {
              console.log(this.type);
              const areatitle = 'A1:F2';
              const areasub = 'A3:F3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['SMARTCARD', 'BOX ID', 'CARTON BOX', 'CAS NAME',  'STATUS', 'OPERATOR NAME'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any) => {
                const row = [d.smartcard, d.boxid, d.cottonboxdisplay, d.casname,  d.statusdisplay, d.operatorname];
                datas.push(row);
              });
              this.excelService.generateDashboardInventoryExcel(areatitle, header, datas, title, areasub, sub);
            }

          } else if (response.status === 204) {
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
