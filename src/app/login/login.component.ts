import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../_core/service/alert.service';
import { StorageService } from '../_core/service/storage.service';
import { AuthService } from '../_core/service/auth.service';
import Swal from 'sweetalert2';
interface requestBody {
  access_ip: any;
  action: any;
  remarks: any;
  data: any;
  user_id: any;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signInform!: FormGroup;
  submitted = false;
  roles: any;
  isShow: boolean = false;
  errorMessage = "";
  idstorage: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.signInform = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.submitted = false;
  }

  submit(form: FormGroup): void {
    this.submitted = true;
    const username = form.value.username;
    const password = form.value.password;

    if (!username || username.trim() === '') {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Invalid User Name',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    } else if (!password || password.trim() === '') {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Invalid Password',
        showConfirmButton: false,
        timer: 1000
      });
      return;
    } else if (form.valid) {
      this.authService.login(this.signInform.value).subscribe(
        res => {
          // Success handler
          // if (res.roles.includes('ROLE_RECEPTION')) {
          if (res.roles.includes('ROLE_USER')) {
            this.storageService.saveToken(res.accessToken);
            this.storageService.saveUser(res);
            this.idstorage = res.id;
            console.log('Stored ID:', res.id);
            const user = this.storageService.getUser();
            console.log(user.username);

            this.roles = user.roles;
            this.post();
            const role = this.storageService.getUserRole();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Your Login is Successful",
              showConfirmButton: false,
              timer: 1000
            });
            // if (role === 'ROLE_RECEPTION') {
            if (role === 'ROLE_USER') {
              this.router.navigate(['admin/home']).then(() => {
                console.log('Navigated to home page');
              });
            }
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: 'You do not have the required role.',
              showConfirmButton: false,
              timer: 1500
            });
          }
        },
        err => {
          console.error('Login error', err);
          let errorMessage = 'An error occurred during login.';
          if (err.status === 0) {
            errorMessage = 'Unable to reach the server. Please try again later.';
          } else if (err.status === 401) {
            errorMessage = 'Invalid username or password.';
          }
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            showConfirmButton: false,
            timer: 1500
          });
        }
      );
    }
  }
  onReset() {
    this.submitted = false;
    this.signInform.reset();
  }
  // goToNewUserPage() {
  //   this.router.navigate(['new-user'])
  // }
  post() {
    let requestBody: requestBody = { access_ip: "", action: "Sign in", data: "Sign in", remarks: "Sign in", user_id: this.idstorage };
  }
}
