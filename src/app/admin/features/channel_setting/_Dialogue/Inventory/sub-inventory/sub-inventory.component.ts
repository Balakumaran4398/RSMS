import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-inventory',
  templateUrl: './sub-inventory.component.html',
  styleUrls: ['./sub-inventory.component.scss']
})
export class SubInventoryComponent {
  role: any;
  username: any;
  rowData: any;
  selectedLcoName: any = 0;
  submitted:boolean= false;
  // lco_list: { [key: string]: number } = {};
  lco_list: any[] = [];
  searchTerm: string = '';
  ismei: any;
  totalamount: any;
  smartcard: any;
  operatorid: any;
  filteredOperators: any[] = [];
  selectedOperator: any;
  constructor(
    public dialogRef: MatDialogRef<SubInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService) {
    console.log(data.lco_list);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    // this.lco_list = data.lco_list;
    this.lco_list = Object.entries(data.lco_list).map(([key, value]) => {
      return { name: key, value: value };
    });
    
    console.log(this.lco_list);
    this.smartcard = data.smartcard;
    console.log(this.smartcard);
    this.ismei = data.isemi;
    console.log(this.ismei);
    this.filteredOperators = this.lco_list;
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
  // Submit() {
  //   this.userService.ALLOCATED_SMARTCARD_TO_LCO(this.smartcard, this.role, this.username, this.ismei, '0.0', this.selectedLcoName).subscribe((res: any) => {
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
  Submit() {
    console.log(this.selectedLcoName);
    this.submitted = true;

    // Validate form fields before submission
    if (!this.smartcard || !this.role || !this.username || !this.ismei || !this.selectedLcoName) {
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'Validation Error',
      //   text: 'Please fill out all required fields.',
      // });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to allocate the smartcard?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, allocate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with API call if confirmed
        this.userService.ALLOCATED_SMARTCARD_TO_LCO(this.smartcard, this.role, this.username, this.ismei, '0.0', this.selectedLcoName)
          // .subscribe(
          //   (res: any) => {
          //     // Success message
          //     Swal.fire({
          //       icon: 'success',
          //       title: 'Success!',
          //       text:res.message|| 'Smartcard has been successfully allocated.',
          //     });
          //     console.log(res);
          //   },
          //   (error) => {
          //     // Error handling
          //     Swal.fire({
          //       icon: 'error',
          //       title: 'Error!',
          //       text: error.error?.message || 'Something went wrong. Please try again later.',
          //     });
          //     console.error(error);
          //   }
          // );
          .subscribe((res: any) => {
            this.swal.success(res?.message);
          }, (err) => {
            this.swal.Error(err?.error?.message);
          });
      }
    });
  }

}
