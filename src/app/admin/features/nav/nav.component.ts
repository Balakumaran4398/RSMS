import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { DataService } from 'src/app/_core/service/Data.service';
import { AuthService } from 'src/app/_core/service/auth.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit, AfterViewInit {
  activeMenu: string = '';
  activeItem: any;
  isHide: any = true;
  currentTime: any = new Date();
  control = new FormControl();
  isSystem: boolean = true;
  ismobile: boolean = false;
  isSidebarOpen = false;
  isSidebarlogo = false;
  isLoginPage: boolean = false;
  subscriberList: any[] = [];
  showDropdown: boolean = true;
  showLogoutDropdown: boolean = true;
  role: any;
  username: any;
  tempUsername: any;
  tempPassword: any;
  subscriber: any;
  searchname: any;
  lcomember: any = '';
  userRole: any;

  isUser: boolean = false;
  isReception: boolean = false;
  isSpecial: boolean = false;
  isInventory: boolean = false;
  isCustomerService: boolean = false;
  isServiceCenter: boolean = false;
  isOperator: boolean = false;
  isSubLco: boolean = false;
  isSubscriber: boolean = false;
  isDropdownOpen: boolean = false;
  isSearch: boolean = false;

  msoLogo: any;
  msoName: any;
  isPopupVisible = false;

  activeTab: string = '';
  subscriberid: any;

  lcoDeatails: any;
  operatorId: any;
  operatorname: any;
  contact: any;
  operatorBalance: any;
  distributor: boolean = false;
  isLco: boolean = false;
  istopsubscription: boolean = false;
  isInventoryUpload: boolean = false;
  isVersion: boolean = false;
  islcorecharge: boolean = false;
  navigationList: any = {};
  navigationList1: any = {};
  SublcopermissionObj: any;
  SublcoReport: any;
  retailername: any;
  subscribername: any;
  signInform: { username: string; password: string } = { username: '', password: '' };
  tempLoggerPass: any;
  errorMessage = '';
  timeout: any;
  msoContact: any;

  constructor(private router: Router, private breakpointObserver: BreakpointObserver, private cd: ChangeDetectorRef, private dataService: DataService, private cdr: ChangeDetectorRef, private userservice: BaseService, private storageservice: StorageService, private authService: AuthService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    this.tempUsername = storageservice.getLoggerName();
    this.tempPassword = storageservice.getLoggerPass();
    console.log(this.tempUsername);
    console.log(this.tempPassword);
    if (this.isOpNavigate) {
      console.log(this.isOpNavigate);

      this.login('/admin/operator_details');
    }
    this.navigationList = storageservice.getNavigationList();
    // this.navigationList = this.navigationList1;
    console.log(this.navigationList);
    console.log(this.navigationList1);



    this.isLco = storageservice.getIsLCO();
    this.islcorecharge = storageservice.getIsLCO_Recharge();
    this.istopsubscription = storageservice.getIsTopSubscription();
    this.isInventoryUpload = storageservice.getIsInventoryUpload();
    this.isVersion = storageservice.getIsVersion();
    console.log('lco recharge',this.islcorecharge);
    console.log('top subscription',this.istopsubscription);
    console.log('inventory upload',this.isInventoryUpload);
    console.log('version',this.isVersion);
    

    if (this.role.includes('ROLE_ADMIN')) {
      console.log('111111111111--------------Admin');
      this.isUser = true;
      this.isReception = false;
      this.isSpecial = false;
      this.isCustomerService = false;
      this.isServiceCenter = false;
      this.isOperator = false;
      this.isSubLco = false;
      this.isSubscriber = false;
      this.role = 'ROLE_ADMIN';
    } else if (this.role.includes('ROLE_RECEPTION')) {
      this.isReception = true;
      this.isUser = false;
      this.isSpecial = false;
      this.isCustomerService = false;
      this.isServiceCenter = false;
      this.isOperator = false;
      this.isSubLco = false;
      this.isSubscriber = false;
      this.role = 'ROLE_RECEPTION';
    } else if (this.role.includes('ROLE_SPECIAL')) {
      this.isReception = false;
      this.isUser = false;
      this.isSpecial = true;
      this.isCustomerService = false;
      this.isServiceCenter = false;
      this.isOperator = false;
      this.isSubLco = false;
      this.role = 'ROLE_SPECIAL';
    } else if (this.role.includes('ROLE_INVENTORY')) {
      this.isInventory = true;
      this.isReception = false;
      this.isUser = false;
      this.isSpecial = false;
      this.isCustomerService = false;
      this.isServiceCenter = false;
      this.isOperator = false;
      this.isSubLco = false;
      this.isSubscriber = false;
      this.role = 'ROLE_INVENTORY';
    } else if (this.role.includes('ROLE_CUSSERVICE')) {
      this.isInventory = false;
      this.isReception = false;
      this.isUser = false;
      this.isSpecial = false;
      this.isCustomerService = true;
      this.isServiceCenter = false;
      this.isOperator = false;
      this.isSubLco = false;
      this.isSubscriber = false;
      this.role = 'ROLE_CUSSERVICE';
    } else if (this.role.includes('ROLE_SERVICECENTER')) {
      this.isInventory = false;
      this.isReception = false;
      this.isUser = false;
      this.isSpecial = false;
      this.isCustomerService = false;
      this.isServiceCenter = true;
      this.isSearch = true;
      this.isOperator = false;
      this.isSubLco = false;
      this.isSubscriber = false;
      this.role = 'ROLE_SERVICECENTER';
    } else if (this.role.includes('ROLE_OPERATOR')) {
      console.log('111111111111--------------Operator');
      this.isInventory = false;
      this.isReception = false;
      this.isUser = false;
      this.isSpecial = false;
      this.isCustomerService = false;
      this.isServiceCenter = false;
      this.isSearch = false;
      this.isOperator = true;
      this.isSubLco = false;
      this.isSubscriber = false;
      this.role = 'ROLE_OPERATOR';
      this.operatorIdoperatorId();
    } else if (this.role.includes('ROLE_SUBLCO')) {
      this.isInventory = false;
      this.isReception = false;
      this.isUser = false;
      this.isSpecial = false;
      this.isCustomerService = false;
      this.isServiceCenter = false;
      this.isSearch = false;
      this.isOperator = false;
      this.isSubLco = true;
      this.isSubscriber = false;
      this.role = 'ROLE_SUBLCO';
    } else if (this.role.includes('ROLE_SUBSCRIBER')) {
      this.isInventory = false;
      this.isReception = false;
      this.isUser = false;
      this.isSpecial = false;
      this.isCustomerService = false;
      this.isServiceCenter = false;
      this.isSearch = false;
      this.isOperator = false;
      this.isSubLco = false;
      this.isSubscriber = true;
      this.role = 'ROLE_SUBSCRIBER';
      this.getSubscriberDetails();
    }
  }

  subLCOdetails() {
    this.userservice.getSublcoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      this.SublcopermissionObj = this.lcoDeatails?.permissionlist;
      this.retailername = this.lcoDeatails?.retailername;
      this.SublcoReport = this.SublcopermissionObj?.report;
      console.log('eresuofhdljkfhdsjkfhnsjdhfdjsfh', this.SublcopermissionObj);
      console.log('REFRESH', this.SublcoReport);
      this.contact = this.lcoDeatails?.contactnumber;

    })
  }
  getSubscriberDetails() {
    this.userservice.getSubscriberDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      console.log('22222222');
      this.lcoDeatails = data;
      console.log('SUBSCRIBER DETAILS', this.lcoDeatails);
      this.subscriberid = this.lcoDeatails.subid;
      this.subscribername = this.lcoDeatails.subscribername;
      this.contact = this.lcoDeatails?.contactnumber;

      console.log('this.subscriberid', this.subscriberid);
    })
  }
  ngOnInit() {
    // const hasReloaded = localStorage.getItem('hasReloaded');
    // if (!hasReloaded) {
    //   localStorage.setItem('hasReloaded', 'true');
    //   setTimeout(() => {
    //     location.reload();
    //   }, 3000);
    // }
    // console.log('erewr43543543', hasReloaded);
    this.checkDeviceType();
    const sidemenuLinks = document.querySelectorAll('.side-menu li a');
    sidemenuLinks.forEach(link => {
      link?.classList?.remove('active');
      link.addEventListener("click", () => {
        sidemenuLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
      });
    });
    this.msoDetails();
    this.checkScreenSize();
    if (this.role == 'ROLE_SUBLCO') {
      console.log('ROLE', this.role);
      this.subLCOdetails();
    }
    const isOpFlag = sessionStorage.getItem('isOpNavigate');
    if (isOpFlag === 'true' && this.role === 'ROLE_ADMIN') {
      this.login1('/admin/operator_details');
      sessionStorage.removeItem('isOpNavigate');

    } else {
      console.log('Flag not set or role mismatch — not logging in.');
    }
  }
  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      this.operatorId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.operatorBalance = this.lcoDeatails?.balance;
      this.distributor = this.lcoDeatails?.isdistributor;
      this.contact = this.lcoDeatails?.contactnumber;
    })
  }

  msoDetails() {
    this.userservice.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      this.msoLogo = `${data.msoLogo}`;
      // this.msoName = `${data.msoName}`;
      this.msoName = data.msoName.includes('AJK') ? 'AJK' : '';
      this.msoContact = data.msoContact;

    })
  }
  setActiveList(event: Event, tabName: string) {
    this.activeTab = tabName;
  }

  setActiveLinkList(event: Event, tabName: string) {
    this.activeTab = tabName;
  }
  setActive(event: any): void {
    const dropdownLinks = document.querySelectorAll('.side-dropdown li a');
    dropdownLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
  }
  setActiveTab(event: Event) {
    const activeTabs = document.querySelectorAll('.side-menu li a.active');
    activeTabs.forEach((tab) => {
      tab.classList.remove('active');
    });
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
  }
  setActiveLinkTab(event: Event) {
    // const activeTabs = document.querySelectorAll('.side-dropdown a.active');
    const activeTabs = document.querySelectorAll('.side-dropdown li a.active');
    activeTabs.forEach((tab) => {
      tab.classList.remove('active');
    });
    const activeNavLinks = document.querySelectorAll('.nav-link');
    activeNavLinks.forEach((link) => link.classList.remove('active'));

    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
  }

  setActiveLinkTabList(event: Event) {
    // Remove active class from previously selected side-dropdown links
    const activeTabs = document.querySelectorAll('.side-dropdown li a.active');
    activeTabs.forEach((tab) => tab.classList.remove('active'));

    // Remove active class from main nav links when a side-dropdown link is clicked
    const activeNavLinks = document.querySelectorAll('.nav-link.active');
    activeNavLinks.forEach((link) => link.classList.remove('active'));

    // Add active class to the clicked side-dropdown link
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
  }

  setActiveLinkListTab(event: Event) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));

    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
  }

  setActiveLink(event: Event) {
    const activeTabs = document.querySelectorAll('li.active');
    activeTabs.forEach((tab) => {
      tab.classList.remove('active');
    });
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
  }

  onsubscriberlist(value: any) {
    this.showDropdown = true;
    this.userservice.getSearchDetailsSubscriber(this.role, this.username, value).subscribe((data: any) => {
      if (!data || Object.keys(data).length === 0) {
        this.subscriberList = [];
        return;
      }
      this.subscriber = data;
      this.subscriberList = Object.keys(data).map(key => {
        const value = data[key];
        const name = key;
        return { name: name, value: value };
      });
      this.subscriberList.sort((a: any, b: any) => {
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
        return 0;
      });
      if (this.subscriberList.length === 0) {
        console.log('No matching data after sorting');
        Swal.fire({
          title: 'No Matching Results',
          text: 'No subscribers match your search criteria.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
      console.log(this.subscriberList);
    },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: error?.error?.getsmartcardlistbysubid.searchname || 'An error occurred while fetching subscriber details.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  signOut() {
    this.toggleButton();

  }
  logout() {
    sessionStorage.clear();
    this.router.navigate([`/`]);
  }
  toggleButton() {

  }
  toggleDrop() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  highlightMatch(text: any, search: any): string {
    if (!search) {
      return text;
    }
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, `<strong>$1</strong>`);
  }


  goToSubscriberDashboard(lcomember: any) {
    this.lcomember = lcomember.value;
    console.log('Selected value:', this.lcomember);
    const targetUrl = `/admin/subscriber-full-info/${this.lcomember}//dashboard`;

    if (this.router.url === targetUrl) {
      window.location.reload();
    } else {
      this.router.navigate([targetUrl]).then(() => {
        console.log('Navigated to:', targetUrl);
        window.location.reload();
      });
    }
    this.showDropdown = false;
  }

  checkDeviceType(): void {
    const width = window.innerWidth;
    if (width <= 412) {
      this.ismobile = true;
      this.isSystem = false;

    } else {
      this.ismobile = false;
      this.isSystem = true;

    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }
  checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  ngAfterViewInit(): void {


    const sidebar = document.getElementById('sidebar');
    const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
    // console.log(allDropdown);
    allDropdown.forEach((item: Element) => {
      const a: HTMLElement | null | any = item.parentElement?.querySelector('a:first-child');
      if (a) {
        a.addEventListener('click', function (this: HTMLElement, e: MouseEvent) {
          e.preventDefault();
          if (!this.classList.contains('active')) {
            allDropdown.forEach((i: Element) => {
              const aLink: HTMLElement | null | any = i.parentElement?.querySelector('a:first-child');
              if (aLink) {
                aLink.classList.remove('active');
              }
              i.classList.remove('show');
            });
          }
          this.classList.toggle('active');
          item.classList.toggle('show');
        });
      }
    });

    // SIDEBAR COLLAPSE
    const toggleSidebar = document.querySelector('#nav .toggle-sidebar');
    const allSideDivider = document.querySelectorAll('#sidebar .divider');
    if (sidebar?.classList?.contains('hide')) {
      allSideDivider.forEach(item => {
        item.textContent = '-'
      })
      allDropdown.forEach((item: any) => {
        const a = item.parentElement.querySelector('a:first-child');
        a.classList.remove('active');
        item.classList.remove('show');
      })
    } else {
      this.isHide = false;
      allSideDivider.forEach((item: any) => {
        item.textContent = item.dataset.text;
      })
      this.cdr.detectChanges();
    }
    toggleSidebar?.addEventListener('click', () => {
      this.isHide = sidebar?.classList.toggle('hide');
      this.cdr.detectChanges();
      if (sidebar?.classList?.contains('hide')) {
        allSideDivider.forEach(item => {
          item.textContent = '-'
        })
        allDropdown.forEach((item: any) => {
          const a = item.parentElement.querySelector('a:first-child');
          a.classList.remove('active');
          item.classList.remove('show');
        })
      } else {
        allSideDivider.forEach((item: any) => {
          item.textContent = item.dataset.text;
        })
      }
    })

    // Function to toggle dropdown menu
    function toggleDropdown(dropdownMenu: any, toggleArrow: any) {
      dropdownMenu?.classList.toggle("show");
      toggleArrow?.classList.toggle("arrow");
    }

    // Function to close all dropdown menus
    function closeAllDropdowns() {
      const dropdowns = document.querySelectorAll('.dropdown');
      const arrows = document.querySelectorAll('.arrow');
      dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
      arrows.forEach(arrow => arrow.classList.remove('arrow'));
    }

    // Event listener for dropdown button 1
    document.getElementById("btn1")?.addEventListener("click", function (event) {
      event.stopPropagation();
      closeAllDropdowns();
      const dropdownMenu = document.getElementById("dropdown1");
      const toggleArrow = document.querySelector('#btn1 .arrow');
      toggleDropdown(dropdownMenu, toggleArrow);
    });

    // Event listener for dropdown button 2
    document.getElementById("btn2")?.addEventListener("click", function (event) {
      event.stopPropagation();
      closeAllDropdowns();
      const dropdownMenu = document.getElementById("dropdown2");
      const toggleArrow = document.querySelector('#btn2 .arrow');
      toggleDropdown(dropdownMenu, toggleArrow);
    });

    // Event listener for dropdown button 3
    document.getElementById("btn3")?.addEventListener("click", function (event) {
      event.stopPropagation();
      closeAllDropdowns();
      const dropdownMenu = document.getElementById("dropdown3");
      const toggleArrow = document.querySelector('#btn3 .arrow');
      toggleDropdown(dropdownMenu, toggleArrow);
    });

    // Close dropdowns when document is clicked
    document.addEventListener("click", function () {
      closeAllDropdowns();
    });


    // ===============logout=============


    const logoutButton = document.querySelector(".logout") as HTMLElement;
    const popup = document.getElementById("popup1") as HTMLElement;
    const closeButton = document.querySelector(".close") as HTMLElement;

    if (logoutButton && popup) {
      logoutButton.addEventListener("click", function () {
        popup.style.display = "flex";
      });
    }

    if (closeButton && popup) {
      closeButton.addEventListener("click", function () {
        popup.style.display = "none";
      });
    }



    // -----------------------------------_Voice search-----------------------

    // const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // if (!SpeechRecognition) {
    //   alert('Speech Recognition is not supported in your browser.');
    //   return;
    // }

    // const recognition = new SpeechRecognition();
    // recognition.continuous = true;
    // recognition.lang = 'en-US';
    // recognition.interimResults = false;

    // const output = document.querySelector("#output");
    // // const startBtn = document.querySelector("#start-btn");
    // // const stopBtn = document.querySelector("#stop-btn");
    // const startBtn: HTMLElement | null = document.getElementById('stop-btn');
    // const stopBtn: HTMLElement | null = document.getElementById('start-btn');

    // if (startBtn && stopBtn) {
    //   startBtn.addEventListener("click", () => {
    //     startBtn.style.display = 'none';
    //     stopBtn.style.display = 'inline';
    //     console.log('Start Button:', startBtn);
    //     recognition.start();
    //   });

    //   stopBtn.addEventListener("click", () => {
    //     stopBtn.style.display = 'none';
    //     startBtn.style.display = 'inline';
    //     console.log('Stop Button:', stopBtn);
    //     recognition.stop();
    //   });
    // }
    // console.log('OUTPUT:', output);

    // recognition.addEventListener("result", (event: any) => {
    //   const transcript = Array.from(event.results)
    //     .map((result: any) => result[0].transcript)
    //     .join("")
    //     .toLowerCase()
    //     .trim();

    //   console.log("🗣️ Transcript:", transcript);

    //   if (output) {
    //     output.textContent = transcript;
    //     console.log(output);

    //   }
    //   const navigateIfMatch = (keyword: string, path: string) => {
    //     if (transcript.includes(keyword)) {
    //       // recognition.stop();
    //       this.navgetToUrl(path);
    //     }
    //   };
    //   if (this.isUser) {
    //     navigateIfMatch("dashboard", "/home");
    //     navigateIfMatch("top subscription", this.username === 'manikandan' ? "/top_sub_detail" : "/top_subscription");
    //     navigateIfMatch("operator details", this.username === 'manikandan' ? "/operator_details" : "/lco_recharge/1");
    //     navigateIfMatch("lco recharge", "/lco_recharge/2");
    //     navigateIfMatch("admin recharge", "/lco_recharge/3");
    //     navigateIfMatch("create subscriber", "/Create_sub");
    //     navigateIfMatch("subscriber details", "/subscriber");
    //     navigateIfMatch("expiry", "/expiry");
    //     navigateIfMatch("not allocated", "/not_allacate_smartcard");
    //     navigateIfMatch("allocated", "/not_allacate_smartcard");
    //     navigateIfMatch("de allocation", "/smartcard_declaration");
    //     navigateIfMatch("re allocation", "/smartcard_reallocation");
    //     navigateIfMatch("defective", "/defective_smart");
    //     navigateIfMatch("insert", "/insert_sub");
    //     navigateIfMatch("fingerprint", "/finger_print");
    //     navigateIfMatch("scrolling", "/scrolling");
    //     navigateIfMatch("message", "/message");
    //     navigateIfMatch("force", "/fource_tuning");
    //     navigateIfMatch("mail", "/mail");
    //     navigateIfMatch("log", "/logs");
    //     navigateIfMatch("broadcaster", "/Broadcast");
    //     navigateIfMatch("distributor", "/Distributer");
    //     navigateIfMatch("channeltype", "/Channeltype");
    //     navigateIfMatch("category", "/categery");
    //     navigateIfMatch("channel", "/Channel");
    //     navigateIfMatch("package creation", "/PackageCreation");
    //     navigateIfMatch("addon", "/Addon");
    //     navigateIfMatch("reference", "/PackageReference");
    //     navigateIfMatch("package master", "/PackageMaster");
    //     if (transcript.includes("lco commission")) {
    //       recognition.stop();
    //       if (this.username === 'manikandan' && this.navigationList.lcocommission) {
    //         this.navgetToUrl('/LcoCommission');
    //       } else {
    //         this.navgetToUrl('/LcoCommission_credential');
    //       }
    //     }
    //     navigateIfMatch("discount", "/lcoCommissionDashboard");
    //     navigateIfMatch("packagewise", "/PackagewiseOperator");
    //     navigateIfMatch("vc or chip ID", "/chipid");
    //     navigateIfMatch("subscriber import", "/subscriber_import");
    //     navigateIfMatch("activation", "/activation");
    //     navigateIfMatch("deactivation", "/deactivation");
    //     navigateIfMatch("bulksmartcardrefresh", "/smartcard_refresh");
    //     navigateIfMatch("addon", "/addon_activation");
    //     navigateIfMatch("alacarte", "/Alacarte_Activation");
    //     navigateIfMatch("bulkpackageupdation", "/Bulk_Package_Updation");
    //     navigateIfMatch("bulk operator", "/bulk_smartcard_creation");
    //     navigateIfMatch("subscription extend", "/Subscription_Extend");
    //     navigateIfMatch("bulk base change", "/Bulk_Base_Change");
    //     navigateIfMatch("bulk reactive", "/Bulk_Refresh");
    //     navigateIfMatch("recurring", "/Recurring");
    //     navigateIfMatch("lco transfer", "/special_lcotransfer");
    //     navigateIfMatch("local broadcasting", "/payment_channel");
    //     navigateIfMatch("payment channel ", "/payment_channel");
    //     navigateIfMatch("local broadcaster", "/local_payment");
    //     navigateIfMatch("trai", "/traiReports");
    //     navigateIfMatch("mso", "/msoReports");

    //     navigateIfMatch("invoice bill", "/msodialogueReports/lcoinvoice");

    //     navigateIfMatch("deduction including gst", "/msodialogueReports/recharge_deduction_including");
    //     navigateIfMatch("recharge history", "/msodialogueReports/recharge_history");
    //     navigateIfMatch("online payment", "/msodialogueReports/online_payment_special");
    //     navigateIfMatch("wallet share", "/msodialogueReports/walletShare");
    //     navigateIfMatch("payment collection", "/msodialogueReports/payment_collection_AJK");
    //     navigateIfMatch("subscriber bill", "/msodialogueReports/subscriber_bill");
    //     navigateIfMatch("user recharge", "/msodialogueReports/user_rechargehistory");

    //     navigateIfMatch("lcowiseactivesubscriptioncount", "/msodialogueReports/lco_active_subscription");
    //     navigateIfMatch("customer activation form", "/msodialogueReports/customer_activation_form");
    //     navigateIfMatch("lcowiseexpirycountdifference", "/msodialogueReports/lcowiseExpiryCountDiff");

    //     navigateIfMatch("total lco", "/msodialogueReports/total_lco");
    //     navigateIfMatch("lcotransferdetails", "/msodialogueReports/lco_transfer_details");
    //     navigateIfMatch("repairsmartcard", "/msodialogueReports/repair_smartcard");

    //     navigateIfMatch("monthly broadcaster", "/broadcasterReports/1");
    //     navigateIfMatch("over all product", "/broadcasterReports/2");
    //     navigateIfMatch("universal count", "/broadcasterReports/3");
    //     navigateIfMatch("base product", "/broadcasterReports/4");
    //     navigateIfMatch("caswise", "/broadcasterReports/5");

    //     navigateIfMatch("all service", "/historyAllReports/1");
    //     navigateIfMatch("total smartcard list", "/historyAllReports/2");
    //     navigateIfMatch("paired smartcard", "/historyAllReports/3");
    //     navigateIfMatch("block list", "/historyAllReports/4");
    //     navigateIfMatch("combo package", "/historyAllReports/14");

    //     navigateIfMatch("as on date suspend", "/historyAllReports/14");
    //     navigateIfMatch("suspend report for particular duration", "/historyAllReports/12");
    //     navigateIfMatch("suspend history", "/historyAllReports/13");

    //     navigateIfMatch("scroll history", "/historyAllReports/12");
    //     navigateIfMatch("mail history", "/historyAllReports/6");
    //     navigateIfMatch("finger history", "/historyAllReports/7");
    //     navigateIfMatch("message history", "/historyAllReports/8");

    //     navigateIfMatch("network smartcard status count", "/historyAllReports/9");
    //     navigateIfMatch("network smartcard active deactive status count ", "/historyAllReports/10");

    //     navigateIfMatch("channel ageing", "/broadcasterReports/6");
    //     navigateIfMatch("package ageing", "/broadcasterReports/7");

    //   }
    //   else if (this.isInventory) {
    //     navigateIfMatch("inventory", "/inventor_inventory");
    //     if (transcript.includes("license extend")) {
    //       recognition.stop();
    //       if (this.username === 'manikandan' && this.isLco) {
    //         this.navgetToUrl('/inventory_cortonbox_data');
    //       } else {
    //         this.navgetToUrl('/inventory_license');
    //       }
    //     }
    //     navigateIfMatch("carton box upload", "/inventory_cortonbox");
    //   } else if (this.isReception) {
    //     navigateIfMatch("dashboard", "/home");
    //     navigateIfMatch("top subscription", this.username === 'manikandan' ? "/top_sub_detail" : "/top_subscription");
    //     navigateIfMatch("operator details", this.username === 'manikandan' ? "/operator_details" : "/lco_recharge/1");
    //     navigateIfMatch("lco recharge", "/lco_recharge/2");
    //     navigateIfMatch("admin recharge", "/lco_recharge/3");
    //     navigateIfMatch("create subscriber", "/Create_sub");
    //     navigateIfMatch("subscriber details", "/subscriber");
    //     navigateIfMatch("expiry details", "/expiry");
    //     navigateIfMatch("not allocated", "/not_allacate_smartcard");
    //     navigateIfMatch("allocated", "/not_allacate_smartcard");
    //     navigateIfMatch("de allocation", "/smartcard_declaration");
    //     navigateIfMatch("re allocation", "/smartcard_reallocation");
    //     navigateIfMatch("defective smartcard", "/defective_smart");
    //     navigateIfMatch("insert into subscriber", "/insert_sub");
    //     navigateIfMatch("stbmaster", "/smrt_boxid_change");
    //     navigateIfMatch("trai reports", "/traiReports");
    //     navigateIfMatch("mso reports", "/msoReports");
    //     navigateIfMatch("log", "/logs");
    //     navigateIfMatch("invoice bill", "/msodialogueReports/lcoinvoice");
    //     navigateIfMatch("deduction including gst", "/msodialogueReports/recharge_deduction_including");
    //     navigateIfMatch("recharge history", "/msodialogueReports/recharge_history");
    //     navigateIfMatch("online payment", "/msodialogueReports/online_payment_special");
    //     navigateIfMatch("wallet share", "/msodialogueReports/walletShare");
    //     navigateIfMatch("payment collection", "/msodialogueReports/payment_collection_AJK");
    //     navigateIfMatch("subscriber bill", "/msodialogueReports/subscriber_bill");
    //     navigateIfMatch("user recharge", "/msodialogueReports/user_rechargehistory");

    //     navigateIfMatch("lcowiseactivesubscriptioncount", "/msodialogueReports/lco_active_subscription");
    //     navigateIfMatch("customer activation form", "/msodialogueReports/customer_activation_form");
    //     navigateIfMatch("lcowiseexpirycountdifference", "/msodialogueReports/lcowiseExpiryCountDiff");

    //     navigateIfMatch("total lco", "/msodialogueReports/total_lco");
    //     navigateIfMatch("lcotransferdetails", "/msodialogueReports/lco_transfer_details");
    //     navigateIfMatch("repairsmartcard", "/msodialogueReports/repair_smartcard");

    //     navigateIfMatch("monthly broadcaster", "/broadcasterReports/1");
    //     navigateIfMatch("over all product", "/broadcasterReports/2");
    //     navigateIfMatch("universal count", "/broadcasterReports/3");
    //     navigateIfMatch("base product", "/broadcasterReports/4");
    //     navigateIfMatch("caswise", "/broadcasterReports/5");

    //     navigateIfMatch("all service", "/historyAllReports/1");
    //     navigateIfMatch("total smartcard list", "/historyAllReports/2");
    //     navigateIfMatch("paired smartcard", "/historyAllReports/3");
    //     navigateIfMatch("block list", "/historyAllReports/4");
    //     navigateIfMatch("combo package", "/historyAllReports/14");

    //     navigateIfMatch("as on date suspend", "/historyAllReports/14");
    //     navigateIfMatch("suspend report for particular duration", "/historyAllReports/12");
    //     navigateIfMatch("suspend history", "/historyAllReports/13");

    //     navigateIfMatch("scroll history", "/historyAllReports/12");
    //     navigateIfMatch("mail history", "/historyAllReports/6");
    //     navigateIfMatch("finger history", "/historyAllReports/7");
    //     navigateIfMatch("message history", "/historyAllReports/8");

    //     navigateIfMatch("network smartcard status count", "/historyAllReports/9");
    //     navigateIfMatch("network smartcard active deactive status count ", "/historyAllReports/10");

    //     navigateIfMatch("channel ageing", "/broadcasterReports/6");
    //     navigateIfMatch("package ageing", "/broadcasterReports/7");

    //   } else if (this.isSpecial) {
    //     navigateIfMatch("msodetails", "/msodetails");
    //     navigateIfMatch("casmaster", "/casmaster");
    //     navigateIfMatch("tax master", "/tax");
    //     navigateIfMatch("billing", "/invoice");
    //     navigateIfMatch("operator", "/special_operator");
    //     navigateIfMatch("proof settings", "/proof");
    //     navigateIfMatch("lco settings", "/Packageplan");
    //     navigateIfMatch("package plan", "/Packageplan");
    //     navigateIfMatch("local channel", "/channeldetails");
    //     navigateIfMatch("ads upload", "/adsdetails");
    //     navigateIfMatch("lco and area change", "/special_area_package");
    //     navigateIfMatch("cancel subscription", "/special_cancel_subscription");
    //     navigateIfMatch("bulksmartcardrefresh", "/smartcard_refresh");
    //     navigateIfMatch("lco transfer", "/special_lcotransfer");
    //     navigateIfMatch("bulk operator creation", "/bulk_smartcard_creation");
    //     navigateIfMatch("mso reports", "/msoReports");

    //     navigateIfMatch("log", "/logs");

    //     navigateIfMatch("invoice bill", "/msodialogueReports/lcoinvoice");

    //     navigateIfMatch("deduction including gst", "/msodialogueReports/recharge_deduction_including");
    //     navigateIfMatch("recharge history", "/msodialogueReports/recharge_history");
    //     navigateIfMatch("online payment", "/msodialogueReports/online_payment_special");
    //     navigateIfMatch("wallet share", "/msodialogueReports/walletShare");
    //     navigateIfMatch("payment collection", "/msodialogueReports/payment_collection_AJK");
    //     navigateIfMatch("subscriber bill", "/msodialogueReports/subscriber_bill");
    //     navigateIfMatch("user recharge", "/msodialogueReports/user_rechargehistory");

    //     navigateIfMatch("lcowiseactivesubscriptioncount", "/msodialogueReports/lco_active_subscription");
    //     navigateIfMatch("customer activation form", "/msodialogueReports/customer_activation_form");
    //     navigateIfMatch("lcowiseexpirycountdifference", "/msodialogueReports/lcowiseExpiryCountDiff");

    //     navigateIfMatch("total lco", "/msodialogueReports/total_lco");
    //     navigateIfMatch("lcotransferdetails", "/msodialogueReports/lco_transfer_details");
    //     navigateIfMatch("repairsmartcard", "/msodialogueReports/repair_smartcard");
    //     if (transcript.includes("login settings")) {
    //       recognition.stop();
    //       if (this.username === 'manikandan') {
    //         this.navgetToUrl('/loginsettings');
    //       } else {
    //         this.navgetToUrl('/loginsettings_credential');
    //       }
    //     }
    //   }
    // });

    // recognition.addEventListener("error", (event: any) => {
    //   console.error("Speech recognition error:", event.error);
    // });

    // recognition.addEventListener("end", () => {
    //   console.log("Recognition ended.");
    // });
  }
  isMobile = false;
  currentBreakpoint: any;

  isAdmin = false;

  navgetToUrl(id: any,) {
    this.activeItem = id;
    this.router.navigateByUrl("admin" + id);
    console.log("Current width:", window.innerWidth);
    if (window.innerWidth <= 760) {
      this.isSidebarOpen = false;
      this.cd.detectChanges();
      const sidebar = document.getElementById('sidebar');
      sidebar?.classList.add('hide');
      console.log("p");
    }
  }


  navigateAndSelect(url: string, event: Event): void {
    document.querySelectorAll('.side-dropdown li a.active').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-link.active').forEach(link => {
      link.classList.remove('active');
    });
    (event.currentTarget as HTMLElement).classList.add('active');
    this.activeItem = url;
    this.router.navigateByUrl("admin" + url).then(() => {
      if (window.innerWidth <= 768) {
        this.isSidebarOpen = false;
      }
    });
  }


  OPENCLSO() {
    // const sidebar = document.getElementById('sidebar');
    // sidebar?.classList?.contains('hide') ? sidebar?.classList?.remove('hide') : sidebar?.classList?.add('hide')
  }
  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }

  @HostListener('document:click', ['$event'])

  closeDropdown(event?: Event) {
    this.showDropdown = false;
  }
  handleBlur(event: FocusEvent) {
    if (!event.relatedTarget || !(event.relatedTarget as HTMLElement).classList.contains('dropdown-item')) {
      this.showDropdown = false;
    }
  }

  toggleDropdown(event: Event) {
    console.log('12321321321321321');

    event.stopPropagation();
    this.showLogoutDropdown = !this.showLogoutDropdown;
    setTimeout(() => {
      document.addEventListener('click', this.closeDropdown1.bind(this));
    });
    console.log("Dropdown visibility:", this.showLogoutDropdown);
    this.cdr.detectChanges();
  }

  closeDropdown1(event: Event) {
    if (!document.querySelector('.dropdown')?.contains(event.target as Node)) {
      this.showLogoutDropdown = !this.showLogoutDropdown;
      document.removeEventListener('click', this.closeDropdown.bind(this));
      this.cdr.detectChanges();
    }
  }
  navgetTosublcoUrl(operatorid: number) {
    console.log(operatorid);

    // const detailsList = this.operator_details.find((op: any) => op.operatorid === operatorid);
    // this.dataService.setDialogData({ detailsList });
    this.router.navigateByUrl(`/admin/sublcodashboard/${operatorid}`);
    // console.log(detailsList);
  }
  startListening(id: any) {
    this.activeItem = id;
    this.router.navigateByUrl("admin" + id);
    console.log("Current width:", window.innerWidth);
  }
  isOpNavigate: boolean = false;
  loginAdmin() {
    this.isOpNavigate = true;
    sessionStorage.setItem('isOpNavigate', 'true');
    if (this.role == 'ROLE_OPERATOR') {
      this.login('/admin/operator_details');
    }
  }

  login(path: any) {
    this.signInform = {
      username: this.tempUsername,
      password: this.tempPassword
    }
    this.authService.login(this.signInform).subscribe(
      data => {
        this.navigationList1 = data.navigationmap;
        this.storageservice.saveToken(data.accessToken);
        this.storageservice.saveUser(data);
        this.role = this.storageservice.getUser().roles;
        this.router.navigate([path]);
        let isUser = this.role.includes('ROLE_ADMIN');
        if (isUser) {
          this.router.navigate(['admin/operator_details'],).then(() => {
            window.location.reload();
            this.navigationList = data.navigationmap;
          });
        }
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }
  login1(path: any) {
    this.signInform = {
      username: this.tempUsername,
      password: this.tempPassword
    }
    this.authService.login(this.signInform).subscribe(
      data => {
        this.navigationList1 = data.navigationmap;
        this.storageservice.saveToken(data.accessToken);
        this.storageservice.saveUser(data);
        this.role = this.storageservice.getUser().roles;
        this.router.navigate([path]);
        let isUser = this.role.includes('ROLE_ADMIN');
        if (isUser) {
          this.router.navigate(['admin/operator_details'],).then(() => {
            this.navigationList = data.navigationmap;
          });
        }
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }


}