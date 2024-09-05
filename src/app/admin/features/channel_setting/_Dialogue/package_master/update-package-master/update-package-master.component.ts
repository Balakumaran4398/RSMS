import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
interface updateRequestbody {
  username: any,
  role: any,
  id: any;
}
@Component({
  selector: 'app-update-package-master',
  templateUrl: './update-package-master.component.html',
  styleUrls: ['./update-package-master.component.scss']
})
export class UpdatePackageMasterComponent {
  product_id: any;
  isactive: boolean = false;
  username: any;
  role: any;
  constructor(public dialogRef: MatDialogRef<UpdatePackageMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
    this.product_id = data.cas_product_id;
    this.isactive = data._active;
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();


  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  UpdatePackagemaster() {
    let requestBody: updateRequestbody = {
      // broadcastername: broadcastername,
      username: this.username,
      role: this.role,
      // isactive: isactive,
      id: this.product_id,
    };
    console.log(requestBody); Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updateing...',
          text: 'Please wait while the Product ID is being updated',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.userService.UpdatePackagemasterList(this.username, this.role, this.product_id).subscribe(
          (res) => {
            console.log(res);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Your update was successful",
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: err?.error?.message,
              showConfirmButton: false,
              timer: 1500
            });
          }
        );
      }
    });
  }
}
