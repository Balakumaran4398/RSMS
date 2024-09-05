import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { MyErrorStateMatcher } from '../message/message.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scrolling',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.scss']
})
export class ScrollingComponent {
  submitted = false;
  form!: FormGroup;

  matcher = new MyErrorStateMatcher();
  hide = true;

  gridApi: any;
  rowData = [];
  searchTerm: any;
  isService: boolean = false;
  isFontSizeSelectDisabled: boolean = true;
  isFontSizeDisabled: boolean = false;

  castype_1: any;
  isforce: boolean = false;
  intend_1: any;
  intendid_1: any;
  service_1: any;
  fontsize_1: any;
  position_1: any;
  Scrool_color_1: any;
  BG_color_1: any;
  Repeatfor_1: any;
  Transparancy_1: any;
  Duration_1: any;
  Timegap_1: any;
  message_1: any;
  isStopButtonEnabled = false;



  cas: any[] = [];
  area: any[] = []
  service: any[] = [];
  lco_name: any = [
    { lable: "d", value: 0 },
    { lable: "frgfd", value: 1 },
    { lable: "fdgdfg", value: 2 },
  ]
  intend: any = [
    { lable: "MSO", value: 1 },
    { lable: "SMARTCARD", value: 2 },
    { lable: "AREA CODE", value: 3 },
  ];
  filteredIntendArea(): any[] {
    if (!this.searchTerm) {
      return this.area;
    }
    return this.area.filter((area: any) =>
      area.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onChangeForce1() {
    this.isStopButtonEnabled = this.isforce === true;
  }
  position: any = [
    { lable: "Top", value: 1 },
    { lable: "Bottom", value: 2 },

  ];
  fontsize: any = [
    { lable: "12", value: 12 },
    { lable: "16", value: 16 },
    { lable: "14", value: 14 },
    { lable: "32", value: 32 },
  ];
  backcolor: any = [
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
    { lable: "Enable", value: "true" },
    { lable: "Disable", value: "false" }
  ];
  force: boolean = true;
  intendto: any = [];
  isVisible!: boolean;
  isIntendMso: boolean = true;
  isIntendId: boolean = false;
  isButtonEnable: boolean = false;
  isChannelHide: boolean = false;
  isEditing: boolean = true;
  isForce: boolean = true;
  isIntendto: boolean = true;
  isIntendForLco: boolean = false;
  isSmartcardEnabled: boolean = true;
  isAreaCodeEnabled: boolean = true;
  username: any;
  role: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  constructor(private userservice: BaseService, private storageService: StorageService, private fb: FormBuilder) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userservice.Get_Scroll_version_List(this.role, this.username).subscribe((data: any) => {
      this.rowData = data;
      console.log(this.rowData);
    })
    this.form = this.fb.group({
      castype: ['', Validators.required],
      isforce: ['', Validators.required],
      intendto: ['', Validators.required],
      intendid: ['', Validators.required],
      serviceid: ['', Validators.required],
      scrollfontsize: ['', Validators.required],
      scrollposition: ['', Validators.required],
      scrollcolor: ['', Validators.required],
      scrollbgcolor: ['', Validators.required],
      repeatfor: ['', Validators.required],
      transparancy: ['', Validators.required],
      duration: ['', Validators.required],
      timegap: ['', Validators.required],
      message: ['', Validators.required],
      languagetype: 0,
      marque: 0,
      e_date: 0,
      role: this.role,
      username: this.username,
    })
  }
  ngOnInit() {

    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      this.area = Object.entries(data[0].arealist).map(([key, value]) => ({ name: key, id: value }));
      this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
      this.service = Object.entries(data[0].servicelist).map(([key, value]) => ({ name: key, id: value }));
      this.castype_1 = data[0].fplist[0].castype;
      this.isforce = data[0].fplist[0].isforce;
      this.service_1 = data[0].fplist[0].serviceid;
      this.intend_1 = data[0].fplist[0].intendto;
      this.intendid_1 = data[0].fplist[0].intendid;
      this.BG_color_1 = data[0].fplist[0].bgcolor;
      this.Duration_1 = data[0].fplist[0].duration;
      this.Scrool_color_1 = data[0].fplist[0].fontcolor;
      this.fontsize_1 = data[0].fplist[0].fontsize;
      this.position_1 = data[0].fplist[0].positiontype;
      this.position_1 = data[0].fplist[0].position;
      this.Repeatfor_1 = data[0].fplist[0].repeatfor;
      this.Timegap_1 = data[0].fplist[0].timegap;
      this.message_1 = data[0].fplist[0].message
      this.Transparancy_1 = data[0].fplist[0].transparancy;
    })
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "INTEND ID", field: 'intendto' },
    { headerName: "INTEND TO", field: 'intendid' },
    { headerName: "MESSAGE", field: 'scrollmsg' },
    { headerName: "FONT COLOR	", field: 'scrollcolor' },
    { headerName: "BACKGROUND COLOR	", field: 'scrollbgcolor' },
    { headerName: "REPEAT FOR", field: 'repeatfor' },
    { headerName: "TRANSPARANCY	", field: 'transparency' },
    { headerName: "DURATION", field: 'duration' },
    { headerName: "TIME GAP	", field: 'timegap' },
    { headerName: "CAS", field: 'casname' },
    { headerName: "ACTION", field: '' },
  ];


  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onGridReady = () => {


  }


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
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



  submit() {
    console.log('11111111111111');


    // if (this.form.valid) {
      this.userservice.CreateScroll(this.form.value).subscribe(
        (res: any) => {
          console.log(res);
          Swal.fire({
            icon: 'success',
            title: 'Submission Successful!',
            text: res.message || 'Your data has been successfully submitted.',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            location.reload();
          });
        },
        (error) => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: error?.error.message || 'There was an error submitting your data.',
          });
        }
      );
    // } else {
    //   this.form.markAllAsTouched();
    // }
  }

  onSelectionFingerPrint(selectedValue: string) {
    console.log(selectedValue);
    this.isButtonEnable = false;

    const casId = Number(selectedValue);

    console.log(casId);
    if (casId == 7) {
      this.isService = true;
      console.log(this.isService);

    } else {
      this.isService = false;
      console.log(this.isService);
    }
    if (casId == 1) {
      this.isFontSizeDisabled = true;
      this.isFontSizeSelectDisabled = false;
    } else {
      this.isFontSizeDisabled = false;
      this.isFontSizeSelectDisabled = true;
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

}
