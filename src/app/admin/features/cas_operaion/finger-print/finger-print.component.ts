import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-finger-print',
  templateUrl: './finger-print.component.html',
  styleUrls: ['./finger-print.component.scss']
})
export class FingerPrintComponent {
  form!: FormGroup;
  submitted = false;
  username: any;
  role: any;
  castype_1: any;
  finger: any;
  service: any;
  service_1: any;
  isforce: boolean = false;
  intend_1: any;
  intendid_1: any;
  covertype_1: any;
  bgcolor_1: any;
  duration_1: any;
  fontcolor_1: any;
  fontsize_1: any;
  positiontype_1: any;
  position_1: any;
  repeatfor_1: any;
  timegap_1: any;
  transparancy_1: any;
  type_1: any;
  hh: any = 0;
  mm: any = 0;
  ss: any = 0;
  x: any;
  y: any;

  // CasFormControl = new FormControl('');
  // selectedFPFormControl = new FormControl();
  // selectedServiveFormControl = new FormControl();
  // selectedIntendFormControl = new FormControl('');
  // selectedChannelFormControl = new FormControl('');
  intendIdFormControl = new FormControl('');
  // intendIdLcoFormControl = new FormControl('');
  forceFormControl = new FormControl(false);
  // selectedTypeFormControl = new FormControl('');
  // selectedPositiontypeFormControl = new FormControl('');
  // selectedPositionFormControl = new FormControl('');
  // selectedFontsizeFormControl = new FormControl({ value: '', disabled: true });
  // EnterFormsizeFormControl = new FormControl('');
  // selectedBCFormControl = new FormControl('');
  // selectedFCFormControl = new FormControl('');
  // selectedTransparancyFormControl = new FormControl('');
  // timeSpanFormControl = new FormControl('');
  // RepeatFormControl = new FormControl('');
  // durationFormControl = new FormControl('');
  // timeGapFormControl = new FormControl('');
  // selectedAreaCodeFormControl = new FormControl('');
  // selectedSmartcardFormControl = new FormControl('');
  // positionXFormControl = new FormControl('');
  // positionYFormControl = new FormControl('');
  isStopButtonEnabled = false;
  searchTerm: any;
  lco_list: any;
  isFontSizeDisabled: boolean = false;
  isFontSizeSelectDisabled: boolean = false;
  isTransparency_select_Disabled: boolean = false;
  isTransparencyDisabled: boolean = false;
  ispositiondisabled = false;
  isrepeatfordisabled = false;
  intendto: any = [];
  isVisible!: boolean;
  isChannelHide: boolean = false;
  isEditing: boolean = true;
  showServiceNameField = false;
  force: boolean = true;
  // isIntendto: boolean = true;
  isIntendForLco: boolean = false;
  isButtonEnable: boolean = false;
  isSmartcardEnabled: boolean = true;
  isAreaCodeEnabled: boolean = false;
  isPositionXYVisible: boolean = true;
  isPositionXYVisible_mobile: boolean = true;
  area: any[] = [];
  smartcardFormControl = new FormControl();

  cas: any[] = [];

  fingerprint: any = [
    { lable: "ECM", value: 'ecm' },
    { lable: "EMM", value: 'emm' },
  ];
  intend: any[] = [
    { lable: "MSO", value: 1 },
    { lable: "SMARTCARD", value: 2 },
    { lable: "AREA CODE", value: 3 },
  ];

