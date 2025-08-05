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
  msoname1: any;
  msoarea1: any;
  msostreet1: any;
  msostate1: any;
  msopincode1: any;
  msoemail1: any;
  msocontact1: any;
  panno1: any;
  gstno1: any;

  isemi1 = true;
  chipidforce1 = true;
  managepack1 = true;
  reportstatus1 = true;
  calendarrecharge1 = true;

  userid: any;
  accessip: any;
  constructor(public dialogRef: MatDialogRef<EditmsoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userService: BaseService, private storageservice: StorageService, private fb: FormBuilder) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
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

    this.msoname1 = data?.data.msoName;
    this.msoarea1 = data?.data.msoArea;
    this.msostreet1 = data?.data.msoStreet;
    this.msostate1 = data?.data.msoState;
    this.msopincode1 = data?.data.msoPincode;
    this.msoemail = data?.data.msoEmail;
    this.msocontact1 = data?.data.msoContact;
    this.panno1 = data?.data.panNo;
    this.gstno1 = data?.data.gstNo;
    this.isemi1 = data?.data.isemi;
    this.chipidforce1 = data?.data.chipidForce;
    this.managepack1 = data?.data.managepack;
    this.reportstatus1 = data?.data.reportStatus;
    this.calendarrecharge1 = data?.data.calendarrecharge;

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
      // Swal.fire({
      //   title: 'Success',
      //   text: res?.message || 'MSO details updated successfully!',
      //   icon: 'success',
      //   confirmButtonText: 'OK',
      //   timer: 2000,
      //   timerProgressBar: true,
      // }).then(() => {
      //   location.reload();
      // });
      this.swal.success(res?.message);
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
    const data = ` OLD MSO NAME : ${this.msoname1}, ` + ` OLD MSO AREA :${this.msoarea1}, ` + ` OLD MSO STREET :${this.msostate1}, ` + ` OLD MSO PINCODE :${this.msopincode1}` + ` OLD MSO EMAIL :${this.msoemail1}, ` + ` OLD MSO CONTACT :${this.msocontact1}, ` + ` OLD MSO PAN NUMBER :${this.panno1}, ` + ` OLD MSO GST NUMBER :${this.gstno1}, ` + ` OLD ISEMI :${this.isemi1}, ` + ` OLD CHIP ID FORCE :${this.chipidforce1}, ` + ` OLD MANAGE PACK :${this.managepack1}, ` + ` OLD CALENDOR RECHARGE :${this.calendarrecharge1}`;
    const remark = ` NEW MSO NAME : ${this.msoname}, ` + ` NEW MSO AREA :${this.msoarea}, ` + ` NEW MSO STREET :${this.msostate}, ` + ` NEW MSO PINCODE :${this.msopincode}` + ` NEW MSO EMAIL :${this.msoemail}, ` + ` NEW MSO CONTACT :${this.msocontact}, ` + ` NEW MSO PAN NUMBER :${this.panno}, ` + ` NEW MSO GST NUMBER :${this.gstno}, ` + ` NEW ISEMI :${this.isemi}, ` + ` NEW CHIP ID FORCE :${this.chipidforce}, ` + `  NEW  MANAGE PACK :${this.managepack}, ` + ` NEW CALENDOR RECHARGE :${this.calendarrecharge}`;
    this.logCreate('MSO Details Button Clicked', data, remark);
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

  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userService.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);
    })
  }
}
