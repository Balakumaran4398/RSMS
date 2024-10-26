import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-addednotadded',
  templateUrl: './addednotadded.component.html',
  styleUrls: ['./addednotadded.component.scss']
})
export class AddednotaddedComponent {
  role: any;
  username: any;
  type: any;
  operatorid: any;
  constructor(public dialogRef: MatDialogRef<AddednotaddedComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private userservice: BaseService, private storageservice: StorageService, private swal: SwalService, public dialog: MatDialog,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.type = data.type;
    this.operatorid = data.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  moveSelected_added_Items(event:any){  }
  moveAllSelected_added_Items(event:any){  }

  save(){}

}
