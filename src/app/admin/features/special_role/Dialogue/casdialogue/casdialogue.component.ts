import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { id } from 'node_modules1/postcss-selector-parser/postcss-selector-parser';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-casdialogue',
  templateUrl: './casdialogue.component.html',
  styleUrls: ['./casdialogue.component.scss']
})
export class CasdialogueComponent implements OnInit {
  username: any;
  role: any;
  form!: FormGroup;
  // casForm!: FormGroup;
  submitted = false;
  smartcart_length: any;
  boxid_length: any;
  type: any;
  casid: any;

  casname: any;
  editcasmaster: any;
  casList: { id: number; name: string }[] = [];

  // --------------------casEdit-------------------
  cas_id: any;
  cas_name: any;
  msovendor: any;
  uname: any;
  password: any;
  address: any;
  serviceip: any;
  serverport: any;
  smartcardlength: any;
  boxidlength: any;
  referenceurl: any;
  email: any;
  website: any;
  mobileno: any;
  isactive: boolean = true;
  errorMessage: string | null = null;
  userid: any;
  accessip: any;
  // ------------------------------------------------------------
  cas_id1: any;
  cas_name1: any;
  msovendor1: any;
  uname1: any;
  password1: any;
  address1: any;
  serviceip1: any;
  serverport1: any;
  smartcardlength1: any;
  boxidlength1: any;
  referenceurl1: any;
  email1: any;
  website1: any;
  mobileno1: any;
  isactive1: boolean = true;
  constructor(public dialogRef: MatDialogRef<CasdialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService, private fb: FormBuilder) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
    console.log(data);
    this.type = data?.type;
    this.casid = data?.id;

