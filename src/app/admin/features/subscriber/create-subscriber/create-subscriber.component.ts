import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { SwalService } from 'src/app/_core/service/swal.service';


@Component({
  selector: 'app-create-subscriber',
  templateUrl: './create-subscriber.component.html',
  styleUrls: ['./create-subscriber.component.scss'],
  providers: [DatePipe]
})
export class CreateSubscriberComponent {
  submitted = false;
  maskPattern: string = '';
  maxLength: number | undefined;
  exampleFormat: string | undefined;
  form!: FormGroup;
  operatorid: any;
  areaid: any;
  streetid: any;
  idproof: any;
  addressproof: any;
  casformid: any;
  customername: any;
  isLinear = false;
  // ProofForm: FormGroup ;
  selectedIdProof: string = '';
  selectedAddProof: string = '';

  lco_list: { [key: string]: number } = {};
  area_list: { [key: string]: number } = {};
  street_list: { [key: string]: number } = {};
  id_proof_list: { [key: string]: number } = {};
  add_proof_list: { [key: string]: number } = {};
  filterd_proof_list: any[] = [];

  searchTerm: string = '';
  username: any;
  role: any;
  selectedaddproof_1: any;
  selectedAddProofType: string = '';  // To store the label like "Aadhaar Card"
  selectedIDProofType: string = '';
  // proofType:any;