  intend_area: any[] = [];
  filteredIntendArea(): any[] {
    if (!this.searchTerm) {
      return this.area;
    }
    return this.area.filter((area: any) =>
      area.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  filteredIntendSerivice(): any[] {
    if (!this.searchTerm) {
      return this.service;
    }
    return this.service.filter((service: any) =>
      service.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  channels: any = [];
  type: any = [
    { lable: "Overt", value: 1 },
    { lable: "Covert", value: 2 },
    { lable: "Pattern", value: 3 },
  ];
  positiontype: any = [
    { lable: "Fixed", value: 1 },
    { lable: "Random", value: 2 },
    { lable: "Userdefined", value: 3 },
  ];
  position: any = [
    { lable: "Top", value: 1 },
    { lable: "Bottom", value: 2 },
    { lable: "Right", value: 3 },
    { lable: "Left", value: 4 },
    { lable: "Center", value: 5 },
  ];
  fontsize: any[] = [
    { lable: "12", value: 12 },
    { lable: "16", value: 16 },
    { lable: "14", value: 14 },
    { lable: "32", value: 32 },
  ];
  bgcolor: any[] = [
    { lable: "Red", value: "#ff0000" },
    { lable: "Green", value: "#33cc33" },
    { lable: "Blue", value: "#0000ff" },
    { lable: "Yellow", value: "#ffff00" },
    { lable: "Pink", value: "#ff3399" },
    { lable: "Black", value: "#000000" },
    { lable: "White", value: "#ffffff" },
  ];

  fontcolor: any = [
    { lable: "Red", value: "#ff0000" },
    { lable: "Green", value: "#33cc33" },
    { lable: "Blue", value: "#0000ff" },
    { lable: "Yellow", value: "#ffff00" },
    { lable: "Pink", value: "#ff3399" },
    { lable: "Black", value: "#000000" },
    { lable: "White", value: "#ffffff" },
  ];
  // bgcolor: any = [
  //   { label: "Red", value: "rgb(255, 0, 0)" },
  //   { label: "Green", value: "rgb(51, 204, 51)" },
  //   { label: "Blue", value: "rgb(0, 0, 255)" },
  //   { label: "Yellow", value: "rgb(255, 255, 0)" },
  //   { label: "Pink", value: "rgb(255, 51, 153)" },
  //   { label: "Black", value: "rgb(0, 0, 0)" },
  //   { label: "White", value: "rgb(255, 255, 255)" },
  // ];
  // fontcolor: any = [
  //   { label: "Red", value: "rgb(255, 0, 0)" },
  //   { label: "Green", value: "rgb(51, 204, 51)" },
  //   { label: "Blue", value: "rgb(0, 0, 255)" },
  //   { label: "Yellow", value: "rgb(255, 255, 0)" },
  //   { label: "Pink", value: "rgb(255, 51, 153)" },
  //   { label: "Black", value: "rgb(0, 0, 0)" },
  //   { label: "White", value: "rgb(255, 255, 255)" },
  // ];
  transparancy: any = [
    { lable: "Enable", value: 0 },
    { lable: "Disable", value: 1 }
  ];

  constructor(private userservice: BaseService, private router: Router, private storageService: StorageService, private fb: FormBuilder) {
    this.form = this.fb.group({
      castype: ['', Validators.required],
      fptype: ['', Validators.required],
      isforce: ['', Validators.required],
      intendto: ['', Validators.required],
      intendid: ['', Validators.required],
      type: ['', Validators.required],
      positiontype: ['', Validators.required],
      fontsize: ['', Validators.required],
      bgcolor: ['', Validators.required],
      fontcolor: ['', Validators.required],
      transparancy: ['', Validators.required],
      duration: ['', Validators.required],
      timegap: ['', Validators.required],
      repeatfor: ['', Validators.required],
      position: ['', Validators.required],
      serviceid: ['', Validators.required],
      hh: [0, Validators.required],
      mm: [0, Validators.required],
      ss: [0, Validators.required],
      x: [0, Validators.required],
      y: [0, Validators.required],
      username: [storageService.getUsername(), Validators.required],
      role: [storageService.getUserRole(), Validators.required],
    })
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(this.form.value);

  }

  submit() {
    if (this.form.valid) {
      this.userservice.SendFingerPrint(this.form.value).subscribe(
        (res: any) => {
          console.log(res.message);
          Swal.fire({
            title: 'Success',
            text: res.message || 'Fingerprint data has been sent successfully!',
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              Swal.showLoading();
            },
            willClose: () => {
              // location.reload();
            }
          });
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Failed to Send fingerprint data. Please try again later.',
            icon: 'error',
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              Swal.showLoading();
            },
            willClose: () => {
              // location.reload();
            }
          });
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }
  stop() {

    console.log('stop');

    this.userservice.StopFingerPrint(this.form.value).subscribe(
      (res: any) => {
        console.log(res.message);
        Swal.fire({
          title: 'Success',
          text: res.message || 'Fingerprint data has been sent successfully!',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            Swal.showLoading();
          },
          willClose: () => {
            // location.reload();
            this.ngOnInit();
          }
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'Failed to stop fingerprint data. Please try again later.',
          icon: 'error',
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            Swal.showLoading();
          },
          willClose: () => {
            // location.reload();
            this.ngOnInit();
          }
        });
      }
    );

  }


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  ngOnInit() {
    // this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
    //   this.cas = data;
    //   console.log(this.cas);
    // });
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      console.log(data);
      // this.area = data[0].arealist;
      // this.cas = data[0].caslist;
      this.area = Object.entries(data[0].arealist).map(([key, value]) => ({ name: key, id: value }));
      this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
      this.service = Object.entries(data[0].servicelist).map(([key, value]) => ({ name: key, id: value }));
      this.castype_1 = data[0].fplist[0].castype;
      this.finger = data[0].fplist[0].fptype;
      this.service_1 = data[0].fplist[0].serviceid;
      this.isforce = data[0].fplist[0].isforce;
      this.intend_1 = data[0].fplist[0].intendto;
      this.type_1 = data[0].fplist[0].type;
      this.intendid_1 = data[0].fplist[0].intendid;
      this.covertype_1 = data[0].fplist[0].covertype;
      this.bgcolor_1 = data[0].fplist[0].bgcolor;
      this.duration_1 = data[0].fplist[0].duration;
      this.fontcolor_1 = data[0].fplist[0].fontcolor;
      this.fontsize_1 = data[0].fplist[0].fontsize;
      this.positiontype_1 = data[0].fplist[0].positiontype;
      this.position_1 = data[0].fplist[0].position;
      this.repeatfor_1 = data[0].fplist[0].repeatfor;
      this.timegap_1 = data[0].fplist[0].timegap;
      this.transparancy_1 = data[0].fplist[0].transparancy;
      this.hh = data[0].fplist[0].hh;
      this.mm = data[0].fplist[0].mm;
      this.ss = data[0].fplist[0].ss;
      this.x = data[0].fplist[0].x;
      this.y = data[0].fplist[0].y;
    })
    this.checkScreenSize();

