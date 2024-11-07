import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
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

  selectedIds: string[] = [];
  todoList: any;
  doneList: any;

  filteredAvailableList: any[] = []; 
  filteredAddedList: any[] = []; 
  searchTermAvailable: string = ''; 
  searchTermAdded: string = '';
  constructor(
    public dialogRef: MatDialogRef<EditDismembershipComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private userservice: BaseService, private storageservice: StorageService
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
  // toggleSelection(item: string) {
  //   if (this.selectedItems.has(item)) {
  //     this.selectedItems.delete(item);
  //   } else {
  //     this.selectedItems.add(item);
  //   }
  // }
  toggleSelection(id: string) {
    const index = this.selectedIds.indexOf(id);
    if (index > -1) {
      this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds.push(id);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  filterAvailableList() {
    this.filteredAvailableList = this.availableList.filter(item =>
      item.name.toLowerCase().includes(this.searchTermAvailable.toLowerCase())
    );
  }

  // Filter function for added list
  filterAddedList() {
    this.filteredAddedList = this.addedList.filter(item =>
      item.name.toLowerCase().includes(this.searchTermAdded.toLowerCase())
    );
  }

  moveSelectedItems(direction: 'right' | 'left') {
    console.log(this.selectedIds);
    if (direction === 'right') {
      this.selectedIds.forEach(id => {
        const index = this.availableList.findIndex(item => item.id === id);
        if (index > -1) {
          this.availableList.splice(index, 1);
          this.addedList.push(this.availableList[index]);
          console.log(this.addedList.push(this.availableList[index]));
          console.log('    console.log(this.selectedIds);', this.selectedIds);
        }
      });
    } else if (direction === 'left') {
      this.selectedIds.forEach(id => {
        const index = this.addedList.findIndex(item => item.id === id);
        if (index > -1) {
          this.addedList.splice(index, 1);
          this.availableList.push(this.addedList[index]);
          console.log(this.availableList.push(this.addedList[index]));
          console.log('    console.log(this.selectedIds);', this.selectedIds);

        }
      });
    }

    this.selectedIds = [];
  }

  moveAllItems(direction: 'right' | 'left') {
    console.log(this.selectedIds);
    if (direction === 'right') {
      this.addedList.push(...this.availableList);
      this.availableList = [];
    } else if (direction === 'left') {
      this.availableList.push(...this.addedList);
      this.addedList = [];
    }
  }


  drop(event: CdkDragDrop<any[]>) {
    const droppedItemId = event.item.data?.id;
    if (droppedItemId) {
      this.selectedIds.push(droppedItemId);
    }
    console.log("Selected IDs:", this.selectedIds);
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
  // drop(event: CdkDragDrop<any[]>) {
  //   const droppedItemId = event.item.data?.id;
  //   console.log('log',droppedItemId);

  //   if (event.previousContainer !== event.container) {
  //     // Add item ID to selectedIds if not already present
  //     if (!this.selectedIds.includes(droppedItemId)) {
  //       this.selectedIds.push(droppedItemId);
  //     }

  //     // Transfer item between lists based on direction
  //     if (event.previousContainer === this.todoList) {  // Moving from availableList to addedList
  //       transferArrayItem(
  //         event.previousContainer.data,
  //         event.container.data,
  //         event.previousIndex,
  //         event.currentIndex
  //       );
  //     } else if (event.previousContainer === this.doneList) {  // Moving from addedList to availableList
  //       transferArrayItem(
  //         event.previousContainer.data,
  //         event.container.data,
  //         event.previousIndex,
  //         event.currentIndex
  //       );
  //     }
  //   } else {
  //     // Handle reordering within the same list
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   }

  //   console.log("Selected IDs after drop:", this.selectedIds);
  // }

  save() {
    this.swal.Loading();
    this.userservice.updateDistributor(this.role, this.username, this.distributorid, this.selectedIds).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });

  }
  moveSelected_added_Items(event: any) { }
  moveAllSelected_added_Items(event: any) { }


}
