import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cas-dialogue',
  templateUrl: './cas-dialogue.component.html',
  styleUrls: ['./cas-dialogue.component.scss']
})
export class CasDialogueComponent {
  role: any;
  username: any;
  id: any;
  type: any;
  intend: any;
  message: any;
  resendMessage: any;
  constructor(private userservice: BaseService, private storageservice: StorageService, public dialogRef: MatDialogRef<CasDialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService) {
    console.log(data);
    this.type = data.type;
    this.id = data?.data.id;
    console.log(this.type);
    console.log(this.id);
    this.intend = data?.data?.intendid;
    this.message = data?.data?.scrollmsg;
    this.resendMessage = data?.data?.msgcontent;
    console.log(this.intend);
    console.log(this.message);
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onStopDialog() {
    this.swal.Loading();

    this.userservice.stopMessage(this.role, this.username, this.id,).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }

  onResendDialog() {
    this.swal.Loading();
    this.userservice.resendMessage(this.role, this.username, this.id).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  openScrollingDialog() {
    this.swal.Loading();

    this.userservice.stopScroll(this.id, this.role, this.username).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }

  resendDialog() {
    this.swal.Loading();

    this.userservice.resendMail(this.role, this.username, this.id).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
}

