import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-subscriber-import',
  templateUrl: './subscriber-import.component.html',
  styleUrls: ['./subscriber-import.component.scss']
})
export class SubscriberImportComponent {
  file: boolean = false;
  filePath: string = '';
  streetid: any = 0;
  street_list: { [key: string]: number } = {};
  isCheckboxChecked: boolean = false;

  isCheckboxChecked_operator: boolean = false;
  selectedFCFormControl = new FormControl('');

  fontcolor: any = [
    { lable: "Red", value: "#ff0000" },
    { lable: "Green", value: "#33cc33" },
    { lable: "Blue", value: "#0000ff" },
    { lable: "Yellow", value: "#ffff00" },
    { lable: "Pink", value: "#ff3399" },
    { lable: "Black", value: "#000000" },
    { lable: "White", value: "#ffffff" },
  ];
  onCheckboxChange(event: Event): void {
    this.isCheckboxChecked = (event.target as HTMLInputElement).checked;
  }
  onCheckboxChange_Operator(event: Event): void {
    this.isCheckboxChecked_operator = (event.target as HTMLInputElement).checked;
  }
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = true;
      this.filePath = input.files[0].name;
    } else {
      this.file = false;
      this.filePath = '';
    }
  }
  handleFontColorSelection(event: Event): void {
    const selectedColor = (event.target as HTMLSelectElement).value;
    console.log('Selected Font Color:', selectedColor);
  
    // Use the selectedColor as needed.
  }
}
