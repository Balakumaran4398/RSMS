import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-top-sub-login',
  templateUrl: './top-sub-login.component.html',
  styleUrls: ['./top-sub-login.component.scss']
})
export class TopSubLoginComponent {
  form!: FormGroup;
  isLoggedIn = false; // Track login status

  username: any;
  role: any;
  constructor(private userservice: BaseService, private storageservice: StorageService, private fb: FormBuilder, private router: Router,private swal:SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.form = fb.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
      role: this.role,
      username: this.username
    })
  }

  ngOnInit() {
    this.form = this.fb.group({
      userid: ['', Validators.required],  // username is required
      password: ['', Validators.required], // password is required
    });
  }
  submit() {
    
    console.log('submit ');
    if (this.form.valid) {
      const { userid, password } = this.form.value;
      let requestBody = {
        role: this.role,
        username: this.username,
        userid: userid,
        password: password,
        type: 4,
      }
      this.swal.Loading();
      // this.userservice.checkLoginCredenticals(this.role, this.username, userid, password, 4).subscribe(
        this.userservice.checkLoginCredenticals(requestBody).subscribe(
        (res: any) => {
          const role = this.storageservice.getUserRole();
          const user = this.storageservice.getUser();
          Swal.fire({
            title: 'Login Successful',
            text: res?.message || 'You will be redirected shortly.',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          }).then(() => {
            if (role === 'ROLE_ADMIN' || role === 'ROLE_RECEPTION') {
              this.router.navigate(['admin/top_sub_detail']).then(() => {
                console.log('Navigated to lcorecharge page');
              });
            }
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
        }
      );
    }
    else {
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
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (role === 'ROLE_ADMIN' || role === 'ROLE_RECEPTION') {
          this.router.navigate(['admin/home']).then(() => {
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['admin/lco_recharge']).then(() => {
        });
      }
    });
  }

}
