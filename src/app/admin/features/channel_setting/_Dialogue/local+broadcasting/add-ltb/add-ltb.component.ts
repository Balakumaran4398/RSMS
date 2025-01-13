import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { Role } from 'node_modules1/@tufjs/models/dist/role';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-add-ltb',
  templateUrl: './add-ltb.component.html',
  styleUrls: ['./add-ltb.component.scss']
})
export class AddLtbComponent {
  form!: FormGroup;
  submitted = false;
  role: any;
  username: any;
  constructor(
    public dialogRef: MatDialogRef<AddLtbComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private userService: BaseService, private storageService: StorageService,
    private swal: SwalService) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        nameheader: ['', Validators.required],
        operatorname: ['', Validators.required],
        mobileno: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required,]],
        area: ['', [Validators.required]],
        state: ['', [Validators.required]],
        pincode: ['', [Validators.required]],
        userid: ['', [Validators.required]],
        password: ['', [Validators.required]],
      });
  }

  onSubmit(form: any): void {
    this.submitted = true;
    let requestBody = {
      role: this.role,
      username: this.username,
      nameheader: form.value.nameheader,
      operatorname: form.value.operatorname,
      mobileno: form.value.mobileno,
      mail: form.value.email,
      address: form.value.address,
      state: form.value.state,
      area: form.value.area,
      pincode: form.value.pincode,
      userid: form.value.userid,
      password: form.value.password,
    }

    this.userService.createLocalChannelLTB(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }

  onKeydown(e: any) {
    var key = e.keyCode;
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

}