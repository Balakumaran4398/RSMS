// import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
// import { ChangeDetectorRef, Component } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { ActivatedRoute, Router } from '@angular/router';
// import { BaseService } from 'src/app/_core/service/base.service';
// import { StorageService } from 'src/app/_core/service/storage.service';
// import { PackageBASEDEMOComponent } from '../package-base-demo/package-base-demo.component';
// import Swal from 'sweetalert2';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { SwalService } from 'src/app/_core/service/swal.service';
// import { Location } from '@angular/common';

// @Component({
//   selector: 'app-package-manage',
//   templateUrl: './package-manage.component.html',
//   styleUrls: ['./package-manage.component.scss'],
//   standalone: true,
//   imports: [CdkDropList, CdkDrag, CommonModule, FormsModule]
// })
// export class PackageManageComponent {
//   package_id: any;
//   package_name: any;
//   package_rate: any;
//   package_viewing_count: any;
//   pay_chan_count: any;
//   bouquet_cont: any;
//   username: any;
//   role: any;
//   subcount: any;
//   modified: boolean = true;
//   available_alacarte_list: any = [];
//   alacarte_list_id: any = [];
//   bouquet_removelist_id: any = [];
//   searchTermAvailable: string = '';
//   bouquet_list_id: any = [];
//   removed_channel_list: any;
//   added_alacarte_list_id: any = [];
//   added_bouquet_list_id: any = [];
//   added_alacarte_list: any = [];
//   available_bouquet_list: any = [];
//   added_bouquet_list: any = [];
//   selectedItems: Set<any> = new Set();

//   availableFilter: any;
//   addedFilter: any;
//   searchTermAlacarte: any;
//   searchTermAdded: any;
//   searchTermAddedBouquet: any;
//   searchTermAvailableBouquet: any;

//   filteredAvailableAlacarteList: any = [];
//   filteredAddedList: any = [];
//   filteredAvailableBouquetList: any = [];
//   filteredAddedBouquetList: any = [];
//   // -------------------------------------------------------------------
//   available_alacarte_channel: any[] = [];

//   available_bouquet_channel: any;
//   added_alacarte_channel: any;
//   added_bouquet_channel: any;
//   // -------------------------------------------------------------------------------
//   available_alacarte_count: any;
//   added_alacrte_count: any;
//   available_bouquet_count: any;
//   added_bouquet_count: any;

//   containerID: any;

//   constructor(public dialog: MatDialog, public router: Router, private cdr: ChangeDetectorRef, private location: Location, private route: ActivatedRoute, private swal: SwalService, private userService: BaseService, private storageservice: StorageService) {
//     this.username = storageservice.getUsername();
//     this.role = storageservice.getUserRole();
//   }

//   ngOnInit(): void {
//     this.modified = false;
//     console.log(this.subcount);
//     this.package_id = this.route.snapshot.paramMap.get('id');
//     console.log('Package ID:', this.package_id);
//     // this.userService.AddonPackageChannelList(this.role, this.username, 1, this.package_id).subscribe((data: any) => {
//     //   // this.packagename = data.packagename;
//     //   // this.packagename = data.packagerate;
//     //   this.subcount = data.subcount;
//     //   console.log(this.subcount);

//     //   console.log(data);
//     // });
//     this.userService.managePackage(this.package_id, this.role, this.username).subscribe((data: any) => {
//       console.log(data);
//       this.package_name = data[0].Package_Name
//       this.package_rate = data[0].Package_Rate
//       this.package_viewing_count = data[0].Package_view_Count
//       this.pay_chan_count = data[0].Channel_count
//       this.bouquet_cont = data[0].Bouquet_count
//       this.available_alacarte_count = data[0].Available_alacarte_count
//       this.added_alacrte_count = data[0].Added_alacarte_count
//       this.available_bouquet_count = data[0].Available_addon_count
//       this.added_bouquet_count = data[0].Added_addon_count
//       console.log('AVAILABLE ALACARTE COUNT' + this.available_alacarte_count);
//       this.available_alacarte_list = data[0].Available_Alacarte.map((available_alacarte: any) => {
//         return `${available_alacarte.channel_name} (${available_alacarte.channel_id}) - Rs.${available_alacarte.inr_amt}.0`;
//       });

//       this.added_alacarte_list = data[0].Added_Alacarte.map((addede_alacarte: any) => {
//         return `${addede_alacarte.channel_name} (${addede_alacarte.channel_id}) - Rs.${addede_alacarte.inr_amt}.0`;
//       });



//       this.available_bouquet_list = data[0].Available_addon.map((available_bouquet: any) => {
//         return `${available_bouquet.addon_package_name} (${available_bouquet.order_id}) - Rs.${available_bouquet.addon_package_rate}.0`;
//       });
//       this.added_bouquet_list = data[0].Added_addon.map((added_bouque: any) => {
//         return `${added_bouque.addon_package_name} (${added_bouque.order_id}) - Rs.${added_bouque.addon_package_rate}.0`;
//       });
//       this.alacarte_list_id = data[0].Available_Alacarte.map((available_alacarte: any) => available_alacarte.channel_id);
//       // this.added_alacarte_list_id = data[0].Added_Alacarte.map((added_alacarte: any) => added_alacarte.channel_id)
//       this.bouquet_list_id = data[0].Available_addon.map((available_bouquet: any) => {
//         return ` ${available_bouquet.order_id} `;
//       });

//       // console.log('AVAILABE ALACARTE_ID    1   ' + this.alacarte_list_id);
//       // console.log('AVAILABE ALACARTE       ' + this.available_bouquet_list);
//       console.log('Added bouquet list         ' + this.added_bouquet_list);
//       console.log('Available bouquet list    ' + this.available_bouquet_list);
//       // console.log('ADDED ALACARTE    2  ' + this.added_alacarte_list_id);
//       // console.log('AVAILABE BOUQUET      ' + this.bouquet_list_id);
//       // console.log('ADDED BOUQUET   4   ' + this.added_bouquet_list_id);     
//       this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
//       this.filteredAddedList = [...this.added_alacarte_list];
//       this.filteredAvailableBouquetList = [...this.available_bouquet_list];
//       this.filteredAddedBouquetList = [...this.added_bouquet_list];
//     })
//   }
//   goBack(): void {
//     this.location.back();
//   }

//   back() {
//     this.router.navigateByUrl("admin/PackageCreation");
//   }
//   trackByFn(index: number, item: string) {
//     return index;
//   }


//   pay_channel(type: any) {
//     console.log(type);
//     let width = '1500px';
//     if (type === 'pair') {
//       width = '1250px';
//     }
//     if (type === 'paychannel') {
//       width = '805px'; // Set width to 805px for paychannel
//     }
//     if (type === 'bouquet') {
//       width = '820px';
//     }
//     let dialogData = { type: type, package_id: this.package_id }
//     const dialogRef = this.dialog.open(PackageBASEDEMOComponent, {
//       width: width, // Use the width variable here
//       panelClass: 'custom-dialog-container',
//       data: dialogData
//     });
//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//     });
//   }


