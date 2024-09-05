import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-lco',
  templateUrl: './update-lco.component.html',
  styleUrls: ['./update-lco.component.scss']
})
export class UpdateLcoComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateLcoComponent>) {
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  change() {
    console.log('Success');

  }
}
