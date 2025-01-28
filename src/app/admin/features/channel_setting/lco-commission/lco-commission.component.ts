import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddLcoComponent } from '../_Dialogue/LCO-Commission/add-lco/add-lco.component';
import { CreateLcoComponent } from '../_Dialogue/LCO-Commission/create-lco/create-lco.component';
import { ChangeMembershipComponent } from '../_Dialogue/LCO-Commission/change-membership/change-membership.component';
import { UpdateLcoComponent } from '../_Dialogue/LCO-Commission/update-lco/update-lco.component';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { UpdateLcoCommissionComponent } from '../_Dialogue/LCO-Commission/update-lco-commission/update-lco-commission.component';
import { filter } from 'rxjs';
import { CreateLcoMembershipComponent } from '../_Dialogue/LCO-Commission/create-lco-membership/create-lco-membership.component';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { EditDismembershipComponent } from '../_Dialogue/LCO-Commission/edit-dismembership/edit-dismembership.component';

@Component({
  selector: 'app-lco-commission',
  templateUrl: './lco-commission.component.html',
  styleUrls: ['./lco-commission.component.scss']
})
export class LcoCommissionComponent {

  role: any;
  username: any;
  rowData: any;
  rowData1: any[] = [];
  // rowData2: any[] = [];
  rowData2: any;
  rowData3: any;
  NotInLcogroupId: any[] = [];
  lcomembershipid: any;
  lcomembershipname: any;
  lcomembershipList: any = '1';


  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedname: any[] = [];
  rows: any[] = [];

