import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { PackageBASEDEMOComponent } from '../package-base-demo/package-base-demo.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-package-manage',
  templateUrl: './package-manage.component.html',
  styleUrls: ['./package-manage.component.scss'],
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule,FormsModule]
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

  bouquet_list_id: any = [];
  removed_channel_list: any = '';
  added_alacarte_list_id: any = [];
  added_bouquet_list_id: any = [];
  added_alacarte_list: any = [];
  available_bouquet_list: any = [];
  added_bouquet_list: any = [];
    selectedItems: Set<any> = new Set();

  availableFilter: any;
  addedFilter: any;
  searchTerm: any;

  filteredAvailableAlacarteList: any = [];
  filteredAddedList: any = [];
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
  // filteredAvailableList: string[] = [...this.available_alacarte_list];
  // filteredAddedList: string[] = [...this.added_alacarte_list];
  constructor(public dialog: MatDialog, public router: Router, private route: ActivatedRoute, private userService: BaseService, private storageservice: StorageService) {
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
  }

  ngOnInit(): void {
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
    this.userService.MANAGE_PACKAGE(this.package_id, this.role, this.username).subscribe((data: any) => {
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
        return `${available_bouquet.addon_package_name} (${available_bouquet.id}) - Rs.${available_bouquet.addon_package_rate}.0`;
      });
      this.added_bouquet_list = data[0].Added_addon.map((added_bouque: any) => {
        return `${added_bouque.addon_package_name} (${added_bouque.id}) - Rs.${added_bouque.addon_package_rate}.0`;
      });
      this.alacarte_list_id = data[0].Available_Alacarte.map((available_alacarte: any) => available_alacarte.channel_id);
      // this.added_alacarte_list_id = data[0].Added_Alacarte.map((added_alacarte: any) => added_alacarte.channel_id)
      this.bouquet_list_id = data[0].Available_addon.map((available_bouquet: any) => {
        return ` ${available_bouquet.id} `;
      });

      // console.log('AVAILABE ALACARTE_ID    1   ' + this.alacarte_list_id);
      console.log('AVAILABE ALACARTE       ' + this.available_bouquet_list);
      // console.log('ADDED ALACARTE    2  ' + this.added_alacarte_list_id);
      console.log('AVAILABE BOUQUET      ' + this.bouquet_list_id);
      // console.log('ADDED BOUQUET   4   ' + this.added_bouquet_list_id);     
    })
    this.filteredAvailableAlacarteList = this.available_alacarte_list;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  back() {
    this.router.navigateByUrl("admin/PackageCreation");
  }
  trackByFn(index: number, item: string) {
    return index;
  }


  pay_channel(type: any) {
    let dialogData = { type: type, package_id: this.package_id }
    const dialogRef = this.dialog.open(PackageBASEDEMOComponent, {
      width: '800px',
      // height: '600px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  // applyFilter(): void {
  //   if (!this.searchTerm) {
  //     this.filteredAvailableAlacarteList = this.available_alacarte_list;
  //   } else {
  //     this.filteredAvailableAlacarteList = this.available_alacarte_list.filter((item:any) =>
  //       item.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     );
  //   }
  // }
  filterAvailableList(): void {
    if (!this.searchTerm) {
      this.filteredAvailableAlacarteList = this.available_alacarte_list;
    } else {
      this.filteredAvailableAlacarteList = this.available_alacarte_list.filter((item:any) =>
        item.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  filterAddedList() {
    this.filteredAddedList = this.added_alacarte_list.filter((item: string) =>
      item.toLowerCase().includes(this.addedFilter.toLowerCase())
    );
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
  }
  moveSelected_alacarte_Items(direction: 'left' | 'right') {
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
    }
    // this.available_alacarte_channel = Array.from(this.selectedItems);
    this.alacarte_list_id = Array.from(this.selectedItems).map(item => {
      const match = item.match(/\((\d+)\)/);
      return match ? match[1] : null;
    });
    console.log(this.alacarte_list_id);
    this.selectedItems.clear();
  }
  moveSelected_bouquet_Items(direction: 'left' | 'right') {
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
    this.available_bouquet_channel = Array.from(this.selectedItems);
    this.bouquet_list_id = Array.from(this.selectedItems).map(item => {
      const match = item.match(/\((\d+)\)/);
      return match ? match[1] : null;
    });
    console.log(this.bouquet_list_id);
    console.log(this.available_bouquet_channel);
    this.selectedItems.clear();

  }


  moveAll_alacarte_Items(direction: 'left' | 'right') {
    if (direction === 'right') {
      this.added_alacarte_list.push(...this.available_alacarte_list);
      this.alacarte_list_id = this.available_alacarte_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      console.log(this.alacarte_list_id);
      this.available_alacarte_list = [];
    } else if (direction === 'left') {
      this.available_alacarte_list.push(...this.added_alacarte_list);
      this.alacarte_list_id = this.added_alacarte_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      console.log(this.alacarte_list_id);
      this.added_alacarte_list = [];
    }
    this.selectedItems.clear();
  }

  moveAll_bouquet_Items(direction: 'left' | 'right') {
    if (direction === 'right') {
      this.added_bouquet_list.push(...this.available_bouquet_list);
      this.bouquet_list_id = this.available_bouquet_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      console.log(this.bouquet_list_id);
      this.available_bouquet_list = [];
    } else if (direction === 'left') {
      this.available_bouquet_list.push(...this.added_bouquet_list);
      this.bouquet_list_id = this.added_bouquet_list.map((item: any) => {
        const match = item.match(/\((\d+)\)/);
        return match ? match[1] : null;
      });
      console.log(this.bouquet_list_id);
      this.added_bouquet_list = [];
    }
    this.selectedItems.clear();
  }
  save() {
    console.log('alert');
    if (!this.modified || !this.alacarte_list_id || !this.role || !this.username || !this.package_id) {
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
            Swal.showLoading();
          }
        });
        this.userService.AddingdAlacarteTo_Base_Package(this.modified, this.alacarte_list_id, this.role, this.username, this.package_id).subscribe((res: any) => {
          console.log(res);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your update was successful",
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            // window.location.reload();
          });
        },
          (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: err?.error?.message,
              showConfirmButton: false,
              timer: 1500
            });
          }
        );
      }
    });
    this.selectedItems.clear();
  }
  save1() {
    console.log('save1');
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
          text: 'Please wait for Addon channel list to update....',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.userService.AddingdbouquetTo_Base_Package(this.modified, this.bouquet_list_id, this.role, this.username, this.package_id, this.removed_channel_list,).subscribe((res: any) => {
          console.log(res);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your update was successful",
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            // window.location.reload();
          });
        },
          (err) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: err?.error?.message,
              showConfirmButton: false,
              timer: 1500
            });
          }
        );
      }
    });
  }
}
