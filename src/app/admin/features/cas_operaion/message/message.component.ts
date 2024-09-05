import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
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
  constructor(private userservice: BaseService, private storageService: StorageService, private fb: FormBuilder) {
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
      intendid: [0, Validators.required],
      serviceid: ['', Validators.required],
      fontsize: ['', Validators.required],
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
    { headerName: "ACTION", field: '' },
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
    // if (this.form.valid) {
      this.userservice.CreateMessage(this.form.value).subscribe(
        (res: any) => {
          console.log(res);
          Swal.fire({
            title: 'Success!',
            text: res?.message || 'Message created successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
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

    // if (casId == 1) {
    //   this.isTransparencyDisabled = true;
    //   this.isTransparency_select_Disabled = false;
    // } else {
    //   this.isTransparencyDisabled = false;
    //   this.isTransparency_select_Disabled = true;
    // }

    // if (casId == 1) {
    //   this.isrepeatfordisabled = true;
    //   console.log(this.isrepeatfordisabled);

    // } else {
    //   this.isrepeatfordisabled = false;
    //   console.log(this.isrepeatfordisabled);
    // }


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

}
