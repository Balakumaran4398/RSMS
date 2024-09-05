import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-update-ltb',
  templateUrl: './update-ltb.component.html',
  styleUrls: ['./update-ltb.component.scss']
})
export class UpdateLtbComponent {
  isActive = false;
  constructor(
    public dialogRef: MatDialogRef<UpdateLtbComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService) {
    console.log(data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  toggleStatus() {
    this.isActive = !this.isActive;
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      console.log('Selected file:', file);
      // You can now perform operations with the selected file, like uploading it to a server
    }
  }
}
