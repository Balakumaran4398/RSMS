import { ChangeDetectorRef, Component, OnInit,OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
declare var $:any;
@Component({
  selector: 'app-addon-creation',
  templateUrl: './addon-creation.component.html',
  styleUrls: ['./addon-creation.component.scss']
})
export class AddonCreationComponent implements OnInit,OnDestroy{
  addon_package_name: any;
  addon_package_rate: any;
  addon_package_description: any;
  order_id: any;
  commission: any;
  _active: boolean = false;
  submitted = false;
  createpackageForm!: FormGroup;
  username: any;
  role: any;
  tax_amount: number = 0.0;
  customer_amount: number = 0.0;
  mso_amount: number = 0.0;
  isPercentage: boolean = true;
  taxRate: number = 1;

  issave: boolean = false;

  // type: any = [
  //   { lable: "MSO", value: 1 },
  //   { lable: "SMARTCARD", value: 2 },
  //   { lable: "AREA CODE", value: 3 },
  // ];
  type: any[] = [];
  broadcaster_id:any;
  TypeFormControl: any = 0;
  constructor(
    public dialogRef: MatDialogRef<AddonCreationComponent>, private cdr: ChangeDetectorRef, private userservice: BaseService, private storageService: StorageService, private fb: FormBuilder
  ) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userservice.BroadcasterList(this.role, this.username, 1).subscribe((data) => {
      console.log(data);
      // this.rowData = data;
      this.type = data;
      // this.type = data.map((item: any) => item.id);
      // console.log(this.type);
    })

    this.createpackageForm = this.fb.group({
      // package_logo: ['', Validators.required],
      addon_package_name: ['', Validators.required],
      addon_package_description: ['', Validators.required],
      addon_package_rate: ['', [Validators.required,]],
      tax_amount: [0, Validators.required],
      commission: ['', Validators.required],
      broadcaster_id: ['', Validators.required],
      customer_amount: [0, Validators.required],
      mso_amount: [0, Validators.required],
      order_id: ['', Validators.required],
      ispercentage: [false, Validators.required],
      role: this.role,
      username: this.username,
    });
    this.isPercentage = false;
    // this.createpackageForm.get('isactive')?.valueChanges.subscribe(value => {
    //   this.isPercentage = value;
    //   // this.calculateAmounts();  // Recalculate amounts whenever checkbox changes
    // });

  }
  ngOnDestroy(): void {
    ($('#broadcaster') as any).select2('destroy');
  }
  ngOnInit(): void {
    $('#broadcaster').select2({
      placeholder: 'Select Broadcaster',
      allowClear: true
    });
    $('#broadcaster').on('change', (event: any) => {
      this.broadcaster_id = event.target.value;
      this.onBroadcasterChange(this.broadcaster_id);
    });
  }
  onBroadcasterChange(event: any): void {
    console.log(event);
    
    // const selectedValue = (event.target as HTMLSelectElement).value;
    // this.broadcaster_id = selectedValue;
    this.broadcaster_id = event;
  }
  onKeydown1(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key) || /^[0-9.]*$/.test(event.key)) {
      return;
    }
    event.preventDefault();
  }

  onFocus() {
    if (this.commission == '0.0') {
      this.commission = '';
    }
  }

  onBlur() {
    if (!this.commission || this.commission == '') {
      this.commission = '0.0';
    }
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
  get f(): { [key: string]: AbstractControl } {
    return this.createpackageForm.controls;
  }
  // calculateAmounts() {
  //   const rate = parseFloat(this.createpackageForm.get('addon_package_rate')?.value || '0');
  //   if (rate > 0) {
  //     this.tax_amount = Math.round(rate * 0.18 * 100) / 100;
  //     this.customer_amount = rate + this.tax_amount;
  //     this.createpackageForm.get('tax_amount')?.setValue(this.tax_amount, { emitEvent: false });
  //     this.createpackageForm.get('customer_amount')?.setValue(this.customer_amount, { emitEvent: false });
  //   } else {
  //     this.tax_amount = 0.0;
  //     this.customer_amount = 0.0;
  //     this.createpackageForm.get('tax_amount')?.setValue(this.tax_amount, { emitEvent: false });
  //     this.createpackageForm.get('customer_amount')?.setValue(this.customer_amount, { emitEvent: false });
  //   }
  // }


  // calculateMsoCommission() {
  //   const commission = parseFloat(this.createpackageForm.get('commission')?.value || '0');
  //   if (this.isPercentage) {
  //     if (commission > 100) {
  //       if ((this.customer_amount * commission) / 100 < this.customer_amount) {
  //         this.mso_amount = this.customer_amount - (this.customer_amount * commission) / 100;
  //       } else {
  //         this.mso_amount = 0;
  //         console.error("Percentage should be less than Customer Amount");
  //       }
  //     } else {
  //       if (commission < 100) {
  //         this.mso_amount = this.customer_amount - (this.customer_amount * commission) / 100;
  //       } else {
  //         this.mso_amount = 0;
  //         console.error("Percentage should be less than 100%");
  //       }
  //     }
  //   } else {
  //     if (commission < this.customer_amount) {
  //       this.mso_amount = this.customer_amount - commission;
  //     } else {
  //       this.mso_amount = 0;
  //       console.error("Commission amount should be less than Customer amount");
  //     }
  //   }
  //   this.createpackageForm.get('mso_amount')?.setValue(this.mso_amount, { emitEvent: false });
  // }
  Createpackage() {

    // const formData = new FormData();
    // formData.append('package_name', this.createpackageForm.get('package_name')?.value);
    // formData.append('package_desc', this.createpackageForm.get('package_desc')?.value);
    // formData.append('package_rate', this.createpackageForm.get('package_rate')?.value || 0);
    // formData.append('commission', this.createpackageForm.get('commission')?.value || 0);
    // formData.append('broadcaster', this.createpackageForm.get('broadcaster')?.value);
    // formData.append('isactive', this.createpackageForm.get('isactive')?.value.toString());
    // formData.append('customer_amount', this.createpackageForm.get('customer_amount')?.value.toString());
    // formData.append('mso_amount', this.createpackageForm.get('mso_amount')?.value.toString());
    // formData.append('order_id', this.createpackageForm.get('order_id')?.value.toString());
    // formData.append('tax_amount', this.createpackageForm.get('tax_amount')?.value.toString());
    // formData.append('role', this.role);
    // formData.append('username', this.username);

    // console.log(formData);
    this.userservice.CREATE_ADDON_PACKAGE(this.createpackageForm.value).subscribe(
      (res) => {
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

  percentageValue(value: boolean) {
    console.log('workingdsjfklsdjl', value);
    this.isPercentage = value;

    this.createpackageForm.get('ispercentage')?.setValue(value);




    var msoamt = 0;
    if (value) {
      console.log('if');

      msoamt = Math.round(Number(this.createpackageForm.get('addon_package_rate')?.value * (this.createpackageForm.get('commission')?.value / 100)));
    } else {
      console.log('else');
      msoamt = Math.round(Number(this.createpackageForm.get('addon_package_rate')?.value - (this.createpackageForm.get('commission')?.value)));


    }


    this.createpackageForm.get('mso_amount')?.setValue(msoamt);

    console.log(this.createpackageForm.get('mso_amount')?.value);

    this.checkMaxValue();
  }

  checkMaxValue(): void {

    console.log(this.createpackageForm.value);
    
    
    if (!this.isPercentage && (this.createpackageForm.get('mso_amount')?.value.toString().includes('-'))) {
      this.issave = true;
    } else if (this.isPercentage && this.createpackageForm.get('commission')?.value > 100) {
      this.issave = true;
    } else {
      this.issave = false;
    }
    console.log('isave---------------------------' + this.issave);

    this.cdr.detectChanges();
  }

}
