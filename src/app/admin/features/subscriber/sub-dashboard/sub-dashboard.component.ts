import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core';
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
import { PageEvent } from '@angular/material/paginator';
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
export class SubDashboardComponent implements OnInit {
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

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

  gridHeight: any;
  noofdays: any;
  gridOptions = {
    defaultColDef: {
      // width: 205
    },
    rowClassRules: {
      'always-selected': (params: any) => params.data.ptype === 'BASE',
    },
    onFirstDataRendered: (params: { api: { forEachNode: (arg0: (node: any) => void) => void; }; }) => {
      this.selectRowsBasedOnUsername(params);
    },

    onRowSelected: (event: any) => {
      if (event.node.data.ptype === 'BASE' && !event.node.isSelected()) {
        event.node.setSelected(true);
      }
    },
    paginationPageSize: 5,
    pagination: true,
  }

  currentPageSize: number = 0;
  totalRowsCount: number = 0;
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
  cancel_btn: boolean = false;

  subdashoard: any;
  newdashoard: any;
  subsmartcarddashoard: any;


  selectedTab: any = 'BASE';
  confirmation: boolean = false;
  isConfirmationComplete = false;
  isRecharge: boolean = true;
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
  isSendDeleteMessage: boolean = false;
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
  // plantype:any;
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

