import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { PackageBaseViewComponent } from '../_Dialogue/package Creation/package-base-view/package-base-view.component';
import { PackageCloneComponent } from '../_Dialogue/package Creation/package-clone/package-clone.component';
import { PackageCreateComponent } from '../_Dialogue/package Creation/package-create/package-create.component';
import { PackageEditComponent } from '../_Dialogue/package Creation/package-edit/package-edit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package-creation',
  templateUrl: './package-creation.component.html',
  styleUrls: ['./package-creation.component.scss']
})
export class PackageCreationComponent {
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  package_id: any;
  username: any;
  role: any;
  type: number = 1;
  rowData: any;
  constructor(public dialog: MatDialog, public router: Router, public userService: BaseService, storageService: StorageService,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {

    this.userService.PackageList(this.role, this.username, this.type).subscribe((data) => {
      this.rowData = data;
    })
  }
  domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  columnDefs: any[] = [
    {
      headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100,
    },
    { headerName: "PACKAGE NAME", field: 'packagename', width: 180 },
    {
      headerName: 'Actions', width: 350, filter: false,
      cellRenderer: (params: any) => {
        const editButton = document.createElement('button');
        const manageButton = document.createElement('button');
        const cloneButton = document.createElement('button');
        const viewButton = document.createElement('button');


        // Edit button
        editButton.innerHTML = '<i class="fa-solid fa-pen" style="font-size:20px;color:black"></i>';
        editButton.style.backgroundColor = 'transparent';
        editButton.style.border = 'none';
        editButton.title = 'Edit';
        editButton.style.cursor = 'pointer';
        editButton.style.marginRight = '10px';
        editButton.style.fontSize = "18px";
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
    { headerName: "ORDER ID", field: 'orderid', width: 150 },
    { headerName: "PACKAGE RATE", field: 'packagerate', width: 150 },


    {
      headerName: "REPORT", field: 'report', width: 130,
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
          // this.addnew('channeltype');  // Pass any type you need here
        });
        const div = document.createElement('div');
        div.appendChild(editButton);
        return div;
      }
    },


  ]
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
    const dialogRef = this.dialog.open(PackageBaseViewComponent, {
      width: '1200px',
      maxWidth: '100vw',
      height: '600px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
