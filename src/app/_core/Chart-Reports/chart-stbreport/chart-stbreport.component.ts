import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../service/base.service';
import { StorageService } from '../../service/storage.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { SwalService } from '../../service/swal.service';
import { ExcelService } from '../../service/excel.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-chart-stbreport',
  templateUrl: './chart-stbreport.component.html',
  styleUrls: ['./chart-stbreport.component.scss']
})
export class ChartSTBReportComponent implements OnInit {
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
  columnDefs: any[] = [];
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
      case '1':
        this.id = 'ACTIVE STB COUNT';
        break;
      case '2':
        this.id = 'DEACTIVE STB COUNT';
        break;
      case '3':
        this.id = 'NEW STB COUNT';
        break;
      case '4':
        this.id = 'NOT EXPIRY STB COUNT';
        break;
      case '5':
        this.id = 'EXPIRED STB COUNT';
        break;
      case '6':
        this.id = 'BLOCK STB COUNT';
        break;
      default:
        this.id = '';
    }
    this.userService.getDashboardReport(this.username, this.role, this.type, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          if (response.status === 200) {
            this.updateColumnDefs(this.type);
            this.rowData = response.body;
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
    switch (type) {
      case '1': // Active
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
          { headerName: "SUB ID	", field: 'subid', width: 100, },
          { headerName: "OPERATOR NAME", field: 'operatorname', width: 200, },
          { headerName: "CUSTOMENR NAME", field: 'customername', width: 150, },
          { headerName: "SMARTCARD", field: 'smartcard', width: 250, },
          { headerName: "BOX ID", field: 'boxid', width: 170, },
          { headerName: "CAS NAME", field: 'casname', width: 150, },
          { headerName: "PRODUCT NAME", field: 'productname', width: 220, },
          { headerName: "PRODUCT ID", field: 'packageid', width: 100, },
          { headerName: "ACTIVATION DATE", field: 'activationdate', width: 190, },
          { headerName: "EXPIRY DATE", field: 'expirydate', width: 190, },

        ];
        break;

      case '2': // Deactive
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
          { headerName: "SUB ID	", field: 'subid', width: 100, },
          { headerName: "OPERATOR NAME", field: 'operatorname', width: 200, },
          { headerName: "CUSTOMENR NAME", field: 'customername', width: 150, },
          { headerName: "SMARTCARD", field: 'smartcard', width: 250, },
          { headerName: "BOX ID", field: 'boxid', width: 170, },
          { headerName: "CAS NAME", field: 'casname', width: 150, },
          { headerName: "PRODUCT NAME", field: 'productname', width: 220, },
          { headerName: "PRODUCT ID", field: 'packageid', width: 100, },
          { headerName: "ACTIVATION DATE", field: 'activationdate', width: 190, },
          { headerName: "EXPIRY DATE", field: 'expirydate', width: 190, },
        ];
        break;

      case '3': // Fresh
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 150, },
          { headerName: "SUB ID	", field: 'subid', width: 220, },
          { headerName: "OPERATOR NAME", field: 'operatorname', width: 220, },
          { headerName: "CUSTOMENR NAME", field: 'customername', width: 220, },
          { headerName: "SMARTCARD", field: 'smartcard', width: 300, },
          { headerName: "BOX ID", field: 'boxid', width: 220, },
          { headerName: "CAS NAME", field: 'casname', width: 220, },
          { headerName: "CREATION DATE", field: 'createddate', width: 250, },
        ];
        break;
      case '4': // Not expiry
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
          { headerName: "SUB ID	", field: 'subid', width: 100, },
          { headerName: "OPERATOR NAME", field: 'operatorname', width: 200, },
          { headerName: "CUSTOMENR NAME", field: 'customername', width: 150, },
          { headerName: "SMARTCARD", field: 'smartcard', width: 250, },
          { headerName: "BOX ID", field: 'boxid', width: 170, },
          { headerName: "CAS NAME", field: 'casname', width: 150, },
          { headerName: "PRODUCT NAME", field: 'productname', width: 220, },
          { headerName: "PRODUCT ID", field: 'casproductid', width: 100, },
          { headerName: "CREATION DATE", field: 'updateddate', width: 190, },
          { headerName: "EXPIRY DATE", field: 'expirydate', width: 190, },
        ];
        break;

      case '5': // Expiry
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
          { headerName: "SUB ID	", field: 'subid', width: 100, },
          { headerName: "OPERATOR NAME", field: 'operatorname', width: 200, },
          { headerName: "CUSTOMENR NAME", field: 'customername', width: 150, },
          { headerName: "SMARTCARD", field: 'smartcard', width: 250, },
          { headerName: "BOX ID", field: 'boxid', width: 170, },
          { headerName: "CAS NAME", field: 'casname', width: 150, },
          { headerName: "PRODUCT NAME", field: 'productname', width: 220, },
          { headerName: "PRODUCT ID", field: 'casproductid', width: 100, },
          { headerName: "CREATION DATE", field: 'updateddate', width: 190, },
          { headerName: "EXPIRY DATE", field: 'expirydate', width: 190, },
        ];
        break;
      case '6': // Block
        this.columnDefs = [
          { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
          { headerName: "SUB ID	", field: 'subid', width: 100, },
          { headerName: "OPERATOR NAME", field: 'operatorname', width: 200, },
          { headerName: "CUSTOMENR NAME", field: 'customername', width: 150, },
          { headerName: "MOBILE NUMBER", field: 'operatorname', width: 200, },
          { headerName: "SMARTCARD", field: 'smartcard', width: 250, },
          { headerName: "BOX ID", field: 'boxid', width: 170, },
          { headerName: "CAS NAME", field: 'casname', width: 150, },
          { headerName: "PACKAGE", field: 'productname', width: 220, },
          { headerName: "BLOCKED DATE", field: 'updateddate', width: 190, },
          { headerName: "EXPIRY DATE", field: 'expirydate', width: 190, },
        ];
        break;

      default:
        this.columnDefs = [];
        break;
    }
  }
  goBack(): void {
    this.location.back();
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  getExcel() {
    console.log(this.type);
    this.userService.getDashboardReport(this.username, this.role, this.type, 2)
      .subscribe(
        (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
          console.log(this.type);
          if (response.status === 200) {
            this.rowData = response.body;
            console.log(this.type);
            if (this.type == 1 || this.type == 2) {
              console.log(this.type);
              const areatitle = 'A1:J2';
              const areasub = 'A3:J3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PRODUCT NAME', 'PRODUCT ID', 'ACTIVATION DATE', 'EXPIRY DATE'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any) => {
                const row = [d.subid, d.operatorname, d.customername, d.smartcard, d.boxid, d.casname, d.productname, d.packageid, d.activationdate, d.expirydate];
                console.log('type 1 and 2', row);
                datas.push(row);
              });
              this.excelService.generateDashboardSTBExcel(areatitle, header, datas, title, areasub, sub);
            } else if (this.type == 3) {
              console.log(this.type);

              const areatitle = 'A1:G2';
              const areasub = 'A3:G3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'CREATION DATE'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any) => {
                const row = [d.subid, d.operatorname, d.customername, d.smartcard, d.boxid, d.casname, d.createddate];
                console.log('type 3', row);
                datas.push(row);
              });
              this.excelService.generateDashboardSTBExcel(areatitle, header, datas, title, areasub, sub);
            } else if (this.type == 4 || this.type == 5) {
              const areatitle = 'A1:J2';
              const areasub = 'A3:J3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PRODUCT NAME', 'PRODUCT ID', 'CREATION DATE', 'EXPIRY DATE'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any) => {
                const row = [d.subid, d.operatorname, d.customername, d.smartcard, d.boxid, d.casname, d.productname, d.casproductid, d.updateddate, d.expirydate];
                console.log('type 4 and 5', row);
                datas.push(row);
              });
              this.excelService.generateDashboardSTBExcel(areatitle, header, datas, title, areasub, sub);
            } else if (this.type == 6) {
              const areatitle = 'A1:J2';
              const areasub = 'A3:J3';
              const title = this.id + ' REPORT';
              const sub = 'MSO ADDRESS:' + this.msodetails;
              const header = ['SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'MOBILE NUMBER', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PACKAGE', 'BLOCKED DATE', 'EXPIRY DATE'];
              const data = this.rowData;
              const datas: Array<any> = [];
              data.forEach((d: any) => {
                const row = [d.subid, d.operatorname, d.customername, d.mobileno, d.smartcard, d.boxid, d.casname, d.productname, d.blockeddate, d.expirydate];
                console.log('type 6', row);
                datas.push(row);
              });
              this.excelService.generateDashboardSTBExcel(areatitle, header, datas, title, areasub, sub);
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
