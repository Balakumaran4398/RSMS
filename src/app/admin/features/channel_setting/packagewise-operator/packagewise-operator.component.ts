import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-packagewise-operator',
  templateUrl: './packagewise-operator.component.html',
  styleUrls: ['./packagewise-operator.component.scss'],
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule]
})
export class PackagewiseOperatorComponent {
  selectedItems: Set<any> = new Set();
  product: any = '0';
  role: any;
  username: any;
  selectedProductTypeId: any;
  producttypeList: { key: string, value: number }[] = [];
  producttypelistKeys: { name: string, id: number }[] = [];
  filteredProductTypes: { name: string, id: number }[] = [];
  filterTerm: string = '';
  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail'];
  allocated: any = [];
  todo: any = []; // This will contain items to be dragged
  done: any[] = [];
  containerData: any;
  productId: string = '';
  referenceId: string = '';
  operatorid: any;
  draggedOperatorId: any;
  containeroperatorid: any;
  searchTermAdded: any;
  searchTermAvailable: any;


  isshow: boolean = true;
  // producttypelist: any = 0;
  // productlist: any = 0;

  filteredAvailableList: any = [];
  filteredAddedList: any = [];
  constructor(private userservice: BaseService, private storageservice: StorageService, private cdr: ChangeDetectorRef,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
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
  ngAfterViewInit() {
    $('#productlist').select2({
      placeholder: 'Select a Package',
      allowClear: true
    });
    $('#productlist').on('change', (event: any) => {
      // this.smartcard = event.target.value;
      this.onProductlist(event);
    });
  }
  onProductType(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = Number(selectElement.value);
    this.selectedProductTypeId = selectedValue;
    console.log('Selected Product Type ID:', this.selectedProductTypeId);
    if (this.selectedProductTypeId !== 0) {
      this.fetchProductList(this.selectedProductTypeId);
    }
    this.checkValidation();
    console.log('11111111');


    this.filteredAvailableList = [];
    this.filteredAddedList = [];
  }
  onProductlist(event: any): void {
    console.log('fddsfdsfds', event);

    // this.fetchProductList(this.selectedProductTypeId);
    const selectedProductId = (event.target as HTMLSelectElement).value;
    // this.filteredProductTypes = []; 
    // this.productId = null;
    this.productId = selectedProductId;
    console.log(selectedProductId);

    this.filteredAvailableList = [];
    this.filteredAddedList = [];
    this.userservice.ProductListForOperator(this.role, this.username, this.selectedProductTypeId, selectedProductId).subscribe((data: any) => {
      console.log(data);
      this.allocated = data.operatorlist.notallocated || [];
      this.todo = data.operatorlist.allocated || [];
      this.filteredAvailableList = [...this.todo];
      this.filteredAddedList = [...this.allocated];
    })
    this.checkValidation();

  }
  fetchProductList(productTypeId: number): void {
    this.userservice.ProductList(this.username, this.role, productTypeId).subscribe((data: any) => {
      console.log(data);

      if (data.referenceid) {
        this.producttypelistKeys = Object.keys(data.referenceid).map(key => ({
          name: key,
          id: data.referenceid[key]
        }));
        this.filteredProductTypes = this.producttypelistKeys;
        console.log(this.filteredProductTypes);

      }
    });
  }
  filterProductTypes(): void {
    const term = this.filterTerm.toLowerCase();
    this.filteredProductTypes = this.producttypelistKeys.filter(product =>
      product.name.toLowerCase().includes(term)
    );
  }

  checkValidation() {
    if (this.selectedProductTypeId > 0 && this.productId != null && this.productId != undefined && this.productId != '') {
      this.isshow = false;
    } else {
      this.isshow = true;
    }
    this.cdr.detectChanges();

  }
  filterAvailableList(): void {
    this.cdr.detectChanges();
    const searchTerm = this.searchTermAvailable.toLowerCase();
    this.filteredAvailableList = this.todo.filter((item: any) =>
      item.operatorname.toLowerCase().includes(searchTerm)
    );
    console.log(this.filteredAvailableList);

  }
  filterAddedList(): void {
    const searchTerm = this.searchTermAdded.toLowerCase();
    this.filteredAddedList = this.allocated.filter((item: any) =>
      item.operatorname.toLowerCase().includes(searchTerm)
    );
    this.cdr.detectChanges();
    console.log(this.filteredAddedList);

  }





  drop(event: CdkDragDrop<string[]>) {
    this.draggedOperatorId = event.container.data.map((item: any) => item.operatorid);
    const draggedItem = event.item;
    console.log(this.draggedOperatorId);

    console.log(draggedItem);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('Item moved to a different container:', draggedItem);
      console.log(draggedItem.dropContainer.data);
      this.containeroperatorid = draggedItem.dropContainer.data.map((item: any) => item.operatorid);
      console.log(this.containeroperatorid);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  drop1(event: CdkDragDrop<string[]>, val: number) {
    const draggedItem = event.item;
    const draggedElement = draggedItem.element.nativeElement;
    const draggedData = draggedItem.data;
    console.log('Dragged data:', draggedData);
    console.log('Dragged element:', draggedElement);
    console.log('Item dropped:', event.item);
    console.log(event);
    console.log(val);
    console.log("ddddd")
    console.log(available_old_operator_list);
    console.log(this.filteredAvailableList);
    this.containeroperatorid = this.filteredAvailableList.map((item: any) => item.operatorid);
    console.log(this.containeroperatorid);
    var available_old_operator_list = this.filteredAvailableList;
    console.log(this.containeroperatorid);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      if (val == 1) {
        // this.filteredAvailableList = event.container.data;
        // this.filteredAddedList = event.previousContainer.data;
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
          console.log("5555")
        } else {
          console.log("6666")
          console.log('No ID found');
        }
      } else {
        console.log("7777")
        this.filteredAddedList = event.container.data;
        console.log("888")
        this.filteredAvailableList = event.previousContainer.data;
        console.log("99")

      }
      this.containeroperatorid = this.filteredAddedList.map((item: any) => {
        const match = item.match(/\((.*?)\)/);
        return match ? match[1] : null;
      }).filter(Boolean);
      console.log('container', this.containeroperatorid);
      console.log("11")
    }
    console.log("-------------------------------------------------")
    console.log(this.filteredAddedList)
  }


