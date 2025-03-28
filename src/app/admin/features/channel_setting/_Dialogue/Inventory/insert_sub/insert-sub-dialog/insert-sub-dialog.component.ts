import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insert-sub-dialog',
  templateUrl: './insert-sub-dialog.component.html',
  styleUrls: ['./insert-sub-dialog.component.scss']
})
export class InsertSubDialogComponent {
  role: any;
  username: any;
  rowData: any;
  operatorid: any;
  id: any;
  selectedLcoName: any = 0;
  // sub_list: { [key: string]: number } = {};
  sub_list: any[] = [];
  searchTerm: string = '';
  filteredOperators: any[] = [];
  selectedOperator: any;
  submitted: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<InsertSubDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.id = data.id;
    this.operatorid = data.operatorid
    console.log(this.id);
    console.log(this.operatorid);

    userService.getsubscriberlist_allocation(this.role, this.username, this.operatorid).subscribe((data: any) => {
      console.log(data);
      this.sub_list = data[0];
      console.log(this.sub_list);
      this.sub_list = Object.entries(data[0]).map(([key, value]) => {
        return { name: key, value: value };
      });
      this.filteredOperators = this.sub_list;
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  // filteredLcoKeys(): string[] {
  //   const keys = Object.keys(this.sub_list);
  //   if (!this.searchTerm) {
  //     return keys;
  //   }
  //   return keys.filter(key =>
  //     key.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.sub_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);
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
    this.submitted = true;
    if (!this.selectedLcoName || !this.id || !this.operatorid) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Please make sure all required fields are filled and items are selected.',
        timer: 3000,
        showConfirmButton: true
      });
      return;
    }
    this.swal.Loading();
    this.userService.Defective_Insert_Allocated(this.role, this.username, this.selectedLcoName, this.id, this.operatorid)
      .subscribe(
        (res: any) => {
          console.log(res);
          Swal.fire({
            icon: 'success',
            title: 'Submission Successful',
            text: res.message || 'Your data has been successfully submitted.',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          }).then(() => {
            window.location.reload();
          });
          // this.swal.Close();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: error?.error?.message || 'An unexpected error occurred. Please try again later.',
            timer: 3000,
            showConfirmButton: true,
            timerProgressBar: true,
          }).then(() => {
            // window.location.reload();
          });
          // this.swal.Close();
          console.error('Error:', error);
        }
      );
    // .subscribe((res: any) => {
    //   this.swal.success(res?.message);
    // }, (err) => {
    //   this.swal.Error(err?.error?.message);
    // });
  }


}
