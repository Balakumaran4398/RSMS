import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-addednotadded',
  templateUrl: './addednotadded.component.html',
  styleUrls: ['./addednotadded.component.scss']
})
export class AddednotaddedComponent implements OnInit {
  role: any;
  username: any;
  type: any;
  operatorid: any;

  selectedIds: string[] = [];
  todoList: any;
  doneList: any;
  containerData: any;
  containerID: any;
  NotaddedList: any[] = [];
  addedList: any[] = [];

  NotpermissionList: any[] = [];
  permissionList: any[] = [];

  selectedItems: Set<any> = new Set();
  retailerid: any;

  searchTerm: string = '';  // Search input binding
  // filteredNotaddedList = [...this.NotaddedList];
  // filteredAddedList = [...this.addedList];
  // filteredNotPermissionList = [...this.NotpermissionList];
  // filteredPermissionList = [...this.permissionList];
  filteredNotaddedList: any[] = [];
  filteredAddedList: any[] = [];
  filteredNotPermissionList: any[] = [];
  filteredPermissionList: any[] = [];

  searchTermNotAdded: string = '';
  searchTermAdded: string = '';
  searchTermNotPermission: string = '';
  searchTermPermission: string = '';

  constructor(public dialogRef: MatDialogRef<AddednotaddedComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef, private fb: FormBuilder, private userservice: BaseService, private storageservice: StorageService, private swal: SwalService, public dialog: MatDialog,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
    console.log(data);
    this.type = data.type;
    console.log(this.type);
    this.operatorid = data?.data?.operatorId;
    this.retailerid = data?.data?.retailerId;
    console.log(this.retailerid);
    console.log(this.operatorid);

  }
  ngOnInit(): void {
    this.userservice.getAllAreaList(this.role, this.username, this.retailerid, this.operatorid).subscribe((data: any) => {
      console.log(data);
      this.cdr.detectChanges();
      this.NotaddedList = data?.notadded.map((area: any) => ({ name: area.name, id: area.id }));
      this.addedList = data?.added?.map((operator: any) => ({ name: operator.name, id: operator.id }));
      this.filteredNotaddedList = [...this.NotaddedList];
      this.filteredAddedList = [...this.addedList];
    })

    this.userservice.getallPermissionList(this.role, this.username, this.retailerid).subscribe((data: any) => {
      console.log(data);
      this.cdr.detectChanges();
      this.NotpermissionList = data?.notadded.map((area: any) => ({ name: area.operationName, id: area.id }));
      this.permissionList = data?.added?.map((operator: any) => ({ name: operator.operationName, id: operator.id }));
      console.log(this.NotpermissionList);
      console.log(this.permissionList);
      // this.allocated = data.operatorlist.notallocated || [];
      // this.todo = data.operatorlist.allocated || [];
      // this.filteredAvailableList = [...this.todo];
      // this.filteredAddedList = [...this.allocated];
      this.filteredNotPermissionList = [...this.NotpermissionList];
      this.filteredPermissionList = [...this.permissionList];
      console.log('filteredNotPermissionList', this.filteredNotPermissionList);
      console.log('filteredPermissionList', this.filteredPermissionList);
    })
  }

  filterNotAddedList() {
    this.cdr.detectChanges();
    this.filteredNotaddedList = this.NotaddedList.filter(item => item.name.toLowerCase().includes(this.searchTermNotAdded.toLowerCase()));
  }

  filterAddedList() {
    this.cdr.detectChanges();
    this.filteredAddedList = this.addedList.filter(item => item.name.toLowerCase().includes(this.searchTermAdded.toLowerCase()));
  }
  allocated: any = [];
  todo: any = [];
  searchTermAvailable: any;
  filterNotPermissionList() {
    this.cdr.detectChanges();
    this.filteredNotPermissionList = this.NotpermissionList.filter(item => item.name.toLowerCase().includes(this.searchTermPermission.toLowerCase()));
    console.log('[filteredNotPermissionList]', this.filteredNotPermissionList);
  }

  filterPermissionList() {
    this.cdr.detectChanges();
    this.filteredPermissionList = this.permissionList.filter(item => item.name.toLowerCase().includes(this.searchTermAdded.toLowerCase()));
    console.log('[filteredPermissionList]', this.filteredPermissionList);
  }




  isSelected(item: string): boolean {
    return this.selectedItems.has(item);
  }
  toggleSelection(item: string) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  moveSelectedItems(direction: 'right' | 'left') {
    console.log(this.selectedIds);
    if (direction === 'right') {
      this.selectedItems.forEach(id => {
        const index = this.NotaddedList.findIndex(item => item.id === id);
        if (index > -1) {
          this.NotaddedList.splice(index, 1);
          this.addedList.push(this.NotaddedList[index]);
          console.log('    console.log(this.selectedItems);', this.selectedItems);
        }
      });
      console.log(this.addedList);
      this.containerData = this.addedList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    } else if (direction === 'left') {
      this.selectedItems.forEach(id => {
        const index = this.addedList.findIndex(item => item.id === id);
        if (index > -1) {
          this.addedList.splice(index, 1);
          this.NotaddedList.push(this.addedList[index]);
          console.log('    console.log(this.selectedItems);', this.selectedItems);
        }
      });
      console.log(this.NotaddedList);
      this.containerData = this.addedList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    }
    this.filteredNotaddedList = [...this.NotaddedList];
    this.filteredAddedList = [...this.addedList];
    this.selectedItems.clear();
  }


