import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../_core/service/alert.service';
import { StorageService } from '../_core/service/storage.service';
import { AuthService } from '../_core/service/auth.service';
import Swal from 'sweetalert2';
// import { ChangeDetectable } from 'ag-charts-community/dist/types/src/scene/changeDetectable';
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
  alerMessage: any;
  alerMessageDate: any;

  warningMessage: any;
  warningMessageDate: any;
  notificationMessage: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
  ) {
    this.signInform = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.submitted = false;
    this.authService.notification().subscribe((data: any) => {
      if (data) {
        this.notificationMessage = data.notification;
        this.warningMessageDate = data.sub_notification_msg;
        this.warningMessage = data.notificationmsg;
        this.notificationMessage = data.notification === 'true' || data.notification === true;
      }
      console.log('notification', this.notificationMessage)
    });
  }

  submit(form: FormGroup): void {
    this.submitted = true;
    const username = form.value.username;
    const password = form.value.password;

    if (!username || username.trim() === '') {
      console.log('111');

      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Invalid User Name',
        text: 'Please enter a valid username.',
        timerProgressBar: true,
        timer: 2000
      });
      return;
    } else if (!password || password.trim() === '') {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Invalid Password',
        text: 'Please enter a valid password.',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000
      });
      return;
    } else if (form.valid) {
      this.authService.login(this.signInform.value).subscribe(
        (res: any) => {
          console.log(res);
          console.log(res.roles);
          if (res.roles.includes('ROLE_ADMIN') || res.roles.includes('ROLE_RECEPTION') || res.roles.includes('ROLE_SPECIAL')
            || res.roles.includes('ROLE_INVENTORY') || res.roles.includes('ROLE_CUSTOMER_SERVICE') || res.roles.includes('ROLE_SERVICE_CENTER')) {
            this.storageService.saveToken(res.accessToken);
            this.storageService.saveUser(res);
            this.idstorage = res.id;
            console.log('Stored ID:', res.id);
            const user = this.storageService.getUser();
            console.log(user.username);

            this.roles = user.roles;
            this.post();
            // const role = this.storageService.getUserRole();
            let isUser = this.roles.includes('ROLE_ADMIN');
            let isReception = this.roles.includes('ROLE_RECEPTION');
            let isSpecial = this.roles.includes('ROLE_SPECIAL');
            let isInventory = this.roles.includes('ROLE_INVENTORY');
            let isCusService = this.roles.includes('ROLE_CUSTOMER_SERVICE');
            let isServiceCenter = this.roles.includes('ROLE_SERVICE_CENTER');

            Swal.fire({
              position: "center",
              icon: "success",
              title: 'SUCCESS',
              text: res.message || "Your Login is Successful",
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 2000
            });
            if (isUser) {
              this.router.navigate(['admin/home']).then(() => {
                console.log('Navigated to home page');
              });
            } else if (isReception) {
              this.router.navigate(['admin/home']).then(() => {
              });
            } else if (isSpecial) {
              this.router.navigate(['admin/msodetails']).then(() => {
              });
            } else if (isInventory) {
              this.router.navigate(['admin/inventor_inventory']).then(() => {
              });
            } else if (isCusService) {
              this.router.navigate(['admin/inventor_inventory']).then(() => {
              });
            } else if (isServiceCenter) {
              this.router.navigate(['admin/inventor_inventory']).then(() => {
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
            errorMessage = 'Invalid username or password. Please try again.';
          } else if (err?.error?.message) {
            errorMessage = err.error.message;
          }
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Login Failed',
            text: errorMessage,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2000
          });
        }
      );
    }
  }
  toggleShowPassword() {
    this.isShow = !this.isShow;
    this.cdr.detectChanges(); // Ensure UI updates immediately
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
