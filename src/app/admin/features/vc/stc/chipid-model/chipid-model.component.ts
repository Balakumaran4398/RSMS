import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';
import { DialogChipidComponent } from '../dialog/dialog-chipid/dialog-chipid.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-chipid-model',
  templateUrl: './chipid-model.component.html',
  styleUrls: ['./chipid-model.component.scss'],

})
export class ChipidModelComponent implements OnInit {

  role: any;
  username: any;
  searchName: any;
  rowData: any[] = [];
  rowData1: any[] = [];
  subscriberList: any[] = [];
  showDropdown: boolean = true;
  subLcoDetails: any;
  subLcoName: any;
  subLcoMobilenumber: any;
  subLcoBoxid: any;
  subLcoChipID: any = '';
  subLcoSmartcard: any = '';
  subLcoModel: any = '';


  opName: any = 0;
  selectedOperator: any;
  selectedLcoName: any;
  filteredOperators: any[] = [];
  opNameList: any[] = [];

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

  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      comparator: (valueA: any, valueB: any) => {
        const isNumberA = !isNaN(valueA) && valueA !== null;
        const isNumberB = !isNaN(valueB) && valueB !== null;
        if (isNumberA && isNumberB) {
          return valueA - valueB;
        } else {
          const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : "";
          const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : "";
          return normalizedA.localeCompare(normalizedB);
        }
      },
      filterParams: {
        textFormatter: (value: string) => {
          return value ? value.toString().toLowerCase() : "";
        },
        filterOptions: ["contains", "startsWith", "equals"],
        // debounceMs: 200,
      },
    },
    paginationPageSize: 15,
    paginationPageSizeSelector: [10, 20, 50],
    pagination: true,
  };
  constructor(private userService: BaseService, private storageService: StorageService, private swal: SwalService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.role = storageService.getUserRole();
    this.username = storageService.getUsername();
  }
  ngOnInit(): void {
    this.getModelList();
    this.ltbList();
    this.getModelForceList(this.opName);
  }
  ngOnDestroy(): void {
    ($('#ltb') as any).select2('destroy');
    ($('#lco') as any).select2('destroy');
  }
  ngAfterViewInit() {

    ($('#ltb') as any).select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#ltb').on('change', (event: any) => {
      this.opName = event.target.value;
      this.onSubscriberStatusChange(this.opName);
    });
    ($('#lco') as any).select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#lco').on('change', (event: any) => {
      this.opName = event.target.value;
      this.getLCOModelList(this.opName);
    });
  }
  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  ltbList() {
    this.userService.getLocalChannelOperatorList(this.role, this.username).subscribe((data: any) => {
      this.opNameList = Object.keys(data).map(key => ({
        packagename: key,
        packageid: data[key]
      }));
      this.filteredOperators = this.opNameList;
      console.log(this.opNameList);
      this.opName = this.opNameList.map((item: any) => item);
    })
  }
  onSubscriberStatusChange(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    this.getModelForceList(this.selectedOperator);
  }
  onLCOModelList(selectedOperator: any) {
    console.log(selectedOperator);
    this.selectedOperator = selectedOperator;
    this.selectedLcoName = selectedOperator.value;
    this.getLCOModelList(this.selectedOperator);
  }
  getsmartcardList(value: any) {
    console.log(value);
    this.showDropdown = true;
    this.userService.getmodelSearch(this.role, this.username, value).subscribe(
      (data: any) => {
        if (!data || Object.keys(data).length === 0) {
          this.subscriberList = [];
          return;
        }
        this.subscriberList = Object.keys(data).map(key => {
          const value = data[key];
          const name = key;
          return { name: name, value: value };
        });
        this.subscriberList.sort((a: any, b: any) => {
          if (a.value > b.value) return 1;
          if (a.value < b.value) return -1;
          return 0;
        });
        console.log(this.searchName);
        if (this.subscriberList.length === 0) {
          console.log('No matching data after sorting');
          Swal.fire({
            title: 'No Matching Results',
            text: 'No subscribers match your search criteria.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
        }
        console.log(this.subscriberList);
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: error?.error?.getsmartcardlistbysubid.searchname
            || 'An error occurred while fetching subscriber details.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  getModelSearchDetails(searchName: any) {
    if (!searchName) {
      Swal.fire({
        title: 'Select a Smartcard',
        text: 'Please select a Smartcard before proceeding.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.userService.getModelSearchDetails(this.role, this.username, searchName).subscribe(
      (data: any) => {
        console.log('Model search details:', data);
        this.subLcoDetails = data;
        this.subLcoName = this.subLcoDetails.operatorname;
        this.subLcoMobilenumber = this.subLcoDetails.mobileno;
        this.subLcoBoxid = this.subLcoDetails.boxid;
        this.subLcoChipID = this.subLcoDetails.chipid;
        this.subLcoSmartcard = this.subLcoDetails.smartcard;
        this.subLcoModel = this.subLcoDetails.model;
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: error?.error?.message || 'Failed to fetch model search details.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  goToSubscriberDashboard(lcomember: any) {
    console.log(lcomember);
    this.searchName = lcomember.value;
    console.log(this.searchName);
    this.getModelSearchDetails(this.searchName);
    this.showDropdown = false;
  }
  getModelList() {
    this.userService.getStbModlelList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
      // const rowCount = this.rowData.length;
      // if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
      //   this.gridOptions.paginationPageSizeSelector.push(rowCount);
      // }
    })
  }
  getModelForceList(value: any) {
    this.userService.getOperatorWiseChipidForceList(this.role, this.username, value).subscribe((data: any) => {
      console.log(data);
      this.rowData1 = data;
      const rowCount = this.rowData1.length;
      if (!this.gridOptions.paginationPageSizeSelector.includes(rowCount)) {
        this.gridOptions.paginationPageSizeSelector.push(rowCount);
      }
    })
  }
  getLCOModelList(value: any) {
    this.userService.getOperatorWiseModelList(this.role, this.username, value).subscribe((data: any) => {
      console.log(data);
      this.allocated = data.allocatedmodel || [];
      this.todo = data.available || [];
      this.filteredAvailableList = [...this.todo];
      this.filteredAddedList = [...this.allocated];
    })
  }


  submit() {

    if (this.subLcoChipID === '') {
      this.swal.Error("Chip ID is required.");
      return;
    }
    if (this.subLcoChipID === '') {
      this.swal.Error("Chip ID is required .");
      return;
    }
    if (this.subLcoSmartcard === '') {
      this.swal.Error("Smartcard is required .");
      return;
    }
    this.userService.getchipidUpdate(this.role, this.username, this.subLcoSmartcard, this.subLcoChipID, this.subLcoModel)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  getForceButton(value: any, isforce: any) {
    this.swal.Loading();
    this.userService.getUpdateChipidForce(this.role, this.username, value, !isforce)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  getForceDate(value: any, date: any) {
    console.log(date);
    this.swal.Loading();
    this.userService.getUpdateChipidForceDate(this.role, this.username, value, date)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  createChipModel(data: any, name: any) {
    let dialogData = { data: data, type: name }
    console.log(dialogData);
    const dialogRef = this.dialog.open(DialogChipidComponent, {
      width: '700px',
      data: dialogData,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
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
        console.log('1111111111', this.todo);
      } else if (val == 2) {
        data = event.container.data;
        this.allocated = event.container.data;
        console.log('22222222', this.allocated);
      }
    } else {
      console.log(event);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      if (val == 1) {
        data = event.previousContainer.data;
        this.todo = event.previousContainer.data;
        console.log('3333333333', this.todo);
      } else if (val == 2) {
        data = event.container.data;
        this.allocated = event.container.data;
        console.log('444444', this.allocated);
      }
    }
    this.containeroperatorid = data?.map((item: any) => item.modelno);
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
    console.log('1111111111', searchTerm);
    console.log(this.filteredAddedList);

    this.filteredAddedList = this.allocated.filter((item: any) =>
      item.modelno.toString().toLowerCase().includes(searchTerm)
    );
    this.cdr.detectChanges();
    console.log(this.filteredAddedList);
  }

  filterAvailableList(): void {
    this.cdr.detectChanges();
    const searchTerm = this.searchTermAvailable.toLowerCase();
    console.log('222222222', searchTerm);
    console.log(this.filteredAvailableList);
    this.filteredAvailableList = this.todo.filter((item: any) =>
      item.modelno.toString().toLowerCase().includes(searchTerm)
    );
    console.log(this.filteredAvailableList);
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
        operatorname: item.modelno,
        operatorid: item.id
      }));
      console.log(this.containerData);

      this.containeroperatorid = this.containerData.map((item: any) => item.operatorname);
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
          operatorname: item.modelno,
          operatorid: item.id
        }));
        console.log(this.containerData);

        this.containeroperatorid = this.containerData.map((item: any) => item.operatorname);
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
          operatorname: item.modelno,
          operatorid: item.id
        }));
        console.log(this.containerData);

        this.containeroperatorid = this.containerData.map((item: any) => item.operatorname);
        console.log(this.containeroperatorid);
      });
    }
    this.containerData = this.todo.map((item: any) => ({
      operatorname: item.modelno,
      operatorid: item.id
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
        operatorname: item.modelno,
        operatorid: item.id
      }));
      this.containeroperatorid = this.containerData.map((item: any) => item.operatorname);
      console.log(this.containeroperatorid);

    } else if (direction === 'left') {
      this.todo.push(...this.allocated);
      this.allocated = [];
      this.containerData = this.allocated.map((item: any) => ({
        operatorname: item.modelno,
        operatorid: item.id
      }));
      this.containeroperatorid = this.containerData.map((item: any) => item.operatorname);
      console.log(this.containeroperatorid);

    }

    this.filteredAvailableList = [...this.todo];
    this.filteredAddedList = [...this.allocated];
    console.log('Todo List:', this.todo);
    console.log('Allocated List:', this.allocated);
  }
  save() {
    console.log('ewrrrrrr322', this.containeroperatorid);
    this.userService.getUpdateModelForOperator(this.role, this.username, this.opName, this.containeroperatorid)
      .subscribe((res: any) => {
        this.swal.success(res?.message);
      }, (err) => {
        this.swal.Error(err?.error?.message);
      });
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false },
    { headerName: 'MODEL NAME', field: 'model', width: 250, },
    { headerName: 'MODEL NUMBER', field: 'modelno', width: 230, },
    {
      headerName: 'STATUS', field: 'status', width: 230, cellRenderer: (params: any) => {
        const status = params.value;
        const color = status === 'Active' ? 'green' : 'red';
        return `<span style="color: ${color}; font-weight: bold;">${status}</span>`;
      }
    },
    {
      headerName: 'EDIT', width: 230, filter: false,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<img src="/assets/images/icons/editstreet2.png" style="width:30px;background-color:none">';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Street List';
        editButton.style.cursor = 'pointer';
        editButton.addEventListener('click', () => {
          this.createChipModel(params.data, 'editChipid');
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      },
    },
  ]
  columnDefs1: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, filter: false },
    { headerName: 'OPERATOR', field: 'Operator_Name', width: 200, },

    {
      headerName: 'FORCE',
      field: 'chipupdate_force',
      width: 230, cellStyle: { textAlign: 'center' },
      cellRenderer: (params: any) => {
        let isForce = params.data.chipupdate_force === true;
        const button = document.createElement('button');
        const updateButtonStyle = () => {
          button.textContent = isForce ? 'Enable' : 'Disable';
          button.style.backgroundColor = isForce ? '#4CAF50' : '#f44336';
          button.style.color = 'white';
          button.style.border = 'none';
          button.style.borderRadius = '4px';
          button.style.marginTop = '10px';
          button.style.padding = '4px 10px';
          button.style.height = '25px';
          button.style.width = '100px';
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
          button.style.cursor = 'pointer';
        };

        updateButtonStyle();

        button.addEventListener('click', () => {

          params.data.chipupdate_force = isForce;
          updateButtonStyle();
          this.createChipModel(params.data, isForce ? 'enableChipid' : 'disableChipid');
          if (params.data?.Operator_ID) {
            this.getForceButton(params.data.Operator_ID, params.data.chipupdate_force);
          }

          if (params.api) {
            params.api.refreshCells({ rowNodes: [params.node], columns: ['chipid_skip_date'] });
          }
        });
        return button;
      },
    },
    {
      headerName: 'SKIP UNTILL THE DAY',
      field: 'chipid_skip_date',
      width: 220,
      cellRenderer: (params: any) => {
        const date = params.data.chipid_skip_date;
        const isForce = params.data.chipupdate_force === true;
        const input = document.createElement('input');
        input.type = isForce ? 'date' : 'text';
        input.disabled = !isForce;
        input.value = date && date !== '' && date !== 'not set' ? date : '';
        input.placeholder = !date || date === 'not set' ? 'not set' : '';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.padding = '0px 8px';
        input.style.width = '150px';
        input.style.height = '30px';
        input.style.cursor = 'pointer';
        input.style.textAlign = 'center';
        input.style.color = isForce ? 'black' : 'grey';
        input.style.backgroundColor = isForce ? '#fff' : '#f0f0f0';
        input.readOnly = !isForce;

        if (isForce) {
          input.addEventListener('change', (e: any) => {
            const newDate = e.target.value;
            console.log('Selected Date:', newDate);
            params.data.chipid_skip_date = newDate;

            if (params.data?.Operator_ID) {
              this.getForceDate(params.data.Operator_ID, params.data.chipid_skip_date);
            }
            if (params.api) {
              params.api.refreshCells({ rowNodes: [params.node], columns: ['chipid_skip_date'] });
            }
          });
        }

        return input;
      }
    }

  ]
}
