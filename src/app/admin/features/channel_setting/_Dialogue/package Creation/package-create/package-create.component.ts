import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-package-create',
  templateUrl: './package-create.component.html',
  styleUrls: ['./package-create.component.scss']
})
export class PackageCreateComponent {
  username: any;
  role: any;
  toppings = new FormControl('');
  selectedFile: File | any = null;
  arrayFile: any = [];
  url = './assets/images/no_image_available.jpeg';
  toppingsArray: string[] = ['ENSCURITY', 'RCAS', 'ABVCAS'];
  createpackageForm!: FormGroup;
  tax_amount: number = 0.0;
  customer_amount: number = 0.0;
  mso_amount: number = 0.0;
  isPercentage: boolean = false;
  cas: any[] = [];
  selected: any
  proofFormControl: any = new FormControl();
  constructor(
    public dialogRef: MatDialogRef<PackageCreateComponent>, private userservice: BaseService, private storageService: StorageService, private fb: FormBuilder
  ) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.createpackageForm = this.fb.group({
      proofFormControl: ['', Validators.required],
      package_name: ['', Validators.required],
      castype: ['', Validators.required],
      package_desc: ['', Validators.required],
      package_rate: ['', [Validators.required,]],
      tax_amount: ['', Validators.required],
      commission: ['', Validators.required],
      customer_amount: ['', Validators.required],
      mso_amount: ['', Validators.required],
      order_id: ['', Validators.required],
      ispercentage: [false, Validators.required],
    });
    this.createpackageForm.get('isactive')?.valueChanges.subscribe(value => {
      this.isPercentage = value;
      this.calculateAmounts();  // Recalculate amounts whenever checkbox changes
    });
    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
      console.log(this.cas);
    });
  }
  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file && file.type === 'image/png') {
  //     this.selectedFile = file;
  //     this.createpackageForm.patchValue({
  //       package_logo: file
  //     });
  //     // this.createpackageForm.get('package_logo')?.markAsDirty();
  //   } else {
  //     this.selectedFile = null;
  //     this.createpackageForm.patchValue({
  //       package_logo: null
  //     });
  //     // this.createpackageForm.get('package_logo')?.markAsDirty();
  //   }
  //   console.log(file);

  // }
  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // onFileSelected(event: any) {
  //   this.selectedFile = <File>event.target.files[0];
  //   let fileType = event.target.files[0].type;
  //   if (fileType.match(/image\/*/)) {
  //     let reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.onload = (event: any) => {
  //       console.log(this.url)
  //       this.url = event.target.result;
  //       console.log(this.url);
  //       this.arrayFile.push(this.selected)
  //     };
  //   } else {
  //     window.alert('Please select correct image format');
  //   }
  //   console.log(this.selectedFile);
  // }

  onKeyup(event: KeyboardEvent) {
    // Add your logic to handle keyup event here
    console.log('Keyup event: ', event);

  }

  calculateAmounts() {
    const rate = parseFloat(this.createpackageForm.get('package_rate')?.value || '0');
    if (rate > 0) {
      this.tax_amount = Math.round(rate * 0.18 * 100) / 100;
      this.customer_amount = rate + this.tax_amount;
      this.createpackageForm.get('tax_amount')?.setValue(this.tax_amount, { emitEvent: false });
      this.createpackageForm.get('customer_amount')?.setValue(this.customer_amount, { emitEvent: false });
    } else {
      this.tax_amount = 0.0;
      this.customer_amount = 0.0;
      this.createpackageForm.get('tax_amount')?.setValue(this.tax_amount, { emitEvent: false });
      this.createpackageForm.get('customer_amount')?.setValue(this.customer_amount, { emitEvent: false });
    }
  }


  calculateMsoCommission() {
    const commission = parseFloat(this.createpackageForm.get('commission')?.value || '0');
    if (this.isPercentage) {
      if (commission > 100) {
        if ((this.customer_amount * commission) / 100 < this.customer_amount) {
          this.mso_amount = this.customer_amount - (this.customer_amount * commission) / 100;
        } else {
          this.mso_amount = 0;
          console.error("Percentage should be less than Customer Amount");
        }
      } else {
        if (commission < 100) {
          this.mso_amount = this.customer_amount - (this.customer_amount * commission) / 100;
        } else {
          this.mso_amount = 0;
          console.error("Percentage should be less than 100%");
        }
      }
    } else {
      if (commission < this.customer_amount) {
        this.mso_amount = this.customer_amount - commission;
      } else {
        this.mso_amount = 0;
        console.error("Commission amount should be less than Customer amount");
      }
    }
    this.createpackageForm.get('mso_amount')?.setValue(this.mso_amount, { emitEvent: false });
  }
  Createpackage() {
    // if (this.createpackageForm.invalid) {
    //   return;
    // }
    console.log(File);

    const formData = new FormData();
    formData.append('package_logo', this.selectedFile);
    formData.append('package_name', this.createpackageForm.get('package_name')?.value);
    // formData.append('castype', this.createpackageForm.get('castype')?.value);
    formData.append('package_desc', this.createpackageForm.get('package_desc')?.value);
    formData.append('package_rate', this.createpackageForm.get('package_rate')?.value || 0);
    formData.append('tax_amount', this.tax_amount.toString());
    formData.append('commission', this.createpackageForm.get('commission')?.value || 0);
    formData.append('customer_amount', this.customer_amount.toString());
    formData.append('mso_amount', this.mso_amount.toString());
    formData.append('order_id', this.createpackageForm.get('order_id')?.value || 0);
    formData.append('ispercentage', this.createpackageForm.get('ispercentage')?.value.toString());
    formData.append('role', this.role);
    formData.append('username', this.username);

    console.log(formData);
    this.userservice.CREATE_BASE_PACKAGE(formData).subscribe(
      (res) => {
        console.log(res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Package Created Successfully!!",
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
  onNoClick(): void {
    this.dialogRef.close();
  }

  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
