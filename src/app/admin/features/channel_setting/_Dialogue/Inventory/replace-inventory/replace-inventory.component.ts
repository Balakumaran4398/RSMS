import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-replace-inventory',
  templateUrl: './replace-inventory.component.html',
  styleUrls: ['./replace-inventory.component.scss']
})
export class ReplaceInventoryComponent implements AfterViewInit, OnDestroy {
  smartcard: any;
  boxid: any;
  id: any;
  role: any;
  username: any;
  Smartcard_1: any;
  Boxid_1: any;
  userid: any;
  accessip: any;
  searchTerm: any;
  area: any;
  filteredSmartcard: any[] = [];
  operatorid: any;
  castype: any;
  constructor(
    public dialogRef: MatDialogRef<ReplaceInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService,) {
    this.id = data.id;
    this.smartcard = data.smartcard;
    this.boxid = data.boxid;
    this.Smartcard_1 = data.smartcard;
    this.Boxid_1 = data.boxid;
    console.log(this.Smartcard_1);
    console.log(this.Boxid_1);
    this.castype = data.castype;
    this.operatorid = data.operatorid;

    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
  }
  ngOnInit() {
    this.casTypelist();
  }
  ngAfterViewInit(): void {
    ($('#smartcard') as any).select2({
      placeholder: 'Select a Smartcard',
      allowClear: true
    });
    $('#smartcard').on('change', (event: any) => {
      this.smartcard = event.target.value;
      this.onSmartcardList(this.smartcard);
    });
  }
  ngOnDestroy(): void {
    ($('#smartcard') as any).select2('destroy');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  Replace(): void {
    this.userService.Defective_Replace_Allocated(this.role, this.username, this.id, this.smartcard, this.boxid).subscribe(
      (data: any) => {
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Replacement Successful',
          text: data?.message || 'The smartcard and box ID have been successfully replaced.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.dialogRef.close();
        });
      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Replacement Failed',
          text: error?.error?.message || 'There was an error processing the replacement. Please try again.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      }
    );
    const data = ` Smartcard: ${this.smartcard}, ` + ` BoxID: ${this.boxid},`;
    const remarks = ` Smartcard: ${this.Smartcard_1}, ` + ` BoxID: ${this.Boxid_1},`;
    this.logCreate('Replacement Button Clicked', remarks, data);

  }
  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  logCreate(action: any, remarks: any, data: any) {
    let requestBody = {
      access_ip: this.accessip,
      action: action,
      remarks: remarks,
      data: data,
      user_id: this.userid,
    }
    this.userService.createLogs(requestBody).subscribe((res: any) => {
      console.log(res);

    })
  }
  casTypelist() {
    // this.cdr.detectChanges;
    this.userService.getNotallocatedSmartcardListByCastypeAndOperatorid(this.role, this.username, this.operatorid, this.castype)
      .subscribe((data: any) => {
        if (data && Object.keys(data).length > 0) {
          this.area = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
          this.filteredSmartcard = this.area;
          console.log(this.filteredSmartcard);

        } else {
          this.area = [];
          Swal.fire({
            icon: 'warning',
            title: 'No Smartcards Available',
            text: data?.message || 'No smartcards found for the selected CAS type.',
            confirmButtonText: 'OK',
            // timer: 2000,
            // timerProgressBar: true,
            // showConfirmButton: false
          });

          // this.cdr.detectChanges;
        }
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Failed to fetch smartcard list. Please try again later.',
          confirmButtonText: 'OK',
          // timer: 2000,
          // timerProgressBar: true,
          // showConfirmButton: false
        });
      });

  }
  onSmartcardList(smartcard: any): void {
    console.log(smartcard);
    // this.selectedSmartcard = smartcard;
    // this.smartcard = smartcard.name;
    this.smartcard = smartcard;
    this.userService.getBoxidBySmartcard(this.role, this.username, this.smartcard)
      .subscribe((data: any) => {
        this.boxid = data.boxid;
        // this.cdr.detectChanges();
        let boxidElement: any = document.getElementById("boxid");
        if (boxidElement) {
          boxidElement.value = data;
        }
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  filteredIntendArea(): any[] {
    if (!this.searchTerm) {
      return this.area;
    }
    return this.area.filter((area: any) =>
      area.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
