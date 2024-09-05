import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-add-ltb',
  templateUrl: './add-ltb.component.html',
  styleUrls: ['./add-ltb.component.scss']
})
export class AddLtbComponent {
  form!: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<AddLtbComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name_head: ['', Validators.required],
        ltb_name: ['', Validators.required],
        mobileno: ['', Validators.required],
        email: ['', [Validators.required,Validators.email]],
        address: ['', [Validators.required,]],
        area: ['', [Validators.required]],
        state: ['', [Validators.required]],
        pincode: ['', [Validators.required]],
        userid: ['', [Validators.required]],
        password: ['', [Validators.required]],
      });
  }
  onSubmit(form: any): void {
    this.submitted = true;
    console.log('sdsdfs');

    if (form.invalid) {
      console.log('Form is invalid. API call not made.');
      return;
    }
    const fd = new FormData();
    fd.append('name_head', this.form?.value?.name_head);
    fd.append('ltb_name', this.form?.value?.ltb_name);
    fd.append('mobileno', this.form?.value?.mobileno);
    fd.append('email', this.form?.value?.email);
    fd.append('address', this.form?.value?.address);
    fd.append('area', this.form?.value?.area);
    fd.append('state', this.form?.value?.state);
    fd.append('pincode', this.form?.value?.pincode);
    fd.append('userid', this.form?.value?.userid);
    fd.append('password', this.form?.value?.password);
  }
  onKeydown(e: any) {
    // console.log(e.keyCode);
    var key = e.keyCode;
    // Only allow numbers to be entered
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}