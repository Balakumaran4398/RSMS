import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  nameheader: any = 0;
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
        // mobileno: ['', Validators.required],
        mobileno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        // email: ['', [Validators.required, Validators.email]],
        email: ['',
          [Validators.required, Validators.email, this.customEmailValidator()]],
        address: ['', [Validators.required,]],
        area: ['', [Validators.required]],
        state: ['', [Validators.required]],
        pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        userid: ['', [Validators.required]],
        password: ['', [Validators.required]],
      });
  }

  onSubmit(form: any): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      console.log(`${key} - Status: ${control?.status}, Errors:`, control?.errors);
    });
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
    if (this.form.invalid) {
    this.submitted = true;
    } else {
    this.userService.createLocalChannelLTB(requestBody)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
    }
  }

  // onSubmit(form: any): void {
  //   this.submitted = true;

  //   if (this.form.invalid) {
  //     this.swal.Error('Please correct the errors in the form.');
  //     return;
  //   }

  //   let requestBody = {
  //     role: this.role,
  //     username: this.username,
  //     nameheader: this.form.value.nameheader,
  //     operatorname: this.form.value.operatorname,
  //     mobileno: this.form.value.mobileno,
  //     mail: this.form.value.email,
  //     address: this.form.value.address,
  //     state: this.form.value.state,
  //     area: this.form.value.area,
  //     pincode: this.form.value.pincode,
  //     userid: this.form.value.userid,
  //     password: this.form.value.password,
  //   };

  //   this.userService.createLocalChannelLTB(requestBody).subscribe(
  //     (res: any) => {
  //       this.swal.success(res?.message);
  //     },
  //     (err) => {
  //       this.swal.Error(err?.error?.message);
  //     }
  //   );
  // }

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
}