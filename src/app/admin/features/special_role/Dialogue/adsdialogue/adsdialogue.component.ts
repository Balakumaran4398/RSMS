import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { ChanneldialogueComponent } from '../channeldialogue/channeldialogue.component';

@Component({
  selector: 'app-adsdialogue',
  templateUrl: './adsdialogue.component.html',
  styleUrls: ['./adsdialogue.component.scss']
})
export class AdsdialogueComponent {
  // casForm : FormGroup;
  editform !: FormGroup;
  role: any;
  username: any;
  type: any;
  addname: any;
  addurl: any;
  siteurl: any;
  isactive: boolean = true;
  id: any;
  createForm: any;
  casForm: any;
  constructor(public dialogRef: MatDialogRef<ChanneldialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(data);
    this.type = data?.type;
    this.addname = data.data?.adName;
    this.addurl = data.data?.adUrl;
    this.siteurl = data.data?.siteUrl;
    this.isactive! = data.data?.isActive || false; 
    console.log(this.isactive);
    
    this.id = data.data?.id;

    this.createForm = this.fb.group({
      channelname: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')]],
      logo: ['', Validators.required],
      categoryid: ['', Validators.required],
    });
  }
  onSubmit() {
    // if (this.casForm.invalid) {
    //     return;
    // }

    this.swal.Loading();
    this.userservice.createAdMaster(this.role, this.username, this.addname, this.addurl, this.siteurl).subscribe(
      (res: any) => {
        this.swal.success(res?.message);
      },
      (err) => {
        this.swal.Error(err?.error?.message);
      }
    );
  }


  onEditsubmit() {
    this.swal.Loading();
    this.userservice.updateAdmaster(this.role, this.username, this.addname, this.addurl, this.siteurl,this.isactive,this.id ).subscribe(
      (res: any) => {
        this.swal.success(res?.message);
      },
      (err) => {
        this.swal.Error(err?.error?.message);
      }
    );
  }
  onClick(): void {
    this.dialogRef.close();
  }
}
