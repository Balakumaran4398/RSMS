import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editmso',
  templateUrl: './editmso.component.html',
  styleUrls: ['./editmso.component.scss']
})
export class EditmsoComponent implements OnInit {
  username: any;
  role: any;
  msoname: any;
  msoarea: any;
  msostreet: any;
  msostate: any;
  msopincode: any;
  msoemail: any;
  msocontact: any;
  panno: any;
  gstno: any;

  isemi = true;
  chipidforce = true;
  managepack = true;
  reportstatus = true;
  calendarrecharge = true;
  constructor(public dialogRef: MatDialogRef<EditmsoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userService: BaseService, private storageservice: StorageService, private fb: FormBuilder) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(data);
    this.msoname = data?.data.msoName;
    this.msoarea = data?.data.msoArea;
    this.msostreet = data?.data.msoStreet;
    this.msostate = data?.data.msoState;
    this.msopincode = data?.data.msoPincode;
    this.msoemail = data?.data.msoEmail;
    this.msocontact = data?.data.msoContact;
    this.panno = data?.data.panNo;
    this.gstno = data?.data.gstNo;

    this.isemi = data?.data.isemi;
    this.chipidforce = data?.data.chipidForce;
    this.managepack = data?.data.managepack;
    this.reportstatus = data?.data.reportStatus;
    this.calendarrecharge = data?.data.calendarrecharge;
    
    console.log('isemi', this.isemi);
    console.log('chipidforce', this.chipidforce);
    console.log('managepack', this.managepack);
    console.log('reportstatus', this.reportstatus);
    console.log('calendarrecharge', this.calendarrecharge);

  }
  ngOnInit() {

}



  onSubmit() {
    let requestBody = {
      msoname: this.msoname,
      msoarea: this.msoarea,
      msostreet: this.msostreet,
      msostate: this.msostate,
      msopincode: this.msopincode,
      msoemail: this.msoemail,
      msocontact: this.msocontact,
      panno: this.panno,
      gstno: this.gstno,
      isemi: this.isemi,
      chipidforce: this.chipidforce,
      managepack: this.managepack,
      reportstatus: this.reportstatus,
      calendarrecharge: this.calendarrecharge,
      role: this.role,
      username: this.username,
    };

    const errorFields = [
      'msoname', 'msoarea', 'msostreet', 'msostate', 'msopincode',
      'msoemail', 'msocontact', 'panno', 'gstno', 'isemi',
      'chipidforce', 'managepack', 'reportstatus', 'calendarrecharge', 'role', 'username'
    ];
    this.swal.Loading();
    this.userService.updateMso(requestBody).subscribe((res: any) => {
      Swal.fire({
        title: 'Success',
        text: res?.message || 'MSO details updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        location.reload();
      });

    }, (err) => {
      const errorMessage = errorFields
        .map(field => err?.error?.[field])
        .find(message => message) || 'An error occurred while updating the MSO details.';
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
