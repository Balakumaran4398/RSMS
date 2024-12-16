import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { ChannellistComponent } from '../../../subscriber/channellist/channellist.component';
import { PackageBasedComponent } from '../../Reports_page/Trai/package-based/package-based.component';
import { SubscriptionBasedComponent } from '../../Reports_page/Trai/subscription-based/subscription-based.component';
import { BroadcasterReportsComponent } from '../../Reports_page/Trai/broadcaster-reports/broadcaster-reports.component';

@Component({
  selector: 'app-trai-report',
  templateUrl: './trai-report.component.html',
  styleUrls: ['./trai-report.component.scss']
})
export class TraiReportComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userservice: BaseService, private swal: SwalService, private router: Router, private storageservice: StorageService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {
  }

  step = signal(0);
  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }
  prevStep() {
    this.step.update(i => i - 1);
  }
  openPackageBaseDialogue(event: any) {
    console.log(event);
    let width = '600px';
    if (event == 'bouquetAlacarte') {
      width = '600px';
    }
    let dialogData = { type: event };
    const dialogRef = this.dialog.open(PackageBasedComponent, {
      width: width, // Updated width
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  openSubscriptionDialogue(event: any) {
    console.log(event);
    let width = '500px';
    if (event == 'weekly_based') {
      width = '500px';
    }
    let dialogData = { type: event };
    const dialogRef = this.dialog.open(SubscriptionBasedComponent, {
      width: width, // Updated width
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  openBroadcasterDialogue(event: any) {
    console.log(event);
    let width = '500px';
    // if (event == 'weekly_based') {
    //   width = '500px';
    // }
    let dialogData = { type: event };
    const dialogRef = this.dialog.open(BroadcasterReportsComponent, {
      width: width, // Updated width
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}