  moveAllItems(direction: 'right' | 'left') {
    if (direction === 'right') {
      this.addedList.push(...this.NotaddedList);
      this.NotaddedList = [];
      this.containerData = this.addedList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);

    } else if (direction === 'left') {
      this.NotaddedList.push(...this.addedList);
      this.addedList = [];
      this.containerData = this.NotaddedList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    }
    this.filteredNotaddedList = [...this.NotaddedList];
    this.filteredAddedList = [...this.addedList];
    this.selectedItems.clear();
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
    this.containerData = event.container.data.map((item: { name: string, id: number }) => ({
      name: item.name,
      id: item.id
    }));
    console.log(this.containerData);

    this.containerID = this.containerData.map((item: any) => item.id);
    console.log(this.containerID);
  }

  drop2(event: CdkDragDrop<string[]>, val: number) {
    var available_old_bouquet_list = this.NotaddedList;
    console.log(available_old_bouquet_list);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      if (val == 1) {
        this.NotaddedList = event.container.data;
        this.addedList = event.previousContainer.data;
      } else {
        this.addedList = event.container.data;
        this.NotaddedList = event.previousContainer.data;
      }
      console.log('container data', this.containerData);
      this.containerData = this.addedList
      // .map((item: any) => {
      //   const match = item.match(/\((.*?)\)/);
      //   return match ? match[1] : null;
      // }).filter(Boolean);
      console.log('container data', this.containerData);
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    }
    console.log("-------------------------------------------------")
    console.log(this.NotaddedList)
    console.log(this.addedList)
  }


  drop1(event: CdkDragDrop<string[]>, val: number) {
    // var available_old_bouquet_list = this.NotpermissionList;
    var available_old_bouquet_list = event.previousContainer.data[event.previousIndex];
    console.log(available_old_bouquet_list);
    var data;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      console.log(event.previousContainer.data);
      console.log(event.container.data);
      if (val == 1) {
        this.NotpermissionList = event.container.data;
        this.permissionList = event.previousContainer.data;
        this.containerData = this.permissionList;
        console.log('container data ------------------------1111111111111', this.containerData);
        console.log('NotpermissionList ------------------------1111111111111', this.NotpermissionList);
      } else {
        this.permissionList = event.container.data;
        this.NotpermissionList = event.previousContainer.data;
        this.containerData = this.permissionList;
        console.log('container data-------------------------------2222222222222', this.containerData);
      }
      this.containerData = this.permissionList;
      console.log('container data', this.containerData);
      this.containerID = this.containerData.map((item: any) => item.id);
    }
  }

  // drop1(event: CdkDragDrop<string[]>, val: number) {
  //   const previousContainerDataBeforeMove = [...event.previousContainer.data];

  //   var available_old_bouquet_item = event.previousContainer.data[event.previousIndex];
  //   console.log("Item being moved:", available_old_bouquet_item);

  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  //     console.log("Previous Container After Move:", event.previousContainer.data);
  //     console.log("Current Container After Move:", event.container.data);
  //     if (val == 1) {

  //       this.NotpermissionList = event.container.data;
  //       this.permissionList = event.previousContainer.data;
  //       this.containerData = this.permissionList;
  //       console.log('container data (val--------------1)', this.containerData);
  //     } else {
  //       this.permissionList = event.container.data;
  //       this.NotpermissionList = event.previousContainer.data;
  //       this.containerData = this.permissionList;
  //       console.log('container data (val-------------2)', this.containerData);
  //     }
  //     this.containerID = this.containerData.map((item: any) => item.id);
  //     console.log("containerID:", this.containerID);
  //   }
  // }


  moveSelectedItems1(direction: 'right' | 'left') {
    console.log(this.selectedItems);
    if (direction === 'right') {
      console.log(this.selectedItems);
      this.selectedItems.forEach(id => {
        const index = this.NotpermissionList.findIndex(item => item.id === id);
        if (index > -1) {
          this.NotpermissionList.splice(index, 1);
          this.permissionList.push(this.NotpermissionList[index]);
        }
      });
      this.containerData = this.permissionList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    } else if (direction === 'left') {
      console.log('permission     1111111', this.selectedItems);
      console.log(this.selectedItems);
      this.selectedItems.forEach(id => {
        const index = this.permissionList.findIndex(item => item.id === id);
        if (index > -1) {
          this.permissionList.splice(index, 1);
          this.NotpermissionList.push(this.permissionList[index]);
        }
      });
      this.containerData = this.permissionList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    }
    this.filteredNotPermissionList = [...this.NotpermissionList];
    this.filteredPermissionList = [...this.permissionList];
    this.selectedItems.clear();
  }

  moveAllItems1(direction: 'right' | 'left') {
    console.log(this.selectedIds);
    if (direction === 'right') {
      this.permissionList.push(...this.NotpermissionList);
      this.NotpermissionList = [];
      this.containerData = this.permissionList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    } else if (direction === 'left') {
      this.NotpermissionList.push(...this.permissionList);
      this.permissionList = [];
      this.containerData = this.permissionList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    }
    this.filteredNotPermissionList = [...this.NotpermissionList];
    this.filteredPermissionList = [...this.permissionList];
    this.selectedItems.clear();
  }
  save() {
    this.swal.Loading();
    console.log(this.containerID);
    let permissionList = this.containerID.length == 0 ? 0 : this.containerID;
    console.log(permissionList);
    this.userservice.sublcoUpdateArea(this.role, this.username, this.retailerid, permissionList).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
  save1() {
    this.swal.Loading();
    console.log(this.containerID);
    let permissionList = this.containerID.length == 0 ? 0 : this.containerID;
    console.log(permissionList);
    this.userservice.sublcoUpdatePermission(this.role, this.username, this.retailerid, permissionList).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });
  }
}
