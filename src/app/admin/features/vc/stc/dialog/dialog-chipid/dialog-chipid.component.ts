import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-dialog-chipid',
  templateUrl: './dialog-chipid.component.html',
  styleUrls: ['./dialog-chipid.component.scss']
})
export class DialogChipidComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  username: any;
  role: any;
  modelName: any;
  modelNo: any;
  mrp: any;

  type: any;
  modelDetails: any;
  md_modelName: any;
  md_modelno: any;
  md_mrp: any;
  md_id: any;
  md_status: boolean = false;
  constructor(public dialogRef: MatDialogRef<DialogChipidComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageServce: StorageService, private swal: SwalService) {
    this.role = storageServce.getUserRole();
    this.username = storageServce.getUsername();
    console.log(data);
    this.type = data.type;
    this.md_modelName = data?.data?.model;
    this.md_modelno = data?.data?.modelno;
    this.md_mrp = data?.data?.mrp;
    this.md_status = data?.data?.isactive;
    this.md_id = data?.data?.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  Submit() {
    this.userService.getCreateModel(this.role, this.username, this.modelName, this.modelNo, this.mrp)
      .subscribe((res: any) => {
        console.log(res);
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  getUpdateModel(){
    this.userService.getUpdateModel(this.role,this.username,this.md_modelName,this.md_modelno,this.md_status,this.md_id)
    .subscribe((res: any) => {
      console.log(res);
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
}
