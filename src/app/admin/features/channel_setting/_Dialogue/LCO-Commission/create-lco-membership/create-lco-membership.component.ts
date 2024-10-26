import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-lco-membership',
  templateUrl: './create-lco-membership.component.html',
  styleUrls: ['./create-lco-membership.component.scss']
})
export class CreateLcoMembershipComponent {
  role: any;
  username: any;
  usedcount: any;
  sharedcount: any;
  selectedLcoName: any = 0;
  lco_list: { [key: string]: number } = {};
  searchTerm: string = '';
  
  constructor(
    public dialogRef: MatDialogRef<CreateLcoMembershipComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    userservice.getsmartcardallocationSubscriberList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lco_list = data[0].operatorid;
      console.log(this.lco_list);
    })

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
  onNoClick(): void {
    this.dialogRef.close();
  }
  // create() {
  //   this.userservice.createlcomembershipFUP(this.role, this.username, this.selectedLcoName, this.usedcount, this.sharedcount).subscribe((res: any) => {
  //     console.log(res);

  //   })
  // }

  create() {
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we Create the LCO Membership.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.createlcomembershipFUP(this.role, this.username, this.selectedLcoName, this.usedcount, this.sharedcount)
      .subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Success!',
            text: 'LCO membership has been created successfully.',
            icon: 'success',
            timer: 2000,  
            timerProgressBar:true,
            showConfirmButton: false  
          }).then(() => {
            this.dialogRef.close(); 
          });
        },
        (err: any) => {
          Swal.fire({
            title: 'Error!',
            text: err?.error?.message || 'An error occurred while creating the LCO membership.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }
  

  // create() {
  //   let isValid = true;
  //   this.errors = {
  //     selectedLcoName: '',
  //     usedcount: '',
  //     sharedcount: ''
  //   };

  //   // Validation rules
  //   if (!this.selectedLcoName || this.selectedLcoName === '0') {
  //     this.errors.selectedLcoName = 'Please select an LCO Name';
  //     isValid = false;
  //   }

  //   if (!this.usedcount || isNaN(+this.usedcount) || +this.usedcount <= 0) {
  //     this.errors.usedcount = 'Please enter a valid Used Count (numeric and greater than 0)';
  //     isValid = false;
  //   }

  //   if (!this.sharedcount || isNaN(+this.sharedcount) || +this.sharedcount <= 0) {
  //     this.errors.sharedcount = 'Please enter a valid Shared Count (numeric and greater than 0)';
  //     isValid = false;
  //   }

  //   if (isValid) {
  //     // Proceed with creation if all fields are valid
  //     console.log('LCO Membership Created:', {
  //       selectedLcoName: this.selectedLcoName,
  //       usedcount: this.usedcount,
  //       sharedcount: this.sharedcount
  //     });
  //   }
  // }
}
