// import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
// import { CommonModule } from '@angular/common';
// import { ChangeDetectorRef, Component } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { ActivatedRoute, Router } from '@angular/router';
// import { BaseService } from 'src/app/_core/service/base.service';
// import { StorageService } from 'src/app/_core/service/storage.service';
// import Swal from 'sweetalert2';
// import { PackageBASEDEMOComponent } from '../../package Creation/package-base-demo/package-base-demo.component';
// import { FormsModule } from '@angular/forms';
// import { SwalService } from 'src/app/_core/service/swal.service';
// import { Location } from '@angular/common';

// @Component({
//   selector: 'app-addon-manage',
//   templateUrl: './addon-manage.component.html',
//   styleUrls: ['./addon-manage.component.scss'],
//   standalone: true,
//   imports: [CdkDropList, CdkDrag, CommonModule, FormsModule]
// })
// export class AddonManageComponent {
//   id: any;
//   Addon_Package_Name: any;
//   Addon_Package_Rate: any;
//   package_viewing_count: any;
//   Pay_Channel_Count: any;
//   Fta_Count: any;
//   username: any;
//   role: any;
//   removed_channel_list: any = 0;
//   modified: boolean = true;
//   subcount: any;
//   alacarte_available_list: any[] = [];
//   alacarte_added_list: any[] = [];
//   addon_available_list: any[] = [];
//   addodn_added_list: any[] = [];
//   alacarte_list_id: any = [];
//   bouquet_list_id: any;
//   bouquet_removelist_id: any = [];
//   available_alacarte_list: any = [];
//   added_alacarte_list: any = [];
//   available_bouquet_list: any = [];
//   added_bouquet_list: any = [];
//   before_available_alacarte_list: any = [];
//   before_added_alacarte_list: any = [];
//   before_available_bouquet_list: any = [];
//   before_added_bouquet_list: any = [];
//   selectedItems = new Set<string>();
//   availableFilter: any;
//   addedFilter: any;
//   Available_alacarte_count: any;
//   Available_addon_count: any;
//   Added_addon_count: any;
//   Added_alacarte_count: any;


//   searchTermAlacarte: any;
//   searchTermAdded: any;
//   searchTermAddedBouquet: any;
//   searchTermAvailableBouquet: any;

//   filteredAvailableAlacarteList: any = [];
//   filteredAddedList: any = [];
//   filteredAvailableBouquetList: any = [];
//   filteredAddedBouquetList: any = [];

//   takenAlacarte: any;
//   placedAlacarte: any;
//   alacarteOutput: any;
//   adalarteOutput: any;

//   originalAvailableAlacarteList: any[] = [];
//   originalAddedAlacarteList: any[] = [];
//   originalAvailableBouquetList: any[] = [];
//   originalAddedBouquetList: any[] = [];

//   constructor(public dialog: MatDialog, public router: Router, private route: ActivatedRoute, private location: Location, private cdr: ChangeDetectorRef, private swal: SwalService, private userService: BaseService, private storageservice: StorageService) {
//     this.username = storageservice.getUsername();
//     this.role = storageservice.getUserRole();
//   }
//   ngOnInit(): void {
//     this.modified = false;
//     console.log(this.subcount);
//     this.id = this.route.snapshot.paramMap.get('id');
//     console.log('Package ID:', this.id);
//     this.userService.ADDON_MANAGE_PACKAGE(this.id, this.role, this.username).subscribe((data: any) => {
//       console.log(data);

//       this.Addon_Package_Rate = data[0].Addon_Package_Rate
//       this.Addon_Package_Name = data[0].Addon_Package_Name
//       this.package_viewing_count = data[0].Package_view_Count
//       this.Pay_Channel_Count = data[0].Pay_Channel_Count
//       this.Fta_Count = data[0].Fta_Count
//       this.Available_alacarte_count = data[0].Available_alacarte_count
//       this.Available_addon_count = data[0].Available_addon_count
//       this.Added_alacarte_count = data[0].Added_alacarte_count
//       this.Added_addon_count = data[0].Added_addon_count

