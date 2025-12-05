import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-lco',
  templateUrl: './update-lco.component.html',
  styleUrls: ['./update-lco.component.scss']
})
export class UpdateLcoComponent {
  role: any;
  username: any;
  id: any;
  usedcount: any;
  sharedcount: any;
  lcogroupid: any;
  id_1: any;
  usedcount_1: any;
  sharedcount_1: any;
  lcogroupid_1: any;
  lcogroupname: any;
  lcomembershipList: any = [];
  userid: any;
  accessip: any;
  constructor(
    public dialogRef: MatDialogRef<UpdateLcoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private cdr: ChangeDetectorRef, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.userid = storageservice.getUserid();
    this.accessip = storageservice.getAccessip();
    this.lcogroupname = data.groupname;
    this.lcogroupid = data.lcogroupid;
    this.id = data.id;
    this.usedcount = data.usedcount;
    this.sharedcount = data.sharecount;
    this.lcogroupid_1 = data.lcogroupid;
    this.id_1 = data.id;
    this.usedcount_1 = data.usedcount;
    this.sharedcount_1 = data.sharecount;
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
        // this.userservice.UpdatecomembershipFUP(this.role, this.username, this.id, this.sharedcount, this.lcogroupid)
        this.userservice.UpdatecomembershipFUP(this.role, this.username, this.usedcount, this.sharedcount, this.lcogroupid)
          .subscribe((res: any) => {
            this.swal.success(res?.message);
            const  data= `Used Count: ${this.usedcount}, ` + ` Shared Count: ${this.sharedcount},` + `Membership : ${this.lcogroupid}`;
            const remark = `Used Count: ${this.usedcount_1}, ` + ` Shared Count: ${this.sharedcount_1},` + `Membership : ${this.lcogroupid_1}`;
            this.logCreate('Package Master Button Clicked', remark, data);
          }, (err) => {
            this.swal.Error(err?.error?.message);
          });

      }
    });
  }
  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userservice.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
}

