import { ChangeDetectorRef, Component, ViewChild ,OnDestroy, AfterViewInit} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { SwalService } from 'src/app/_core/service/swal.service';
declare var $: any;
// import { Any } from 'node_modules1/@sigstore/protobuf-specs/dist/__generated__/google/protobuf/any';


@Component({
  selector: 'app-create-subscriber',
  templateUrl: './create-subscriber.component.html',
  styleUrls: ['./create-subscriber.component.scss'],
  providers: [DatePipe]
})
export class CreateSubscriberComponent implements AfterViewInit, OnDestroy {
  submitted = false;
  maskPattern: string = '';
  maxLength: number | undefined;
  exampleFormat: string | undefined;
  form!: FormGroup;
  operatorid: any;
  operatorname: any;
  areaid: any;
  streetid: any;
  idproof: any;
  casformid: any;
  customername: any;
  isLinear = false;
  selectedIdProof: string = '';
  selectedAddProof: string = '';

  lco_list: any[] = [];
  area_list: any[] = [];
  street_list: any[] = [];
  id_proof_list: { [key: string]: number } = {};
  add_proof_list: { [key: string]: number } = {};
  filterd_proof_list: any[] = [];

  searchTerm: string = '';
  searchAreaTerm: string = '';
  searchStreetTerm: string = '';
  searchIdTerm: string = '';
  searchAddressTerm: string = '';
  username: any;
  role: any;
  selectedaddproof_1: any;
  selectedAddProofType: string = '';
  selectedIDProofType: string = '';
  installaddress: string = '';
  billingaddress: string = '';

  addressproof: any;
  idprooftypeid: any;
  idproofid: any;


