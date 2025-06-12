import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-replace-inventory',
  templateUrl: './replace-inventory.component.html',
  styleUrls: ['./replace-inventory.component.scss']
})
export class ReplaceInventoryComponent {
  smartcard: any;
  boxid: any;
  id: any;
  role: any;
  username: any;
  Smartcard_1: any;
  Boxid_1: any;
  userid: any;
  accessip: any;
  constructor(
    public dialogRef: MatDialogRef<ReplaceInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    this.id = data.id;
    this.smartcard = data.smartcard;
    this.boxid = data.boxid;
    this.Smartcard_1 = data.smartcard;
    this.Boxid_1 = data.boxid;
    console.log(this.Smartcard_1);
    console.log(this.Boxid_1);


    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  Replace(): void {
    this.userService.Defective_Replace_Allocated(this.role, this.username, this.id, this.smartcard, this.boxid).subscribe(
      (data: any) => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Replacement Successful',
          text: data?.message || 'The smartcard and box ID have been successfully replaced.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.dialogRef.close();
        });
      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Replacement Failed',
          text: error?.error?.message || 'There was an error processing the replacement. Please try again.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    );
    const data = ` Smartcard: ${this.smartcard}, ` + ` BoxID: ${this.boxid},`;
    const remarks = ` Smartcard: ${this.Smartcard_1}, ` + ` BoxID: ${this.Boxid_1},`;
    this.logCreate('Replacement Button Clicked', remarks, data);

  }
  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
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
    this.userService.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
}
