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
import jsPDF from 'jspdf';
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
  packdateobj: any;
  selectedmanpacknotexp: any;
  smartcardinfo: any;
  plantype: any;
  rechargetype: any;
  selectedRechargetype: any = 0;
  datetype = false;
  isplantype = false;
  dateTodate = 3;
  public rowSelection: any = "multiple";
  gridApi: any;
  selectedIds: number[] = [];
  selectedtypes: number[] = [];
  isAnyRowSelected: boolean = false;
  gridOptions = {
    defaultColDef: {
      // width: 205
    },
  }
  logindetails: boolean = true;
  casform: boolean = true;
  editDetails: boolean = true;
  ConfirmationReport: boolean = true;
  rows: any

  subscrierdashoard: boolean = false;
  newsubscrierdashoard: boolean = false;
  subscriersmartcarddashoard: boolean = false;
  expandale: boolean = false;

  subdashoard: any;
  newdashoard: any;
  subsmartcarddashoard: any;


  selectedTab: any = 'BASE';
  confirmation: boolean = false;
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
  packagactivation: boolean = false;
  refresh: boolean = false;
  reactivation: boolean = false;
  resumechange: boolean = false;
  boxchange: boolean = true;
  smartcardchange: boolean = true;
  plantypeSubject = new BehaviorSubject<{ [key: string]: number }>({});
  plantype$ = this.plantypeSubject.asObservable();
  packagePlan: any;
  billtype: number = 0;
  boxid: any;
  smartcardValue: any;
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
    let splitValues = this.subscriberid.split("**");

    this.boxid = splitValues[1];
    this.smartcardValue = splitValues[0];

    console.log("Box ID:", this.boxid);
    console.log("Smartcard Value:", this.smartcardValue);
  }
  ngAfterViewInit(): void {

  }
  onBillTypeChange() {
    this.billtype = this.billtype ? 1 : 0;
  }
  ngOnInit(): void {


    this.userservice.getActivePackagePlanList(this.role, this.username).subscribe((data: any) => {
      this.plantypeSubject.next(data);
      this.packagePlan = data;

    });
    this.userservice.getPlanTypeList(this.role, this.username).subscribe((data: any) => {
      this.rechargetype = Object.entries(data).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.rechargetype);

    })

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
  loadNewDashboard() {
    // for (let index = 0; index < 2; index++) {

    this.userservice.getNewsubscriberDetails(this.role, this.username, this.subscriberid || this.smartcard || this.boxid)
      .subscribe((data: any) => {
        console.log(data);
        this.newsubscrierdashoard = !this.newsubscrierdashoard;
        this.rowData = data['smartcardlist'];
        this.rowData1 = data['managepacklist_notexp'];
        this.subdetailsList = data['subscriberdetails'];
        this.subdetails = data['subdetails'];
        console.log('subdetails', this.subdetails);

        console.log(this.subdetailsList);
        this.subid = this.subdetailsList.subid;
        this.smartcard = this.subdetailsList.smartcard;
        console.log(this.subid);
        console.log(this.smartcard);
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

  loadSubscriberDashboard() {
    // for (let index = 0; index < 2; index++) {
    this.userservice.getQuickOperationDetailsBySearchname(this.role, this.username, (this.subscriberid || this.smartcardValue || this.boxid)).subscribe(
      (data: any) => {
        console.log(data);
        this.packageobject = data['packageobject'];
        this.packdateobj = data['packdateobj'];
        this.rowData1 = data['managepacklist_notexp'];
        console.log(this.rowData1);
        this.rowData = data['smartcardlist'];
        this.subdetailsList = data['subscriberdetails']
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
        if (this.rowData && Array.isArray(this.rowData)) {
          this.rowData.forEach(item => {
            if (item.castype !== 1) {
              this.boxchange = true;
              this.smartcardchange = true;
              this.unpair = true;
            } else {
              this.boxchange = false;
              this.smartcardchange = false;
              this.unpair = false;
            }
          });
        }
        console.log(this.subdetailsList);

        if (this.subdetailsList) {
          let item = this.subdetailsList
          if (item.status === 0 && item.boxstatus === false) {
            this.packagactivation = true;
          } else {
            this.packagactivation = false;
          }
          if (item.status === 2 && item.boxstatus === false) {
            this.activation = true;
          } else {
            this.activation = false;
          }
          if (item.boxstatus === false) {
            this.refresh = true;
          } else {
            this.refresh = false;
          }
          console.log('referesh checking ----'+this.refresh);
          

          if (item.status !== 1 && item.suspendstatus === 1 && item.boxstatus === true) {
            this.pinchange = false;
            this.pvrchange = false;
            this.sendmessage = false;
            // this.deletemessage = false;
            this.forcetuning = false;
            this.reactivation = false;
            this.block = false;
          }
          else {
            this.pinchange = true;
            this.pvrchange = true;
            this.sendmessage = true;
            // this.deletemessage = true;
            this.forcetuning = true;
            this.reactivation = true;
            this.block = true;
            console.log("this.pinchange", this.pinchange);
          }
          if (item.package_status === "Not Expired" && item.boxstatus === false) {
            this.cancelsubscription = false;
          } else {
            this.cancelsubscription = true;
          }
          if (item.showPairUnpair === true && item.suspendstatus != 1 && item.boxstatus === false) {
            this.unpair = true;
            this.pair = false;
          } else {
            this.unpair = false;
            this.pair = true;
          }
          if (item.suspendstatus !== 1 && item.statusSus === true && item.boxstatus === false) {
            this.resumechange = false;
          } else {
            this.resumechange = true;
          }
          if (item.statussuspend == false && item.noofdays > 1 && item.boxstatus === false) {
            this.suspend = false;
          } else {
            this.suspend = true;
          }
          if ((item.status == 0 || item.status == 2) && item.suspendstatus == 1 && item.boxstatus === false) {
            this.deactive = false;
          } else {
            this.deactive = true;
          }
          if (item.boxstatus === false) {
            this.expandale = true;
          } else {
            this.expandale = false;
          }
        }

        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Error fetching data:', error);
        // Swal.fire({
        //   title: 'Error!',
        //   text: error?.error?.message || 'Failed to fetch operation details. Please try again later.',
        //   icon: 'error',
        //   showConfirmButton: true
        // });
      }
    );
    // }
  }

  loadSmartcardDashboard() {
    for (let index = 0; index < 2; index++) {
      this.userservice.getQuickOperationDetailsBySmartcard(this.role, this.username, (this.smartcard || this.subscriberid || this.boxid)).subscribe(
        (data: any) => {
          this.cdr.detectChanges();
          console.log(data);
          this.packageobject = data['packageobject'];
          this.packdateobj = data['packdateobj'];
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
          // console.log('subdetails', this.subdetails);
          this.subPairedsmartcard = data['pairedsmartcard'];
          console.log(this.subPairedsmartcard);
          this.message = data['message'];
          if (this.rowData && Array.isArray(this.rowData)) {
            this.rowData.forEach(item => {
              if (item.castype !== 1) {
                this.boxchange = true;
                this.smartcardchange = true;
                this.unpair = true;
              } else {
                this.boxchange = false;
                this.smartcardchange = false;
                this.unpair = false;
              }
            });
          }
          if (this.subdetails) {
            let item = this.subdetails
            if (item.statusdisplay === 'Blocked') {
              this.expandale = false;
            }
          }
          // if (this.subdetailsList && Array.isArray(this.subdetailsList)) {
          if (this.subdetailsList) {
            let item = this.subdetailsList
            if (item.status === 0 && item.boxstatus === false) {
              this.packagactivation = true;
            } else {
              this.packagactivation = false;
            }
            if (item.status === 2 && item.boxstatus === false) {
              this.activation = true;
            } else {
              this.activation = false;
            }
            if (item.boxstatus === false) {
              this.refresh = true;
            } else {
              this.refresh = false;
            }
            console.log(item);
            if (item.status !== 1 && item.suspendstatus === 1 && item.boxstatus === true) {
              this.pinchange = false;
              this.pvrchange = false;
              this.sendmessage = false;
              this.forcetuning = false;
              this.reactivation = false;
              this.block = false;
            }
            else {
              this.pinchange = true;
              this.pvrchange = true;
              this.sendmessage = true;
              this.forcetuning = true;
              this.reactivation = true;
              this.block = true;
              console.log("this.pinchange", this.pinchange);
            }
            if (item.package_status === "Not Expired" && item.boxstatus === false) {
              this.cancelsubscription = false;
            } else {
              this.cancelsubscription = true;
            }
            if (item.showPairUnpair === true && item.suspendstatus != 1 && item.boxstatus === false) {
              this.unpair = true;
              this.pair = false;
            } else {
              this.unpair = false;
              this.pair = true;
            }
            if (item.showPairUnpair === false && item.suspendstatus === 1 && item.boxstatus === true) {
              this.smartcardchange = false;
              this.boxchange = false;
            } else {
              this.smartcardchange = true;
              this.boxchange = true;
            }
            if (item.suspendstatus !== 1 && item.statusSus === true && item.boxstatus === false) {
              this.resumechange = false;
            } else {
              this.resumechange = true;
            }
            if (item.statussuspend == false && item.noofdays > 1 && item.boxstatus === false) {
              this.suspend = false;
            } else {
              this.suspend = true;
            }
            if ((item.status === 0 || item.status === 2) && item.suspendstatus === 1 && item.boxstatus === false) {
              this.deactive = false;
            } else {
              this.deactive = true;
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
    for (let index = 0; index < 3; index++) {
      this.userservice.getQuickOperationDetailsBySmartcard(this.role, this.username, event.smartcard).subscribe(
        (data: any) => {
          this.cdr.detectChanges();
          console.log(data);
          this.packageobject = data['packageobject'];
          this.packdateobj = data['packdateobj'];
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
          console.log('subdetails', this.subdetails);
          this.subPairedsmartcard = data['pairedsmartcard'];
          console.log(this.subPairedsmartcard);
          this.message = data['message'];
          if (this.rowData && Array.isArray(this.rowData)) {
            this.rowData.forEach(item => {
              if (item.castype !== 1) {
                this.boxchange = true;
                this.smartcardchange = true;
                this.unpair = true;
              } else {
                this.boxchange = false;
                this.smartcardchange = false;
                this.unpair = false;
              }
            });
          }

          // if (this.subdetailsList && Array.isArray(this.subdetailsList)) {
          // if (this.subdetailsList) {
          //   let item = this.subdetailsList
          //   if (item.status === 0 && item.boxstatus === false) {
          //     this.packagactivation = true;
          //   } else {
          //     this.packagactivation = false;
          //   }
          //   if (item.status === 2 && item.boxstatus === false) {
          //     this.activation = true;
          //   } else {
          //     this.activation = false;
          //   }
          //   if (item.boxstatus === false) {
          //     this.refresh = true;
          //   } else {
          //     this.refresh = false;
          //   }
          //   console.log(item);
          //   // item.status = 0;
          //   // item.suspendstatus = 1;
          //   // item.boxstatus = false
          //   if (item.status !== 1 && item.suspendstatus === 1 && item.boxstatus === true) {
          //     this.pinchange = false;
          //     this.pvrchange = false;
          //     this.sendmessage = false;
          //     // this.deletemessage = false;
          //     this.forcetuning = false;
          //     this.reactivation = false;
          //     this.block = false;
          //   }
          //   else {
          //     this.pinchange = true;
          //     this.pvrchange = true;
          //     this.sendmessage = true;
          //     // this.deletemessage = true;
          //     this.forcetuning = true;
          //     this.reactivation = true;
          //     this.block = true;
          //     console.log("this.pinchange", this.pinchange);
          //   }
          //   if (item.package_status === "Not Expired" && item.boxstatus === false) {
          //     this.cancelsubscription = true;
          //   } else {
          //     this.cancelsubscription = false;
          //   }
          //   if (item.showPairUnpair === true && item.suspendstatus != 1 && item.boxstatus === false) {
          //     this.unpair = true;
          //     this.pair = false;
          //   } else {
          //     this.unpair = false;
          //     this.pair = true;
          //   }
          //   if (item.suspendstatus !== 1 && item.statusSus === true && item.boxstatus === false) {
          //     this.resumechange = false;
          //   } else {
          //     this.resumechange = true;
          //   }
          //   if (item.statussuspend == false && item.noofdays > 1 && item.boxstatus === false) {
          //     this.suspend = false;
          //   } else {
          //     this.suspend = true;
          //   }
          //   if ((item.status == 0 || item.status == 2) && item.suspendstatus == 1 && item.boxstatus === false) {
          //     this.deactive = false;
          //   } else {
          //     this.deactive = true;
          //   }
          // }
          if (this.subdetailsList) {
            let item = this.subdetailsList
            if (item.status === 0 && item.boxstatus === false) {
              this.packagactivation = true;
            } else {
              this.packagactivation = false;
            }
            if (item.status === 2 && item.boxstatus === false) {
              this.activation = true;
            } else {
              this.activation = false;
            }
            if (item.boxstatus === false) {
              this.refresh = true;
            } else {
              this.refresh = false;
            }
            console.log(item);
            if (item.status !== 1 && item.suspendstatus === 1 && item.boxstatus === true) {
              this.pinchange = false;
              this.pvrchange = false;
              this.sendmessage = false;
              this.forcetuning = false;
              this.reactivation = false;
              this.block = false;
            }
            else {
              this.pinchange = true;
              this.pvrchange = true;
              this.sendmessage = true;
              this.forcetuning = true;
              this.reactivation = true;
              this.block = true;
              console.log("this.pinchange", this.pinchange);
            }
            if (item.package_status === "Not Expired" && item.boxstatus === false) {
              this.cancelsubscription = false;
            } else {
              this.cancelsubscription = true;
            }
            if (item.showPairUnpair === true && item.suspendstatus != 1 && item.boxstatus === false) {
              this.unpair = true;
              this.pair = false;
            } else {
              this.unpair = false;
              this.pair = true;
            }
            if (item.showPairUnpair === false && item.suspendstatus === 1 && item.boxstatus === true) {
              this.smartcardchange = false;
              this.boxchange = false;
            } else {
              this.smartcardchange = true;
              this.boxchange = true;
            }
            if (item.suspendstatus !== 1 && item.statusSus === true && item.boxstatus === false) {
              this.resumechange = false;
            } else {
              this.resumechange = true;
            }
            if (item.statussuspend == false && item.noofdays > 1 && item.boxstatus === false) {
              this.suspend = false;
            } else {
              this.suspend = true;
            }
            if ((item.status === 0 || item.status === 2) && item.suspendstatus === 1 && item.boxstatus === false) {
              this.deactive = false;
            } else {
              this.deactive = true;
            }
          }
        },
        (error: any) => {
          console.error('Error fetching data:', error);

        }
      );
    }
  }
  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 80,
    },
    {
      headerName: 'SMARTCARD', width: 300,
      field: 'smartcard',
    },
    {
      headerName: 'CAS ',
      field: 'casname',
    },
    {
      headerName: 'EXPIRY DATE	',
      field: 'expirydate',
    },
    {
      headerName: 'ACTION', width: 250,
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
          this.openDialog('refresh');
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
      headerName: "S.No", valueGetter: 'node.rowIndex+1', width: 200, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: 'PACKAGE NAME	',
      field: 'productname', width: 300,
    },
    {
      headerName: 'PRODUCT TYPE	 ', width: 300,
      field: 'ptype',
    },
    {
      headerName: 'PRODUCT ID	', width: 250,
      field: 'casproductid',
    },
    {
      headerName: 'DAYS REMAINING	', width: 250,
      field: 'noofdays',
    },
    {
      headerName: 'PROGRAMS', width: 220,
      field: 'expirydate',
      cellRenderer: (params: any) => {
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
      },
    },
  ]
  rowData1: any[] = [];
  rowData: any[] = [];

  onSelectionChanged() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      this.isAnyRowSelected = selectedRows.length > 0;
      this.rows = selectedRows;
      console.log(this.rows);

    }
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }




  processData() {
    if (this.rowData && Array.isArray(this.rowData)) {
      this.rowData.forEach(item => {
        if (item.casname !== "RCAS") {
          this.boxchange = true;
          this.smartcardchange = true;
          this.unpair = true;
        } else {
          this.boxchange = false;
          this.smartcardchange = false;
          this.unpair = false;
        }
      });
    }

    if (this.subdetailsList) {
      let item = this.subdetailsList;
      this.packagactivation = item.status === 0;
      this.activation = item.status === 2;
      this.refresh = item.boxstatus === false;

      if (item.status !== 1 && item.suspendstatus === 1) {
        this.pinchange = true;
        this.pvrchange = true;
        this.sendmessage = true;
        this.forcetuning = true;
        this.reactivation = true;
        this.block = true;
      } else {
        this.pinchange = false;
        this.pvrchange = false;
        this.sendmessage = false;
        this.forcetuning = false;
        this.reactivation = false;
        this.block = false;
      }

      this.unpair = item.showPairUnpair === false;
      this.pair = !this.unpair;
      this.resumechange = !(item.suspendstatus !== 1 && item.statusSus === true);
      this.suspend = !(item.statussuspend === false && item.noofdays > 1);
      this.deactive = !(item.status === 0 || (item.status === 2 && item.suspendstatus === 1));
    }
  }

  onNoClick() {
    this.selectedTab = !this.selectedTab
  }
  selectTab(tab: string) {
    this.selectedTab = tab;
    this.openDialog('selectedTab');
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
    // let dialogData = {};
    // switch (type) {
    //   case 'editDetails':
    //     dialogData = { isEditSubscriberDetails: true, detailsList: this.subdetailsList };
    //     break;
    // }
    let dialogData = { type: type, detailsList: this.subdetailsList, };

    const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
      width: '1000px',
      panelClass: 'custom-dialog-container',
      data: dialogData
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
    let dialogData = { type: type, detailsList: this.subdetailsList, pairBoxlist: this.subPairedboxid, pairSmartcardlist: this.subPairedsmartcard, plantype: this.packagePlan, subSmartcarList: this.subdetailsList?.smartcard, subBoxList: this.subdetailsList?.boxid };
    const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
      width: '500px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  openDialog(type: string): void {

    let width = '500px';
    if (type === 'addSmartcard') {
      // dialogConfig.height = '1000px'; 
      width = '350px';
    } else if (type === 'editDetails') {
      width = '1000px';
    } else if (type === 'refresh') {
      width = '500px';
    }

    let dialogData = { type: type, detailsList: this.subdetailsList, newsubid: this.subscriberid, subId: this.subdetailsList.subid, pairBoxlist: this.subPairedboxid, pairSmartcardlist: this.subPairedsmartcard, plantype: this.packagePlan };
    const dialogRef = this.dialog.open(SubscriberdialogueComponent, {
      data: dialogData,
      width: width
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
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
    console.log(selectedValue);
  }
  rechargetoggleConfirmation() {
    this.ManagePackageCalculation();
  }
  rechargetoggle() {
    this.ManagePackageCalculation();
    this.toggleConfirmation();
  }
  toggleConfirmation() {
    this.confirmation = !this.confirmation;
  }
  recharge() {

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

    this.userservice.getPdfBillReport(this.role, this.username, this.subdetailsList.subid, event.smartcard).subscribe((x: any) => {
      Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we process your request.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });
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
    this.userservice.getPdfCasformReport(this.role, this.username, this.subdetailsList.subid)
    .subscribe((x: Blob) => {
      // Log request body
      let requestBodylogs: requestBodylogs = {
        access_ip: "", 
        action: "PDF CAS Form Report", 
        data: "From Date", 
        remarks: "PDF CAS Form Report"
      };
      console.log(requestBodylogs);
      
      // Create a blob and download the PDF
      const blob = new Blob([x], { type: 'application/pdf' });
      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.download = "PDF CAS Form Report.pdf";
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      // Clean up the URL object after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    },
    (error: any) => {
      // Handle any errors in report generation
      Swal.fire({
        title: 'Error!',
        text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    });
}


  ManagePackageCalculation() {
    let requestBody = {
      role: this.role,
      username: this.username,
      plantype: this.selectedRechargetype,
      plan: this.plantype,
      smartcard: this.subdetailsList.smartcard,
      type: 10,
      managepacklist: this.rowData1,
      selectedpacklist: this.rows,
      retailerid: 0
    }
    console.log(requestBody);
    this.userservice.ManagePackageCalculation(requestBody).subscribe((res: any) => {
      this.swal.success(res?.message);
      console.log(res);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
}


