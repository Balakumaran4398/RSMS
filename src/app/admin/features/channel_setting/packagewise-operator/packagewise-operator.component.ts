import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-packagewise-operator',
  templateUrl: './packagewise-operator.component.html',
  styleUrls: ['./packagewise-operator.component.scss'],
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule]
})
export class PackagewiseOperatorComponent {
  selectedItems: Set<any> = new Set();

  role: any;
  username: any;
  selectedProductTypeId: any;
  producttypeList: { key: string, value: number }[] = [];
  producttypelistKeys: { name: string, id: number }[] = [];
  filteredProductTypes: { name: string, id: number }[] = [];
  filterTerm: string = '';
  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail'];
  allocated: any[] = [];
  todo: any[] = []; // This will contain items to be dragged
  done: any[] = [];
  productId: string = '';
  referenceId: string = '';
  operatorid: any;
  draggedOperatorId: any
  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  onProductType(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = Number(selectElement.value);
    this.selectedProductTypeId = selectedValue;
    console.log('Selected Product Type ID:', this.selectedProductTypeId);
    if (this.selectedProductTypeId !== 0) {
      this.fetchProductList(this.selectedProductTypeId);
    }
  }
  fetchProductList(productTypeId: number): void {
    this.userservice.ProductList(this.username, this.role, productTypeId).subscribe((data: any) => {
      if (data.referenceid) {
        this.producttypelistKeys = Object.keys(data.referenceid).map(key => ({
          name: key,
          id: data.referenceid[key]
        }));
        this.filteredProductTypes = this.producttypelistKeys;
        console.log(this.producttypelistKeys);
      }
    });
  }
  filterProductTypes(): void {
    const term = this.filterTerm.toLowerCase();
    this.filteredProductTypes = this.producttypelistKeys.filter(product =>
      product.name.toLowerCase().includes(term)
    );
  }
  onProductlist(event: Event): void {
    const selectedProductId = (event.target as HTMLSelectElement).value;
    this.productId = selectedProductId;
    console.log('Selected Product ID:', selectedProductId);
    console.log(this.productId);
    this.userservice.ProductListForOperator(this.role, this.username, '1', selectedProductId).subscribe((data: any) => {
      console.log(data);
      this.todo = data.operatorlist.notallocated || [];
      this.allocated = data.operatorlist.allocated || [];
      console.log('Not Allocated:', this.todo);
      console.log('Allocated:', this.allocated);
    })
  }


  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    console.log(event.container.data);
    console.log(event.container.data.map((item: any) => item.operatorid));
    this.draggedOperatorId = event.container.data.map((item: any) => item.operatorid);
    const draggedItem = event.item;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('Item moved to a different container:', draggedItem);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

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
  moveSelected_bouquet_Items(direction: 'left' | 'right') {
    const itemsToMove: any[] = [];

    if (direction === 'right') {
      // Move selected items from 'todo' (available) to 'allocated' (added)
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
        }
      });
    }
    this.todo = Array.from(this.selectedItems).map(item => {
      const match = item.match(/\((\d+)\)/);
      return match ? match[1] : null;
    });

    console.log(this.allocated);
    // Clear selected items after movement
    this.selectedItems.clear();
  }

  moveAllSelected_bouquet_Items(direction: 'left' | 'right') {
    throw new Error('Method not implemented.');
  }
  save() {
    const selectedProductId = this.productId;
    const referenceId = this.referenceId;
    console.log('Selected Product ID:', selectedProductId);
    console.log('Reference ID:', referenceId);
    Swal.fire({
      title: 'Saving...',
      text: 'Please wait while we allocate the operator to the product.',
      allowOutsideClick: false,
      // didOpen: () => {
      //   Swal.showLoading();
      // }
    });
    this.userservice.ProductListForOperator_allocate_to_notallocate(this.role, this.username, this.selectedProductTypeId, selectedProductId, this.draggedOperatorId || this.selectedItems
    ).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res.message || 'The operator has been allocated to the product successfully.',
          confirmButtonText: 'OK',
          timer: 3000
        }).then(() => {
          window.location.reload();
        });
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error?.error.message || 'Failed to allocate the operator. Please try again.',
          confirmButtonText: 'OK',
          timer: 3000
        });
      }
    );
  }
  ngOnInit() {
    this.userservice.ProductTypeList(this.username, this.role).subscribe((data: any) => {
      console.log(data);
      this.producttypeList = Object.keys(data.producttype).map(key => ({
        key: key,
        value: data.producttype[key]
      }));
      console.log(this.producttypeList);
    });
  }
}
