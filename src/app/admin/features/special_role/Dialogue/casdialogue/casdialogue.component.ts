import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  submitted = false;
  smartcart_length = '0.00'
  boxid_length = '0.00'
  type: any;
  casid: any;

  casname: any;
  editcasmaster: any;
  casList: { id: number; name: string }[] = [];

  // --------------------casEdit-------------------
  cas_id: any;
  cas_name: any;
  msovendor: any;
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

  constructor(public dialogRef: MatDialogRef<CasdialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userService: BaseService, private storageservice: StorageService, private fb: FormBuilder) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(data);
    this.type = data?.type;
    this.casid = data?.id;

    this.casname = data?.casname;
    this.form = this.fb.group({
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
      username: [this.storageservice.getUsername(), Validators.required],
      role: [this.storageservice.getUserRole(), Validators.required],
    });


    // -------------------------editcasmaster-------------------
    this.editcasmaster = data?.data;
    this.cas_id = this.editcasmaster.id;
    this.cas_name = this.editcasmaster.casname;
    this.msovendor = this.editcasmaster.vendor;
    this.address = this.editcasmaster.address;
    this.serviceip = this.editcasmaster.serverip;
    this.serverport = this.editcasmaster.serverport;
    this.smartcardlength = this.editcasmaster.smartcardlength;
    this.boxidlength = this.editcasmaster.boxlength;
    this.referenceurl = this.editcasmaster.referenceurl;
    this.email = this.editcasmaster.email;
    this.website = this.editcasmaster.website;
    this.mobileno = this.editcasmaster.contactno;
    this.isactive = this.editcasmaster.isactive;

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
      'casname', 'uname', 'password', 'address', 'vendor',
      'referenceurl', 'website', 'contactno', 'email', 'serverip',
      'serverport', 'smartcardlength', 'boxidlength', 'username', 'role'
    ];
    this.swal.Loading()
    this.userService.createCas(this.form.value)
      // .subscribe(  (res: any) => {  })
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        // this.swal.Error(err?.error?.message);
        const errorMessage = errorFields
          .map(field => err?.error?.[field])
          .find(message => message) || 'An error occurred while creating the subscriber.'
      });
  }
  editcas() { }
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
