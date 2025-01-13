import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
// import { MyErrorStateMatcher } from '../message/message.component';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/_core/service/swal.service';
import { CasDialogueComponent } from '../../channel_setting/_Dialogue/cas-dialogue/cas-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
// import { FALSE } from 'node_modules1/sass/types';
// import { log } from 'console';

@Component({ 
  selector: 'app-scrolling',
  templateUrl: './scrolling.component.html',
  styleUrls: ['./scrolling.component.scss']
})
export class ScrollingComponent {
  submitted = false;
  form!: FormGroup;

  // matcher = new MyErrorStateMatcher();
  hide = true;
  intendname: any;
  gridApi: any;
  rowData = [];
  searchTerm: any;
  searchServiceTerm: any;
  searchLCOTerm: any;
  service: any[] = [];
  filteredCasList: { name: string; id: number }[] = [];
  filteredServiceList: { name: string; id: number }[] = [];
  filteredLcoList: { name: string; id: number }[] = [];
  castype: any;
  casname: any;
  casId: any;
  serviceid_1: any;
  service_name: any;
  LCO_name: any;
  LCO_id: any;

  isService: boolean = false;
  isServiceDisabled: boolean = false;
  isFontSizeSelectDisabled: boolean = false;
  isFontSizeDisabled: boolean = false;
  isFontSize: boolean = false;
  isMarque: boolean = false;
  isScrollColor: boolean = false;
  isFontColor: boolean = false;
  isBackgroundColor: boolean = false;
  isBackgroundColor1: boolean = false;
  isRepeatDisabled: boolean = false;
  isTransparancyDisabled: boolean = false;
  isDurationDisabled: boolean = false;
  isTimeGapDisabled: boolean = false;
  isScrollingTypeDisabled: boolean = false;
  isInvalidLength: boolean = false;

  castype_1: any;
  isforce: boolean = false;
  intend_1: any;
  intendid_1: any;
  intendTo_1: any = '';
  service_1: any;
  fontsize_1: any;
  position_1: any = '';
  marque1: any = '';
  Scroll_color_1: any = '';
  Scroll_bgColor_1: any = '';
  scrollType1: any = '';
  BG_color_1: any = '';
  Repeatfor_1: any;
  Transparancy_1: any;
  Duration_1: any;
  Timegap_1: any;
  message_1: any;
  isStopButtonEnabled = false;
  scrollfontsize: any = '';


  cas: any[] = [];
  area: any[] = []
  // service: any[] = [];
  lco_name: any = [
    { lable: "d", value: 0 },
    { lable: "frgfd", value: 1 },
    { lable: "fdgdfg", value: 2 },
  ]
  intend: any = [
    { lable: "MSO", value: 1 },
    { lable: "Smartcard", value: 2 },
    { lable: "LCO", value: 3 },
  ];

  onChangeForce1() {
    this.isStopButtonEnabled = this.isforce === true;
  }
  marque: any = [
    { lable: "Right-Left", value: 1 },
    { lable: "Left-Right", value: 2 },
  ];
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

