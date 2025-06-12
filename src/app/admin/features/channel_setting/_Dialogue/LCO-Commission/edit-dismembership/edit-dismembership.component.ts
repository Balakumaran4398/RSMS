import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-edit-dismembership',
  templateUrl: './edit-dismembership.component.html',
  styleUrls: ['./edit-dismembership.component.scss']
})
export class EditDismembershipComponent implements OnInit {
  role: any;
  username: any;
  lcogroupname: any;
  errorMessage: any;
  type: any;
  distributorid: any = 0;
  distributorList: any[] = [];
  distributor: any;

  availableList: any[] = [];
  addedList: any[] = [];
  selectedItems: Set<any> = new Set();
  availableid: any;
  addedid: any;
  containerData: any;
  containerID: any[] = [];
  selectedIds: string[] = [];
  todoList: any;
  doneList: any;
  droppedItemId: any;
  filteredAvailableList: any[] = [];
  filteredAddedList: any[] = [];
  searchTermAvailable: string = '';
  searchTermAdded: string = '';
  constructor(
    public dialogRef: MatDialogRef<EditDismembershipComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService
  ) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.type = data.type;
    this.distributorid = data.operatorid;
    this.distributor = data.operatorname;
  }
  ngOnInit(): void {
    this.userservice.getAvailableAndNotAvailableDistributorList(this.role, this.username, this.distributorid).subscribe((data: any) => {
      this.userservice.getAvailableAndNotAvailableDistributorList(this.role, this.username, this.distributorid).subscribe((data: any) => {
        this.availableList = data?.available?.map((operator: any) => ({ name: operator.operatorname, id: operator.operatorid })) || [];
        this.addedList = data?.added?.map((operator: any) => ({ name: operator.operatorname, id: operator.operatorid })) || [];
        this.filteredAvailableList = [...this.availableList];
        this.filteredAddedList = [...this.addedList];

      });
    });
  }
  isSelected(item: string): boolean {
    return this.selectedItems.has(item);
  }

  toggleSelection(item: any) {
    console.log('item', item);
    this.selectedItems.add(item);
    if (!this.selectedIds.includes(item.id)) {
      this.selectedIds.push(item.id);
    }
    console.log(this.selectedIds);
  }

  // toggleSelection(item: any) {
  //   console.log('item', item);
  //   // Clear the previous selection and select only the new one
  //   this.selectedItems.clear();
  //   this.selectedItems.add(item);
  //   // Reset selectedIds and add only the current item's ID
  //   this.selectedIds = [item.id];
  //   console.log(this.selectedIds);
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }

  filterAvailableList() {
    this.filteredAvailableList = this.availableList.filter(item =>
      item.name.toLowerCase().includes(this.searchTermAvailable.toLowerCase())
    );
    this.cdr.detectChanges();
  }

  // Filter function for added list
  filterAddedList() {
    this.filteredAddedList = this.addedList.filter(item =>
      item.name.toLowerCase().includes(this.searchTermAdded.toLowerCase())
    );
    this.cdr.detectChanges();
  }

  
  moveSelectedItems(direction: 'right' | 'left') {
    console.log(this.selectedIds);

    if (direction === 'right') {
      this.selectedIds.forEach(id => {
        const index = this.availableList.findIndex(item => item.id === id);
        if (index > -1) {
          // Remove the item from availableList
          const [movedItem] = this.availableList.splice(index, 1);
          // Add the item to addedList
          this.addedList.push(movedItem);
        }
      });

      // Remove moved items from selectedIds
      this.selectedIds = this.selectedIds.filter(id =>
        !this.addedList.some(item => item.id === id)
      );

    } else if (direction === 'left') {
      this.selectedIds.forEach(id => {
        const index = this.addedList.findIndex(item => item.id === id);
        if (index > -1) {
          // Remove the item from addedList
          const [movedItem] = this.addedList.splice(index, 1);
          // Add the item back to availableList
          this.availableList.push(movedItem);
        }
      });

      // Remove moved items from selectedIds
      this.selectedIds = this.selectedIds.filter(id =>
        !this.availableList.some(item => item.id === id)
      );
    }

    // Update containerData and containerID
    this.containerData = this.addedList.map((item: { name: string; id: number }) => ({
      name: item.name,
      id: item.id,
    }));
    this.containerID = this.containerData.map((item: any) => item.id);
    console.log(this.containerID);

    // Update filtered lists
    this.filteredAvailableList = [...this.availableList];
    this.filteredAddedList = [...this.addedList];

    // Clear selected items
    this.selectedItems.clear();
  }










  moveAllItems(direction: 'right' | 'left') {
    if (direction === 'right') {
      this.addedList.push(...this.availableList);
      this.availableList = [];
      console.log(this.addedList);
      this.containerData = this.addedList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    } else if (direction === 'left') {
      this.availableList.push(...this.addedList);
      this.addedList = [];
      console.log(this.addedList);
      this.containerData = this.addedList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    }

    this.filteredAvailableList = [...this.availableList];
    this.filteredAddedList = [...this.addedList];
    this.selectedItems.clear();
  }


  drop(event: CdkDragDrop<any[]>, val: number) {
    const droppedItemId = event.item.data?.id;
    if (droppedItemId) {
      this.selectedIds.push(droppedItemId);
    }
    console.log(this.selectedIds);
    var data;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      if (val == 1) {
        this.availableList = event.container.data;
        this.addedList = event.previousContainer.data;
        data = event.previousContainer.data;
      } else if (val == 2) {
        data = event.container.data;

      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      if (val == 1) {
        data = event.previousContainer.data;
      } else if (val == 2) {
        data = event.container.data;
        this.addedList = event.container.data;
        this.availableList = event.previousContainer.data;
      }
    }
    this.containerData = data?.map((item: { name: string, id: number }) => ({
      name: item.name,
      id: item.id
    }));
    this.containerID = this.containerData.map((item: any) => item.id);
    console.log('Container Data:', this.containerData);
    console.log('Container IDs:', this.containerID);
    // this.filteredAvailableList = [...this.availableList];
    // this.filteredAddedList = [...this.addedList];
  }


  save() {
    console.log(this.addedList.map((item: any) => item.id));
    let addlist = this.addedList.map((item: any) => item.id)
    // const idsToPass = this.containerID?.length > 0 ? this.containerID : this.selectedIds;
    const idsToPass = this.containerID?.length > 0 ? this.containerID : (addlist.length > 0 ? addlist : 0);
    this.swal.Loading();
    this.userservice.updateDistributor(this.role, this.username, this.distributorid, idsToPass).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });

  }
  moveSelected_added_Items(event: any) { }
  moveAllSelected_added_Items(event: any) { }


}
