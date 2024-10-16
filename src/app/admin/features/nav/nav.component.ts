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
  constructor(private router: Router, private breakpointObserver: BreakpointObserver, private cdr: ChangeDetectorRef, private userservice: BaseService, private storageservice: StorageService) {
    this.breakpointChanged();
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();

  }

  ngOnInit() {
    this.checkDeviceType();
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
    const sidemenuLinks = document.querySelectorAll('.side-menu li a');
    const sidedropdownmenuLinks = document.querySelectorAll('.side-menu li ul li a');
    sidemenuLinks.forEach(link => {
      link?.classList?.remove('active');
      link.addEventListener("click", () => {
        sidemenuLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
      });
    });
    sidedropdownmenuLinks.forEach(link => {
      link?.classList?.remove('active');
      link.addEventListener("click", () => {
        sidedropdownmenuLinks.forEach(link => link.classList.remove('active'));
        link.classList.add('active');
      });
    });


  }
  onsubscriberlist(value: any) {
    this.showDropdown = true;
    // this.userservice.getSearchDetailsSubscriber(this.role, this.username, value).subscribe((data: any) => {
    //   console.log(data);
    //   this.subscriber = data;
    //   this.subscriberList = Object.keys(data).map(key => {
    //     const value = data[key];
    //     const name = key;
    //     return { name: name, value: value };
    //   });
    //   this.subscriberList.sort((a: any, b: any) => {
    //     if (a.value > b.value) return 1;
    //     if (a.value < b.value) return -1;
    //     return 0;
    //   });
    //   console.log(this.subscriberList);
    // })

    // this.userservice.getSearchDetailsSubscriber(this.role, this.username, value).subscribe(
    //   (data: any) => {
    //     console.log(data);
    
    //     // Check if data is empty or null
    //     if (!data || Object.keys(data).length === 0) {
    //       console.log('No data found');
    //       Swal.fire({
    //         title: 'No Data',
    //         text: 'No subscriber details found for this search.',
    //         icon: 'warning',
    //         confirmButtonText: 'OK'
    //       });
    //       return;
    //     }
    
    //     // If data is not empty, process it
    //     this.subscriber = data;
    //     this.subscriberList = Object.keys(data).map(key => {
    //       const value = data[key];
    //       const name = key;
    //       return { name: name, value: value };
    //     });
    
    //     // Sort the subscriberList by value
    //     this.subscriberList.sort((a: any, b: any) => {
    //       if (a.value > b.value) return 1;
    //       if (a.value < b.value) return -1;
    //       return 0;
    //     });
    
    //     console.log(this.subscriberList);
    //   },
    //   (error) => {
    //     // Handle error from the API call
    //     Swal.fire({
    //       title: 'Error!',
    //       text: 'An error occurred while fetching subscriber details.',
    //       icon: 'error',
    //       confirmButtonText: 'OK'
    //     });
    //   }
    // );

    this.userservice.getSearchDetailsSubscriber(this.role, this.username, value).subscribe(
      (data: any) => {
        console.log(data);
    
        // Check if data is empty or null
        if (!data || Object.keys(data).length === 0) {
          console.log('No data found');
          Swal.fire({
            title: 'No Data',
            text: 'No subscriber details found for this search.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          return;
        }
    
        // Process the subscriber data if it's not empty
        this.subscriber = data;
        this.subscriberList = Object.keys(data).map(key => {
          const value = data[key];
          const name = key;
          return { name: name, value: value };
        });
    
        // Sort the subscriberList by value
        this.subscriberList.sort((a: any, b: any) => {
          if (a.value > b.value) return 1;
          if (a.value < b.value) return -1;
          return 0;
        });
    
        // Check if the sorted list is empty
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
        // Handle error from the API call
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while fetching subscriber details.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
0    
  }

  // goToSubscriberDashboard(lcomember: any) {
  //   this.lcomember = lcomember.value;
  //   console.log('Selected value:', this.lcomember);
  //   if (this.router.url == `/admin/subscriber-full-info/${this.lcomember}`) {
  //     window.location.reload();
  //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //       window.location.reload();
  //       this.router.navigate([`/admin/subscriber-full-info/${this.lcomember}`]);
  //       console.log(this.lcomember);
  //       window.location.reload();
  //     });
  //   } else {
  //     this.router.navigateByUrl(`/admin/subscriber-full-info/${this.lcomember}`);
  //     window.location.reload();
  //   }
  //   this.showDropdown = false;
  // }
  goToSubscriberDashboard(lcomember: any) {
    this.lcomember = lcomember.value;
    console.log('Selected value:', this.lcomember);
    const targetUrl = `/admin/subscriber-full-info/${this.lcomember}//dashoard`;

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
    const toggleSidebar = document.querySelector('nav .toggle-sidebar');
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
}
// class NotificationHandler {
//   private notificationTimeElement: HTMLElement | null;

//   constructor() {
//     this.notificationTimeElement = document.getElementById('notificationTime');
//     // Assuming you have an event or condition to trigger time update, call updateNotificationTime here
//     // For example:
//     this.updateNotificationTime();
//   }

//   // Call this method to update the notification time when needed
//   public updateNotificationTime() {
//     const now = new Date();
//     const timeString = now.toLocaleTimeString();

//     if (this.notificationTimeElement) {
//       this.notificationTimeElement.textContent = `${timeString}`;
//     }
//   }
// }

// Example usage:
// Initialize the NotificationHandler when the DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//   const notificationHandler = new NotificationHandler();

//   const updateButton = document.getElementById('updateButton');
//   if (updateButton) {
//     updateButton.addEventListener('click', () => {
//       notificationHandler.updateNotificationTime();
//     });
//   }
// });
