import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
@Component({
  selector: 'app-version-login-credential',
  templateUrl: './version-login-credential.component.html',
  styleUrls: ['./version-login-credential.component.scss']
})
export class VersionLoginCredentialComponent {
  form!: FormGroup;
  isLoggedIn = false; // Track login status

  username: any;
  role: any;
  newSubid: any;
  subId: any;
  detailsList: any[] = [];
  pairBoxList: any[] = [];
  pairSmartcardList: any[] = [];
  planType: any[] = [];

  constructor(public dialogRef: MatDialogRef<VersionLoginCredentialComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private location: Location, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService, private fb: FormBuilder, private router: Router, public dialog: MatDialog,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.form = fb.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
      role: this.role,
      username: this.username
    })
    console.log(data);

  }
  ngOnInit() {
    this.form = this.fb.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  submit() {
    if (this.form.valid) {
      const { userid, password } = this.form.value;
      let requestBody = {
        role: this.role,
        username: this.username,
        userid: userid,
        password: password,
        type: 4,
        // type: 7,
      }
      this.userservice.checkLoginCredenticals(requestBody).subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Login Successful',
            text: res?.message || 'You will be redirected shortly.',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          }).then(() => {
            this.closeLoginPage();
          });
        },
        (error: any) => {
          Swal.fire({
            title: 'Login Failed',
            text: error?.error?.message || 'Username or password is incorrect. Please try again.',
            icon: 'error',
            confirmButtonText: 'Retry'
          });
          console.log('Error:', error?.error?.message);

        });
    } else {
      Swal.fire({
        title: 'Invalid Form',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
  closeLoginPage() {
    this.dialogRef.close({ success: true });
  }
  onClick_Close() {
    this.dialogRef.close();
  }
  onNoClick(): void {
    const role = this.storageservice.getUserRole();
    this.form.reset();
    this.isLoggedIn = false;

    Swal.fire({
      title: 'Exited',
      text: 'You have exited the login form.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        if (role === 'ROLE_USER' || role === 'ROLE_RECEPTION') {
          this.router.navigate(['admin/home']).then(() => {
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.location.back();
      }
    });
  }
}
