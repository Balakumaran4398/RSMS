import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

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
  subscriberList: any[] = [];
  showDropdown: boolean = true;
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
  isDropdownOpen: boolean = false;
  isPopupVisible = false;
  constructor(private router: Router, private breakpointObserver: BreakpointObserver, private cdr: ChangeDetectorRef, private userservice: BaseService, private storageservice: StorageService) {
    // this.breakpointChanged();
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(this.role);
    
    if (this.role.includes('ROLE_ADMIN')) {
      this.isUser = true;
      this.isReception = false;
      this.isSpecial = false;
      this.role = 'ADMIN';
    } else if (this.role.includes('ROLE_RECEPTION')) {
      this.isReception = true;
      this.isUser = false;
      this.isSpecial = false;
      this.role = 'RECEPTION';
    } else if (this.role.includes('ROLE_SPECIAL')) {
      this.isReception = false;
      this.isUser = false;
      this.isSpecial = true;
      this.role = 'SPECIAL';
    } else if (this.role.includes('ROLE_INVENTORY')) {
      this.isInventory = true;
      this.isUser = false;
      this.isSpecial = false;
      this.role = 'INVENTORY';
    }else if (this.role.includes('ROLE_CUSTOMER_SERVICE')) {
      this.isInventory = true;
      this.isUser = false;
      this.isSpecial = false;
      this.role = 'CUS_SERVICE';
    }else if (this.role.includes('ROLE_SERVICE_CENTER')) {
      this.isInventory = true;
      this.isUser = false;
      this.isSpecial = false;
      this.role = 'SERVICE_CENTER';
    }
  }

  ngOnInit() {
    this.checkDeviceType();
    const sidemenuLinks = document.querySelectorAll('.side-menu li a');
    console.log("click");
    sidemenuLinks.forEach(link => {
      link?.classList?.remove('active');
      link.addEventListener("click", () => {
        console.log("click");
        sidemenuLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
      });
    });

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
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
  }

  setActiveLinkListTab(event: Event) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
  
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
  }
  
  onsubscriberlist(value: any) {
    this.showDropdown = true;
    this.userservice.getSearchDetailsSubscriber(this.role, this.username, value).subscribe(
      (data: any) => {
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
          text: error?.error?.getsmartcardlistbysubid.searchname
            || 'An error occurred while fetching subscriber details.',
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
    console.log('toggle droped');
    this.isDropdownOpen = !this.isDropdownOpen;
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


    sidebar?.addEventListener('mouseleave', function () {
      if (this.classList.contains('hide')) {
        allDropdown.forEach((item: any) => {
          const a = item.parentElement.querySelector('a:first-child');
          a.classList.remove('active');
          item.classList.remove('show');
        })
        allSideDivider?.forEach(item => {
          item.textContent = '-'
        })
      }
    })

    sidebar?.addEventListener('mouseenter', function () {
      if (this.classList.contains('hide')) {
        allDropdown.forEach((item: any) => {
          const a = item.parentElement.querySelector('a:first-child');
          a.classList.remove('active');
          item.classList.remove('show');
        })
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
  // private breakpointChanged() {
  //   if (this.breakpointObserver.isMatched(Breakpoints.Large)) {
  //     this.currentBreakpoint = Breakpoints.Large;
  //     // console.log(this.currentBreakpoint);
  //     this.isMobile = false;
  //   } else if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
  //     this.currentBreakpoint = Breakpoints.Medium;
  //     // console.log(this.currentBreakpoint);
  //     this.isMobile = false;
  //   } else if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
  //     this.currentBreakpoint = Breakpoints.Small;
  //     // console.log(this.currentBreakpoint);
  //     this.isMobile = false;
  //   } else if (this.breakpointObserver.isMatched('(min-width: 500px)')) {
  //     this.currentBreakpoint = '(min-width: 500px)';
  //     // console.log(this.currentBreakpoint);
  //     this.isMobile = true;
  //   } else {
  //     this.isMobile = true;
  //   }
  //   console.log(this.isMobile);
  // }
  isAdmin = false;
  navgetToUrl(id: any,) {
    // console.log(id);
    this.activeItem = id;
    this.router.navigateByUrl("admin" + id);
    if (this.isMobile) {
      // this.closeSidebar();
      // this.OPENCLSO();
    }

  }

  OPENCLSO() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList?.contains('hide') ? sidebar?.classList?.remove('hide') : sidebar?.classList?.add('hide')
  }
  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }
}