//   filterAvailableList(): void {
//     console.log(this.filteredAvailableAlacarteList);
//     const searchTerm = this.searchTermAlacarte ? this.searchTermAlacarte.toLowerCase() : '';
//     this.filteredAvailableAlacarteList = this.available_alacarte_list.filter((item: any) =>
//       item.toLowerCase().includes(searchTerm)
//     );
//     this.cdr.detectChanges();
//   }
//   filterAddedList(): void {
//     const searchTerm = this.searchTermAdded.toLowerCase();
//     this.filteredAddedList = this.added_alacarte_list.filter((item: any) =>
//       item.toLowerCase().includes(searchTerm)
//     );
//     this.cdr.detectChanges();

//   };
//   filterAvailableBouquetList(): void {
//     const searchTerm = this.searchTermAvailableBouquet.toLowerCase();
//     this.filteredAvailableBouquetList = this.available_bouquet_list.filter((item: any) =>
//       item.toLowerCase().includes(searchTerm)
//     );
//     this.cdr.detectChanges();

//   };

//   filterAddedBouquetList(): void {
//     const searchTerm = this.searchTermAddedBouquet.toLowerCase();
//     this.filteredAddedBouquetList = this.added_bouquet_list.filter((item: any) =>
//       item.toLowerCase().includes(searchTerm)
//     );
//     this.cdr.detectChanges();
//   };



//   toggleSelection(item: string) {
//     if (this.selectedItems.has(item)) {
//       this.selectedItems.delete(item);
//     } else {
//       this.selectedItems.add(item);
//     }
//   }

//   isSelected(item: string): boolean {
//     return this.selectedItems.has(item);
//   }
//   moveSelected_alacarte_Items(direction: 'left' | 'right') {
//     this.modified = true;
//     const itemsToMove: any[] = [];
//     if (direction === 'right') {
//       this.selectedItems.forEach(item => {
//         const index = this.available_alacarte_list.indexOf(item);
//         if (index > -1) {
//           this.available_alacarte_list.splice(index, 1);
//           this.added_alacarte_list.push(item);
//           itemsToMove.push(item);
//           // console.log(this.added_alacarte_list.push(item));
//         }
//       });
//       this.containerData = this.added_alacarte_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       // this.selectedItems.clear();
//       console.log(this.containerData);
//       // console.log(this.added_alacarte_list);
//     } else if (direction === 'left') {
//       this.selectedItems.forEach(item => {
//         const index = this.added_alacarte_list.indexOf(item);
//         if (index > -1) {
//           this.added_alacarte_list.splice(index, 1);
//           this.available_alacarte_list.push(item);
//           itemsToMove.push(item);
//           // console.log(this.available_alacarte_list.push(item));
//         }
//       });
//       this.containerData = this.added_alacarte_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       // this.selectedItems.clear();
//       console.log(this.containerData);
//     }
//     // this.available_alacarte_channel = Array.from(this.selectedItems);
//     this.alacarte_list_id = Array.from(this.selectedItems).map(item => {
//       const match = item.match(/\((\d+)\)/);
//       return match ? match[1] : null;
//     });
//     // console.log(this.alacarte_list_id);
//     console.log(this.added_alacarte_list);
//     // this.containerData = this.added_alacarte_list.map((item: any) => {
//     //   const match = item.match(/\((.*?)\)/);
//     //   return match ? match[1] : null;
//     // }).filter(Boolean);
//     // // this.selectedItems.clear();
//     // console.log(this.containerData);

//     this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
//     this.filteredAddedList = [...this.added_alacarte_list];
//     this.selectedItems.clear();
//     // console.log('Available Alacarte List:', this.available_alacarte_list);
//     // console.log('Added Alacarte List:', this.added_alacarte_list);
//   }



//   moveSelectedBouquet_Items(direction: 'left' | 'right') {
//     this.modified = true;
//     const itemsToMove: any[] = [];
//     if (direction === 'right') {
//       this.selectedItems.forEach(item => {
//         const index = this.available_bouquet_list.indexOf(item);
//         if (index > -1) {
//           this.available_bouquet_list.splice(index, 1);
//           this.added_bouquet_list.push(item);
//           itemsToMove.push(item);
//           console.log('22222222222222', this.available_bouquet_list.length);
//         }
//       });
//       console.log(this.available_bouquet_list);

//       console.log(this.added_bouquet_list);
//       this.containerData = this.added_bouquet_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       console.log(this.containerData);
//     } else if (direction === 'left') {
//       this.selectedItems.forEach(item => {
//         const index = this.added_bouquet_list.indexOf(item);
//         if (index > -1) {
//           this.added_bouquet_list.splice(index, 1);
//           this.available_bouquet_list.push(item);
//           itemsToMove.push(item);
//         }
//       });
//       console.log(this.available_bouquet_list);
//       this.removed_channel_list = itemsToMove.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       console.log(this.added_bouquet_list);
//       this.containerData = this.added_bouquet_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       console.log(this.containerData);
//       console.log(this.removed_channel_list);
//     }
//     // this.bouquet_list_id = Array.from(this.selectedItems).map(item => {
//     //   const match = item.match(/\((\d+)\)/);
//     //   return match ? match[1] : null;
//     // });

//     // this.containerData = this.added_bouquet_list.map((item: any) => {
//     //   const match = item.match(/\((.*?)\)/);
//     //   return match ? match[1] : null;
//     // }).filter(Boolean);
//     // console.log(this.containerData);
//     this.filteredAvailableBouquetList = [...this.available_bouquet_list]
//     this.filteredAddedBouquetList = [...this.added_bouquet_list]
//     this.selectedItems.clear();

//   }
//   moveSelectedLeft_bouquet_Items(direction: 'left' | 'right') {
//     const itemsToMove: any[] = [];
//     if (direction === 'right') {
//       this.selectedItems.forEach(item => {
//         const index = this.available_bouquet_list.indexOf(item);
//         if (index > -1) {
//           this.available_bouquet_list.splice(index, 1);
//           this.added_bouquet_list.push(item);
//           itemsToMove.push(item);
//         }
//         // console.log(this.added_bouquet_list.push(item));
//       });
//       console.log(this.added_bouquet_list);

//     } else if (direction === 'left') {
//       this.selectedItems.forEach(item => {
//         const index = this.added_bouquet_list.indexOf(item);
//         if (index > -1) {
//           this.added_bouquet_list.splice(index, 1);
//           this.available_bouquet_list.push(item);
//           itemsToMove.push(item);
//         }
//         // console.log(this.available_bouquet_list.push(item));
//       });
//     }
//     this.bouquet_list_id = Array.from(this.selectedItems).map(item => {
//       const match = item.match(/\((\d+)\)/);
//       return match ? match[1] : null;
//     });
//     // console.log(this.bouquet_list_id);
//     // console.log(this.available_bouquet_list);

//     // this.selectedItems.clear();
//     this.containerData = this.added_bouquet_list.map((item: any) => {
//       const match = item.match(/\((.*?)\)/);
//       return match ? match[1] : null;
//     }).filter(Boolean);

