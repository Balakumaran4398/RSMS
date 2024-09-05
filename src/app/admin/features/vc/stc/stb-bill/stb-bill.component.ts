import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-stb-bill',
  templateUrl: './stb-bill.component.html',
  styleUrls: ['./stb-bill.component.scss'],

})
export class StbBillComponent {
  submitted = false;
  form!: FormGroup;
  isLinear = false;
  gridApi: any;
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
  isLCONameDisabled = false;
  isDateDisabled = false;
  isMonthDisabled = false;
  isYearDisabled = false;
  isBillNoDisabled = false;
  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        lco: ['', Validators.required],
        area: ['', Validators.required],
        stb_model: ['', Validators.requiredTrue],
        stb_rate: ['', Validators.required],
        total_of_stb: ['', [Validators.required,]],
        transaction: ['', [Validators.required]],
        reference_no: ['', [Validators.required]],
        cgst: ['', [Validators.required]],
        sgst: ['', [Validators.required]],
        previous_balance: ['', [Validators.required]],
        total_bill_amount: ['', [Validators.required]],
        paid_amount: ['', [Validators.required]],
        collection_date: ['', [Validators.required]],

        //   },
        // );
        // this.form = this.fb.group({
        type_of_report: [''],
        // lco_name: new FormControl('', Validators.required),
        // date: new FormControl('', Validators.required),
        // month: new FormControl('', Validators.required),
        // year: new FormControl('', Validators.required),
        // bill_no: new FormControl('', Validators.required),
        lco_name: [{ value: '', disabled: this.isLCONameDisabled}, Validators.required],
        date: [{ value: '', disabled: this.isLCONameDisabled}, Validators.required],
        month: [{ value: '',disabled: this.isLCONameDisabled}, Validators.required],
        year: [{ value: '', disabled: this.isLCONameDisabled}, Validators.required],
        bill_no: [{ value: '', disabled: this.isLCONameDisabled}, Validators.required]
      });
  }
  onReportTypeChange(event: any): void {
    const selectedReport = event.target.value;
    console.log('rdfgfghfgfgh                   ' + selectedReport);

    this.resetFormControls();

    switch (selectedReport) {
      case 'bill_no':
        this.isBillNoDisabled = true;
        this.form.get('bill_no')?.enable();
        break;
      case 'operator':
        this.isLCONameDisabled = false;
        this.form.get('lco_name')?.enable();
        break;
      case 'monthly':
        this.isMonthDisabled = false;
        this.form.get('month')?.enable();
        break;
      case 'yearly':
        this.isYearDisabled = false;
        this.form.get('year')?.enable();
        break;
      case 'datewise':
        this.isDateDisabled = false;
        this.form.get('date')?.enable();
        break;
      default:
        this.resetFormControls();
        break;
    }
  }

  resetFormControls(): void {
    this.isLCONameDisabled = true;
    this.isDateDisabled = true;
    this.isMonthDisabled = true;
    this.isYearDisabled = true;
    this.isBillNoDisabled = true;

    this.form.get('lco_name')?.reset();
    this.form.get('date')?.reset();
    this.form.get('month')?.reset();
    this.form.get('year')?.reset();
    this.form.get('bill_no')?.reset();

    this.form.get('lco_name')?.disable();
    this.form.get('date')?.disable();
    this.form.get('month')?.disable();
    this.form.get('year')?.disable();
    this.form.get('bill_no')?.disable();
  }

  onSubmit(form: any): void {
    this.submitted = true;
    console.log('sdsdfs');

    if (form.invalid) {
      console.log('Form is invalid. API call not made.');
      return;
    }
    const fd = new FormData();

    fd.append('lco', this.form?.value?.lco);
    fd.append('area', this.form?.value?.area);
    fd.append('stb_model', this.form?.value?.stb_model);
    fd.append('stb_rate', this.form?.value?.stb_rate);
    fd.append('total_of_stb', this.form?.value?.total_of_stb);
    fd.append('transaction', this.form?.value?.transaction);
    fd.append('reference_no', this.form?.value?.reference_no);
    fd.append('cgst', this.form?.value?.cgst);
    fd.append('sgst', this.form?.value?.sgst);
    fd.append('previous_balance', this.form?.value?.previous_balance);
    fd.append('total_bill_amount', this.form?.value?.total_bill_amount);
    fd.append('paid_amount', this.form?.value?.paid_amount);
    fd.append('collection_date', this.form?.value?.collection_date);

  }
  onKeydown(e: any) {
    // console.log(e.keyCode);
    var key = e.keyCode;
    // Only allow numbers to be entered
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  columnDefs: ColDef[] = [

    {
      headerName: 'BILL NO',
      field: 'broadcastername',

    },
    {
      headerName: 'LCO NAME',
      field: 'broadcastername',

    },
    {
      headerName: 'AREA NAME',
      field: 'broadcastername',

    },
    {
      headerName: 'STB MODEL',
      field: 'broadcastername',

    },
    {
      headerName: 'RATE',
      field: 'broadcastername',

    },
    {
      headerName: 'NO.OF STB',
      field: 'broadcastername',

    },
    {
      headerName: 'TOTAL STB AMOUNT',
      field: 'broadcastername',

    },
    {
      headerName: 'CGST',
      field: 'broadcastername',
    },
    {
      headerName: 'SGST',
      field: 'broadcastername',
    },
    {
      headerName: 'PREVIOUS BALANCE',
      field: 'broadcastername',
    },
    {
      headerName: 'TOTAL AMOUNT',
      field: 'broadcastername',
    },
    {
      headerName: 'PAID AMOUNT',
      field: 'broadcastername',
    },
    {
      headerName: 'BALANCE AMOUNT',
      field: 'broadcastername',
    },
    {
      headerName: 'PAID DATE',
      field: 'broadcastername',
    },
    {
      headerName: 'PRINT',
      field: 'broadcastername',
    },




  ]
  rowData = [
    {
      broadcastername: 'Example Value',
    },
    {
      broadcastername: 'Example Value',
    },
    {
      broadcastername: 'Example Value',
    },


  ];
  onGridReady(params: { api: any; }) {
    this.gridApi.sizeColumnsToFit();
    this.gridApi = params.api;
  }
}
