import { AfterViewInit, Component, DestroyRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-membership',
  templateUrl: './change-membership.component.html',
  styleUrls: ['./change-membership.component.scss']
})
export class ChangeMembershipComponent implements OnInit, AfterViewInit, OnDestroy {
  lcoForm !: FormGroup<any>;
  role: any;
  username: any;
  operatorid: any;
  lcogroupid: any;
  usedcount: any;
  sharecount: any;
  lcomembershipid: any = 0;
  lcomembershipName: any ;
  lcomembershipList: any[] = [];
  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  count: any;
  rowData: any[] = [];
  type: any;
  userid: any;
  accessip: any;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeMembershipComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService, private swal: SwalService,
    private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
    console.log(data);
    this.rowData = data?.row;
    this.type = data.type;
    this.operatorid = data?.row.map((item: any) => item.operatorid);
    this.lcogroupid = data?.row[0].lcogroupid;
    console.log(this.operatorid);
    this.membershiplist();
  }
  ngOnDestroy(): void {
    ($('#membership') as any).select2('destroy');
  }
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    ($('#membership') as any).select2({
      placeholder: 'Select Membership',
      allowClear: true
    });
    $('#membership').on('change', (event: any) => {
      this.lcomembershipid = event.target.value;
      this.lcomembershipName = event.target.name;
      console.log(this.lcomembershipid);
      console.log('lcomembershipName',this.lcomembershipName);

      // this.onoperatorchange(this.lcomembershipid);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true
    },
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100 },
    {
      headerName: "OPERATOR",
      valueGetter: params => `${params.data.operatorname} (${params.data.operatorid})`,
      width: 400
    },
  ]
  membershiplist() {
    this.userservice.getLcoGroupMasterListNotInLcogroupId(this.role, this.username, this.lcogroupid).subscribe(
      (data: any) => {
        console.log(data);
        this.lcomembershipList = Object.keys(data).map(key => {
          const value = data[key];
          const name = key;
          return { name: name, value: value };
        });
      })
  }
  change() {
    let requestBody = {
      role: this.role,
      username: this.username,
      lcogroupid: this.lcomembershipid,
      lcomembershiplist: []
    } as any;
    requestBody.lcomembershiplist = this.rowData.map(item => ({
      operatorname: item.operatorname,
      operatorid: item.operatorid,
      lcogroupupdateddate: item.lcogroupupdateddate,
      lcogroupid: item.lcogroupid,
    }));
    console.log(requestBody);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to apply these changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, apply changes!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Processing...',
          text: 'Please wait while we Change the LCO Membership.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.updateLcoMembership(requestBody)
          .subscribe((res: any) => {
            this.swal.success(res?.message);
          }, (err) => {
            this.swal.Error(err?.error?.message);
          });
        // const data = ` Smartcard: ${this.Smartcard}, ` + ` BoxID: ${this.Boxid},`;
        const data = `Membership: ${this.lcomembershipName}`;
        this.logCreate('LCO Membership change Button Clicked', 'Change', data);
      }
    });
  }
  changeMembership() {
    let requestBody = {
      role: this.role,
      username: this.username,
      lcogroupid: this.lcomembershipid,
      lcomembershiplist: []
    } as any;
    requestBody.lcomembershiplist = this.rowData.map(item => ({
      operatorname: item.operatorname,
      operatorid: item.operatorid,
      lcogroupupdateddate: item.lcogroupupdateddate,
      lcogroupid: item.lcogroupid,
    }));
    console.log(requestBody);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to apply these changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, apply changes!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Processing...',
          text: 'Please wait while we Change the LCO Membership.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.updateDistributorMembership(requestBody)
          .subscribe((res: any) => {
            this.swal.success(res?.message);
          }, (err) => {
            this.swal.Error(err?.error?.message);
          });
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
    this.userservice.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }

}