  nextDay: string = '';
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
    this.username = storageservice.getUsernamenew();
    this.subscriberid = this.route.snapshot.paramMap.get('smartcard');
    this.subscribersubid = this.route.snapshot.paramMap.get('subid');
    this.status = this.route.snapshot.paramMap.get('status');
    this.loaddata()
    let splitValues = this.subscriberid.split("**");
    this.boxid = splitValues[1];
    this.smartcardValue = splitValues[0];
    this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      // this.rechargetype = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      this.rechargetype = Object.keys(data).map(key => {
        const id = data[key];
        const name = key.replace(/\(\d+\)$/, '').trim();
        return { name: name, id: id };
      });
      console.log(this.rechargeType);

      this.cdr.detectChanges();
    })

  }
  onBillTypeChange() {
    this.billtype = this.billtype ? 1 : 0;
  }

  onSelectionChanged() {
    this.updatePaginationCount();
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
    }
  }

  ngOnInit(): void {
    this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      this.packagePlan = data;
      const sortedData = Object.entries(data)
        .map(([key, value]) => ({
          key: key.replace(/\(\d+\)/, '').trim(),
          value: value as number
        }))

      this.plantype$.next(sortedData);
      if (this.selectedRechargetype === 1) {
        const defaultPlan = sortedData.find(plan => plan.key === '1month');
        if (defaultPlan) {
          this.plantype = defaultPlan.value;
          console.log(this.plantype);

        }
      }
    });
    if (this.role == 'ROLE_SUBLCO') {
      this.subLCOdetails();
    } else if (this.role == 'ROLE_SUBSCRIBER') {
      this.getSubscriberDetails();
    }

  }
  lcoDeatails: any;
  retailerId: any;
  Sublcopermissionlist: any;
  subLCOdetails() {
    this.userservice.getSublcoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      console.log('111111111111111');
      this.lcoDeatails = data;
      this.retailerId = this.lcoDeatails?.retailerid;
      this.Sublcopermissionlist = this.lcoDeatails?.permissionlist;
      console.log('eresuofhdljkfhdsjkfhnsjdhfdjsfh', this.Sublcopermissionlist);
    })
  }
  sub_subscriberid:any;
  getSubscriberDetails() {
    this.userservice.getSubscriberDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      console.log('22222222');
      this.lcoDeatails = data;
      this.lcoDeatails = data;
      console.log('SUBSCRIBER DETAILS', this.lcoDeatails);
      this.sub_subscriberid = this.lcoDeatails.subid;
      console.log('SUBSCRIBER SUBID', this.sub_subscriberid);
    })
  }
  setNextDay(): void {
    const expiryDate = new Date(this.subdetailsList?.expirydate);
    expiryDate.setDate(expiryDate.getDate() + 1);
    this.nextDay = expiryDate.toISOString().split('T')[0];
  }
  loadNewDashboard() {
    // for (let index = 0; index < 2; index++) {
    this.userservice.getNewsubscriberDetails(this.role, this.username, this.subscriberid || this.smartcard || this.boxid)
      .subscribe((data: any) => {
        console.log(data);
        this.packageMessage = data['message'];
        this.isSendDeleteMessage = this.packageMessage?.forcemsg || false;

        this.newSmartcard = data.smartcardlist?.[data.smartcardlist.length - 1]?.smartcard || null;;
        this.statusNewSmartcard = data.smartcardlist?.[data.smartcardlist.length - 1]?.statusdisplay || null;;

        if (this.statusNewSmartcard === 'Active') {
          this.newsubscrierdashoard = true;
          this.subscriersmartcarddashoard = true;
          this.expandale = true;
          this.loadNewSmartcardDashboard();
        }
        if (this.statusNewSmartcard === 'New') {
          this.newsubscrierdashoard = true;
          this.subscriersmartcarddashoard = true;
          this.expandale = true;
          this.loadNewSmartcardDashboard();
        }
        this.newOperatorContact = data.opcontact;
        this.newsubscrierdashoard = !this.newsubscrierdashoard;
        this.rowData = data['smartcardlist'];
        this.rowData1 = data['managepacklist_notexp'];
        this.subdetailsList = data['subscriberdetails'];
        this.subdetails = data['subdetails'];

        this.subid = this.subdetailsList.subid;
        this.smartcard = this.subdetailsList.smartcard;

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
    else if (this.status === 'dashboard') {
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
    console.log('SEARCH To DASHBOARD');

    this.userservice.getQuickOperationDetailsBySearchname(this.role, this.username, (this.smartcard || this.subscriberid || this.smartcardValue || this.boxid)).subscribe(
      (data: any) => {
        console.log(data);

        this.packageobject = data['packageobject'];
        this.packageMessage = data['message'];
        this.isSendDeleteMessage = this.packageMessage?.forcemsg || false;
        this.packdateobj = data['packdateobj'];
        this.rowData1 = data['managepacklist_notexp'];

        this.rowData = data['smartcardlist'];
        this.subdetailsList = data['subscriberdetails']
        this.statusdisplay = this.subdetailsList.statusdisplay

        this.smartdetailList = data['smartcardlist']
        this.subscriberaccounts = data['subscriberaccounts'];
        this.smartcardinfo = data['smartcardinfo'];
        this.subPairedboxid = data['pairedboxid'];
        this.subdetails = data['subdetails'];
        this.subPairedsmartcard = data['pairedsmartcard'];
        this.message = data['message'];
        this.noofdays = this.subdetailsList.noofdays;
        console.log('Row Data', this.rowData);
        console.log('Row Data1', this.rowData1);
        const totalRows = this.rowData1 ? this.rowData1.length : 0;

        if (totalRows > 10) {
          this.gridHeight = 600;
        } else if (totalRows > 3) {
          this.gridHeight = 400;
        }
        else {
          this.gridHeight = 'auto';
        }
        if (this.subdetailsList) {
          let item = this.subdetailsList
          if (!item.boxstatus) {
            if (!item.showPairUnpair || item.status == 0) {
              this.packagectivation = false;
            } else {
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
          }
          if (!item.boxstatus) {
            if (item.suspendstatus == 1 || item.showPairUnpair == 'false') {
              this.smartcardchange = true;
              this.boxchange = true;
            } else {
              this.smartcardchange = false;
              this.boxchange = false;
            }
          } else {
            this.smartcardchange = false;
            this.boxchange = false;
          }

          if (!item.boxstatus) {
            if (item.noofdays != 0 && (item.status == 1 || item.suspendstatus != 1) && !item.statussuspend) {
              this.suspend = false;

            } else {
              this.suspend = true;

            }
          }
          else {
            this.suspend = true;
          }

          if (!item.boxstatus) {

            if (item.status != 1 || item.suspendstatus == 1) {

              this.reactivation = true;
            } else {
              this.reactivation = false;
            }
          } else {
            this.reactivation = false;
          }

          if (item.status != 1 || item.suspendstatus == 1) {

            this.block = true;
          } else {
            this.block = false;
          }
          if ((!item.boxstatus && item.package_status === "Not Expired") && (item.status === 1 || item.suspendstatus != 1)) {

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
              this.pair = true;
            } else {
              this.pair = false;
            }
          } else {
            this.pair = true;
          }
          if (item.castypedisplay && item.showPairUnpair) {
            if (item.suspendstatus == 1) {
              this.unpair = true;
            } else {
              this.unpair = false;
            }
          } else {
            this.unpair = true;
          }

          if (!item.boxstatus && (item.status == 2 || item.status == 0 || item.suspendstatus == 1)) {
            this.deactive = true;
          } else {
            this.deactive = false;
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

          if (item.status == 2 || item.suspendstatus == 1) {
            this.base = true;
            this.rechargeType = true;
          } else {
            this.base = false;
            this.rechargeType = false;
          }

          if (item.boxstatus) {
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
            console.log('BASE PLAN ', item.baseplan);
            this.managePackagetable = false;
            this.managePackagetable1 = true;
          } else {
            this.managePackagetable = true;
            this.managePackagetable1 = false;
          }
        }
        this.cdr.detectChanges();
        // this.onGridReady('');
        // this.onGridReady1('');
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  loadNewSmartcardDashboard() {
    console.log('NEW');
    for (let index = 0; index < 2; index++) {
      this.userservice.getQuickOperationDetailsBySmartcard(this.role, this.username, this.newSmartcard).subscribe(
        (data: any) => {
          this.cdr.detectChanges();

          console.log(data);
          this.packageobject = data['packageobject'];
          this.packdateobj = data['packdateobj'];
          this.packageMessage = data['message'];
          this.isSendDeleteMessage = this.packageMessage?.forcemsg || false;
          this.rowData1 = data['managepacklist_notexp'];
          this.rowData = data['smartcardlist'];
          this.subdetailsList = data['subscriberdetails']
          this.smartdetailList = data['smartcardlist']
          this.subscriberaccounts = data['subscriberaccounts'];
          this.smartcardinfo = data['smartcardinfo'];
          this.subPairedboxid = data['pairedboxid'];
          this.subdetails = data['subdetails'];
          this.statusdisplay = this.subdetailsList.statusdisplay
          this.subPairedsmartcard = data['pairedsmartcard'];
          this.message = data['message'];
          this.noofdays = this.subdetailsList.noofdays;
          const totalRows = this.rowData1 ? this.rowData1.length : 0;
          if (totalRows > 10) {
            this.gridHeight = 600;
          } else if (totalRows > 3) {
            this.gridHeight = 400;
          }
          else {
            this.gridHeight = 'auto';
          }
          if (this.subdetailsList) {
            let item = this.subdetailsList
            if (!item.boxstatus) {
              if (!item.showPairUnpair || item.status == 0) {
                this.packagectivation = false;
              } else {
                this.packagectivation = true;
              }
            } else {
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
            }

            if (!item.boxstatus) {
              if (item.suspendstatus == 1 || item.showPairUnpair == 'false') {
                this.smartcardchange = true;
                this.boxchange = true;
              } else {
                this.smartcardchange = false;
                this.boxchange = false;
              }
            } else {
              this.smartcardchange = false;
              this.boxchange = false;
            }

            if (!item.boxstatus) {
              if (item.noofdays != 0 && (item.status == 1 || item.suspendstatus != 1) && !item.statussuspend) {
                this.suspend = false;
              } else {
                this.suspend = true;
              }
            }
            else {
              this.suspend = true;
            }

            if (!item.boxstatus) {
              if (item.status != 1 || item.suspendstatus == 1) {
                this.reactivation = true;
              } else {
                this.reactivation = false;
              }
            } else {
              this.reactivation = false;
            }

            if (item.status == 1 || item.suspendstatus == 1) {
              this.block = true;
            } else {
              this.block = false;
            }
            if ((!item.boxstatus && item.package_status === "Not Expired") && (item.status === 1 || item.suspendstatus != 1)) {
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
                this.pair = true;
              } else {
                this.pair = false;
              }
            } else {
              this.pair = true;
            }
            if (item.castypedisplay && item.showPairUnpair) {
              if (item.suspendstatus == 1) {
                this.unpair = true;
              } else {
                this.unpair = false;
              }
            } else {
              this.unpair = true;
            }

            if (!item.boxstatus && (item.status == 2 || item.status == 0 || item.suspendstatus == 1)) {
              this.deactive = true;
            } else {
              this.deactive = false;
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

            if (item.status == 2 || item.suspendstatus == 1) {
              this.base = true;
              this.rechargeType = true;
            } else {
              this.base = false;
              this.rechargeType = false;
            }
            if (item.boxstatus) {
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
              console.log('BASE PLAN ', item.baseplan);
              this.managePackagetable = false;
              this.managePackagetable1 = true;
            } else {
              this.managePackagetable = true;
              this.managePackagetable1 = false;
            }
          }
          // this.onGridReady('');
          // this.onGridReady1('');
        },
        (error: any) => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }

  loadSmartcardDashboard() {
    console.log('SMARTCARD To DASHBOARD');
    for (let index = 0; index < 2; index++) {
      this.userservice.getQuickOperationDetailsBySmartcard(this.role, this.username, (this.smartcard || this.subscriberid || this.boxid)).subscribe(
        (data: any) => {
          this.cdr.detectChanges();
          this.reloadGridData();
          console.log(data);
          this.packageobject = data['packageobject'];
          this.packdateobj = data['packdateobj'];
          this.packageMessage = data['message'];
          this.isSendDeleteMessage = this.packageMessage?.forcemsg;
          this.rowData1 = data['managepacklist_notexp'];
          this.rowData = data['smartcardlist'];
          this.subdetailsList = data['subscriberdetails']
          this.smartdetailList = data['smartcardlist']
          this.subscriberaccounts = data['subscriberaccounts'];
          this.smartcardinfo = data['smartcardinfo'];
          this.subPairedboxid = data['pairedboxid'];
          this.subdetails = data['subdetails'];
          this.statusdisplay = this.subdetailsList.statusdisplay
          this.subPairedsmartcard = data['pairedsmartcard'];
          this.message = data['message'];
          this.noofdays = this.subdetailsList.noofdays;
          // this.onGridReady('');
          // this.onGridReady1('');
          const totalRows = this.rowData1 ? this.rowData1.length : 0;
          if (totalRows > 10) {
            this.gridHeight = 600;
          } else if (totalRows > 3) {
            this.gridHeight = 400;
          }
          else {
            this.gridHeight = 'auto';
          }

          if (this.subdetailsList) {
            let item = this.subdetailsList
            if (!item.boxstatus) {
              if (!item.showPairUnpair || item.status == 0) {
                this.packagectivation = false;
              } else {
                this.packagectivation = true;
              }
            } else {
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
            }



            if (!item.boxstatus) {
              if (item.suspendstatus == 1 || item.showPairUnpair == 'false') {
                this.smartcardchange = true;
                this.boxchange = true;
              } else {
                this.smartcardchange = false;
                this.boxchange = false;
              }
            } else {
              this.smartcardchange = false;
              this.boxchange = false;
            }
            if (!item.boxstatus) {
              if (item.noofdays != 0 && (item.status == 1 || item.suspendstatus != 1) && !item.statussuspend) {
                this.suspend = false;
              } else {
                this.suspend = true;
              }
            }
            else {
              this.suspend = true;
            }


            if (!item.boxstatus) {
              if (item.status != 1 || item.suspendstatus == 1) {
                this.reactivation = true;
              } else {
                this.reactivation = false;
              }
            } else {
              this.reactivation = false;
            }

            if (item.status != 1 || item.suspendstatus == 1) {
              this.block = true;
            } else {
              this.block = false;
            }
            if ((!item.boxstatus && item.package_status === "Not Expired") && (item.status === 1 || item.suspendstatus != 1)) {
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
                this.pair = true;
              } else {
                this.pair = false;
              }
            } else {
              this.pair = true;
            }
            if (item.castypedisplay && item.showPairUnpair) {
              if (item.suspendstatus == 1) {
                this.unpair = true;
              } else {
                this.unpair = false;
              }
            } else {
              this.unpair = true;
            }

            if (!item.boxstatus && (item.status == 2 || item.status == 0 || item.suspendstatus == 1)) {
              this.deactive = true;
            } else {
              this.deactive = false;
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


            if (item.status == 2 || item.suspendstatus == 1) {
              this.base = true;
              this.rechargeType = true;
            } else {
              this.base = false;
              this.rechargeType = false;
            }
            if (item.boxstatus) {
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
              console.log('BASE PLAN ', item.baseplan);
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
    console.log('REFRESH');
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
          this.isSendDeleteMessage = this.packageMessage?.forcemsg;
          this.rowData1 = data['managepacklist_notexp'];
          console.log(this.rowData1);
          this.rowData = data['smartcardlist'];
          this.subdetailsList = data['subscriberdetails']
          this.smartdetailList = data['smartcardlist']
          this.subscriberaccounts = data['subscriberaccounts'];
          this.smartcardinfo = data['smartcardinfo'];
          this.statusdisplay = this.subdetailsList.statusdisplay
          this.subPairedboxid = data['pairedboxid'];
          this.subdetails = data['subdetails'];
          this.subPairedsmartcard = data['pairedsmartcard'];
          this.message = data['message'];

          const isBlocked = this.statusdisplay === "Blocked";

          const totalRows = this.rowData1 ? this.rowData1.length : 0;
          if (totalRows > 10) {
            this.gridHeight = 600;
          } else if (totalRows > 3) {
            this.gridHeight = 400;
          }
          else {
            this.gridHeight = 'auto';
          }
          this.noofdays = this.subdetailsList.noofdays;
          if (this.subdetailsList) {
            let item = this.subdetailsList
            if (!item.boxstatus) {
              if (!item.showPairUnpair || item.status == 0) {
                this.packagectivation = false;
              } else {
                this.packagectivation = true;
              }
            } else {
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
            }
            if (!item.boxstatus) {
              if (item.suspendstatus == 1 || item.showPairUnpair == 'false') {
                this.smartcardchange = true;
                this.boxchange = true;
              } else {
                this.smartcardchange = false;
                this.boxchange = false;
              }
            } else {
              this.smartcardchange = false;
              this.boxchange = false;
            }
            if (!item.boxstatus) {
              if (item.noofdays != 0 && (item.status == 1 || item.suspendstatus != 1) && !item.statussuspend) {
                this.suspend = false;
              } else {
                this.suspend = true;
              }
            }
            else {
              this.suspend = true;
            }

            if (!item.boxstatus) {
              if (item.status != 1 || item.suspendstatus == 1) {
                this.reactivation = true;
              } else {
                this.reactivation = false;
              }
            } else {
              this.reactivation = false;
            }

            if (item.status != 1 || item.suspendstatus == 1) {
              this.block = true;
            } else {
              this.block = false;
            }

            if ((!item.boxstatus && item.package_status === "Not Expired") && (item.status === 1 || item.suspendstatus != 1)) {
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
                this.pair = true;
              } else {
                this.pair = false;
              }
            } else {
              this.pair = true;
            }
            if (item.castypedisplay && item.showPairUnpair) {
              if (item.suspendstatus == 1) {
                this.unpair = true;
              } else {
                this.unpair = false;
              }
            } else {
              this.unpair = true;
            }

            if (!item.boxstatus && (item.status == 2 || item.status == 0 || item.suspendstatus == 1)) {
              this.deactive = true;
            } else {
              this.deactive = false;
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


            if (item.status == 2 || item.suspendstatus == 1) {
              this.base = true;
              this.rechargeType = true;
            } else {
              this.base = false;
              this.rechargeType = false;
            }
            if (item.boxstatus) {
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
              console.log('BASE PLAN ', item.baseplan);
              this.managePackagetable = false;
              this.managePackagetable1 = true;
            } else {
              this.managePackagetable = true;
              this.managePackagetable1 = false;
            }
          }
          // this.onGridReady('');
          this.reloadGridData();
          // window.location.reload();
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
    }
  }




  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80, filter: false
    },
    {
      headerName: 'PACKAGE NAME	',
      // field: 'productname', width: 300,  // jeya akka told change the name
      field: 'packagename', width: 300,
    },
    {
      headerName: 'SMARTCARD', width: 250,
      field: 'smartcard',
    },
    {
      headerName: 'CAS ', width: 250,
      field: 'casname',
    },
    {
      headerName: 'EXPIRY DATE	', width: 200,
      field: 'expirydate',
    },
    {
      headerName: 'ACTION', width: 240,
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
        });

        refreshButton.addEventListener('click', () => {
          this.refreshButton = params.data;
        });

        downloadButton.addEventListener('click', () => {
        });

        return container;
      },
    },

  ]
  columnDefs1: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true,
      checkboxSelection: true, isSelected: true, filter: false
    },
    {
      headerName: 'PACKAGE NAME	', width: 300, cellStyle: { textAlign: 'left' },
      field: 'productname',
    },

    {
      headerName: 'PRODUCT ID	', width: 360,
      field: 'casproductid',
    },
    {
      headerName: 'DAYS REMAINING	', width: 350, cellStyle: { textAlign: 'center' },
      field: 'noofdays',
    },
    {
      headerName: 'PROGRAMS', width: 400,
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
            this.openChannellistDialogue(params.data);
          });

          return container;
        } else {
          return null;
        }
      },
    },


  ]
  columnDefs2: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 100, headerCheckboxSelection: true, filter: false

    },
    {
      headerName: 'PACKAGE NAME	',
      field: 'productname', width: 300,
    },
    {
      headerName: 'PRODUCT TYPE	 ', width: 350, cellStyle: { textAlign: 'center' },
      field: 'ptype',
    },
    {
      headerName: 'PRODUCT ID	', width: 360, cellStyle: { textAlign: 'center' },
      field: 'casproductid',
    },
    {
      headerName: 'DAYS REMAINING	', width: 350, cellStyle: { textAlign: 'center' },
      field: 'noofdays',
    },
    {
      headerName: 'PROGRAMS', width: 400,
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
            this.openChannellistDialogue(params.data);
          });

          return container;
        } else {
          return null;
        }
      },
    },
  ]
  rowData1: any[] = [];
  rowData: any[] = [];
  manageData: any;
  onGridReady(params: any) {
    console.log('1111111 ongridready');
    this.gridApi = params.api;
    this.gridApi.forEachNode((node: any) => {
      if (node.data.ptype === 'BASE') {
        console.log(node.data);
        node.setSelected(true);
      }
    });
    // this.refreshTable();
    this.updatePaginationCount();
  }
  reloadGridData() {
    console.log('dfdsfdsfdf');
    if (this.gridApi) {
      this.gridApi.setRowData(this.rowData1);
    }
  }

  updatePaginationCount() {
    if (this.gridApi) {
      this.currentPageSize = this.gridApi.paginationGetPageSize();
      this.totalRowsCount = this.gridApi.paginationGetRowCount();
      console.log("Rows shown per page:", this.currentPageSize);
      console.log("Total filtered rows:", this.totalRowsCount);
    }
  }
  onGridReady1(params: any) {
    console.log('222 ongridready1');
    this.gridApi = params.api;
    params.api.selectAll()
    console.log(params.api.getSelectedRows());
    params.api.forEachNode((node: any) => {
      params.api.setNodesSelected({ node, newValue: true });
    });
    // this.refreshTable();
    this.updatePaginationCount();
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
      if (result && result.success) {
        this.smartcard = result.smartcard;
        location.reload();
      } else {
        console.log('Dialog closed without success');
      }
    });
  }

  openLoginPage(type: any) {
    let dialogData = {
      type: type || null,
      detailsList: this.subdetailsList || [],
      pairBoxlist: this.subPairedboxid || [],
      pairSmartcardlist: this.subPairedsmartcard || [],
      newsubid: this.subscriberid || null,
      subId: this.subdetailsList?.subid || null,
      plantype: this.packagePlan || null
    };
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

    const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
      data: dialogData,
      width: width
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.smartcard = result.smartcard;
        location.reload();
      } else {
        console.log('Dialog closed without success');
      }
    });
  }

  getNextDay(dateString: string): string | null {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  getNextDay1(): string | null {

    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  managePackage(type: string): void {
    let dialogData = { type: type, detailsList: this.subdetailsList, pairBoxlist: this.subPairedboxid, pairSmartcardlist: this.subPairedsmartcard, subSmartcarList: this.subdetailsList?.smartcard, subBoxList: this.subdetailsList?.boxid };
    const isDataInvalid = Object.values(dialogData).some(value => value === undefined || value === null);
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
      data: dialogData,
      maxHeight: '100vh'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.smartcard = result.smartcard;
        location.reload();
      } else {
        console.log('Dialog closed without success');
      }
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
      const defaultPlan = this.plantype$.getValue().find(plan => plan.key === '1month');
      if (defaultPlan) {
        this.plantype = defaultPlan.value;
      }
      this.isDisabled = false;

    }
    if (rechargetype == 2) {
      this.isplantype = false;
      this.datetype = true;
      this.plantype = 0;
      this.isDisabled = true;
      // this.f_date = this.subdetailsList.expiryDate;

    }
    if (rechargetype == 3) {
      this.dateTodate;
      this.isplantype = false;
      this.datetype = false;
      this.plantype = 0;
      this.f_date = null;
      this.isDisabled = false;

    }
    this.isRecharge = true;

  }

  onSelectiondatetype(selectedValue: string) {
    // this.cdr.detectChanges();
    const rechargetype = Number(selectedValue);
    console.log('selectrdvalue', selectedValue);

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

    if ((this.selectedRechargetype == '3') || (this.selectedRechargetype != '3' && this.plantype != 0) || (this.f_date)) {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }


  }
  onSelectionplantype(selectedValue: number) {
    console.log('selectrdvalue', selectedValue);
    if (selectedValue) {
      this.isplantype = true;
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
    // this.toggleConfirmation();
  }
  rechargetoggle1() {
    this.ManagePackageCalculation1();
    // this.toggleConfirmation();
  }
  toggleConfirmation() {
    this.confirmation = false;
    this.cancel_btn = false;
    this.isRecharge = true;
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
    this.userservice.getPdfSmartcardRechargeReport(this.role, this.username, event.smartcard).subscribe((x: Blob) => {
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


  getPdfCasformReport() {
    console.log(this.subdetailsList.subid || this.subscriberid);
    this.userservice.getPdfCasformReport(this.role, this.username, this.subdetailsList.subid || this.subscriberid).subscribe((x: Blob) => {
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
    // this.isRecharge = true;
    console.log('plandata', this.plandata);
    console.log(this.f_date);


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
    console.log("_______________________________________________________");

    this.userservice.ManagePackageCalculation(requestBody).subscribe((res: any) => {
      console.log(res.oldExpiryDate);
      this.manageData = res;
      this.isRecharge = false;
      this.confirmation = true;
      this.cancel_btn = true;
      setTimeout(() => {
        const dialogElement = document.querySelector('.confirmation-dialog');
        if (dialogElement) {
          dialogElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
      this.confirmation = true;
      this.cdr.detectChanges();
    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error?.selectedpacklist);
      if (err.status === 400) {
        this.confirmation = false;
        this.cancel_btn = false;

      }
    });
  }
  ManagePackageCalculation() {
    this.plandata = '';
    this.plandata = this.plantype || this.f_date || 4
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
    this.userservice.ManagePackageCalculation(requestBody).subscribe((res: any) => {
      console.log(res.oldExpiryDate);
      this.manageData = res;
      this.isRecharge = false;
      this.cancel_btn = true;
      this.confirmation = true;
      setTimeout(() => {
        const dialogElement = document.querySelector('.confirmation-dialog');
        if (dialogElement) {
          dialogElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
      this.confirmation = true;
      this.cdr.detectChanges();

    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error?.selectedpacklist);
      if (err.status === 400) {
        this.confirmation = false;
        this.cancel_btn = false;
      }
    });


    this.userservice.ManagePackageCalculation(requestBody).subscribe((res: any) => {
      console.log(res.oldExpiryDate);
      this.manageData = res;
      this.isRecharge = false;
      this.confirmation = true;
      this.cancel_btn = true;
      setTimeout(() => {
        const dialogElement = document.querySelector('.confirmation-dialog');
        if (dialogElement) {
          dialogElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
      this.confirmation = true;
      this.cdr.detectChanges();
    }, (err) => {
      this.swal.Error(err?.error?.message || err?.error?.selectedpacklist);
      if (err.status === 400) {
        this.confirmation = false;
        this.cancel_btn = false;

      }
    });

  }


}


