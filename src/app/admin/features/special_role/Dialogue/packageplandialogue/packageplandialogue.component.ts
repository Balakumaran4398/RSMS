import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { month } from 'node_modules1/ag-charts-community/dist/types/src/sparklines-util';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-packageplandialogue',
  templateUrl: './packageplandialogue.component.html',
  styleUrls: ['./packageplandialogue.component.scss']
})
export class PackageplandialogueComponent implements OnInit {

  planpackage: any = 1;
  isactive = false;
  username: any;
  role: any;
  errorMessage: any;
  type: any
  days: any;
  id: any;
  constructor(public dialogRef: MatDialogRef<PackageplandialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(data);
    this.type = data?.type;
    this.id = data.data?.id;
    this.days = data.data?.days;
    this.isactive = data.data?.isactive;
  }
  ngOnInit(): void {
  }

  update() {
    this.userservice.updatePackagePlan(this.role, this.username, this.days, this.isactive, this.id).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
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
}
