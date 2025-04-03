import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { InventorycortonboxComponent } from '../../../inventory_role/Dialogue/inventorycortonbox/inventorycortonbox.component';

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
  public rowSelection: any = "multiple";
  rowData1: any;
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
  msodetails: any;
  operatorname: any;
  gridApi: any;
  OType: any;
  operatorid: any;

  path: any;

  lcoDeatails: any;
  lcoId: any;


  toppings: any;
  filteredModel: any[] = [];
  cortonBoxList: any[] = [];
  toppingList: any[] = [];
  cortonBox: any[] = [];
  model: any;

  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  rows: any[] = [];
  selectedSmartcard: number[] = [];
  isemi: any;
  hasSelectedRows: boolean = true;
  isRowSelected: boolean = false;

  constructor(private route: ActivatedRoute, private location: Location, public dialog: MatDialog, private userService: BaseService, private router: Router, private storageServive: StorageService, private excelService: ExcelService, private swal: SwalService,) {
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

    if (this.type == '6') {
      this.getModelList();
      this.getNotAllocattedDetails();
    }

  }

  ngAfterViewInit() {
    $('#model').select2({
      placeholder: 'Select Model',
      allowClear: true
    });
    $('#model').on('change', (event: any) => {
      this.model = event.target.value;
      this.onModelList(this.model);
    });
  }
  onModelList(event: any) {
    console.log(event);
    this.userService.getCortonBoxList(this.role, this.username, this.model).subscribe((data: any) => {
      console.log(data);
      this.cortonBoxList = data.map((item: any) => item.cartonbox);
      // this.cortonBoxList=[...this.toppingList]
    })
  }
  onCortonBoxChange(selectedValues: any[]) {
    console.log("Selected Values: ", selectedValues);
    this.cortonBox = selectedValues;
    console.log(this.cortonBox);


  }
  getNotAllocattedDetails() {
    this.userService.getAllCartonBoxList(this.username, this.role).subscribe((data: any) => {
      // this.cortonBoxList = data;
      this.rowData = data;
      console.log(this.filteredModel);

    })
  }
  submit() {
    this.rowData = [];
    this.userService.getCortonBoxDetails(this.role, this.username, this.model, this.cortonBox)
      .subscribe((data: any) => {
        this.rowData = data;
        console.log(data);
        // this.swal.success(data?.message);
      }, (err) => {
        this.swal.Error3(err?.error?.message || err?.error);
      });
  }
  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedSmartcard = selectedRows.map((e: any) => e.smartcard);
      this.isemi = selectedRows.map((e: any) => e.isemi);
      console.log("Selected Smartcard:", this.selectedSmartcard);
    }
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
      // this.onTableData();
      this.getreport(this.lcoId);
      // } else if (this.type = 4) {
      //   this.onTableData();
      // }
    })
  }
  getModelList() {
    this.userService.getModelList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.filteredModel = data;
    })
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  getHeader(): string {
    switch (this.type) {
      case '2': return 'NOT EXPIRED SMARTCARD';
      case '3': return 'EXPIRED SMARTCARD';
      case '4': return 'FIRST TIME ACTIVATION';
      case '5': return 'BLOCK SUBSCRIBER';
      case '6': return 'INVENTORY';
      case '1': return 'TOTAL CONNECTION';
      // case '7': return 'TOTAL SUBSCRIBER';
      case '11': return 'ACTIVE SUBSCRIBER';
      case '12': return 'DEACTIVE SUBSCRIBER';
      default: return 'UNKNOWN TYPE';
    }
  }
  setType(OType: string) {

    switch (OType) {
      case '1':
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

  getreport(lco: any) {
    console.log(lco)
    console.log(this.lcoId)
    // this.userService.getOpLoginReportByOpid(this.role, this.username, this.lcoId, this.type, 3).subscribe((data: any) => {
    //   console.log(data);
    //   this.rowData = data;
    // })

    this.userService.getOperatorDashboardExcelReport(this.role, this.username, this.type, 2, this.lcoId, 0, 0, 0)
      .subscribe((response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData = response.body;
        } else if (response.status === 204) { }
      }
      )
  };

  private onColumnDefs() {
    if (this.type == 6) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false, headerCheckboxSelection: true, checkboxSelection: true, },
        { headerName: 'SMARTCARD', field: 'smartcard', width: 400, },
        { headerName: 'BOX ID	', field: 'boxid',  cellStyle: { textAlign: 'center', color: 'green' }, width: 300, },
        { headerName: 'CORTON BOX', field: 'cottonbox', width: 300, },
        { headerName: 'MODEL', field: 'model', width: 200, },
        { headerName: 'CHIP ID', field: 'chipid', width: 300, },
      ]
    } else if (this.type == 1) {
    // } else if (this.type == 7) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        { headerName: 'SMARTCARD', field: 'smartcard',  width: 400, },
        { headerName: 'BOX ID	', field: 'boxid',  cellStyle: { textAlign: 'center', color: 'green' }, width: 400, },
        { headerName: 'CAS NAME', field: 'casname', width: 300, },
        { headerName: 'ALLOCATION DATE	', field: 'activationdate', width: 400, },
      ]
    }
    else if (this.type == 2) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 220, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
          cellStyle: (params: any) => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: none;color:#0d6efd">
                      ${params.value}
                    </a>`;
          },

          onCellClicked: (params: any) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`])
                .then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                });
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`])
                .then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                });
            }
          }
        },
        { headerName: 'SUBSCRIBER ID', field: 'subid',  width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername',  cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS ', field: 'address',  cellStyle: { textAlign: 'center', color: 'green' }, width: 150, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 150, },
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
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 230, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
          cellStyle: (params: any) => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: none;color:#0d6efd">
                      ${params.value}
                    </a>`;
          },

          onCellClicked: (params: any) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`])
                .then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                });
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`])
                .then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                });
            }
          }
        },
        { headerName: 'SUBSCRIBER ID', field: 'subid',  width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername',  cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS', field: 'address', width: 150, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 150, },
        { headerName: 'BOX ID', field: 'boxid', width: 180, },
        { headerName: 'PACKAGE NAME', field: 'productname', width: 230, },
        { headerName: 'ACTIVATION DATE', field: 'activationdate', width: 200, },
        { headerName: 'EXPIRY DATE', field: 'expirydate', width: 200, },
        { headerName: 'STATUS', field: 'statusdisplay', width: 150, },
      ]

    } else if (this.type == 4) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 220, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
          cellStyle: (params: any) => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: none;color:#0d6efd">
                      ${params.value}
                    </a>`;
          },

          onCellClicked: (params: any) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`])
                .then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                });
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`])
                .then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                });
            }
          }
        },
        { headerName: 'SUBSCRIBER ID', field: 'subid',  width: 150, },
        { headerName: 'SUBSCRIBER NAME', field: 'customername',  cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'ADDRESS	', field: 'address', width: 150, },
        { headerName: 'AREA NAME', field: 'areaname', width: 200, },
        { headerName: 'MOBILE NO', field: 'mobileno', width: 200, },
        { headerName: 'BOX ID', field: 'boxid', width: 180, },
        { headerName: 'STATUS', field: 'statusdisplay', width: 200, },
      ]
    } else if (this.type == 5) {
      this.columnDefs = [
        { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 90, filter: false },
        // { headerName: 'SMARTCARD', field: 'smartcard', width: 200, },
        {
          headerName: 'SMARTCARD', field: 'smartcard', width: 220,
          cellStyle: (params: any) => {
            if (params.data.someCondition) {
              return { backgroundColor: '#f4cccc' };
            } else {
              return null;
            }
          },
          cellRenderer: (params: any) => {
            return `<a href="javascript:void(0)" style="color: blue; text-decoration: none;color:#0d6efd">
                      ${params.value}
                    </a>`;
          },

          onCellClicked: (params: any) => {
            const subid = params.data.id;
            const smartcard = params.data.smartcard;
            console.log('Sub ID:', subid);
            console.log('Smartcard:', smartcard);
            if (smartcard) {
              this.router.navigate([`/admin/subscriber-full-info/${smartcard}/subsmartcard`])
                .then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                });
            } else if (subid) {
              this.router.navigate([`/admin/subscriber-full-info/${subid}/new`])
                .then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                });
            }
          }
        },
        { headerName: 'SUBSCRIBER ID', field: 'subid',  width: 150, },
        { headerName: 'OPERATOR NAME', field: 'operatorname',  cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
        { headerName: 'CUSTOMER NAME ', field: 'customername',  cellStyle: { textAlign: 'center', color: 'green' }, width: 200, },
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
            areatitle = 'A1:J2';
            areasub = 'A3:J3';
            header = ['S.NO', 'SUBSCRIBER ID', 'SUBSCRIBER NAME', 'ADDRESS', 'AREA NAME', 'MOBILE NO', 'SMARTCARD', 'BOXID', 'CORTONBOX','STATUS'];
            generateDataRows(['subid', 'customername', 'address', 'areaname', 'mobileno', 'smartcard', 'boxid','cottonbox', 'statusdisplay'], this.rowData);
          } else if (this.type == 5) {
            console.log('block', this.type);
            areatitle = 'A1:K2';
            areasub = 'A3:K3';
            header = ['S.NO', 'SUB ID', 'OPERATOR NAME', 'CUSTOMER NAME', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'PRODUCT NAME', 'PRODUCT ID', 'CREATION DATE', 'EXPIRY DATE'];
            generateDataRows(['subid', 'operatorname', 'customername', 'smartcard', 'boxid', 'casname', 'productname', 'productid', 'creationdate', 'expirydate'], this.rowData);
          } else if (this.type == 7) {
            areatitle = 'A1:E2';
            areasub = 'A3:E3';
            header = ['S.NO', 'SMARTCARD', 'BOX ID', 'CAS NAME', 'ALLOCATION DATE'];
            generateDataRows(['smartcard', 'boxid', 'casname', 'connectiondate'], this.rowData);
          } else if (this.type == 6) {
            areatitle = 'A1:F2';
            areasub = 'A3:F3';
            header = ['S.NO', 'SMARTCARD', 'BOX ID', 'CORTON BOX', 'MODEL', 'CHIP ID'];
            generateDataRows(['smartcard', 'boxid', 'cottonbox', 'model', 'chipid'], this.rowData);
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
          } else if (this.type == 6) {
            areatitle = 'A1:FC2';
            areasub = 'A3:F3';
            header = ['S.NO', 'SMARTCARD', 'BOX ID', 'CORTON BOX', 'MODEL', 'CHIP ID'];
          }
          else if (this.type == 7) {
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

  getLcoInvoiceReport(reportType: number) {
    console.log(this.type);
    this.swal.Loading();
    // this.userService.getOpLoginReportByReport(this.role, this.username, this.lcoId, this.type, reportType).
    // this.userService.getOperatorDashboardPDFReport(this.role, this.username, this.lcoId, this.type, 0, 0, 0, reportType).
    this.userService.getOperatorDashboardPDFReport(this.role, this.username, this.type, reportType, this.lcoId, 0, 0, 0,).
      subscribe({
        next: (x: Blob) => {
          this.swal.Close();
          const reportName = this.getHeader();
          if (reportType === 1) {
            this.reportMaking(x, `${this.operatorname}_${reportName}_${this.lcoId}.pdf`, 'application/pdf');
          } else if (reportType === 2) {
            this.reportMaking(x, `${this.operatorname}_${reportName}_${this.lcoId}.xlsx`, 'application/xlsx');
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

  openDialoguePage(type: any) {
    let dialogData = {
      type: type,
      smartcard: this.selectedSmartcard, isemi: this.isemi,
    };
    console.log(dialogData);
    const dialogRef = this.dialog.open(InventorycortonboxComponent, {
      data: dialogData,
      width: type === 'lco_inventory' ? '720px' : 'auto',
      maxWidth: type === ' lco_inventory' ? '100vw' : 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
