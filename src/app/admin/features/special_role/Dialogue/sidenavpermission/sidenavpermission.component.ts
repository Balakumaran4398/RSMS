import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-sidenavpermission',
  templateUrl: './sidenavpermission.component.html',
  styleUrls: ['./sidenavpermission.component.scss']
})
export class SidenavpermissionComponent implements OnInit {

  role: any;
  username: any;
  userid: any;
  accessip: any;
  id: any;
  addedList: any[] = [];
  notaddedList: any[] = [];
  filteredAddedList: any[] = [];
  filteredNotAddedList: any[] = [];
  searchTermAvailable: string = '';
  searchTermAdded: string = '';
  selectedItems: Set<any> = new Set();
  selectedIds: string[] = [];
  containerData: any;
  containerID: any[] = [];
  constructor(public dialogRef: MatDialogRef<SidenavpermissionComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private swal: SwalService, private cdr: ChangeDetectorRef, public userservice: BaseService, public dialog: MatDialog, private storageService: StorageService) {
    console.log(data);
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    this.userid = storageService.getUserid();
    this.accessip = storageService.getAccessip();
    this.id = data?.id;
    this.role = data?.role;

  }
  ngOnInit(): void {
    this.getSidenavList(this.id);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getSidenavList(id: any) {
    this.userservice.getallNavigationList(this.role, this.username, id).subscribe((data: any) => {
      console.log(data);
      this.addedList = data?.added?.map((operator: any) => ({ name: operator.navigationName, id: operator.id })) || [];
      this.notaddedList = data?.notadded?.map((operator: any) => ({ name: operator.navigationName, id: operator.id })) || [];
      this.filteredAddedList = [...this.addedList];
      this.filteredNotAddedList = [...this.notaddedList];
      console.log(this.filteredAddedList);
      console.log(this.filteredNotAddedList);

    })
  }
  filterAvailableList() {
    this.filteredNotAddedList = this.notaddedList.filter(item =>
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
        this.notaddedList = event.container.data;
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
        this.notaddedList = event.previousContainer.data;
      }
    }
    this.containerData = data?.map((item: { name: string, id: number }) => ({
      name: item.name,
      id: item.id
    }));
    this.containerID = this.containerData.map((item: any) => item.id);
    console.log('Container Data:', this.containerData);
    console.log('Container IDs:', this.containerID);

  }
  moveSelectedItems(direction: 'right' | 'left') {
    console.log(this.selectedIds);

    if (direction === 'right') {
      this.selectedIds.forEach(id => {
        const index = this.notaddedList.findIndex(item => item.id === id);
        if (index > -1) {
          const [movedItem] = this.notaddedList.splice(index, 1);
          this.addedList.push(movedItem);
        }
      });
      this.selectedIds = this.selectedIds.filter(id =>
        !this.addedList.some(item => item.id === id)
      );
    } else if (direction === 'left') {
      this.selectedIds.forEach(id => {
        const index = this.addedList.findIndex(item => item.id === id);
        if (index > -1) {
          const [movedItem] = this.addedList.splice(index, 1);
          this.notaddedList.push(movedItem);
        }
      });
      this.selectedIds = this.selectedIds.filter(id =>
        !this.notaddedList.some(item => item.id === id)
      );
    }

    this.containerData = this.addedList.map((item: { name: string; id: number }) => ({
      name: item.name,
      id: item.id,
    }));
    this.containerID = this.containerData.map((item: any) => item.id);
    console.log(this.containerID);

    // Update filtered lists
    this.filteredNotAddedList = [...this.notaddedList];
    this.filteredAddedList = [...this.addedList];

    // Clear selected items
    this.selectedItems.clear();
  }
  moveAllItems(direction: 'right' | 'left') {
    if (direction === 'right') {
      this.addedList.push(...this.notaddedList);
      this.notaddedList = [];
      console.log(this.addedList);
      this.containerData = this.addedList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    } else if (direction === 'left') {
      this.notaddedList.push(...this.addedList);
      this.addedList = [];
      console.log(this.addedList);
      this.containerData = this.addedList.map((item: { name: string, id: number }) => ({
        name: item.name,
        id: item.id
      }));
      this.containerID = this.containerData.map((item: any) => item.id);
      console.log(this.containerID);
    }

    this.filteredNotAddedList = [...this.notaddedList];
    this.filteredAddedList = [...this.addedList];
    this.selectedItems.clear();
  }
  save() {
    console.log(this.addedList.map((item: any) => item.id));
    let addlist = this.addedList.map((item: any) => item.id)
    const idsToPass = this.containerID?.length > 0 ? this.containerID : (addlist.length > 0 ? addlist : 0);
    this.swal.Loading();
    this.userservice.loginUpdatePermission(this.role, this.username, this.id, idsToPass).subscribe((res: any) => {
      this.swal.success(res?.message);
    }, (err) => {
      this.swal.Error(err?.error?.message);
    });

  }
}
