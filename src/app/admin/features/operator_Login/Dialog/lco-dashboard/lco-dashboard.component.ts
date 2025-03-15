import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lco-dashboard',
  templateUrl: './lco-dashboard.component.html',
  styleUrls: ['./lco-dashboard.component.scss']
})
export class LcoDashboardComponent implements OnInit {
  role: any;
  username: any;
  type: any;
  columnDefs: any[] = [];
  rowData: any;
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
  msodetails: any;
  operatorname: any;
  gridApi: any;
  OType: any;
  operatorid: any;

  path: any;

  lcoDeatails: any;
  lcoId: any;

  constructor(private route: ActivatedRoute, private location: Location, private userService: BaseService, private storageServive: StorageService, private excelService: ExcelService, private swal: SwalService,) {
    this.type = this.route.snapshot.paramMap.get('id');
    this.role = storageServive.getUserRole();
    this.username = storageServive.getUsername();

  }
  ngOnInit(): void {
    this.onColumnDefs();
    this.operatorIdoperatorId();
    this.onMSODetails();
    this.setType(this.type);
    this.route.url.subscribe((segments) => {
      console.log(segments);
    });

  }
  onMSODetails() {
    this.userService.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = `${data.msoName} ${data.msoStreet}, ${data.msoArea}, ${data.msoState}, ${data.msoPincode}, ${data.msoEmail}`;
      console.log(this.msodetails);
    })
  }
  operatorIdoperatorId() {
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.lcoId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      console.log(this.lcoId);
      // if (this.type = 7) {
      this.onTableData();
      // } else if (this.type = 4) {
      //   this.onTableData();
      // }
    })
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  getHeader(): string {
    switch (this.type) {
      case '1': return 'TOTAL SUSPEND';
      case '2': return 'NOT EXPIRED SMARTCARD';
      case '3': return 'EXPIRED SMARTCARD';
      case '4': return 'FIRST TIME ACTIVATION';
      case '5': return 'BLOCK SUBSCRIBER';
      case '6': return 'INVENTORY';
      case '7': return 'TOTAL SUBSCRIBER';
      default: return 'UNKNOWN TYPE';
    }
  }
  setType(OType: string) {

    switch (OType) {
      case '1':
        // this.type = 1;
        this.OType = 'total smartcard connection';
        break;
      case '2':
        this.OType = 'not Expired smartcard';
        break;
      case '3':
        this.OType = 'expired smartcard';
        break;
      case '4':
        this.OType = 'First time Activation';
        break;
      case '5':
        this.OType = 'block subscriber';
        break;
      case '6':
        this.OType = 'INVENTORY';
        break;
      case '7':
        this.OType = 'total subscriber';
        break;
      case '8':
        this.OType = 'recharge';
        break;
      case '9':
        this.OType = 'lcowise retailer';
        break;
      case '10':
        this.OType = 'cancel Subscription';
        break;
      case '11':
        this.OType = 'productwise current';
        break;
      case '12':
        this.OType = 'areawise';
        break;
      default:
        this.OType = 0;
        break;
    }
  }
  onTableData() {
    this.swal.Loading();
    this.userService.getOperatorDashboardExcelReport(this.role, this.username, this.type, 2, this.lcoId, 0, 0, 0)
      .subscribe((response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
        } else if (response.status === 204) {
          this.swal.Close();
          this.rowData = [];
        }
        this.swal.Close();
      }, (error) => {
        this.handleApiError(error);
      });
  }

  private onColumnDefs() {
    if (this.type == 7 || this.type == 6) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        { headerName: 'SMARTCARD', field: 'smartcard', Flex: 1, width: 400, },
        { headerName: 'BOX ID	', field: 'boxid', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 400, },
        { headerName: 'CAS NAME', field: 'casname', width: 300, },
        { headerName: 'ALLOCATION DATE	', field: 'connectiondate', width: 400, },
      ]
    } else if (this.type == 2) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        { headerName: 'SUBSCRIBER ID', field: 'subid', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS ', field: 'address', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 150, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 150, },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 220, },
        { headerName: 'BOX ID', field: 'boxid', width: 180, },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 200, },
        { headerName: 'ACTIVATION DATE', field: 'activationdate', width: 200, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
        { headerName: 'STATUS', field: 'statusdisplay', width: 150, },
      ]
    }
    else if (this.type == 3) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        { headerName: 'SUBSCRIBER ID', field: 'subid', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS', field: 'address', width: 150, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 150, },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 230, },
        { headerName: 'BOX ID', field: 'boxid', width: 180, },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 230, },
        { headerName: 'ACTIVATION DATE', field: 'activationdate', width: 200, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
        { headerName: 'STATUS', field: 'statusdisplay', width: 150, },
      ]

    } else if (this.type == 4) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        { headerName: 'SUBSCRIBER ID', field: 'subid', Flex: 1, width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS	', field: 'address', width: 150, },
        { headerName: 'AREA NAME', field: 'areaname', width: 200, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 200, },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 200, },
        { headerName: 'BOX ID', field: 'boxid', width: 200, },
        { headerName: 'STATUS', field: 'statusdisplay', width: 200, },
      ]
    } else if (this.type == 5) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        { headerName: 'SUBSCRIBER ID', field: 'subid', Flex: 1, width: 150, },
        { headerName: 'OPERATOR NAME', field: 'operatorname', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'CUSTOMER NAME ', field: 'customername', Flex: 1, cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 200, },
        { headerName: 'BOX ID	', field: 'boxid', width: 150, },
        { headerName: 'CAS NAME', field: 'casname', width: 200, },
        { headerName: 'PRODUCT NAME', field: 'productname', width: 200, },
        { headerName: 'PRODUCT ID', field: 'productid', width: 200, },
        { headerName: 'CREATION DATE', field: 'creationdate', width: 200, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
      ]
    }
  }


  getExcel() {
    const generateExcelReport = (areatitle: string, areasub: string, header: string[], datas: any[]) => {
      const title = (this.operatorname + ' - ' + this.OType + ' REPORT').toUpperCase();
      const sub = 'MSO ADDRESS:' + this.msodetails;
      this.excelService.generateOperatorDashboardExcel(areatitle, header, datas, title, areasub, sub);
    };
    this.swal.Loading();
    this.userService.getOperatorDashboardExcelReport(this.role, this.username, this.type, 2, this.lcoId, 0, 0, 0)
      .subscribe((response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
          const datas: any[] = [];
          let areatitle = '';
          let areasub = '';
          let header: string[] = [];

          const generateDataRows = (fields: string[], rowData: any[]) => {
            rowData.forEach((d: any, index: number) => {
              const row = fields.map(field => d[field]);
              datas.push([index + 1, ...row]);
            });
          };
          console.log('type dfdfsf', this.type)
          this.swal.Close();
          if (this.type == 1) {
            console.log('type', this.type);
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'ACTIVATION DATE', 'EXPIRY DATE', 'PACKAGE STATUS'];
            generateDataRows(['subid', 'customername', 'address', 'areaname', 'mobileno', 'smartcard', 'boxid', 'activationdate', 'expirydate', 'statusdisplay'], this.rowData);

          } else if (this.type == 2) {
            console.log('type', this.type);
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE NAME', 'ACTIVATION DATE', 'EXPIRY DATE', 'STATUS'];
            generateDataRows(['subid', 'customername', 'address', 'mobileno', 'smartcard', 'boxid', 'productname', 'activationdate', 'expirydate', 'statusdisplay'], this.rowData);
          } else if (this.type == 3) {
            console.log('type', this.type);
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE NAME', 'ACTIVATION DATE', 'EXPIRY DATE', 'STATUS'];
            generateDataRows(['subid', 'customername', 'address', 'mobileno', 'smartcard', 'boxid', 'productname', 'activationdate', 'expirydate', 'statusdisplay'], this.rowData);
          } else if (this.type == 4) {
            console.log('type', this.type);
            areatitle = 'A1:I2';
            areasub = 'A3:I3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'STATUS'];
            generateDataRows(['subid', 'customername', 'address', 'areaname', 'mobileno', 'smartcard', 'boxid', 'statusdisplay'], this.rowData);
          } else if (this.type == 5) {
            console.log('block', this.type);
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PRODUCT NAME', 'PRODUCT ID', 'CREATION DATE', 'EXPIRY DATE'];
            generateDataRows(['subid', 'operatorname', 'customername', 'smartcard', 'boxid', 'casname', 'productname', 'productid', 'creationdate', 'expirydate'], this.rowData);
          } else if (this.type == 6 || this.type == 7) {
            areatitle = 'A1:E2';
            areasub = 'A3:E3';
            header = ['S.NO', 'SMARTCARD', 'BOX ID', 'CAS', 'ALLOCATION DATE'];
            generateDataRows(['smartcard', 'boxid', 'casname', 'connectiondate'], this.rowData);
          }
          else if (this.type == 9) {
            areatitle = 'A1:G2';
            areasub = 'A3:G3';
            header = ['S.NO', 'RETAILER NAME', 'MOBILE', 'AREA', 'RETAILER USERNAME', 'BALANCE', 'STATUS'];
            generateDataRows(['retailername', 'mobileno', 'areaname', 'username', 'balance', 'statusdisplay'], this.rowData);
          } else if (this.type == 11) {
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            header = ['S.NO', 'SUBSCRIBER NAME', 'MOBILE NUMBER', 'SMARTCARD', 'BOX ID', 'EXPIRY DATE'];
            generateDataRows(['retailername', 'mobileno', 'retailerid', 'username', 'balance'], this.rowData);
          }

          generateExcelReport(areatitle, areasub, header, datas);
        } else if (response.status === 204) {
          const title = (this.operatorname + ' - ' + this.OType + ' REPORT').toUpperCase();
          const sub = 'MSO ADDRESS:' + this.msodetails;
          const datas: any[] = [];
          let areatitle = '';
          let areasub = '';
          let header: string[] = [];

          // Handle empty data for no records
          if (this.type == 1) {
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'ACTIVATION DATE', 'EXPIRY DATE', 'PACKAGE STATUS'];
          } else if (this.type == 2) {
            console.log('type', this.type);
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE NAME', 'ACTIVATION DATE', 'EXPIRY DATE', 'STATUS'];
          } else if (this.type == 3) {
            console.log('type', this.type);
            areatitle = 'A1:I2';
            areasub = 'A3:I3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'PACKAGE NAME', 'EXPIRY DATE',];
          } else if (this.type == 4) {
            console.log('type', this.type);
            areatitle = 'A1:I2';
            areasub = 'A3:I3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'STATUS'];
          } else if (this.type == 5) {
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUBSCRIBER ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PRODUCT NAME', 'PRODUCT ID', 'CREATION DATE', 'EXPIRY DATE'];
          } else if (this.type == 6 || this.type == 7) {
            areatitle = 'A1:E2';
            areasub = 'A3:E3';
            header = ['S.NO', 'SMARTCARD', 'BOX ID', 'CAS', 'ALLOCATION DATE'];
          } else if (this.type == 9) {
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            header = ['S.NO', 'RETAILER NAME', 'MOBILE NUMBER', 'AREA', 'RETAILER USERNAME', 'BALANCE'];
          } else if (this.type == 11) {
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            header = ['S.NO', 'SUBSCRIBER NAME', 'MOBILE NUMBER', 'SMARTCARD', 'BOX ID', 'EXPIRY DATE'];
          }
          this.swal.Close();
          generateExcelReport(areatitle, areasub, header, datas);
          this.rowData = [];
        }
      }, (error) => {
        this.handleApiError(error);
      });
  }
  getPDF() {
    this.swal.Loading();
    this.userService.getOperatorDashboardPDFReport(this.role, this.username, this.type, 1, this.lcoId, 0, 0, 0)
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (this.operatorname + ' - ' + this.OType + ".pdf").toUpperCase();
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
  handleApiError(error: any) {
    if (error.status === 400) {
      this.swal.Error_400();
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }
  getreport(reportType: any) {
    this.userService.getOpLoginReportByOpid(this.role, this.username, this.lcoId, this.type, reportType).subscribe((data: any) => {
      console.log(data);
    })
  }
  getLcoInvoiceReport(reportType: number) {
    this.swal.Loading();
    this.userService.getOpLoginReportByReport(this.role, this.username, this.lcoId, this.type, reportType).
      subscribe({
        next: (x: Blob) => {
          this.swal.Close();
          if (this.type = 1){
            if (reportType == 1) {
              this.reportMaking(x, 'OPERATOR WISE GST FILE' + this.lcoId + '-' + this.type + ".pdf", 'application/pdf');
            } else if (reportType == 2) {
              this.reportMaking(x, 'OPERATOR WISE GST FILE' + this.lcoId + '-' + this.type + ".xlsx", 'application/xlsx');
            }
          }else if(this.type = 2){

          }
        },
        error: (error: any) => {
          this.swal.Close();
          this.pdfswalError(error?.error.message);
        }
      });
  }

  // -----------------------------------------------------common method for pdf and excel------------------------------------------------------------------------


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
    console.log(error);

    Swal.close();
    Swal.fire({
      title: 'Error!',
      text: error?.message || 'There was an issue generating the PDF CAS form report.',
      icon: 'error',
      confirmButtonText: 'Ok',
      timer: 2000,
      timerProgressBar: true,
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
}
