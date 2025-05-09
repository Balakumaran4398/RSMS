import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { localeData } from 'moment';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-inventorycortonbox',
  templateUrl: './inventorycortonbox.component.html',
  styleUrls: ['./inventorycortonbox.component.scss']
})
export class InventorycortonboxComponent implements OnInit {
  selectedFile: File | null = null;
  type: any;
  smartcardList: any[] = [];
  selectedType: string = '1'
  selectOperator: any;
  selectSubscriber: any;
  selectArea: any;
  selectedPackage: any;
  days: any;
  selectStreet: any;
  isemi: boolean = false;
  date: Date = new Date();
  cur_date: string = this.formatDate(new Date());
  dueamount: any;

  role: any;
  username: any;

  model: any;
  modelName: any;

  isEmiValue: boolean = false;
  isActivated: boolean = false;
  filteredOperatorList: any[] = [];

  filteredAreaList: any[] = [];
  filteredStreetList: any[] = [];
  filteredPackageList: any[] = [];

  isplantype = false;
  datetype = false;
  isDisabled = false;
  dateTodate = 3;
  packagePlan: any;
  rechargeType: any;
  plantypeSubject = new BehaviorSubject<{ [key: string]: number }>({});
  plantype$ = new BehaviorSubject<{ key: string, value: number }[]>([]);
  selectedRechargetype: any = 0;
  plantype: any;
  isRecharge: boolean = true;
  noofdays: any;
  f_date: any;
  rechargetype: any;
  subdetailsList: any;
  constructor(public dialogRef: MatDialogRef<InventorycortonboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private userservice: BaseService, private cdr: ChangeDetectorRef, private excelService: ExcelService, private storageService: StorageService, private swal: SwalService) {
    this.type = data.type;
    console.log(this.type);
    console.log(data);

    this.smartcardList = data.smartcard;
    // this.isemi = data.isemi[0];
    // this.isemi = data.isemi;
    console.log(this.isemi);

    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {
    this.operatorlist();
    this.onPackageList('');
    this.getEmi();
    if (this.role == 'ROLE_OPERATOR')
      this.operatorIdoperatorId();
    this.getPackagePlanList();
    this.getPlanList();
  }
  lcoDeatails: any;
  operatorid: any;
  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorid = this.lcoDeatails?.operatorid;
      this.onAreaList(this.operatorid)
    })
  }
  getEmi() {
    this.userservice.getEmiDetails(this.role, this.username).subscribe((res: any) => {
      this.isEmiValue = res.isemi;
    })
  }

  getNextDay(dateString: string): string | null {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  getNextDay1(): string | null {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
  toggleEmi(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isemi = target.checked;
  }
  operatorlist() {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.filteredOperatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
    })
  }
  onAreaList(type: any) {
    console.log(type);
    if (this.selectOperator || this.operatorid) {
      this.userservice.getAreaListByOperatorid(this.role, this.username, this.selectOperator || this.operatorid)
        .subscribe((data: any) => {
          console.log(data);
          console.log(data?.streetid);
          this.filteredAreaList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.filteredAreaList);
        });
    }
  }
  onStreetList(type: any) {
    if (this.selectOperator || this.operatorid) {
      this.userservice.getStreetListByAreaid(this.role, this.username, this.selectArea)
        .subscribe((data: any) => {
          console.log(data);
          console.log(data?.streetid);
          this.filteredStreetList = Object.keys(data).map(key => {
            const name = key.replace(/\(\d+\)$/, '').trim();
            const value = data[key];
            return { name, value };
          });
          console.log(this.filteredStreetList);
        });
    }
  }
  onStreetName(typename: any) {
    console.log(typename);
    this.selectStreet = typename
  }
  onPackageList(type: any) {
    console.log(type);
    this.userservice.getBulkPackageUpdationList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.filteredPackageList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      console.log(this.filteredPackageList);
    });
  }

  getPlanList() {
    this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rechargetype = Object.keys(data).map(key => {
        const id = data[key];
        const name = key.replace(/\(\d+\)$/, '').trim();
        return { name: name, id: id };
      });
      console.log(this.rechargeType);

      this.cdr.detectChanges();
    })
  }

  getPackagePlanList() {
    this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      this.packagePlan = data;
      const sortedData = Object.entries(data)
        .map(([key, value]) => ({
          key: key.replace(/\(\d+\)/, '').trim(),
          value: value as number
        }))

      this.plantype$.next(sortedData);
      if (this.selectedRechargetype === 1) {
        const defaultPlan = sortedData.find(plan => plan.key === '1month');
        if (defaultPlan) {
          this.plantype = defaultPlan.value;
          console.log(this.plantype);

        }
      }
    });
  }
  ngAfterViewInit() {
    $('#operator').select2({
      placeholder: 'Select LCO',
      allowClear: true
    });
    $('#operator').on('change', (event: any) => {
      this.selectOperator = event.target.value;
      this.onAreaList(this.selectOperator);
    });
    $('#area').select2({
      placeholder: 'Select Area',
      allowClear: true
    });
    $('#area').on('change', (event: any) => {
      this.selectArea = event.target.value;
      this.onStreetList(this.selectArea);
    });
    $('#street').select2({
      placeholder: 'Select Street',
      allowClear: true
    });
    $('#street').on('change', (event: any) => {
      this.selectStreet = event.target.value;
      console.log(this.selectStreet);
      this.onStreetName(this.selectStreet);
    });

    $('#package').select2({
      placeholder: 'Select Package',
      allowClear: true
    });
    $('#package').on('change', (event: any) => {
      this.selectedPackage = event.target.value;
      console.log(this.selectedPackage);
      this.onPackageList(this.selectedPackage);
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  generateExcel(type: string) {
    this.excelService.generatealacarteactivationExcel(type);
  }
  submit() {
    console.log(this.selectedFile);
    if (this.selectedFile) {
      console.log(this.selectedFile);
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while your file is being uploaded.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
      });
      const formData = new FormData();
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('file', this.selectedFile);
      this.swal.Loading();
      this.userservice.cortonBoxUplod(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
          this.swal.Close();
        }, (err) => {
          this.swal.Close();
          this.swal.Error3(err?.error?.message || err?.error || err);
        });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No file selected. Please choose a file to upload.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  // setallocation() {
  //   this.swal.Loading();
  //   this.userservice.cortonBoxDetails(this.role, this.username, this.selectOperator || 0, this.isemi, this.dueamount || 0, this.selectedType, this.selectArea || 0, this.selectStreet || 0,
  //     this.selectedPackage || 0, this.days || 0, this.selectSubscriber || 0, this.smartcardList)
  //     .subscribe((res: any) => {
  //       this.swal.success(res?.message);
  //     }, (err) => {
  //       console.log(err);
  //       this.swal.Error(err?.error?.message || err?.error || '');
  //     });
  // }
  setallocation() {
    this.swal.Loading();
    this.userservice.getLCOportalcortonBoxDetails(this.role, this.username, this.selectOperator || 0, this.isemi, this.dueamount || 0, this.selectedType, this.selectArea || 0, this.selectStreet || 0,
      this.selectedPackage || 0, this.days || 0, this.selectSubscriber || 0, this.smartcardList, this.selectedRechargetype || 5, this.plantype || this.f_date || null)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        console.log(err);
        this.swal.Error(err?.error?.message || err?.error || '');
      });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  logValues(): void {
    const formattedDate = this.date ? this.formatDate(this.date) : 'No date selected';
    console.log('Selected Date:', formattedDate);

    this.cur_date = formattedDate;
    console.log(this.cur_date);

  }
  upload() {
    console.log(this.date);
    this.swal.Loading();
    this.userservice.getInventoryUpdateDate(this.role, this.username, this.cur_date)
      .subscribe((res: any) => {
        this.swal.success(res?.message);

      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }


  onSelectionrechargetype(selectedValue: string) {
    const rechargetype = Number(selectedValue);
    if (rechargetype == 1) {
      this.isplantype = true;
      this.datetype = false;
      const defaultPlan = this.plantype$.getValue().find(plan => plan.key === '1month');
      if (defaultPlan) {
        this.plantype = defaultPlan.value;
      }
      this.isDisabled = false;
    }
    if (rechargetype == 2) {
      this.isplantype = false;
      this.datetype = true;
      this.plantype = 0;
      this.isDisabled = true;
    }
    if (rechargetype == 3) {
      this.dateTodate;
      this.isplantype = false;
      this.datetype = false;
      this.plantype = 0;
      this.f_date = null;
      this.isDisabled = false;
    }
    this.isRecharge = true;
  }

  onSelectionplantype(selectedValue: number) {
    console.log('selectrdvalue', selectedValue);
    if (selectedValue) {
      this.isplantype = true;
    }
    if ((this.selectedRechargetype == '3') || (this.selectedRechargetype != '3' && this.plantype != 0) || (this.f_date)) {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
    console.log(selectedValue);
  }

  onSelectiondatetype(selectedValue: string) {
    const rechargetype = Number(selectedValue);
    console.log('selectrdvalue', selectedValue);
    if (rechargetype == 1) {
      this.isplantype = true;
      this.datetype = false;
    }
    if (rechargetype == 2) {
      this.isplantype = false;
      this.datetype = true;
    }
    if (rechargetype == 3) {
      this.datetype = false;
      this.isplantype = false;
    }

    if ((this.selectedRechargetype == '3') || (this.selectedRechargetype != '3' && this.plantype != 0) || (this.f_date)) {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
  }
}
