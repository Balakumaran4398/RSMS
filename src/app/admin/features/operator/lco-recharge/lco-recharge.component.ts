import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-lco-recharge',
  templateUrl: './lco-recharge.component.html',
  styleUrls: ['./lco-recharge.component.scss'],

})
export class LcoRechargeComponent implements OnInit {

  form!: FormGroup;
  isLoggedIn = false;

  username: any;
  role: any;
  id: any;
  constructor(private userservice: BaseService, private storageservice: StorageService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private swal: SwalService) {
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
      userid: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.route.url.subscribe((segments) => {
      console.log('Full URL Segments:', segments);

      const parts = segments.map(seg => seg.path);
      const index = parts.indexOf('lco_recharge');

      if (index !== -1 && index + 1 < parts.length) {
        this.id = parts[index + 1];
        console.log('Extracted Value:', this.id);
      } else {
        console.log('lco_recharge not found in URL');
      }
    });

  }
  submit() {
    console.log('submit ');

    if (this.id == '2') {
      console.log('operator Recharge');
      if (this.form.valid) {
        this.swal.Loading1();
        const { userid, password } = this.form.value;
        this.userservice.LCOLogin(this.role, this.username, userid, password, 2).subscribe(
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
                this.router.navigate(['admin/lcorecharge']).then(() => {
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
          });
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
    if (this.id == '1') {
      console.log('operator Details');

      if (this.form.valid) {
        this.swal.Loading1();
        const { userid, password } = this.form.value;
        let requestBody = {
          role: this.role,
          username: this.username,
          userid: userid,
          password: password,
          type: 7,
        }
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
              this.router.navigate(['admin/operator_details']).then(() => {
                console.log('Navigated to operator_details page');
              });
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
        this.router.navigate(['admin/lco_recharge/1']).then(() => {
        });
      }
    });
  }

}
