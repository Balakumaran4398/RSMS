import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { CasDialogueComponent } from '../../channel_setting/_Dialogue/cas-dialogue/cas-dialogue.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent {
  form!: FormGroup;
  IntendFormControl: any;
  username: any;
  role: any;
  isIntendto: boolean = true;
  isSmartcardEnabled: boolean = false;
  isAreaCodeEnabled: boolean = false;
  isMSOCodeEnabled: boolean = false;
  isDateDisabled: boolean = false;
  isInvalidLength: boolean = false;;
  isTitle: boolean = false;
  isdisplayTypeSelectDisabled: boolean = false;
  casId: any;
  CasFormControl: any;
  selectedIntendFormControl: any;
  selectedAreaCodeFormControl = new FormControl('');

  intendIdFormControl: any;
  intendIdLcoFormControl: any;
  area: any[] = [];
  cas: any[] = [];
  service: any[] = [];
  lco_list: any[] = [];
  remainingChars: number = 0;
  remainingTitleChars: number = 0;
  searchTerm: string = '';
  searchAreaTerm: string = '';
  searchSearchTerm: string = '';
  filteredCasList: { name: string; id: number }[] = [];
  filteredServiceList: { name: string; id: number }[] = [];
  filteredAreaList: { name: string; id: number }[] = [];
  intend: any = [
    { lable: "MSO", value: 1 },
    { lable: "Smartcard", value: 2 },
    { lable: "LCO", value: 3 },
  ];
  displayType: any[] = [
    // { lable: "Select Display ", value: null },
    { lable: "User deletable", value: 0 },
    { lable: "One time viewable", value: 1 },
    { lable: "Persistent", value: 2 },
    { lable: "Alert", value: 3 },
  ];
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
  rowData = [];


  castype_1: any;
  casname: any;
  intendto_1: any = '';
  intendid_1: any;
  intendname: any;
  display_type_1: any = '';
  sender_1: any;
  mailtitle_1: any;
  expirydate_1: any;
  isresend_1: any;
  message_1: any;
  d_type: any = 0;

  submitted: boolean = false;
  constructor(private userservice: BaseService, private storageService: StorageService, private fb: FormBuilder, public dialog: MatDialog, private cdr: ChangeDetectorRef,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userservice.GetMail_List(this.role, this.username).subscribe((data: any) => {
      this.rowData = data;
      console.log(this.rowData);
    })
    // userservice.getsmartcardallocationSubscriberList(this.role, this.username).subscribe((data: any) => {
    //   console.log(data);
    //   // this.lco_list = data[0].operatorid;
    //   this.lco_list = Object.entries(data[0].operatorid).map(([key, value]) => ({ name: key, id: value }));
    //   console.log(this.lco_list);

    //   console.log(this.lco_list);
    // })
    this.remainingChars = this.getMaxLength();
  }
  getMaxLength(): number {
    switch (this.castype_1) {
      case 1:
        return 130;
      case 2:
        return 1023;
      case 6:
        return 255;
      case 2023:
        return 2023;
      default:
        return 1024;
    }
  }
  getMaxLengthTitle(): number {
    switch (this.castype_1) {
      case 1:
        return 50;
      case 2:
        return 15;
      case 6:
        return 255;
      case 63:
        return 2023;
      default:
        return 15;
    }
  }

  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "INTEND ID", field: 'intendid' },
    { headerName: "INTEND TO", field: 'intendto' },
    { headerName: "TITLE", field: 'mailtitle' },
    { headerName: "SENDER	", field: 'sender' },
    { headerName: "MESSAGE", field: 'message' },
    { headerName: "EXPIRY DATE	", field: 'expirydate' },
    {
      headerName: "ACTION",
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        const MailButton = document.createElement('button');
        MailButton.innerHTML = '<button style="width: 5em;background-color: #2d5c73;color:white;border-radius: 5px;height: 2em;color:white"><p style="margin-top:-6px">Resend</p></button>';
        MailButton.style.backgroundColor = 'transparent';
        MailButton.style.border = 'none';
        MailButton.title = 'Mail';
        MailButton.style.cursor = 'pointer';
        MailButton.style.marginLeft = '20px';
        MailButton.addEventListener('click', () => {
          this.openDialog(params.data, 'mail');
        });
        div.appendChild(MailButton);
        return div;
      }
    }


  ];

  ngOnInit() {

    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.area = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, id: value };
      });
      this.filteredAreaList = this.area;
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

    // this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
    //   console.log(data);

    //   // this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
    //   // this.filteredCasList = this.cas;
    //   this.service = Object.entries(data[0].servicelist).map(([key, value]) => ({ name: key, id: value }));
    //   this.filteredServiceList = this.service;
    // })
    this.form = this.fb.group({
      castype: ['', Validators.required],
      intendto: ['', Validators.required],
      intendid: ['', Validators.required],
      display_type: ['0', Validators.required],
      sender: ['', Validators.required],
      mailtitle: ['', Validators.required],
      expirydate: [0, Validators.required],
      isresend: [false, Validators.required],
      message: ['', Validators.required],
      d_type: 0,
      role: this.role,
      username: this.username,
    })

  }
  customValidationErrors: any = {
    castype: false,
    intendto: false,
    intendid: false,
    sender: false,
    mailtitle: false,
    message: false,
    expirydate: false,
    isresend: false,
    display_type: false,
    d_type: false,
  };
  validateForm(): boolean {
    this.customValidationErrors = {
      castype: !this.castype_1 || this.castype_1.trim() === '',
      intendto: !this.intendto_1 || this.intendto_1.trim() === '',
      intendid: !this.intendid_1 || this.intendid_1.trim() === '',
      sender: !this.sender_1 || this.sender_1.trim().length < 3,
      mailtitle: this.isTitle && (!this.mailtitle_1 || this.mailtitle_1.trim() === ''),
      message: !this.message_1 || this.message_1.trim() === '',
      display_type: this.display_type_1 || null,
      expirydate: this.expirydate_1 || null,
      isresend: this.isresend_1 || null,
      d_type: 0,
    };

    return Object.values(this.customValidationErrors).every((isValid) => !isValid);
  }
  validateExactLength(): void {
    const requiredLength = this.castype_1 !== 6 ? 20 : 14;
    this.isInvalidLength = this.intendid_1.length > 0 && this.intendid_1.length !== requiredLength;
    const control = this.form.get('intendid');
    if (control) {
      control.setErrors(this.isInvalidLength ? { incorrectLength: true } : null);
    }
  }
  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filteredCasList = this.filteredcas();
    console.log(this.filteredCasList);

  }
  filteredcas(): { name: string; id: number }[] {
    if (!this.searchTerm) {
      return this.cas;
    }
    return this.cas.filter(casItem =>
      casItem.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onChangeIntendTo1(selectedValue: any) {
    this.intendid_1 = '';
    this.isSmartcardEnabled = false;
    this.isAreaCodeEnabled = false;
    console.log('enabled  =' + selectedValue);
    if (selectedValue == 1) {
      this.isSmartcardEnabled = false;
      this.isAreaCodeEnabled = false
      this.isMSOCodeEnabled = false
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
  onSelectionFingerPrint(selectedValue: { name: any, id: any }) {
    // this.casId = Number(selectedValue);
    console.log(this.casId);
    console.log(this.castype_1 = selectedValue.id);
    console.log(this.casname = selectedValue.name);
    this.cdr.detectChanges();
    this.castype_1 = selectedValue.id;
    this.casname = selectedValue.name;
    console.log(this.castype_1);

    if (this.castype_1 == 6 || this.castype_1 == 4 || this.castype_1 == 1) {
      this.isDateDisabled = false;

    } else {
      this.isDateDisabled = true;
    }
    if (this.castype_1 == 4) {
      this.isTitle = false;
    } else {
      this.isTitle = true;
    }
    if (this.castype_1 == 6) {
      this.isdisplayTypeSelectDisabled = true;
    } else {
      this.isdisplayTypeSelectDisabled = false;
    }
    if (this.castype_1 == 1) {

    } else {

    }
  }
  updateRemainingChars(event: Event): void {
    this.cdr.detectChanges();
    const input = event.target as HTMLTextAreaElement;
    this.remainingChars = this.getMaxLength() - input.value.length;
  }
  updateRemainingCharsTitle(event: Event): void {
    this.cdr.detectChanges();
    const input = event.target as HTMLTextAreaElement;
    this.remainingTitleChars = this.getMaxLengthTitle() - input.value.length;
  }

  filteredIntendArea(): any[] {
    if (!this.searchTerm) {
      return this.area;
    }
    return this.area.filter((area: any) =>
      area.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onSearchAreaChange(event: any) {
    this.searchAreaTerm = event.target.value;
    this.filteredAreaList = this.filteredArea();
    // this.filteredAreaList = this.filteredIntendArea();
  }

  filteredService(): { name: string; id: number }[] {
    if (!this.searchSearchTerm) {
      return this.service;
    }
    return this.service.filter((service: any) =>
      service.name.toLowerCase().includes(this.searchSearchTerm.toLowerCase())
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
  onAreaSelect(area: { name: string; id: number }) {
    this.intendid_1 = area.id;
    this.intendname = area.name;
    console.log(this.intendid_1);
    console.log(this.intendname);
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;

    // Allow digits only
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onSubmit() {
    if (this.form.valid) {
    } else {
      this.form.markAllAsTouched();
    }
    let requestBody = {
      castype: this.castype_1,
      intendto: this.intendto_1 || 1,
      intendid: this.intendid_1 || 1,
      display_type: this.display_type_1 || 0,
      sender: this.sender_1,
      mailtitle: this.mailtitle_1,
      expirydate: this.expirydate_1,
      isresend: this.isresend_1 || false,
      message: this.message_1,
      d_type: 0,
      role: this.role,
      username: this.username,
    }
    Swal.fire({
      title: 'Updating...',
      text: 'Please wait while the Mail is being updated',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    this.userservice.CreateMail(requestBody).subscribe(
      (res: any) => {
        console.log(res);
        Swal.fire({
          title: 'Success!',
          text: res.message || 'Your mail has been created successfully.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          // this.ngOnInit();
          window.location.reload();
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: error?.error.castype || error?.error.intendto || error?.error.intendid || error?.error.mailtitle || error?.error.sender || error?.error.isresend ||
            error?.error.display_type || error?.error.message,
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        });
      }
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
}