//       this.available_alacarte_list = data[0].Available_Alacarte.map((available_alacarte: any) => {
//         return `${available_alacarte.channel_name} (${available_alacarte.channel_id}) - Rs.${available_alacarte.inr_amt}.0`;
//       });
//       this.added_alacarte_list = data[0].Added_Alacarte.map((addede_alacarte: any) => {
//         return `${addede_alacarte.channel_name} (${addede_alacarte.channel_id}) - Rs.${addede_alacarte.inr_amt}.0`;
//       });
//       this.available_bouquet_list = data[0].Available_Addon.map((available_bouquet: any) => {
//         return `${available_bouquet.addon_package_name} (${available_bouquet.order_id}) - Rs.${available_bouquet.addon_package_rate}.0`;
//       });
//       this.added_bouquet_list = data[0].Added_Addon.map((added_bouque: any) => {
//         return `${added_bouque.addon_package_name} (${added_bouque.order_id}) - Rs.${added_bouque.addon_package_rate}.0`;
//       });
//       this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
//       this.filteredAddedList = [...this.added_alacarte_list];
//       this.filteredAvailableBouquetList = [...this.available_bouquet_list];
//       this.filteredAddedBouquetList = [...this.added_bouquet_list];
//       console.log(this.alacarte_available_list);
//       this.alacarte_list_id = data[0].Available_Alacarte.map((available_alacarte: any) => available_alacarte.channel_id);
//       // this.added_alacarte_list_id = data[0].Added_Alacarte.map((added_alacarte: any) => added_alacarte.channel_id)
//       this.bouquet_list_id = data[0].Available_addon.map((available_bouquet: any) => {
//         return ` ${available_bouquet.channel_id} `;
//       });

//     })
//   }

//   todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

//   done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail'];
//   containerData: any = [];


//   drop(event: CdkDragDrop<string[]>, val: number) {
//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
//       this.available_alacarte_list = event.previousContainer.data;
//       this.added_alacarte_list = event.container.data;
//       if (val === 1) {
//         this.alacarteOutput = this.available_alacarte_list;
//       } else if (val === 2) {
//         this.adalarteOutput = this.added_alacarte_list;
//       }
//       const alacarteIds = (this.alacarteOutput || this.adalarteOutput).map((item: any) => {
//         const match = item.match(/\((\d+)\)/);
//         return match ? Number(match[1]) : null;
//       }).filter((id: any) => id !== null);

//       this.containerData = [...alacarteIds];
//     }
//   }

//   goBack(): void {
//     this.location.back();
//   }
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
//         console.log("10")
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
//     const draggedItem = event.item; // CdkDrag instance of the dragged element
//     const draggedElement = draggedItem.element.nativeElement; // Actual DOM element
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
//         console.log('else condition')
//         const textContent = draggedElement.textContent || draggedElement.innerText;
//         console.log(textContent);
//         const match = textContent.match(/\((\d+)\)/);
//         console.log(match);
//         if (match) {
//           const id = match[1];
//           console.log(id);
//           this.bouquet_removelist_id.push(id);
//         } else {
//           console.log('No ID found');
//         }
//       } else {
//         this.added_alacarte_list = event.container.data;
//         this.available_alacarte_list = event.previousContainer.data;
//       }
//       this.containerData = this.added_alacarte_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       console.log(this.containerData);
//     }
//     console.log("-------------------------------------------------")
//     console.log(this.bouquet_removelist_id)
//   }




//   back() {
//     this.router.navigateByUrl("admin/Addon");
//   }
//   trackByFn(index: number, item: string) {
//     return index;
//   }
//   pay_channel(type: any) {
//     let dialogData = { type: type, package_id: this.id }
//     const dialogRef = this.dialog.open(PackageBASEDEMOComponent, {
//       width: '1500px',
//       height: '600px',
//       panelClass: 'custom-dialog-container',
//       data: dialogData
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//     });
//   }
//   toggleSelection(item: string) {
//     if (this.selectedItems.has(item)) {
//       this.selectedItems.delete(item);
//     } else {
//       this.selectedItems.add(item);
//     }
//   }

