import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-inventory-dialogue',
  templateUrl: './inventory-dialogue.component.html',
  styleUrls: ['./inventory-dialogue.component.scss']
})
export class InventoryDialogueComponent {
  selectedFile: File | null = null;
  selectedCasType: any = 0;
  filteredCasList: any[] = [
    { name: "aaa", value: 0 },
    { name: "bbb", value: 1 },
    { name: "cccc", value: 2 },
    { name: "ddd", value: 3 },
    { name: "eee", value: 4 },
  ]
  constructor(
    public dialogRef: MatDialogRef<InventoryDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private userService: BaseService, private excelService: ExcelService, private storageService: StorageService, private swal: SwalService) {
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  generateExcel(type: string) {
    this.excelService.generatealacarteactivationExcel(type);
  }
  submit() {

  }
}