  constructor(private formBuilder: FormBuilder, private userservice: BaseService, private swal: SwalService, private cdr: ChangeDetectorRef, private storageservice: StorageService, private datePipe: DatePipe) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    userservice.getOperatorListforSubInsert(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lco_list = data.operatorid;
      console.log(this.lco_list);
    })

  }

  ngOnInit(): void {

    this.form = this.formBuilder.group(
      {
        operatorid: ['', Validators.required || 0],
        areaid: ['', Validators.required || 0],
        streetid: ['', Validators.required || 0],
        casformid: ['', Validators.required],
        customername: ['', [Validators.required,]],
        customernamelast: ['', [Validators.required]],
        fathername: ['', [Validators.required]],
        dateofbirth: ['', [Validators.required]],
        address: ['', [Validators.required]],
        installaddress: ['', [Validators.required]],
        mobileno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        landlineno: ['', [Validators.required, Validators.pattern('^0\\d{8,10}$')]],
        email: ['', [Validators.required, Validators.email]],
        formsubmissiondate: ['', [Validators.required]],
        addressproof: ['', [Validators.required] || 0],
        idproof: ['', [Validators.required] || 0],
        idprooftypeid: ['', Validators.required],
        addressprooftypeid: ['', Validators.required]
      },
    );
    this.loadIdProofList();
    this.loadAddProofList();
  }


  filteredLcoKeys(): string[] {
    const keys = Object.keys(this.lco_list);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  filteredAreaKeys(): string[] {
    const keys = Object.keys(this.area_list);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  filteredStreetKeys(): string[] {
    const keys = Object.keys(this.street_list);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  filteredIdProofKeys(): string[] {
    return Object.keys(this.id_proof_list);
    // return Object.keys(this.id_proof_list)
    //   .map(key => key.split('(')[0].trim())
    //   .sort();
  }
  filteredADDProofKeys(): any[] {
    console.log(this.add_proof_list);
    return Object.keys(this.add_proof_list);
    // const resultArray = Object.keys(this.add_proof_list).map(key => {
    //   return {
    //     name: key.split('(')[0].trim(), // Extract name before '('
    //     id: this.add_proof_list[key]
    //   };
    // });

    // return resultArray;
    // return Object.keys(this.add_proof_list)
    //   .map(key => key.split('(')[0].trim())
    //   .sort();
  }
  // filteredADDProofKeys(): { name: string, id: number }[] {
  //   return Object.keys(this.add_proof_list)
  //     .map(key => {
  //       const name = key.split('(')[0].trim(); 
  //       const id = this.add_proof_list[key];  
  //       return { name, id };
  //     })
  //     .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
  // }

  onIDProofChange(event: any): void {
    const selectedValue = event.target.value;
    const match = selectedValue.match(/\((\d+)\)/);
    const value = match ? match[1] : null;
    this.selectedIDProofType = selectedValue.replace(/\(\d+\)/, '').trim();
    this.form.get('idproof')?.reset();
    this.applyValidators(this.selectedIDProofType, 'idproof');
  }
  onAddProofChange(event: any): void {
    console.log(event.target.value);
    console.log(this.form.value);

    const selectedValue = event.target.value;
    const match = selectedValue.match(/\((\d+)\)/);
    const value = match ? match[1] : null;
    this.selectedAddProofType = selectedValue.replace(/\(\d+\)/, '').trim();
    console.log(this.selectedAddProofType);
    this.form.get('addressproof')?.reset();
    this.applyValidators(this.selectedAddProofType, 'addressproof');


  }
  validateAddressProof(control: AbstractControl): { [key: string]: boolean } | null {
    console.log('address proof');

    const ebBillPattern = /^EB\d{9}$/;
    const gasBillPattern = /^GAS\d{8}$/;
    const value = control.value;

    if (ebBillPattern.test(value) || gasBillPattern.test(value)) {
      return { invalidAddressProof: true };  // Return error if it matches EB or Gas Bill
    }

    return null;  // Return null if no error
  }

  getMaxLength(proofType: string): number {
    // console.log(" getMaxLength          " + proofType);
    switch (proofType) {
      case 'Aadhaar Card':
        return 12; // Includes spaces
      case 'Voter Id':
        return 10;
      case 'Ration Card':
        return 10;
      case 'Driving Licence':
        return 13;
      case 'Passport':
        return 8;
      case 'Address proof':
        return 11;
      case 'No Proof':
        return 1;
      default:
        return 20; // Default max length
    }
  }

  getPattern(proofType: string): string {
    // console.log("getPattern           " + proofType);

    switch (proofType) {
      case 'Aadhaar Card':
        return '\\d{12}';
      case 'Voter Id':
        return '[A-Z]{3}\\d{7}';
      case 'Ration Card':
        return '\\d{2}[A-Z]\\d{7}';
      case 'Driving Licence':
        return '[A-Z]{2}\\d{11}';
      case 'Passport':
        return '[A-PR-WYa-pr-wy][1-9]\\d{4}[1-9]';
      case 'Address proof':
        return '\\d{2}[A-Z]{2}\\d{6}';
      case 'No Proof':
        return '0';
      default:
        return '.*';
    }
  }

  getExampleFormat(proofType: string): string {
    switch (proofType) {
      case 'Aadhaar Card':
        return '123456789123';
      case 'Voter Id':
        return 'ABC1234567';
      case 'Ration Card':
        return '12A3456789';
      case 'Driving Licence':
        return 'DL123456789012';
      case 'Passport':
        return 'A1234567';
      case 'Address proof':
        return 'EB123456789';
      case 'No Proof':
        return '0';
      default:
        return '';
    }
  }
  applyValidators(proofType: string, controlName: string): void {
    const control = this.form.get(controlName);
    console.log(proofType);

    if (control) {
      control.clearValidators();

      switch (proofType) {
        case 'Aadhaar Card':
          this.maskPattern = '000000000000';
          this.maxLength = 12; // Includes spaces
          this.exampleFormat = '123456789123';
          control.setValidators([
            Validators.required,
            // Validators.pattern(/^\d{4} \d{4} \d{4}$/),
            Validators.pattern(/^\d{12}$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'Voter Id':
          this.maskPattern = 'AAA0000000';
          this.maxLength = 10;
          this.exampleFormat = 'ABC1234567';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^[A-Z]{3}\d{7}$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'Ration Card':
          this.maskPattern = '00A0000000';
          this.maxLength = 10;
          this.exampleFormat = '12A3456789';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^\d{2}[A-Z]\d{7}$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'Address proof':
          this.maskPattern = '00A00000000';
          this.maxLength = 11;
          this.exampleFormat = '12A3456789';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^\d{2}[A-Z]\d{7}$/),
            Validators.maxLength(this.maxLength),
            // this.validateAddressProof
          ]);
          break;

        // case 'EB Bill':
        //   this.maskPattern = 'EB000000000';
        //   this.maxLength = 11;
        //   this.exampleFormat = 'EB123456789';
        //   control.setValidators([
        //     Validators.required,
        //     Validators.pattern(/^EB\d{9}$/),
        //     Validators.maxLength(this.maxLength)
        //   ]);
        //   break;

        // // case 'Gas Bill':
        //   this.maskPattern = 'GAS00000000';
        //   this.maxLength = 11;
        //   this.exampleFormat = 'GAS12345678';
        //   control.setValidators([
        //     Validators.required,
        //     Validators.pattern(/^GAS\d{8}$/),
        //     Validators.maxLength(this.maxLength)
        //   ]);
        //   break;

        case 'Driving Licence':
          this.maskPattern = 'AA00000000000';
          this.maxLength = 13;
          this.exampleFormat = 'DL123456789012';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^[A-Z]{2}\d{11}$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'Passport':
          this.maskPattern = 'A0000000';
          this.maxLength = 8;
          this.exampleFormat = 'A1234567';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^[A-PR-WYa-pr-wy][1-9]\d{4}[1-9]$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        case 'No Proof':
          this.maskPattern = '';
          this.maxLength = 1;
          this.exampleFormat = '0';
          control.setValidators([
            Validators.required,
            Validators.pattern(/^0$/),
            Validators.maxLength(this.maxLength)
          ]);
          break;

        default:
          this.maskPattern = '';
          this.maxLength = undefined;
          this.exampleFormat = undefined;
          control.setValidators([Validators.required]);
          break;
      }

      control.updateValueAndValidity();
    }
  }

  loadIdProofList(): void {
    this.userservice.getIdProofList(this.role, this.username).subscribe(
      (data: any) => {
        this.id_proof_list = data.idprooftypeid;
        this.cdr.detectChanges();
        console.log("ID Proof List", this.id_proof_list);
      },
      error => {
        console.error('Error fetching ID Proof List', error);
      }
    );
  }
  loadAddProofList(): void {
    this.userservice.getAddresProofList(this.role, this.username).subscribe(
      (data: any) => {
        this.add_proof_list = data.addressprooftypeid;
        console.log(this.add_proof_list);
        this.cdr.detectChanges();
        console.log("ADD Proof List", this.add_proof_list);
        this.filterd_proof_list = Object.keys(this.add_proof_list).map(key => {
          return {
            name: key.split('(')[0].trim(), // Extract name before '('
            id: this.add_proof_list[key]
          };
        });
      },
      error => {
        console.error('Error fetching ID Proof List', error);
      }
    );
  }
  onSubmit(): void {

    this.submitted = true;
    let addressprooftypeid = this.form.get('addressprooftypeid')?.value
    const match = this.form.get('addressprooftypeid')?.value.match(/\((\d+)\)/);
    const value = match ? match[1] : null;
    this.form.removeControl('addressprooftypeid');
    this.form.addControl('addressprooftypeid', new FormControl(value))
    let idprooftypeid = this.form.get('idprooftypeid')?.value
    const match1 = this.form.get('idprooftypeid')?.value.match(/\((\d+)\)/);
    const value1 = match1 ? match[1] : null;
    this.form.removeControl('idprooftypeid');
    this.form.addControl('idprooftypeid', new FormControl(value1))
    let formsubmissiondate = this.form.get('formsubmissiondate')?.value
    let formsubmissiondateReplaced = formsubmissiondate.replace('T', ' ');
    this.form.removeControl('formsubmissiondate');
    this.form.addControl('formsubmissiondate', new FormControl(formsubmissiondateReplaced))
    const errorFields = [
      'address', 'customername', 'casformid', 'customernamelast', 'fathername',
      'dateofbirth', 'installaddress', 'mobileno', 'landlineno', 'email',
      'formsubmissiondate', 'addressproof', 'addressprooftypeid', 'idproof', 'idprooftypeid'
    ];
    this.swal.Loading();
    this.userservice.createSubscriber(this.form.value).subscribe(
      (data: any) => {
        this.form.removeControl('addressprooftypeid');
        this.form.addControl('addressprooftypeid', new FormControl(addressprooftypeid));
        this.form.removeControl('idprooftypeid');
        this.form.addControl('idprooftypeid', new FormControl(idprooftypeid));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message || 'Subscriber created successfully!',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          // this.ngOnInit()
          window.location.reload()
        });

      },
      (error) => {
        const errorMessage = errorFields
          .map(field => error?.error?.[field])
          .find(message => message) || 'An error occurred while creating the subscriber.'
        this.form.removeControl('addressprooftypeid');
        this.form.addControl('addressprooftypeid', new FormControl(addressprooftypeid))
        this.form.removeControl('idprooftypeid');
        this.form.addControl('idprooftypeid', new FormControl(idprooftypeid));
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,

          // text: error?.error?.address || error?.error?.customername || error?.error?.casformid || error?.error?.customernamelast || error?.error?.fathername ||
          //   error?.error?.dateofbirth || error?.error?.installaddress || error?.error?.mobileno || error?.error?.landlineno || error?.error?.email || error?.error?.formsubmissiondate || error?.error?.addressproof ||
          //   error?.error?.addressprooftypeid || error?.error?.idproof || error?.error?.idprooftypeid || 'An error occurred while creating the subscriber.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.form.markAllAsTouched();
        });



      }
    );
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;

    // Allow digits only
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onKeydown_landline(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '-', 'Delete'];
    const key = event.key;

    // Allow digits (0-9), hyphen, and control keys
    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubscriberStatusChange() {
    console.log(this.operatorid);
    this.userservice.getAreaListByOperatorid(this.role, this.username, this.operatorid)
      .subscribe((data: any) => {
        console.log(data);
        this.area_list = data.areaid || {};
        console.log(this.area_list);
        this.cdr.detectChanges();
      });
  }
  onAreaStatusChange() {
    console.log(this.areaid);
    this.form.patchValue({ streetid: '' });
    this.userservice.getStreetListByAreaid(this.role, this.username, this.areaid)
      .subscribe((data: any) => {
        console.log(data);
        this.street_list = data.streetid || {};
        console.log(this.street_list);
        this.cdr.detectChanges();
      });
  }
  onStreetStatusChange() {
    console.log('Selected Street:', this.streetid);
    // this.userservice.Create_Street_list(this.role, this.username, this.street)
    //   .subscribe((data: any) => {
    //     console.log(data);

    //   });
  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
  installaddress: string = '';
  billingaddress: string = '';

  onChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.installaddress = this.billingaddress;
    } else {
      this.billingaddress = this.billingaddress
      this.installaddress = '';
    }
  }
}
