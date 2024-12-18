import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { CasDialogueComponent } from '../../channel_setting/_Dialogue/cas-dialogue/cas-dialogue.component';
import { TRUE } from 'node_modules1/sass/types';
import tree from 'node_modules1/@angular/material/schematics/ng-generate/tree';
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  submitted: boolean = false;
  form!: FormGroup;

  // matcher = new MyErrorStateMatcher();
  hide = true;
  castype: any;
  casname: any;
  gridApi: any;
  rowData = [];
  searchTerm: any;
  searchServiceTerm: any;
  searchLCOTerm: any;
  service: any[] = [];
  filteredCasList: { name: string; id: number }[] = [];
  filteredServiceList: { name: string; id: number }[] = [];
  filteredLcoList: { name: string; id: number }[] = [];
  cas: any[] = [];
  // cas: { name: string; id: number }[] = [];
  lco_name: any[] = [];
  intend: any = [
    { lable: "MSO", value: 1 },
    { lable: "Smartcard", value: 2 },
    { lable: "LCO", value: 3 },
  ];

  position: any = [
    { lable: "Top", value: 1 },
    { lable: "Bottom", value: 2 },
    { lable: "Right", value: 3 },
    { lable: "Left", value: 4 },
    { lable: "Center", value: 5 },
  ];
  fontsize: any = [
    { lable: "12", value: 12 },
    { lable: "16", value: 16 },
    { lable: "14", value: 14 },
    { lable: "32", value: 32 },
  ];
  backcolor: any = [
    { lable: "Red", value: "1" },
    { lable: "Green", value: "2" },
    { lable: "Blue", value: "3" },
    { lable: "Yellow", value: "4" },
    { lable: "Pink", value: "5" },
    { lable: "Black", value: "6" },
    { lable: "White", value: "7" },
  ];
  backcolor1: any = [
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
  fontcolor: any = [
    { lable: "Red", value: "1" },
    { lable: "Green", value: "2" },
    { lable: "Blue", value: "3" },
    { lable: "Yellow", value: "4" },
    { lable: "Pink", value: "5" },
    { lable: "Black", value: "6" },
    { lable: "White", value: "7" },

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
    { lable: "Enable", value: "true" },
    { lable: "Disable", value: "false" }
  ];
  force: boolean = true;
  forceEnabled: any;
  forceDisabled: any;
  intendto: any = '';
  intendid: any;
  intendid_1: any;
  force_1: boolean = false;
  serviceid_1: any;
  service_name: any;
  LCO_name: any;
  LCO_id: any;
  fontsize_1: any;
  fontcolor_1: any = '';
  bgcolor_1: any = '';
  repeatfor: any;
  repeatfor_1: any;
  transparancy_1: any;
  duration: any;
  timegap: any = 0;
  msgcontent: any;
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
  isservicedisabled: boolean = false;
  isFontSizeDisabled: boolean = false;
  isFontcolorDisabled: boolean = false;
  isCasfontColor: boolean = false;
  isBGcolorDisabled: boolean = false;
  isCasBGcolorDisabled: boolean = false;
  isRepeatforDisabled: boolean = false;
  isRepeatfor: boolean = false;
  isFource: boolean = false;
  isTransparancyDisabled: boolean = false;
  isDurationDisabled: boolean = false;
  isDuration: boolean = false;
  isTimeGap: boolean = false;
  isTimeGapDisabled: boolean = false;
  isMessage: boolean = false;
  isMessagnormal: boolean = false;
  isMessagecas: boolean = false;
  isInvalidLength: boolean = false;
  remainingChars: number = 0;
  casId: any;
  area: any[] = [];
  lco_list: any[] = [];
  username: any;
  role: any;
  constructor(private userservice: BaseService, private cdr: ChangeDetectorRef, private storageService: StorageService, private fb: FormBuilder, private swal: SwalService, public dialog: MatDialog) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userservice.GetMessageList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      console.log(this.rowData);
    })
    console.log(this.castype);

    this.form = this.fb.group({
      castype: [this.castype, Validators.required],
      forcemsg: [false, Validators.required],
      deletemsg: [false, Validators.required],
      intendto: [this.intendto, Validators.required],
      intendid: [0, Validators.required],
      serviceid: [0, Validators.required],
      fontsize: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
      position: ['', Validators.required],
      fontcolor: ['', Validators.required],
      bgcolor: ['', Validators.required],
      repeatfor: [0, Validators.required],
      transparency: ['', Validators.required],
      duration: [0, Validators.required],
      timegap: [0, Validators.required],
      msgcontent: ['', Validators.required],
      role: this.role,
      username: this.username,
    })
    this.setInitialRemainingChars();
  }
  ngOnInit() {
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.area = data[0].arealist;
      console.log(this.area);
      this.area = Object.entries(data[0].arealist).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.area);

      this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
      this.filteredCasList = this.cas;
      this.service = Object.entries(data[0].servicelist).map(([key, value]) => ({ name: key, id: value }));
    })
  }

  onSelectionFingerPrint(selectedValue: { name: any, id: any }): void {
    console.log(selectedValue);
    this.casId = Number(selectedValue);
    this.castype = selectedValue.id;
    this.casname = selectedValue.name;
    console.log(this.casname);
    console.log(this.castype);
    this.form.patchValue({ castype: this.castype });
    if ([3, 1, 2, 5, 6].includes(this.castype)) {
      this.isservicedisabled = false;
    } else {
      this.isservicedisabled = true;
    }
    if (this.castype == 6 || this.castype == 1) {
      this.isFontcolorDisabled = false;
    } else {
      this.isFontcolorDisabled = true;
    }
    if (this.castype == 6) {
      this.isCasfontColor = true;
    } else {
      this.isCasfontColor = false;
    }
    if (this.castype == 6 || this.castype == 1) {
      this.isBGcolorDisabled = false;
      this.isFontSizeDisabled = false;
    } else {
      this.isBGcolorDisabled = true;
      this.isFontSizeDisabled = true;
    }
    if (this.castype == 6) {
      this.isCasBGcolorDisabled = true;
    } else {
      this.isCasBGcolorDisabled = false;
    }

    if (this.castype == 4 || this.castype == 1) {
      this.isTransparancyDisabled = false;
    } else {
      this.isTransparancyDisabled = true;
    }

    if (this.castype == 6 && this.castype == 2) {
      this.isRepeatfor = false
      this.isTimeGap = false
    }
    else {
      this.isRepeatfor = true;
      this.isTimeGap = true;
    }
    if (this.castype == 4 || this.force_1 || this.castype == 5) {
      console.log(this.force_1);

      this.isRepeatforDisabled = true;
    } else {
      this.isRepeatforDisabled = this.force_1 ? false : true;
    }


    if (this.force_1 && this.castype != 6) {
      this.isDurationDisabled = false;
    } else {
      this.isDurationDisabled = true;
    }
    if (this.castype == 6 || this.castype == 2) {
      this.isRepeatfor = false
      this.isTimeGap = false
    }
    else {
      this.isRepeatfor = true;
      this.isTimeGap = true;
    }
    if (this.castype == 6) {
      this.isMessagnormal = false;
      this.isMessagecas = true;
    } else {
      this.isMessagnormal = true;
      this.isMessagecas = false;
    }
    if ([4, 5, 6, 8].includes(this.castype)) {
      this.isFource = false;
    } else {
      this.isFource = true;
    }
    
  }

  onChangeIntendTo1(selectedValue: any) {
    this.intendid_1 = '';
    this.isSmartcardEnabled = false;
    this.isAreaCodeEnabled = false;
    console.log('enabled             =' + selectedValue);
    if (selectedValue == 1) {
      this.isSmartcardEnabled = false;
      this.isAreaCodeEnabled = false
      console.log('Smartcard enabled');
    }
    if (selectedValue == 2) {
      this.isSmartcardEnabled = true;
      this.isAreaCodeEnabled = false
      console.log('Smartcard enabled');
    }

    if (selectedValue == 3) {
      this.isAreaCodeEnabled = true;
      this.isSmartcardEnabled = false
      console.log('Area code enabled');
    }
    if (selectedValue !== 2 && selectedValue !== 3) {
      console.log('Both disabled');
    }
  }
  setInitialRemainingChars() {
    const maxLength = this.castype === 1 ? 120 : this.isMessagecas ? 250 : 1024;
    this.remainingChars = maxLength;
  }

  updateRemainingChars(event: Event) {
    this.cdr.detectChanges();
    const input = event.target as HTMLTextAreaElement;
    const maxLength = input.maxLength;
    const currentLength = input.value.length;
    this.remainingChars = maxLength - currentLength;
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "INTEND ID", field: 'intendid' },
    { headerName: "INTEND TO", field: 'intendto' },
    { headerName: "MESSAGE", field: 'msgcontent' },
    { headerName: "FONT COLOR	", field: 'fontcolordisplay' },
    { headerName: "BACKGROUND COLOR	", field: 'bgcolordisplay' },
    { headerName: "REPEAT FOR", field: 'repeatfor' },
    { headerName: "TRANSPARENCY	", field: 'transparency' },
    { headerName: "DURATION", field: 'duration' },
    { headerName: "TIME GAP	", field: 'timegap' },
    { headerName: "CAS", field: 'casname' },
    {
      headerName: 'ACTIONS',
      width: 320,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        const ResendButton = document.createElement('button');
        ResendButton.innerHTML = '<button style="width: 5em;background-color: #48804f;color:white;border-radius: 5px;height: 2em;"><p style="margin-top:-6px">RESEND</p></button>';
        ResendButton.style.backgroundColor = 'transparent';
        ResendButton.style.border = 'none';
        ResendButton.title = 'Resend';
        ResendButton.style.cursor = 'pointer';
        ResendButton.style.marginLeft = '20px';
        ResendButton.addEventListener('click', () => {
          this.openDialog(params.data, 'resend');
        });

        div.appendChild(ResendButton);
        if ((params.data.forcemsg === true && params.data.deletemsg === false) || (params.data.isdelete === 5 && params.data.deletemsg === false)) {
          const StopButton = document.createElement('button');
          StopButton.innerHTML = '<button style="width: 5em;background-color: #c35f5f;border-radius: 5px;height: 2em;"><p style="margin-top:-6px">STOP</p></button>';
          StopButton.style.backgroundColor = 'transparent';
          StopButton.style.border = 'none';
          StopButton.title = 'Stop';
          StopButton.style.cursor = 'pointer';
          StopButton.style.marginLeft = '20px';
          StopButton.addEventListener('click', () => {
            this.openDialog(params.data, 'message_stop');
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

  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 15,
    pagination: true,
  }
  onGridReady(params: any) {
    this.gridApi = params.api
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
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
    console.log('Selected Service:', this.castype, this.casname);
  }
  onLCOSelect(LCO: { name: string; id: number }) {
    this.LCO_name = LCO.name;
    this.LCO_id = LCO.id;
    this.form.patchValue({ intendid: this.LCO_id });
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
  filteredIntendArea(): { name: string; id: number }[] {
    if (!this.searchLCOTerm) {
      return this.area;
    }
    return this.area.filter((area: { name: string }) =>
      area.name.toLowerCase().includes(this.searchLCOTerm.toLowerCase())
    );
  }
  validateExactLength(): void {
    const requiredLength = this.castype !== 6 ? 20 : 14;
    this.isInvalidLength = this.intendid_1.length > 0 && this.intendid_1.length !== requiredLength;
    const control = this.form.get('intendid');
    if (control) {
      control.setErrors(this.isInvalidLength ? { incorrectLength: true } : null);
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.isSmartcardEnabled) {
      this.form.patchValue({
        intendid: this.form.get('intendid')?.value
      });
    } else if (this.isAreaCodeEnabled) {
      this.form.patchValue({
        intendid: this.form.get('intendid')?.value
      });
    }

    if (this.form.valid) {
    } else {
      this.form.markAllAsTouched();
    }

    Swal.fire({
      title: 'Updating...',
      text: 'Please wait while the Message is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    console.log(this.form.value);

    this.userservice.CreateMessage(this.form.value).subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire({
          title: 'Success!',
          text: res?.message || 'Message created successfully.',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error.castype || error?.error.intendid || error?.error.serviceid || error?.error.fontsize || error?.error.duration || error?.error.repeatfor || error?.error.timegap ||
            error?.error.msgcontent || error?.error.message || 'There was a problem creating the message.',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          this.form.markAllAsTouched();
        });
      }
    );
  }



  onKeydown(event: KeyboardEvent) {
    const key = event.key;

    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onForceChange(event: any) {
    console.log(this.castype);
    console.log(this.force_1);

    if (this.force_1 === false) {
      this.cdr.detectChanges();
      this.isRepeatfor = [1, 3, 7].includes(this.castype);
      this.isDurationDisabled = true;
      // this.isDurationDisabled = [2, 4, 5,6,8].includes(this.castype);
      this.isTimeGap = [1, 3, 7].includes(this.castype);
    } else {
      this.isRepeatfor = false;
      this.isDurationDisabled = false;
      this.isTimeGap = false;
    }


    this.force_1 = event.value;
    this.isRepeatforDisabled = !this.force_1;
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
}
