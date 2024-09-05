import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-channel-create',
  templateUrl: './channel-create.component.html',
  styleUrls: ['./channel-create.component.scss']
})
export class ChannelCreateComponent {
  toggleState = false;
  submitted = false;
  form!: FormGroup;
  username: any;
  channel_logo: any;
  type: number = 0;
  channel_freq: any;
  broadcaster_id: any;
  broadcaster: any[] = [];
  ts_id: any; service_id: any; product_id: any; ispaid: boolean = false; inr_amt: any; channel_type_id: any; category_id: any;
  role: any; distributor_id: any; commssion: any; isactive: boolean = false; channel_desc: any;
  selectedFile: File | null = null;
  channel_name: any;
  constructor(
    public dialogRef: MatDialogRef<ChannelCreateComponent>, private formBuilder: FormBuilder, private userservice: BaseService, private storageService: StorageService
  ) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.form = this.formBuilder.group(
      {
        channel_name: ['', Validators.required],
        channel_logo: ['', Validators.required],
        channel_freq: ['', Validators.required],
        channel_desc: ['', Validators.required],
        ts_id: ['', [Validators.required,]],
        service_id: ['', [Validators.required]],
        product_id: ['', [Validators.required]],
        ispaid: [false, [Validators.required]],
        inr_amt: ['', [Validators.required]],
        channel_type_id: ['', [Validators.required]],
        category_id: ['', [Validators.required]],
        broadcaster_id: ['', [Validators.required]],
        broadcaster_rate: ['', [Validators.required]],
        distributor_id: ['', [Validators.required]],
        commssion: ['', [Validators.required]],
        isactive: [false, [Validators.required]],
      },
    );
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
      this.selectedFile = file;
      this.form.patchValue({
        chann_logo: file
      });
    } else {
      this.selectedFile = null;
      this.form.patchValue({
        chann_logo: null
      });
    }
  }
  ngOnInit(): void {
    this.Broadcaster_list();
    this.Distributor_list();
    this.Category_list();
    this.Channel_type_list();
  }
  Broadcaster_list() {
    this.userservice.BroadcasterList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.broadcaster_id = data.map((item: any) => ({
        id: item.id,
        broadcastername: item.broadcastername
      }));
      console.log();
    })
  }
  Distributor_list() {
    this.userservice.DistributorList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.distributor_id = data.map((item: any) => ({
        id: item.id,
        distributor: item.name
      }));
      console.log();
    })
  }
  Category_list() {
    this.userservice.CategoryList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.category_id = data.map((item: any) => ({
        id: item.id,
        category: item.name
      }));
      console.log();
    })
  }
  Channel_type_list() {
    this.userservice.ChannelTypeList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.channel_type_id = data.map((item: any) => ({
        id: item.id,
        channel_type: item.name
      }));
      console.log();
    })
  }
  remo = "p"
  onSubmit(): void {
    console.log('1111111');
    console.log(this.form.value);

    // if (form.invalid) {
    //   console.log('Form is invalid. API call not made.');
    //   return;
    // }
    const fd = new FormData();
    fd.append('channel_name', this.form?.get('channel_name')?.value);
    fd.append('channel_logo', this.selectedFile as File);
    fd.append('channel_freq', this.form?.get('channel_freq')?.value);
    fd.append('channel_desc', this.form?.get('channel_desc')?.value);
    fd.append('ts_id', this.form?.get('ts_id')?.value);
    fd.append('service_id', this.form?.get('service_id')?.value);
    fd.append('broadcaster_rate', this.form?.get('broadcaster_rate')?.value);
    fd.append('product_id', this.form?.get('product_id')?.value);
    fd.append('ispaid', this.form?.get('ispaid')?.value)
    fd.append('inr_amt', this.form?.get('inr_amt')?.value);
    fd.append('channel_type_id', this.form?.get('channel_type_id')?.value);
    fd.append('category_id', this.form?.get('category_id')?.value);
    fd.append('broadcaster_id', this.form?.get('broadcaster_id')?.value);
    fd.append('distributor_id', this.form?.get('distributor_id')?.value);
    fd.append('commssion', this.form?.get('commssion')?.value);
    fd.append('isactive', this.form?.get('isactive')?.value);
    fd.append('role', this.role);
    fd.append('username', this.username);
    console.log(fd);
   
    this.userservice.CREATE_CHANNEL(fd).subscribe(
      (res) => {
        console.log('1111111');
        console.log(res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Package Created Successfull!!",
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          window.location.reload();
          this.closeDialog();
        });
      },
      (err) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'An error occurred',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
  closeDialog() {
    this.dialogRef.close();
  }
  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
