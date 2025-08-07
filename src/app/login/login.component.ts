import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../_core/service/alert.service';
import { StorageService } from '../_core/service/storage.service';
import { AuthService } from '../_core/service/auth.service';
import Swal from 'sweetalert2';
import { SwalService } from '../_core/service/swal.service';
import { BaseService } from '../_core/service/base.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
  msoName: any;
  msoLogo: any;
  role: any;
  username: any;
  lcoDeatails: any;
  subscriberid: any;
  notificationMessage: boolean = false;
  constructor(
    private swal: SwalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private userService: BaseService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    // private alertService: AlertService,
    private cdr: ChangeDetectorRef,
  ) {
    this.signInform = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    console.log('ROLE', this.role);
    console.log('USERNAME', this.username);
  }
  public getUserRole(user: any): string {

    if (!user || !user.roles) return 'DEFAULT_ROLE';
    if (user.roles.includes('ROLE_ADMIN')) return 'ROLE_ADMIN';
    if (user.roles.includes('ROLE_RECEPTION')) return 'ROLE_RECEPTION';
    if (user.roles.includes('ROLE_SPECIAL')) return 'ROLE_SPECIAL';
    if (user.roles.includes('ROLE_INVENTORY')) return 'ROLE_INVENTORY';
    if (user.roles.includes('ROLE_CUSSERVICE')) return 'ROLE_CUSSERVICE';
    if (user.roles.includes('ROLE_SERVICECENTER')) return 'ROLE_SERVICECENTER';
    if (user.roles.includes('ROLE_OPERATOR')) return 'ROLE_OPERATOR';
    if (user.roles.includes('ROLE_SUBLCO')) return 'ROLE_SUBLCO';
    if (user.roles.includes('ROLE_SUBSCRIBER')) return 'ROLE_SUBSCRIBER';
    return 'DEFAULT_ROLE';
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
    this.authService.msoDeatils().subscribe((data: any) => {
      console.log(data);
      this.msoName = data.msoName;
      this.msoLogo = data.msoLogo;
      console.log(this.msoLogo);
      console.log(this.msoName);
    });

  }
  getSubscriberDetails() {
    this.userService.getSubscriberDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      console.log('22222222');
      this.lcoDeatails = data;
      console.log('SUBSCRIBER DETAILS', this.lcoDeatails);
    })
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
      this.swal.Loading1()
      this.authService.login(this.signInform.value).subscribe(
        (res: any) => {
          console.log(res);
          console.log(res.roles);
          if (res.roles.includes('ROLE_ADMIN') || res.roles.includes('ROLE_RECEPTION') || res.roles.includes('ROLE_SPECIAL')
            || res.roles.includes('ROLE_INVENTORY') || res.roles.includes('ROLE_CUSSERVICE') || res.roles.includes('ROLE_SERVICECENTER') || res.roles.includes('ROLE_OPERATOR') || res.roles.includes('ROLE_SUBLCO') || res.roles.includes('ROLE_SUBSCRIBER')) {
            this.storageService.saveToken(res.accessToken);
            this.storageService.saveUser(res);
            this.storageService.saveUsernamenew(res.username)
            this.storageService.saveAccessIP(res.access_ip)
            this.storageService.saveID(res.id)
            this.storageService.saveNavList(res.navigationmap)
            this.storageService.saveLco(res.islco)
            if (res.roles.includes('ROLE_ADMIN')) {
              this.storageService.saveLoggerPass(this.signInform.value.password)
              console.log(this.signInform.value.password);
              console.log(this.storageService.saveLoggerPass(this.signInform.value.password));
            }
            this.idstorage = res.id;
            console.log('Stored ID:', res.id);
            console.log('password:', res.password);
            const user = this.storageService.getUser();
            const password = this.storageService.getLoggerPass();
            console.log(user.username);
            console.log(password.password);
            this.roles = user.roles;
            console.log(this.roles);
            console.log(res.navigationmap);
            console.log(res.islco);

            this.post();
            // const role = this.storageService.getUserRole();
            let isUser = this.roles.includes('ROLE_ADMIN');
            let isReception = this.roles.includes('ROLE_RECEPTION');
            let isSpecial = this.roles.includes('ROLE_SPECIAL');
            let isInventory = this.roles.includes('ROLE_INVENTORY');
            let isCusService = this.roles.includes('ROLE_CUSSERVICE');
            let isServiceCenter = this.roles.includes('ROLE_SERVICECENTER');
            let isOperator = this.roles.includes('ROLE_OPERATOR');
            let isSubLco = this.roles.includes('ROLE_SUBLCO');
            let isSubcriber = this.roles.includes('ROLE_SUBSCRIBER');

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
              this.router.navigate(['admin/subscriber']).then(() => {
              });
            } else if (isServiceCenter) {
              this.router.navigate(['admin/service_center']).then(() => {
              });
            } else if (isOperator) {
              this.router.navigate(['admin/operator_dashboard']).then(() => {
              });
            } else if (isSubLco) {
              this.router.navigate(['admin/operator_dashboard']).then(() => {
              });
            } else if (isSubcriber) {
              console.log('role', this.role);
              console.log('username', this.username);
              this.role = this.getUserRole(res)
              this.username = username;
              this.userService.getSubscriberDetails(this.role, this.username).subscribe((data: any) => {
                console.log(data);
                this.lcoDeatails = data;
                this.subscriberid = this.lcoDeatails.subid;
                this.router.navigate(['admin/subscriber-full-info/' + this.subscriberid + '/new']).then(() => {
                });
              })

            }
            this.swal.Close();
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: 'You do not have the required role.',
              showConfirmButton: false,
              timer: 1500
            });
            this.swal.Close();
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
    this.cdr.detectChanges();
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