//   isSelected(item: string): boolean {
//     return this.selectedItems.has(item);
//     // return false;
//   }
//   moveSelectedAlacarte_Items(direction: 'left' | 'right') {
//     console.log(event);
//     this.modified = true;
//     const itemsToMove: any[] = [];
//     this.before_added_alacarte_list = this.added_alacarte_list.length;
//     this.before_available_alacarte_list = this.available_alacarte_list.length;
//     console.log(' this.before_added_alacarte_list', this.before_added_alacarte_list);
//     if (direction === 'right') {
//       this.selectedItems.forEach(item => {
//         const index = this.available_alacarte_list.indexOf(item);
//         if (index > -1) {
//           this.available_alacarte_list.splice(index, 1);
//           this.added_alacarte_list.push(item);
//           itemsToMove.push(item);
//           // console.log(this.added_alacarte_list.push(item));
//           console.log(this.added_alacarte_list.length);
//         }
//         this.containerData = this.added_alacarte_list.map((item: any) => {
//           const match = item.match(/\((.*?)\)/);
//           return match ? match[1] : null;
//         }).filter(Boolean);
//         console.log(this.containerData);
//         // console.log(this.added_alacarte_list);

//       });
//     } else if (direction === 'left') {
//       this.selectedItems.forEach(item => {
//         const index = this.added_alacarte_list.indexOf(item);
//         if (index > -1) {
//           this.added_alacarte_list.splice(index, 1);
//           this.available_alacarte_list.push(item);
//           itemsToMove.push(item);
//         }
//       });
//       // console.log(this.available_alacarte_list);
//       console.log(this.added_alacarte_list.length);
//       this.containerData = this.added_alacarte_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       console.log(this.containerData);
//     }
//     // this.available_alacarte_channel = Array.from(this.selectedItems);
//     this.alacarte_list_id = Array.from(this.selectedItems).map(item => {
//       const match = item.match(/\((\d+)\)/);
//       return match ? match[1] : null;
//     });
//     console.log(this.added_alacarte_list);
//     this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
//     this.filteredAddedList = [...this.added_alacarte_list];
//     this.selectedItems.clear();
//     console.log(this.containerData);
//   }


//   moveSelectedBouquet_Items(direction: 'left' | 'right') {
//     this.modified = true;
//     const itemsToMove: any[] = [];
//     // this.before_available_alacarte_list = this.available_alacarte_list.length
//     // this.before_available_bouquet_list = this.available_bouquet_list.length;
//     // this.added_bouquet_list = this.added_bouquet_list.length;
//     console.log('1111111111111', this.before_available_alacarte_list);
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
//       this.containerData = this.added_bouquet_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       console.log(this.containerData);
//       console.log(this.added_bouquet_list);
//       console.log(this.added_bouquet_list.length);
//     } else if (direction === 'left') {
//       this.selectedItems.forEach(item => {
//         const index = this.added_bouquet_list.indexOf(item);
//         if (index > -1) {
//           this.added_bouquet_list.splice(index, 1);
//           this.available_bouquet_list.push(item);
//           itemsToMove.push(item);
//         }
//       });
//       this.bouquet_list_id = Array.from(this.selectedItems).map(item => {
//         const match = item.match(/\((\d+)\)/);
//         return match ? match[1] : null;
//       });
//       this.containerData = this.added_bouquet_list.map((item: any) => {
//         const match = item.match(/\((.*?)\)/);
//         return match ? match[1] : null;
//       }).filter(Boolean);
//       console.log(this.containerData);
//       console.log(this.added_bouquet_list.length);

//     }
//     this.filteredAvailableBouquetList = [...this.available_bouquet_list];
//     this.filteredAddedBouquetList = [...this.added_bouquet_list];
//     this.selectedItems.clear();
//   }



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
//       console.log(this.containerData);
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
//   filterAvailableList(): void {
//     this.cdr.detectChanges();
//     console.log(this.filteredAvailableAlacarteList);
//     const searchTerm = this.searchTermAlacarte ? this.searchTermAlacarte.toLowerCase() : '';
//     this.filteredAvailableAlacarteList = this.available_alacarte_list.filter((item: any) =>
//       item.toLowerCase().includes(searchTerm)
//     );
//     console.log(this.filteredAvailableAlacarteList);

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


//   searchTerm: string = '';