//     this.containerData = this.available_bouquet_list.map((item: any) => {
//       const match = item.match(/\((.*?)\)/);
//       return match ? match[1] : null;
//     }).filter(Boolean);
//     this.filteredAvailableBouquetList = [...this.available_bouquet_list]
//     this.filteredAddedBouquetList = [...this.added_bouquet_list]
//     this.selectedItems.clear();
//   }

//   alacarteId: any;
//   moveAll_alacarte_Items(direction: 'left' | 'right') {
//     this.modified = true;
//     if (direction === 'right') {
//       this.added_alacarte_list.push(...this.available_alacarte_list);
//       this.alacarte_list_id = this.available_alacarte_list.map((item: any) => {
//         const match = item.match(/\((\d+)\)/);
//         return match ? match[1] : null;
//       });
//       this.containerData = this.added_alacarte_list.map((item: any) => {
//         const match = item.match(/\((\d+)\)/);
//         return match ? match[1] : null;
//       });
//       this.available_alacarte_list = [];
//     } else if (direction === 'left') {
//       this.available_alacarte_list.push(...this.added_alacarte_list);
//       this.added_alacarte_list = [];

//     }
//     this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
//     this.filteredAddedList = [...this.added_alacarte_list];
//     this.selectedItems.clear();
//   }



//   moveAll_bouquet_Items(direction: 'left' | 'right') {
//     this.modified = true;
//     if (direction === 'right') {
//       console.log('right to left');

//       this.added_bouquet_list.push(...this.available_bouquet_list);
//       this.available_bouquet_list.forEach((item: any) => {
//         if (!this.added_bouquet_list.includes(item)) {
//           this.added_bouquet_list.push(item);
//         }
//       });
//       // this.bouquet_list_id = this.available_bouquet_list.map((item: any) => {
//       //   const match = item.match(/\((\d+)\)/);
//       //   return match ? match[1] : null;
//       // });
//       this.containerData = this.added_bouquet_list.map((item: any) => {
//         const match = item.match(/\((\d+)\)/);
//         return match ? match[1] : null;
//       });
//       console.log(this.containerData);
//       this.available_bouquet_list = [];
//     } else if (direction === 'left') {
//       console.log('left to right');

//       this.added_bouquet_list.forEach((item: any) => {
//         if (!this.available_bouquet_list.includes(item)) {
//           this.available_bouquet_list.push(item);
//         }
//       });
//       this.bouquet_list_id = this.available_bouquet_list.map((item: any) => {
//         const match = item.match(/\((\d+)\)/);
//         return match ? match[1] : null;
//       });
//       console.log(this.bouquet_list_id);
//       this.available_bouquet_list.push(...this.added_bouquet_list);
//       this.added_bouquet_list = [];
//     }

//     this.filteredAvailableBouquetList = [...this.available_bouquet_list];
//     this.filteredAddedBouquetList = [...this.added_bouquet_list];
//     this.selectedItems.clear();
//   }
//   containerData: any = [];
//   drop(event: CdkDragDrop<string[]>) {
//     console.log(event);

//     console.log(this.containerData);
//     if (event.previousContainer === event.container) {
//       console.log('sss');
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       console.log('dfdlfjd');
//       transferArrayItem(
//         event.previousContainer.data,
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex,
//       );
//     }
//     this.containerData = event.container.data.map(item => {
//       const match = item.match(/\((.*?)\)/);
//       return match ? match[1] : null;
//     }).filter(Boolean);

//     console.log("Updated container data:", this.containerData);
//   }

//   // -----------------------------------------------------------------------------------------

//   drop1(event: CdkDragDrop<string[]>, val: number) {
//     this.modified = true;
//     const draggedItem = event.item;
//     const draggedElement = draggedItem.element.nativeElement;
//     const draggedData = draggedItem.data;
//     console.log('Dragged data:', draggedData);
//     console.log('Dragged element:', draggedElement);
//     console.log('Item dropped:', event.item);
//     console.log(event);
//     console.log(val);
//     console.log("ddddd")
//     console.log(available_old_bouquet_list);
//     console.log(this.available_bouquet_list);
//     var available_old_bouquet_list = this.available_bouquet_list;
//     console.log(this.bouquet_removelist_id);
//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
//       if (val == 1) {
//         this.available_bouquet_list = event.container.data;
//         this.added_bouquet_list = event.previousContainer.data;
//         console.log('else condition')
//         const textContent = draggedElement.textContent || draggedElement.innerText;
//         console.log(textContent);
//         console.log("1111")
//         const match = textContent.match(/\((\d+)\)/);
//         console.log("222")
//         console.log(match);
//         if (match) {
//           console.log("333")
//           const id = match[1];
//           console.log("4444")
//           console.log(id);
//           this.bouquet_removelist_id.push(id);
//           console.log("5555")
//         } else {
//           console.log("6666")
//           console.log('No ID found');
//         }
//       } else {
//         console.log("7777")
//         this.added_bouquet_list = event.container.data;
//         console.log("888")
//         this.available_bouquet_list = event.previousContainer.data;
//         console.log("99")
//         console.log('bouquet list', this.bouquet_removelist_id);

//       }
//       this.containerData = this.added_bouquet_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       console.log('container', this.containerData);
//       console.log("11")
//     }
//     console.log("-------------------------------------------------")
//     console.log(this.bouquet_removelist_id)
//   }
//   drop2(event: CdkDragDrop<string[]>, val: number) {
//     this.modified = true;
//     const draggedItem = event.item;
//     const draggedElement = draggedItem.element.nativeElement;
//     const draggedData = draggedItem.data;
//     console.log('Dragged data:', draggedData);
//     console.log('Dragged element:', draggedElement);
//     console.log('Item dropped:', event.item);
//     console.log(event);
//     console.log(val);
//     console.log("ddddd")
//     console.log(available_old_bouquet_list);
//     var available_old_bouquet_list = this.available_alacarte_list;
//     console.log(this.bouquet_removelist_id);
//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
//       if (val == 1) {
//         this.available_alacarte_list = event.container.data;
//         this.added_alacarte_list = event.previousContainer.data;

//       } else {
//         this.added_alacarte_list = event.container.data;
//         this.available_alacarte_list = event.previousContainer.data;
//         console.log('bouquet list id', this.bouquet_removelist_id);

//       }
//       this.containerData = this.added_alacarte_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       console.log('container data', this.containerData);
//     }
//     console.log("-------------------------------------------------")
//     console.log(this.bouquet_removelist_id)
//   }
//   save() {
//     console.log(this.containerData);
//     console.log(this.alacarte_list_id);
//     console.log(this.added_alacarte_list);
//     console.log(this.alacarteId || 0);
//     this.containerID = this.alacarteId || 0
//     console.log(this.containerID);
//     this.containerData = this.containerData.length == 0 ? 0 : this.containerData;

