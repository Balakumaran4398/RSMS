import { ChangeDetectorRef, Component } from '@angular/core';
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
    public dialogRef: MatDialogRef<PackageCreateComponent>, private userservice: BaseService, private storageService: StorageService, private cdr: ChangeDetectorRef, private fb: FormBuilder
  ) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.createpackageForm = this.fb.group({
      package_logo: ['', Validators.required],
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
      ispercentage: [true, Validators.required],
    });
    // this.createpackageForm.get('ispercentage')?.valueChanges.subscribe(value => {
    //   // this.isPercentage = value;
    //   this.calculateAmounts();  // Recalculate amounts whenever checkbox changes
    // });
    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
      console.log(this.cas);
    });
  }
  
  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  

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


  
  calculateMsoCommission(type:any) {
    if (type == 'percentage') {
      this.isPercentage = !this.isPercentage;
    }
    const commission = parseFloat(this.createpackageForm.get('commission')?.value || '0');
    if (this.customer_amount <= 0) {
      console.error("Customer amount must be greater than 0");
      this.mso_amount = 0;
      this.createpackageForm.get('mso_amount')?.setValue(this.mso_amount, { emitEvent: false });
      return;
    }
    console.log(this.isPercentage);
    // this.isPercentage = !this.isPercentage;
    if (this.isPercentage) {
      if (commission >= 0 && commission <= 100) {
        this.mso_amount = this.customer_amount - (this.customer_amount * commission) / 100;
        console.log(this.mso_amount);

      } else {
        console.error("Commission percentage must be between 0 and 100");
        this.mso_amount = 0;
      }
    } else {
      if (commission >= 0 && commission <= this.customer_amount) {
        this.mso_amount = this.customer_amount - commission;
        console.log(this.mso_amount);

      } else {
        console.error("Fixed commission must be less than or equal to the customer amount");
        this.mso_amount = 0;
      }
    }

    this.createpackageForm.get('mso_amount')?.setValue(this.mso_amount, { emitEvent: false });
    this.cdr.detectChanges();
  }
  Createpackage() {
    if (this.createpackageForm.invalid) {
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
      formData.append('ispercentage', (!this.createpackageForm.get('ispercentage')?.value).toString());
      formData.append('role', this.role);
      formData.append('username', this.username);
      console.log(formData);
      Swal.fire({
        title: 'Updating...',
        text: 'Please wait while the Package Creation is being updated',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      this.userservice.CREATE_BASE_PACKAGE(formData).subscribe(
        (res) => {
          console.log(res);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Package Created Successfully!!",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
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
            timer: 2000,
            timerProgressBar: true
          });
        }
      );
      this.createpackageForm.markAllAsTouched();
      return;
    }

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
