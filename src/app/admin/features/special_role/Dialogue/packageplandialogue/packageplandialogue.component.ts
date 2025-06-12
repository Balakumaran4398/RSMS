import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { month } from 'node_modules1/ag-charts-community/dist/types/src/sparklines-util';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-packageplandialogue',
  templateUrl: './packageplandialogue.component.html',
  styleUrls: ['./packageplandialogue.component.scss']
})
export class PackageplandialogueComponent implements OnInit {

  planpackage: any = 1;
  username: any;
  role: any;
  errorMessage: any;
  type: any
  id: any;
  days: any;
  isactive = false;
  days1: any;
  isactive1 = false;
  userid: any;
  accessip: any;
  constructor(public dialogRef: MatDialogRef<PackageplandialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
    console.log(data);
    this.type = data?.type;
    this.id = data.data?.id;
    this.days = data.data?.days;
    this.isactive = data.data?.isactive;
    this.days1 = data.data?.days;
    this.isactive1 = data.data?.isactive;
  }
  ngOnInit(): void {
  }

  update() {
    // this.userservice.updatePackagePlan(this.role, this.username, this.days, this.isactive, this.id).subscribe((res: any) => {
    //   this.swal.success(res?.message);
    // }, (err) => {
    //   this.swal.Error(err?.error?.message);
    // });

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to Active this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while the Package Plan is being Updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.updatePackagePlan(this.role, this.username, this.days, this.isactive, this.id).subscribe((res: any) => {
          console.log(res);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your update was successful",
            showConfirmButton: false,
            timer: 1000
          });
          this.swal.success(res?.message);
          const data = ` Days: ${this.days}, `  + ` Status: ${this.isactive},`;
          const remark = ` Days: ${this.days1}, `  + ` Status: ${this.isactive1},`;
          this.logCreate('Package Plan Update Button Clicked', remark, data);
        },
          (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: err?.error?.message,
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              window.location.reload();

            });
          }
        );
      }
    });
  }
  create() {
    this.userservice.createPackagePlan(this.role, this.username, this.planpackage)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }
  errorToggle() {
    this.errorMessage = !this.errorMessage;
  }
  clearError() {
    if (this.planpackage.trim()) {
      this.errorMessage = null;
    }
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
