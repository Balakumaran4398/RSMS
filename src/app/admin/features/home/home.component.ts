import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

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
  constructor(private userService: BaseService, private storageService: StorageService) {
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
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', width: 100, },
    { headerName: "CAS NAME", field: 'cas_name', width: 250, },
    { headerName: "COUNT", field: 'count', width: 100, },
    {
      headerName: "STATUS", field: 'status', width: 200, cellStyle: (params: any) => {
        if (params.value === 'Active') {
          return { color: 'green', fontWeight: 'bold' };
        } else if (params.value === 'Deactive') {
          return { color: 'red', fontWeight: 'bold' };
        }
        return null;
      }
    },
    { headerName: "ID", field: 'id', width: 200, },
    {
      headerName: "COUNT",
      field: 'count',
      width: 150,
      cellRenderer: (params: any) => {
        const countValue = params.value;
        console.log(countValue);
        const isDisabled = params.context.componentParent.isshow;
        console.log(isDisabled);
        return `
        <button ${countValue ? 'disabled' : ''} 
                style="padding: 4px 10px; background-color: ${countValue ? '#ccc' : '#007bff'}; 
                       color: block; border: none; border-radius: 4px;">
          ${isDisabled}
        </button>
      `;
      }
    },
    
  ]
}
