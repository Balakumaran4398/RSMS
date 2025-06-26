import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { HomeLoginCredentialComponent } from '../home_Dialog/home-login-credential/home-login-credential.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  rowData: any[] = [];
  gridOptions = {
    defaultColDef: {
      comparator: (valueA: any, valueB: any) => {
        const normalizedA = valueA ? valueA.toString().trim().toLowerCase() : '';
        const normalizedB = valueB ? valueB.toString().trim().toLowerCase() : '';
        if (normalizedA < normalizedB) return -1;
        if (normalizedA > normalizedB) return 1;
        return 0;
      },
    },
    paginationPageSize: 10,
    pagination: true,
  }
  username: any;
  role: any;
  isshow: boolean = false;
  constructor(private userService: BaseService, private storageService: StorageService, public dialog: MatDialog,) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
  }
  ngOnInit(): void {
    this.userService.getDashboardCaswiseBoxDetails(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      this.rowData = data;
    })
    this.onMsolist();
  }
  onMsolist() {
    this.userService.getMsoDetails(this.role, this.username).subscribe((res: any) => {
      console.log(res);
      this.isshow = res.msoName.includes("AJK");
      console.log(this.isshow);
    });
  }
  columnnDefs: any[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },
    { headerName: "CAS NAME", field: 'cas_name', width: 300, },
    {
      headerName: "COUNT",
      field: 'count',
      width: 300,
      cellRenderer: (params: any) => {
        const context = params.context.componentParent;
        const isAJK = context.isshow;
        const countValue = params.value;
        return isAJK
          ? `<button style="padding: 4px 10px; background-color:rgb(13, 109, 187); color: white; border: none; border-radius: 4px;">
         Count
       </button>`
          : `${countValue}`;
      },
      onCellClicked: (params: any) => {
        const context = params.context.componentParent;
        if (context.isshow) {
          const dialogRef = context.dialog.open(HomeLoginCredentialComponent, {
            maxWidth: "500px",
            data: { data: params.data }
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed');
            if (result && result.success) {
              console.log('Success result:', result);
              context.isshow = false;
              params.api.refreshCells({
                rowNodes: [params.node],
                columns: ['count'],
                force: true
              });
            }
          });
        }
      }
      // onCellClicked: (params: any) => {
      // const context = params.context.componentParent;

      //   if (!rowData.isshow) {
      //     const context = params.context.componentParent;
      //     const dialogRef = context.dialog.open(HomeLoginCredentialComponent, {
      //       maxWidth: "500px",
      //       data: { data: rowData }
      //     });

      //     dialogRef.afterClosed().subscribe((result: any) => {
      //       if (result && result.success) {
      //         console.log('Dialog success');
      //         rowData.isshow = true; 
      //         params.api.refreshCells({
      //           rowNodes: [params.node],
      //           columns: ['count'],
      //           force: true
      //         });
      //       }
      //     });
      //   }
      // }

    },
    {
      headerName: "STATUS", field: 'status', width: 300, cellStyle: (params: any) => {
        if (params.value === 'Active') {
          return { color: 'green', fontWeight: 'bold' };
        } else if (params.value === 'Deactive') {
          return { color: 'red', fontWeight: 'bold' };
        }
        return null;
      }
    },
  ]
  openEditDialog(data: any): void {
    let d = {
      data: data,
    }
    console.log(data);
    const dialogRef = this.dialog.open(HomeLoginCredentialComponent, {
      maxWidth: "500px",
      data: d
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result && result.success) {
        console.log('dsfsdfdsfdsfdsf', result);
      }
    });
  }
}
