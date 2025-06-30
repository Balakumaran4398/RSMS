import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { VersionLoginCredentialComponent } from './dialog/version-login-credential/version-login-credential.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent {
  showVersion_3 = false;
  showVersion_4 = false;
  showVersion_6 = false;
  showVideo = false;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoSection') videoSection!: ElementRef<HTMLElement>;

  messages: string[] = [
    

    'ADMIN ROLE:',

    'DashBoard:-',
    '1. The dashboard provides access to the total box inventory and allows reports to be downloaded.',
    '2. CAS connection details are available for monitoring and management.',
    '3. Customer growth analytics are also displayed on the dashboard.',

    'Operator:-',
    '1. The Admin has the ability to perform recharges on behalf of operators.',
    
    'Bulk Operation:-',
    '1. A bulk smart card refresh feature is available for efficient mass updates.',
    '2. Bulk operator creation can be performed to streamline onboarding.',
    '3. LCO transfers can be carried out in bulk under this section.',

    'Reports:-',
    ' MSO Reports:',
    '1. A Payment Collection Report is available for financial tracking.',
    '2. An LCO-wise Activation and Subscription Count report provides insights into subscription distribution.',

    'DISTRIBUTOR ROLE :',

    '1. The functions for changing LCO, Smart Card Transfer and Box Transfer login credentials are for MSO Admin role use only. These features are no longer accessible to LCO and Sub-LCO users. Changes have been implemented accordingly.',
    '2. For the Distributor role, the Change LCO operator list is now displayed.',
    '3. A Bulk Operation feature has been added under the Distributor role, enabling LCO transfers.',
    '4. Inventory management and LCO transfer functionalities have been integrated into the Distributor role.',
    '5. In MSO Reports, a new Payment Collection report has been added with monthly breakdowns by year.',
  ];

  visibleMessages: string[] = [];
  index = 0;

  constructor(public dialog: MatDialog, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) { }
  ngOnInit() {
    this.showMessagesOneByOne();
  }
  showMessagesOneByOne() {
    const interval = setInterval(() => {
      if (this.index < this.messages.length) {
        this.visibleMessages.push(this.messages[this.index]);
        this.index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }
  // playVideo() {
  //   this.showVideo = true;
  //   setTimeout(() => {
  //     this.videoPlayer.nativeElement.play();
  //   }, 0);
  // }
  playVideo() {
    this.showVideo = true;
    // setTimeout(() => {
    //   this.videoPlayer?.nativeElement.play();
    // });
    setTimeout(() => {
      this.videoPlayer?.nativeElement.play();
      this.videoSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }
  closeVideo() {
    if (this.videoPlayer) {
      const video = this.videoPlayer.nativeElement;
      video.pause();
      video.currentTime = 0;
    }
    this.showVideo = false;
  }
  getVersion(type: any) {
    console.log(type);
    const dialogRef = this.dialog.open(VersionLoginCredentialComponent, {
      // width: '500px',
      // panelClass: 'custom-dialog-container',
      data: '1'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        console.log('dsfsdfdsfdsfdsf', result);
        if (type == 1) {
          this.showVersion_3 = true;
          this.showVersion_6 = false;
          this.showVersion_4 = false;
        } else if (type == 2) {
          this.showVersion_6 = true;
          this.showVersion_4 = false;
          this.showVersion_3 = false;
        } else if (type == 3) {
          this.showVersion_3 = false;
          this.showVersion_4 = true;
          this.showVersion_6 = false;
        }
      } else {
        console.log('Dialog closed without success');
      }
    });
  }
  getClose() {
    this.showVersion_3 = false;
    this.showVersion_4 = false;
    this.showVersion_6 = false;
  }
}
