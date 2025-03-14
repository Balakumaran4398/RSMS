import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { BaseService } from '../../service/base.service';
import { ActivatedRoute } from '@angular/router';
import { ExcelService } from '../../service/excel.service';
import { StorageService } from '../../service/storage.service';
import { SwalService } from '../../service/swal.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chart-package-report',
  templateUrl: './chart-package-report.component.html',
  styleUrls: ['./chart-package-report.component.scss']
})
export class ChartPackageReportComponent {
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        if (!isNaN(valueA) && !isNaN(valueB)) {
          return Number(valueA) - Number(valueB); 
        }
        if (!valueA) valueA = '';
        if (!valueB) valueB = '';
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      },
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
  columnDefs: any[] = [];
  constructor(private userService: BaseService, storageService: StorageService, private excelService: ExcelService, private route: ActivatedRoute, private location: Location, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.type = this.route.snapshot.paramMap.get('id');
    console.log(this.type);

  }
  ngOnInit(): void {
    switch (this.type) {
      case '7':
        this.id = 'BASE PACKAGE';
        break;
      case '8':
        this.id = 'ADDON PACKAGE';
        break;
      case '9':
        this.id = 'PAYCHANNEL';
        break;
      case '10':
        this.id = 'FTA CHANNEL';
        break;
      default:
        this.id = '';
    }
    console.log('type', this.type);
    this.userService.getDashboardReport(this.role, this.username, this.type, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          console.log('sdfdsfdsfdsfdsfds');
          if (response.status === 200) {
            this.updateColumnDefs(this.type);
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

  private updateColumnDefs(type: string): void {
    console.log(type);

    switch (type) {
      case '7': // BASE PACKAGE
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
          { headerName: "PACKAGE ID", field: 'packageid', width: 300, },
          { headerName: "PACKAGE NAME", field: 'productname', width: 300, },
          { headerName: "PACKAGE RATE", field: 'rate', width: 300, },
          { headerName: "PRODUCT ID", field: 'casproductid', width: 300, },
          { headerName: "CAS TYPE", field: 'casname', width: 310, },
        ];
        break;

      case '8': // ADDON PACKAGE
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
          { headerName: "PACKAGE ID", field: 'packageid', width: 300, },
          { headerName: "PACKAGE NAME", field: 'productname', width: 300, },
          { headerName: "PACKAGE RATE", field: 'rate', width: 300, },
          { headerName: "PRODUCT ID", field: 'casproductid', width: 300, },
          { headerName: "CAS TYPE", field: 'casname', width: 310, },
        ];
        break;

      case '9': // PAYCHANNEL
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
          { headerName: "CHANNEL NAME", field: 'channelname', width: 300, },
          { headerName: "PRODUCT ID", field: 'productid', width: 300, },
          { headerName: "RATE", field: 'rate', width: 300, },
          { headerName: "SERVICE ID", field: 'serviceid', width: 300, },
          { headerName: "CREATED DATE", field: 'createddate', width: 310, },
        ];
        break;
      case '10': // FTA CHANNEL
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
          { headerName: "CHANNEL NAME", field: 'channelname', width: 300, },
          { headerName: "PRODUCT ID", field: 'productid', width: 300, },
          { headerName: "RATE", field: 'rate', width: 300, },
          { headerName: "SERVICE ID", field: 'serviceid', width: 300, },
          { headerName: "CREATED DATE", field: 'createddate', width: 310, },
        ];
        break;

      default:
        this.columnDefs = [];
        break;
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
            if (this.type == 7) {
              console.log(this.type);
              const areatitle = 'A1:E2';
              const areasub = 'A3:E3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['PACKAGE ID', 'PACKAGE NAME', 'PACKAGE RATE', 'PRODUCT ID', 'CAS TYPE'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any) => {
                const row = [d.packageid, d.productname, d.rate, d.casproductid, d.casname];
                console.log('type 7', row);
                datas.push(row);
              });
              this.excelService.generateBasePackageExcel(areatitle, header, datas, title, areasub, sub);
              this.swal.Close();
            } else if (this.type == 8) {
              console.log(this.type);
              const areatitle = 'A1:F2';
              const areasub = 'A3:F3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['S.NO','PACKAGE ID', 'PACKAGE NAME', 'PACKAGE RATE', 'PRODUCT ID', 'CAS TYPE'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any,index:number) => {
                const row = [index+1,d.packageid, d.productname, d.rate, d.casproductid, d.casname];
                console.log('type 8', row);
                datas.push(row);
              });
              this.excelService.generateAddonExcel(areatitle, header, datas, title, areasub, sub);
              this.swal.Close();
            } else if (this.type == 9) {
              console.log(this.type);
              const areatitle = 'A1:F2';
              const areasub = 'A3:F3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['S.NO','CHANNEL NAME', 'PRODUCT ID','SERVICE ID', 'CHANNEL RATE', 'CREATION DATE'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any,index:number) => {
                const row = [index+1,d.channelname, d.productid,d.serviceid, d.rate,  d.createddate];
                console.log('type 9', row);
                datas.push(row);
              });
              this.excelService.generatePaychannelExcel(areatitle, header, datas, title, areasub, sub);
              this.swal.Close();
            } else if (this.type == 10) {
              console.log(this.type);
              const areatitle = 'A1:F2';
              const areasub = 'A3:F3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['S.NO','CHANNEL NAME', 'PRODUCT ID', 'SERVICE ID','CHANNEL RATE',  'CREATION DATE'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any,index:number) => {
                const row = [index+1,d.channelname, d.productid,d.serviceid, d.rate,  d.createddate];
                console.log('type 10', row);
                datas.push(row);
              });
              this.excelService.generateFTAExcel(areatitle, header, datas, title, areasub, sub);
              this.swal.Close();
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
