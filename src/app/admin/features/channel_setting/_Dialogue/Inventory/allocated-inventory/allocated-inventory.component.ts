import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allocated-inventory',
  templateUrl: './allocated-inventory.component.html',
  styleUrls: ['./allocated-inventory.component.scss']
})
export class AllocatedInventoryComponent {
  role: any;
  username: any;
  rowData: any;
  smartcard: any;
  boxid: any;
  castype: any[] = [];
  castype1: any[] = [{
    "id": 6,
    "name": "ICAS"
  }];
  // lco_list: { [key: string]: number } = {};
  lco_list: any[] = [];
  operatorid: { [key: string]: number } = {};
  selectedCasType: any = 0;
  selectedLcoName: any;
  searchTerm: string = '';
  key: any;
  filteredOperators: any[] = [];
  selectedOperator: any;
  submitted: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AllocatedInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService) {
    console.log('Data received:', data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(data);
    // this.castype = data.castype;
    this.castype = data.castype;
    console.log(this.castype);

    this.lco_list = data.lco_list;
    console.log(this.castype);
    this.filteredOperators = this.lco_list;

  }

  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.lco_list.filter(operator =>
      operator.name.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);

  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onCasChange() {
    this.userService.getAllocationMsoSmartcardListByCastype(this.role, this.username, this.selectedCasType).subscribe(
      (res: any) => {
        // this.returndata = res;
        console.log(res);
        this.smartcard = res.smartcard;
        this.boxid = res.boxid;

        // this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    console.log(this.selectedLcoName);

    // this.userService.getAllocationMsoSmartcardListByCastype(this.role, this.username, this.selectedCasType).subscribe(
    //   (res: any) => {
    //     // this.returndata = res;
    //     console.log(res);

    //     // this.swal.success(res?.message);
    //   }, (err) => {
    //     // this.swal.Error(err?.error?.message);
    //   });
  }
  // filteredLcoKeys(): string[] {
  //   const keys = Object.keys(this.lco_list);
  //   if (!this.searchTerm) {
  //     return keys;
  //   }
  //   return keys.filter(key =>
  //     key.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }
  // filteredCasKeys(): string[] {
  //   const keys = Object.keys(this.castype);
  //   if (!this.searchTerm) {
  //     return keys;
  //   }
  //   return keys.filter(cas =>
  //     cas.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }
  onKeydown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }



  submit() {
    this.submitted = true;
    console.log(this.selectedLcoName);
    console.log(this.selectedCasType);
    console.log(this.smartcard);
    console.log(this.boxid);

    if (!this.selectedLcoName || !this.selectedCasType || !this.smartcard || !this.boxid) {
      return;
    }
    this.swal.Loading();
    this.userService.Create_Allocated(
      this.selectedLcoName,
      this.selectedCasType,
      this.smartcard,
      this.boxid,
      this.role,
      this.username
    ).subscribe((data: any) => {
      this.swal.success(data?.message);
    }, (error: any) => {
      this.swal.Error(error?.error?.message || error?.error?.['createnewsmartcardallocation.boxid']);

    });
  }

}
