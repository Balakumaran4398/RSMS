import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { DataService } from 'src/app/_core/service/Data.service';

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
  operatorBalance: any;
  distributor: boolean = false;
  constructor(private router: Router, private breakpointObserver: BreakpointObserver, private cd: ChangeDetectorRef, private dataService: DataService, private cdr: ChangeDetectorRef, private userservice: BaseService, private storageservice: StorageService) {
    // this.breakpointChanged();
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(this.role);
    console.log(this.username);

    if (this.role.includes('ROLE_ADMIN')) {
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
  SublcopermissionObj: any;
  SublcoReport: any;
  subLCOdetails() {
    this.userservice.getSublcoDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      this.SublcopermissionObj = this.lcoDeatails?.permissionlist;
      this.SublcoReport = this.SublcopermissionObj?.report;
      console.log('eresuofhdljkfhdsjkfhnsjdhfdjsfh', this.SublcopermissionObj);
      console.log('REFRESH', this.SublcoReport);
    })
  }
  getSubscriberDetails() {
    this.userservice.getSubscriberDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      console.log('22222222');
      this.lcoDeatails = data;
      console.log('SUBSCRIBER DETAILS', this.lcoDeatails);
      this.subscriberid = this.lcoDeatails.subid;
      console.log('this.subscriberid', this.subscriberid);
    })
  }
  ngOnInit() {
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
  }

  operatorIdoperatorId() {
    this.userservice.getOpDetails(this.role, this.username).subscribe((data: any) => {
      this.lcoDeatails = data;
      this.operatorId = this.lcoDeatails?.operatorid;
      this.operatorname = this.lcoDeatails?.operatorname;
      this.operatorBalance = this.lcoDeatails?.balance;
      this.distributor = this.lcoDeatails?.isdistributor;
    })
  }


  msoDetails() {
    this.userservice.getMsoDetails(this.role, this.username).subscribe((data: any) => {
      this.msoLogo = `${data.msoLogo}`;
      this.msoName = `${data.msoName}`;
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
}