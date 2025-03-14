import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { NewLcoComponent } from '../../channel_setting/_Dialogue/operator/new-lco/new-lco.component';

@Component({
  selector: 'app-distributorsetting',
  templateUrl: './distributorsetting.component.html',
  styleUrls: ['./distributorsetting.component.scss']
})
export class DistributorsettingComponent implements OnInit {
  role: any;
  username: any;
  businessList: any[] = [];
  constructor(private userService: BaseService, private storageService: StorageService, public dialog: MatDialog,) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }

  ngOnInit(): void {
    this.onBusinessList();
  }
  onBusinessList() {
    this.userService.getLcoBusinesslist(this.role, this.username).subscribe((data: any) => {
      this.businessList = data;
      console.log(data);

    })
  }
  // New_lco() {
  //   const dialogRef = this.dialog.open(NewLcoComponent, {
  //     width: '600px',
  //     panelClass: 'custom-dialog-container',
  //     data: this.businessList
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  New_lco(event: any) {
    console.log(event);
    let dialogData = {
      data: this.businessList,
      type: event
    }
    const dialogRef = this.dialog.open(NewLcoComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      // data: this.businessList,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
