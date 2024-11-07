import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import { ProofdetailsComponent } from '../proofdetails/proofdetails.component';

@Component({
  selector: 'app-taxdetails',
  templateUrl: './taxdetails.component.html',
  styleUrls: ['./taxdetails.component.scss']
})
export class TaxdetailsComponent {

  taxname: any;
  taxapplicable: boolean = false;
  percentage: any;
  taxtype: any;

  editTaxname: any;
  editTaxapplicable: any;
  editPercentage: boolean = false;
  editTaxtype: any;
  isdelete = true;
  id: any;

  username: any;
  role: any;
  errorMessage: any;
  type: any;
  constructor(public dialogRef: MatDialogRef<ProofdetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(data);
    this.type = data.type
    this.editTaxname = data?.data?.taxname
    this.editTaxapplicable = data?.data?.taxapplicable
    this.editPercentage = data?.data?.percentage
    this.editTaxtype = data?.data?.taxtype
    this.isdelete = data?.data?.isdelete,
      console.log(this.isdelete);
    this.id = data?.data?.id
    console.log(this.editTaxname);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  createtax() {
    let requestBody = {
      taxname: this.taxname,
      taxapplicable: this.taxapplicable,
      percentage: this.percentage,
      taxtype: this.taxname,
      role: this.role,
      username: this.username
    }
    const errorFields = ['percentage', 'taxapplicable', 'taxname', 'taxtype'];
    this.swal.Loading()
    this.userservice.createTax(requestBody).subscribe(
      (res: any) => {
        this.swal.success(res.message);
      },
      (err) => {
        const errorMessage =
          errorFields
            .map(field => err?.error?.[field])
            .find(message => message) || 'An error occurred while creating the tax.';
        this.swal.Error(errorMessage);
      }
    );
  }

  updateTax() {
    let requestBody = {
      taxname: this.editTaxname,
      taxapplicable: this.editTaxapplicable,
      percentage: this.editPercentage,
      taxtype: this.editTaxtype,
      isdelete: this.isdelete,
      id: this.id,
      role: this.role,
      username: this.username
    }
    const errorFields = ['percentage', 'taxapplicable', 'taxname', 'taxtype', 'isdelete'];
    this.swal.Loading()
    this.userservice.updateTax(requestBody).subscribe(
      (res: any) => {
        this.swal.success(res.message);
      },
      (err) => {
        const errorMessage =
          errorFields
            .map(field => err?.error?.[field])
            .find(message => message) || 'An error occurred while creating the tax.';
        this.swal.Error(errorMessage);
      }
    );
  }
  edit(event: any) {
    console.log(event);

    console.log(this.taxapplicable);

  }
}
