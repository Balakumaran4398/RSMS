import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paymentalert',
  templateUrl: './paymentalert.component.html',
  styleUrls: ['./paymentalert.component.scss']
})
export class PaymentalertComponent {
  constructor() {
    Swal.fire({
      icon: 'error',
      title: 'Invalid URL',
      text: 'Invalid customer details in the URL.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })
  }
}