  drop_modified(event: CdkDragDrop<string[]>, val: number) {
    const draggedItem = event.item;
    const draggedElement = draggedItem.element.nativeElement;
    const draggedData = draggedItem.data;

    // console.log(event.container.data);
    // console.log(event.previousContainer.data);


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
  save() {

    const selectedProductId = this.productId;
    const referenceId = this.referenceId;
    console.log('Selected Product ID:', selectedProductId);
    console.log('Reference ID:', referenceId);
    console.log('containeroperatorid:', this.containeroperatorid);
    console.log('draggedOperatorId:', this.draggedOperatorId);
    console.log('selectedProductTypeId:', this.selectedProductTypeId);

    // Determine the value to pass based on the priority
    const operatorIdToPass = this.draggedOperatorId || this.containeroperatorid || 0

    console.log('Operator ID to Pass:', operatorIdToPass);
    console.log('Operator ID to Pass:', operatorIdToPass?.length);
    const finalOperatorId = (Array.isArray(operatorIdToPass) || typeof operatorIdToPass === 'string') && operatorIdToPass.length === 0 ? 0 : operatorIdToPass;
    console.log('finalOperatorId:', finalOperatorId);
    Swal.fire({
      title: 'Saving...',
      text: 'Please wait while we allocate the operator to the product.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userservice.ProductListForOperator_allocate_to_notallocate(this.role, this.username, this.selectedProductTypeId, selectedProductId,finalOperatorId).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res.message || 'The operator has been allocated to the product successfully.',
          confirmButtonText: 'OK',
          timer: 3000,
          timerProgressBar: true,
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
          timer: 3000,
          timerProgressBar: true,
        });
      }
    );
  }

}
