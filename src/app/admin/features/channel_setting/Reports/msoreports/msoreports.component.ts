import { Component, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-msoreports',
  templateUrl: './msoreports.component.html',
  styleUrls: ['./msoreports.component.scss']
})
export class MsoreportsComponent {
   constructor(private route: ActivatedRoute, private userservice: BaseService, private swal: SwalService, private router: Router, private storageservice: StorageService, public dialog: MatDialog,) {
  
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
    this.router.navigate(['admin/msodialogueReports/'+ event]);
  }
}

