import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/_core/service/base.service';
import { ExcelService } from 'src/app/_core/service/excel.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';

@Component({
  selector: 'app-msor-dialogueports',
  templateUrl: './msor-dialogueports.component.html',
  styleUrls: ['./msor-dialogueports.component.scss']
})
export class MsorDialogueportsComponent implements OnInit{
type:any;
username:any;
role:any;
reportTitle: any;
gridOptions = {
  defaultColDef: {
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true
  },
  paginationPageSize: 10,
  pagination: true,
}
gridApi: any;
  constructor(private route: ActivatedRoute, 
    public userService: BaseService, private cdr: ChangeDetectorRef, public storageservice: StorageService) {
    this.type = this.route.snapshot.paramMap.get('id');
    this.username = storageservice.getUsername();
    this.role = storageservice.getUserRole();
    console.log(this.type);
    this.setReportTitle();
  }
  ngOnInit(): void {
    // this.setReportTitle();
  }
  setReportTitle() {
    console.log('type',this.type);
    
    switch (this.type) {
      case '1':
        // this.reportTitle = 'Monthly Broadcaster Report';
        break;
      case '2':
        // this.reportTitle = 'Over All Product Report';
        break;
      case '3':
        // this.reportTitle = 'Over All Base Product / Universal Count Report';
        break;
      case '4':
        // this.reportTitle = 'Over All Base Product Report';
        break;
      case '5':
        // this.reportTitle = 'Monthly Broadcaster Caswise Report';
        break;
      case '6':
        // this.reportTitle = 'Channel Aging Report';
        break;
      case '7':
        // this.reportTitle = 'Package Aging Report';
        break;
      default:
        // this.reportTitle = 'Unknown Report';
    }
  }
}
