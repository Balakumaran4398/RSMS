import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
interface Dist_Requestbody {
  name: any,
  contact: any,
  address: any,
  email: any,
  username: any,
  isactive: boolean,
  role: any,
  id: any
}
@Component({
  selector: 'app-edit-distributor',
  templateUrl: './edit-distributor.component.html',
  styleUrls: ['./edit-distributor.component.scss']
})
export class EditDistributorComponent {
  distributorForm!: FormGroup;
  username: string;
  user_role: string;
  type: number = 0;
  distributor_id: any;
  distributor_name: any;
  distributor_contact: any;
  distributor_address: any;
  distributor_email: any;
  distributor_isactive: boolean = false;
  userid: any;
  accessip: any;

  constructor(
    public dialogRef: MatDialogRef<EditDistributorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userService: BaseService, public storageService: StorageService, private fb: FormBuilder, private swal: SwalService) {
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
    this.username = this.storageService.getUsername();
    this.user_role = this.storageService.getUserRole();
    this.distributor_name = data.name;
    this.distributor_contact = data.contact;
    this.distributor_address = data.address;
    this.distributor_email = data.email;
    this.distributor_isactive = data.isactive;
    this.distributor_id = data.id;
    console.log(data);
    console.log(this.distributor_email);

    this.distributorForm = this.fb.group({
      distributor_name: [data.name, Validators.required],
      distributor_contact: [data.contact, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      distributor_address: [data.address, Validators.required],
      // distributor_email: [data.email, [Validators.required, Validators.email]],
      distributor_email: [
        data.email,
        [Validators.required, Validators.email, this.customEmailValidator()]
      ],
      distributor_isactive: [data.isactive]
    });
  }

  customEmailValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(in|com)$/;

      if (email && !emailPattern.test(email)) {
        return { invalidEmail: true };
      }
      return null;
    };
  }
  ngOnInit() {

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  Distributor(): void {
    let requestBody: Dist_Requestbody = {
      name: this.distributorForm.value.distributor_name,
      contact: this.distributorForm.value.distributor_contact,
      email: this.distributorForm.value.distributor_email,
      address: this.distributorForm.value.distributor_address,
      username: this.username,
      isactive: this.distributorForm.value.distributor_isactive,
      role: this.user_role,
      id: this.distributor_id,
    };
    let requestBody1: Dist_Requestbody = {
      name: this.distributor_name,
      contact: this.distributor_contact,
      email: this.distributor_email,
      address: this.distributor_address,
      username: this.username,
      isactive: this.distributor_isactive,
      role: this.user_role,
      id: this.distributor_id,
    };
    console.log(requestBody);
    Swal.fire({
      title: 'Updating...',
      text: 'Wait for the Distributor to be Updated....',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    const oldDataString = JSON.stringify(requestBody);
    const newDataString = JSON.stringify(requestBody1);

    
    this.userService.Distributor_update(requestBody).subscribe(
      (res: any) => {
        console.log(res);
        this.logCreate('Distributor Edit', newDataString, oldDataString);
        this.swal.success(res?.message);
        // this.closeDialog();
      },
      (err) => {
        this.swal.Error(err?.error?.message);
      }
    );
  }
  closeDialog() {
    this.dialogRef.close();
  }

  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  logCreate(action: any, remarks: any, data: any) {
    console.log(remarks);

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
