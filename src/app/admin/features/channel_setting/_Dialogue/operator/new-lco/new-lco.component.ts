import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-lco',
  templateUrl: './new-lco.component.html',
  styleUrls: ['./new-lco.component.scss']
})
export class NewLcoComponent {
  form!: FormGroup;
  edit_dialog: boolean = false;
  username: any;
  id: any;
  role: any;
  type: any;
  businessList: any[];
  constructor(public dialogRef: MatDialogRef<NewLcoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private swal: SwalService, public dialog: MatDialog, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(data);
    this.type = data.type;
    console.log(this.type);
    // this.businessList = data.data;
    // this.businessList = Object.keys(data.data).map(key => {
    //   const value = data[key];
    //   const name = key
    //   return { name: name, value: value };
    // });

    this.businessList = Object.keys(data.data).map(key => ({
      name: key,
      value: data.data[key]
    }));

    console.log(this.businessList);

  }
  toggleedit() {
    this.dialogRef.close();
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
    this.form = this.fb.group({
      nameheader: ['', Validators.required],
      operatorname: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9 ]+$/)]],
      contactnumber1: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      contactnumber2: ['', [ Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      state: ['', Validators.required],
      userid: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      mail: ['', [Validators.required, Validators.email, this.customEmailValidator()]],
      area: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      lcobusinessid: ['0', Validators.required],
      role: this.role,
      username: this.username
    });
  }



  // onSubmit() {
  //   if (!this.form.valid) {

  //   } else {
  //     this.form.markAllAsTouched();
  //   }
  //   this.swal.Loading();
  //   this.userService.NewOperator(this.form.value).subscribe(
  //     (res: any) => {
  //       Swal.fire({
  //         title: 'Success!',
  //         text: res.message || 'The operator has been added successfully.',
  //         icon: 'success',
  //         timer: 2000,
  //         timerProgressBar: true,
  //         willClose: () => {
  //           window.location.reload();
  //           // this.ngOnInit();
  //         }
  //       });
  //     },
  //     (error: any) => {
  //       console.error(error);
  //       Swal.fire({
  //         title: 'Error!',
  //         text: error?.error.operatorname || error?.error.contactnumber2 || error?.error.address || error?.error.area || error?.error.state ||
  //           error?.error.mail || error?.error.lcobusinessid || error?.error.message || 'There was an issue adding the operator.',
  //         icon: 'error'
  //       });
  //     }
  //   );
  //   // } else {
  //   //   this.form.markAllAsTouched();
  //   // }
  // }

  // onSubmit() {
  //   if (!this.form.valid) {
  //     this.swal.Loading();
  //     this.userService.NewOperator(this.form.value).subscribe((res: any) => {
  //       Swal.fire({
  //         title: 'Success!',
  //         text: res.message || 'The operator has been added successfully.',
  //         icon: 'success',
  //         timer: 2000,
  //         timerProgressBar: true,
  //         willClose: () => {
  //           window.location.reload();
  //         }
  //       });
  //     },
  //       (error: any) => {
  //         console.error(error);
  //         Swal.fire({
  //           title: 'Error!',
  //           text: error?.error.operatorname ||
  //             error?.error.contactnumber2 ||
  //             error?.error.address ||
  //             error?.error.area ||
  //             error?.error.state ||
  //             error?.error.mail ||
  //             error?.error.lcobusinessid ||
  //             error?.error.message ||
  //             'There was an issue adding the operator.',
  //           icon: 'error'
  //         });
  //       }
  //     );
  //   } else {
  //     this.form.markAllAsTouched();
  //   }
  // }


  onSubmit() {
    console.log(this.form.valid);
    console.log(this.form.value);
    if (this.form.valid) {

      this.swal.Loading();

      this.userService.NewOperator(this.form.value).subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Success!',
            text: res.message || 'The operator has been added successfully.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            willClose: () => {
              window.location.reload();
            }
          });
        },
        (error: any) => {
          console.error(error);
          Swal.fire({
            title: 'Error!',
            text:
              error?.error.operatorname ||
              error?.error.contactnumber2 ||
              error?.error.address ||
              error?.error.area ||
              error?.error.state ||
              error?.error.mail ||
              error?.error.lcobusinessid ||
              error?.error.message ||
              'There was an issue adding the operator.',
            icon: 'error'
          });
        }
      );

    } else {
      // highlight all invalid fields
      this.form.markAllAsTouched();
    }
  }


  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
