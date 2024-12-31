import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { AddonEditComponent } from '../_Dialogue/Addon_package/addon-edit/addon-edit.component';
import { AddonViewComponent } from '../_Dialogue/Addon_package/addon-view/addon-view.component';
import { AddonCreationComponent } from '../_Dialogue/Addon_package/addon-creation/addon-creation.component';

@Component({
  selector: 'app-addon-package',
  templateUrl: './addon-package.component.html',
  styleUrls: ['./addon-package.component.scss']
})
export class AddonPackageComponent {
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      // width: 210,
      floatingFilter: true,
      comparator: (valueA: string, valueB: string) => {
        if (!valueA) valueA = '';
        if (!valueB) valueB = '';
  
        // Case-insensitive comparison
        const lowerA = valueA.toLowerCase();
        const lowerB = valueB.toLowerCase();
  
        // Sort alphabetically, considering letters before numbers
        return lowerA.localeCompare(lowerB);
      },
    },
    paginationPageSize: 10,
    pagination: true,
  }
  username: any;
  role: any;
  gridApi: any;
  rowData: any;
  type: number = 2;

  addon: boolean = true;
  constructor(public dialog: MatDialog, private router: Router, public userService: BaseService, storageService: StorageService) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {
    this.userService.AddonPackageList(this.role, this.username, this.type).subscribe((data) => {
      console.log(data);
      this.rowData = data;
    })
  }
  onGridReady(params: { api: any; }) {
    this.gridApi = params.api;
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 120 },
    { headerName: "PACKAGE NAME", field: 'addon_package_name', },
    { headerName: "BROADCASTER NAME", field: 'broadcaster_name', },
    {
      headerName: 'Actions', width: 400,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        const manageButton = document.createElement('button');
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
          this.openEditDialog({ addon: true }, params.data);
          // this.openEditDialog(params.data);

        });

        // Manage button
        manageButton.innerHTML = '<button style="width: 5em;background-color: #688a99;border-radius: 5px;height: 2em;"><p style="margin-top:-6px">Manage</p></button>';
        manageButton.style.backgroundColor = 'transparent';
        manageButton.style.border = 'none';
        manageButton.title = 'Manage';
        manageButton.style.cursor = 'pointer';
        manageButton.addEventListener('click', () => {
          const packageId = params.data.id;
          console.log(packageId);
          this.router.navigate(['admin/addonmanage/' + packageId]);  // Redirect to 'manage' route
        });


        // View button
        viewButton.innerHTML = '<button style="width: 5em;background-color: #998f68;border-radius: 5px;height: 2em;"><p style="margin-top:-6px">View</p></button>';
        viewButton.style.backgroundColor = 'transparent';
        viewButton.style.border = 'none';
        viewButton.title = 'View';
        viewButton.style.cursor = 'pointer';
        viewButton.style.marginLeft = '20px';
        viewButton.addEventListener('click', () => {
          this.openViewDialog(params.data);
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        div.appendChild(manageButton);
        div.appendChild(viewButton);
        return div;
      },

    },
    // { headerName: "BROADCASTER NAME", field: 'city', },
    { headerName: "ORDER ID", field: 'order_id', width: 300 },
    { headerName: "RATE", field: 'addon_package_rate', width: 200 },


    {
      headerName: "EXPORT", field: 'report', width: 150,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="far fa-file-pdf" style="font-size:20px;color:red"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.color = '#E545D1';
        editButton.style.border = 'none';
        editButton.title = 'Edit';
        editButton.style.cursor = 'pointer';
        editButton.style.fontSize = "18px";
        // editButton.addEventListener('click', () => {
        //   this.addnew('channeltype');  // Pass any type you need here
        // });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },
  ]


  addnew(): void {
    const dialogRef = this.dialog.open(AddonCreationComponent, {
      width: '700px',
      // height: '700px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // openEditDialog(data: any): void {
  //   let dialogData = {};

  //   switch (data) {
  //     case 'addon':
  //       dialogData = { addon: true };
  //       break;
  //   }
  //   const dialogRef = this.dialog.open(EditPackageComponent, {
  //     width: '500px',
  //     panelClass: 'custom-dialog-container',
  //     data: data
  //   });
  //  dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }


  openEditDialog(dialogType: any, data: any): void {
    const dialogData = { ...dialogType, ...data };
    const dialogRef = this.dialog.open(AddonEditComponent, {
      width: '600px',
      // maxHeight:600,
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openViewDialog(data: any): void {
    const dialogData = { ...data };
    const dialogRef = this.dialog.open(AddonViewComponent, {
      width: '1000px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // openEditDialog1(data: any): void {
  //   let dialogData = {};

  //   switch (data) {
  //     case 'view_package':
  //       dialogData = { isview_package: true };
  //       break;
  //   }
  //   const dialogRef = this.dialog.open(PackageCreationDialogueComponent, {
  //     width: '800px',
  //     panelClass: 'custom-dialog-container',
  //     data: dialogData
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }
}
