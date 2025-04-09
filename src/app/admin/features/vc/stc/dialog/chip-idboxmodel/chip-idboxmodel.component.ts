import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-chip-idboxmodel',
  templateUrl: './chip-idboxmodel.component.html',
  styleUrls: ['./chip-idboxmodel.component.scss'],
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule]
})
export class ChipIDboxmodelComponent implements OnInit {
  role: any;
  username: any;
  opName: any = 0;
  isshow: boolean = true;
  selectedItems: Set<any> = new Set();
  todo: any = [];
  done: any[] = [];
  filteredAvailableList: any = [];
  filteredAddedList: any = [];

  allocated: any;
  containeroperatorid: any;
  containerData: any;

  searchTermAdded: any;
  searchTermAvailable: any;
  constructor(private userService: BaseService, private storageService: StorageService, private swal: SwalService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }
  ngOnInit(): void {
  }

  moveSelectedRight_BouquetItems(direction: 'left' | 'right') {
    const itemsToMove: any[] = [];
    if (direction === 'right') {
      this.selectedItems.forEach(item => {
        const index = this.todo.indexOf(item);
        if (index > -1) {
          this.todo.splice(index, 1);
          this.allocated.push(item);
          itemsToMove.push(item);
        }
      });
      this.containerData = this.allocated.map((item: any) => ({
        operatorname: item.operatorname,
        operatorid: item.operatorid
      }));
      console.log(this.containerData);

      this.containeroperatorid = this.containerData.map((item: any) => item.operatorid);
      console.log(this.containeroperatorid);

    } else if (direction === 'left') {
      this.selectedItems.forEach(item => {
        const index = this.allocated.indexOf(item);
        if (index > -1) {
          this.allocated.splice(index, 1);
          this.todo.push(item);
          itemsToMove.push(item);
        }
        this.containerData = this.todo.map((item: any) => ({
          operatorname: item.operatorname,
          operatorid: item.operatorid
        }));
        console.log(this.containerData);

        this.containeroperatorid = this.containerData.map((item: any) => item.operatorid);
        console.log(this.containeroperatorid);

      });
    }
    this.filteredAvailableList = [...this.todo];
    this.filteredAddedList = [...this.allocated];
    this.selectedItems.clear();
  }
  moveSelectedLeft_BouquetItems(direction: 'left' | 'right') {
    const itemsToMove: any[] = [];
    if (direction === 'right') {
      this.selectedItems.forEach(item => {
        const index = this.todo.indexOf(item);
        if (index > -1) {
          this.todo.splice(index, 1);
          this.allocated.push(item);
          itemsToMove.push(item);
        }
      });
    } else if (direction === 'left') {
      this.selectedItems.forEach(item => {
        const index = this.allocated.indexOf(item);
        if (index > -1) {
          this.allocated.splice(index, 1);
          this.todo.push(item);
          itemsToMove.push(item);
          console.log(this.allocated);
          console.log(this.todo);
          console.log(itemsToMove);

        }
        this.containerData = this.allocated.map((item: any) => ({
          operatorname: item.operatorname,
          operatorid: item.operatorid
        }));
        console.log(this.containerData);

        this.containeroperatorid = this.containerData.map((item: any) => item.operatorid);
        console.log(this.containeroperatorid);
      });
    }
    this.containerData = this.todo.map((item: any) => ({
      operatorname: item.operatorname,
      operatorid: item.operatorid
    }));
    // this.containeroperatorid = this.containerData.map((item: any) => item.operatorid);
    console.log(this.containeroperatorid);
    this.filteredAvailableList = [...this.todo];
    this.filteredAddedList = [...this.allocated];
    this.selectedItems.clear();
  }

  moveAllSelected(direction: 'left' | 'right') {
    if (direction === 'right') {
      this.allocated.push(...this.todo);
      this.todo = [];
      this.containerData = this.allocated.map((item: any) => ({
        operatorname: item.operatorname,
        operatorid: item.operatorid
      }));
      this.containeroperatorid = this.containerData.map((item: any) => item.operatorid);
    } else if (direction === 'left') {
      this.todo.push(...this.allocated);
      this.allocated = [];
      this.containerData = this.allocated.map((item: any) => ({
        operatorname: item.operatorname,
        operatorid: item.operatorid
      }));
      this.containeroperatorid = this.containerData.map((item: any) => item.operatorid);
      console.log(this.containeroperatorid);

    }

    this.filteredAvailableList = [...this.todo];
    this.filteredAddedList = [...this.allocated];
    console.log('Todo List:', this.todo);
    console.log('Allocated List:', this.allocated);
  }


  drop_modified(event: CdkDragDrop<string[]>, val: number) {
    const draggedItem = event.item;
    const draggedElement = draggedItem.element.nativeElement;
    const draggedData = draggedItem.data;
    var data;
    console.log(this.containeroperatorid);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      if (val == 1) {
        data = event.previousContainer.data;
        this.todo = event.previousContainer.data;

      } else if (val == 2) {
        data = event.container.data;
        this.allocated = event.container.data;
      }
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      if (val == 1) {
        data = event.previousContainer.data;
        this.todo = event.previousContainer.data;
      } else if (val == 2) {
        data = event.container.data;
        this.allocated = event.container.data;
      }
    }
    this.containeroperatorid = data?.map((item: any) => item.operatorid);
    console.log(this.containeroperatorid);
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
  filterAddedList(): void {
    const searchTerm = this.searchTermAdded.toLowerCase();
    this.filteredAddedList = this.allocated.filter((item: any) =>
      item.operatorname.toLowerCase().includes(searchTerm)
    );
    this.cdr.detectChanges();
    console.log(this.filteredAddedList);

  }

  filterAvailableList(): void {
    this.cdr.detectChanges();
    const searchTerm = this.searchTermAvailable.toLowerCase();
    this.filteredAvailableList = this.todo.filter((item: any) =>
      item.operatorname.toLowerCase().includes(searchTerm)
    );
    console.log(this.filteredAvailableList);

  }
  save() { }
}
