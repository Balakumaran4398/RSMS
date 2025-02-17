import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-inventory-dialogue',
  templateUrl: './inventory-dialogue.component.html',
  styleUrls: ['./inventory-dialogue.component.scss']
})
export class InventoryDialogueComponent implements OnInit,OnDestroy {
  selectedFile: File | null = null;
  selectedCasType: any ;

  role: any;
  username: any;

  cas: any;
  filteredCasList: any[] = [
    // { name: "aaa", value: 0 },
    // { name: "bbb", value: 1 },
    // { name: "cccc", value: 2 },
    // { name: "ddd", value: 3 },
    // { name: "eee", value: 4 },
  ]
  constructor(
    public dialogRef: MatDialogRef<InventoryDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private userservice: BaseService, private excelService: ExcelService, private storageService: StorageService, private swal: SwalService) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }
  ngOnInit(): void {
    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
      console.log('inventory', this.cas);
      this.cas = data.map((item: any) => ({
        id: item.id,
        name: item.casname
      }));
      this.filteredCasList = this.cas;
      console.log(this.cas);
    });

  }
  ngOnDestroy(): void {
    ($('#casType') as any).select2('destroy');
  }
  ngAfterViewInit() {
    $('#casType').select2({
      placeholder: 'Select a CAS Name',
      allowClear: true
    });
    $('#casType').on('change', (event: any) => {
      console.log(event);

      this.selectedCasType = event.target.value;
      console.log(this.selectedCasType);
    });
  }
  onCastypeList(event: any) {
    console.log(event);

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

    if (this.selectedFile) {
         Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while your file is being uploaded.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false, 
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('role', this.role);
      formData.append('username', this.username);
      formData.append('operatorid', '0');
      formData.append('castype', this.selectedCasType);
      formData.append('isupload', 'true');
      this.swal.Loading();
      console.log(formData);

      this.userservice.UploadInventory(formData)
        .subscribe((res: any) => {
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }

  }
}
