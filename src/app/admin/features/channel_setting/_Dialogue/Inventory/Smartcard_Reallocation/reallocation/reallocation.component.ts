import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reallocation',
  templateUrl: './reallocation.component.html',
  styleUrls: ['./reallocation.component.scss']
})
export class ReallocationComponent {
  role: any;
  username: any;
  rowData: any;
  selectedLcoName: any = 0;
  lco_list: any[] = [];
  searchTerm: string = '';
  smartcardlist: any[] = [];
  filteredOperators: any[] = [];
  selectedOperator: any;
  dueAmount: any;
  sub_ismei: any;
  isemi: any;
  logData: any;
  sub_emi: boolean = false;
  submitted: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ReallocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    // this.lco_list = data.lco_list;
    this.lco_list = Object.entries(data.lco_list).map(([key, value]) => {
      return { name: key, value: value };
    });
    console.log(this.lco_list);
    this.smartcardlist = data.smartcard;
    console.log(this.smartcardlist);
    this.filteredOperators = this.lco_list;
    this.logData = data.rowData;
    console.log(this.logData);
    this.dueAmount = data.dueAmount[0];
    this.isemi = data.emi[0];
    this.sub_emi = data.sub_emi;
    console.log(this.sub_emi);
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  filteredLcoKeys(): string[] {
    const keys = Object.keys(this.lco_list);
    if (!this.searchTerm) {
      return keys;
    }
    return keys.filter(key =>
      key.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  // submit() {
  //   this.userService.ReAllocate_Smartcard(this.role, this.username, this.smartcardlist, this.selectedLcoName).subscribe((res: any) => {
  //     console.log(res);

  //   })
  // }

  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    console.log(this.selectedLcoName);
  }

  submit() {
    this.submitted = true;
    if (!this.selectedLcoName) {
      return
    }
    this.swal.Loading();
    this.userService.ReAllocate_Smartcard(this.role, this.username, this.smartcardlist, this.selectedLcoName, this.dueAmount, this.isemi)
      .subscribe((res: any) => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Reallocated Successful',
          text: res.message || 'Your data has been successfully submitted.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Reallocated Failed',
            text: error?.error?.message || error?.error || 'An unexpected error occurred. Please try again later.',
            timer: 3000,
            showConfirmButton: true,
            timerProgressBar: true,
          }).then(() => {
            // window.location.reload();
          });
          console.error('Error:', error);
        }
      );
  }
}
