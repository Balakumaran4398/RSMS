import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { CasDialogueComponent } from '../../channel_setting/_Dialogue/cas-dialogue/cas-dialogue.component';

@Component({
  selector: 'app-forcemessage',
  templateUrl: './forcemessage.component.html',
  styleUrls: ['./forcemessage.component.scss']
})
export class ForcemessageComponent {
  submitted: boolean = false;
  form!: FormGroup;
  form1!: FormGroup;
  hide = true;
  castype: any = '';
  intendto: any = 'lco';
  casname: any = '';
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
  lco_name: any[] = [];


  transparancy: any = [
    { lable: "Enable", value: "true" },
    { lable: "Disable", value: "false" }
  ];
  force: boolean = true;
  forceEnabled: any;
  forceDisabled: any;
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

  isservicedisabled: boolean = false;
  isFontSizeDisabled: boolean = false;
  isFontcolorDisabled: boolean = false;
  isCasfontColor: boolean = false;
  isBGcolorDisabled: boolean = false;
  isCasBGcolorDisabled: boolean = false;
  isRepeatforDisabled: boolean = false;
  isRepeatfor: boolean = false;
  isFource: boolean = true;
  isTransparancyDisabled: boolean = false;
  isDurationDisabled: boolean = false;
  isDuration: boolean = false;
  isTimeGap: boolean = false;
  isTimeGapDisabled: boolean = false;
  isMessage: boolean = false;
  isMessagnormal: boolean = true;
  isMessagecas: boolean = false;
  isInvalidLength: boolean = false;
  remainingChars: number = 0;
  casId: any;
  area: any[] = [];
  lco_list: any[] = [];
  username: any;
  role: any;
  forcemsge: boolean = false;
  forceid: any;

  lcoDeatails: any;
  operatorid: any;
  constructor(private userservice: BaseService, private cdr: ChangeDetectorRef, private storageService: StorageService, private fb: FormBuilder, private swal: SwalService, public dialog: MatDialog) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userservice.GetMessageList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      console.log(this.rowData);
    })
    console.log(this.castype);
    this.setInitialRemainingChars();
  }
  onSelection(selectedValue: { name: any, id: any }): void {
    console.log(selectedValue);
    this.casId = Number(selectedValue);
    this.castype = selectedValue.id;
    this.casname = selectedValue.name;
    console.log(this.castype);
    this.form.patchValue({ castype: this.castype });
    this.form.patchValue({ intendid: this.operatorid });
  }



  ngOnInit() {
    this.onOperatorList();
    this.onCaslist();
    this.operatorIdoperatorId();
    this.form = this.fb.group({
      castype: [this.castype, Validators.required],
      forcemsg: [false, Validators.required],
      deletemsg: [false, Validators.required],
      intendto: [3, [Validators.required]],
      intendid: [this.operatorid, Validators.required],
      serviceid: [0, Validators.required],
      fontsize: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
      position: [0, Validators.required],
      fontcolor: [0, Validators.required],
      bgcolor: [0, Validators.required],
      repeatfor: [0, Validators.required],
      transparency: ['', Validators.required],
      duration: [0, Validators.required],
      timegap: [0, Validators.required],
      msgcontent: [0, Validators.required],
      role: this.role,
      username: this.username,
    })
    this.onForceChange('')

  }
  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.operatorid = this.lcoDeatails?.operatorid;
      console.log(this.operatorid);
      this.getForcemsg(this.operatorid)
    })
  }
  getForcemsg(operator: any) {
    console.log('force message');
    this.userservice.getcheckLcoForceMessage(this.role, this.username, operator).subscribe((res: any) => {
      console.log(res);
      this.forcemsge = res.forcemsg;
      this.forceid = res.id;
      console.log(this.forcemsge);

    })
  }
  onOperatorList() {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.area = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, id: value };
      });
    })
  }
  onCaslist() {
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

  onSubmit() {
    this.submitted = true;
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
    console.log(event);
    console.log(this.force_1);

    if (this.force_1 === false) {
      this.cdr.detectChanges();
      // this.isRepeatfor = [1, 3, 7].includes(this.castype);
      this.isDurationDisabled = true;
      this.isRepeatfor = true;
      this.isTimeGap = true;
      // this.isTimeGap = [1, 3, 7].includes(this.castype);
    } else {
      this.isRepeatfor = false;
      this.isDurationDisabled = false;
      this.isTimeGap = false;
    }


    this.force_1 = event.value;
    this.isRepeatforDisabled = !this.force_1;
  }



  showDropdown: boolean = true;
  subscriberList: any[] = [];
  subscriber: any;

  goToSubscriberDashboard(lcomember: any) {
    this.intendid_1 = lcomember.value;
    this.showDropdown = false;
  }
  onTuningSubmit() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to proceed with tuning?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.swal.Loading();
        console.log('tuning submit');

        this.form1 = this.fb.group({
          intendto: [3, Validators.required],
          intendid: [this.operatorid, Validators.required],
          tuningstatus: [true, Validators.required],
          role: this.role,
          username: this.username
        });

        console.log('Form1 instance:', this.form1);
        console.log('Form1 value:', this.form1.value);

        this.userservice.CreateForce(this.form1.value).subscribe(
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
              this.ngOnInit(); // Reload the form
            });
          },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: error?.error?.intendid || error?.error?.message || 'There was an issue submitting the form.',
              icon: 'error',
              confirmButtonText: 'OK',
              timer: 2000,
              timerProgressBar: true,
            });
          }
        );
      } else {
        console.log('User clicked No, API not called.');
      }
    });
  }
  onDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.swal.Loading();
        this.userservice.stopMessage(this.role, this.username, this.forceid).subscribe(
          (res: any) => {
            this.swal.success(res?.message);
          },
          (err) => {
            this.swal.Error(err?.error?.message);
          }
        );
      } else {
        console.log('User clicked No, deletion cancelled.');
      }
    });
  }


}
