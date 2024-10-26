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
  constructor(private userservice: BaseService, private storageservice: StorageService, public dialogRef: MatDialogRef<CasDialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService) {
    console.log(data);
    this.type = data.type;
    this.id = data?.data.id;
    console.log(this.type );
    console.log(this.id );
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onStopDialog() {
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Recurring is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userservice.stopMessage(this.role, this.username, this.id,).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }

  onResendDialog() {
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Recurring is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.resendMessage(this.role, this.username, this.id).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  openScrollingDialog() {
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Recurring is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userservice.stopScroll(this.id, this.role, this.username).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }

  resendDialog() {
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Recurring is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userservice.resendMail( this.role, this.username,this.id).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
}

