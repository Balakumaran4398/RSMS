


import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/_core/service/storage.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  activeMenu: string = '';
  activeItem: any;
  isHide: any = true;
  currentTime: any = new Date();
  // control = new FormControl();
  isSystem: boolean = true;
  ismobile: boolean = false;
  isDropdownOpen: boolean = false;
  user: any;
  userRoles: string[] = [];
  isSidebarOpen = false;
  constructor(private router: Router, private storageservice: StorageService, 
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef) {
    this.breakpointChanged();
    this.user = this.storageservice.getUser();
    this.userRoles = this.user?.roles || [];
    console.log(this.user.username);


  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.user-profile')) {
      this.isDropdownOpen = false;
    }
  }
  ngOninit() {
    this.checkDeviceType();
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
  hasAdminRole(): boolean {
    return this.userRoles.includes('ADMIN');
  }
  logout() {
    this.storageservice.signOut();
  }
  toggleDrop() {
    console.log('toggle droped');
    this.isDropdownOpen = !this.isDropdownOpen;
    this.cdr.detectChanges();
  }
  setActiveTab(event: Event) {
    const activeTabs = document.querySelectorAll('.side-menu a.active');
    activeTabs.forEach((tab) => {
      tab.classList.remove('active');
    });

    // Add 'active' class to the clicked element
    const clickedElement = event.currentTarget as HTMLElement;
    clickedElement.classList.add('active');
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
    const sidebar = document.getElementById('sidebar-cms');
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
    const toggleSidebar = document.querySelector('nav .toggle-sidebar');
    const allSideDivider = document.querySelectorAll('#sidebar-cms .divider');
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
      // sidebar?.classList.toggle('hide');
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
  }
  isMobile = false;
  currentBreakpoint: any;
  private breakpointChanged() {
    if (this.breakpointObserver.isMatched(Breakpoints.Large)) {
      this.currentBreakpoint = Breakpoints.Large;
      // console.log(this.currentBreakpoint);
      this.isMobile = false;
    } else if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.currentBreakpoint = Breakpoints.Medium;
      // console.log(this.currentBreakpoint);
      this.isMobile = false;
    } else if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.currentBreakpoint = Breakpoints.Small;
      // console.log(this.currentBreakpoint);
      this.isMobile = false;
    } else if (this.breakpointObserver.isMatched('(min-width: 500px)')) {
      this.currentBreakpoint = '(min-width: 500px)';
      // console.log(this.currentBreakpoint);
      this.isMobile = true;
    } else {
      this.isMobile = true;
    }
    console.log(this.isMobile);
  }
  isAdmin = false;
  // navgetToUrl(id: any) {
  //   // console.log(id);
  //   this.activeItem = id;
  //   this.router.navigateByUrl("admin" + id);
  //   if (this.isMobile) {
  //     // this.closeSidebar();
  //     // this.OPENCLSO();
  //   }
  // }
  routerByUrl(url: any) {
    this.router.navigate(['/admin/' + url]).then(() => {
    });
  }
  OPENCLSO() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList?.contains('hide') ? sidebar?.classList?.remove('hide') : sidebar?.classList?.add('hide')
  }
}