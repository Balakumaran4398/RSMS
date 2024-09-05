import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-lco',
  templateUrl: './create-lco.component.html',
  styleUrls: ['./create-lco.component.scss']
})
export class CreateLcoComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateLcoComponent>) {
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
