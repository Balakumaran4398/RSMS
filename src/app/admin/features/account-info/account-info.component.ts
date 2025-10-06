import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  smartcard: any;
  role: any;
  username: any;
  constructor(private storageService: StorageService, private userService: BaseService, private swal: SwalService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  onSubmit() {
    console.log(this.smartcard);
    this.swal.Loading();

    this.userService.getupdateAccountInformationIcas(this.role, this.username, this.smartcard).subscribe({
      next: (res: any) => {
        console.log(res);
        this.swal.Success_200();
      },
      error: (err: any) => {
        console.error(err);
        let errorMessage = "Something went wrong. Please try again.";
        if (err?.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (typeof err.error === 'object') {
            const firstKey = Object.keys(err.error)[0];
            errorMessage = err.error[firstKey] || errorMessage;
          }
        }

        this.swal.Error(errorMessage);
      }
    });
  }

}
