import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
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
  submitted: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ReallocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
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
    this.filteredOperators=this.lco_list;

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
    this.userService.ReAllocate_Smartcard(this.role, this.username, this.smartcardlist, this.selectedLcoName).subscribe((res: any) => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Submission Successful',
        text: res.message || 'Your data has been successfully submitted.',
        timer: 3000,
        showConfirmButton: false
      }).then(() => {
        this.dialogRef.close();
      });
    },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: error?.error?.message || 'An unexpected error occurred. Please try again later.',
          timer: 3000,
          showConfirmButton: true
        });
        console.error('Error:', error);
      }
    );
  }

}
