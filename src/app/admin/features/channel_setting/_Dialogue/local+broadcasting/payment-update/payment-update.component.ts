import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-payment-update',
  templateUrl: './payment-update.component.html',
  styleUrls: ['./payment-update.component.scss']
})
export class PaymentUpdateComponent {
  constructor(
    public dialogRef: MatDialogRef<PaymentUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      console.log('Selected file:', file);
      
      // You can now perform operations with the selected file, like uploading it to a server
    }
  }
}
