import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
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
export class UpdatePackageMasterComponent implements OnInit {
  product_id: any;
  ispercentage: boolean = false;
  username: any;
  role: any;
  packageMasterForm!: FormGroup;
  submitted: boolean = false;
  constructor(public dialogRef: MatDialogRef<UpdatePackageMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private swal: SwalService, private storageService: StorageService, private fb: FormBuilder) {
    console.log(data);
    this.product_id = data.cas_product_id;
    this.ispercentage = data.isactive;
    console.log(this.ispercentage);
    
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();


  }
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  UpdatePackagemaster() {
    this.submitted = true;
    // let requestBody: updateRequestbody = {
    //   // broadcastername: broadcastername,
    //   username: this.username,
    //   role: this.role,
    //   isactive: this.ispercentage,
    //   id: this.product_id,
    // };
    // console.log(requestBody);
    this.swal.Loading();

    this.userService.UpdatePackagemasterList(this.role, this.username, this.product_id,!this.ispercentage).subscribe(
      (res) => {
        console.log(res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your update was successful",
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          // window.location.reload();
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

}

