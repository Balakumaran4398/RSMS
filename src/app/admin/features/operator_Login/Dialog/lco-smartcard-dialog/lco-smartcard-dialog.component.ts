import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-lco-smartcard-dialog',
  templateUrl: './lco-smartcard-dialog.component.html',
  styleUrls: ['./lco-smartcard-dialog.component.scss']
})
export class LcoSmartcardDialogComponent {
  role: any;
  username: any;
  lcoPaymentList: any;

  pay: string = '0.0';
  iscredit: boolean = true;
  confirmation: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<LcoSmartcardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService,
    private cdr: ChangeDetectorRef) {
    console.log(data);
    this.lcoPaymentList = data;
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  submit(){
    
  }
}