//   searchItems(search: string): void {
//     this.cdr.detectChanges();
//     const searchLower = search.toLowerCase();

//     this.filteredAvailableBouquetList = this.available_bouquet_list.filter((item: any) =>
//       item.toLowerCase().includes(searchLower)
//     );

//     this.filteredAddedBouquetList = this.added_bouquet_list.filter((item: any) =>
//       item.toLowerCase().includes(searchLower)
//     );
//     this.filteredAddedList = this.added_alacarte_list.filter((item: any) =>
//       item.toLowerCase().includes(searchLower)
//     );
//     this.filteredAvailableAlacarteList = this.available_alacarte_list.filter((item: any) =>
//       item.toLowerCase().includes(searchLower)
//     );
//   }


//   save() {

//     this.containerData = this.containerData.length == 0 ? 0 : this.containerData;
//     console.log(this.containerData);
//     // if (this.modified || !this.alacarte_list_id || !this.role || !this.username || !this.id) {
//     //   Swal.fire({
//     //     icon: 'error',
//     //     title: 'Error',
//     //     text: 'All fields are required!',
//     //   });
//     //   return;
//     // }
//     console.log('save');
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
//           text: 'Please wait for Alacarte channels to update....',
//           allowOutsideClick: false,
//           didOpen: () => {
//             Swal.showLoading(null);
//           }
//         });
//         this.userService.AddingdAlacarteTo_Addon_Package(this.modified, this.containerData, this.role, this.username, this.id).subscribe((res: any) => {
//           console.log(res)
//           this.swal.success(res?.message);
//           this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
//           this.filteredAddedList = [...this.added_alacarte_list];
//           this.modified = false;
//         }, (err) => {
//           this.swal.Error3(err?.error?.message);
//         });
//       }
//     });
//     this.selectedItems.clear();

//   }
//   save1() {
//     this.containerData = this.containerData.length == 0 ? 0 : this.containerData;
//     console.log(this.containerData);
//     console.log('bouquet_list_id', this.bouquet_list_id);
//     var bouquetId = this.bouquet_removelist_id || 0;
//     console.log('bouquet_removelist_id', bouquetId);

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
//         this.userService.AddingdbouquetTo_Addon_Package(this.modified, this.containerData, this.role, this.username, this.id, bouquetId || this.bouquet_list_id || 0,).subscribe((res: any) => {
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
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { PackageBASEDEMOComponent } from '../../package Creation/package-base-demo/package-base-demo.component';
import { FormsModule } from '@angular/forms';
import { SwalService } from 'src/app/_core/service/swal.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addon-manage',
  templateUrl: './addon-manage.component.html',
  styleUrls: ['./addon-manage.component.scss'],
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule, FormsModule]
})
export class AddonManageComponent {
  id: any;
  Addon_Package_Name: any;
  Addon_Package_Rate: any;
  package_viewing_count: any;
  Pay_Channel_Count: any;
  Fta_Count: any;
  username: any;
  role: any;
  removed_channel_list: any = 0;
  modified: boolean = true;
  subcount: any;
  alacarte_available_list: any[] = [];
  alacarte_added_list: any[] = [];
  addon_available_list: any[] = [];
  addodn_added_list: any[] = [];
  alacarte_list_id: any = [];
  bouquet_list_id: any;
  bouquet_removelist_id: any = [];
  available_alacarte_list: any = [];
  added_alacarte_list: any = [];
  available_bouquet_list: any = [];
  added_bouquet_list: any = [];
  before_available_alacarte_list: any = [];
  before_added_alacarte_list: any = [];
  before_available_bouquet_list: any = [];
  before_added_bouquet_list: any = [];
  selectedItems = new Set<string>();
  availableFilter: any;
  addedFilter: any;
  Available_alacarte_count: any;
  Available_addon_count: any;
  Added_addon_count: any;
  Added_alacarte_count: any;


  searchTermAlacarte: any;
  searchTermAdded: any;
  searchTermAddedBouquet: any;
  searchTermAvailableBouquet: any;

  filteredAvailableAlacarteList: any = [];
  filteredAddedList: any = [];
  filteredAvailableBouquetList: any = [];
  filteredAddedBouquetList: any = [];

