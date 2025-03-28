import { Component, OnInit, signal } from '@angular/core';
import { PackageBasedComponent } from '../../channel_setting/Reports_page/Trai/package-based/package-based.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-lco-report',
  templateUrl: './lco-report.component.html',
  styleUrls: ['./lco-report.component.scss']
})
export class LcoReportComponent implements OnInit {

  step = signal(0);

  role: any;
  username: any;

  constructor(private route: ActivatedRoute, private router: Router, private userService: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    this.role = this.storageservice.getUserRole();
    this.username = this.storageservice.getUsername();

    this.userService.getMsoDetails(this.role, this.username).subscribe((res: any) => {
      console.log(res);
      // this.isshow = res.msoName.includes('AJK') ? true : false;
    });
  }
  setStep(index: number) {
    this.step.set(index); 
  }
  openLCODialog(event: any) {
    console.log(event);
    this.router.navigate(['admin/lcologinReports/' + event]);
  }

  openMsoDialog(event: any) {
    this.router.navigate(['admin/msodialogueReports/' + event]);
  }
}
