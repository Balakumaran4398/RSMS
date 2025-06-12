import { Component, Inject, EventEmitter, Output, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-lco',
  templateUrl: './create-lco.component.html',
  styleUrls: ['./create-lco.component.scss']
})
export class CreateLcoComponent implements OnInit, AfterViewInit {
  role: any;
  username: any;
  lcogroupname: any;
  errorMessage: any;
  type: any;
  distributorid: any = 0;
  distributorList: any[] = [];
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<CreateLcoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService
  ) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.type = data.type;
  }
  ngOnDestroy(): void {
    ($('#ltb') as any).select2('destroy');
  }
  
  ngAfterViewInit(): void {
    ($('#ltb')as any).select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#ltb').on('change', (event: any) => {
      console.log(event);
      
      this.distributorid = event.target.value;
      console.log(this.distributorid);
      
      this.onSubscriberStatusChange(this.distributorid);
    });
  }
  selectedOperator: any;
  selectedLcoName: any;
  onSubscriberStatusChange(selectedOperator: any) {
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
  }
  ngOnInit(): void {
    // this.userservice.getAvailableAndNotAvailableDistributorList(this.role, this.username, this.distributorid).subscribe((data: any) => {
    //   console.log(data);

    // })
    this.userservice.getDistributorListNotInDistributor(this.role, this.username,).subscribe((data: any) => {
      console.log(data);
      // this.distributorList= data;
      this.distributorList = Object.keys(data).map(key => {
        const value = data[key];
        // const name = key;
        const name = key.replace(/\s*\(.*?\)\s*/g, '').trim();
        return { name: name, value: value };
      });
      this.distributorList.sort((a: any, b: any) => {
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
        return 0;
      });
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createMembership() {
    if (!this.lcogroupname) {
      this.errorMessage = 'LCO Groupname  is required.';
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this lcogroupname?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Creating...',
          text: 'Wait for the LCO Groupname to be created....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.createLcoGroup(this.role, this.username, this.lcogroupname || null).subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
      }
    });
  }
  createDisMembership() {
    if (!this.distributorid) {
      this.errorMessage = 'Distributor  is required.';
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this Distributor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Creating...',
          text: 'Wait for the Distributor to be created....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.createDistributorGroup(this.role, this.username, this.distributorid).subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
      }
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  errorToggle() {
    this.errorMessage = !this.errorMessage;
  }
  clearError() {
    if (this.lcogroupname.trim()) {
      this.errorMessage = null;
    }
  }
}
