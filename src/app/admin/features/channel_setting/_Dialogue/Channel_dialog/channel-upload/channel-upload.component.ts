import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-channel-upload',
  templateUrl: './channel-upload.component.html',
  styleUrls: ['./channel-upload.component.scss']
})
export class ChannelUploadComponent {
  filePath: string | null = null;
  file: boolean = false;
  file_path: boolean = false;
  username: any;
  selectedFile: any;
  role: any;
  rowData: any[] = [];
  gridOptions = {
    defaultColDef: {
      width: 180,
    },
  };
  constructor(public dialogRef: MatDialogRef<ChannelUploadComponent>, private userservice: BaseService, private storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }

  columnDefs: ColDef[] = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 100 },
    { headerName: 'CHANNEL NAME', field: 'channel', editable: true, width: 150 },
    { headerName: 'SERVICE ID', field: 'serviceId', editable: true, width: 150 },
    { headerName: 'PRODUCT ID', field: 'productId', editable: true, width: 140 },
    { headerName: 'INR AMOUNT', field: 'inr_amt', editable: true, width: 150 }
  ];
  // columnDefs: any

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = true;
      this.selectedFile = input.files[0];
      this.filePath = this.selectedFile.name;  // Store the file name
      console.log('Selected file name:', this.selectedFile);
    } else {
      this.file = false;
      this.filePath = '';
    }
  }

  processExcelData(data: any[]): void {
    this.rowData = data.slice(1).map((row, index) => ({
      channel: row[0],
      serviceId: row[1],
      productId: row[2],
      inr_amt: row[3]
    }));
  }


  clearFilePath(): void {
    this.file = false;
    this.filePath = '';
    this.rowData = [];
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  // confirm(): void {
  //   if (!this.filePath) {
  //     console.log('No file selected.');
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append('file', this.selectedFile);
  //   this.file_path = false;
  //   const fileName = this.filePath;
  //   this.filePath = '';
  //   // Optionally, clear the file input element
  //   const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.value = '';
  //   }
  //   this.userservice.Upload_channel_list(this.role, this.username, fileName).subscribe((res: any) => {
  //     console.log('Upload response:', res);
  //   });
  // }
  confirm(): void {
    if (!this.filePath) {
      console.log('No file selected.');
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.file_path = false;
    const fileName = this.filePath;
    this.filePath = '';
    Swal.fire({
      title: 'Uploading File...',
      html: 'Please wait while your file is being uploaded.',
      allowOutsideClick: false,
      didOpen: () => {
       
          Swal.showLoading(null);
        
        this.userservice.Upload_channel_list(this.role, this.username, fileName).subscribe(
          (res: any) => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Upload Successful',
              text: res.message || 'Your file has been uploaded successfully.',
              confirmButtonText: 'OK',
            }).then(() => {
              location.reload();
            });
          },
          (error) => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Upload Failed',
              text: error?.error.message || 'There was an error uploading your file. Please try again.',
            });
          }
        );
      }
    });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  cancelUpload(): void {
    this.clearFilePath();
  }

  // uploadData(): void {
  //   console.log('Upload');
  //   console.log(this.selectedFile);

  //   if (this.filePath && this.selectedFile) {
  //     this.file_path = true;
  //     console.log('Uploading file:', this.filePath);
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const binaryData = e.target.result;
  //       const workbook = XLSX.read(binaryData, { type: 'binary' });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  //       this.rowData = excelData.slice(1).filter((row, index) => index > 0).map((row, index) => ({
  //         channel: row[2],
  //         serviceId: row[3],
  //         productId: row[4],
  //         inr_amt: row[5]
  //       }));
  //       console.log('Extracted rowData:', this.rowData);
  //     };
  //     console.log(this.rowData);

  //     reader.readAsBinaryString(this.selectedFile);
  //     this.uploadFile(this.selectedFile)
  //   }
  // }

  uploadData(event: any): void {
   

    console.log('Starting file upload');
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('role', this.role);
    formData.append('username', this.username);

    // Upload the file first
    this.userservice.uploadChannellist(formData).subscribe(
      (res: any) => {
        console.log('Upload successful:', res);

        // After a successful upload, extract data from the file
        this.extractExcelData();
      },
      (error) => {
        console.error('Upload failed:', error);
      }
    );
  }

  extractExcelData(): void {
    if (this.filePath && this.selectedFile) {
      console.log('Extracting data from file:', this.filePath);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const binaryData = e.target.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        this.rowData = excelData.slice(1).filter((row, index) => index > 0).map((row, index) => ({
          channel: row[2],
          serviceId: row[3],
          productId: row[4],
          inr_amt: row[5]
        }));
        console.log('Extracted rowData:', this.rowData);
      };
      reader.readAsBinaryString(this.selectedFile);
    }
  }




  uploadFile(event: any): void {
    event = this.selectedFile;
    console.log(this.selectedFile);
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }
    const formData = new FormData();
    console.log(event);
    console.log(this.selectedFile);
    formData.append('file', this.selectedFile);
    formData.append('role', this.role);
    formData.append('username', this.username);
    console.log('Uploading:', formData);
    // this.userservice.Upload_CHANNEL(formData).subscribe(
    //   (res: any) => {
    //     console.log('Upload successful:', res);
    //   },
    //   (error) => {
    //     console.error('Upload failed:', error);
    //   }
    // );
  }


}
