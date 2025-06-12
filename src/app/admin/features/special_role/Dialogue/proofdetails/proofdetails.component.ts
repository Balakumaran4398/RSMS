import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proofdetails',
  templateUrl: './proofdetails.component.html',
  styleUrls: ['./proofdetails.component.scss']
})
export class ProofdetailsComponent {
  idproofname: any;
  addressproofname: any;
  editidproofname: any;
  editaddressproofname: any;
  isdelete = false;
  editidproofname1: any;
  editaddressproofname1: any;
  isdelete1 = false;
  id: any;
  username: any;
  role: any;
  errorMessage: any;
  type: any;

  userid: any;
  accessip: any;
  constructor(public dialogRef: MatDialogRef<ProofdetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
    console.log(data);
    this.type = data.type
    this.editidproofname = data?.data?.proofname
    this.editaddressproofname = data?.data?.addressname
    this.isdelete = data?.data?.isdelete,
      this.id = data?.data?.id
  }
  idCreate() {
    this.userservice.createIdProof
    if (!this.idproofname) {
      this.errorMessage = 'ID PROOF Name is required.';
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this ID Proof name?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Creating...',
          text: 'Wait for the ID PROOF NAME to be created....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.createIdProof(this.role, this.username, this.idproofname).subscribe(
          (res: any) => {
            this.swal.success(res.message);
          },
          (err) => {
            this.swal.Error(err?.error?.message);
          }
        );
      }
    });
  }
  addresscreate() {
    this.userservice.createAddressProof
    if (!this.addressproofname) {
      this.errorMessage = 'ID PROOF Name is required.';
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this Address proof name?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Creating...',
          text: 'Wait for the ADDRESS PROOF NAME to be created....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.createAddressProof(this.role, this.username, this.addressproofname).subscribe(
          (res: any) => {
            this.swal.success(res.message);
          },
          (err) => {
            this.swal.Error(err?.error?.message);
          }
        );
      }
    });
  }

  updateAddressProof() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Update this Address proof name?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Creating...',
          text: 'Wait for the ADDRESS PROOF NAME to be Updated....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.updateAddressProof(this.role, this.username, this.editaddressproofname, this.isdelete, this.id).subscribe(
          (res: any) => {
            this.swal.success(res.message);
            const data = ` Address Proof Name: ${this.editaddressproofname}, ` + ` Status: ${this.isdelete},`;
            const remark = ` Address Proof Name: ${this.editaddressproofname1}, ` + ` Status: ${this.isdelete1},`;
            this.logCreate('Address Proof Update Button Clicked', remark, data);
          },
          (err) => {
            this.swal.Error(err?.error?.message);
          }
        );
      }
    });
  }
  updateIdProof() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Update this ID proof name?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Creating...',
          text: 'Wait for the ID PROOF NAME to be Updated....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.updateIdProof(this.role, this.username, this.editidproofname, this.isdelete, this.id).subscribe(
          (res: any) => {
            this.swal.success(res.message);
            const data = ` ID Proof Name: ${this.editidproofname}, ` + ` Status: ${this.isdelete},`;
            const remark = ` ID Proof Name: ${this.editidproofname1}, ` + ` Status: ${this.isdelete1},`;
            this.logCreate('ID Proof Update Button Clicked', remark, data);
          },
          (err) => {
            this.swal.Error(err?.error?.message);
          }
        );
      }
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
    if (this.idproofname.trim()) {
      this.errorMessage = null;
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
    this.userservice.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }

}