  today = new Date();
  filteredOperators: any[] = [];
  filteredAreas: any[] = [];
  filteredStreet: any[] = [];
  selectedOperator: any;
  selectedArea: any;
  selectedStreet: any;
  addressProoftypeid: any = '';
  idProoftypeid: any = '';
  constructor(private formBuilder: FormBuilder, private userservice: BaseService, private swal: SwalService, private cdr: ChangeDetectorRef, private storageservice: StorageService, private datePipe: DatePipe) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    this.userservice.getOperatorListforSubInsert(this.role, this.username).subscribe((data: any) => {
      this.lco_list = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.filteredOperators = this.lco_list;
    })
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        operatorid: ['', Validators.required || this.operatorid],
        areaid: ['', Validators.required || this.areaid],
        streetid: ['', Validators.required || this.streetid],
        casformid: ['',],
        customername: ['', [Validators.required,]],
        customernamelast: ['', [Validators.required]],
        fathername: ['', [Validators.required]],
        dateofbirth: ['', [Validators.required]],
        address: ['', [Validators.required]],
        installaddress: ['', [Validators.required]],
        mobileno: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        landlineno: ['',],
        // email: ['', [Validators.required, Validators.email]],
        email: ['',
          [Validators.required, Validators.email, this.customEmailValidator()]],
        formsubmissiondate: ['', [Validators.required]],
        addressproof: ['', [Validators.required]],
        idproof: ['', [Validators.required]],
        idprooftypeid: ['', Validators.required],
        addressprooftypeid: ['', Validators.required],
        role: this.role,
        username: this.username
      },
    );
    this.loadIdProofList();
    this.loadAddProofList();
  }
  ngOnDestroy(): void {
    ($('#Lco') as any).select2('destroy');
    ($('#Area') as any).select2('destroy');
    ($('#Street') as any).select2('destroy');
  }
  
  ngAfterViewInit() {
    $('#Lco').select2({
      placeholder: 'Select an Operator',
      allowClear: true
    });
    $('#Lco').on('change', (event: any) => {
      this.operatorid = event.target.value;
      console.log('operator   dsfdsfsdfdsfds');
      this.onOperatorChange(this.operatorid);
    });

    $('#Area').select2({
      placeholder: 'Select Area',
      allowClear: true
    });
    $('#Area').on('change', (event: any) => {
      this.areaid = event.target.value;
      this.onAreaStatusChange(this.areaid);
    });
    $('#Street').select2({
      placeholder: 'Select Street',
      allowClear: true
    });
    $('#Street').on('change', (event: any) => {
      this.streetid = event.target.value;
      this.onStreetStatusChange(this.streetid);
    });
  }
  customEmailValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(in|com)$/;

      if (email && !emailPattern.test(email)) {
        return { invalidEmail: true };
      }
      return null;
    };
  }
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;;

  }

  onSearchAreaChange(event: any) {
    this.searchAreaTerm = event.target.value;;
  }
  onSearchStreetChange(event: any) {
    this.searchAreaTerm = event.target.value;;
  }
  onSearchIdChange(event: any) {
    this.searchIdTerm = event.target.value;;
  }
  onSearchAddressChange(event: any) {
    this.searchAddressTerm = event.target.value;
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );

  }
  filterAreas(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredAreas = this.area_list.filter(area =>
      area.name.toLowerCase().includes(filterValue)
    );
    this.area_list = Object.keys(event).map(key => {
      const value = event[key];
      const name = key;
      return { name: name, value: value };
    });
  }
  filterStreet(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredStreet = this.street_list.filter(street =>
      street.name.toLowerCase().includes(filterValue)
    );
    this.street_list = Object.keys(event).map(key => {
      const value = event[key];
      const name = key;
      return { name: name, value: value };
    });
  }

  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  displayArea(area: any): string {
    return area ? area.name : '';
  }
  displayStreet(street: any): string {
    return street ? street.name : '';
  }

  onAddProofChange(event: any): void {

    const selectedValue = event.target.value;
    console.log(selectedValue);

    this.selectedAddProofType = selectedValue.replace(/\(\d+\)/, '').trim();
    if (selectedValue.includes('No Proof')) {
      this.form.get('addressproof')?.setValue('0');
    } else {
      this.form.get('addressproof')?.reset();
    }
    this.applyValidators(this.selectedAddProofType, 'addressproof');
    const addressProofValue = this.form.get('addressproof')?.value;
    if (addressProofValue && this.selectedAddProofType === this.selectedIDProofType) {
      this.form.get('idproof')?.setValue(addressProofValue);
      this.idproofid = addressProofValue;
    }
  }

  onIDProofChange(event: any): void {
    const selectedValue = event.target.value;
    this.selectedIDProofType = selectedValue.replace(/\(\d+\)/, '').trim();
    this.form.get('idproof')?.reset();
    this.applyValidators(this.selectedIDProofType, 'idproof');
    const addressProofValue = this.form.get('addressproof')?.value;
    if (addressProofValue && this.selectedIDProofType === this.selectedAddProofType) {
      this.form.get('idproof')?.setValue(addressProofValue);
      this.idproofid = addressProofValue;
    }
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
    if (!this.searchAreaTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchAreaTerm.toLowerCase())
    );
  }

  filteredStreetKeys(): string[] {
    const keys = Object.keys(this.street_list).map(key => key.replace(/\(\d+\)/, '').trim());

    // const keys = Object.keys(this.street_list);
    if (!this.searchStreetTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchStreetTerm.toLowerCase())
    );
  }
  filteredIdProofKeys(): string[] {
    return Object.keys(this.id_proof_list);
  }
  filteredADDProofKeys(): any[] {
    return Object.keys(this.add_proof_list);
  }

  validateAddressProof(control: AbstractControl): { [key: string]: boolean } | null {
    const ebBillPattern = /^EB\d{9}$/;
    const gasBillPattern = /^GAS\d{8}$/;
    const value = control.value;

    if (ebBillPattern.test(value) || gasBillPattern.test(value)) {
      return { invalidAddressProof: true };
    }

    return null;
  }

  getMaxLength(proofType: string): number {
    switch (proofType) {
      case 'Aadhaar Card':
        return 12;
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
        return 20;
    }
  }

  getPattern(proofType: string): string {
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
            this.validateAddressProof
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
        this.cdr.detectChanges();
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
    const value = match ? match[1] : '';
    this.form.removeControl('addressprooftypeid');
    this.form.addControl('addressprooftypeid', new FormControl(value))
    let idprooftypeid = this.form.get('idprooftypeid')?.value
    const match1 = this.form.get('idprooftypeid')?.value.match(/\((\d+)\)/);
    const value1 = match1 ? match[1] : '';
    this.form.removeControl('idprooftypeid');
    this.form.addControl('idprooftypeid', new FormControl(value1))
    let formsubmissiondate = this.form.get('formsubmissiondate')?.value
    let formsubmissiondateReplaced = formsubmissiondate.replace('T', ' ');
    this.form.removeControl('formsubmissiondate');
    this.form.addControl('formsubmissiondate', new FormControl(formsubmissiondateReplaced))
    const errorFields = ['operatorid', 'areaid', 'streetid',
      'customername', 'customernamelast', 'fathername',
      'dateofbirth', 'mobileno', 'landlineno', 'email',
      'formsubmissiondate', 'addressproof', 'addressprooftypeid', 'idproof', 'idprooftypeid', 'address', 'installaddress',
    ];
    console.log(this.form);

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      console.log(`${key} - Status: ${control?.status}, Errors:`, control?.errors);
    });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('45353453');

    } else {
      console.log('came');

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
            window.location.reload()
          });
        },
        (error) => {
          console.log(error);
          const errorMessage = errorFields
            .map(field => error?.error?.[field] || error?.error.message)
            .find(message => message) || 'An error occurred while creating the subscriber.'

          this.form.removeControl('addressprooftypeid');
          this.form.addControl('addressprooftypeid', new FormControl(addressprooftypeid))
          this.form.removeControl('idprooftypeid');
          this.form.addControl('idprooftypeid', new FormControl(idprooftypeid));
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          })
        }
      );
    }

    // Check if the form is invalid
    if (this.form.invalid) {
      // this.form.markAllAsTouched(); 
      // this.submitted = true;
      console.log('Form Validation Failed:', this.form.value);

      return;
    }


  }



  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onKeydown_landline(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '-', 'Delete'];
    const key = event.key;
    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onOperatorChange(operator: any): void {
    const match = operator.match(/^(.+)\((\d+)\)$/);
    if (match) {
      const operatorName = match[1].trim();
      const operatorId = match[2];
      this.selectedOperator = operatorName;
      this.operatorid = operatorId;
      this.form.patchValue({
        operatorid: this.operatorid,
      });
      this.selectedOperator = operator;
      this.form.patchValue({
        operatorid: this.operatorid,
      });
      this.userservice.getAreaListByOperatorid(this.role, this.username, this.operatorid).subscribe((data: any) => {
        this.area_list = Object.keys(data).map(key => {
          const value = data[key];
          const name = key;
          return { name: name, value: value };
        });
        this.filteredAreas = this.area_list;
      })
    } else {
      console.error('Invalid operator format. Expected "Name (ID)" format.');
    }
  }
  onAreaStatusChange(area: any): void {
    console.log('selecterd Area', area);
    const match = area.match(/^(.+)\((\d+)\)$/);
    if (match) {
      const areaName = match[1].trim();
      const areaId = match[2];
      this.selectedArea = areaName;
      this.areaid = areaId;
      console.log(this.areaid);
      console.log(this.selectedArea);
      this.form.patchValue({
        areaid: this.areaid,
      });
      this.userservice.getStreetListByAreaid(this.role, this.username, this.areaid).subscribe((data: any) => {
        this.street_list = Object.keys(data).map(key => {
          const value = data[key];
          const name = key;
          return { name: name, value: value };
        });
        this.filteredStreet = this.street_list;
      })
    } else {
      console.error('Invalid Area format. Expected "Name (ID)" format.');
    }
  }

  onStreetStatusChange(street: any) {
    console.log('selected Street', street);
    const match = street.match(/^(.+)\((\d+)\)$/);
    if (match) {
      const streetname = match[1].trim();
      const streetid = match[2];
      this.selectedStreet = streetname;
      this.streetid = streetid;
      this.form.patchValue({
        streetid: this.streetid,
      });
      this.filteredStreet = this.street_list;
    } else {
      console.error('Invalid street format. Expected "Name (ID)" format.');
    }
  }


  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
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
