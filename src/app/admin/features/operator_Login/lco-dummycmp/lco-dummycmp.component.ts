import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';

@Component({
  selector: 'app-lco-dummycmp',
  templateUrl: './lco-dummycmp.component.html',
  styleUrls: ['./lco-dummycmp.component.scss']
})
export class LcoDummycmpComponent implements OnInit {
  ngOnInit(): void {

  }
  public variables2 = [{ id: 0, name: 'One' }, { id: 1, name: 'Two' }];
  public filteredList5 = this.variables2.slice();
}
