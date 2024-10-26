import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
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

  isSmartcardEnabled = true;
  isLCOEnabled = true;
  selectedAreaCodeFormControl = new FormControl('');
  area: any[] = [];
  // area: any = 0;
  intend: any = [
    { lable: "MSO", value: 0 },
    { lable: "Smartcard", value: 1 },
    { lable: "LCO", value: 2 },
  ];
  lco_name: any = 0;
  searchTerm: any;
  constructor(private userservice: BaseService, private storageService: StorageService, private fb: FormBuilder) {
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
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.area = Object.entries(data[0].arealist).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.area);
    })
  }
  onChangeIntendTo1(event: any) {
    console.log('111111111111');
    const selectedValue = event.target.value;
    console.log(selectedValue);
    if (selectedValue == 1) { // SMARTCARD
      this.isSmartcardEnabled = true;
      this.isLCOEnabled = false;
    } else if (selectedValue == 2) { // AREA CODE
      this.isLCOEnabled = true;
      this.isSmartcardEnabled = false;
    } else if (selectedValue == 0) { // MSO
      this.isLCOEnabled = false;
      this.isSmartcardEnabled = false;
    }
    else {
      this.isSmartcardEnabled = true;
      this.isLCOEnabled = true;
    }
  }
  filteredIntendArea(): any[] {
    if (!this.searchTerm) {
      return this.area;
    }
    return this.area.filter((area: any) =>
      area.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSubmit() {
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
          text: error?.error.message || 'There was an issue submitting the form.',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        });
      }
    );
  }

}
