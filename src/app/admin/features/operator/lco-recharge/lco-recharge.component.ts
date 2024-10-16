import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-lco-recharge',
  templateUrl: './lco-recharge.component.html',
  styleUrls: ['./lco-recharge.component.scss'],

})
export class LcoRechargeComponent {

  form!: FormGroup;
  isLoggedIn = false; // Track login status

  username: any;
  role: any;
  constructor(private userservice: BaseService, private storageservice: StorageService, private fb: FormBuilder, private router: Router) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.form = fb.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
      role: this.role,
      username: this.username
    })
  }

  submit() {
    if (this.form.valid) {
      const { userid, password } = this.form.value;

      this.userservice.LCOLogin(this.role, this.username, userid, password,2).subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Login Successful',
            text: res?.message || 'You will be redirected shortly.',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          }).then(() => {
            this.isLoggedIn = true;
          });
        },
        (error: any) => {
          Swal.fire({
            title: 'Login Failed',
            text: error?.error.message || 'Please check your credentials and try again.',
            icon: 'error',
            confirmButtonText: 'Retry'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Invalid Form',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  exit() {
    const role = this.storageservice.getUserRole();
    this.form.reset();
    this.isLoggedIn = false;

    Swal.fire({
      title: 'Exited',
      text: 'You have exited the login form.',
      icon: 'info',
      showCancelButton: true, // Add a cancel button
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // If OK is clicked
        if (role === 'ROLE_USER') {
          this.router.navigate(['admin/home']).then(() => {
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If Cancel is clicked
        this.router.navigate(['admin/lco_recharge']).then(() => {
        });
      }
    });
  }

}
