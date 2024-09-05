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
  lco_list: { [key: string]: number } = {};
  searchTerm: string = '';
  smartcardlist: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ReallocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.lco_list = data.lco_list;
    console.log(this.lco_list);
    this.smartcardlist = data.smartcard;
    console.log(this.smartcardlist);


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

  submit() {
    // Validation to check if the necessary fields are set


    // Call the service to perform the operation
    this.userService.ReAllocate_Smartcard(this.role, this.username, this.smartcardlist, this.selectedLcoName).subscribe((res: any) => {
      console.log(res);
      Swal.fire({
        icon: 'success',
        title: 'Submission Successful',
        text: res.message || 'Your data has been successfully submitted.',
        timer: 3000,
        showConfirmButton: false
      }).then(() => {
        // Close the dialog or perform any other necessary actions
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