  filteredOperators: any[] = [];
  // selectedOperator: any;
  selectedOperator: any = {
    name: "NOT IN MEMBERSHIP",
    value: 1
  }
  selectedLcoName: any;


  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 10,
    pagination: true,
  }
  @ViewChild('agGrid') agGrid: any;
  constructor(public dialog: MatDialog, private userservice: BaseService, private storageservice: StorageService, private cdr: ChangeDetectorRef, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    userservice.getLcoGroupMasterList(this.role, this.username).subscribe((data: any) => {
      this.lcomembershipList = Object.keys(data).map(key => {
        const value = data[key];
        // const name = key;
        const name = key.replace(/\s*\(.*?\)\s*/g, '').trim();
        return { name: name, value: value };
      });
      this.lcomembershipList.sort((a: any, b: any) => {
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
        return 0;
      });
      console.log(this.lcomembershipList);
      this.lcomembershipid = this.lcomembershipList[0]?.value
      console.log(this.lcomembershipid);
      this.lcomembershipname = this.lcomembershipList[0]?.name
      console.log(this.lcomembershipname);

      console.log(this.selectedOperator.value);
      this.onOperatorChange(this.selectedOperator)
      // this.onmembershipchange(this.selectedOperator)
      this.filteredOperators = this.lcomembershipList;
    })
    this.LcoGroupDetails();
    // this.lcomembershipidNotInLcogroupId();
    this.getOperatorMembershipFUP();

  }
  selectedTab: string = 'dis_commission';

  selectTab(tab: string) {
    this.selectedTab = tab;
    if (this.agGrid) {
      let newRowData;
      if (this.selectedTab === 'dis_commission') {
        console.log('dis_commission', this.selectedOperator);
        this.onOperatorChange(this.selectedOperator);
        newRowData = this.getDisCommissionData('dis_commission');
        // this.selectedOperator = '';
      } else if (this.selectedTab === 'dis_membership') {
        console.log('dis_membership',this.selectedOperator);
        this.onMembershipchange(this.selectedOperator);
        newRowData = this.getDisMembershipData('dis_membership');
        // this.selectedOperator = '';
      } else if (this.selectedTab === 'commission') {
        console.log('commission',this.selectedOperator);
        this.onOperatorChange(this.selectedOperator);
        newRowData = this.getCommissionData('commission');
        // this.selectedOperator = '';
      } else if (this.selectedTab === 'membership') {
        console.log('membership',this.selectedOperator);
        this.onmembershipchange(this.selectedOperator);
        newRowData = this.getMembershipData('membership');
        // this.selectedOperator = '';
      }
      // this.agGrid.api.setRowData(newRowData);
    }
  }

  getDisCommissionData(event: any) {
    console.log(event);
    this.rowData = [];
    this.loadTableData(event);
    return [this.rowData];
  }
  getCommissionData(event: any) {
    console.log(event);
    this.rowData = [];
    this.loadTableData(event);
    return [this.rowData];
  }
  getDisMembershipData(event: any) {
    console.log(event);
    this.rowData = [];
    this.rowData2 = [];
    this.loadTableData(event);
    return [this.rowData];
  }
  getMembershipData(event: any) {
    console.log(event);
    this.rowData2 = [];
    this.rowData = [];
    this.loadTableData(event);
    return [this.rowData];
  }



  public rowSelection: any = "multiple";
 
  discolumnnDefs: any[] = [];
  domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';



  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    this.loadTableData("");
    this.LcoGroupDetails();
  }


  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
      this.selectedIds = selectedRows.map((row: any) => row.operatorid); // Adjust 'id' to match your data structure
      this.selectedname = selectedRows.map((row: any) => row.operatorname); // Adjust 'name' to match your data structure
    }
  }

  filterOperators(event: any): void {
    console.log(event);

    // const filterValue = event.target.value.toLowerCase();
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lcomembershipList.filter((operator: any) =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    console.log(this.selectedLcoName);
  }

  loadTableData(selectedTab: any) {
    console.log(`Selected Tab: ${selectedTab}`);
    if (this.selectedTab === 'dis_commission') {
      this.discolumnnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 200, cellStyle: { textAlign: 'left' }, },
        { headerName: "PRODUCT ID", field: 'productid', width: 130 },
        { headerName: "PRODUCT TYPE", field: 'producttype', width: 140 },
        {
          headerName: "CUSTOMER AMOUNT", field: 'customeramount', width: 150, cellRenderer: (params: any) => `<span style="color: #035203;
          font-weight: bold;;">₹</span> ${params.value}`
        },
        { headerName: "LCO COMMISSION", field: 'commissionvalue', width: 150 },
        {
          headerName: "MSO AMOUNT", field: 'msoamount', width: 140, cellRenderer: (params: any) => `<span style="color: #035203;
          font-weight: bold;;">₹</span> ${params.value}`
        },
        {
          headerName: "SUB MSO AMOUNT", field: 'submsoamount', width: 180, cellRenderer: (params: any) => `<span style="color: #035203;
          font-weight: bold;;">₹</span> ${params.value}`
        },
        { headerName: "COMMISSION", field: 'commissionvalue', width: 170 },
        {
          headerName: "EDIT", field: '', width: 100,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
            editButton.style.backgroundColor = 'transparent';
            // editButton.style.color = 'rgb(2 85 13)';
            editButton.style.color = '(rgb(29 1 11)';
            editButton.style.border = 'none';
            editButton.title = 'Update Commission';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.addEventListener('click', () => {
              this.openEditDialog('dis_commission', params.data);
            });

            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
      ]
    } else if (this.selectedTab === 'dis_membership') {
      this.discolumnnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
        },
        { headerName: "DISTRIBUTOR NAME	", field: 'operatorname', width: 250, cellStyle: { textAlign: 'left' }, },
        { headerName: "USERNAME", field: 'userid', width: 150 },
        { headerName: "PASSWORD", field: 'password', width: 150 },
        { headerName: "BALANCE", field: 'balance', width: 150 },
        {
          headerName: "EDIT", field: '', width: 100,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
            editButton.style.backgroundColor = 'transparent';
            // editButton.style.color = 'rgb(2 85 13)';
            editButton.style.color = '(rgb(29 1 11)';
            editButton.style.border = 'none';
            editButton.title = 'Edit Status';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.addEventListener('click', () => {
              this.openEditDismembershipDialog(params.data);
            });

            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
        { headerName: "CREATED DATE", field: 'createddate', width: 220 },
      ]
    } else if (this.selectedTab === 'commission') {
      this.discolumnnDefs = [
        {
          headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
        },
        { headerName: "PRODUCT NAME", field: 'productname', width: 250, cellStyle: { textAlign: 'left' }, },
        { headerName: "PRODUCT ID", field: 'productid', width: 150 },
        { headerName: "PRODUCT TYPE", field: 'productTypeDisplay', width: 150 },
        // {
        //   headerName: "PRODUCT RATE", field: 'rate', width: 150, cellRenderer: (params: any) => `<span style="color: #035203;
        //   font-weight: bold;;">₹</span> ${params.value}`
        // },
        {
          headerName: "EDIT", field: '', width: 100,
          cellRenderer: (params: any) => {
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
            editButton.style.backgroundColor = 'transparent';
            // editButton.style.color = 'rgb(2 85 13)';
            editButton.style.color = '(rgb(29 1 11)';
            editButton.style.border = 'none';
            editButton.title = 'Edit the Customer';
            editButton.style.cursor = 'pointer';
            editButton.style.marginRight = '6px';
            editButton.addEventListener('click', () => {
              this.openEditDialog('commission', params.data);
            });

            const div = document.createElement('div');
            div.appendChild(editButton);
            return div;
          }
        },
        {
          headerName: "CUSTOMER AMOUNT", field: 'customeramount', width: 180,
          cellRenderer: (params: any) => `<span style="color: #035203;
          font-weight: bold;;">₹</span> ${params.value}`
        },
        {
          headerName: "MSO AMOUNT", field: 'msoamount', width: 150,
          cellRenderer: (params: any) => `<span style="color: #035203;font-weight: bold;;">₹</span> ${params.value}`
        },
        { headerName: "COMMISSION", field: 'commissionvalue', width: 160 },
        {
          headerName: "	IS PERCENTAGE", field: 'ispercentage', width: 150,
          cellRenderer: (params: any) => {
            if (params.value === true) {
              return `<span style="color: green;">YES</span>`;
            } else {
              return `<span style="color: red;">NO</span>`;
            }
          },
        },
      ]
    }
  }
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
    },
    { headerName: "PRODUCT NAME", field: 'productname', width: 200 },
    { headerName: "PRODUCT ID", field: 'productid', width: 150 },
    { headerName: "PRODUCT TYPE", field: 'productTypeDisplay', width: 150 },
    {
      headerName: "PRODUCT RATE", field: 'rate', width: 150, cellRenderer: (params: any) => `<span style="color: #035203;
      font-weight: bold;;">₹</span> ${params.value}`
    },
    {
      headerName: "EDIT", field: '', width: 100,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-pen-square" style="font-size:30px"></i>';
        editButton.style.backgroundColor = 'transparent';
        // editButton.style.color = 'rgb(2 85 13)';
        editButton.style.color = '(rgb(29 1 11)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.addEventListener('click', () => {
          // this.openEditDialog(params.data);
        });

        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    {
      headerName: "CUSTOMER AMOUNT", field: 'customeramount', width: 220, cellRenderer: (params: any) => `<span style="color: #035203;
      font-weight: bold;;">₹</span> ${params.value}`
    },
    {
      headerName: "MSO AMOUNT", field: 'msoamount', width: 180, cellRenderer: (params: any) => `<span style="color: #035203;
      font-weight: bold;">₹</span> ${params.value}`
    },
    { headerName: "COMMISSION", field: 'commissionvalue', width: 180 },
    {
      headerName: "	IS PERCENTAGE", field: 'ispercentage', width: 150,
      cellRenderer: (params: any) => {
        if (params.value === true) {
          return `<span style="color: green;">YES</span>`;
        } else {
          return `<span style="color: red;">NO</span>`;
        }
      },
    },

  ]

  columnDefs1: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
    },
    {
      headerName: "GROUP NAME",
      field: 'groupName',
      width: 200,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "CREATED DATE",
      field: 'createdDate',
      width: 250,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "STATUS",
      field: 'isactiveDisplay',
      width: 200,
      filter: true,
      floatingFilter: true,
      cellRenderer: (params: any) => {
        if (params.value === 'Active') {
          return `<span style="color: green;">ACTIVE</span>`;
        } else {
          return `<span style="color: red;">DEACTIVE</span>`;
        }
      }
    }
  ];

  columnDefs2: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: "OPERATOR NAME", field: 'operatorname', width: 270, cellStyle: { textAlign: 'left' },},
    { headerName: "OPERATOR ID", field: 'operatorid', width: 220, },
    { headerName: "JOINING DATE", field: 'lcogroupupdateddate', width: 250, filter: true, },
  ];
  columnDefs3: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
    },
    { headerName: "OPERATOR NAME", field: 'operatorname', width: 200,cellStyle: { textAlign: 'left' }, },
    {
      headerName: 'Actions', minWidth: 140,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-pen" style="font-size:20px"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(37 144 147)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "22px";
        editButton.addEventListener('click', () => {
          this.EditmembershipDialog(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    { headerName: "OPERATOR ID", field: 'operatorid', width: 250 },
    { headerName: "SHARE USED	", field: 'sharecount', width: 200 },
    { headerName: "MEMBERSHIP NAME", field: 'groupname', width: 250 },
    { headerName: "CREATED DATE", field: 'createddate', width: 200 },
    { headerName: "UPDATED DATE", field: 'updateddate', width: 200 },


  ]
  onOperatorChange(selectedOperator: any) {
    // console.log('this.selectedTab', selectedOperator);
    // this.selectedOperator = selectedOperator;
    // // this.lcomembershipid = selectedOperator.value;
    // this.selectedOperator = selectedOperator.name;
    // console.log(this.selectedOperator);
    // console.log(this.lcomembershipid);


    // if (this.lcomembershipid === 1) {
    //   this.lcomembershipid = 1;
    // }

    console.log(selectedOperator);
    console.log(this.lcomembershipid);

    this.selectedOperator = selectedOperator;
    this.lcomembershipid = selectedOperator.value;
    console.log(this.lcomembershipid);
    // this.selectedLcoName = selectedOperator.name;
    // this.lcomembershipname= selectedOperator.name;
    if (this.selectedTab === 'dis_commission') {

      this.rowData = [];
      // this.userservice.getDistributorMembershipDetailsByLcogroupid(this.role, this.username, this.lcomembershipid)
      this.userservice.getDistributorCommissionListByLcoGroupId(this.role, this.username, this.lcomembershipid).subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData = response.body;
            // this.lcomembershipid = '';
            // this.selectedOperator = '';
          } else if (response.status === 204) {
            // this.swal.Success_204();
          }
        },
        (error) => this.handleError(error)
      );
      console.log(this.selectedOperator);

      // this.selectedOperator = '';
    } else if (this.selectedTab === 'commission') {
      if (this.lcomembershipid === '0') {
        this.lcomembershipid = 0;
      }
      this.rowData = [];
      this.userservice.getLcoCommissionListByLcoGroupId(this.role, this.username, this.lcomembershipid)
        .subscribe(
          (response: HttpResponse<any[]>) => {
            if (response.status === 200) {
              this.rowData = response.body;
            } else if (response.status === 204) {
              // this.swal.Success_204();
            }
          },
          (error) => this.handleError(error)
        );
    }

  }
  handleError(error: any) {
    if (error.status === 400) {
      this.swal.Error_400();
    } else if (error.status === 500) {
      this.swal.Error_500();
    } else {
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }
  onmembershipchange(selectedOperator: any) {
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.name;
    this.lcomembershipid = selectedOperator.value;
    // this.userservice.getOperatorlistByGroupId(this.role, this.username, this.lcomembershipid).subscribe(
    this.userservice.getOperatorlistByGroupId(this.role, this.username, this.lcomembershipid).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData2 = response.body;
          // this.swal.Success_200();
          // this.lcomembershipid='';
        } else if (response.status === 204) {
          // this.swal.Success_204();
          this.rowData2 = [];
        }
      },
      (error) => {
        if (error.status === 400) {
          this.swal.Error_400();
        } else if (error.status === 500) {
          this.swal.Error_500();
        } else {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      });
  }
  onMembershipchange(selectedOperator: any) {
    // console.log(selectedOperator);

    // this.selectedOperator = selectedOperator;
    // this.selectedLcoName = selectedOperator.name;
    // this.selectedOperator = selectedOperator;
    // this.lcomembershipid = selectedOperator.value

    console.log(selectedOperator);

    this.selectedOperator = selectedOperator;
    this.lcomembershipid = selectedOperator.value
    // this.userservice.getDistributorMembershipDetailsByLcogroupid(this.role, this.username, selectedOperator.value).subscribe(
    this.userservice.getDistributorMembershipDetailsByLcogroupid(this.role, this.username, this.lcomembershipid).subscribe(
      // this.userservice.getOperatorlistByGroupId(this.role, this.username, this.lcomembershipid).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          this.rowData2 = response.body;
          console.log(response);
          // this.swal.Success_200();
          // this.lcomembershipid='';
        } else if (response.status === 204) {
          // this.swal.Success_204();
          this.rowData2 = [];
        }
      },
      (error) => {
        if (error.status === 400) {
          this.swal.Error_400();
        } else if (error.status === 500) {
          this.swal.Error_500();
        } else {
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
      });
  }
  LcoGroupDetails() {
    if (this.selectedTab == 'membership') {
      this.userservice.getLcoGroupDetails(this.role, this.username).subscribe((data: any) => {
        this.rowData1 = data;
      })
    } else if (this.selectedTab == 'dis_membership') {
      this.userservice.GetDistributorGroupDetails(this.role, this.username).subscribe((data: any) => {
        this.rowData1 = data;
      })
    }

  }
  // lcomembershipidNotInLcogroupId() {
  //   this.userservice.LcoGroupMasterListNotInLcogroupId(this.role, this.username).subscribe((data: any) => {
  //     this.NotInLcogroupId = data;

  //   })
  // }
  getOperatorMembershipFUP() {
    this.userservice.getOperatorMembershipFUP(this.role, this.username)
      // .subscribe((data: any) => {
      //   this.rowData3 = data;
      // })
      .subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.rowData3 = response.body;
            // this.swal.Success_200();
            // this.lcomembershipid='';
          } else if (response.status === 204) {
            // this.swal.Success_204();
            this.rowData3 = [];
          }
        },
        (error) => {
          if (error.status === 400) {
            this.swal.Error_400();
          } else if (error.status === 500) {
            this.swal.Error_500();
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }
        });
  }


  add(type: any,) {
    let width = '500px';
    if (type === 'dis_commission') {
      width = '500px';
    } else if (type === 'commission') {
      width = '500px';
    }
    let dialogData = { type: type };
    console.log(dialogData);

    const dialogRef = this.dialog.open(AddLcoComponent, {
      width: '1800px',
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });
  }
  create() {
    const dialogRef = this.dialog.open(CreateLcoMembershipComponent, {
      width: '500px',
      // height: '800px',

      panelClass: 'custom-dialog-container',

    });
  }
  openEditDismembershipDialog(data: any) {
    const dialogRef = this.dialog.open(EditDismembershipComponent, {
      width: '800px',
      // height: '1000px',
      panelClass: 'custom-dialog-container',
      data: data
    });
  }
  openEditDialog(type: any, data: any): void {
    let width = '500px';
    if (type === 'dis_commission') {
      width = '500px';
    } else if (type === 'commission') {
      width = '500px';
    }

    let dialogData = { type: type, data: data, };
    console.log(dialogData);
    const dialogRef = this.dialog.open(UpdateLcoCommissionComponent, {
      width: '400px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  EditmembershipDialog(data: any): void {
    const dialogRef = this.dialog.open(UpdateLcoComponent, {
      width: '450px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + data);
    });
  }
  change_membership(type: any) {
    let width = '500px';
    if (type === 'dis_membership') {
      width = '500px';
    } else if (type === 'membership') {
      width = '500px';
    }
    let data = { type: type, row: this.rows };
    console.log(data);
    const dialogRef = this.dialog.open(ChangeMembershipComponent, {
      width: '1200px',
      data: data,
      panelClass: 'custom-dialog-container',
    });
  }
  // change_membership() {
  //   const dialogRef = this.dialog.open(ChangeMembershipComponent, {
  //     width: '1200px',
  //     data: this.rows,
  //     panelClass: 'custom-dialog-container',
  //   });
  // }

  Create_LCO(type: any) {
    let width = '500px';
    if (type === 'dis_membership') {
      width = '500px';
    } else if (type === 'membership') {
      width = '500px';
    }

    let dialogData = { type: type, };
    console.log(dialogData);
    const dialogRef = this.dialog.open(CreateLcoComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
