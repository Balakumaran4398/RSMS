import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { InventoryDialogueComponent } from '../inventory-dialogue/inventory-dialogue.component';
import { LicenseComponent } from '../../license/license.component';

@Component({
  selector: 'app-licenseexpire',
  templateUrl: './licenseexpire.component.html',
  styleUrls: ['./licenseexpire.component.scss']
})
export class LicenseexpireComponent {
  form!: FormGroup;
  isLoggedIn = false;
  username: any;
  role: any;
  type: any;

  constructor(private userservice: BaseService, private storageservice: StorageService, private fb: FormBuilder, private router: Router, public dialog: MatDialog,) {
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
    if (this.form.valid) {
      const { userid, password } = this.form.value;
      let requestBody = {
        role: this.role,
        username: this.username,
        userid: userid,
        password: password,
        type: 1,
      }
      this.userservice.checkLoginCredenticals(requestBody).subscribe(
        (res: any) => {
          const role = this.storageservice.getUserRole();
          Swal.fire({
            title: 'Login Successful',
            text: res?.message || 'You will be redirected shortly.',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          })
            .then(() => {
              // if (role === 'ROLE_INVENTORY') {
              this.router.navigate(['admin/inventory_cortonbox_data']).then(() => {
                console.log('Navigated to lcorecharge page');
              });
              // }
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

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
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
        this.router.navigate(['admin/inventor_inventory']).then(() => {
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['admin/inventory_license']).then(() => {
        });
      }
    });
  }
}
