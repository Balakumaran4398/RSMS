import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { Any } from 'node_modules1/@sigstore/protobuf-specs/dist/__generated__/google/protobuf/any';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
declare var $:any;

@Component({
  selector: 'app-update-ltb',
  templateUrl: './update-ltb.component.html',
  styleUrls: ['./update-ltb.component.scss']
})
export class UpdateLtbComponent implements OnInit,OnDestroy {
  isActive = false;
  opName: any;
  istax: boolean = true;
  isactive: boolean = false;
  opNameList: any[] = [];
  localPaymentChannelList: any;
  role: any;
  username: any;
  id: any;
  lcnno: any;
  updateTax: any;
  updateLcoPrice: any;

  filteredOperators: any[] = [];
  selectedOperator: any;
  selectedLcoName: any;


  constructor(
    public dialogRef: MatDialogRef<UpdateLtbComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService, private cdr: ChangeDetectorRef) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.localPaymentChannelList = data;
    this.id = data.id;
    this.lcnno = data.lcn;
    this.opName = data.operatorid;
    this.updateLcoPrice = data.lcoprice;
    this.updateTax = data.tax;
    console.log(this.opName);

    this.isactive = data.statusdisplay == 'Active' ? true : false;
    this.userService.getLocalChannelOperatorList(this.role, this.username).subscribe((data: any) => {
      this.opNameList = Object.keys(data).map(key => ({
        packagename: key,
        packageid: data[key]
      }));
      this.filteredOperators = this.opNameList;
      cdr.detectChanges();
    })
  }
  ngOnDestroy(): void {
    ($('#ltb') as any).select2('destroy');
  }
  ngOnInit(): void {
    $('#ltb').select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#ltb').on('change', (event: any) => {
      this.opName = event.target.value;
      this.onSubscriberStatusChange( this.opName);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  toggleStatus() {
    this.isActive = !this.isActive;
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      console.log('Selected file:', file);
      // You can now perform operations with the selected file, like uploading it to a server
    }
  }

  onChange() {
    this.userService.getLocalCreationAmountDetails(this.role, this.username, this.localPaymentChannelList?.channelrate, !this.istax).subscribe((data: any) => {
      this.updateTax = data.tax;
      this.updateLcoPrice = data.lcoprice;
      // this.localPaymentChannelList = data;
      this.cdr.detectChanges(); 
    })
  }
  submit() {
    this.swal.Loading();
    this.userService.updateLocalChannel(this.role, this.username, this.localPaymentChannelList?.channelid, this.opName, this.localPaymentChannelList?.tax, this.localPaymentChannelList?.lcoprice, this.lcnno, this.localPaymentChannelList?.channelrate, !this.istax, this.id, this.isactive)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  filterOperators(event: any): void {
    // const filterValue = event.target.value.toLowerCase();
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredOperators = this.opNameList.filter(operator =>
      operator.packagename.toLowerCase().includes(filterValue)
    );
  }
  displayOperator(operator: any): string {
    return operator ? operator.packagename : '';
  }
  onSubscriberStatusChange(selectedOperator: any) {
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
  }
}
