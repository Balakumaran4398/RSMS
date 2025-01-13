import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { E } from 'node_modules1/@angular/cdk/keycodes';
// import tree from 'node_modules1/@angular/material/schematics/ng-generate/tree';
// import { visible } from 'node_modules1/ansi-colors/types';
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
  castypeid: any;
  finger: any;
  service: any;
  service_1: any;
  servicename: any;
  serviceNameId: any;
  isforce: boolean = false;
  isdelete: boolean = false;
  intend_1: any = 0;
  intendid_1: any;
  intendidLco: any;
  intendidSmartcard: any;
  LCO_name: any;
  LCO_id: any;
  covertype_1: any;
  bgcolor_1: any = 0;

  selectedColor: string = ''; // Color to be applied
  // isbackgroundcolor: boolean = true; 


  duration_1: any;
  display_duration: any;
  fontcolor_1: any = 0;
  fontsize_1: any = 0;
  fontstyle_1: any = 0;
  positiontype_1: any;
  position_1: any = 0;
  s_Style: any = 0;
  repeatfor_1: any;
  timegap_1: any;
  transparancy_1: any;
  locationy: any;
  locationx: any;
  type_1: any = 0;
  hh: any = 0;
  mm: any = 0;
  ss: any = 0;
  x: any;
  y: any;
  casId: any;
  castype: any;
  casname: any
  fplistLastObj: any;
  display_status: any;
  operatorName: any;
  operatorId: any;

  intendIdFormControl = new FormControl('');
  forceFormControl = new FormControl(false);
  // isStopButtonEnabled = false;
  isStopButtonEnabled: boolean = false;
  // isforce: boolean = false;
  searchTerm: any;
  searchServiceTerm: any;
  searchLCOTerm: any;
  searchAreaTerm: any;
  lco_list: any;
  isIntendto: boolean = false;
  isFontSizeDisabled: boolean = false;
  isFontSizeSelectDisabled: boolean = false;
  isFontSizeSelectDigit: boolean = false;
  isFontStyleSelectDisabled: boolean = false;
  isTransparency_select_Disabled: boolean = false;
  isTranparancy: boolean = false;
  isTransparencyDisabled: boolean = false;
  isbackgroundcolor: boolean = false;
  isCasbackgroundcolor: boolean = false;
  isLocationVisible: boolean = false;
  isfontColor: boolean = false;
  isCasfontColor: boolean = false;
  isDuration: boolean = false;
  isDisplayDuration: boolean = false;
  isminDidDuration: boolean = false;
  ismaxDidDuration: boolean = false;
  isTimeGap: boolean = false;
  isTimeSpan: boolean = false;
  isHH: boolean = false;
  isMM: boolean = false;
  isShowStyle: boolean = false;
  ispositiondisabled: boolean = false;
  isrepeatfordisabled: boolean = false;
  intendto: any;
  intendid: any;
  force: boolean = false;
  isServiceName: boolean = false;
  isVisible!: boolean;
  isChannelHide: boolean = false;
  isEditing: boolean = true;
  showServiceNameField = false;
  isIntendForLco: boolean = false;
  isButtonEnable: boolean = false;
  isSmartcardEnabled: boolean = true;
  isAreaCodeEnabled: boolean = false;
  isPositionXYVisible: boolean = false;
  isPositionXYVisible_mobile: boolean = false;

  isInvalidLength: boolean = false;


  area: any[] = [];
  smartcardFormControl = new FormControl();
  bgcolor_id: any;
  bgcolor_value: any;
  cas: any[] = [];

  filteredCasList: { name: string; id: number }[] = [];
  filteredServiceList: { name: string; id: number }[] = [];
  filteredAreaList: { name: string; id: number }[] = [];
  filteredLcoList: { name: string; id: number }[] = [];

  fingerprint: any = [
    { lable: "ECM", value: 'ecm', visible: true },
    { lable: "EMM", value: 'emm', visible: false },
  ];
  intend: any = [
    { lable: "MSO", value: 1 },
    { lable: "SMARTCARD", value: 2 },
    { lable: "LCO", value: 3 },
  ];

  intend_area: any[] = [];

  filteredIntendArea(): { name: string; id: number }[] {
    if (!this.searchLCOTerm) {
      return this.area;
    }
    return this.area.filter((area: { name: string }) =>
      area.name.toLowerCase().includes(this.searchLCOTerm.toLowerCase())
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
  getMaxLength(): number {
    if (this.castype == 6) {
      return 14; // Max length is 20 for MSO, AREA CODE, or null
    }
    return 20; // Default max length is 14
  }
  channels: any = [];
  type: any = [
    { lable: "Overt", value: 1 },
    { lable: "Covert", value: 2 },
    { lable: "Pattern", value: 3 },
  ];
  showStyle: any = [
    { lable: "Card", value: 1 },
    { lable: "STB Id", value: 2 },
    { lable: "Both", value: 3 },
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
    { lable: "Small", value: 12 },
    { lable: "Medium", value: 16 },
    { lable: "Large", value: 32 },
    { lable: "Custom 14", value: 14 },
  ];
  fontsizeDigit: any[] = [
    { lable: "12", value: 12 },
    { lable: "16", value: 16 },
    { lable: "24", value: 24 },
    { lable: "32", value: 32 },
  ];
  //   fontsize: any[] = [
  //     { label: "Small", value: 12 },
  //     { label: "Medium", value: 16 },
  //     { label: "Large", value: 32 },
  //     { label: "Custom 14", value: 14 }, 
  // ];

  fontstyle: any[] = [
    { lable: "Normal", value: 0 },
    { lable: "Bold", value: 1 },
    { lable: "Italics", value: 2 },
    { lable: "Bold Italics", value: 3 },
  ];

  bgcolor: any[] = [
    { lable: "Red", value: "1" },
    { lable: "Green", value: "2" },
    { lable: "Blue", value: "3" },
    { lable: "Yellow", value: "4" },
    { lable: "Pink", value: "5" },
    { lable: "Black", value: "6" },
    { lable: "White", value: "7" },
  ];

  fontcolor: any = [
    { lable: "Red", value: "1" },
    { lable: "Green", value: "2" },
    { lable: "Blue", value: "3" },
    { lable: "Yellow", value: "4" },
    { lable: "Pink", value: "5" },
    { lable: "Black", value: "6" },
    { lable: "White", value: "7" },

  ];
  gcolor1: any = [
    { lable: "Red", value: "1" },
    { lable: "Green", value: "2" },
    { lable: "Blue", value: "3" },
    { lable: "Yellow", value: "4" },
    { lable: "Black", value: "6" },
    { lable: "White", value: "7" },
    { lable: "Olive", value: "8" },
    { lable: "Orange", value: "9" },
    { lable: "Brown", value: "10" },
  ];
  fontcolor1: any = [
    { lable: "Red", value: "1" },
    { lable: "Green", value: "2" },
    { lable: "Blue", value: "3" },
    { lable: "Yellow", value: "4" },
    { lable: "Black", value: "6" },
    { lable: "White", value: "7" },
    { lable: "Olive", value: "8" },
    { lable: "Orange", value: "9" },
    { lable: "Brown", value: "10" },
  ];
  transparancy: any = [
    { lable: "Enable", value: 0 },
    { lable: "Disable", value: 1 }
  ];

  constructor(private userservice: BaseService, private router: Router, private storageService: StorageService, private fb: FormBuilder) {
    this.form = this.fb.group({
      castype: [this.castypeid, Validators.required],
      castypedisplay: [this.castype_1, Validators.required],
      fptype: ['', Validators.required],
      isforce: [false, Validators.required],
      intendto: [1, Validators.required],
      intendid: [this.intend_1, Validators.required],
      intendlco: [this.intendidLco, Validators.required],
      intendSmartcard: [this.intendidLco, Validators.required],
      type: ['', Validators.required],
      positiontype: ['', Validators.required],
      fontsize: ['', Validators.required],
      font_style: [0, Validators.required],
      bgcolor: ['', Validators.required],
      fontcolor: ['', Validators.required],
      transparancy: ['', Validators.required],
      duration: ['', Validators.required],
      display_duration: ['', Validators.required],
      timegap: [0, Validators.required],
      repeatfor: [0, Validators.required],
      position: ['', Validators.required],
      serviceid: [this.serviceNameId, Validators.required],
      servicename: [this.service_1, Validators.required],
      hh: ['0', Validators.required],
      mm: ['0', Validators.required],
      ss: ['0', Validators.required],
      x: ['0', Validators.required],
      y: ['0', Validators.required],
      locationx: [0, Validators.required],
      locationy: [0, Validators.required],
      username: [storageService.getUsername(), Validators.required],
      role: [storageService.getUserRole(), Validators.required],
    })
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(this.form.value);

  }

  updateBackgroundColor(colorLabel: string) {
    const colorMap: { [key: string]: string } = {
      Red: 'red',
      Green: 'green',
      Blue: 'blue',
      Yellow: 'yellow',
      Black: 'black',
      White: 'white',
      Olive: 'olive',
      Orange: 'orange',
      Brown: 'brown'
    };
    this.selectedColor = colorMap[colorLabel] || 'transparent';
  }
  getTextColor(color: string): string {
    const isHex = color.startsWith('#');
    let r, g, b;

    if (isHex) {
      const bigint = parseInt(color.slice(1), 16);
      r = (bigint >> 16) & 255;
      g = (bigint >> 8) & 255;
      b = bigint & 255;
    } else {
      [r, g, b] = color.split(',').map(Number);
    }

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
  }

  submit() {
    // if (this.form.valid) {
    Swal.fire({
      title: "Loading!!!",
      text: "Please wait while we send the fingerprint data.",
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    // if(this.ischange){
    //   this.form.patchValue({ castype: this.fplistLastObj.castype });
    //   this.castype_1=this.fplistLastObj.casname
    // }
    // console.log(this.castype_1);
    // console.log(this.form.get('castype'));



    this.userservice.SendFingerPrint(this.form.value).subscribe(
      (res: any) => {
        Swal.close();
        Swal.fire({
          title: 'Success',
          text: res.message || 'Fingerprint data has been sent successfully!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error.castype || error?.error?.intendid || error?.error.serviceid || error?.error.fontsize || error?.error.duration || error?.error.repeatfor || error?.error.timegap ||
            error?.error.message || error?.error.x || error?.error.y || error?.error.positiontype || 'There was a problem creating the message.',
          icon: 'error',
          // confirmButtonText: 'OK',
          // timer: 2000,
          timerProgressBar: true
        }).then(() => {
          this.form.markAllAsTouched();
        });
      }
    );
    // } else {
    //   this.form.markAllAsTouched();
    // }
  }



  stop() {
    // if (this.form.valid) {
    Swal.fire({
      title: "Loading!!!",
      text: "Please wait while we process your request.",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading(null); // Show loading spinner
      }
    });
    this.userservice.StopFingerPrint(this.form.value).subscribe(
      (res: any) => {
        console.log(res.message);
        Swal.fire({
          title: 'Success',
          text: res.message || 'Fingerprint data has been sent successfully!',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        Swal.close();
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'Failed to stop fingerprint data. Please try again later.',
          icon: 'error',
          timer: 3000,
          timerProgressBar: true
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

    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.area = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, id: value };
      });
      this.filteredAreaList = this.area;
    })

    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data) => {
      this.area = Object.entries(data[0].arealist).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.area);
      console.log('sdffdsfsfds', this.area);
      this.filteredAreaList = this.area;
    });

    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
      console.log('dfdsfdsfsd', this.cas);
      this.cas = data.map((item: any) => ({
        id: item.id,
        name: item.casname
      }));
      this.filteredCasList = this.cas;
      console.log(this.cas);

    });
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      console.log(data);
      // this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
      // this.filteredCasList = this.cas;
      this.service = Object.entries(data[0].servicelist).map(([key, value]) => ({ name: key, id: value }));
      this.filteredServiceList = this.service;

      console.log(this.service);
      console.log(this.cas);

      // let fplistLastObj = data[0].fplist[data[0].fplist.length - 1]
      this.fplistLastObj = data[0].fp
      // this.fplistLastObj.get('castype').setValue(this.castype);
      console.log('ojdfsjdkflk');

      console.log(this.fplistLastObj);
      this.sendAndStopConditions();

      this.castype_1 = this.fplistLastObj.casname;
      this.castypeid = this.fplistLastObj.castype;
      console.log(this.castype_1);
      this.finger = this.fplistLastObj.fptype;
      this.serviceNameId = this.fplistLastObj.serviceid;
      this.service_1 = this.fplistLastObj.servicename;
      // this.service_1 = this.fplistLastObj.isforce;
      console.log(this.service_1);
      console.log(this.serviceNameId);

      this.isforce = this.fplistLastObj.isforce;
      this.isdelete = this.fplistLastObj.isdelete;
      console.log('isforce', this.isforce);
      console.log('isdelete', this.isdelete);

      console.log('dsfdsfsdfsf', this.isforce = this.fplistLastObj.isforce)

      this.intend_1 = this.fplistLastObj.intendto;
      console.log('                  ' + this.intend_1);
      this.display_status = this.fplistLastObj.display_status;
      console.log('display_status' + this.display_status);

      this.type_1 = this.fplistLastObj.type;
      this.intendid_1 = this.fplistLastObj.intendid;
      console.log(this.intendid_1);
      this.intendidSmartcard = this.fplistLastObj.intendid;
      console.log(this.intendidSmartcard);

      this.intendidLco = this.fplistLastObj.lconame;
      console.log(this.intendidLco);
      this.covertype_1 = this.fplistLastObj.covertype;
      this.bgcolor_value = this.fplistLastObj.bgcolor;
      this.bgcolor_id = this.fplistLastObj.bgcolordisplay;
      console.log(this.fontcolor1);
      this.duration_1 = this.fplistLastObj.duration;
      this.display_duration = this.fplistLastObj.duration;
      // this.fontcolor_1 = this.fplistLastObj.fontcolor;
      this.fontcolor_1 = this.fplistLastObj.fontcolordisplay;
      console.log(this.fontcolor1);

      this.fontsize_1 = this.fplistLastObj.fontsize;
      this.fontstyle_1 = this.fplistLastObj.fontsize;
      this.positiontype_1 = this.fplistLastObj.positiontype;
      this.position_1 = this.fplistLastObj.position;
      this.repeatfor_1 = this.fplistLastObj.repeatfor;
      this.timegap_1 = this.fplistLastObj.timegap;
      this.transparancy_1 = this.fplistLastObj.transparancy;
      this.s_Style = this.fplistLastObj.transparancy;
      this.hh = this.fplistLastObj.hh;
      this.mm = this.fplistLastObj.mm;
      this.ss = this.fplistLastObj.ss;
      this.x = this.fplistLastObj.x;
      this.y = this.fplistLastObj.y;
      this.locationy = this.fplistLastObj.y;
      this.locationx = this.fplistLastObj.x;
      console.log('dfdfd');

      this.form.patchValue({ castype: this.fplistLastObj.castype });
      this.form.patchValue({ castypedisplay: this.fplistLastObj.casname });
      this.form.patchValue({ serviceid: this.fplistLastObj.serviceid });
      this.form.patchValue({ servicename: this.fplistLastObj.servicename });

      this.form.patchValue({ intendid: this.fplistLastObj.intendid });
      this.form.patchValue({ intendlco: this.fplistLastObj.lconame });

      console.log(this.form.value);
      const preSelectedbgColor = this.bgcolor_id;
      const matchingbgColor = this.bgcolor.find(color => color.lable === preSelectedbgColor);
      if (matchingbgColor) {
        this.bgcolor_id = matchingbgColor.value;
      }
      const preSelectedFontColor = this.fontcolor_1;
      const matchingFontColor = this.fontcolor.find((color: any) => color.lable === preSelectedFontColor);
      if (matchingFontColor) {
        this.fontcolor_1 = matchingFontColor.value;
      }

      const preSelectedbgColor1 = this.bgcolor_id;
      const matchingbg1Color1 = this.gcolor1.find((color: any) => color.lable === preSelectedbgColor1);
      if (matchingbg1Color1) {
        this.bgcolor_id = matchingbg1Color1.value;
      }
      const preSelectedFontColor1 = this.fontcolor_1;
      const matchingFontColor1 = this.fontcolor1.find((color: any) => color.lable === preSelectedFontColor1);
      if (matchingFontColor) {
        this.fontcolor_1 = matchingFontColor.value;
      }
      console.log(this.castype_1);
      let selectvalue = {
        id: this.castypeid,
        name: this.castype_1
      }
      this.onSelectionFingerPrint(selectvalue);
      console.log(selectvalue);

    })
    this.updateDisplayValue();
    this.checkScreenSize();

    this.forceFormControl.valueChanges.subscribe((value) => {
      this.isStopButtonEnabled = value === true;
    });
    // this.onSelectionFingerPrint(this.castype_1);
  }
  displayFn(casItem?: any): string {
    return casItem ? casItem.name : '';
  }
  onChangeForce1() {
    this.isStopButtonEnabled = this.isforce;
    console.log(this.isStopButtonEnabled);
    console.log(this.isforce);


  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.isPositionXYVisible_mobile = screenWidth <= 720;
  }
  updateDisplayValue() {
    const selectedCas = this.cas.find(casItem => casItem.id === this.castype_1);
    if (selectedCas) {
      this.searchTerm = selectedCas.name;
    }
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }


  filteredcas(): { name: string; id: number }[] {
    if (!this.searchTerm) {
      return this.cas;
    }
    return this.cas.filter(casItem =>
      casItem.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );


  }
  filteredService(): { name: string; id: number }[] {
    if (!this.searchServiceTerm) {
      return this.service;
    }
    return this.service.filter((service: any) =>
      service.name.toLowerCase().includes(this.searchServiceTerm.toLowerCase())
    );
  }
  filteredArea(): { name: string; id: number }[] {
    if (!this.searchAreaTerm) {
      return this.area;
    }
    return this.area.filter((area: any) =>
      area.name.toLowerCase().includes(this.searchAreaTerm.toLowerCase())
    );
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filteredCasList = this.filteredcas();
  }
  onSearchServiceChange(event: any) {
    this.searchServiceTerm = event.target.value;
    this.filteredServiceList = this.filteredService();
  }
  onSearchAreaChange(event: any) {
    this.searchAreaTerm = event.target.value;
    // this.filteredAreaList = this.filteredArea();
    this.filteredAreaList = this.filteredIntendArea();
  }

  onSearchCasChange(cas: { name: string; id: number }) {
    this.castype_1 = cas.name;
    console.log(this.castype_1);
    this.onSelectionFingerPrint(cas.id);
  }

  onAreaSelect(area: { name: string; id: number }) {
    this.intendid_1 = area.name;
    this.onSelectionFingerPrint(area.id);
  }
  onSearchLCOChange(event: any) {
    this.searchLCOTerm = event.target.value;
    // this.filteredLcoList = this.filteredIntendArea();
    this.filteredAreaList = this.filteredIntendArea();
  }
  onLCOSelect(LCO: { name: string; id: number }) {
    this.intendidLco = LCO.name;
    this.LCO_id = LCO.id;
    this.form.patchValue({ intendidLco: this.intendidLco });
    this.form.patchValue({ intendid: this.LCO_id });
  }
  onServiceSelect(service: { name: string; id: number }) {
    console.log(service);
    this.service_1 = service.name;
    this.serviceNameId = service.id;
    this.searchServiceTerm = service.name;
    this.form.patchValue({ serviceid: this.serviceNameId });
    this.form.patchValue({ servicename: this.service_1 });
  }
  ischange: Boolean = false;
  onSelectionFingerPrint(selectedValue: any) {
    console.log(selectedValue);
    this.ischange = true;
    this.castype_1 = selectedValue.id;
    console.log(this.castype_1);
    this.castype = selectedValue.id;
    this.casname = selectedValue.name;
    this.form.patchValue({ castype: this.castype });
    this.form.patchValue({ castypedisplay: selectedValue.name });
    if (this.finger == 'ecm') {
      this.isServiceName = true;
    } else {
      this.isServiceName = false;
    }

    if (this.castype != 6 && this.finger == 'emm') {
      this.force = true;
    } else {
      this.force = false;
    }

    if (([6, 1, 3].includes(this.castype) && this.finger == 'emm') || ![6, 1, 3].includes(this.castype)) {
      this.isIntendto = true;
    } else {
      this.isIntendto = false;
    }


    if (this.castype == 6) {
      this.isFontStyleSelectDisabled = true;
    } else {
      this.isFontStyleSelectDisabled = false;
    }
    if (this.castype == 6) {
      this.ispositiondisabled = false;
    } else if (this.castype == 4 || this.castype == 3 || this.castype == 2) {
      this.ispositiondisabled = false;
    } else {
      this.ispositiondisabled = true;
    }
    if (this.castype == 6) {
      this.isbackgroundcolor = false;
      this.isCasbackgroundcolor = true;
    } else {
      this.isbackgroundcolor = true;
      this.isCasbackgroundcolor = false;
    }
    if (this.castype == 6) {
      this.isfontColor = false;
      this.isCasfontColor = true;
    } else {
      this.isfontColor = true;
      this.isCasfontColor = false;
    }


    if (this.castype == 1) {
      this.isFontSizeDisabled = false;
      this.isFontSizeSelectDigit = true;
      this.isFontSizeSelectDisabled = false;
    }
    if (this.castype != 1) {
      this.isFontSizeSelectDigit = false;
      this.isFontSizeDisabled = true;
      this.isFontSizeSelectDisabled = false;
    }
    if (this.castype == 6) {
      this.isFontSizeSelectDisabled = true;
      this.isFontSizeSelectDigit = false;
      this.isFontSizeDisabled = false;
    }


    if (this.castype == 6) {
      this.isLocationVisible = true;
    } else {
      this.isLocationVisible = false;
    }
    if (this.castype != 6) {
      this.isTranparancy = true;
    } else {
      this.isTranparancy = false;
    }

    if (this.castype != 1) {
      this.isTransparency_select_Disabled = false;
      this.isTransparencyDisabled = true;
    } else if (this.castype == 1) {
      this.isTransparency_select_Disabled = true;
      this.isTransparencyDisabled = false;
    }

    // if (this.castype == 6) {
    //   this.isTranparancy = false;
    //   if (this.castype != 1) {
    //     this.isTransparency_select_Disabled = false;
    //     this.isTransparencyDisabled = true;
    //   }
    // } else {
    //   this.isTranparancy = true;
    //   if (this.castype == 1) {
    //     this.isTransparencyDisabled = false;
    //     this.isTransparency_select_Disabled = true;
    //   } else {
    //     this.isTransparency_select_Disabled = false;
    //     this.isTransparencyDisabled = true;
    //   }
    // }
    if (this.castype == 6) {
      this.isDuration = false;
    } else {
      this.isDuration = true;
    }
    // if (this.casId === 6) {
    //   this.isDisplayDuration == true;
    //   if (this.finger = "ecm")
    //     this.isminDidDuration = true;
    //   this.ismaxDidDuration = false;
    // } else if (this.finger = "emm") {
    //   this.isminDidDuration = false;
    //   this.ismaxDidDuration = true;
    // }
    // else {
    //   this.isDisplayDuration == false;
    // }
    console.log('finger', this.finger == "ecm");
    if (this.castype == 6) {
      this.isDisplayDuration = true;
      if (this.finger == "ecm") {
        console.log('finger', this.finger == "ecm");
        this.isminDidDuration = false;
        this.ismaxDidDuration = true;
      }
    } else if (this.finger == "emm") {
      console.log('finger', this.finger == "emm");
      this.isminDidDuration = false;
      this.ismaxDidDuration = true;
    } else {
      this.isDisplayDuration = false;
    }


    if (this.castype != 1 && this.castype != 6 && this.castype != 2) {
      this.isTimeGap = true;
    } else if (this.castype == 4) {
      this.isTimeGap = true;
    } else {
      this.isTimeGap = false;
    }




    if (this.castype != 6 && this.castype != 1) {
      this.isShowStyle = true;
    } else {
      this.isShowStyle = false;
    }

    if (this.castype == 6) {

    }
    // if (this.castype != 2) {
    //   this.isTimeSpan = true;
    // } else {
    //   this.isTimeSpan = false;
    // }

    if (this.castype != 2) {
      this.isHH = false;
      this.isMM = false;
    } else {
      this.isHH = true;
      this.isMM = true;
    }


    // if (this.castype != 6 && this.castype != 2 && this.castype != 1) {
    if (this.castype != 6 && this.castype != 1) {
      this.isrepeatfordisabled = true;
    } else {
      this.isrepeatfordisabled = false;
    }
  }

  onForce(selectForce: any) {
    console.log(selectForce);
    if (this.finger == 'ecm') {
      this.isServiceName = true;
    } else {
      this.isServiceName = false;
    }
    if (this.castype != 6 && this.finger == 'emm') {
      this.force = true;
    } else {
      this.force = false;
    }
    if (([6, 1, 3].includes(this.castype) && this.finger == 'emm') || ![6, 1, 3].includes(this.castype)) {
      this.isIntendto = true;
    } else {
      this.isIntendto = false;
    }
    // if (([6, 1, 3].includes(this.castype) && this.finger == 'ecm') || ![6, 1, 3].includes(this.castype)) {
    //   this.isIntendto = false;
    // } else {
    //   this.isIntendto = true;
    // }
  }


  onChangeIntendTo1(selectedValue: any) {
    this.isSmartcardEnabled = false;
    this.isAreaCodeEnabled = false;
    if (selectedValue == 1) {
      this.isSmartcardEnabled = false;
      this.isAreaCodeEnabled = false
    }
    if (selectedValue == 2) {
      this.isSmartcardEnabled = true;
      this.isAreaCodeEnabled = false
    }
    if (selectedValue == 3) {
      this.isAreaCodeEnabled = true;
      this.isSmartcardEnabled = false
    }
    if (selectedValue !== 2 && selectedValue !== 3) {
      console.log('Both disabled');
    }
  }
  validateExactLength(): void {
    const requiredLength = this.castype !== 6 ? 20 : 14;
    this.isInvalidLength = this.intendid_1.length > 0 && this.intendid_1.length !== requiredLength;
    const control = this.form.get('intendid');
    if (control) {
      control.setErrors(this.isInvalidLength ? { incorrectLength: true } : null);
    }
  }
  onChangePositionType(value: number) {
    if (value == 3) {
      this.isPositionXYVisible = true;
    } else {
      this.isPositionXYVisible = false;
    }
    if (value != 3) {
      this.x = '0';
      this.y = '0';
    }
  }
  isOptionDisabled(value: number): boolean {
    if ((this.castype == 1 || this.castype == 6 || this.castype == 3) && value === 3) {
      return true;
    }
    if (this.castype === 2 && value === 1) {
      return true;
    }
    return false;
  }
  getStatusClass(): string {
    if (this.display_status === 'SERVICE IS RUNNING') {
      return 'status-running';
    } else if (this.display_status === 'SERVICE IS NOT RUNNING') {
      return 'status-stopped';
    }
    return '';
  }
  issend: boolean = true;
  sendAndStopConditions() {
    if (this.fplistLastObj.isforce) {
      if (this.fplistLastObj.isdelete) {
        this.issend = false;
      } else {
        this.issend = true;
      }
    } else {
      this.issend = false;
    }
  }
}
