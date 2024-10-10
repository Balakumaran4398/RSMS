import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-lco',
  templateUrl: './create-lco.component.html',
  styleUrls: ['./create-lco.component.scss']
})
export class CreateLcoComponent {
  role: any;
  username: any;
  lcogroupname: any;

  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<CreateLcoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: BaseService,
    private storageservice: StorageService
  ) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  Create() {
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we create the LCO Membership.',
      allowOutsideClick: false,
      // didOpen: () => {
      //   Swal.showLoading();
      // }
    });

    this.userservice.createLcoGroup(this.role, this.username, this.lcogroupname).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res?.message || 'LCO Membership has been successfully created.'
        }).then(() => {
          // this.refreshTable.emit();
          window.location.reload();
          this.dialogRef.close();
        });
        console.log(res);
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: error?.error.message || 'Something went wrong while creating the LCO Membership.'
        });
      }
    );
  }
}
