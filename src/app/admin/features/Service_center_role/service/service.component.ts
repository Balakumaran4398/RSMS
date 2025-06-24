import { ChangeDetectorRef, Component, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { data, error } from 'jquery';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { ServicecenterEditComponent } from '../Dialog/servicecenter-edit/servicecenter-edit.component';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit, OnDestroy {
  role: any;
  username: any;
  remarks: any;
  selectedEntry: any;
  selectedDispatcher: any;
  selectSmartcard: any;
  selectedAttender: any;
  attenderName: any;
  selectedOperator: any = 0;
  searchSmartcard: any = '';
  smartcardValue: any;

  isActive: boolean = false;
  today = new Date();
  smartcardList: any[] = [];
  showDropdown: boolean = true;
  selectedType = false;
  nosmartcard = false;
  isReplace = true;
  tabletoSmartcardData: any;
  tabletoSmartcardMsoid: any;
  tabletoNoSmartcardMsoid: any;
  tabletoSmartcard: any;
  smartcardId: any;
  tabletoSmartcardNumber: any;
  tableSmartcard: any;
  fromdate: any;
  todate: any;

  update: boolean = true;
  close: boolean = false;
  dispatch: boolean = false;

  selectEntryOthers: any;

  boxid: any;
  smartcard: any;
  boxid1: any;
  smartcard1: any;
  tokenNo: any;
  entry: any;
  entryname: any;
  entryDate: any;
  closing: any;
  closingDate: any;
  attender: any;
  delivery: any;
  dispatcher: any;
  deliveryDate: any;
  Amount: any;
  closeSmartcard: any;
  action: any;

  smartcardDetails: any;
  noSmartcardDetails: any;


  gridApi: any;
  isAnyRowSelected: any = false;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  selectedtstatus: any;
  hasSelectedRows: boolean = true;
  selectCount: any;
  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;

        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
          if (normalizedA < normalizedB) return -1;
          if (normalizedA > normalizedB) return 1;
          return 0;
        }
      },
    },
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
  };




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
  filteredSmartcardList: any[] = [];
  filteredSmartcardDetailsList: any[] = [];

  constructor(private userservice: BaseService, public dialog: MatDialog, private storageservice: StorageService, private cdr: ChangeDetectorRef,
    private changeDetectorRef: ChangeDetectorRef, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.isNormalOpen;
    this.initializeSelect2();
  }


  get isNormalOpen(): boolean {

    return this.tabletoSmartcardData === undefined;
    // return this.tabletoNoSmartcardMsoid === 0;
  }
  // get isNoSmartcardOpen(): boolean {
  //   return this.boxid === 'no boxid' || this.tabletoSmartcardMsoid === 0;
  //   // return this.tabletoNoSmartcardMsoid === 0;
  //   // return this.tabletoSmartcardMsoid === 0;
  // }
  get isNoSmartcardOpen(): boolean {
    if (this.boxid === 'no boxid') {
      return true;  // boxid takes priority
    }
    return this.tabletoSmartcardMsoid === 0;  // Only checked if boxid condition is not met
  }

  get isOpen(): boolean {
    // return this.tabletoSmartcardData === 'OPEN';
    return this.tabletoSmartcardMsoid === 1;
  }

  get isClose(): boolean {
    // return this.tabletoSmartcardData === 'CLOSE';
    return this.tabletoSmartcardMsoid === 2;
  }

  get isDispatch(): boolean {
    // return this.tabletoSmartcardData === 'DISPATCH';
    return this.tabletoSmartcardMsoid === 3;
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
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {

    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const currentDate = new Date(today);

    this.fromdate = this.formatDate(lastMonth);
    this.todate = this.formatDate(currentDate);



    this.initializeSelect2();
    this.onProblemList();
    this.onAttenderList();
    this.onOperatorList();
    this.onServiceHistory();
    this.onSmartcardList();
  }



  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initializeSelect2(): void {
    setTimeout(() => {
      this.applySelect2('#entry', 'Select Issue');
      this.applySelect2('#smartcard', 'Select Smartcard');
      this.applySelect2('#operator', 'Select Operator');
      this.applySelect2('#attender', 'Select Attender');
      this.applySelect2('#dispatcher', 'Select Dispatcher');
      this.applySelect2('#smartcard_no', 'Select Smartcard');
    }, 300);
  }


  ngOnDestroy(): void {
    ($('#entry') as any).select2('destroy');
    ($('#smartcard') as any).select2('destroy');
    ($('#operator') as any).select2('destroy');
    ($('#attender') as any).select2('destroy');
    ($('#dispatcher') as any).select2('destroy');
    ($('#smartcard_no') as any).select2('destroy');
  }



  applySelect2(selector: string, placeholder: string): void {
    if ($(selector).length) {
      $(selector).select2({ placeholder, allowClear: true });
    }
    $(selector).on('change', (e: any) => {
      const selectedValue = $(selector).val();
      this.selectissue(selectedValue, selector.substring(1));
    });
  }


  onTabChange(): void {
    setTimeout(() => this.initializeSelect2(), 200);
  }

  selectissue(event: any, type: string): void {
    switch (type) {
      case 'entry':
        this.selectedEntry = event;
        break;
      case 'smartcard':
        this.selectSmartcard = event;
        break;
      case 'operator':
        this.selectedOperator = event;
        break;
      case 'attender':
        this.selectedAttender = event;
        break;
      case 'dispatcher':
        this.selectedDispatcher = event;
        break;
      case 'smartcard_no':
        this.smartcard = event;
        break;
      default:
        console.warn('Unknown selector type:', type);
    }
  }


  onSmartcardChange() {
    if (!this.isActive) {
      this.tableSmartcard = null;
    }
    console.log('Smartcard Value:', this.isActive ? this.tableSmartcard : null);
  }
  onServiceHistory() {
    console.log(this.selectedOperator);
    this.userservice.getServiceHistoryDetails(this.role, this.username, this.selectedOperator, this.tableSmartcard || null, this.fromdate || null, this.todate || null).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      const rowCount = this.rowData.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
    this.rowData = [];
  }
  onReplaceData(value: boolean) {
    console.log('Replace Data:', value);
    console.log('Replace Data:', this.smartcardDetails?.smartcard);
    // this.smartcardValue = value ? true : null;
    this.userservice.getReplaceSmartcardList(this.role, this.username, this.smartcardDetails?.smartcard || null).subscribe(
      (data) => {
        console.log('API Response:', data);
        this.filteredSmartcardList = data;
        // this.filteredSmartcardList.push(data)
        console.log(this.filteredSmartcardList);
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
    this.selectSmartcard = '';
  }
  onProblemList() {
    this.userservice.getStbProblemList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.filteredProblemList = data;

    })
  }
  isOthersSelected(): boolean {
    const selectedEntryObj = this.filteredProblemList.find(item => item.id == this.selectedEntry);
    return selectedEntryObj?.name === 'OTHERS';
  }
  onAttenderList() {
    this.userservice.getHardwardEmployeeList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.filteredAttenderList = data;
    })
  }
  onSmartcardSerachName(searchName: any) {
    console.log('value', searchName);
    this.userservice.getSmartcardSearch(this.role, this.username, searchName).subscribe((data: any) => {
      console.log(data);
      this.smartcardList = data;
      this.showDropdown = true;
    })
    this.showDropdown = false;
  }
  onSmartcardList() {
    this.userservice.getSmartcardList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.filteredSmartcardDetailsList = data;
    })

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

  close_smart(e: any) {
    console.log(e)
    console.log(this.closeSmartcard)
  }

  onServiceLogDetails(event: any) {
    this.cdr.detectChanges();
    this.tabletoSmartcardData = event.status;
    this.tabletoSmartcardMsoid = event.msoid;
    this.tabletoSmartcard = event.id;
    this.tabletoSmartcardNumber = event.smartcard;
    this.userservice.getServiceLogDetails(this.username, this.role, this.tabletoSmartcard, 1).subscribe((data: any) => {
      console.log(data);
      this.smartcardDetails = data;
      this.smartcard = this.smartcardDetails?.smartcard;
      this.tabletoSmartcardMsoid = this.smartcardDetails.msoid;
      this.boxid = this.smartcardDetails?.boxid;
      this.tokenNo = this.smartcardDetails?.referencenumber;
      this.delivery = this.smartcardDetails?.dispatch;
      this.selectedDispatcher = this.smartcardDetails?.dispatcher;
      this.selectedEntry = this.smartcardDetails?.serviceid;
      this.entryDate = this.smartcardDetails?.logdate;
      this.entryname = this.smartcardDetails?.entryname;
      this.selectedAttender = this.smartcardDetails?.attendername;
      this.attenderName = this.smartcardDetails?.castype;
      this.Amount = this.smartcardDetails?.xml;
      this.closingDate = this.smartcardDetails?.expirydate;
      this.closing = this.smartcardDetails?.remarks;
      this.deliveryDate = this.smartcardDetails?.dispatchdate;
      this.action = this.smartcardDetails?.action;
      this.subscriberDetails = [
        { label: 'OPERATOR', value: this.smartcardDetails?.operatorname || 'N/A' },
        { label: 'MOBILE NO', value: this.smartcardDetails?.mobileno || 'N/A' },
        { label: 'SUBSCRIBER', value: this.smartcardDetails?.customername || 'N/A' },
        { label: 'AREA NAME', value: this.smartcardDetails?.area || 'N/A' },
        { label: 'STREET NAME', value: this.smartcardDetails?.street || 'N/A' }
      ];
      this.cdr.detectChanges();
    })
    this.initializeSelect2();

  }
  onNosmartcardList() {
    console.log(this.nosmartcard)

    this.userservice.getNoSmartcardDetails(this.role, this.username, !this.nosmartcard).subscribe((data: any) => {
      this.noSmartcardDetails = data;
      console.log(this.noSmartcardDetails);


      if (this.nosmartcard) {
        console.log('11111111111111');

        this.isNoSmartcardOpen;
        this.smartcard = this.noSmartcardDetails.smartcard;
        this.boxid = this.noSmartcardDetails.boxid;
        this.tokenNo = this.noSmartcardDetails.referencenumber;
        this.entryname = this.noSmartcardDetails.entryname;
        this.action = this.noSmartcardDetails?.action;
        this.tabletoNoSmartcardMsoid = this.noSmartcardDetails.msoid;
        console.log(this.tabletoSmartcardData);
        console.log(this.tabletoNoSmartcardMsoid);
      } else if (!this.nosmartcard) {
        console.log('22222222222222222');
        this.entryname = this.noSmartcardDetails.entryname;
        this.smartcard = this.smartcardDetails.smartcard;
        this.boxid = this.smartcardDetails.boxid;
        this.entryname = this.smartcardDetails.entryname;
        this.tokenNo = this.smartcardDetails.referencenumber;
        this.action = this.smartcardDetails?.action;
        this.tabletoSmartcardMsoid = this.smartcardDetails.msoid;
        console.log(this.tabletoSmartcardMsoid);
      }
      this.initializeSelect2();
    })
  }

  goToSmartcard(event: any) {
    console.log(event);
    this.tabletoSmartcardData = event.status;
    this.tabletoSmartcardMsoid = event.msoid;
    this.tabletoSmartcard = event.smartcard;

    this.searchSmartcard = event.smartcard;
    console.log(this.searchSmartcard);
    this.cdr.detectChanges();
    this.userservice.getSmartcardDetails(this.role, this.username, this.searchSmartcard).subscribe((data: any) => {
      console.log(data);
      this.smartcardDetails = data;
      this.showDropdown = false;
      this.smartcard = this.smartcardDetails.smartcard;
      this.smartcardId = this.smartcardDetails.id;
      console.log(this.smartcardId);

      this.boxid = this.smartcardDetails.boxid;
      this.tokenNo = this.smartcardDetails.referencenumber;
      this.delivery = this.smartcardDetails.dispatch;
      this.entryname = this.smartcardDetails.entryname;
      this.entryDate = this.smartcardDetails.logdate;
      this.closingDate = this.smartcardDetails.expirydate;
      this.selectedEntry = this.smartcardDetails.serviceid;
      this.tabletoSmartcardData = this.smartcardDetails.status;
      this.selectedAttender = this.smartcardDetails.attendername;
      this.Amount = this.smartcardDetails.xml;
      this.closing = this.smartcardDetails.remarks;

      this.tabletoSmartcardMsoid = this.smartcardDetails.msoid;
      this.subscriberDetails = [
        { label: 'OPERATOR', value: this.smartcardDetails?.operatorname || 'N/A' },
        { label: 'MOBILE NO', value: this.smartcardDetails?.mobileno || 'N/A' },
        { label: 'SUBSCRIBER', value: this.smartcardDetails?.customername || 'N/A' },
        { label: 'AREA NAME', value: this.smartcardDetails?.area || 'N/A' },
        { label: 'STREET NAME', value: this.smartcardDetails?.street || 'N/A' }
      ];
      this.tabletoSmartcardData = this.smartcardDetails.status;
      this.tabletoSmartcardMsoid = this.smartcardDetails.msoid;

    })
    this.searchSmartcard = '';
    this.initializeSelect2();
  }
  columnDefs: ColDef[] = [
    {
      headerName: "S.NO", lockPosition: true, valueGetter: 'node.rowIndex+1', headerCheckboxSelection: true, filter: false, width: 150,
      checkboxSelection: true,
    },
    { headerName: "MODEL", field: 'model', width: 100 },
    { headerName: "TOKEN NUMBER", field: 'referencenumber', width: 150 },
    { headerName: "OPERATOR NAME", field: 'operatorname', width: 200, cellStyle: { textAlign: 'left' }, },
    {
      headerName: "SMARTCARD", field: 'smartcard', width: 230, cellStyle: { textAlign: 'left' },
      cellRenderer: (params: any) => {
        if (!params.value) return '';

        const smartcardSpan = document.createElement('span');
        smartcardSpan.innerText = params.value;
        smartcardSpan.style.cursor = "pointer";
        smartcardSpan.title = "Click the Smartcard";

        smartcardSpan.style.color = "#9d022d";
        smartcardSpan.style.fontWeight = "bold";

        smartcardSpan.addEventListener('click', () => {
          this.onServiceLogDetails(params.data);
          this.cdr.detectChanges();
        });
        return smartcardSpan;
      }

    },
    {
      headerName: "STATUS", field: 'status', width: 150, cellStyle: { textAlign: 'left' },
      cellRenderer: (params: any) => {
        const colors: any = { OPEN: "green", CLOSE: "red", DISPATCH: "blue" };
        return `<span style="color:white; color:${colors[params.value] || 'gray'}; padding:3px 8px; border-radius:4px; font-weight:bold;">
                  ${params.value}
                </span>`;
      }
    },
    {
      headerName: "EDIT", field: 'addingpackageid', width: 100,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = 'rgb(64 113 114)';
        editButton.style.border = 'none';
        editButton.title = 'Edit the Customer';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '6px';
        editButton.style.fontSize = "30px";
        editButton.addEventListener('click', () => {
          this.openEditDialog(params.data, '2');
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
    { headerName: "CONTACT", field: 'mobileno', width: 150 },
    { headerName: "CUSTOMER NAME", field: 'customername', width: 200, cellStyle: { textAlign: 'left' }, },

    { headerName: "BOX ID", field: 'boxid', width: 130, cellStyle: { textAlign: 'left' }, },

    { headerName: "REPLACE SMARTCARD", field: 'action', width: 230 },
    { headerName: "ENTRY", field: 'entryname', width: 150 },
    { headerName: "ENTRY DATE", field: 'logdate', width: 230 },
    { headerName: "CLOSING", field: 'remarks', width: 150, cellStyle: { textAlign: 'left' }, },
    { headerName: "CLOSING DATE", field: 'expirydate', width: 200, cellStyle: { textAlign: 'left' }, },
    { headerName: "ATTENDER", field: 'attendername', width: 150, cellStyle: { textAlign: 'left' }, },
    { headerName: "AMOUNT", field: 'xml', width: 120 },
    { headerName: "DELIVERY", field: 'dispatch', width: 150, cellStyle: { textAlign: 'left' }, },
    { headerName: "DELIVERY DATE", field: 'dispatchdate', width: 200 },
    { headerName: "DISPATCHER", field: 'dispatcher', width: 150, cellStyle: { textAlign: 'left' }, },

  ]
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
    // this.gridApi.sizeColumnsToFit();
  }
  onSelectionChanged() {
    console.log('ewrwrewrer');

    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      console.log("Selected Rows:", selectedRows);
      this.selectCount = selectedRows.length
      this.selectedIds = selectedRows.map((e: any) => e.id);
      this.selectedtypes = selectedRows.map((e: any) => e.isactive);
      // this.selectedtstatus = selectedRows.map((e: any) => e.statusdisplay);
      this.selectedtstatus = selectedRows[0].statusdisplay;

      console.log("Selected IDs:", this.selectedIds);
      console.log("Selected Status:", this.selectedtstatus);
    }
  }

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

  update_submit() {
    console.log(this.tabletoSmartcardNumber);

    // if (!this.selectedEntry) {
    //   this.swal.Error("Please select Entry");
    //   return;
    // }

    this.swal.Loading();
    this.userservice.updateServiceEntry(this.role, this.username, this.tabletoSmartcardNumber || this.tabletoSmartcard || this.smartcard || this.closeSmartcard, this.selectedEntry || this.entryname, this.closing || null, this.tokenNo || null, !this.isReplace, 0, this.selectedType || 0, this.selectSmartcard || null, this.Amount || 0, 0)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
  }
  update_submit_Open() {
    // console.log(this.tabletoSmartcardNumber);
    // console.log(this.tabletoSmartcard);
    // console.log(this.smartcard);
    // if (!this.selectedAttender) {
    //   this.swal.Error("Please select Attender");
    //   return;
    // }
    this.swal.Loading();
    this.userservice.updateServiceEntry(this.role, this.username, this.smartcard || this.tabletoSmartcardNumber || this.tabletoSmartcard || this.closeSmartcard, this.selectedEntry, this.closing || null, this.tokenNo || null, !this.isReplace, 0, this.selectedType || 0, this.selectSmartcard || null, this.Amount || 0, this.tabletoSmartcard || 0)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });

  }
  dispactchSubmit() {
    console.log('2234123213213213213');
    this.swal.Loading();
    this.userservice.updateServiceEntry(this.role, this.username, this.tabletoSmartcardNumber || this.tabletoSmartcard || this.smartcard || this.closeSmartcard, this.selectedEntry, this.closing || null, this.tokenNo || null, !this.isReplace, this.selectedAttender || 0, this.selectedType || 0, this.selectSmartcard || null, this.Amount || 0, 0)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
  }
  close_Submit() {
    // if (!this.smartcard) {
    //   this.swal.Error("Please select Smartcard");
    //   return;
    // }
    // if (!this.selectedAttender) {
    //   this.swal.Error("Please select Attender");
    //   return;
    // }
    // if (!this.selectedDispatcher) {
    //   this.swal.Error("Please select Dispatcher");
    //   return;
    // }
    this.swal.Loading();
    this.userservice.updateServiceEntry(this.role, this.username, this.smartcard || this.closeSmartcard, this.selectedEntry || null, this.delivery || this.closing || null, this.tokenNo || null, !this.isReplace, this.selectedDispatcher || 0, this.selectedType || 0, this.selectSmartcard || null, this.Amount || 0, this.smartcardId || this.tabletoSmartcard || 0)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message || err?.error);
      });
  }
  getServiceReportDownload(type: number) {
    this.swal.Loading();
    this.userservice.getServiceLogReport(this.role, this.username, this.fromdate || null, this.todate || null, this.tableSmartcard || null, this.selectedOperator, type).
      subscribe({
        next: (x: Blob) => {
          this.swal.Close();

          if (type == 1) {
            this.reportMaking(x, 'SERVICE HISTORY' + '-' + this.fromdate + '-' + this.todate + ".pdf", 'application/pdf');
          } else if (type == 2) {
            this.reportMaking(x, 'SERVICE HISTORY' + '-' + this.fromdate + '-' + this.todate + ".xlsx", 'application/xlsx');
          }
        },
        error: (error: any) => {
          this.swal.Close();
          this.pdfswalError(error?.error.message);
        }
      });
  }
  openEditDialog(data: any, type: any): void {
    let d = {
      data: data,
      problem: this.filteredProblemList,
      type: type
    }
    const dialogRef = this.dialog.open(ServicecenterEditComponent, {
      maxWidth: "500px",
      data: d
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  // -----------------------------------------------------common method for pdf and excel------------------------------------------------------------------------


  reportMaking(x: Blob, reportname: any, reporttype: any) {
    const blob = new Blob([x], { type: reporttype });
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = data;
    link.download = reportname.toUpperCase();
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    setTimeout(() => {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
    Swal.close();
  }
  pdfswalError(error: any) {
    Swal.close();
    Swal.fire({
      title: 'Error!',
      text: error.message || 'There was an issue generating the PDF CAS form report.',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
  processingSwal() {
    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }
  getTableHeight(): number {
    if (!this.rowData || this.rowData.length === 0) {
      return 200;
    } else if (this.rowData.length >= 2 && this.rowData.length <= 5) {
      return 500;
    } else if (this.rowData.length >= 10) {
      return 600;
    }
    return 600;
  }
  getMultiDispatch(ids: any, status: any) {
    console.log(ids);
    console.log(status);

  }
}
