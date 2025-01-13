import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { SubscriberdialogueComponent } from '../subscriberdialogue/subscriberdialogue.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-lcologinpage',
  templateUrl: './lcologinpage.component.html',
  styleUrls: ['./lcologinpage.component.scss']
})
export class LcologinpageComponent {

  form!: FormGroup;
  isLoggedIn = false; // Track login status

  username: any;
  role: any;
  type: any;
  newSubid: any;
  subId: any;
  detailsList: any[] = [];
  pairBoxList: any[] = [];
  pairSmartcardList: any[] = [];
  planType: any[] = [];
  constructor(public dialogRef: MatDialogRef<LcologinpageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService, private storageservice: StorageService, private fb: FormBuilder, private router: Router, public dialog: MatDialog,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.form = fb.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
      role: this.role,
      username: this.username
    })
    console.log(data);
    this.type = data.type;
    this.newSubid = data.newsubid;
    this.subId = data.subId;
    this.detailsList = data.detailsList;
    this.pairBoxList = data.pairBoxlist
    this.pairSmartcardList = data.pairSmartcardlist;
    this.planType = data.plantype;
    console.log(this.detailsList);

  }

  ngOnInit() {
    this.form = this.fb.group({
      userid: ['', Validators.required],  // username is required
      password: ['', Validators.required], // password is required
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
        type: 1,
      }
      // this.userservice.checkLoginCredenticals(this.role, this.username, userid, password, 1).subscribe(
        this.userservice.checkLoginCredenticals(requestBody).subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Login Successful',
            text: res?.message || 'You will be redirected shortly.',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          }).then(() => {
            let dialogData = {
              type: this.type,
              detailsList: this.detailsList,
              newsubid: this.newSubid,
              subId: this.subId,
              pairBoxlist: this.pairBoxList,
              pairSmartcardlist: this.pairSmartcardList,
              plantype: this.planType,
            };
            const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
              data: dialogData,
              width: '500px'
            });
            dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed', result);
            });
            this.onNoClick();
          });
        },
        (error: any) => {
          // Handle login failure
          Swal.fire({
            title: 'Login Failed',
            text: error?.error?.message || 'Username or password is incorrect. Please try again.',
            icon: 'error',
            confirmButtonText: 'Retry'
          });
          console.log('Error:', error?.error?.message);
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

  onNoClick(): void {
    this.dialogRef.close();
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
        if (role === 'ROLE_USER' || role === 'ROLE_RECEPTION') {
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
