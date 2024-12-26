import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-force-tuning',
  templateUrl: './force-tuning.component.html',
  styleUrls: ['./force-tuning.component.scss']
})
export class ForceTuningComponent {
  form!: FormGroup;
  IntendFormControl: any;
  username: any;
  role: any;
  submitted: boolean = false;
  intendid_1: any;
  LCO_name: any;
  LCO_id: any;
  searchLCOTerm: any;
  lcoid: any;
  intendid: any;
  Lconame: any;
  selectedOperator: any;
  isSmartcardEnabled = false;
  isLCOEnabled = false;
  selectedAreaCodeFormControl = new FormControl('');
  area: any[] = [];
  filteredOperators: any[] = [];
  filteredLcoList: { name: string; id: number }[] = [];

  // area: any = 0;
  intend: any = [
    { lable: "MSO", value: 1 },
    { lable: "Smartcard", value: 2 },
    { lable: "LCO", value: 3 },
  ];
  lco_name: any = 0;
  searchTerm: any;
  constructor(private userservice: BaseService, private storageService: StorageService, private swal: SwalService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.form = this.fb.group({
      intendto: ['', Validators.required],
      intendid: [0, Validators.required],
      tuningstatus: [true, Validators.required],
      role: this.role,
      username: this.username
    })
  }
  ngOnInit() {
    // this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
    //   console.log(data);
    //   this.area = Object.entries(data[0].arealist).map(([key, value]) => ({ name: key, id: value }));
    //   console.log(this.area);
    //   this.filteredOperators = this.area;
    // })

    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.area = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, id: value };
      });
      this.filteredOperators = this.area;
    })
  }
  onChangeIntendTo1(event: any) {
    console.log('111111111111');
    this.intendid_1 = '';
    const selectedValue = event.target.value;
    console.log(selectedValue);
    if (selectedValue == 2) { // SMARTCARD
      this.isSmartcardEnabled = true;
      this.isLCOEnabled = false;
    } else if (selectedValue == 3) { // AREA CODE
      this.isLCOEnabled = true;
      this.isSmartcardEnabled = false;
    } else if (selectedValue == 1) { // MSO
      this.isLCOEnabled = false;
      this.isSmartcardEnabled = false;
    }
    else {
      this.isSmartcardEnabled = true;
      this.isLCOEnabled = true;
    }
  }


  // filteredIntendArea(): any[] {
  //   if (!this.searchTerm) {
  //     return this.area;
  //   }
  //   return this.area.filter((area: any) =>
  //     area.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.area.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );

  }
  filteredIntendArea(): { name: string; id: number }[] {
    if (!this.searchLCOTerm) {
      return this.area;
    }
    return this.area.filter((area: { name: string }) =>
      area.name.toLowerCase().includes(this.searchLCOTerm.toLowerCase())
    );
  }
  onSearchLCOChange(event: any) {
    this.searchLCOTerm = event.target.value;
    this.filteredLcoList = this.filteredIntendArea();
  }
  onLCOSelect(LCO: { name: string; id: number }) {
    this.LCO_name = LCO.name;
    this.LCO_id = LCO.id;
    this.form.patchValue({ intendid: this.LCO_id });
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onSubscriberStatusChange(operator: any): void {
    this.selectedOperator = operator;
    this.intendid = operator.id;
    this.Lconame = operator.name;
    console.log(this.intendid);
    console.log(this.Lconame);
    this.form.patchValue({ intendid: this.intendid });
    this.cdr.detectChanges();
    this.userservice.getSubscriberIdListByOperatorid(this.role, this.username, this.intendid).subscribe((data: any) => {
      console.log(data);
      this.area = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      // this.filteredSub = this.sub_list;
      // console.log(this.filteredSub);
    })
  }
  onSubmit() {
    this.submitted = true;
    // if (this.form.valid) {
    // } else {
    //   this.form.markAllAsTouched();
    // }
    this.swal.Loading();
    this.userservice.CreateForce(this.form.value).subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire({
          title: 'Success!',
          text: res.message || 'Form submitted successfully.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.ngOnInit();
        });
      },
      (error: any) => {
        Swal.fire({
          title: 'Error!',
          text: error?.error.intendid || error?.error.message || 'There was an issue submitting the form.',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    );
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
}