  takenAlacarte: any;
  placedAlacarte: any;
  alacarteOutput: any;
  adalarteOutput: any;

  originalAvailableAlacarteList: any[] = [];
  originalAddedAlacarteList: any[] = [];
  originalAvailableBouquetList: any[] = [];
  originalAddedBouquetList: any[] = [];

  constructor(public dialog: MatDialog, public router: Router, private route: ActivatedRoute, private location: Location, private cdr: ChangeDetectorRef, private swal: SwalService, private userService: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }
  ngOnInit(): void {
    this.modified = false;
    console.log(this.subcount);
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Package ID:', this.id);
    this.userService.ADDON_MANAGE_PACKAGE(this.id, this.role, this.username).subscribe((data: any) => {
      console.log(data);

      this.Addon_Package_Rate = data[0].Addon_Package_Rate
      this.Addon_Package_Name = data[0].Addon_Package_Name
      this.package_viewing_count = data[0].Package_view_Count
      this.Pay_Channel_Count = data[0].Pay_Channel_Count
      this.Fta_Count = data[0].Fta_Count
      this.Available_alacarte_count = data[0].Available_alacarte_count
      this.Available_addon_count = data[0].Available_addon_count
      this.Added_alacarte_count = data[0].Added_alacarte_count
      this.Added_addon_count = data[0].Added_addon_count

      this.available_alacarte_list = data[0].Available_Alacarte.map((available_alacarte: any) => {
        return `${available_alacarte.channel_name} (${available_alacarte.channel_id}) - Rs.${available_alacarte.inr_amt}.0`;
      });
      this.added_alacarte_list = data[0].Added_Alacarte.map((addede_alacarte: any) => {
        return `${addede_alacarte.channel_name} (${addede_alacarte.channel_id}) - Rs.${addede_alacarte.inr_amt}.0`;
      });
      this.available_bouquet_list = data[0].Available_Addon.map((available_bouquet: any) => {
        return `${available_bouquet.addon_package_name} (${available_bouquet.order_id}) - Rs.${available_bouquet.addon_package_rate}.0`;
      });
      this.added_bouquet_list = data[0].Added_Addon.map((added_bouque: any) => {
        return `${added_bouque.addon_package_name} (${added_bouque.order_id}) - Rs.${added_bouque.addon_package_rate}.0`;
      });
      this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
      this.filteredAddedList = [...this.added_alacarte_list];
      this.filteredAvailableBouquetList = [...this.available_bouquet_list];
      this.filteredAddedBouquetList = [...this.added_bouquet_list];
      console.log(this.alacarte_available_list);
      this.alacarte_list_id = data[0].Available_Alacarte.map((available_alacarte: any) => available_alacarte.channel_id);
      // this.added_alacarte_list_id = data[0].Added_Alacarte.map((added_alacarte: any) => added_alacarte.channel_id)
      this.bouquet_list_id = data[0].Available_addon.map((available_bouquet: any) => {
        return ` ${available_bouquet.channel_id} `;
      });

    })
  }

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail'];
  containerData: any = [];


