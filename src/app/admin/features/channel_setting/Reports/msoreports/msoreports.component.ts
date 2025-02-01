import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { LcoinvoiceComponent } from '../../../special_role/lcoinvoice/lcoinvoice.component';

@Component({
  selector: 'app-msoreports',
  templateUrl: './msoreports.component.html',
  styleUrls: ['./msoreports.component.scss']
})
export class MsoreportsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private userservice: BaseService, private swal: SwalService, private router: Router, private storageservice: StorageService, public dialog: MatDialog,) {

  }

  role: any;
  username: any;

  isshow: boolean = false;
  ngOnInit(): void {
    this.role = this.storageservice.getUserRole();
    this.username = this.storageservice.getUsername();

    this.userservice.getMsoDetails(this.role, this.username).subscribe((res: any) => {
      console.log(res);
      this.isshow = res.msoName == 'AJK' ? true : false;
    });
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

  openMsoDialog(event: any) {
    console.log(event);
    console.log(event);
    this.router.navigate(['admin/msodialogueReports/' + event]);
  }
  openLco() {
    const dialogRef = this.dialog.open(LcoinvoiceComponent, {
      // data: dialogData,
      // width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}

