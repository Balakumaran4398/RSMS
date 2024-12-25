import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SubscriberdialogueComponent } from '../subscriberdialogue/subscriberdialogue.component';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';
import { ChannellistComponent } from '../channellist/channellist.component';
import { SwalService } from 'src/app/_core/service/swal.service';
import { LcologinpageComponent } from '../lcologinpage/lcologinpage.component';
interface requestBodylogs {
  access_ip: any;
  action: any;
  remarks: any;
  data: any;

}
@Component({
  selector: 'app-sub-dashboard',
  templateUrl: './sub-dashboard.component.html',
  styleUrls: ['./sub-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubDashboardComponent implements OnInit, AfterViewInit {
  role: any;
  checkingObj: any = {};
  username: any;
  subscriberid: any;
  subscribersubid: any;
  status: any;
  statusNewSmartcard: any;
  smartcardsubid: any;
  smartcard: any;
  subid: any;
  smartdetailList: any;
  subdetailsList: any;
  subdetails: any;
  statusdisplay: any;
  subPairedboxid: any[] = [];
  subPairedsmartcard: any[] = [];
  subscriberaccounts: any[] = [];
  message: any;
  packageobject: any;
  packageMessage: any;
  packdateobj: any;
  selectedmanpacknotexp: any;
  smartcardinfo: any;
  plantype: any;
  f_date: any;
  rechargetype: any;
  selectedRechargetype: any = 0;
  datetype = false;
  isDisabled: boolean = true;
  isplantype = false;
  dateTodate = 3;
  gridApi: any;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  rows: any[] = [];
  isAnyRowSelected: boolean = false;
  gridOptions = {
    defaultColDef: {
      // width: 205
    },
    rowClassRules: {
      'always-selected': (params: any) => params.data.type === 1,
    },
    onFirstDataRendered: (params: { api: { forEachNode: (arg0: (node: any) => void) => void; }; }) => {
      this.selectRowsBasedOnUsername(params);
    },
  }


  gridOptions2 = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      floatingFilter: true
    },
    paginationPageSize: 3,
    pagination: true,
  }
  selectRowsBasedOnUsername(params: { api: { forEachNode: (arg0: (node: any) => void) => void; }; }) {
    params.api.forEachNode((node) => {
      if (node.data.ptype === 'BASE') {
        node.setSelected(true);
      }
    });
  }
  refreshButton: any[] = [];
  logindetails: boolean = true;
  casform: boolean = true;
  editDetails: boolean = true;
  ConfirmationReport: boolean = true;

  iscollected = false;
  subscrierdashoard: boolean = false;
  newsubscrierdashoard: boolean = false;
  subscriersmartcarddashoard: boolean = false;
  expandale: boolean = false;
  addon: boolean = false;
  alacarte: boolean = false;
  remove: boolean = false;
  base: boolean = false;
  rechargeType: boolean = false;
  managePackagetable = false;
  managePackagetable1 = false;

  subdashoard: any;
  newdashoard: any;
  subsmartcarddashoard: any;


  selectedTab: any = 'BASE';
  confirmation: boolean = false;
  isConfirmationComplete = false;
  isRecharge = false;
  activeItem: any;
  step = signal(0);

  cancelsubscription: boolean = false;
  block: boolean = false;
  pair: boolean = false;
  unpair: boolean = false;
  suspend: boolean = false;
  forcetuning: boolean = false;
  deletemessage: boolean = false;
  sendmessage: boolean = false;
  pvrchange: boolean = false;
  pinchange: boolean = false;
  deactive: boolean = false;
  activation: boolean = false;
  packagectivation: boolean = false;
  refresh: boolean = false;
  reactivation: boolean = false;
  resumechange: boolean = false;
  boxchange: boolean = false;
  smartcardchange: boolean = false;
  plantypeSubject = new BehaviorSubject<{ [key: string]: number }>({});
  // plantype$ = this.plantypeSubject.asObservable();
  plantype$ = new BehaviorSubject<{ key: string, value: number }[]>([]);
  packagePlan: any;
  billtype: number = 0;
  boxid: any;
  smartcardValue: any;
  newOperatorContact: any;
  newSmartcard: any;
  progress = {
    success: 0,
    info: 0,
    warning: 0,
    danger: 0
  };
  daysText = '';

  public rowSelection: any = "multiple";
  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }

  prevStep() {
    this.step.update(i => i - 1);
  }
  constructor(private route: ActivatedRoute, private userservice: BaseService, private swal: SwalService, private router: Router, private storageservice: StorageService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.subscriberid = this.route.snapshot.paramMap.get('smartcard');
    this.subscribersubid = this.route.snapshot.paramMap.get('subid');
    this.status = this.route.snapshot.paramMap.get('status');
    this.loaddata()
    console.log(this.subscriberid);
    console.log(this.status);

    let splitValues = this.subscriberid.split("**");

    this.boxid = splitValues[1];
    this.smartcardValue = splitValues[0];
    console.log('SUBID', this.subscribersubid);
    console.log("Box ID:", this.boxid);
    console.log("Smartcard Value:", this.smartcardValue);
    this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      this.rechargetype = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.rechargetype);
      this.cdr.detectChanges;
    })
  }
  ngAfterViewInit(): void {

  }
  onBillTypeChange() {
    this.billtype = this.billtype ? 1 : 0;
  }

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
    }
  }

  ngOnInit(): void {
    this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      this.plantypeSubject.next(data);
      this.packagePlan = data;
      const sortedData = Object.entries(data)
        .map(([key, value]) => ({
          key: key.replace(/\(\d+\)/, '').trim(),
          value: value as number
        }))

      this.plantype$.next(sortedData);
    });
    // this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
    //   this.rechargetype = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
    //   console.log(this.rechargetype);
    //   this.cdr.detectChanges;
    // })
    // this.calculateProgress();
  }
  loadNewDashboard() {
    // for (let index = 0; index < 2; index++) {
    this.userservice.getNewsubscriberDetails(this.role, this.username, this.subscriberid || this.smartcard || this.boxid)
      .subscribe((data: any) => {
        console.log(data);
  
        this.newSmartcard = data.smartcardlist?.[data.smartcardlist.length - 1]?.smartcard || null;;
        this.statusNewSmartcard = data.smartcardlist?.[data.smartcardlist.length - 1]?.statusdisplay || null;;
        console.log(this.newSmartcard);
        console.log(this.statusNewSmartcard);
        if (this.statusNewSmartcard === 'Active') {
          console.log(this.statusNewSmartcard);
          this.newsubscrierdashoard = true;
          this.subscriersmartcarddashoard = true;
          this.expandale = true;
          this.loadNewSmartcardDashboard();
        }
        if (this.statusNewSmartcard === 'New') {
          console.log(this.statusNewSmartcard);
          this.newsubscrierdashoard = true;
          this.subscriersmartcarddashoard = true;
          this.expandale = true;
          this.loadNewSmartcardDashboard();
        }
        this.newOperatorContact = data.opcontact;
        console.log(this.newOperatorContact);
        this.newsubscrierdashoard = !this.newsubscrierdashoard;
        this.rowData = data['smartcardlist'];
        this.rowData1 = data['managepacklist_notexp'];
        this.subdetailsList = data['subscriberdetails'];
        this.subdetails = data['subdetails'];
        console.log('subdetails', this.subdetails);
        console.log('subscriberdetails', this.subdetailsList.statusdislay);
        this.subid = this.subdetailsList.subid;
        this.smartcard = this.subdetailsList.smartcard;
        console.log(this.subid);
        console.log(this.smartcard);

        // this.loadNewSmartcardDashboard();

        this.cdr.detectChanges();
      }, (error) => {
        console.error('Error fetching new dashboard data:', error);
      });
    this.logindetails = false;
    this.casform = true;
    this.editDetails = true;
    this.ConfirmationReport = false;
    // }
  }

  loaddata() {
    if (this.status === 'new') {
      this.newsubscrierdashoard = true;
      this.subscriersmartcarddashoard = false;
      this.expandale = false;
      this.loadNewDashboard();
    }
    else if (this.status === 'dashoard') {
      this.newsubscrierdashoard = true;
      this.subscriersmartcarddashoard = true;
      this.expandale = true;
      this.loadSubscriberDashboard();
    }
    else if (this.status === 'subsmartcard') {
      this.newsubscrierdashoard = true;
      this.subscriersmartcarddashoard = true;
      this.expandale = true;
      this.loadSmartcardDashboard();
    }
  }


  loadSubscriberDashboard() {
    // for (let index = 0; index < 2; index++) {
    this.userservice.getQuickOperationDetailsBySearchname(this.role, this.username, (this.subscriberid || this.smartcardValue || this.boxid)).subscribe(
      (data: any) => {
        console.log(data);
        this.packageobject = data['packageobject'];
        this.packageMessage = data['message'];
        console.log(this.packageMessage);

        this.packdateobj = data['packdateobj'];
        this.rowData1 = data['managepacklist_notexp'];
        console.log(this.rowData1);
        this.rowData = data['smartcardlist'];
        this.subdetailsList = data['subscriberdetails']
        this.statusdisplay = this.subdetailsList.statusdisplay
        console.log('subscriberdetails', this.subdetailsList.statusdislay);

        this.smartdetailList = data['smartcardlist']
        this.subscriberaccounts = data['subscriberaccounts'];
        this.smartcardinfo = data['smartcardinfo'];
        this.subPairedboxid = data['pairedboxid'];
        console.log(this.subPairedboxid);
        this.subdetails = data['subdetails'];
        console.log('subdetails', this.subdetails);
        this.subPairedsmartcard = data['pairedsmartcard'];
        console.log(this.subPairedsmartcard);
        this.message = data['message'];

        console.log(this.subdetailsList);
        if (this.subdetailsList) {
          let item = this.subdetailsList
          // if (!item.boxstatus && (item.showPairUnpair || item.status != 0)) {
          //   this.packagectivation = true;
          // } else {
          //   this.packagectivation = false;
          // }
          if (!item.boxstatus) {
            console.log('first condition ok');
            if (!item.showPairUnpair || item.status == 0) {
              console.log('second condition ok');
              this.packagectivation = false;
            } else {
              console.log('third condition ok');

              this.packagectivation = true;
            }
          } else {
            console.log('last condition ok');

            this.packagectivation = false;
          }
          if (!item.boxstatus && !item.suspendstatus && item.status === 2) {
            this.activation = false;
          } else {
            this.activation = true;
          }
          if (!item.boxstatus && item.status != 0) {
            this.refresh = false;
          } else {
            this.refresh = true;
          }
          if (!item.boxstatus) {
            if ((item.status != 1 || item.suspendstatus == 1)) {
              console.log('dd');
              console.log(this.pinchange);
              this.pinchange = true;
              this.pvrchange = true;
              this.sendmessage = true;
              this.deletemessage = true;
              this.forcetuning = true;

            } else {
              this.pinchange = false;
              this.pvrchange = false;
              this.sendmessage = false;
              this.deletemessage = false;
              this.forcetuning = false;
            }
          }
          else {
            this.pinchange = true;
            this.pvrchange = true;
            this.sendmessage = true;
            this.deletemessage = true;
            this.forcetuning = true;
            console.log("this.pinchange", this.pinchange);
          }
          if (!item.boxstatus) {
            if (item.suspendstatus != 1 || item.showPairUnpair) {
              console.log('smartcardchange   ', this.smartcardchange);
              console.log('boxchange   ', this.boxchange);
              this.smartcardchange = false;
              this.boxchange = false;
            } else {
              this.smartcardchange = true;
              this.boxchange = true;
            }
          } else {
            this.smartcardchange = false;
            this.boxchange = false;
          }

          if (!item.boxstatus) {
            console.log('Status:', item.status);
            console.log('Suspend Status:', item.suspendstatus);
            console.log('Suspend State:', item.statussuspend);
            console.log('Number of Days:', item.noofdays);
            if (item.noofdays != 0 && (item.status == 1 || item.suspendstatus != 1) && !item.statussuspend) {
              this.suspend = false;
              console.log('correct');
            } else {
              this.suspend = true;
              console.log('wrong');
            }
          }
          else {
            this.suspend = true;
          }

          if (!item.boxstatus) {
            console.log('item.status', item.status + '         tem.suspendstatus', item.suspendstatus)
            if (item.status != 1 || item.suspendstatus == 1) {
              console.log('ffd', this.reactivation);
              this.reactivation = true;
            } else {
              this.reactivation = false;
            }
          } else {
            this.reactivation = false;
          }

          if (item.status != 1 || item.suspendstatus == 1) {
            console.log('Block', this.block);

            this.block = true;
          } else {
            this.block = false;
          }
          if ((!item.boxstatus && item.package_status === "Not Expired") && (item.status === 1 || item.suspendstatus != 1)) {
            console.log("cancel --" + this.cancelsubscription);
            this.cancelsubscription = false;
          } else {
            this.cancelsubscription = true;
          }

          if (!item.boxstatus) {
            if (item.suspendstatus == 1 || !item.statusSus) {
              this.resumechange = false;
            } else {
              this.resumechange = true;
            }
          } else {
            this.resumechange = false;
          }
          if (!item.boxstatus) {
            if (item.suspendstatus != 1 || item.statusSus) {
              this.resumechange = true;
            } else {
              this.resumechange = false;
            }
          } else {
            this.resumechange = false;
          }
          if (item.castypedisplay && !item.showPairUnpair) {
            if (item.suspendstatus == 1) {
              console.log('pair', this.pair);
              this.pair = true;
            } else {
              this.pair = false;
            }
          } else {
            this.pair = true;
          }
          if (item.castypedisplay && item.showPairUnpair) {
            if (item.suspendstatus == 1) {
              console.log('unpair', this.unpair);
              this.unpair = true;
            } else {
              this.unpair = false;
            }
          } else {
            this.unpair = true;
          }
          if (!item.boxstatus && item.status === 1 && !item.statussuspend) {
            this.deactive = false;
          } else {
            this.deactive = true;
          }
          if (!item.boxstatus || item.status === 0) {
            if (item.status != 2 && item.statusdisplay == 'New') {
              this.expandale = false;
            } else {
              this.expandale = true;
            }
          } else {
            this.expandale = false;
          }

          if (!item.boxstatus || item.status == 0) {
            if (item.noofdays < 1) {
              this.addon = true;
              this.alacarte = true;
              this.remove = true;
            } else {
              this.addon = false;
              this.alacarte = false;
              this.remove = false;
            }
          } else {
            this.addon = true;
            this.alacarte = true;
            this.remove = true;
          }
          if (this.statusdisplay == 'Deactive') {
            this.base = true;
            this.rechargeType = true;
          } else {
            this.base = false;
            this.rechargeType = false;
          }
          if (item.boxstatus) {
            console.log('Blocked', item.boxstatus);
            this.packagectivation = true;
            this.activation = true;
            this.refresh = true;
            this.pinchange = true;
            this.pvrchange = true;
            this.sendmessage = true;
            this.deletemessage = true;
            this.forcetuning = true;
            this.smartcardchange = true;
            this.boxchange = true;
            this.suspend = true;
            this.resumechange = true;
            this.reactivation = true;
            this.cancelsubscription = true;
            this.block = true;
            this.deactive = true;
          }

          if (item.baseplan) {
            // console.log('fgfdgfdgfdg', item.baseplan);
            this.managePackagetable = false;
            this.managePackagetable1 = true;
          } else {
            this.managePackagetable = true;
            this.managePackagetable1 = false;
          }
        }

        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  loadNewSmartcardDashboard() {
    for (let index = 0; index < 2; index++) {
      this.userservice.getQuickOperationDetailsBySmartcard(this.role, this.username, this.newSmartcard).subscribe(
        (data: any) => {
          this.cdr.detectChanges();
          console.log(data);
          this.packageobject = data['packageobject'];
          this.packdateobj = data['packdateobj'];
          this.packageMessage = data['message'];
          console.log(this.packageMessage);
          // this.rowData1 = data['selectedmanpacknotexp'];
          this.rowData1 = data['managepacklist_notexp'];
          this.rowData = data['smartcardlist'];
          this.subdetailsList = data['subscriberdetails']
          this.smartdetailList = data['smartcardlist']
          this.subscriberaccounts = data['subscriberaccounts'];
          this.smartcardinfo = data['smartcardinfo'];
          this.subPairedboxid = data['pairedboxid'];
          console.log(this.subPairedboxid);
          this.subdetails = data['subdetails'];
          this.statusdisplay = this.subdetailsList.statusdisplay
          console.log('subscriberdetails', this.subdetailsList);
          console.log('statusdisplay', this.statusdisplay);
          // console.log('subdetails', this.subdetails);
          // this.subPairedsmartcard = data['pairedsmartcard'];
          this.subPairedsmartcard = data['pairedsmartcard'];
          console.log(this.subPairedsmartcard);
          this.message = data['message'];
          if (this.subdetailsList) {
            let item = this.subdetailsList
            if (!item.boxstatus) {
              console.log('first condition ok');
              if (!item.showPairUnpair || item.status == 0) {
                console.log('second condition ok');
                this.packagectivation = false;
              } else {
                console.log('third condition ok');

                this.packagectivation = true;
              }
            } else {
              console.log('last condition ok');

              this.packagectivation = false;
            }
            if (!item.boxstatus && !item.suspendstatus && item.status === 2) {
              this.activation = false;
            } else {
              this.activation = true;
            }
            if (!item.boxstatus && item.status != 0) {
              this.refresh = false;
            } else {
              this.refresh = true;
            }
            if (!item.boxstatus) {
              if ((item.status != 1 || item.suspendstatus == 1)) {
                console.log('dd');
                console.log(this.pinchange);
                this.pinchange = true;
                this.pvrchange = true;
                this.sendmessage = true;
                this.deletemessage = true;
                this.forcetuning = true;

              } else {
                this.pinchange = false;
                this.pvrchange = false;
                this.sendmessage = false;
                this.deletemessage = false;
                this.forcetuning = false;
              }
            }
            else {
              this.pinchange = true;
              this.pvrchange = true;
              this.sendmessage = true;
              this.deletemessage = true;
              this.forcetuning = true;
              console.log("this.pinchange", this.pinchange);
            }
            if (!item.boxstatus) {
              if (item.suspendstatus != 1 || item.showPairUnpair) {
                console.log('smartcardchange   ', this.smartcardchange);
                console.log('boxchange   ', this.boxchange);
                this.smartcardchange = false;
                this.boxchange = false;
              } else {
                this.smartcardchange = true;
                this.boxchange = true;
              }
            } else {
              this.smartcardchange = false;
              this.boxchange = false;
            }

            // if (!item.boxstatus) {
            //   console.log('item.status', item.status + '         tem.statussuspend', item.statussuspend, '   item.suspendstatus ', item.suspendstatus, "    item.noofdays  ", item.noofdays);
            //   if ((item.status != 1 || item.suspendstatus == 1) || !item.statussuspend || item.noofdays <= 1) {
            //     console.log('suspend', this.suspend);
            //     this.suspend = true;
            //   } else {
            //     this.suspend = false;
            //   }
            // } else {
            //   this.suspend = false;
            // }




            // if (!item.boxstatus) {
            //   console.log(item.noofdays);
            //   if ((item.statusdisplay == 'Active' || (item.noofdays > 1))) {
            //     this.suspend = false;
            //   } else {
            //     this.suspend = true;
            //   }
            // } else {
            //   this.suspend = false;
            // }
            if (!item.boxstatus) {
              console.log('Status:', item.status);
              console.log('Suspend Status:', item.suspendstatus);
              console.log('Suspend State:', item.statussuspend);
              console.log('Number of Days:', item.noofdays);
              if (item.noofdays != 0 && (item.status == 1 || item.suspendstatus != 1) && !item.statussuspend) {
                this.suspend = false;
                console.log('correct');
              } else {
                this.suspend = true;
                console.log('wrong');
              }
            }
            else {
              this.suspend = true;
            }

            if (!item.boxstatus) {
              console.log('item.status', item.status + '         tem.suspendstatus', item.suspendstatus)
              if (item.status != 1 || item.suspendstatus == 1) {
                console.log('ffd', this.reactivation);
                this.reactivation = true;
              } else {
                this.reactivation = false;
              }
            } else {
              this.reactivation = false;
            }

            if (item.status == 1 || item.suspendstatus == 1) {
              console.log('Block', this.block);

              this.block = true;
            } else {
              this.block = false;
            }
            if ((!item.boxstatus && item.package_status === "Not Expired") && (item.status === 1 || item.suspendstatus != 1)) {
              console.log("cancel --" + this.cancelsubscription);

              this.cancelsubscription = false;
            } else {
              this.cancelsubscription = true;
            }

            if (!item.boxstatus) {
              if (item.suspendstatus != 1 || item.statusSus) {
                this.resumechange = true;
              } else {
                this.resumechange = false;
              }
            } else {
              this.resumechange = false;
            }
            if (item.castypedisplay && !item.showPairUnpair) {
              if (item.suspendstatus == 1) {
                console.log('pair', this.pair);
                this.pair = true;
              } else {
                this.pair = false;
              }
            } else {
              this.pair = true;
            }
            if (item.castypedisplay && item.showPairUnpair) {
              if (item.suspendstatus == 1) {
                console.log('unpair', this.unpair);
                this.unpair = true;
              } else {
                this.unpair = false;
              }
            } else {
              this.unpair = true;
            }
            if (!item.boxstatus && item.status === 1 && !item.statussuspend) {
              this.deactive = false;
            } else {
              this.deactive = true;
            }
            if (!item.boxstatus || item.status === 0) {
              if (item.status != 2 && item.statusdisplay == 'New') {
                this.expandale = false;
              } else {
                this.expandale = true;
              }
            } else {
              this.expandale = false;
            }

            if (!item.boxstatus || item.status == 0) {
              if (item.noofdays < 1) {
                this.addon = true;
                this.alacarte = true;
                this.remove = true;
              } else {
                this.addon = false;
                this.alacarte = false;
                this.remove = false;
              }
            } else {
              this.addon = true;
              this.alacarte = true;
              this.remove = true;
            }
            if (this.statusdisplay == 'Deactive') {
              this.base = true;
              this.rechargeType = true;
            } else {
              this.base = false;
              this.rechargeType = false;
            }
            if (item.boxstatus) {
              console.log('Blocked', item.boxstatus);
              this.packagectivation = true;
              this.activation = true;
              this.refresh = true;
              this.pinchange = true;
              this.pvrchange = true;
              this.sendmessage = true;
              this.deletemessage = true;
              this.forcetuning = true;
              this.smartcardchange = true;
              this.boxchange = true;
              this.suspend = true;
              this.resumechange = true;
              this.reactivation = true;
              this.cancelsubscription = true;
              this.block = true;
              this.deactive = true;
            }
            if (item.baseplan) {
              // console.log('fgfdgfdgfdg', item.baseplan);
              this.managePackagetable = false;
              this.managePackagetable1 = true;
            } else {
              this.managePackagetable = true;
              this.managePackagetable1 = false;
            }
          }

        },
        (error: any) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }

  loadSmartcardDashboard() {
    for (let index = 0; index < 2; index++) {
      this.userservice.getQuickOperationDetailsBySmartcard(this.role, this.username, (this.smartcard || this.subscriberid || this.boxid)).subscribe(
        (data: any) => {
          this.cdr.detectChanges();
          console.log(data);
          this.packageobject = data['packageobject'];
          this.packdateobj = data['packdateobj'];
          this.packageMessage = data['message'];
          console.log(this.packageMessage);
          // this.rowData1 = data['selectedmanpacknotexp'];
          this.rowData1 = data['managepacklist_notexp'];
          this.rowData = data['smartcardlist'];
          this.subdetailsList = data['subscriberdetails']
          this.smartdetailList = data['smartcardlist']
          this.subscriberaccounts = data['subscriberaccounts'];
          this.smartcardinfo = data['smartcardinfo'];
          this.subPairedboxid = data['pairedboxid'];
          console.log(this.subPairedboxid);
          this.subdetails = data['subdetails'];
          this.statusdisplay = this.subdetailsList.statusdisplay
          console.log('subscriberdetails', this.subdetailsList);
          console.log('statusdisplay', this.statusdisplay);
          // console.log('subdetails', this.subdetails);
          // this.subPairedsmartcard = data['pairedsmartcard'];
          this.subPairedsmartcard = data['pairedsmartcard'];
          console.log(this.subPairedsmartcard);
          this.message = data['message'];





          if (this.subdetailsList) {
            let item = this.subdetailsList
            // if (!item.boxstatus && (item.showPairUnpair || item.status != 0)) {
            //   this.packagectivation = true;
            // } else {
            //   this.packagectivation = false;
            // }
            // if (!item.boxstatus) {
            //   if (item.showPairUnpair || item.status != 0) {
            //     this.packagectivation = false;
            //   } else {
            //     this.packagectivation = true;
            //   }
            // } else {
            //   this.packagectivation = false;
            // }


            if (!item.boxstatus) {
              console.log('first condition ok');
              if (!item.showPairUnpair || item.status == 0) {
                console.log('second condition ok');
                this.packagectivation = false;
              } else {
                console.log('third condition ok');

                this.packagectivation = true;
              }
            } else {
              console.log('last condition ok');

              this.packagectivation = false;
            }
            if (!item.boxstatus && !item.suspendstatus && item.status === 2) {
              this.activation = false;
            } else {
              this.activation = true;
            }
            if (!item.boxstatus && item.status != 0) {
              this.refresh = false;
            } else {
              this.refresh = true;
            }
            if (!item.boxstatus) {
              if ((item.status != 1 || item.suspendstatus == 1)) {
                console.log('dd');
                console.log(this.pinchange);
                this.pinchange = true;
                this.pvrchange = true;
                this.sendmessage = true;
                this.deletemessage = true;
                this.forcetuning = true;

              } else {
                this.pinchange = false;
                this.pvrchange = false;
                this.sendmessage = false;
                this.deletemessage = false;
                this.forcetuning = false;
              }
            }
            else {
              this.pinchange = true;
              this.pvrchange = true;
              this.sendmessage = true;
              this.deletemessage = true;
              this.forcetuning = true;
              console.log("this.pinchange", this.pinchange);
            }
            if (!item.boxstatus) {
              if (item.suspendstatus != 1 || item.showPairUnpair) {
                console.log('smartcardchange   ', this.smartcardchange);
                console.log('boxchange   ', this.boxchange);
                this.smartcardchange = false;
                this.boxchange = false;
              } else {
                this.smartcardchange = true;
                this.boxchange = true;
              }
            } else {
              this.smartcardchange = false;
              this.boxchange = false;
            }


            if (!item.boxstatus) {
              console.log('Status:', item.status);
              console.log('Suspend Status:', item.suspendstatus);
              console.log('Suspend State:', item.statussuspend);
              console.log('Number of Days:', item.noofdays);
              if (item.noofdays != 0 && (item.status == 1 || item.suspendstatus != 1) && !item.statussuspend) {
                this.suspend = false;
                console.log('correct');
              } else {
                this.suspend = true;
                console.log('wrong');
              }
            }
            else {
              this.suspend = true;
            }


            if (!item.boxstatus) {
              console.log('item.status', item.status + '         tem.suspendstatus', item.suspendstatus)
              if (item.status != 1 || item.suspendstatus == 1) {
                console.log('ffd', this.reactivation);
                this.reactivation = true;
              } else {
                this.reactivation = false;
              }
            } else {
              this.reactivation = false;
            }

            if (item.status == 1 || item.suspendstatus == 1) {
              console.log('Block', this.block);

              this.block = true;
            } else {
              this.block = false;
            }
            if ((!item.boxstatus && item.package_status === "Not Expired") && (item.status === 1 || item.suspendstatus != 1)) {
              console.log("cancel --" + this.cancelsubscription);

              this.cancelsubscription = false;
            } else {
              this.cancelsubscription = true;
            }

            if (!item.boxstatus) {
              if (item.suspendstatus != 1 || item.statusSus) {
                this.resumechange = true;
              } else {
                this.resumechange = false;
              }
            } else {
              this.resumechange = false;
            }
            if (item.castypedisplay && !item.showPairUnpair) {
              if (item.suspendstatus == 1) {
                console.log('pair', this.pair);
                this.pair = true;
              } else {
                this.pair = false;
              }
            } else {
              this.pair = true;
            }
            if (item.castypedisplay && item.showPairUnpair) {
              if (item.suspendstatus == 1) {
                console.log('unpair', this.unpair);
                this.unpair = true;
              } else {
                this.unpair = false;
              }
            } else {
              this.unpair = true;
            }
            if (!item.boxstatus && item.status === 1 && !item.statussuspend) {
              this.deactive = false;
            } else {
              this.deactive = true;
            }
            if (!item.boxstatus || item.status == 0) {
              if (item.status != 2 && item.statusdisplay == 'New') {
                this.expandale = false;
              } else {
                this.expandale = true;
              }
            } else {
              this.expandale = false;
            }

            if (!item.boxstatus || item.status == 0) {
              if (item.noofdays < 1) {
                this.addon = true;
                this.alacarte = true;
                this.remove = true;
              } else {
                this.addon = false;
                this.alacarte = false;
                this.remove = false;
              }
            } else {
              this.addon = true;
              this.alacarte = true;
              this.remove = true;
            }
            if (this.statusdisplay == 'Deactive') {
              this.base = true;
              this.rechargeType = true;
            } else {
              this.base = false;
              this.rechargeType = false;
            }
            if (item.boxstatus) {
              console.log('Blocked', item.boxstatus);
              this.packagectivation = true;
              this.activation = true;
              this.refresh = true;
              this.pinchange = true;
              this.pvrchange = true;
              this.sendmessage = true;
              this.deletemessage = true;
              this.forcetuning = true;
              this.smartcardchange = true;
              this.boxchange = true;
              this.suspend = true;
              this.resumechange = true;
              this.reactivation = true;
              this.cancelsubscription = true;
              this.block = true;
              this.deactive = true;
            }
            if (item.baseplan) {
              // console.log('fgfdgfdgfdg', item.baseplan);
              this.managePackagetable = false;
              this.managePackagetable1 = true;
            } else {
              this.managePackagetable = true;
              this.managePackagetable1 = false;
            }
          }

        },
        (error: any) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }
  refreshpage(event: any) {
    // this.swal.Loading();
    for (let index = 0; index < 2; index++) {
      console.log(event.boxid)
      this.userservice.getQuickOperationDetailsBySmartcard(this.role, this.username, event.smartcard || event.boxid).subscribe(
        (data: any) => {
          this.subscriersmartcarddashoard = true;
          this.cdr.detectChanges();
          console.log(data);
          this.packageobject = data['packageobject'];
          this.packdateobj = data['packdateobj'];
          this.packageMessage = data['message'];
          console.log(this.packageMessage);
          this.rowData1 = data['managepacklist_notexp'];
          this.rowData = data['smartcardlist'];
          this.subdetailsList = data['subscriberdetails']
          this.smartdetailList = data['smartcardlist']
          this.subscriberaccounts = data['subscriberaccounts'];
          this.smartcardinfo = data['smartcardinfo'];
          console.log('subdetailsList', this.subdetailsList);

          this.statusdisplay = this.subdetailsList.statusdisplay
          console.log('subscriberdetails', this.statusdisplay);
          this.subPairedboxid = data['pairedboxid'];
          console.log(this.subPairedboxid);
          this.subdetails = data['subdetails'];
          console.log('subdetails', this.subdetails);
          this.subPairedsmartcard = data['pairedsmartcard'];
          console.log(this.subPairedsmartcard);
          this.message = data['message'];

          console.log(this.statusdisplay);
          const isBlocked = this.statusdisplay === "Blocked";
          console.log(this.statusdisplay);


          if (this.subdetailsList) {
            let item = this.subdetailsList
            // if (!item.boxstatus && (item.showPairUnpair || item.status != 0)) {
            //   this.packagectivation = true;
            // } else {
            //   this.packagectivation = false;
            // }
            // if (!item.boxstatus) {
            //   if (item.showPairUnpair || item.status != 0) {
            //     this.packagectivation = false;
            //   } else {
            //     this.packagectivation = true;
            //   }
            // } else {
            //   this.packagectivation = false;
            // }

            if (!item.boxstatus) {
              console.log('first condition ok');
              if (!item.showPairUnpair || item.status == 0) {
                console.log('second condition ok');
                this.packagectivation = false;
              } else {
                console.log('third condition ok');

                this.packagectivation = true;
              }
            } else {
              console.log('last condition ok');

              this.packagectivation = false;
            }
            if (!item.boxstatus && !item.suspendstatus && item.status === 2) {
              this.activation = false;
            } else {
              this.activation = true;
            }
            if (!item.boxstatus && item.status != 0) {
              this.refresh = false;
            } else {
              this.refresh = true;
            }
            if (!item.boxstatus) {
              if ((item.status != 1 || item.suspendstatus == 1)) {
                console.log('dd');
                console.log(this.pinchange);
                this.pinchange = true;
                this.pvrchange = true;
                this.sendmessage = true;
                this.deletemessage = true;
                this.forcetuning = true;

              } else {
                this.pinchange = false;
                this.pvrchange = false;
                this.sendmessage = false;
                this.deletemessage = false;
                this.forcetuning = false;
              }
            }
            else {
              this.pinchange = true;
              this.pvrchange = true;
              this.sendmessage = true;
              this.deletemessage = true;
              this.forcetuning = true;
              console.log("this.pinchange", this.pinchange);
            }
            if (!item.boxstatus) {
              if (item.suspendstatus != 1 || item.showPairUnpair) {
                console.log('smartcardchange   ', this.smartcardchange);
                console.log('boxchange   ', this.boxchange);
                this.smartcardchange = false;
                this.boxchange = false;
              } else {
                this.smartcardchange = true;
                this.boxchange = true;
              }
            } else {
              this.smartcardchange = false;
              this.boxchange = false;
            }
            if (!item.boxstatus) {
              console.log('Status:', item.status);
              console.log('Suspend Status:', item.suspendstatus);
              console.log('Suspend State:', item.statussuspend);
              console.log('Number of Days:', item.noofdays);
              if (item.noofdays != 0 && (item.status == 1 || item.suspendstatus != 1) && !item.statussuspend) {
                this.suspend = false;
                console.log('correct');
              } else {
                this.suspend = true;
                console.log('wrong');
              }
            }
            else {
              this.suspend = true;
            }


            console.log('suspend-final', this.suspend);
            if (!item.boxstatus) {
              console.log('item.status', item.status + '         tem.suspendstatus', item.suspendstatus)
              if (item.status != 1 || item.suspendstatus == 1) {
                console.log('ffd', this.reactivation);
                this.reactivation = true;
              } else {
                this.reactivation = false;
              }
            } else {
              this.reactivation = false;
            }

            if (item.status != 1 || item.suspendstatus == 1) {
              console.log('Block', this.block);
              this.block = true;
            } else {
              this.block = false;
            }
            if ((!item.boxstatus && item.package_status === "Not Expired") && (item.status === 1 || item.suspendstatus != 1)) {
              console.log("cancel --" + this.cancelsubscription);

              this.cancelsubscription = false;
            } else {
              this.cancelsubscription = true;
            }

            if (!item.boxstatus) {
              if (item.suspendstatus != 1 || item.statusSus) {
                this.resumechange = true;
              } else {
                this.resumechange = false;
              }
            } else {
              this.resumechange = false;
            }
            if (item.castypedisplay && !item.showPairUnpair) {
              if (item.suspendstatus == 1) {
                console.log('pair', this.pair);
                this.pair = true;
              } else {
                this.pair = false;
              }
            } else {
              this.pair = true;
            }
            if (item.castypedisplay && item.showPairUnpair) {
              if (item.suspendstatus == 1) {
                console.log('unpair', this.unpair);
                this.unpair = true;
              } else {
                this.unpair = false;
              }
            } else {
              this.unpair = true;
            }
            if (!item.boxstatus && item.status === 1 && !item.statussuspend) {
              this.deactive = false;
            } else {
              this.deactive = true;
            }
            if (!item.boxstatus || item.status === 0) {
              if (item.status != 2 && item.statusdisplay == 'New') {
                this.expandale = false;
              } else {
                this.expandale = true;
              }
            } else {
              this.expandale = false;
            }

            if (!item.boxstatus || item.status == 0) {
              if (item.noofdays < 1) {
                this.addon = true;
                this.alacarte = true;
                this.remove = true;
              } else {
                this.addon = false;
                this.alacarte = false;
                this.remove = false;
              }
            } else {
              this.addon = true;
              this.alacarte = true;
              this.remove = true;
            }
            if (this.statusdisplay == 'Deactive') {
              this.base = true;
              this.rechargeType = true;
            } else {
              this.base = false;
              this.rechargeType = false;
            }
            if (item.boxstatus) {
              console.log('Blocked', item.boxstatus);
              this.packagectivation = true;
              this.activation = true;
              this.refresh = true;
              this.pinchange = true;
              this.pvrchange = true;
              this.sendmessage = true;
              this.deletemessage = true;
              this.forcetuning = true;
              this.smartcardchange = true;
              this.boxchange = true;
              this.suspend = true;
              this.resumechange = true;
              this.reactivation = true;
              this.cancelsubscription = true;
              this.block = true;
              this.deactive = true;
            }
            if (item.baseplan) {
              // console.log('fgfdgfdgfdg', item.baseplan);
              this.managePackagetable = false;
              this.managePackagetable1 = true;
            } else {
              this.managePackagetable = true;
              this.managePackagetable1 = false;
            }
          }

          // this.swal.success(data?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }
  }
  // calculateProgress() {
  //   console.log('Progress:', this.progress);
  //   console.log('expiryDate:', this.subdetailsList.expiryDate);
  //   console.log('activationDate:', this.subdetailsList.activationDate);

  //   const totalDuration = (this.subdetailsList.expiryDate.getTime() - this.subdetailsList.activationDate.getTime()) / (1000 * 60 * 60 * 24);
  //   const daysElapsed = (new Date().getTime() - this.subdetailsList.activationDate.getTime()) / (1000 * 60 * 60 * 24);
  //   const percentElapsed = (daysElapsed / totalDuration) * 100;
  //   console.log('totalDurations', totalDuration);
  //   console.log('daysElapsed', daysElapsed);
  //   console.log('percentElapsed', percentElapsed);

  //   // Set progress sections based on the elapsed percentage
  //   if (percentElapsed >= 75) {
  //     this.progress.success = 100;
  //     this.progress.info = 25;
  //     this.progress.warning = 20;
  //     this.progress.danger = 5;
  //   } else if (percentElapsed >= 50) {
  //     this.progress.success = 50;
  //     this.progress.info = 25;
  //     this.progress.warning = 20;
  //   } else if (percentElapsed >= 25) {
  //     this.progress.success = 25;
  //     this.progress.info = 20;
  //   } else {
  //     this.progress.success = 10;
  //   }

  //   // Update days text
  //   const daysLeft = Math.floor(totalDuration - daysElapsed);
  //   this.daysText = `${daysLeft} DAYS LEFT`;

  //   console.log('Progress:', this.progress);
  // }



  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80,
    },
    {
      headerName: 'SMARTCARD', width: 270,
      field: 'smartcard',
    },
    {
      headerName: 'CAS ', width: 220,
      field: 'casname',
    },
    {
      headerName: 'EXPIRY DATE	', width: 250,
      field: 'expirydate',
    },
    {
      headerName: 'ACTION', width: 200,
      field: 'action',
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';

        // Info Button
        const infoButton = document.createElement('button');
        infoButton.style.backgroundColor = '#1f6764';
        infoButton.style.border = 'none';
        infoButton.style.width = '25px';
        infoButton.style.height = '25px';
        infoButton.style.color = 'white';
        infoButton.style.borderRadius = '12px';
        infoButton.style.cursor = 'pointer';
        infoButton.style.fontSize = '15px';
        infoButton.style.display = 'flex';
        infoButton.style.alignItems = 'center';
        infoButton.style.justifyContent = 'center';
        const infoIcon = document.createElement('i');
        infoIcon.className = 'fa fa-info';
        infoButton.appendChild(infoIcon);
        infoButton.title = 'Info';
        infoButton.addEventListener('click', () => {
          this.refreshpage(params.data);
        });
        // Refresh Button
        const refreshButton = document.createElement('button');
        refreshButton.style.backgroundColor = '#1f6764';
        refreshButton.style.border = 'none';
        refreshButton.style.color = 'white';
        // refreshButton.style.padding = '10px';
        refreshButton.style.width = '25px';
        refreshButton.style.height = '25px';
        refreshButton.style.borderRadius = '12px';
        refreshButton.style.cursor = 'pointer';
        refreshButton.style.fontSize = '15px';
        refreshButton.style.display = 'flex';
        refreshButton.style.alignItems = 'center';
        refreshButton.style.justifyContent = 'center';
        const refreshIcon = document.createElement('i');
        refreshIcon.className = 'fa fa-refresh'; // example icon
        refreshButton.appendChild(refreshIcon);
        refreshButton.title = 'Refresh';
        refreshButton.addEventListener('click', () => {
          this.openDialog('refresh', params.data);
        });
        // Download Button
        const downloadButton = document.createElement('button');
        downloadButton.style.backgroundColor = '#1f6764';
        downloadButton.style.border = 'none';
        // downloadButton.style.padding = '10px';
        downloadButton.style.width = '25px';
        downloadButton.style.height = '25px';
        downloadButton.style.color = 'white';
        downloadButton.style.borderRadius = '12px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.fontSize = '15px';
        downloadButton.style.display = 'flex';
        downloadButton.style.alignItems = 'center';
        downloadButton.style.justifyContent = 'center';
        const downloadIcon = document.createElement('i');
        downloadIcon.className = 'fa fa-download';
        downloadButton.appendChild(downloadIcon);
        downloadButton.title = 'Download';
        downloadButton.addEventListener('click', () => {
          this.getPdfSmartcardRechargeReport(params.data);
        });
        // Append buttons to the container
        container.appendChild(infoButton);
        container.appendChild(refreshButton);
        container.appendChild(downloadButton);

        // Add click event listeners if needed
        infoButton.addEventListener('click', () => {
          console.log('Info button clicked', params.data);
        });

        refreshButton.addEventListener('click', () => {
          console.log('Refresh button clicked', params.data);
          this.refreshButton = params.data;
          console.log(this.refreshButton);
        });

        downloadButton.addEventListener('click', () => {
          console.log('Download button clicked', params.data);
        });

        return container;
      },
    },

  ]
  columnDefs1: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true, isSelected: true
    },
    {
      headerName: 'PACKAGE NAME	',
      field: 'productname', width: 250,
    },
    {
      headerName: 'PRODUCT TYPE	 ', width: 220,
      field: 'ptype',
    },
    {
      headerName: 'PRODUCT ID	', width: 220,
      field: 'casproductid',
    },
    {
      headerName: 'DAYS REMAINING	', width: 220,
      field: 'noofdays',
    },
    {
      headerName: 'PROGRAMS', width: 215,
      cellRenderer: (params: any) => {
        // Check if the producttype is "BASE" or "ADDON"
        if (params.data.ptype === 'BASE' || params.data.ptype === 'ADDON') {
          const container = document.createElement('div');
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';

          const infoButton = document.createElement('button');
          infoButton.style.backgroundColor = '#1f6764';
          infoButton.style.border = 'none';
          infoButton.style.width = '25px';
          infoButton.style.height = '25px';
          infoButton.style.color = 'white';
          infoButton.style.borderRadius = '12px';
          infoButton.style.cursor = 'pointer';
          infoButton.style.fontSize = '15px';
          infoButton.style.display = 'flex';
          infoButton.style.alignItems = 'center';
          infoButton.style.justifyContent = 'center';

          const infoIcon = document.createElement('i');
          infoIcon.className = 'fa fa-info';
          infoButton.appendChild(infoIcon);
          infoButton.title = 'Info';
          container.appendChild(infoButton);

          infoButton.addEventListener('click', () => {
            console.log('Info button clicked', params.data);
            this.openChannellistDialogue(params.data);
          });

          return container;
        } else {
          return null;
        }
      },
    },
    {
      headerName: 'PACKAGE NAME',
      field: 'productname',
      width: 300,
    },

  ]
  columnDefs2: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true, isSelected: true
    },
    {
      headerName: 'PACKAGE NAME	',
      field: 'productname', width: 250,
    },
    {
      headerName: 'PRODUCT TYPE	 ', width: 220,
      field: 'ptype',
    },
    {
      headerName: 'PRODUCT ID	', width: 220,
      field: 'casproductid',
    },
    {
      headerName: 'DAYS REMAINING	', width: 220,
      field: 'noofdays',
    },
    {
      headerName: 'PROGRAMS', width: 215,
      cellRenderer: (params: any) => {
        // Check if the producttype is "BASE" or "ADDON"
        if (params.data.ptype === 'BASE' || params.data.ptype === 'ADDON') {
          const container = document.createElement('div');
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';

          const infoButton = document.createElement('button');
          infoButton.style.backgroundColor = '#1f6764';
          infoButton.style.border = 'none';
          infoButton.style.width = '25px';
          infoButton.style.height = '25px';
          infoButton.style.color = 'white';
          infoButton.style.borderRadius = '12px';
          infoButton.style.cursor = 'pointer';
          infoButton.style.fontSize = '15px';
          infoButton.style.display = 'flex';
          infoButton.style.alignItems = 'center';
          infoButton.style.justifyContent = 'center';

          const infoIcon = document.createElement('i');
          infoIcon.className = 'fa fa-info';
          infoButton.appendChild(infoIcon);
          infoButton.title = 'Info';
          container.appendChild(infoButton);

          infoButton.addEventListener('click', () => {
            console.log('Info button clicked', params.data);
            this.openChannellistDialogue(params.data);
          });

          return container;
        } else {
          return null;
        }
      },
    },
    {
      headerName: 'PACKAGE NAME',
      field: 'productname',
      width: 300,
    },

  ]
  rowData1: any[] = [];
  rowData: any[] = [];
  manageData: any;
  // onSelectionChanged() {
  //   if (this.gridApi) {
  //     const selectedRows = this.gridApi.getSelectedRows();
  //     this.isAnyRowSelected = selectedRows.length > 0;
  //     this.rows = selectedRows;
  //     console.log(this.rows);

  //   }
  // }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;

  }

  onGridReady1(params: any) {
    this.gridApi = params.api;
    params.api.selectAll()
    console.log(params.api.getSelectedRows());

    // params.api.forEachNode((node: any) => {
    //   if (node.data.type === 1) {
    //     console.log(params.api);
    //    params.api.setNodesSelected(node)
    //     node.selectable = false;
    //   }
    //   console.log(node);
    // });
    params.api.forEachNode((node: any) => {
      params.api.setNodesSelected({ node, newValue: true });
    });




  }
  selectRow(id: number) {
    const node = this.gridApi.getRowNode(id.toString());
    if (node) {
      node.setSelected(true);
      console.log(node);
    } else {
      console.log(`Row with ID ${id} not found.`);
    }
  }

  onNoClick() {
    this.selectedTab = !this.selectedTab
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    this.openDialog('selectedTab', '');
    console.log(this.selectTab);

    let dialogData = {
      selectedTab: this.selectedTab
    };
    const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
  }

  Edit_subscriber_details(type: string): void {

    let dialogData = { type: type, detailsList: this.subdetailsList, };

    const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
      width: '1000px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });


  }


  navgetToUrl(id: any) {
    this.activeItem = id;
    this.router.navigate(['/sublogin'], { state: { openDialog: 'suspend' } });
  }
  loginpage() {

  }

  pairDialogue(type: string): void {
    let dialogData = {
      type: type || null,
      detailsList: this.subdetailsList || [],
      pairBoxlist: this.subPairedboxid || [],
      pairSmartcardlist: this.subPairedsmartcard || [],
      plantype: this.packagePlan || null,
      subSmartcarList: this.subdetailsList?.smartcard || [],
      subBoxList: this.subdetailsList?.boxid || []
    };
    console.log(dialogData);
    const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
      width: '500px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  openLoginPage(type: any) {
    // let dialogData = { type: type, detailsList: this.subdetailsList, 
    //   pairBoxlist: this.subPairedboxid, pairSmartcardlist: this.subPairedsmartcard,
    //   newsubid: this.subscriberid, subId: this.subdetailsList.subid,  plantype: this.packagePlan };
    let dialogData = {
      type: type || null,
      detailsList: this.subdetailsList || [],
      pairBoxlist: this.subPairedboxid || [],
      pairSmartcardlist: this.subPairedsmartcard || [],
      newsubid: this.subscriberid || null,
      subId: this.subdetailsList?.subid || null,
      plantype: this.packagePlan || null
    };
    console.log(dialogData);
    const dialogRef = this.dialog.open(LcologinpageComponent, {
      data: dialogData,
      // width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  openDialog(type: string, data: any): void {
    let width = '500px';
    if (type === 'addSmartcard') {
      // dialogConfig.height = '1000px'; 
      width = '450px';
    } else if (type === 'editDetails') {
      width = '1000px';
    } else if (type === 'refresh') {
      width = '500px';
    }
    // let dialogData = { type: type, detailsList: this.subdetailsList, newsubid: this.subscriberid, subId: this.subdetailsList.subid, pairBoxlist: this.subPairedboxid, pairSmartcardlist: this.subPairedsmartcard, plantype: this.packagePlan };
    let dialogData = {
      refresh: data || null,
      type: type || null,
      detailsList: this.subdetailsList || [],
      pairBoxlist: this.subPairedboxid || [],
      pairSmartcardlist: this.subPairedsmartcard || [],
      newsubid: this.subscriberid || null,
      packageMessage: this.packageMessage || null,
      subId: this.subdetailsList?.subid || null,
      plantype: this.packagePlan || null
    };
    console.log('refresh', data);

    console.log(dialogData);
    // const isDataInvalid = Object.values(dialogData).some(value => value === undefined || value === null);
    // console.log(isDataInvalid);
    // console.log(dialogData);
    // if (isDataInvalid) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Invalid Data',
    //     text: 'Some required data is missing or undefined. Please check and try again.',
    //     confirmButtonText: 'OK'
    //   });
    //   return;
    // }
    const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
      data: dialogData,
      width: width
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  managePackage(type: string): void {
    let dialogData = { type: type, detailsList: this.subdetailsList, pairBoxlist: this.subPairedboxid, pairSmartcardlist: this.subPairedsmartcard, subSmartcarList: this.subdetailsList?.smartcard, subBoxList: this.subdetailsList?.boxid };
    // switch (type) {
    //   case 'addon':
    //     dialogData = { type:type, detailsList: this.subdetailsList, };
    //     break;
    //   case 'alacarte':
    //     dialogData = { isAlacarte: true, detailsList: this.subdetailsList, };
    //     break;
    //   case 'remove':
    //     dialogData = { isRemove: true, detailsList: this.subdetailsList, };
    //     break;
    //   case 'cancelsubscription':
    //     dialogData = { isCancelsubscription: true, detailsList: this.subdetailsList, };
    //     break;
    // }
    const isDataInvalid = Object.values(dialogData).some(value => value === undefined || value === null);
    console.log(isDataInvalid);
    console.log(dialogData);
    if (isDataInvalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Data',
        text: 'Some required data is missing or undefined. Please check and try again.',
        confirmButtonText: 'OK'
      });
      return;
    }
    const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
      width: '1000px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
  }
  openChannellistDialogue(data: any): void {
    console.log(data);
    const dialogRef = this.dialog.open(ChannellistComponent, {
      width: '1200px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  onSelectionrechargetype(selectedValue: string) {
    const rechargetype = Number(selectedValue);
    if (rechargetype == 1) {
      this.isplantype = true;
      this.datetype = false;
    }
    if (rechargetype == 2) {
      this.isplantype = false;
      this.datetype = true;
    }
    if (rechargetype == 3) {
      this.dateTodate;
      this.isplantype = false;
      this.datetype = false;
    }
  }
  onSelectionplantype(selectedValue: string) {
    const rechargetype = Number(selectedValue);
    if (rechargetype == 1) {
      this.isplantype = true;
      this.datetype = false;
    }
    if (rechargetype == 2) {
      this.isplantype = false;
      this.datetype = true;
    }
    if (rechargetype == 3) {
      this.datetype = false;
      this.isplantype = false;
    }
    console.log(this.plantype);

    console.log(this.selectedRechargetype);
    console.log(this.f_date);

    if (this.selectedRechargetype == '2') {
      this.plantype = 0
    }
    if (this.selectedRechargetype == '1') {
      this.f_date = null
    }

    if ((this.selectedRechargetype == '3') || (this.selectedRechargetype != '3' && this.plantype != 0) || (this.f_date)) {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }

    console.log(selectedValue);
  }
  rechargetoggleConfirmation() {
    this.ManagePackageCalculation();
  }
  rechargetoggleConfirmation1() {
    this.ManagePackageCalculation1();
  }
  rechargetoggle() {
    this.ManagePackageCalculation();
    this.toggleConfirmation();
  }
  rechargetoggle1() {
    this.ManagePackageCalculation1();
    this.toggleConfirmation();
  }
  toggleConfirmation() {
    this.confirmation = !this.confirmation;
  }


  recharge() {
    this.confirmation = true;
    this.isConfirmationComplete = true;
    let requestBody = {
      role: this.role,
      username: this.username,
      plantype: this.selectedRechargetype,
      plan: this.plandata,
      smartcard: this.subdetailsList.smartcard,
      type: 10,
      managepacklist: this.rowData1,
      selectedpacklist: this.rows,
      retailerid: 0,
      iscollected: this.iscollected,
    }
    console.log(requestBody);
    this.swal.Loading();
    this.userservice.ManagePackageRecharge(requestBody).subscribe((res: any) => {
      this.swal.success(res?.message);
      console.log(res);
    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error?.selectedpacklist || err?.error?.iscollected);
    });
  }
  recharge1() {
    this.confirmation = true;
    this.isConfirmationComplete = true;
    let requestBody = {
      role: this.role,
      username: this.username,
      plantype: this.selectedRechargetype,
      plan: this.plandata,
      smartcard: this.subdetailsList.smartcard,
      type: 10,
      managepacklist: this.rowData1,
      selectedpacklist: this.rowData1,
      retailerid: 0,
      iscollected: this.iscollected,
    }
    console.log(requestBody);
    this.swal.Loading();
    this.userservice.ManagePackageRecharge(requestBody).subscribe((res: any) => {
      this.swal.success(res?.message);
      console.log(res);
    }, (err) => {
      this.swal.Error1(err?.error?.message || err?.error?.selectedpacklist || err?.error?.iscollected);
    });
  }
  // generateBillpdf() {
  //   this.userservice.getPdfBillReport(this.role, this.username, this.subdetailsList.subid, this.subdetailsList.smartcard)
  //   .subscribe((x: any) => {
  //     console.log(x);
  //     let requestBodylogs: requestBodylogs = { access_ip: "", action: " PDF Bill Report", data: "From Date", remarks: "PDF Bill Report  ", };
  //     console.log(requestBodylogs);
  //     const blob = new Blob([x], { type: 'application/pdf' });
  //     const data = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = data;
  //     link.download = "PDF Bill Report.pdf";
  //     link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  //     setTimeout(function () {
  //       window.URL.revokeObjectURL(data);
  //       link.remove();
  //     }, 100);
  //   })
  // }

  generateBillpdf() {
    this.userservice.getPdfBillReport(this.role, this.username, this.subdetailsList.subid, this.subdetailsList.smartcard)
      .subscribe((res: Blob) => {
        Swal.close();
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "PDF_Bill_Report.pdf";
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          link.remove();
        }, 100);
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }

  getPdfSmartcardRechargeReport(event: any) {
    console.log(event.smartcard);
    console.log(this.subdetailsList.subid);
    console.log(this.smartcardValue);

    // this.swal.Loading();
    this.userservice.getPdfBillReport(this.role, this.username, this.subdetailsList.subid || this.subscriberid, event.smartcard).subscribe((x: any) => {
      // Swal.fire({
      //   title: 'Loading...',
      //   text: 'Please wait while we process your request.',
      //   allowOutsideClick: false,
      //   didOpen: () => {
      //     Swal.showLoading(null);
      //   }
      // });
      // 
      console.log(x);
      let requestBodylogs: requestBodylogs = { access_ip: "", action: " PDF Bill Report", data: "From Date", remarks: "PDF Bill Report  ", };
      console.log(requestBodylogs);
      const blob = new Blob([x], { type: 'application/pdf' });
      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = "PDF Bill Report.pdf";
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      setTimeout(function () {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    })
  }

  // getPdfCasformReport() {
  //   Swal.fire({
  //     title: 'Loading...',
  //     text: 'Please wait while we process your request.',
  //     allowOutsideClick: false, // Disable clicking outside the popup to close it
  //     didOpen: () => {
  //       Swal.showLoading(null);
  //     }
  //   });
  //   this.userservice.getPdfCasformReport(this.role, this.username, this.subdetailsList.subid).subscribe((x: any) => {
  //     console.log(x);
  //     let requestBodylogs: requestBodylogs = { access_ip: "", action: " PDF CAS Form Report", data: "From Date", remarks: "PDF CAS Form Report  ", };
  //     console.log(requestBodylogs);
  //     const blob = new Blob([x], { type: 'application/pdf' });
  //     const data = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = data;
  //     link.download = "PDF CAS Form Report.pdf";
  //     link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  //     setTimeout(function () {
  //       window.URL.revokeObjectURL(data);
  //       link.remove();
  //     }, 100);
  //   })
  // }
  getPdfCasformReport() {
    // this.userservice.getPdfCasformReport(this.role, this.username, this.subdetailsList.subid)
    //   .subscribe((x: Blob) => {
    //     // Log request body
    //     let requestBodylogs: requestBodylogs = {
    //       access_ip: "",
    //       action: "PDF CAS Form Report",
    //       data: "From Date",
    //       remarks: "PDF CAS Form Report"
    //     };
    //     console.log(requestBodylogs);

    //     // Create a blob and download the PDF
    //     const blob = new Blob([x], { type: 'application/pdf' });
    //     const data = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = data;
    //     link.download = "PDF CAS Form Report.pdf";
    //     link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    //     // Clean up the URL object after a short delay
    //     setTimeout(() => {
    //       window.URL.revokeObjectURL(data);
    //       link.remove();
    //     }, 100);
    //   },
    //     (error: any) => {
    //       // Handle any errors in report generation
    //       Swal.fire({
    //         title: 'Error!',
    //         text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
    //         icon: 'error',
    //         confirmButtonText: 'Ok'
    //       });
    //     });


    this.userservice.getPdfCasformReport(this.role, this.username, this.subdetailsList.subid).subscribe((x: Blob) => {
      // let requestBodylogs: requestBodylogs = { access_ip: "", action: " PDF Bill Report", data: "From Date", remarks: "PDF Bill Report  ", };

      const blob = new Blob([x], { type: 'application/pdf' });
      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = "PDF CAS Form Report.pdf";
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      setTimeout(function () {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    })
  }
  managepackageSelection(): boolean {
    if (this.selectedRechargetype === '3') return true;

    return !!this.selectedRechargetype && this.selectedRechargetype !== '0' &&
      ((this.isplantype && !!this.plantype && this.plantype !== '0') ||
        (this.datetype && !!this.f_date));
  }

  isPlanTypeSelected(): boolean {
    if (this.selectedRechargetype === '3') return true;
    if ((this.datetype && this.f_date)) return true;
    // if (!!this.newpackagename && this.newpackagename !== '0') return true;
    return !!this.selectedRechargetype && this.selectedRechargetype !== '0' &&
      ((this.isplantype && !!this.plantype && this.plantype !== '0') ||
        (this.datetype && this.f_date));
  }

  isDateSelected(): boolean {
    return !!this.f_date || this.datetype;
  }
  plandata: any;
  ManagePackageCalculation1() {
    // this.selectedRechargetype= '';
    this.plandata = '';
    this.isRecharge = true;
    console.log('plandata', this.plandata);

    this.plandata = this.plantype || this.f_date || 4
    console.log('plandata', this.plandata);
    let requestBody = {
      role: this.role,
      username: this.username,
      plantype: this.selectedRechargetype,
      plan: this.plandata,
      smartcard: this.subdetailsList.smartcard,
      type: 10,
      managepacklist: this.rowData1,
      selectedpacklist: this.rowData1,
      retailerid: 0
    }
    console.log(requestBody);

    this.userservice.ManagePackageCalculation(requestBody).subscribe((res: any) => {
      // this.swal.success(res?.message);
      console.log(res);
      this.manageData = res;
      console.log(this.manageData);

    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error?.selectedpacklist);
    });
  }
  ManagePackageCalculation() {
    // this.selectedRechargetype= '';
    this.plandata = '';
    this.isRecharge = true;
    console.log('plandata', this.plandata);

    this.plandata = this.plantype || this.f_date || 4
    console.log('plandata', this.plandata);

    let requestBody = {
      role: this.role,
      username: this.username,
      plantype: this.selectedRechargetype,
      plan: this.plandata,
      smartcard: this.subdetailsList.smartcard,
      type: 10,
      managepacklist: this.rowData1,
      selectedpacklist: this.rows,
      retailerid: 0
    }
    console.log(requestBody);

    this.userservice.ManagePackageCalculation(requestBody).subscribe((res: any) => {
      // this.swal.success(res?.message);
      console.log(res);
      this.manageData = res;
      console.log(this.manageData);

    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error?.selectedpacklist);
    });
  }
}


