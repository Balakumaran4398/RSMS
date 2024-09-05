import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-packagewise-operator',
  templateUrl: './packagewise-operator.component.html',
  styleUrls: ['./packagewise-operator.component.scss'],
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule]
})
export class PackagewiseOperatorComponent {
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
  constructor(private userservice: BaseService, private storageservice: StorageService) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }
  // }


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

  // drop(event: CdkDragDrop<string[]>) {
  //   // const previousOperatorIds = event.previousContainer.data.map((item: any) => item.operatorid);
  //   const previousOperatorIds = event.previousContainer.data.map((item: any) => item.operatorid);
  //   const currentOperatorIds = event.container.data.map((item: any) => item.operatorid);
  //   console.log('Previous operator IDs:', previousOperatorIds);
  //   console.log('Current operator IDs:', currentOperatorIds);

  //   if (JSON.stringify(previousOperatorIds) === JSON.stringify(currentOperatorIds)) {
  //     const item = event.item.data;
  //     console.log('Item moved within the same container:', item);
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //     this.save(item);  // Pass the item to the save method
  //   } else {
  //     const item = event.item.data;
  //     console.log('Item moved to a different container:', item);
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }
  // }
  // save(item: any) {
  //   console.log('save called with item:',);
  //   console.log(this.selectedProductTypeId);
  //   const selectedProductId = this.productId;
  //   const referenceId = this.referenceId;
  //   console.log(referenceId);
  //   const selectId = item.operatorid;
  //   console.log(selectId);



  //   this.userservice.ProductListForOperator_allocate_to_notallocate(this.role, this.username, this.selectedProductTypeId, selectedProductId, selectId).subscribe(response => {
  //     console.log('Allocation updated successfully', response);
  //   }, error => {
  //     console.error('Error updating allocation', error);
  //   });
  // }

  drop(event: CdkDragDrop<string[]>) {
    // Get the specific item that was dragged
    const draggedItem = event.item.data;
    const draggedOperatorId = draggedItem.operatorid;

    console.log('Dragged Item Operator ID:', draggedOperatorId);

    if (event.previousContainer === event.container) {
        console.log('Item moved within the same container:', draggedItem);
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

    // Call the save method with the dragged item's operatorid
    this.save(draggedOperatorId);
}

save(operatorId: any) {
    console.log('save called with operatorId:', operatorId);

    const selectedProductId = this.productId;
    const referenceId = this.referenceId;

    console.log('Selected Product ID:', selectedProductId);
    console.log('Reference ID:', referenceId);
    console.log('Operator ID to be saved:', operatorId);

    this.userservice.ProductListForOperator_allocate_to_notallocate(
        this.role, 
        this.username, 
        this.selectedProductTypeId, 
        selectedProductId, 
        operatorId
    ).subscribe(response => {
        console.log('Allocation updated successfully', response);
    }, error => {
        console.error('Error updating allocation', error);
    });
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
