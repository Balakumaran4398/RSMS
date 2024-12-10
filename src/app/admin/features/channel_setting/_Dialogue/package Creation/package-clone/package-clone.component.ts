import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-package-clone',
  templateUrl: './package-clone.component.html',
  styleUrls: ['./package-clone.component.scss']
})
export class PackageCloneComponent {
  package_name: any;
  package_rate: any;
  packageRate: any;
  package_desc: any;
  package_view_count: any;
  Reference_id: any;
  username: any;
  role: any;
  package_id: any;
  newpackagename: any;
  packagenameList: any = [];
  type: number = 1;
  submitted: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<PackageCloneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private swal: SwalService, private storageService: StorageService, private cdr: ChangeDetectorRef,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.package_name = data.packagename;
    this.package_rate = data.packagerate;
    // this.package_desc = data.packagedesc;
    // this.Reference_id = data.orderid;
    this.package_id = data.packageid;
    // this.newpackagename= data.packageid;
    userService.Package_CloneList(this.role, this.username, this.package_id).subscribe((data: any) => {
      console.log(data);
      this.package_view_count = data.count;
    })
  }
  ngOnInit(): void {
    this.userService.PackageList(this.role, this.username, this.type).subscribe((data) => {
      this.packagenameList = data;
      this.cdr.detectChanges();
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  Create(): void {
    this.submitted = true;
    if (!this.package_name || !this.package_rate || !this.package_desc || !this.Reference_id) {
      return;
    } else {
      this.swal.Loading();
      this.userService.Clone_create(this.package_id, this.newpackagename, this.package_desc, this.packageRate, this.Reference_id, this.role, this.username)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }
  }
  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