    this.casname = data?.casname;
    this.form = this.fb.group({
      id: ['', Validators.required],
      casname: ['', Validators.required],
      uname: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      address: ['', Validators.required],
      vendor: ['', Validators.required],
      referenceurl: ['', [
        Validators.required,
        Validators.pattern('https?://.+')
      ]],
      website: ['', [
        Validators.required,
        Validators.pattern('www?.+')
      ]],
      contactno: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      serverip: ['', Validators.required],
      serverport: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{1,5}$')
      ]],
      smartcardlength: ['', Validators.required],
      boxidlength: ['', Validators.required],
      role: [this.storageservice.getUserRole(), Validators.required],
      username: [this.storageservice.getUsername(), Validators.required],
    });


    // -------------------------editcasmaster-------------------
    this.editcasmaster = data?.data;
    this.cas_id = data?.data?.id;
    this.cas_name = data?.data?.casname;
    this.uname = data?.data?.username;
    this.password = data?.data?.password;
    this.msovendor = data?.data?.vendor;
    this.address = data?.data?.address;
    this.serviceip = data?.data?.serverip;
    this.serverport = data?.data?.serverport;
    this.smartcardlength = data?.data?.smartcardlength;
    this.boxidlength = data?.data?.boxlength;
    this.referenceurl = data?.data?.referenceurl;
    this.email = data?.data?.email;
    this.website = data?.data?.website;
    this.mobileno = data?.data?.contactno;
    this.isactive = data?.data?.isactive;

    // ------------------------------------
    this.cas_id1 = data?.data?.id;
    this.cas_name1 = data?.data?.casname;
    this.uname1 = data?.data?.username;
    this.password1 = data?.data?.password;
    this.msovendor1 = data?.data?.vendor;
    this.address1 = data?.data?.address;
    this.serviceip1 = data?.data?.serverip;
    this.serverport1 = data?.data?.serverport;
    this.smartcardlength1 = data?.data?.smartcardlength;
    this.boxidlength1 = data?.data?.boxlength;
    this.referenceurl1 = data?.data?.referenceurl;
    this.email1 = data?.data?.email;
    this.website1 = data?.data?.website;
    this.mobileno1 = data?.data?.contactno;
    this.isactive1 = data?.data?.isactive;
  }
  ngOnInit(): void {
    this.casList = this.casid.map((id: any, index: any) => ({
      id: id,
      name: this.formatCasName(this.casname[index])
    }));
  }
  formatCasName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const errorFields = [
      'id', 'casname', 'uname', 'password', 'address', 'vendor',
      'referenceurl', 'website', 'contactno', 'email', 'serverip',
      'serverport', 'smartcardlength', 'boxidlength', 'username', 'role'
    ];
    this.swal.Loading()
    this.userservice.createCas(this.form.value)
      // .subscribe(  (res: any) => {  })
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error?.username);
        const errorMessage = errorFields
          .map(field => err?.error?.[field] || err?.error?.username)
          .find(message => message) || 'An error occurred while creating the subscriber.'
      });
  }
  // editcas() {
  //   // if (form.invalid) {

  //     let requestBody = {
  //       casname: this.cas_name,
  //       uname: this.uname,
  //       password: this.password,
  //       address: this.address,
  //       vendor: this.msovendor,
  //       referenceurl: this.referenceurl,
  //       website: this.website,
  //       contactno: this.mobileno,
  //       email: this.email,
  //       serverip: this.serviceip,
  //       serverport: this.serverport, smartcardlength: this.smartcardlength,
  //       boxidlength: this.boxidlength, role: this.role, username: this.username, isactive: this.isactive, id: this.cas_id
  //     }
  //     console.log('requestBody', requestBody);

  //     const errorFields = [
  //       'id', 'casname', 'uname', 'password', 'address', 'vendor',
  //       'referenceurl', 'website', 'contactno', 'email', 'serverip',
  //       'serverport', 'smartcardlength', 'boxidlength', 'username', 'role'
  //     ];
  //     // this.swal.Loading();
  //     this.userservice.updateCas(requestBody).subscribe((res: any) => {
  //       this.swal.success(res?.message);
  //     }, (err) => {
  //       // this.swal.Error(err?.error?.message);
  //       const errorMessage = errorFields
  //         .map(field => err?.error?.[field])
  //         .find(message => message) || 'An error occurred while creating the subscriber.';
  //       console.error(errorMessage); // Log the error message for debugging
  //     });
  //     // form.control.markAllAsTouched();
  //     return;
  //   // }
  // }
  editcas() {
    const requestBody = {
      casname: this.cas_name,
      uname: this.uname,
      password: this.password,
      address: this.address,
      vendor: this.msovendor,
      referenceurl: this.referenceurl,
      website: this.website,
      contactno: this.mobileno,
      email: this.email,
      serverip: this.serviceip,
      serverport: this.serverport,
      smartcardlength: this.smartcardlength,
      boxidlength: this.boxidlength,
      role: this.role,
      username: this.username,
      isactive: this.isactive,
      id: this.cas_id
    };
    console.log('Request Body:', requestBody);
    this.userservice.updateCas(requestBody).subscribe(
      (res: any) => {
        this.swal.success(res?.message);
      },
      (err) => {
        this.swal.Error(err?.error?.message || err?.error?.id || err?.error?.casname || err?.error?.uname || err?.error?.password || err?.error?.address || err?.error?.vendor ||
          err?.error?.referenceurl || err?.error?.website || err?.error?.contactno || err?.error?.email || err?.error?.serverip || err?.error?.serverport ||
          err?.error?.serverport || err?.error?.smartcardlength || err?.error?.boxidlength
        );
        // this.errorMessage = this.getErrorMessage(err?.error); // Set the error message
        console.error(this.errorMessage);
      },
    );
    const data = ` Old CAS ID : ${this.cas_id1}, ` + ` Old CAS NAME : ${this.cas_name1}, ` + ` Old USER NAME :${this.uname1}, ` + ` Old PASSWORD :${this.password1}, ` + ` Old VENDOR :${this.msovendor1}` + ` Old ADDRESS :${this.address1}, ` + ` Old SERVER IP :${this.serviceip1}, ` + ` Old SERVER PORT :${this.serverport1}, ` + ` Old SMARTCARD LENGTH :${this.smartcardlength1}, ` + ` Old BOXID LENGTH :${this.boxidlength1}, ` + ` Old REFERENCE URL :${this.referenceurl1}, ` + ` Old WEBSITE :${this.website1}, ` + ` Old EMAIL :${this.email1}, ` + ` OLD CONTACT NUMBER :${this.mobileno1}, ` + ` Old ISEMI :${this.isactive1}`;
    const remark = ` NEW CAS ID : ${this.cas_id}, ` + ` NEW CAS NAME : ${this.cas_name}, ` + ` NEW USER NAME :${this.uname}, ` + ` NEW PASSWORD :${this.password}, ` + ` NEW VENDOR :${this.msovendor}` + ` NEW ADDRESS :${this.address}, ` + ` NEW SERVER IP :${this.serviceip}, ` + ` NEW SERVER PORT :${this.serverport}, ` + ` NEW SMARTCARD LENGTH :${this.smartcardlength}, ` + ` NEW BOXID LENGTH :${this.boxidlength}, ` + ` NEW REFERENCE URL :${this.referenceurl}, ` + ` NEW WEBSITE :${this.website}, ` + ` NEW EMAIL :${this.email}, ` + ` NEW CONTACT NUMBER :${this.mobileno}, ` + ` NEW ISEMI :${this.isactive}`;
    this.logCreate('CAS Master Details Button Clicked', data, remark);
  }
  markAllFieldsAsTouched(form: NgForm) {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsTouched();
    });
  }

  getErrorMessage(errors: any): string {
    const errorFields = [
      'id', 'casname', 'uname', 'password', 'address', 'vendor',
      'referenceurl', 'website', 'contactno', 'email', 'serverip',
      'serverport', 'smartcardlength', 'boxidlength', 'username', 'role'
    ];
    return errorFields.map(field => errors?.[field]).find(msg => msg) ||
      'An error occurred while updating CAS details.';
  }
  onDelete() { }
  refresh() {
    this.submitted = false;
    this.form.reset();
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
    this.userservice.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);
    })
  }
}
