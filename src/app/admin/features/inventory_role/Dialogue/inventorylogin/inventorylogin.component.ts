import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { InventoryDialogueComponent } from '../inventory-dialogue/inventory-dialogue.component';

@Component({
  selector: 'app-inventorylogin',
  templateUrl: './inventorylogin.component.html',
  styleUrls: ['./inventorylogin.component.scss']
})
export class InventoryloginComponent implements OnInit {
  form!: FormGroup;
  isLoggedIn = false;
  username: any;
  role: any;
  type: any;
  inventory_dialog: any;
  constructor(public dialogRef: MatDialogRef<InventoryloginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService, private storageservice: StorageService, private fb: FormBuilder, private router: Router, public dialog: MatDialog,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.form = fb.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
      role: this.role,
      username: this.username
    })
    console.log(data);
    this.inventory_dialog = data.type;
    console.log(this.inventory_dialog);
    console.log('11111111111111111111111111111', dialogRef);


  }

  ngOnInit() {
    console.log(this.dialogRef);

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
        type: 5,
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
            console.log(this.inventory_dialog);
            if (this.inventory_dialog === 'inventory_inventory') {
              let dialogRef;
              dialogRef = this.dialog.open(InventoryDialogueComponent, {});
            }
            this.onNoClick();
            if (this.inventory_dialog === 'reception') {
              this.dialogRef.close({ status: 'success', message: 'Login successful' });
            }

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


}
