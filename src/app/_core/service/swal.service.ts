import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }
  success(message: any) {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      // location.reload();
    });
  }
  warning(message: any) {
    Swal.fire({
      title: 'Warning!',
      text: message,
      icon: 'warning',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      location.reload();
    });
  }
  info(message: any) {
    Swal.fire({
      title: 'Info!',
      text: message,
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      location.reload();
    });
  }
  Error(message: any) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      // location.reload();
    });
  }
}
