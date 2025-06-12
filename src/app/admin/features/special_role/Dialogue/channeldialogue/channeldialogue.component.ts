import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-channeldialogue',
  templateUrl: './channeldialogue.component.html',
  styleUrls: ['./channeldialogue.component.scss']
})
export class ChanneldialogueComponent implements OnInit {
  username: any;
  role: any;
  type: any;
  channelname: any;
  channelname1: any;
  url: any;
  channellogo: any;
  categoryid: any = 0;
  categoryname: any;
  categorylist: any[] = [];
  isactive: boolean = false;
  isactive1: boolean = false;
  id: any;
  createForm !: FormGroup;
  editform !: FormGroup;
  file: File | null = null;
  selectedFile: File | null = null;
  filePath: string = '';
  isFileSelected: boolean = false;
  fileError: boolean = false;

  userid: any;
  accessip: any;
  constructor(public dialogRef: MatDialogRef<ChanneldialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
    console.log(data);
    this.type = data?.type;
    this.channelname = data.data?.channelName;
    this.channelname1 = data.data?.channelName;
    this.url = data.data?.url;
    this.channellogo = data.data?.logo;
    console.log('43555555555555555555555', this.channellogo);

    this.categoryid = data.data?.categoryId;
    this.categoryname = data.data?.categoryname;
    this.isactive = data.data?.isactive;
    this.id = data.data?.channelId;
    console.log(this.channelname);

    this.createForm = this.fb.group({
      channelname: ['', Validators.required],
      // url: ['', [Validators.required, Validators.pattern('(http?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')]],
      url: ['', [
        Validators.required,
        Validators.pattern(/^(https?:\/\/www\.[a-zA-Z0-9-]+\.(com|in|net|org|edu|gov|info|co))$/)
      ]],
      logo: ['', Validators.required],
      categoryid: ['', Validators.required],
    });
    this.editform = this.fb.group({
      channelname: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')]],
      logo: ['', Validators.required],
      categoryid: ['', Validators.required],
      isactive: ['', [Validators.required]],
      id: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.Category_list();
  }
  onClick(): void {
    this.dialogRef.close();
  }

  Category_list() {
    this.userservice.CategoryList(this.role, this.username, 0).subscribe((data) => {
      console.log(data);
      this.categorylist = data.map((item: any) => ({
        id: item.id,
        category: item.name
      }));
      console.log();
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];

      if (validTypes.includes(file.type)) {
        this.isFileSelected = true;
        this.file = file;
        this.filePath = file.name;
        this.fileError = false;
        console.log(this.file);
      } else {
        this.isFileSelected = false;
        this.file = null;
        this.filePath = '';
        this.fileError = true;
        console.error('Invalid file type. Please upload a PNG, JPG, or JPEG image.');
      }
    } else {
      this.isFileSelected = false;
      this.file = null;
      this.filePath = '';
      this.fileError = true;
    }
  }


  onSubmit() {
    // if (this.createForm.invalid || !this.file) {
    //   this.fileError = !this.file;
    //   return;
    // }
    this.swal.Loading();
    const formData = new FormData();
    formData.append('role', this.role);
    formData.append('username', this.username);
    formData.append('channelname', this.createForm.get('channelname')?.value);
    formData.append('url', this.createForm.get('url')?.value);
    formData.append('categoryid', this.createForm.get('categoryid')?.value);
    // formData.append('isactive', this.createForm.get('isactive')?.value);
    // formData.append('id', this.createForm.get('id')?.value);

    if (this.file) {
      formData.append('logo', this.file);
    }
    this.userservice.specialCreateLocalChannel(formData).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }

  onEditsubmit() {
    // if (this.editform.invalid || !this.file) {
    //   this.fileError = !this.file;
    //   return;
    // }
    this.swal.Loading();
    const formData = new FormData();
    formData.append('role', this.role);
    formData.append('username', this.username);
    formData.append('channelname', this.editform.get('channelname')?.value);
    formData.append('url', this.editform.get('url')?.value);
    formData.append('categoryid', this.editform.get('categoryid')?.value);
    formData.append('isactive', this.isactive.toString());
    formData.append('id', this.id);

    if (this.file) {
      formData.append('logo', this.file);
    }
    this.userservice.specialeditLocalChannel(formData).subscribe((res: any) => {
      this.swal.success(res?.message);
      const data = `Channel Name: ${this.channelname}, ` + ` Category Name: ${this.categoryname},` + ` Status: ${this.isactive},`;
      const remark = `Channel Name: ${this.channelname1}, ` + ` Category Name: ${this.categoryname},` + ` Status: ${this.isactive1},`;
      this.logCreate('CAS Master Update Button Clicked', remark, data);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });

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
