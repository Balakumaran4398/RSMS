import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { PackageBaseViewComponent } from '../_Dialogue/package Creation/package-base-view/package-base-view.component';
import { PackageCloneComponent } from '../_Dialogue/package Creation/package-clone/package-clone.component';
import { PackageCreateComponent } from '../_Dialogue/package Creation/package-create/package-create.component';
import { PackageEditComponent } from '../_Dialogue/package Creation/package-edit/package-edit.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-package-creation',
  templateUrl: './package-creation.component.html',
  styleUrls: ['./package-creation.component.scss']
})
export class PackageCreationComponent {
  // gridOptions = {
  //   defaultColDef: {
  //     sortable: true,
  //     resizable: true,
  //     filter: true, 
  //     floatingFilter: true,
  //     comparator: (valueA: any, valueB: any) => {
  //       const isNumberA = !isNaN(valueA) && valueA !== null;
  //       const isNumberB = !isNaN(valueB) && valueB !== null;

  //       if (isNumberA && isNumberB) {
  //         return valueA - valueB; 
  //       } else {
  //         const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
  //         const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
  //         return normalizedA.localeCompare(normalizedB); 
  //       }
  //     },
  //     filterParams: {
  //       textFormatter: (value: string) => {
  //         return value ? value.toString().toLowerCase() : '';
  //       },
  //       debounceMs: 200, 
  //     },
  //   },
  //   paginationPageSize: 10,
  //   pagination: true,
  // };

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
        debounceMs: 200,
      },
    },
    paginationPageSize: 15,
    pagination: true,
  };

  package_id: any;
  username: any;
  role: any;
  type: number = 1;
  rowData: any;
  rowData1: any;
  lcoDeatails: any;
  operatorid: any;
  constructor(public dialog: MatDialog, public router: Router, public userService: BaseService, storageService: StorageService,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {

    // this.userService.PackageList(this.role, this.username, this.type).subscribe((data) => {
    //   this.rowData = data;
    // })
    this.userService.PackageList(this.role, this.username).subscribe((data) => {
      this.rowData = data;
    })
    if (this.role == 'ROLE_OPERATOR') {
      this.operatorIdoperatorId();
    }
  }
  operatorIdoperatorId() {
    console.log('ROLE_OPERATOR');
    this.userService.getOpDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.lcoDeatails = data;
      console.log(this.lcoDeatails);
      this.operatorid = this.lcoDeatails?.operatorid;
      console.log(this.operatorid);
      // this.onlcoPackageList();
    })
  }
  // onlcoPackageList() {
  //   this.userService.getLcoPackageList(this.role, this.username, this.operatorid, 1).subscribe((data: any) => {
  //     console.log(data);
  //     this.rowData1 = data;
  //     console.log(this.rowData1);

  //   })
  // }
  domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';

  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 120, filter: false
    },
    { headerName: "PACKAGE NAME", field: 'packagename', width: 300, cellStyle: { textAlign: 'left' }, },
    {
      headerName: 'Actions', width: 380, filter: false,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        const manageButton = document.createElement('button');
        const cloneButton = document.createElement('button');
        const viewButton = document.createElement('button');
        // Edit button
        editButton.innerHTML = '<i class="fa fa-pencil-square" aria-hidden="true"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = '(rgb(29 1 11)';
        editButton.style.border = 'none';
        editButton.title = 'Edit';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '10px';
        editButton.style.fontSize = "30px";
        editButton.addEventListener('click', () => {
          this.openEditDialog({ package_cr: true }, params.data);
          // this.openEditDialog(params.data);

        });

        // Manage button
        manageButton.innerHTML = '<button style="width: 5em;background-color: #688a99;border-radius: 5px;height: 2em;"><p style="margin-top:-6px">Manage</p></button>';
        manageButton.style.backgroundColor = 'transparent';
        manageButton.style.border = 'none';
        manageButton.title = 'Manage';
        manageButton.style.cursor = 'pointer';
        manageButton.addEventListener('click', () => {
          const packageId = params.data.packageid;
          this.router.navigate(['admin/packagemanage/' + packageId]);  // Redirect to 'manage' route
        });

        // Clone button
        cloneButton.innerHTML = '<button style="width: 5em;background-color: #729968;border-radius: 5px;height: 2em;"><p style="margin-top:-6px">Clone</p></button>';
        cloneButton.style.backgroundColor = 'transparent';
        cloneButton.style.border = 'none';
        cloneButton.title = 'Clone';
        cloneButton.style.cursor = 'pointer';
        cloneButton.style.marginLeft = '20px';
        // cloneButton.style.fontSize = "18px";
        cloneButton.addEventListener('click', () => {
          this.openCloneDialog(params.data);
        });

        // View button
        viewButton.innerHTML = '<button style="width: 5em;background-color: #998f68;border-radius: 5px;height: 2em;"><p style="margin-top:-6px">View</p></button>';
        viewButton.style.backgroundColor = 'transparent';
        viewButton.style.border = 'none';
        viewButton.title = 'View';
        viewButton.style.cursor = 'pointer';
        viewButton.style.marginLeft = '20px';
        viewButton.addEventListener('click', () => {
          // this.openCloneDialog(params.data);
          this.openViewDialog({ package_view: true }, params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        div.appendChild(manageButton);
        div.appendChild(cloneButton);
        div.appendChild(viewButton);
        return div;
      },

    },
    { headerName: "REFERENCE ID", field: 'orderid', width: 150, cellStyle: { textAlign: 'center' }, },
    { headerName: "PACKAGE RATE", field: 'packagerate', width: 200, cellStyle: { textAlign: 'center' }, },
    {
      headerName: "REPORT", field: 'report', width: 170, cellStyle: { textAlign: 'center' },filter:false,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="far fa-file-pdf" style="font-size:20px;color:red"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = '#E545D1';
        editButton.style.border = 'none';
        editButton.title = 'Edit';
        editButton.style.cursor = 'pointer';
        editButton.style.fontSize = "18px";
        editButton.addEventListener('click', () => {
          // this.addnew('channeltype');  
          this.getPdfSmartcardRechargeReport(params.data);

        });

        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },


  ]
  columnDefs1: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 120, filter: false
    },
    { headerName: "PACKAGE NAME", field: 'packagename', width: 300, cellStyle: { textAlign: 'left' }, },
    { headerName: "REFERENCE ID", field: 'orderid', width: 250, cellStyle: { textAlign: 'center' }, },
    { headerName: "PACKAGE RATE", field: 'packagerate', width: 250, cellStyle: { textAlign: 'center' }, },
    {
      headerName: 'Actions', width: 380, filter: false,
      cellRenderer: (params: any) => {
        const viewButton = document.createElement('button');
        // View button
        viewButton.innerHTML = '<button style="width: 5em;background-color:rgb(188 65 43);;border-radius: 5px;height: 2em;color:white"><p style="margin-top:-6px">View</p></button>';
        viewButton.style.backgroundColor = 'transparent';
        viewButton.style.border = 'none';
        viewButton.title = 'View';
        viewButton.style.cursor = 'pointer';
        viewButton.style.marginLeft = '20px';
        viewButton.addEventListener('click', () => {
          this.openViewDialog({ package_view: true }, params.data);
        });
        const div = document.createElement('div');

        div.appendChild(viewButton);
        return div;
      },
    },
    {
      headerName: "REPORT",  width: 170, cellStyle: { textAlign: 'center' },filter:false,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="far fa-file-pdf" style="font-size:20px;color:red"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = '#E545D1';
        editButton.style.border = 'none';
        editButton.title = 'Edit';
        editButton.style.cursor = 'pointer';
        editButton.style.fontSize = "18px";
        editButton.addEventListener('click', () => {
          // this.addnew('channeltype');  
          this.getPdfSmartcardRechargeReport(params.data);

        });

        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },

  ]
  getPdfSmartcardRechargeReport(event: any) {
    console.log(event);

    Swal.fire({
      title: "Processing",
      text: "Please wait while the report is being generated...",
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    this.userService.getPackageReport(this.role, this.username, event.packageid)
      // .subscribe((data: any) => {
      //   console.log(data);
      // })
      .subscribe((x: Blob) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = (event.packagename || event.productname + ".pdf").toUpperCase();
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
        Swal.close();
      },
        (error: any) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error?.error?.message || 'There was an issue generating the PDF CAS form report.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        });
  }
  addnew(): void {
    const dialogRef = this.dialog.open(PackageCreateComponent, {
      width: '700px',
      // height: '700px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openEditDialog(dialogType: any, data: any): void {
    const dialogData = { ...dialogType, ...data };
    const dialogRef = this.dialog.open(PackageEditComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openCloneDialog(data: any): void {
    const dialogRef = this.dialog.open(PackageCloneComponent, {
      width: '600px',
      maxWidth: '100vw',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openViewDialog(dialogType: any, data: any): void {
    const dialogData = { ...dialogType, ...data };
    console.log(dialogData);

    const dialogRef = this.dialog.open(PackageBaseViewComponent, {
      width: '1200px',
      maxWidth: '100vw',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


}
