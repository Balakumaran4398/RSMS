// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class DataService {
//   private dialogData: any;

//   setDialogData(data: any) {
//     this.dialogData = data;
//   }

//   getDialogData() {
//     return this.dialogData;
//   }
// }

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dialogDataKey = 'dialogData';

  setDialogData(data: any) {
    localStorage.setItem(this.dialogDataKey, JSON.stringify(data));
  }

  getDialogData() {
    const data = localStorage.getItem(this.dialogDataKey);
    return data ? JSON.parse(data) : null;
  }

  clearDialogData() {
    localStorage.removeItem(this.dialogDataKey);
  }
}