    this.forceFormControl.valueChanges.subscribe((value) => {
      this.isStopButtonEnabled = value === true;
    });

  }
  onChangeForce1() {
    // Manually trigger the button state update if necessary
    // this.isStopButtonEnabled = this.forceFormControl.value === true;
    this.isStopButtonEnabled = this.isforce === true;

  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.isPositionXYVisible_mobile = screenWidth <= 720;
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;

    // Allow digits only
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  onSelectionFingerPrint(selectedValue: string) {
    console.log(selectedValue);
    this.isButtonEnable = false;
    this.showServiceNameField = selectedValue === 'ecm';
    const casId = Number(selectedValue);

    console.log(casId);
    if (casId == 3) {
      this.ispositiondisabled = true;
      console.log(this.ispositiondisabled);

    } else {
      this.ispositiondisabled = false;
      console.log(this.ispositiondisabled);
    }
    if (casId == 1) {
      this.isFontSizeDisabled = true;
      this.isFontSizeSelectDisabled = false;
    } else {
      this.isFontSizeDisabled = false;
      this.isFontSizeSelectDisabled = true;
    }

    if (casId == 1) {
      this.isTransparencyDisabled = true;
      this.isTransparency_select_Disabled = false;
    } else {
      this.isTransparencyDisabled = false;
      this.isTransparency_select_Disabled = true;
    }

    if (casId == 1) {
      this.isrepeatfordisabled = true;
      console.log(this.isrepeatfordisabled);

    } else {
      this.isrepeatfordisabled = false;
      console.log(this.isrepeatfordisabled);
    }


  }


  onChangeIntendTo1(selectedValue: any) {
    this.isSmartcardEnabled = false;
    this.isAreaCodeEnabled = false;
    console.log('enabled' + selectedValue);
    if (selectedValue == 2) {
      this.isSmartcardEnabled = true;
      console.log('Smartcard enabled');
    }

    if (selectedValue == 3) {
      this.isAreaCodeEnabled = true;
      console.log('Area code enabled');
    }
    if (selectedValue !== 2 && selectedValue !== 3) {
      console.log('Both disabled');
    }
  }
  onChangePositionType(selectedValue: any) {
    console.log('enabled' + selectedValue);
    if (selectedValue == 3) {
      this.isPositionXYVisible = true;
      console.log('isPositionXYVisible enabled');
    } else {
      this.isPositionXYVisible = false;
    }
  }

}
