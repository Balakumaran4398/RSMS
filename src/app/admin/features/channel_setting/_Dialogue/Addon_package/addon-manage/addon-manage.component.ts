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
  available_alacarte_list: any = [];
  added_alacarte_list: any = [];
  available_bouquet_list: any = [];
  added_bouquet_list: any = [];
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


  constructor(public dialog: MatDialog, public router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private swal: SwalService, private userService: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }
  ngOnInit(): void {
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
  drop(event: CdkDragDrop<string[]>) {

    console.log(event);
    // this.containerData = event.container.data;
    // console.log(event.container.data);
    // console.log(this.containerData);
    // this.containerData = event.container.data.map(item => {
    //   const match = item.match(/\((.*?)\)/);
    //   return match ? match[1] : null;
    // });
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
    console.log(event.previousContainer.data);  
    
    // this.containerData = event.previousContainer.data.map(item => {
    //   const match = item.match(/\((.*?)\)/);
    //   return match ? match[1] : null;
    // }).filter(Boolean);
    this.containerData = event.container.data.map(item => {
      const match = item.match(/\((.*?)\)/);
      return match ? match[1] : null;
    }).filter(Boolean);

    console.log("Updated container data:", this.containerData);
  }
  back() {
    this.router.navigateByUrl("admin/Addon");
    // this.router.navigateByUrl("/drag_drop");
  }
  trackByFn(index: number, item: string) {
    return index; // or item, depending on the uniqueness of items
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
        this.containerData = this.added_alacarte_list.map((item: any) => {
          const match = item.match(/\((.*?)\)/);
          return match ? match[1] : null;
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
      this.containerData = this.added_alacarte_list.map((item: any) => {
        const match = item.match(/\((.*?)\)/);
        return match ? match[1] : null;
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
    console.log(event);

    const itemsToMove: any[] = [];
    if (direction === 'right') {
      this.selectedItems.forEach(item => {
        const index = this.available_bouquet_list.indexOf(item);
        if (index > -1) {
          this.available_bouquet_list.splice(index, 1);
          this.added_bouquet_list.push(item);
          itemsToMove.push(item);
        }
      });
      this.containerData = this.added_bouquet_list.map((item: any) => {
        const match = item.match(/\((.*?)\)/);
        return match ? match[1] : null;
      }).filter(Boolean);
      console.log(this.containerData);

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
      this.bouquet_list_id = Array.from(this.selectedItems).map(item => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      this.containerData = this.added_bouquet_list.map((item: any) => {
        const match = item.match(/\((.*?)\)/);
        return match ? match[1] : null;
      }).filter(Boolean);
      console.log(this.containerData);
    }

   
    console.log(this.bouquet_list_id);
    console.log(this.available_bouquet_list);
    // this.containerData = this.added_bouquet_list.map((item: any) => {
    //   const match = item.match(/\((.*?)\)/);
    //   return match ? match[1] : null;
    // }).filter(Boolean);
    // console.log(this.containerData);

    this.filteredAvailableBouquetList = [...this.available_bouquet_list];
    this.filteredAddedBouquetList = [...this.added_bouquet_list];
    this.selectedItems.clear();
    // console.log(this.containerData);
  }



  moveAll_alacarte_Items(direction: 'left' | 'right') {
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
    if (direction === 'right') {
      this.added_bouquet_list.push(...this.available_bouquet_list);
      // this.available_bouquet_list.forEach((item: any) => {
      //   if (!this.added_bouquet_list.includes(item)) {
      //     this.added_bouquet_list.push(item);
      //   }
      // });
      this.bouquet_list_id = this.available_bouquet_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      this.containerData = this.added_bouquet_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      console.log(this.containerData);
      this.available_bouquet_list = [];
    } else if (direction === 'left') {
      // this.added_bouquet_list.forEach((item: any) => {
      //   if (!this.available_bouquet_list.includes(item)) {
      //     this.available_bouquet_list.push(item);
      //   }
      // });
      // this.bouquet_list_id = this.available_bouquet_list.map((item: any) => {
      //   const match = item.match(/\((\d+)\)/);
      //   return match ? match[1] : null;
      // });
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
    if (!this.modified || !this.alacarte_list_id || !this.role || !this.username || !this.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'All fields are required!',
      });
      return;
    }
    console.log('save');
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
      }
    });
    this.selectedItems.clear();
  }
  save1() {
    this.containerData = this.containerData.length == 0 ? 0 : this.containerData;
    console.log(this.containerData);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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
        this.userService.AddingdbouquetTo_Addon_Package(this.modified, this.containerData, this.role, this.username, this.id, this.bouquet_list_id || 0,).subscribe((res: any) => {
          console.log(res);
          this.swal.success(res?.message);
        }, (err) => {
          this.swal.Error(err?.error?.message);
        });
      }
    });
  }
}
