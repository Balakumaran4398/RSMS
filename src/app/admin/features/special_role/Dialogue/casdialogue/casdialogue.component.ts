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
  boxid_length :any;
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
  constructor(public dialogRef: MatDialogRef<CasdialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService, private fb: FormBuilder) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
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
    console.log('serviceip', this.serviceip);

    this.serverport = data?.data?.serverport;
    this.smartcardlength = data?.data?.smartcardlength;
    this.boxidlength = data?.data?.boxlength;
    this.referenceurl = data?.data?.referenceurl;
    this.email = data?.data?.email;
    this.website = data?.data?.website;
    this.mobileno = data?.data?.contactno;
    this.isactive = data?.data?.isactive;

    // ------------------------------------
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
    // if (casForm.invalid) { // Validate before submission
    //   this.markAllFieldsAsTouched(casForm);
    //   return;
    // }

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
        console.error(this.errorMessage); // Centralized error logging
      }
    );
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
}
