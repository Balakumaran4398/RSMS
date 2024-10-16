import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss']
})
export class RecurringComponent implements OnInit {
  username: any;
  role: any;
  cas: any;
  smartcard: any;
  CasFormControl: any;
  operatorid: any=0;
  searchname: any = 0;
  operatorList: any[] = [];
  reccuringData: any;
  isrecurring = false;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private userservice: BaseService, private storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {
      this.userservice.getOeratorList(this.role, this.username).subscribe((data: any) => {
        console.log(data);
        this.operatorList = Object.keys(data).map(key => {
          const value = data[key];
          const name = key;
          return { name: name, value: value };
        });
      })
  }
  // submit(type: any) {

  //   this.userservice.getRecurringListByOperatorIdSearchnameAndIsrecurring(this.role, this.username, this.operatorid, this.searchname, type)
  //     .subscribe(
  //       (response: HttpResponse<any[]>) => { // Expect HttpResponse<any[]>
  //         if (response.status === 200) {
  //           this.reccuringData = response.body;
  //           Swal.fire('Success', 'Data updated successfully!', 'success');
  //         } else if (response.status === 204) {
  //           Swal.fire('No Content', 'No data available for the given criteria.', 'info');
  //         }
  //       },
  //       (error) => {
  //         if (error.status === 400) {
  //           Swal.fire('Error 400', 'Bad Request. Please check the input.', 'error');
  //         } else if (error.status === 500) {
  //           Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
  //         } else {
  //           Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
  //         }
  //       }
  //     );
  // }
  submit(type: any) {
    // Set type
    this.userservice.getRecurringListByOperatorIdSearchnameAndIsrecurring(this.role, this.username, this.operatorid, this.searchname, type)
      .subscribe(
        (response: HttpResponse<any[]>) => {
          if (response.status === 200) {
            this.reccuringData = response.body;
            Swal.fire('Success', 'Data updated successfully!', 'success');

          } else if (response.status === 204) {
            Swal.fire('No Content', 'No data available for the given criteria.', 'info');
          }
        },
        (error) => {
          if (error.status === 400) {
            Swal.fire('Error 400', 'Bad Request. Please check the input.', 'error');
          } else if (error.status === 500) {
            Swal.fire('Error 500', 'Internal Server Error. Please try again later.', 'error');
          } else {
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
          }

          this.callAnotherApi();
        }
      );
  }
  callAnotherApi() {
    this.userservice.someOtherApiCall(this.role, this.username).subscribe(
      (response: HttpResponse<any[]>) => {
        if (response.status === 200) {
          console.log('Second API call successful');
        }
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      (error: any) => {
        console.log('Second API call failed', error);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    );
  }
}
