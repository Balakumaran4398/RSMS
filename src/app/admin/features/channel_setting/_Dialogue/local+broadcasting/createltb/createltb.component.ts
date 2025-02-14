import { ChangeDetectorRef, Component, HostListener, Inject, OnInit,OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
declare var $: any;
@Component({
  selector: 'app-createltb',
  templateUrl: './createltb.component.html',
  styleUrls: ['./createltb.component.scss']
})
export class CreateltbComponent implements OnInit,OnDestroy {
  role: any;
  username: any;
  opNameList: any[] = [];
  chNameList: any[] = [];
  opName: any = 0;
  channel: any = 0;
  lcnNo: any;
  chRate: any;
  istax: boolean = false;
  tax: any;
  lcoprice: any;
  updateTax: string = '0.0';
  updateLcoPrice: string = '0.0';


  filteredOperators: any[] = [];
  filteredChannels: any[] = [];
  selectedOperator: any;
  selectedLcoName: any;
  selectedChannel: any;
  selectedChannelName: any;

  constructor(
    public dialogRef: MatDialogRef<CreateltbComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: BaseService, private storageService: StorageService, private swal: SwalService, private cdr: ChangeDetectorRef) {
    console.log('Data received:', data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    console.log(data);
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    location.reload(); 
  }
  ngOnInit(): void {

    this.channelList();
    this.ltbList();
  }
  ngOnDestroy(): void {
    ($('#channel') as any).select2('destroy');
    ($('#ltb') as any).select2('destroy');
  }
  ngAfterViewInit() {
    $('#channel').select2({
      placeholder: 'Select Change Name',
      allowClear: true
    });
    $('#channel').on('change', (event: any) => {
      this.channel = event.target.value;
      this.onChannelStatusChange(this.channel);
    });
    $('#ltb').select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#ltb').on('change', (event: any) => {
      this.opName = event.target.value;
      this.onSubscriberStatusChange( this.opName);
    });
  }
  channelList() {
    this.userService.getLocalChannelList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.chNameList = Object.keys(data).map(key => ({
        channelname: key,
        channelid: data[key]
      }));
      this.filteredChannels = this.chNameList;
      console.log(this.chNameList);

    })
  }
  ltbList() {
    this.userService.getLocalChannelOperatorList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.opNameList = Object.keys(data).map(key => ({
        packagename: key,
        packageid: data[key]
      }));
      this.filteredOperators = this.opNameList;
      console.log(this.opNameList);
      this.opName= this.opNameList.map((item: any) => item);
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onChange() {
    this.userService.getLocalCreationAmountDetails(this.role, this.username, this.chRate, !this.istax).subscribe((data: any) => {
      this.updateTax = data.tax;
      this.updateLcoPrice = data.lcoprice;
      this.cdr.detectChanges();
    })

  }
  submit() {
    this.swal.Loading();
    this.userService.createLocalChannel(this.role, this.username, this.channel, this.opName, this.updateTax, this.updateLcoPrice, this.lcnNo, this.chRate, this.istax)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.opNameList.filter(operator =>
      operator.packagename.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredOperators);
  }

  filterChannels(event: any): void {
    console.log(event.target.value);

    const filterValue = event.target.value.toLowerCase();
    this.filteredChannels = this.chNameList.filter(channel =>
      channel.channelname.toLowerCase().includes(filterValue)
    );
    console.log(this.filteredChannels);
  }
  displayOperator(operator: any): string {
    return operator ? operator.name : '';
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    console.log(this.selectedLcoName);
  }


  displayChannel(channel: any): string {
    return channel ? channel.name : '';
  }
  onChannelStatusChange(selectedLcoName: any) {
    console.log(selectedLcoName);
    this.selectedChannel = selectedLcoName;
    this.selectedChannelName = selectedLcoName.channelname;
    console.log(this.selectedChannelName);
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
