import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
declare var $: any;
@Component({
  selector: 'app-inventorycortonbox',
  templateUrl: './inventorycortonbox.component.html',
  styleUrls: ['./inventorycortonbox.component.scss']
})
export class InventorycortonboxComponent implements OnInit {
  selectedFile: File | null = null;
  type: any;
  selectedType: string = 'operator'
  selectOperator: any;
  selectSubscriber: any;
  selectArea: any;
  selectedPackage: any;
  selectStreet: any;
  isemi: boolean = false;
  filteredOperatorList: any[] = [
    { name: "aaa", value: 0 },
    { name: "bbb", value: 1 },
    { name: "cccc", value: 2 },
    { name: "ddd", value: 3 },
    { name: "eee", value: 4 },
  ];
  filteredSubscriberList: any[] = [
    { name: "aaa", value: 0 },
    { name: "bbb", value: 1 },
    { name: "cccc", value: 2 },
    { name: "ddd", value: 3 },
    { name: "eee", value: 4 },
  ];
  filteredAreaList: any[] = [
    { name: "aaa", value: 0 },
    { name: "bbb", value: 1 },
    { name: "cccc", value: 2 },
    { name: "ddd", value: 3 },
    { name: "eee", value: 4 },
  ];
  filteredStreetList: any[] = [
    { name: "aaa", value: 0 },
    { name: "bbb", value: 1 },
    { name: "cccc", value: 2 },
    { name: "ddd", value: 3 },
    { name: "eee", value: 4 },
  ];
  filteredPackageList: any[] = [
    { name: "aaa", value: 0 },
    { name: "bbb", value: 1 },
    { name: "cccc", value: 2 },
    { name: "ddd", value: 3 },
    { name: "eee", value: 4 },
  ];

  constructor(
    public dialogRef: MatDialogRef<InventorycortonboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private userService: BaseService, private excelService: ExcelService, private storageService: StorageService, private swal: SwalService) {
    console.log(data);
    this.type = data;
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit() {
    $('#operator').select2({
      placeholder: 'Select a Operator',
      allowClear: true
    });
    $('#operator').on('change', (event: any) => {
      // this.selectedLcoName = event.target.value;
      // this.onSubscriberStatusChange(this.selectedLcoName);
    });
    $('#subscriber').select2({
      placeholder: 'Select a Subscriber',
      allowClear: true
    });
    $('#subscriber').on('change', (event: any) => {
      // this.selectedLcoName = event.target.value;
      // this.onSubscriberStatusChange(this.selectedLcoName);
    });
    $('#area').select2({
      placeholder: 'Select a Area',
      allowClear: true
    });
    $('#area').on('change', (event: any) => {
      // this.selectedLcoName = event.target.value;
      // this.onSubscriberStatusChange(this.selectedLcoName);
    });
    $('#street').select2({
      placeholder: 'Select a Street',
      allowClear: true
    });
    $('#street').on('change', (event: any) => {
      // this.selectedLcoName = event.target.value;
      // this.onSubscriberStatusChange(this.selectedLcoName);
    });
    $('#package').select2({
      placeholder: 'Select a Package',
      allowClear: true
    });
    $('#package').on('change', (event: any) => {
      // this.selectedLcoName = event.target.value;
      // this.onSubscriberStatusChange(this.selectedLcoName);
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

  }
}