//     if (this.alacarte_list_id) {
//       console.log('save');
//       Swal.fire({
//         title: "Are you sure?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, Change it!"
//       }).then((result) => {
//         if (result.isConfirmed) {
//           Swal.fire({
//             title: 'Updating...',
//             text: 'Please wait for Alacarte channels to update....',
//             allowOutsideClick: false,
//             didOpen: () => {
//               Swal.showLoading(null);
//             }
//           });
//           console.log(this.alacarte_list_id);
//           this.userService.AddingdAlacarteTo_Base_Package(this.modified, this.containerData, this.role, this.username, this.package_id).subscribe((res: any) => {
//             console.log(res);
//             this.swal.success(res?.message);
//             this.modified = false;
//           }, (err) => {
//             this.swal.Error3(err?.error?.message);
//           });
//         }
//       });
//     } else {
//       Swal.fire({
//         title: 'Warning!',
//         icon: 'warning',
//         text: 'Invalid Input',
//         timer: 1000,
//         showConfirmButton: false
//       })
//     }
//     this.selectedItems.clear();
//   }
//   save1() {
//     this.containerData = this.containerData.length == 0 ? 0 : this.containerData;
//     console.log(this.containerData);
//     console.log('bouquet_list_id', this.bouquet_list_id);
//     var bouquetId = this.bouquet_removelist_id || 0;
//     console.log('bouquet_removelist_id', bouquetId);
//     // if (this.bouquet_list_id) {
//     Swal.fire({
//       title: "Are you sure?",
//       // text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Change it!"
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: 'Updating...',
//           text: 'Please wait for Addon channel list to update....',
//           allowOutsideClick: false,
//           didOpen: () => {
//             Swal.showLoading(null);
//           }
//         });
//         if (bouquetId == null || bouquetId == undefined || bouquetId == '') {
//           bouquetId = 0;
//         }
//         console.log('bouquetId', bouquetId);

//         this.userService.AddingdbouquetTo_Base_Package(this.modified, this.containerData, this.role, this.username, this.package_id, bouquetId,).subscribe((res: any) => {
//           console.log(res);
//           this.swal.success(res?.message);
//           this.modified = false;
//         }, (err) => {
//           this.swal.Error3(err?.error?.message);
//         });
//       }
//     });
//   }
// }
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { PackageBASEDEMOComponent } from '../package-base-demo/package-base-demo.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwalService } from 'src/app/_core/service/swal.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-package-manage',
  templateUrl: './package-manage.component.html',
  styleUrls: ['./package-manage.component.scss'],
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule, FormsModule]
})
export class PackageManageComponent {
  package_id: any;
  package_name: any;
  package_rate: any;
  package_viewing_count: any;
  pay_chan_count: any;
  bouquet_cont: any;
  username: any;
  role: any;
  subcount: any;
  modified: boolean = true;
  available_alacarte_list: any = [];
  alacarte_list_id: any = [];
  bouquet_removelist_id: any = [];
  searchTermAvailable: string = '';
  bouquet_list_id: any = [];
  removed_channel_list: any;
  added_alacarte_list_id: any = [];
  added_bouquet_list_id: any = [];
  added_alacarte_list: any = [];
  available_bouquet_list: any = [];
  added_bouquet_list: any = [];
  selectedItems: Set<any> = new Set();

  availableFilter: any;
  addedFilter: any;
  searchTermAlacarte: any;
  searchTermAdded: any;
  searchTermAddedBouquet: any;
  searchTermAvailableBouquet: any;

  filteredAvailableAlacarteList: any = [];
  filteredAddedList: any = [];
  filteredAvailableBouquetList: any = [];
  filteredAddedBouquetList: any = [];
  // -------------------------------------------------------------------
  available_alacarte_channel: any[] = [];

  available_bouquet_channel: any;
  added_alacarte_channel: any;
  added_bouquet_channel: any;
  // -------------------------------------------------------------------------------
  available_alacarte_count: any;
  added_alacrte_count: any;
  available_bouquet_count: any;
  added_bouquet_count: any;

  containerID: any;

  constructor(public dialog: MatDialog, public router: Router, private cdr: ChangeDetectorRef, private location: Location, private route: ActivatedRoute, private swal: SwalService, private userService: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }

