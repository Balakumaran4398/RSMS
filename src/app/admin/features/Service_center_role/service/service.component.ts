import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { data } from 'jquery';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
declare var $: any;
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  role: any;
  username: any;
  selectedEntry: any = '';
  selectSmartcard: any;
  selectedOperator: any = 0;
  searchSmartcard: any = '';
  isActive: boolean = false;
  today = new Date();
  smartcardList: any[] = [];
  showDropdown: boolean = true;
  selectedType = false;
  nosmartcard = false;
  isReplace = true;

  tableSmartcard: any;
  fromdate: any;
  todate: any;

  update: boolean = true;
  close: boolean = false;
  dispatch: boolean = false;

  boxid: any;
  smartcard: any;
  tokenNo: any;
  entry: any;
  entryDate: any;
  closing: any;
  closingDate: any;
  attender: any;
  delivery: any;
  dispatcher: any;
  deliveryDate: any;
  Amount: any;


  smartcardDetails: any;
  noSmartcardDetails: any;

  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 300,
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
  rowData: any[] = [];

  subscriberDetails = [
    { label: 'OPERATOR', value: '' },
    { label: 'MOBILE NO', value: '' },
    { label: 'SUBSCRIBER', value: '' },
    { label: 'AREA NAME', value: '' },
    { label: 'STREET NAME', value: '' }
  ];
  filteredProblemList: any[] = [];
  filteredAttenderList: any[] = [];
  filteredOperatorList: any[] = [];
  // filteredSmartcardList: any[] = [];
  filteredSmartcardList = [
    { smartcard: "11055000000000489D36" },
    { smartcard: "11055000000000489D37" },
    { smartcard: "11055000000000489D38" }
  ];
  constructor(private userservice: BaseService, private storageservice: StorageService, private changeDetectorRef: ChangeDetectorRef) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event?: Event) {
    this.showDropdown = false;
  }
  handleBlur(event: FocusEvent) {
    if (!event.relatedTarget || !(event.relatedTarget as HTMLElement).classList.contains('dropdown-item')) {
      this.showDropdown = false;
    }
  }


  ngOnInit(): void {
    this.initializeSelect2();
    this.onProblemList();
    this.onAttenderList();
    this.onOperatorList();
    this.onNosmartcardList();
  }

  ngOnDestroy(): void {
    this.destroySelect2();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges(); // Ensure Angular updates UI before reinitializing Select2
  }

  initializeSelect2(): void {
    setTimeout(() => {
      this.destroySelect2(); // Prevent duplicate instances
      this.applySelect2('#entry', 'Select Issue');
      this.applySelect2('#smartcard', 'Select Smartcard');
      this.applySelect2('#operator', 'ALL Operator');
      this.applySelect2('#attender', 'Select Attender');
      this.applySelect2('#dispatcher', 'Select Dispatcher');
    }, 300);
  }

  destroySelect2(): void {
    ['#entry', '#smartcard', '#operator', '#attender', '#dispatcher'].forEach(id => {
      if ($(id).data('select2')) {
        $(id).select2('destroy');
      }
    });
  }

  applySelect2(selector: string, placeholder: string): void {
    if ($(selector).length) {
      $(selector).select2({ placeholder, allowClear: true });
    }
  }

  onTabChange(): void {
    setTimeout(() => this.initializeSelect2(), 200); // Reapply Select2 after DOM update
  }

  onOperatorChange(event: any) {
    this.selectedOperator = event.target.value;
    console.log('Selected Operator:', this.selectedOperator);
  }
  onSmartcardChange() {
    if (!this.isActive) {
      this.tableSmartcard = null;
    }
    console.log('Smartcard Value:', this.isActive ? this.tableSmartcard : null);
  }
  onServiceHistory() {
    console.log(this.selectedOperator);
    this.userservice.getServiceHistoryDetails(this.username, this.role, this.selectedOperator, this.tableSmartcard || null, this.fromdate || null, this.todate || null).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
  }
  onReplaceData(value: boolean) {
    console.log('Replace Data:', value);
    const smartcardValue = value ? true : null;
    this.userservice.getReplaceSmartcardList(this.role, this.username, smartcardValue).subscribe(
      (data) => {
        console.log('API Response:', data);
        this.filteredSmartcardList = data;
        console.log(this.filteredSmartcardList);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
  onProblemList() {
    this.userservice.getStbProblemList(this.username, this.role).subscribe((data: any) => {
      console.log(data);
      this.filteredProblemList = data;
    })
  }
  onAttenderList() {
    this.userservice.getHardwardEmployeeList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.filteredAttenderList = data;
    })
  }
  onSmartcardSerachName(searchName: any) {
    console.log('value', searchName);
    this.userservice.getSmartcardSearch(this.username, this.role, searchName).subscribe((data: any) => {
      console.log(data);
      this.smartcardList = data;
      this.showDropdown = true;
    })
    this.showDropdown = false;
  }
  onOperatorList() {
    this.userservice.getOeratorList(this.role, this.username, 1).subscribe((data: any) => {
      console.log(data);
      this.filteredOperatorList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
    })
  }

  onNosmartcardList() {
    this.userservice.getNoSmartcardDetails(this.role, this.username, !this.nosmartcard).subscribe((data: any) => {
      this.noSmartcardDetails = data;
      this.smartcard = this.noSmartcardDetails.smartcard;
      this.boxid = this.noSmartcardDetails.boxid;
      this.tokenNo = this.noSmartcardDetails.tokenNo;
    })
  }

  goToSmartcard(event: any) {
    console.log(event);
    this.searchSmartcard = event.smartcard;
    console.log(this.searchSmartcard);
    this.userservice.getSmartcardDetails(this.username, this.role, this.searchSmartcard).subscribe((data: any) => {
      console.log(data);
      this.smartcardDetails = data;
      this.showDropdown = false;

      this.subscriberDetails = [
        { label: 'OPERATOR', value: this.smartcardDetails?.operatorname || 'N/A' },
        { label: 'MOBILE NO', value: this.smartcardDetails?.mobileno || 'N/A' },
        { label: 'SUBSCRIBER', value: this.smartcardDetails?.customername || 'N/A' },
        { label: 'AREA NAME', value: this.smartcardDetails?.area || 'N/A' },
        { label: 'STREET NAME', value: this.smartcardDetails?.street || 'N/A' }
      ];
    })
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 100, },
    { headerName: "MODEL", field: 'smartcard', width: 150 },
    { headerName: "TOKEN NUMBER", field: 'lcoid', width: 150 },
    { headerName: "OPERATOR NAME", field: 'addingpackageid', width: 150 },
    { headerName: "CONTACT", field: 'addingpackageid', width: 150 },
    { headerName: "CUSTOMER NAME", field: 'addingpackageid', width: 150 },
    { headerName: "SMARTCARD", field: 'addingpackageid', width: 150 },
    { headerName: "BOX ID", field: 'addingpackageid', width: 150 },
    { headerName: "STATUS", field: 'addingpackageid', width: 150 },
    { headerName: "REPLACE SMARTCARD", field: 'addingpackageid', width: 150 },
    { headerName: "ENTRY", field: 'addingpackageid', width: 150 },
    { headerName: "ENTRY DATE", field: 'addingpackageid', width: 150 },
    { headerName: "ATTENDER", field: 'addingpackageid', width: 150 },
    { headerName: "AMOUNT", field: 'addingpackageid', width: 150 },
    { headerName: "DELIVERY", field: 'addingpackageid', width: 150 },
    { headerName: "DELIVERY DATE", field: 'addingpackageid', width: 150 },
  ]

  getFromDate(event: any) {
    console.log(event.value);
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.fromdate = year + "-" + month + "-" + date
    console.log(this.fromdate);
  }
  getToDate(event: any) {
    const date = new Date(event.value).getDate().toString().padStart(2, '0');
    const month = (new Date(event.value).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(event.value).getFullYear();
    this.todate = year + "-" + month + "-" + date
    console.log(this.todate);
  }

  update_submit() { }
  dispactchSubmit() { }
  close_Submit() { }
  getServiceReportDownload(type: any) { }
}
