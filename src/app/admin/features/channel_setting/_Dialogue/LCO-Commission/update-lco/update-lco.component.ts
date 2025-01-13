import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-lco',
  templateUrl: './update-lco.component.html',
  styleUrls: ['./update-lco.component.scss']
})
export class UpdateLcoComponent {
  role: any;
  username: any;
  usedcount: any;
  sharedcount: any;
  lcogroupid: any;
  lcogroupname: any;
  lcomembershipList: any = [];
  id: any;
  constructor(
    public dialogRef: MatDialogRef<UpdateLcoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userservice: BaseService, private cdr: ChangeDetectorRef, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.lcogroupname = data.groupname;
    this.lcogroupid = data.lcogroupid;
    this.id = data.id;
    this.usedcount = data.usedcount;
    this.sharedcount = data.sharecount;
    console.log('Initial Data:', data);
    console.log('Initial lcogroupid:', this.lcogroupid);
    console.log('Initial lcogroupname:', this.lcogroupname);
    

    userservice.getLcoGroupMasterList(this.role, this.username).subscribe((data: any) => {
      this.lcomembershipList = Object.keys(data).map(key => {
        return { name: key, value: data[key] }; // Mapping data to name and value
      });
      cdr.detectChanges();
      // Set lcogroupid based on the selected lcogroupname
      const selectedGroup = this.lcomembershipList.find((group: any) => group.value === this.lcogroupid);
      // this.lcogroupid = selectedGroup ? selectedGroup.value : ''; 
      if (!selectedGroup) {
        console.warn('lcogroupid does not match any value in lcomembershipList');
      }
        
    });
  }
  onNoClick(): void { 
    this.dialogRef.close();
  }
  change() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to make changes to the membership.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, make changes!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Processing...',
          text: 'Please wait while we Update the LCO Membership.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userservice.UpdatecomembershipFUP(this.role, this.username, this.id, this.sharedcount, this.lcogroupid)
          .subscribe(
            (res: any) => {
              Swal.fire({
                title: 'Success!',
                text: res?.message,
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
              }).then(() => {
                this.dialogRef.close();
              });
            },
            (err: any) => {
              Swal.fire({
                title: 'Error!',
                text: err?.error?.message,
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true,
              });
            }
          );
      }
    });
  }
}