  ngOnInit(): void {
    this.modified = false;
    console.log(this.subcount);
    this.package_id = this.route.snapshot.paramMap.get('id');
    console.log('Package ID:', this.package_id);
    // this.userService.AddonPackageChannelList(this.role, this.username, 1, this.package_id).subscribe((data: any) => {
    //   // this.packagename = data.packagename;
    //   // this.packagename = data.packagerate;
    //   this.subcount = data.subcount;
    //   console.log(this.subcount);

    //   console.log(data);
    // });
    this.userService.managePackage(this.package_id, this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.package_name = data[0].Package_Name
      this.package_rate = data[0].Package_Rate
      this.package_viewing_count = data[0].Package_view_Count
      this.pay_chan_count = data[0].Channel_count
      this.bouquet_cont = data[0].Bouquet_count
      this.available_alacarte_count = data[0].Available_alacarte_count
      this.added_alacrte_count = data[0].Added_alacarte_count
      this.available_bouquet_count = data[0].Available_addon_count
      this.added_bouquet_count = data[0].Added_addon_count
      console.log('AVAILABLE ALACARTE COUNT' + this.available_alacarte_count);
      this.available_alacarte_list = data[0].Available_Alacarte.map((available_alacarte: any) => {
        return `${available_alacarte.channel_name} (${available_alacarte.channel_id}) - Rs.${available_alacarte.inr_amt}.0`;
      });

      this.added_alacarte_list = data[0].Added_Alacarte.map((addede_alacarte: any) => {
        return `${addede_alacarte.channel_name} (${addede_alacarte.channel_id}) - Rs.${addede_alacarte.inr_amt}.0`;
      });



      this.available_bouquet_list = data[0].Available_addon.map((available_bouquet: any) => {
        return `${available_bouquet.addon_package_name} (${available_bouquet.order_id}) - Rs.${available_bouquet.addon_package_rate}.0`;
      });
      this.added_bouquet_list = data[0].Added_addon.map((added_bouque: any) => {
        return `${added_bouque.addon_package_name} (${added_bouque.order_id}) - Rs.${added_bouque.addon_package_rate}.0`;
      });
      this.alacarte_list_id = data[0].Available_Alacarte.map((available_alacarte: any) => available_alacarte.channel_id);
      // this.added_alacarte_list_id = data[0].Added_Alacarte.map((added_alacarte: any) => added_alacarte.channel_id)
      this.bouquet_list_id = data[0].Available_addon.map((available_bouquet: any) => {
        return ` ${available_bouquet.order_id} `;
      });

      console.log('Added bouquet list         ' + this.added_bouquet_list);
      console.log('Available bouquet list    ' + this.available_bouquet_list);
      this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
      this.filteredAddedList = [...this.added_alacarte_list];
      this.filteredAvailableBouquetList = [...this.available_bouquet_list];
      this.filteredAddedBouquetList = [...this.added_bouquet_list];
    })
  }
  goBack(): void {
    this.location.back();
  }

  back() {
    this.router.navigateByUrl("admin/PackageCreation");
  }
  trackByFn(index: number, item: string) {
    return index;
  }


  pay_channel(type: any) {
    console.log(type);
    let width = '1500px';
    let height = '600px'; 

    if (type === 'pair') {
      width = '1000px';
      height = '1000px';
    }
    if (type === 'paychannel') {
      width = '805px';
    }
    if (type === 'bouquet') {
      width = '820px';
    }
    let dialogData = { type: type, package_id: this.package_id }
    const dialogRef = this.dialog.open(PackageBASEDEMOComponent, {
      width: width,
      height:height,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  filterAvailableList(): void {
    console.log(this.filteredAvailableAlacarteList);
    const searchTerm = this.searchTermAlacarte ? this.searchTermAlacarte.toLowerCase() : '';
    this.filteredAvailableAlacarteList = this.available_alacarte_list.filter((item: any) =>
      item.toLowerCase().includes(searchTerm)
    );
    this.cdr.detectChanges();
  }
  filterAddedList(): void {
    const searchTerm = this.searchTermAdded.toLowerCase();
    this.filteredAddedList = this.added_alacarte_list.filter((item: any) =>
      item.toLowerCase().includes(searchTerm)
    );
    this.cdr.detectChanges();

  };
  filterAvailableBouquetList(): void {
    const searchTerm = this.searchTermAvailableBouquet.toLowerCase();
    this.filteredAvailableBouquetList = this.available_bouquet_list.filter((item: any) =>
      item.toLowerCase().includes(searchTerm)
    );
    this.cdr.detectChanges();

  };

  filterAddedBouquetList(): void {
    const searchTerm = this.searchTermAddedBouquet.toLowerCase();
    this.filteredAddedBouquetList = this.added_bouquet_list.filter((item: any) =>
      item.toLowerCase().includes(searchTerm)
    );
    this.cdr.detectChanges();
  };



  toggleSelection(item: string) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
  }

  isSelected(item: string): boolean {
    return this.selectedItems.has(item);
  }
  moveSelected_alacarte_Items(direction: 'left' | 'right') {
    this.modified = true;
    const itemsToMove: any[] = [];
    if (direction === 'right') {
      this.selectedItems.forEach(item => {
        const index = this.available_alacarte_list.indexOf(item);
        if (index > -1) {
          this.available_alacarte_list.splice(index, 1);
          this.added_alacarte_list.push(item);
          itemsToMove.push(item);
          // console.log(this.added_alacarte_list.push(item));
        }
      });
      // this.containerData = this.added_alacarte_list.map((item: any) => {
      //   const match = item.match(/\((.*?)\)/);
      //   return match ? match[1] : null;
      // }).filter(Boolean);

      this.containerData = this.added_alacarte_list.map((item: any) => {
        const matches = item.match(/\((\d+)\)/g);
        if (matches && matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          const numberMatch = lastMatch.match(/\d+/);
          return numberMatch ? numberMatch[0] : null;
        }
        return null;
      }).filter(Boolean);

      // this.selectedItems.clear();
      console.log(this.containerData);
      // console.log(this.added_alacarte_list);
    } else if (direction === 'left') {
      this.selectedItems.forEach(item => {
        const index = this.added_alacarte_list.indexOf(item);
        if (index > -1) {
          this.added_alacarte_list.splice(index, 1);
          this.available_alacarte_list.push(item);
          itemsToMove.push(item);
          // console.log(this.available_alacarte_list.push(item));
        }
      });
      // this.containerData = this.added_alacarte_list.map((item: any) => {
      //   const match = item.match(/\((.*?)\)/);
      //   return match ? match[1] : null;
      // }).filter(Boolean);

      this.containerData = this.added_alacarte_list.map((item: any) => {
        const matches = item.match(/\((\d+)\)/g);
        if (matches && matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          const numberMatch = lastMatch.match(/\d+/);
          return numberMatch ? numberMatch[0] : null;
        }
        return null;
      }).filter(Boolean);

      // this.selectedItems.clear();
      console.log(this.containerData);
    }
    // this.available_alacarte_channel = Array.from(this.selectedItems);
    this.alacarte_list_id = Array.from(this.selectedItems).map(item => {
      const match = item.match(/\((\d+)\)/);
      return match ? match[1] : null;
    });
    // console.log(this.alacarte_list_id);
    console.log(this.added_alacarte_list);
    // this.containerData = this.added_alacarte_list.map((item: any) => {
    //   const match = item.match(/\((.*?)\)/);
    //   return match ? match[1] : null;
    // }).filter(Boolean);
    // // this.selectedItems.clear();
    // console.log(this.containerData);

    this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
    this.filteredAddedList = [...this.added_alacarte_list];
    this.selectedItems.clear();
    // console.log('Available Alacarte List:', this.available_alacarte_list);
    // console.log('Added Alacarte List:', this.added_alacarte_list);
  }



  moveSelectedBouquet_Items(direction: 'left' | 'right') {
    this.modified = true;
    const itemsToMove: any[] = [];
    if (direction === 'right') {
      this.selectedItems.forEach(item => {
        const index = this.available_bouquet_list.indexOf(item);
        if (index > -1) {
          this.available_bouquet_list.splice(index, 1);
          this.added_bouquet_list.push(item);
          itemsToMove.push(item);
          console.log('22222222222222', this.available_bouquet_list.length);
        }
      });
      console.log(this.available_bouquet_list);

      console.log(this.added_bouquet_list);
      // this.containerData = this.added_bouquet_list.map((item: any) => {
      //   const match = item.match(/\((.*?)\)/);
      //   return match ? match[1] : null;
      // }).filter(Boolean);


      this.containerData = this.added_bouquet_list.map((item: any) => {
        const matches = item.match(/\((\d+)\)/g);
        if (matches && matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          const numberMatch = lastMatch.match(/\d+/);
          return numberMatch ? numberMatch[0] : null;
        }
        return null;
      }).filter(Boolean);
      console.log(this.containerData);
    } else if (direction === 'left') {
      this.selectedItems.forEach(item => {
        const index = this.added_bouquet_list.indexOf(item);
        if (index > -1) {
          this.added_bouquet_list.splice(index, 1);
          this.available_bouquet_list.push(item);
          itemsToMove.push(item);
        }
      });
      console.log(this.available_bouquet_list);
      // this.removed_channel_list = itemsToMove.map((item: any) => {
      //   const match = item.match(/\((.*?)\)/);
      //   return match ? match[1] : null;
      // }).filter(Boolean);
      this.removed_channel_list = itemsToMove.map((item: any) => {
        const matches = item.match(/\((\d+)\)/g);
        if (matches && matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          const numberMatch = lastMatch.match(/\d+/);
          return numberMatch ? numberMatch[0] : null;
        }
        return null;
      }).filter(Boolean);

      console.log(this.added_bouquet_list);
      // this.containerData = this.added_bouquet_list.map((item: any) => {
      //   const match = item.match(/\((.*?)\)/);
      //   return match ? match[1] : null;
      // }).filter(Boolean);


      this.containerData = this.added_bouquet_list.map((item: any) => {
        const matches = item.match(/\((\d+)\)/g);
        if (matches && matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          const numberMatch = lastMatch.match(/\d+/);
          return numberMatch ? numberMatch[0] : null;
        }
        return null;
      }).filter(Boolean);
      console.log(this.containerData);
      console.log(this.removed_channel_list);
    }
    // this.bouquet_list_id = Array.from(this.selectedItems).map(item => {
    //   const match = item.match(/\((\d+)\)/);
    //   return match ? match[1] : null;
    // });

    // this.containerData = this.added_bouquet_list.map((item: any) => {
    //   const match = item.match(/\((.*?)\)/);
    //   return match ? match[1] : null;
    // }).filter(Boolean);
    // console.log(this.containerData);
    this.filteredAvailableBouquetList = [...this.available_bouquet_list]
    this.filteredAddedBouquetList = [...this.added_bouquet_list]
    this.selectedItems.clear();

  }
  moveSelectedLeft_bouquet_Items(direction: 'left' | 'right') {
    const itemsToMove: any[] = [];
    if (direction === 'right') {
      this.selectedItems.forEach(item => {
        const index = this.available_bouquet_list.indexOf(item);
        if (index > -1) {
          this.available_bouquet_list.splice(index, 1);
          this.added_bouquet_list.push(item);
          itemsToMove.push(item);
        }
        // console.log(this.added_bouquet_list.push(item));
      });
      console.log(this.added_bouquet_list);

    } else if (direction === 'left') {
      this.selectedItems.forEach(item => {
        const index = this.added_bouquet_list.indexOf(item);
        if (index > -1) {
          this.added_bouquet_list.splice(index, 1);
          this.available_bouquet_list.push(item);
          itemsToMove.push(item);
        }
        // console.log(this.available_bouquet_list.push(item));
      });
    }
    this.bouquet_list_id = Array.from(this.selectedItems).map(item => {
      const match = item.match(/\((\d+)\)/);
      return match ? match[1] : null;
    });
    // console.log(this.bouquet_list_id);
    // console.log(this.available_bouquet_list);

    // this.selectedItems.clear();


    // this.containerData = this.added_bouquet_list.map((item: any) => {
    //   const match = item.match(/\((.*?)\)/);
    //   return match ? match[1] : null;
    // }).filter(Boolean);

    this.containerData = this.added_bouquet_list.map((item: any) => {
      const matches = item.match(/\((\d+)\)/g);
      if (matches && matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const numberMatch = lastMatch.match(/\d+/);
        return numberMatch ? numberMatch[0] : null;
      }
      return null;
    }).filter(Boolean);


    // this.containerData = this.available_bouquet_list.map((item: any) => {
    //   const match = item.match(/\((.*?)\)/);
    //   return match ? match[1] : null;
    // }).filter(Boolean);

    this.containerData = this.available_bouquet_list.map((item: any) => {
      const matches = item.match(/\((\d+)\)/g);
      if (matches && matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const numberMatch = lastMatch.match(/\d+/);
        return numberMatch ? numberMatch[0] : null;
      }
      return null;
    }).filter(Boolean);


    this.filteredAvailableBouquetList = [...this.available_bouquet_list]
    this.filteredAddedBouquetList = [...this.added_bouquet_list]
    this.selectedItems.clear();
  }

  alacarteId: any;
  // moveAll_alacarte_Items(direction: 'left' | 'right') {
  //   this.modified = true;
  //   if (direction === 'right') {
  //     this.added_alacarte_list.push(...this.available_alacarte_list);
  //     this.alacarte_list_id = this.available_alacarte_list.map((item: any) => {
  //       const match = item.match(/\((\d+)\)/);
  //       return match ? match[1] : null;
  //     });
  //     this.containerData = this.added_alacarte_list.map((item: any) => {
  //       const match = item.match(/\((\d+)\)/);
  //       return match ? match[1] : null;
  //     });
  //     this.available_alacarte_list = [];
  //   } else if (direction === 'left') {
  //     this.available_alacarte_list.push(...this.added_alacarte_list);
  //     this.added_alacarte_list = [];

  //   }
  //   this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
  //   this.filteredAddedList = [...this.added_alacarte_list];
  //   this.selectedItems.clear();
  // }
  // moveAll_alacarte_Items(direction: 'left' | 'right') {
  //   this.modified = true;

  //   if (direction === 'right') {

  //     const itemsToMove = [...this.filteredAvailableAlacarteList];
  //     console.log("Moving filtered available → added", itemsToMove);
  //     console.log("Moving filtered available → added", this.added_alacarte_list);

  //     // ✅ add only new items to right side (no duplicates)
  //     itemsToMove.forEach(item => {
  //       if (!this.added_alacarte_list.includes(item)) {
  //         this.added_alacarte_list.push(item);
  //       }
  //     });

  //     // ✅ remove only moved items from left side
  //     this.available_alacarte_list = this.available_alacarte_list.filter(
  //       (item: any) => !itemsToMove.includes(item)
  //     );

  //     // update IDs only for moved items
  //     const movedIds = itemsToMove.map((item: any) => {
  //       const match = item.match(/\((\d+)\)/);
  //       return match ? match[1] : null;
  //     });

  //     this.alacarte_list_id.push(...movedIds);
  //     this.containerData.push(...movedIds);
  //     console.log(this.containerData);

  //   } else if (direction === 'left') {
  //     console.log("Moving filtered added → available");

  //     const itemsToMove = [...this.filteredAddedList];
  //     console.log("Moving filtered available → added", itemsToMove);
  //     console.log("Moving filtered available → added", this.available_alacarte_list);
  //     // ✅ add only new items to left side (no duplicates)
  //     itemsToMove.forEach(item => {
  //       if (!this.available_alacarte_list.includes(item)) {
  //         this.available_alacarte_list.push(item);
  //       }
  //     });

  //     // ✅ remove only moved items from right side
  //     this.added_alacarte_list = this.added_alacarte_list.filter(
  //       (item: any) => !itemsToMove.includes(item)
  //     );
  //   }

  //   // 🔄 Refresh filtered lists so UI updates
  //   this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
  //   this.filteredAddedList = [...this.added_alacarte_list];

  //   // clear selection
  //   this.selectedItems.clear();
  // }

  // moveAll_alacarte_Items(direction: 'left' | 'right') {
  //   this.modified = true;

  //   if (direction === 'right') {
  //     const itemsToMove = [...this.filteredAvailableAlacarteList];
  //     console.log("Moving filtered available → added", itemsToMove);

  //     // ✅ Add only new items to right side (no duplicates)
  //     itemsToMove.forEach(item => {
  //       if (!this.added_alacarte_list.includes(item)) {
  //         this.added_alacarte_list.push(item);
  //       }
  //     });
  //     console.log('added_alacarte_list', this.added_alacarte_list);
  //     console.log('available_alacarte_list', this.available_alacarte_list);

  //     // ✅ Remove only moved items from left side
  //     this.available_alacarte_list = this.available_alacarte_list.filter(
  //       (item: any) => itemsToMove.includes(item)
  //     );


  //     // ✅ Extract moved IDs
  //     const movedIds = itemsToMove.map((item: any) => {
  //       const match = item.match(/\((\d+)\)/);
  //       return match ? match[1] : null;
  //     }).filter(Boolean);

  //     // ✅ Keep containerData = already inside + new moved data

  //     // ✅ Remove duplicates (if needed)


  //     // ✅ Keep alacarte_list_id also updated
  //     this.alacarte_list_id = Array.from(new Set([
  //       ...this.alacarte_list_id,
  //       ...movedIds
  //     ]));
  //     this.containerData = this.added_alacarte_list

  //     console.log("Final containerData:", this.containerData);


  //   } else if (direction === 'left') {
  //     console.log("Moving filtered added → available");

  //     const itemsToMove = [...this.filteredAddedList];
  //     console.log("Moving filtered added", itemsToMove);

  //     // ✅ add only new items to left side (no duplicates)
  //     itemsToMove.forEach(item => {
  //       if (!this.available_alacarte_list.includes(item)) {
  //         this.available_alacarte_list.push(item);
  //       }
  //     });

  //     // ✅ remove only moved items from right side
  //     this.added_alacarte_list = this.added_alacarte_list.filter(
  //       (item: any) => !itemsToMove.includes(item)
  //     );

  //     // ✅ also remove from containerData & alacarte_list_id
  //     const removedIds = itemsToMove.map((item: any) => {
  //       const match = item.match(/\((\d+)\)/);
  //       return match ? match[1] : null;
  //     });


  //     this.alacarte_list_id = this.alacarte_list_id.filter(
  //       (id: any) => !removedIds.includes(id)
  //     );
  //     this.containerData = this.available_alacarte_list
  //   }

  //   // 🔄 Refresh filtered lists so UI updates
  //   this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
  //   this.filteredAddedList = [...this.added_alacarte_list];

  //   // clear selection
  //   this.selectedItems.clear();
  // }



  moveAll_alacarte_Items(direction: 'left' | 'right') {
    this.modified = true;
    if (direction === 'right') {
      const itemsToMove = [...this.filteredAvailableAlacarteList];
      console.log("Moving filtered available → added", itemsToMove);
      itemsToMove.forEach(item => {
        if (!this.added_alacarte_list.includes(item)) {
          this.added_alacarte_list.push(item);
        }
      });
      this.available_alacarte_list = this.available_alacarte_list.filter(
        (item: any) => !itemsToMove.includes(item)
      );
      this.containerData = [...this.added_alacarte_list];
      this.containerData = this.containerData.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      }).filter(Boolean);

      console.log("Final containerData (full items):", this.containerData);
      console.log("Final alacarte_list_id (only IDs):", this.alacarte_list_id);

    } else if (direction === 'left') {
      console.log("Moving filtered added → available");

      const itemsToMove = [...this.filteredAddedList];
      console.log("Moving filtered added", itemsToMove);
      itemsToMove.forEach(item => {
        if (!this.available_alacarte_list.includes(item)) {
          this.available_alacarte_list.push(item);
        }
      });
      this.added_alacarte_list = this.added_alacarte_list.filter(
        (item: any) => !itemsToMove.includes(item)
      );
      this.containerData = [...this.added_alacarte_list];
      this.containerData = this.containerData.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      }).filter(Boolean);

      console.log("Final containerData (full items):", this.containerData);
      console.log("Final alacarte_list_id (only IDs):", this.alacarte_list_id);
    }
    this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
    this.filteredAddedList = [...this.added_alacarte_list];

    this.selectedItems.clear();
  }


  // moveAll_bouquet_Items(direction: 'left' | 'right') {
  //   this.modified = true;
  //   if (direction === 'right') {
  //     console.log('right to left');

  //     this.added_bouquet_list.push(...this.available_bouquet_list);
  //     this.available_bouquet_list.forEach((item: any) => {
  //       if (!this.added_bouquet_list.includes(item)) {
  //         this.added_bouquet_list.push(item);
  //       }
  //     });

  //     this.containerData = this.added_bouquet_list.map((item: any) => {
  //       const match = item.match(/\((\d+)\)/);
  //       return match ? match[1] : null;
  //     });
  //     console.log(this.containerData);
  //     this.available_bouquet_list = [];
  //   } else if (direction === 'left') {
  //     console.log('left to right');

  //     this.added_bouquet_list.forEach((item: any) => {
  //       if (!this.available_bouquet_list.includes(item)) {
  //         this.available_bouquet_list.push(item);
  //       }
  //     });
  //     this.bouquet_list_id = this.available_bouquet_list.map((item: any) => {
  //       const match = item.match(/\((\d+)\)/);
  //       return match ? match[1] : null;
  //     });
  //     console.log(this.bouquet_list_id);
  //     this.available_bouquet_list.push(...this.added_bouquet_list);
  //     this.added_bouquet_list = [];
  //   }

  //   this.filteredAvailableBouquetList = [...this.available_bouquet_list];
  //   this.filteredAddedBouquetList = [...this.added_bouquet_list];
  //   this.selectedItems.clear();
  // }

  // moveAll_bouquet_Items(direction: 'left' | 'right') {
  //   this.modified = true;

  //   if (direction === 'right') {
  //     console.log('moving FILTERED available → added');

  //     // move only filtered available items
  //     this.added_bouquet_list.push(...this.filteredAvailableBouquetList);

  //     // remove moved items from available
  //     this.available_bouquet_list = this.available_bouquet_list.filter(
  //       (item: any) => !this.filteredAvailableBouquetList.includes(item)
  //     );

  //     // update IDs for moved items
  //     const movedIds = this.filteredAvailableBouquetList.map((item: any) => {
  //       const match = item.match(/\((\d+)\)/);
  //       return match ? match[1] : null;
  //     });
  //     this.containerData.push(...movedIds);

  //   } else if (direction === 'left') {
  //     console.log('moving FILTERED added → available');

  //     // move only filtered added items
  //     this.available_bouquet_list.push(...this.filteredAddedBouquetList);

  //     // remove moved items from added
  //     this.added_bouquet_list = this.added_bouquet_list.filter(
  //       (item: any) => !this.filteredAddedBouquetList.includes(item)
  //     );

  //     // update bouquet_list_id
  //     this.bouquet_list_id = this.available_bouquet_list.map((item: any) => {
  //       const match = item.match(/\((\d+)\)/);
  //       return match ? match[1] : null;
  //     });
  //   }

  //   // refresh filtered lists
  //   this.filteredAvailableBouquetList = [...this.available_bouquet_list];
  //   this.filteredAddedBouquetList = [...this.added_bouquet_list];
  //   this.selectedItems.clear();

  // }

  moveAll_bouquet_Items(direction: 'left' | 'right') {
    this.modified = true;
    if (direction === 'right') {
      console.log('moving FILTERED available → added');
      const itemsToMove = [...this.filteredAvailableBouquetList];
      console.log("Moving filtered available → added", itemsToMove);
      itemsToMove.forEach(item => {
        if (!this.added_bouquet_list.includes(item)) {
          this.added_bouquet_list.push(item);
        }
      });
      this.available_alacarte_list = this.available_alacarte_list.filter(
        (item: any) => !itemsToMove.includes(item)
      );
      this.containerData = [...this.added_bouquet_list];
      this.containerData = this.containerData.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      }).filter(Boolean);

      console.log("Final containerData (full items):", this.containerData);
      console.log("Final alacarte_list_id (only IDs):", this.added_bouquet_list);
    } else if (direction === 'left') {
      console.log("moving FILTERED added → available");
      const itemsToMove = [...this.filteredAddedBouquetList];
      itemsToMove.forEach(item => {
        if (!this.available_bouquet_list.includes(item)) {
          this.available_bouquet_list.push(item);
        }
      });
      this.added_bouquet_list = this.added_bouquet_list.filter(
        (item: any) => !itemsToMove.includes(item)
      );
    }
    this.containerData = this.added_bouquet_list
      .map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    console.log("Final containerData (only IDs):", this.containerData);
    console.log("Right side items (added_bouquet_list):", this.added_bouquet_list);
    this.filteredAvailableBouquetList = [...this.available_bouquet_list];
    this.filteredAddedBouquetList = [...this.added_bouquet_list];
    this.selectedItems.clear();
  }


  containerData: any = [];
  drop(event: CdkDragDrop<string[]>) {
    console.log(event);

    console.log(this.containerData);
    if (event.previousContainer === event.container) {
      console.log('sss');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('dfdlfjd');
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.containerData = event.container.data.map((item: any) => {
      const matches = item.match(/\((\d+)\)/g);
      if (matches && matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const numberMatch = lastMatch.match(/\d+/);
        return numberMatch ? numberMatch[0] : null;
      }
      return null;
    }).filter(Boolean);

    console.log("Updated container data:", this.containerData);
  }

  // -----------------------------------------------------------------------------------------

  drop1(event: CdkDragDrop<string[]>, val: number) {
    this.modified = true;
    const draggedItem = event.item;
    const draggedElement = draggedItem.element.nativeElement;
    const draggedData = draggedItem.data;
    console.log('Dragged data:', draggedData);
    console.log('Dragged element:', draggedElement);
    console.log('Item dropped:', event.item);
    console.log(event);
    console.log(val);
    console.log("ddddd")
    console.log(available_old_bouquet_list);
    console.log(this.available_bouquet_list);
    var available_old_bouquet_list = this.available_bouquet_list;
    console.log(this.bouquet_removelist_id);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      if (val == 1) {
        this.available_bouquet_list = event.container.data;
        this.added_bouquet_list = event.previousContainer.data;
        console.log('else condition')
        const textContent = draggedElement.textContent || draggedElement.innerText;
        console.log(textContent);
        console.log("1111")
        const match = textContent.match(/\((\d+)\)/);
        console.log("222")
        console.log(match);
        if (match) {
          console.log("333")
          const id = match[1];
          console.log("4444")
          console.log(id);
          this.bouquet_removelist_id.push(id);
          console.log("5555")
        } else {
          console.log("6666")
          console.log('No ID found');
        }
      } else {
        console.log("7777")
        this.added_bouquet_list = event.container.data;
        console.log("888")
        this.available_bouquet_list = event.previousContainer.data;
        console.log("99")
        console.log('bouquet list', this.bouquet_removelist_id);

      }
      // this.containerData = this.added_bouquet_list.map((item: any) => {
      //   const match = item.match(/\((.*?)\)/);
      //   return match ? match[1] : null;
      // }).filter(Boolean);
      this.containerData = this.added_bouquet_list.map((item: any) => {
        const matches = item.match(/\((\d+)\)/g);
        if (matches && matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          const numberMatch = lastMatch.match(/\d+/);
          return numberMatch ? numberMatch[0] : null;
        }
        return null;
      }).filter(Boolean);

      console.log('container', this.containerData);
      console.log("11")
    }
    console.log("-------------------------------------------------")
    console.log(this.bouquet_removelist_id)
  }
  drop2(event: CdkDragDrop<string[]>, val: number) {
    this.modified = true;
    const draggedItem = event.item;
    const draggedElement = draggedItem.element.nativeElement;
    const draggedData = draggedItem.data;
    console.log('Dragged data:', draggedData);
    console.log('Dragged element:', draggedElement);
    console.log('Item dropped:', event.item);
    console.log(event);
    console.log(val);
    console.log("ddddd")
    console.log(available_old_bouquet_list);
    var available_old_bouquet_list = this.available_alacarte_list;
    console.log(this.bouquet_removelist_id);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      if (val == 1) {
        this.available_alacarte_list = event.container.data;
        this.added_alacarte_list = event.previousContainer.data;

      } else {
        this.added_alacarte_list = event.container.data;
        this.available_alacarte_list = event.previousContainer.data;
        console.log('bouquet list id', this.bouquet_removelist_id);

      }
      // this.containerData = this.added_alacarte_list.map((item: any) => {
      //   const match = item.match(/\((.*?)\)/);
      //   return match ? match[1] : null;
      // }).filter(Boolean);

      this.containerData = this.added_alacarte_list.map((item: any) => {
        const matches = item.match(/\((\d+)\)/g);
        if (matches && matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          const numberMatch = lastMatch.match(/\d+/);
          return numberMatch ? numberMatch[0] : null;
        }
        return null;
      }).filter(Boolean);
      console.log('container data', this.containerData);
    }
    console.log("-------------------------------------------------")
    console.log(this.bouquet_removelist_id)
  }
  save() {
    console.log(this.containerData);
    console.log(this.alacarte_list_id);
    console.log(this.added_alacarte_list);
    console.log(this.alacarteId || 0);
    this.containerID = this.alacarteId || 0
    console.log(this.containerID);
    this.containerData = this.containerData.length == 0 ? 0 : this.containerData;
    console.log(this.containerData);

    if (this.alacarte_list_id) {
      console.log('save');
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Change it!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Updating...',
            text: 'Please wait for Alacarte channels to update....',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading(null);
            }
          });
          console.log(this.alacarte_list_id);
          console.log(this.containerData);
          this.userService.AddingdAlacarteTo_Base_Package(this.modified, this.containerData, this.role, this.username, this.package_id).subscribe((res: any) => {
            console.log(res);
            this.swal.success(res?.message);
            this.modified = false;
          }, (err) => {
            this.swal.Error3(err?.error?.message);
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Warning!',
        icon: 'warning',
        text: 'Invalid Input',
        timer: 1000,
        showConfirmButton: false
      })
    }
    this.selectedItems.clear();
  }
  save1() {
    this.containerData = this.containerData.length == 0 ? 0 : this.containerData;
    console.log(this.containerData);
    console.log('bouquet_list_id', this.bouquet_list_id);
    var bouquetId = this.bouquet_removelist_id || 0;
    console.log('bouquet_removelist_id', bouquetId);
    // if (this.bouquet_list_id) {
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait for Addon channel list to update....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        if (bouquetId == null || bouquetId == undefined || bouquetId == '') {
          bouquetId = 0;
        }
        console.log('bouquetId', bouquetId);

        this.userService.AddingdbouquetTo_Base_Package(this.modified, this.containerData, this.role, this.username, this.package_id, bouquetId,).subscribe((res: any) => {
          console.log(res);
          this.swal.success(res?.message);
          this.modified = false;
        }, (err) => {
          this.swal.Error3(err?.error?.message);
        });
      }
    });

  }
}

