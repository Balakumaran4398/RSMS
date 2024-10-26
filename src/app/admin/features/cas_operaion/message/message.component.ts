import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { CasDialogueComponent } from '../../channel_setting/_Dialogue/cas-dialogue/cas-dialogue.component';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  submitted = false;
  form!: FormGroup;

  matcher = new MyErrorStateMatcher();
  hide = true;

  gridApi: any;
  rowData = [];
  searchTerm: any;
  cas: any[] = [];
  service: any[] = [];
  lco_name: any[] = [];
  intend: any = [
    { lable: "MSO", value: 0 },
    { lable: "Smartcard", value: 1 },
    { lable: "LCO", value: 2 },
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
  // backcolor: any = [
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
  isSmartcardEnabled: boolean = false;
  isAreaCodeEnabled: boolean = false;
  isservicedisabled: boolean = true;
  isFontSizeDisabled: boolean = true;
  isFontcolorDisabled: boolean = true;
  isBGcolorDisabled: boolean = true;
  isTransparancyDisabled: boolean = true;
  isDurationDisabled: boolean = true;
  isRepeatforDisabled: boolean = true;


  area: any[] = [];
  lco_list: any[] = [];
  username: any;
  role: any;
  constructor(private userservice: BaseService, private storageService: StorageService, private fb: FormBuilder, private swal: SwalService, public dialog: MatDialog) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userservice.GetMessageList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      console.log(this.rowData);
    })
    this.form = this.fb.group({
      castype: ['', Validators.required],
      forcemsg: [false, Validators.required],
      deletemsg: [false, Validators.required],
      intendto: ['', Validators.required],
      // intendid: ['', Validators.required],
      intendid: ['', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(20),
        Validators.pattern('^[0-9]{20}$') // Allows exactly 20 digits
      ]],
      serviceid: ['', Validators.required],
      fontsize: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      position: ['', Validators.required],
      fontcolor: ['', Validators.required],
      bgcolor: ['', Validators.required],
      repeatfor: ['', Validators.required],
      transparancy: ['', Validators.required],
      duration: ['', Validators.required],
      timegap: ['', Validators.required],
      msgcontent: ['', Validators.required],
      role: this.role,
      username: this.username,
    })
  }
  ngOnInit() {
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.area = data[0].arealist;
      console.log(this.area);
      this.area = Object.entries(data[0].arealist).map(([key, value]) => ({ name: key, id: value }));
      this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
      this.service = Object.entries(data[0].servicelist).map(([key, value]) => ({ name: key, id: value }));
    })
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "INTEND ID", field: 'intendid' },
    { headerName: "INTEND TO", field: 'intendto' },
    { headerName: "MESSAGE", field: 'msgcontent' },
    { headerName: "FONT COLOR	", field: 'fontcolor' },
    { headerName: "BACKGROUND COLOR	", field: 'bgcolor' },
    { headerName: "REPEAT FOR", field: 'repeatfor' },
    { headerName: "TRANSPARANCY	", field: 'transparency' },
    { headerName: "DURATION", field: 'duration' },
    { headerName: "TIME GAP	", field: 'timegap' },
    { headerName: "CAS", field: 'casname' },
    {
      headerName: 'ACTIONS',
      width: 320,

      cellRenderer: (params: any) => {
        const div = document.createElement('div');

        // Always show the Resend button
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

        // Append the Resend button
        div.appendChild(ResendButton);

        // Check the condition to enable or disable the Stop button
        if ((params.data.forcemsg === true && params.data.deletemsg === false) || (params.data.isdelete === 5 && params.data.deletemsg === false)) {
          // Create and append the Stop button if the condition is true
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
          // Create and append the disabled Stop button if the condition is false
          const DisabledStopButton = document.createElement('button');
          DisabledStopButton.innerHTML = '<button style="width: 5em;background-color: grey;border-radius: 5px;height: 2em;" disabled><p style="margin-top:-6px">STOP</p></button>';
          DisabledStopButton.style.backgroundColor = 'transparent';
          DisabledStopButton.style.border = 'none';
          DisabledStopButton.title = 'Stop (Disabled)';
          DisabledStopButton.style.cursor = 'not-allowed';
          DisabledStopButton.style.marginLeft = '20px';

          div.appendChild(DisabledStopButton);
        }

        // Return the div with both buttons
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
  filteredIntendArea(): any[] {
    if (!this.searchTerm) {
      return this.area;
    }
    return this.area.filter((area: any) =>
      area.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  onSubmit() {
    if (this.isSmartcardEnabled) {
      this.form.patchValue({
        intendid: this.form.get('intendid')?.value
      });
    } else if (this.isAreaCodeEnabled) {
      this.form.patchValue({
        intendid: this.form.get('intendid')?.value
      });
    }
    // if (this.form.valid) {

      Swal.fire({
        title: 'Updating...',
        text: 'Please wait while the Message is being updated',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });

      // Call the API
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
            text: error?.error.message || 'There was a problem creating the message.',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
          }).then(() => {
            // Revalidate the form fields after API error, marking controls as touched
            this.form.markAllAsTouched();
          });
        }
      );
      // } else {
      //   // If form is invalid, mark all fields as touched to show validation errors
      //   this.form.markAllAsTouched();
      // }
    //   this.form.markAllAsTouched(); // This will trigger the validation messages if there are errors
    //   return;
    // }
  }


  onSelectionFingerPrint(selectedValue: string) {
    this.isButtonEnable = false;
    const casId = Number(selectedValue);
    if (casId == 3) {
      this.isservicedisabled = false;
    } else {
      this.isservicedisabled = true;
    }
    if (casId == 1) {
      this.isFontSizeDisabled = false;
      this.isFontcolorDisabled = false;
      this.isBGcolorDisabled = false;
      this.isTransparancyDisabled = false;
    } else {
      this.isFontSizeDisabled = true;
      this.isFontcolorDisabled = true;
      this.isBGcolorDisabled = true;
      this.isTransparancyDisabled = true;
    }
  }


  onChangeIntendTo1(selectedValue: any) {
    this.isSmartcardEnabled = false;
    this.isAreaCodeEnabled = false;
    console.log('enabled             =' + selectedValue);
    if (selectedValue == 1) {
      this.isSmartcardEnabled = true;
      this.isAreaCodeEnabled = false
      console.log('Smartcard enabled');
    }

    if (selectedValue == 2) {
      this.isAreaCodeEnabled = true;
      this.isSmartcardEnabled = false
      console.log('Area code enabled');
    }
    if (selectedValue !== 2 && selectedValue !== 3) {
      console.log('Both disabled');
    }
  }

  onForceChange(event: any) {
    console.log(this.force);
    this.isRepeatforDisabled = !this.force;
    this.isDurationDisabled = !this.force;
    this.isTransparancyDisabled = !this.force;
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
