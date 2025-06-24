import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-servicecenter-edit',
  templateUrl: './servicecenter-edit.component.html',
  styleUrls: ['./servicecenter-edit.component.scss']
})
export class ServicecenterEditComponent implements OnDestroy, AfterViewInit {
  role: any;
  username: any;
  entry: any;
  entryName: any;
  dispatch: any;
  delivery: any;
  amount: any;
  id: any;
  msoid: any;
  searchTerm: any;
  type: any;
  filteredProblemList: any[] = [];
  constructor(public dialogRef: MatDialogRef<ServicecenterEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private storageservice: StorageService, private userservice: BaseService, private swal: SwalService) {
    console.log(data)
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.type = data?.type;
    console.log(this.type);

    this.entry = data?.data.serviceid;
    this.entryName = this.filteredProblemList.find(i => i.id == this.entry)?.name || '';
    this.dispatch = data?.data.remarks;
    this.delivery = data?.data.dispatch;
    this.amount = data?.data.xml;
    this.id = data?.data.id;
    this.msoid = data?.data.msoid;
    console.log('MSO ID', this.msoid);
    this.entryName == this.entry;
    this.filteredProblemList = data?.problem;

  }
  ngOnDestroy(): void {
    ($('#issue') as any).select2('destroy');
  }
  ngAfterViewInit(): void {
    ($('#issue') as any).select2({
      placeholder: 'Select Issue',
    });

    setTimeout(() => {
      $('#issue').val(this.entry).trigger('change');
    }, 100);

    $('#issue').on('change', (event: any) => {
      this.entry = event.target.value;
      this.entryName = this.filteredProblemList.find(i => i.id == this.entry)?.name || '';
      console.log('Selected:', this.entry);
    });
  }
  onSubmit() {
    this.swal.Loading();
    this.userservice.updateServiceLog(this.role, this.username, this.id, this.entry, this.dispatch, this.delivery, this.amount || 0).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
