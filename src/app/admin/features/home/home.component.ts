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
  // `<button style="padding: 4px 10px; background-color:rgb(13, 109, 187); color: white; border: none; border-radius: 4px;">
  //        Count
  //      </button>`
  columnnDefs: any[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 80, },

    { headerName: "CAS NAME", field: 'cas_name', width: 300, },

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
    {
      headerName: "",
      field: 'count',
      width: 300,
      cellRenderer: (params: any) => {
        console.log(params);
        // const context = params.context.componentParent;
        console.log('aaaaaaaa', this.isshow);
        const isAJK = this.isshow;
        const countValue = params.value;
        // this.isshow = true;
        return isAJK ? '<i class="fa fa-info" style="font-size: 25px;;cursor:pointer;color:#024871"></i>' : `${countValue}`;
      },
      // onCellClicked: (params: any) => {
      //   const context = params.context.componentParent;
      //   console.log('dddd', context);
      //   if (context.isshow) {
      //     console.log('eeeee', context.isshow);
      //     const dialogRef = context.dialog.open(HomeLoginCredentialComponent, {
      //       maxWidth: "500px",
      //       data: { data: params.data }
      //     });
      //     dialogRef.afterClosed().subscribe((result: any) => {
      //       console.log('The dialog was closed');
      //       if (result && result.success) {
      //         console.log('Success result:', result);
      //         context.isshow = false;
      //         params.api.refreshCells({
      //           rowNodes: [params.node],
      //           columns: ['count'],
      //           force: true
      //         });
      //         // context.isshow = true;
      //       }
      //     });
      //   }
      // }

      onCellClicked: (params: any) => {
        const isShow = this.isshow;
        console.log('isShow:', isShow);

        if (isShow) {
          console.log('Opening dialog...');

          const dialogRef = this.dialog.open(HomeLoginCredentialComponent, {
            maxWidth: '500px',
            data: { data: params.data }
          });

          dialogRef.afterClosed().subscribe((result: any) => {
            console.log('The dialog was closed');
            if (result && result.success) {
              console.log('Success result:', result);
              this.isshow = true;
              // Refresh specific cell
              params.api.refreshCells({
                rowNodes: [params.node],
                columns: ['count'],
                force: true
              });
            }
          });
        }
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
