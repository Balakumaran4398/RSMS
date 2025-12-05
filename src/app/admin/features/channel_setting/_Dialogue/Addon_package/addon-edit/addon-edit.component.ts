import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-addon-edit',
  templateUrl: './addon-edit.component.html',
  styleUrls: ['./addon-edit.component.scss']
})
export class AddonEditComponent implements OnInit {
  addon_package_name: any;
  addon_package_name_1: any;
  addon_package_rate: any;
  addon_package_description: any;
  addon_package_description1: any;
  addon_package_rate_1: any;
  addon_package_description_1: any;
  taxRate: number = 1;
  package_id: any;
  id: any;
  username: any;
  order_id: any;
  broadcaster_id: any;
  broadcaster_id1: any;
  commission: any;
  commission1: any;
  tax_amount: any = '0.0';
  customer_amount: any = '0.0';
  mso_amount: any = '0.0';
  ispercentage: boolean = true;
  ispercentage_1: boolean = true;
  role: any;
  invalid: boolean = false;
  broadcaster_list: any[] = [];
  userid: any;
  accessip: any;
  constructor(
    public dialogRef: MatDialogRef<AddonEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private swal: SwalService, private storageService: StorageService, private cdr: ChangeDetectorRef) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
    this.id = data.id;
    this.order_id = data.order_id;
    this.broadcaster_id = data.broadcaster_id;
    this.broadcaster_id1 = data.broadcaster_id;
    this.commission = data.customeramount;
    this.commission1 = data.customeramount;
    this.ispercentage = data.ispercentage;
    this.ispercentage_1 = data.ispercentage;
    this.addon_package_name = data.addon_package_name;
    this.addon_package_name_1 = data.addon_package_name;
    this.addon_package_rate = data.addon_package_rate;
    this.addon_package_rate_1 = data.addon_package_rate;
    this.addon_package_name_1 = data.addon_package_name;
    this.addon_package_description = data.addon_package_description
    this.addon_package_description1 = data.addon_package_description
    this.tax_amount = 0;
    this.customer_amount = data.customeramount
    this.mso_amount = 0;
    this.taxRate = data.taxRate
  }

  ngOnInit(): void {
    this.loadBroadcasterList();
    this.checkMaxValue();
  }
  ngAfterViewInit(): void {
    $('#broadcaster').select2({
      placeholder: 'Select Broadcaster',
      allowClear: true
    });
    $('#broadcaster').on('change', (event: any) => {
      console.log(event);

      this.broadcaster_id = event.target.value;
      console.log(this.broadcaster_id);

      this.onBroadcasterChange(this.broadcaster_id);
    });
  }
  loadBroadcasterList(): void {
    this.userService.BroadcasterList(this.role, this.username, 1).subscribe(
      (data: any) => {
        this.broadcaster_list = Object.keys(data).map((key) => ({
          name: key,
          value: data[key],
        }));
        console.log(this.broadcaster_list);

        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching Broadcaster List', error);
      }
    );
  }
  onBroadcasterChange(event: any): void {
    console.log(event);

    // const selectedValue = (event.target as HTMLSelectElement).value;
    // this.broadcaster_id = selectedValue;
    this.broadcaster_id = event;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  onKeydown1(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key) || /^[0-9.]*$/.test(event.key)) {
      return;
    }
    this.checkMaxValue();
    event.preventDefault();
  }
  onFocus() {
    if (this.commission === '0.0') {
      this.commission = '';
    }
  }

  onBlur() {
    if (!this.commission || this.commission === '') {
      this.commission = '0.0';
    }
  }

  percentageChange(value: boolean) {
    this.ispercentage = value;
    this.checkMaxValue();
  }
  checkMaxValue(): void {
    if (!this.ispercentage && (this.commission > this.addon_package_rate)) {
      console.log('if');

      this.invalid = true;
    } else if (this.ispercentage && this.commission > 100) {
      console.log('else');

      this.invalid = true;
    } else {
      console.log('final else');

      this.invalid = false;
    }
    this.cdr.detectChanges();
    console.log(this.ispercentage);
    console.log(this.commission);
    console.log(this.addon_package_rate);



    console.log('invalid-------------------------------' + this.invalid);

  }
  onKeydown2(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

    if (/^[0-9]$/.test(event.key)) return;
    if (event.key === '.') {
      if ((event.target as HTMLInputElement).value.includes('.')) {
        event.preventDefault();
      }
      return;
    }
    if (allowedKeys.includes(event.key)) return;
    event.preventDefault();
  }
  Update_Addon_package() {
    console.log(this.broadcaster_id);
    const request = {
      id: this.id,
      addon_package_name: this.addon_package_name,
      addon_package_rate: this.addon_package_rate,
      broadcaster_id: this.broadcaster_id,
      addon_package_description: this.addon_package_description,
      order_id: this.order_id,
      commission: this.commission,
      ispercentage: this.ispercentage,
      username: this.username,
      role: this.role,
      mso_amount: this.mso_amount,
      package_id: this.package_id,
      tax_amount: this.tax_amount,
      customer_amount: this.customer_amount,
    };
    Swal.fire({
      title: 'Updating...',
      text: 'Wait for the package to update...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userService.UPDATE_ADDON_PACKAGE(request)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });




        const newData: { [key: string]: any } = {
          addon_package_name: this.addon_package_name,
          addon_package_rate: this.addon_package_rate,
          broadcaster_id: this.broadcaster_id,
          addon_package_description: this.addon_package_description,
          commission: this.commission,
          ispercentage: this.ispercentage
        };

        const oldData: { [key: string]: any } = {
          addon_package_name: this.addon_package_name_1,
          addon_package_rate: this.addon_package_rate_1,
          broadcaster_id: this.broadcaster_id1,
          addon_package_description: this.addon_package_description1,
          commission: this.commission1,
          ispercentage: !this.ispercentage
        };

        let remarkParts: string[] = [];
        let dataParts: string[] = [];

        for (const key in oldData) {
          if (oldData[key] !== newData[key]) {
            remarkParts.push(`Old ${key}: ${oldData[key]}`);
            dataParts.push(`New ${key}: ${newData[key]}`);
          }
        }

        const remark = remarkParts.join(', ');
        const data = dataParts.join(', ');



    this.logCreate('Addon Edit Button Clicked', remark, data);

  }

  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userService.createLogs(requestBody).subscribe((res: any) => { console.log(res); })
  }
}