  drop(event: CdkDragDrop<string[]>, val: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.available_alacarte_list = event.previousContainer.data;
      this.added_alacarte_list = event.container.data;
      if (val === 1) {
        this.alacarteOutput = this.available_alacarte_list;
      } else if (val === 2) {
        this.adalarteOutput = this.added_alacarte_list;
      }
      const alacarteIds = (this.alacarteOutput || this.adalarteOutput).map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? Number(match[1]) : null;
      }).filter((id: any) => id !== null);

      this.containerData = [...alacarteIds];
    }
  }

  goBack(): void {
    this.location.back();
  }
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
      //   console.log("10")
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
    const draggedItem = event.item; // CdkDrag instance of the dragged element
    const draggedElement = draggedItem.element.nativeElement; // Actual DOM element
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
        console.log('else condition')
        const textContent = draggedElement.textContent || draggedElement.innerText;
        console.log(textContent);
        const match = textContent.match(/\((\d+)\)/);
        console.log(match);
        if (match) {
          const id = match[1];
          console.log(id);
          this.bouquet_removelist_id.push(id);
        } else {
          console.log('No ID found');
        }
      } else {
        this.added_alacarte_list = event.container.data;
        this.available_alacarte_list = event.previousContainer.data;
      }
      this.containerData = this.added_alacarte_list.map((item: any) => {
        const match = item.match(/\((.*?)\)/);
        return match ? match[1] : null;
      }).filter(Boolean);
      console.log(this.containerData);
    }
    console.log("-------------------------------------------------")
    console.log(this.bouquet_removelist_id)
  }




  back() {
    this.router.navigateByUrl("admin/Addon");
  }
  trackByFn(index: number, item: string) {
    return index;
  }
  pay_channel(type: any) {
    let dialogData = { type: type, package_id: this.id }
    const dialogRef = this.dialog.open(PackageBASEDEMOComponent, {
      width: '1500px',
      height: '600px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  toggleSelection(item: string) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
  }

  isSelected(item: string): boolean {
    return this.selectedItems.has(item);
    // return false;
  }
  moveSelectedAlacarte_Items(direction: 'left' | 'right') {
    console.log(event);
    this.modified = true;
    const itemsToMove: any[] = [];
    this.before_added_alacarte_list = this.added_alacarte_list.length;
    this.before_available_alacarte_list = this.available_alacarte_list.length;
    console.log(' this.before_added_alacarte_list', this.before_added_alacarte_list);
    if (direction === 'right') {
      this.selectedItems.forEach(item => {
        const index = this.available_alacarte_list.indexOf(item);
        if (index > -1) {
          this.available_alacarte_list.splice(index, 1);
          this.added_alacarte_list.push(item);
          itemsToMove.push(item);
          // console.log(this.added_alacarte_list.push(item));
          console.log(this.added_alacarte_list.length);
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
        console.log(this.containerData);
        // console.log(this.added_alacarte_list);

      });
    } else if (direction === 'left') {
      this.selectedItems.forEach(item => {
        const index = this.added_alacarte_list.indexOf(item);
        if (index > -1) {
          this.added_alacarte_list.splice(index, 1);
          this.available_alacarte_list.push(item);
          itemsToMove.push(item);
        }
      });
      // console.log(this.available_alacarte_list);
      console.log(this.added_alacarte_list.length);
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
      console.log(this.containerData);
    }
    // this.available_alacarte_channel = Array.from(this.selectedItems);
    this.alacarte_list_id = Array.from(this.selectedItems).map(item => {
      const match = item.match(/\((\d+)\)/);
      return match ? match[1] : null;
    });
    console.log(this.added_alacarte_list);
    this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
    this.filteredAddedList = [...this.added_alacarte_list];
    this.selectedItems.clear();
    console.log(this.containerData);
  }


  moveSelectedBouquet_Items(direction: 'left' | 'right') {
    this.modified = true;
    const itemsToMove: any[] = [];
    // this.before_available_alacarte_list = this.available_alacarte_list.length
    // this.before_available_bouquet_list = this.available_bouquet_list.length;
    // this.added_bouquet_list = this.added_bouquet_list.length;
    console.log('1111111111111', this.before_available_alacarte_list);
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
      console.log(this.added_bouquet_list);
      console.log(this.added_bouquet_list.length);
    } else if (direction === 'left') {
      this.selectedItems.forEach(item => {
        const index = this.added_bouquet_list.indexOf(item);
        if (index > -1) {
          this.added_bouquet_list.splice(index, 1);
          this.available_bouquet_list.push(item);
          itemsToMove.push(item);
        }
      });
      this.bouquet_list_id = Array.from(this.selectedItems).map(item => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
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
      console.log(this.added_bouquet_list.length);

    }
    this.filteredAvailableBouquetList = [...this.available_bouquet_list];
    this.filteredAddedBouquetList = [...this.added_bouquet_list];
    this.selectedItems.clear();
  }



  moveAll_alacarte_Items(direction: 'left' | 'right') {
    this.modified = true;
    if (direction === 'right') {
      this.added_alacarte_list.push(...this.available_alacarte_list);
      this.alacarte_list_id = this.available_alacarte_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      this.containerData = this.added_alacarte_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      console.log(this.containerData);
      this.available_alacarte_list = [];
    } else if (direction === 'left') {
      this.available_alacarte_list.push(...this.added_alacarte_list);
      this.added_alacarte_list = [];
    }
    this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
    this.filteredAddedList = [...this.added_alacarte_list];
    this.selectedItems.clear();
  }


  moveAll_bouquet_Items(direction: 'left' | 'right') {
    this.modified = true;
    if (direction === 'right') {
      console.log('right to left');

      this.added_bouquet_list.push(...this.available_bouquet_list);
      this.available_bouquet_list.forEach((item: any) => {
        if (!this.added_bouquet_list.includes(item)) {
          this.added_bouquet_list.push(item);
        }
      });
      // this.bouquet_list_id = this.available_bouquet_list.map((item: any) => {
      //   const match = item.match(/\((\d+)\)/);
      //   return match ? match[1] : null;
      // });
      this.containerData = this.added_bouquet_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      console.log(this.containerData);
      this.available_bouquet_list = [];
    } else if (direction === 'left') {
      console.log('left to right');

      this.added_bouquet_list.forEach((item: any) => {
        if (!this.available_bouquet_list.includes(item)) {
          this.available_bouquet_list.push(item);
        }
      });
      this.bouquet_list_id = this.available_bouquet_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      console.log(this.bouquet_list_id);
      this.available_bouquet_list.push(...this.added_bouquet_list);
      this.added_bouquet_list = [];
    }

    this.filteredAvailableBouquetList = [...this.available_bouquet_list];
    this.filteredAddedBouquetList = [...this.added_bouquet_list];
    this.selectedItems.clear();
  }
  filterAvailableList(): void {
    this.cdr.detectChanges();
    console.log(this.filteredAvailableAlacarteList);
    const searchTerm = this.searchTermAlacarte ? this.searchTermAlacarte.toLowerCase() : '';
    this.filteredAvailableAlacarteList = this.available_alacarte_list.filter((item: any) =>
      item.toLowerCase().includes(searchTerm)
    );
    console.log(this.filteredAvailableAlacarteList);

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


  searchTerm: string = '';

  searchItems(search: string): void {
    this.cdr.detectChanges();
    const searchLower = search.toLowerCase();

    this.filteredAvailableBouquetList = this.available_bouquet_list.filter((item: any) =>
      item.toLowerCase().includes(searchLower)
    );

    this.filteredAddedBouquetList = this.added_bouquet_list.filter((item: any) =>
      item.toLowerCase().includes(searchLower)
    );
    this.filteredAddedList = this.added_alacarte_list.filter((item: any) =>
      item.toLowerCase().includes(searchLower)
    );
    this.filteredAvailableAlacarteList = this.available_alacarte_list.filter((item: any) =>
      item.toLowerCase().includes(searchLower)
    );
  }


  save() {

    this.containerData = this.containerData.length == 0 ? 0 : this.containerData;
    console.log(this.containerData);
    // if (this.modified || !this.alacarte_list_id || !this.role || !this.username || !this.id) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'All fields are required!',
    //   });
    //   return;
    // }
    console.log('save');
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
          text: 'Please wait for Alacarte channels to update....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(null);
          }
        });
        this.userService.AddingdAlacarteTo_Addon_Package(this.modified, this.containerData, this.role, this.username, this.id).subscribe((res: any) => {
          console.log(res)
          this.swal.success(res?.message);
          this.filteredAvailableAlacarteList = [...this.available_alacarte_list];
          this.filteredAddedList = [...this.added_alacarte_list];
          this.modified = false;
        }, (err) => {
          this.swal.Error3(err?.error?.message);
        });
      }
    });
    this.selectedItems.clear();

  }
  save1() {
    this.containerData = this.containerData.length == 0 ? 0 : this.containerData;
    console.log(this.containerData);
    console.log('bouquet_list_id', this.bouquet_list_id);
    var bouquetId = this.bouquet_removelist_id || 0;
    console.log('bouquet_removelist_id', bouquetId);

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
        this.userService.AddingdbouquetTo_Addon_Package(this.modified, this.containerData, this.role, this.username, this.id, bouquetId || this.bouquet_list_id || 0,).subscribe((res: any) => {
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