  bgcolor: any = [
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
  bgcolor1: any = [
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
  scrollType: any = [
    { lable: "Scroll Only", value: "0" },
    { lable: "Scroll With Smartcard", value: "1" },
    { lable: "Scroll With STB id", value: "2" },
    { lable: "Scroll With STB id and Smartcard", value: "3" }
  ];
  transparency: any;
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
  isSmartcardEnabled: boolean = false;
  isAreaCodeEnabled: boolean = false;
  username: any;
  role: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 10,
    pagination: true,
  }
  constructor(private userservice: BaseService, private storageService: StorageService, private fb: FormBuilder, private swal: SwalService, public dialog: MatDialog) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userservice.Get_Scroll_version_List(this.role, this.username).subscribe((data: any) => {
      this.rowData = data;
      console.log(this.rowData);
      const lastIndex = data.length - 1;
      const lastItem = data[lastIndex];
      console.log("Last Index:", lastIndex);
      console.log("Last Item:", lastItem);
      this.castype_1 = lastItem.casname;
      console.log('cstype', this.castype_1);

      this.isforce = data[0].fplist[0].isforce;
      this.service_1 = data[0].fplist[0].serviceid;
      this.intend_1 = data[0].fplist[0].intendto;
      this.intendid_1 = lastItem.intendid;
      this.intendTo_1 = lastItem.intendto;
      this.BG_color_1 = data[0].fplist[0].bgcolor;
      this.Duration_1 = data[0].fplist[0].duration;
      this.Scroll_color_1 = lastItem.scrollcolor;
      this.Scroll_bgColor_1 = lastItem.scrollbgcolor;
      this.fontsize_1 = data[0].fplist[0].fontsize;
      this.position_1 = lastItem.scrollposition;
      this.position_1 = data[0].fplist[0].position;
      this.Repeatfor_1 = data[0].fplist[0].repeatfor;
      this.Timegap_1 = data[0].fplist[0].timegap;
      this.message_1 = data[0].fplist[0].message
      this.Transparancy_1 = data[0].fplist[0].transparancy;
    })

    this.form = this.fb.group({
      castype: [this.castype, Validators.required],
      isforce: ['', Validators.required],
      intendto: ['', Validators.required],
      intendid: [0, Validators.required],
      serviceid: ['', Validators.required],
      scrollfontsize: ['', Validators.required],
      scrollposition: ['', Validators.required],
      scrollcolor: [0, Validators.required],
      scrollbgcolor: [0, Validators.required],
      repeatfor: [0, Validators.required],
      transparency: [0, Validators.required],
      duration: [0, Validators.required],
      timegap: [0, Validators.required],
      languagetype: [0, Validators.required],
      message: ['', Validators.required],
      scrollType: 0,
      marque: 0,
      e_date: 0,
      role: this.role,
      username: this.username,
    })
    // if (this.form.get('intendid').value === '') {
    //   this.form.get('intendid').setValue('1');
    // }
    // this.onSelectionFingerPrint;
  }
  ngOnInit() {


    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.area = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, id: value };
      });
    })


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
    this.userservice.ServiceList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.service = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, id: value };
      });
      // this.filteredLcoList = this.area;
    })
    // this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
    //   // this.area = Object.entries(data[0].arealist).map(([key, value]) => ({ name: key, id: value }));
    //   // this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
    //   this.service = Object.entries(data[0].servicelist).map(([key, value]) => ({ name: key, id: value }));
    //   console.log(this.area);
    //   console.log(data);

    //   // this.castype_1 = data[0].fplist[0].castype;
    //   // this.isforce = data[0].fplist[0].isforce;
    //   // this.service_1 = data[0].fplist[0].serviceid;
    //   // this.intend_1 = data[0].fplist[0].intendto;
    //   // this.intendid_1 = data[0].fplist[0].intendid;
    //   // this.BG_color_1 = data[0].fplist[0].bgcolor;
    //   // this.Duration_1 = data[0].fplist[0].duration;
    //   // this.Scrool_color_1 = data[0].fplist[0].fontcolor;
    //   // this.fontsize_1 = data[0].fplist[0].fontsize;
    //   // this.position_1 = data[0].fplist[0].positiontype;
    //   // this.position_1 = data[0].fplist[0].position;
    //   // this.Repeatfor_1 = data[0].fplist[0].repeatfor;
    //   // this.Timegap_1 = data[0].fplist[0].timegap;
    //   // this.message_1 = data[0].fplist[0].message
    //   // this.Transparancy_1 = data[0].fplist[0].transparancy;
    //   // this.filteredLcoList = this.area;
    //   this.filteredServiceList = this.service;
    // })
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "INTEND ID", field: 'intendid' },
    {
      headerName: "FORCE TYPE",
      field: 'forcemsg',
      cellRenderer: (params: { value: any; }) => {
        if (params.value === 'Force') {
          return `<span style="color: green;">${params.value}</span>`;
        } else if (params.value === 'Not Force') {
          return `<span style="color: red;">${params.value}</span>`;
        }
        return params.value;
      },
    },
    { headerName: "INTEND TO", field: 'intendto' },
    { headerName: "MESSAGE", field: 'scrollmsg' },
    { headerName: "FONT COLOR	", field: 'fontcolordisplay' },
    { headerName: "BACKGROUND COLOR	", field: 'bgcolordisplay' },
    { headerName: "REPEAT FOR", field: 'repeatfor', cellStyle: { textAlign: 'center' }, },
    { headerName: "TRANSPARANCY	", field: 'transparency' , cellStyle: { textAlign: 'center' },},
    { headerName: "DURATION", field: 'duration' , cellStyle: { textAlign: 'center' },},
    { headerName: "TIME GAP	", field: 'timegap', cellStyle: { textAlign: 'center' }, },
    { headerName: "CAS", field: 'casname' },
    {
      headerName: 'ACTIONS',
      width: 320,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');

        if ((params.data.isforce === true && params.data.isdelete === false) || (params.data.isdelete === 2) || (params.data.isdelete === 5 && params.data.isdelete === false)) {
          const StopButton = document.createElement('button');
          StopButton.innerHTML = '<button style="width: 5em;background-color: #998f68;border-radius: 5px;height: 2em;"><p style="margin-top:-6px">STOP</p></button>';
          StopButton.style.backgroundColor = 'transparent';
          StopButton.style.border = 'none';
          StopButton.title = 'Stop';
          StopButton.style.cursor = 'pointer';
          StopButton.style.marginLeft = '20px';
          StopButton.addEventListener('click', () => {
            this.openDialog(params.data, 'scroll_stop');
          });

          div.appendChild(StopButton);
        } else {
          const DisabledStopButton = document.createElement('button');
          DisabledStopButton.innerHTML = '<button style="width: 5em;background-color: grey;border-radius: 5px;height: 2em;" disabled><p style="margin-top:-6px">STOP</p></button>';
          DisabledStopButton.style.backgroundColor = 'transparent';
          DisabledStopButton.style.border = 'none';
          DisabledStopButton.title = 'Stop (Disabled)';
          DisabledStopButton.style.cursor = 'not-allowed';
          DisabledStopButton.style.marginLeft = '20px';
          div.appendChild(DisabledStopButton);
        }
        return div;
      }
    }

  ];


  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onGridReady = () => {


  }
  openStoDialog(event: any) {
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Recurring is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userservice.stopScroll(event.id, this.role, this.username).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
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

  openDialog(event: any, type: any): void {
    let dialogData = { data: event, type: type };
    const dialogRef = this.dialog.open(CasDialogueComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    console.log(dialogData);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  validateExactLength(): void {
    const requiredLength = this.castype !== 6 ? 20 : 14;
    this.isInvalidLength = this.intendid_1.length > 0 && this.intendid_1.length !== requiredLength;
    const control = this.form.get('intendid');
    if (control) {
      control.setErrors(this.isInvalidLength ? { incorrectLength: true } : null);
    }
  }
  submit() {
    // if (this.form.valid) {
    Swal.fire({
      title: 'Updateing...',
      text: 'Please wait while the Scrolling is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
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
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error.castype ||
            error?.error.duration ||
            error?.error.intendid ||
            error?.error.intendto ||
            error?.error.message ||
            error?.error.repeatfor ||
            error?.error.scrollbgcolor ||
            error?.error.scrollcolor ||
            error?.error.scrollfontsize || error?.error.scrollposition || error?.error.timegap || error?.error.transparency || 'There was a problem creating the message.',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          // Revalidate the form fields after API error, marking controls as touched
          this.form.markAllAsTouched();
        });
      }
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
  onSearchLCOChange(event: any) {
    this.searchLCOTerm = event.target.value;
    this.filteredLcoList = this.filteredIntendArea();
  }

  onServiceSelect(service: { name: string; id: number }) {
    this.service_name = service.name;
    this.serviceid_1 = service.id;
    this.form.patchValue({ serviceid: this.serviceid_1 });
  }
  onLCOSelect(LCO: { name: string; id: number }) {
    this.LCO_name = LCO.name;
    this.LCO_id = LCO.id;
    this.form.patchValue({ intendid: this.LCO_id });
    // console.log('Selected intend:', this.LCO_id, this.LCO_name);
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
  filteredIntendArea(): { name: string; id: number }[] {
    if (!this.searchLCOTerm) {
      return this.area;
    }
    return this.area.filter((area: { name: string }) =>
      area.name.toLowerCase().includes(this.searchLCOTerm.toLowerCase())
    );
  }
  // onSelectionFingerPrint(selectedValue: string) {
  //   console.log(selectedValue);
  onSelectionFingerPrint(selectedValue: { name: any, id: any }): void {
    this.castype = selectedValue.id;
    this.casname = selectedValue.name;
    console.log(this.castype);
    // this.casId = Number(selectedValue);
    this.form.patchValue({ castype: this.castype });

    // if (this.castype == 6 || this.castype == 1 || this.castype == 2 || this.castype == 3 || this.castype == 5) {
    //   this.isServiceDisabled = false
    // } else {
    //   this.isServiceDisabled = true;
    // }
    if (this.castype == 6) {
      this.isMarque = true
    } else {
      this.isMarque = false;
    }
    if ([1, 2, 3, 5, 6].includes(this.castype)) {
      this.isServiceDisabled = false;
    } else {
      this.isServiceDisabled = true;
    }

    if (this.castype === 6) {
      this.isFontSize = false;
    } else {
      this.isFontSize = true;
    }
    if (this.castype === 6) {
      this.isFontSizeDisabled = false;
      this.isFontSizeSelectDisabled = false;
    } else if (this.castype === 1) {
      this.isFontSizeDisabled = false;
      this.isFontSizeSelectDisabled = true;
    } else {
      this.isFontSizeDisabled = true;
      this.isFontSizeSelectDisabled = false;
    }

    if (this.castype == 6) {
      this.isScrollColor = false;
      this.isBackgroundColor = false;
    } else {
      this.isScrollColor = true;
      this.isBackgroundColor = true;
    }
    if (this.castype != 6) {
      this.isFontColor = false;
      this.isBackgroundColor1 = false;
    } else {
      this.isFontColor = true;
      this.isBackgroundColor1 = true;
    }
    if (this.castype === 6 || this.castype === 2 || this.castype === 4) {
      this.isRepeatDisabled = false;
    } else {
      this.isRepeatDisabled = true;
    }
    if (this.castype == 1 || this.castype == 4) {
      this.isTransparancyDisabled = false;
    } else {
      this.isTransparancyDisabled = true;
    }
    if (this.castype == 1 || this.castype == 5) {
      this.isDurationDisabled = false;
    } else {
      this.isDurationDisabled = true;
    }
    if ([6, 2, 1, 4].includes(this.castype)) {
      this.isTimeGapDisabled = false;
    } else {
      this.isTimeGapDisabled = true;
    }

    if (this.castype == 1) {
      this.isScrollingTypeDisabled = true;
    } else {
      this.isScrollingTypeDisabled = false;
    }
  }

  // onChangeIntendTo1(selectedValue: any) {
  //   // this.isSmartcardEnabled = false;
  //   // this.isAreaCodeEnabled = false;
  //   console.log('enabled' + selectedValue);
  //   if (selectedValue === 2) {
  //     this.isSmartcardEnabled = false;
  //     console.log('Smartcard enabled');
  //   }

  //   if (selectedValue === 3) {
  //     this.isAreaCodeEnabled = false;
  //     console.log('Area code enabled');
  //   }
  //   if (selectedValue !== 2 && selectedValue !== 3) {
  //     console.log('Both disabled');
  //     this.isSmartcardEnabled = false;
  //     this.isAreaCodeEnabled = false;
  //   }
  // }

  onChangeIntendTo1(selectedValue: any) {
    this.intendid_1 = '';
    this.isSmartcardEnabled = false;
    this.isAreaCodeEnabled = false;
    console.log('enabled             =' + selectedValue);
    if (selectedValue == 1) {
      this.intendid_1 = '1';
      this.isSmartcardEnabled = false;
      this.isAreaCodeEnabled = false
      console.log('Smartcard enabled');
    }
    if (selectedValue == 2) {
      this.intendid_1 = '';
      this.isSmartcardEnabled = true;
      this.isAreaCodeEnabled = false
      console.log('Smartcard enabled');
    }

    if (selectedValue == 3) {
      this.intendid_1 = '';
      this.isAreaCodeEnabled = true;
      this.isSmartcardEnabled = false
      console.log('Area code enabled');
    }
    if (selectedValue !== 2 && selectedValue !== 3) {
      console.log('Both disabled');
    }
  }


}


