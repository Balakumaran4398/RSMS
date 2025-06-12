import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-defective-inventory',
  templateUrl: './defective-inventory.component.html',
  styleUrls: ['./defective-inventory.component.scss']
})
export class DefectiveInventoryComponent {
  remarks: any;
  username: any;
  role: any;
  id: any;
  selectedIds: any[];
  userid: any;
  accessip: any;
  constructor(
    public dialogRef: MatDialogRef<DefectiveInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
    console.log(this.id);
    this.selectedIds = data.selectedIds;
    console.log(this.selectedIds);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  submit() {
    if (!this.remarks || this.remarks.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Remarks cannot be empty. Please provide a remark.',
        confirmButtonText: 'OK'
      });
      return;
    }
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we process your request.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userService.Defective_remark_Allocated(this.selectedIds, this.remarks, this.role, this.username)
      .subscribe(
        (data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data?.message || 'The defective remark has been allocated successfully.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.error?.message || 'There was an error allocating the defective remark. Please try again.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
      );
    const data = ` Remarks: ${this.remarks},`;
    const remark = ` Remarks: ${this.remarks},`;
    this.logCreate('Defective Button Clicked', remark, data);

  }
  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userService.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }

}
