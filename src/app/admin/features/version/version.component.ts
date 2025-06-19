import { Component, ElementRef, ViewChild } from '@angular/core';

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
    '1. The functions for changing LCO, Smart Card Transfer and Box Transfer login credentials are for MSO Admin role use only. These features are no longer accessible to LCO and Sub-LCO users. Changes have been implemented accordingly.',
    '2. For the Distributor role, the Change LCO operator list is now displayed.',
    '3. A Bulk Operation feature has been added under the Distributor role, enabling LCO transfers.',
    '4. Inventory management and LCO transfer functionalities have been integrated into the Distributor role.',
    '5. In MSO Reports, a new Payment Collection report has been added with monthly breakdowns by year.'
  ];

  visibleMessages: string[] = [];
  index = 0;

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
  }
    getClose() {
    this.showVersion_3 = false;
    this.showVersion_4 = false;
    this.showVersion_6 = false;
  }
}
