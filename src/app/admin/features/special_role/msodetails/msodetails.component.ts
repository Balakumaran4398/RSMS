import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { EditmsoComponent } from '../Dialogue/editmso/editmso.component';
import { Any } from 'node_modules1/@sigstore/protobuf-specs/dist/__generated__/google/protobuf/any';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-msodetails',
  templateUrl: './msodetails.component.html',
  styleUrls: ['./msodetails.component.scss']
})
export class MsodetailsComponent implements OnInit {
  role: any;
  username: any;
  msodetails: any;
  filePath: string | null = null;
  file: File | null = null;
  isFileSelected: boolean = false;
  selectedFile: any;
  constructor(private userservice: BaseService, private storageservice: StorageService, public dialog: MatDialog, private swal: SwalService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    this.userservice.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.msodetails = data;
    })
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.isFileSelected = true;
      this.file = input.files[0];
      this.filePath = this.file.name;  // Store the file name

      console.log('Selected file:', this.file);

      // Prepare request body
      let requestBody = new FormData();
      requestBody.append('role', this.role);
      requestBody.append('username', this.username);
      requestBody.append('file', this.file);
      this.swal.Loading();
      this.userservice.uploadLogo(requestBody).subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
    } else {
      this.isFileSelected = false;
      this.file = null;
      this.filePath = '';
    }
  }



  openDialogue(event: any) {
    let dialogData = { data: this.msodetails };
    console.log(dialogData);
    const dialogRef = this.dialog.open(EditmsoComponent, {
      width: '800px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
