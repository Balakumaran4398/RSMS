import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-lco-business',
  templateUrl: './add-lco-business.component.html',
  styleUrls: ['./add-lco-business.component.scss']
})
export class AddLcoBusinessComponent {
  edit_dialog: boolean = false;
  username: any;
  id: any;
  role: any;
  type: number = 0;
  businessname: string = '';
  constructor(public dialogRef: MatDialogRef<AddLcoBusinessComponent>, public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();

  }
  toggleedit() {
    this.dialogRef.close();
  }
  submit() {
    this.userService.NewLCObusiness(this.businessname, this.role, this.username).subscribe((res: any) => {
        console.log(res);
        Swal.fire({
          title: 'Success!',
          text: res?.message || 'LCO BusinessName created successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
