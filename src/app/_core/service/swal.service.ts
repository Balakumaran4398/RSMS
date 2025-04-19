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
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      location.reload();
    });
  }
  error(message: any) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
  success_1(message: any) {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
  success_2(message: any) {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
  warning(message: any) {
    Swal.fire({
      title: 'Warning!',
      text: message,
      icon: 'warning',
      timer: 2000,
      timerProgressBar: true,
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
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      location.reload();
    });
  }
  info1(message: any) {
    Swal.fire({
      title: 'Info!',
      text: message,
      icon: 'info',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })
  }
  Error(message: any) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      // location.reload();
    });
  }
  Error1(message: any) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      location.reload();
    });
  }
  Error3(message: any) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      // timer: 2000,
      // timerProgressBar: true,
      showConfirmButton: true
    }).then(() => {
      location.reload();
    });
  }
  warning_1() {
    Swal.fire({
      title: 'Warning!',
      icon: 'warning',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })
  }
  Loading() {
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait Loading Onprogress.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }
  Loading1() {
    Swal.fire({
      title: 'Loading...',
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
  }

  Close() {
    Swal.close();
  }

  Invalid() {
    Swal.fire({
      title: 'Warning!',
      icon: 'warning',
      text: 'Invalid Input',
      timer: 1000,
      showConfirmButton: false
    })
  }

  Success_200() {
    Swal.fire({
      title: 'Success',
      text: 'Data updated successfully!',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
  Successadd_200() {
    Swal.fire({
      title: 'Success',
      text: 'Data updated successfully!',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      location.reload();
    });
    ;
  }
  Success_204() {
    Swal.fire({
      title: 'info',
      text: 'No data available for the given criteria.!',
      icon: 'warning',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
  Error_400() {
    Swal.fire({
      title: 'Error',
      text: 'Bad Request. Please check the input.',
      icon: 'error',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    });
  }

  Custom_Error_400(error: any) {
    Swal.fire({
      title: 'Error',
      text: error,
      icon: 'error',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    });
  }
  Error_404() {
    Swal.fire({
      title: 'Error',
      text: 'Data not found.',
      icon: 'error',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    });
  }
  Error_500() {
    Swal.fire({
      title: 'Error',
      text: 'Internal server error. Please try again later.',
      icon: 'error',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    });
  }
  // console.log(event.smartcard);
  // let timerInterval: any;
  // Swal.fire({
  //   title: "Loading!!!",
  //   timer: 2000,
  //   timerProgressBar: true,
  //   didOpen: () => {
  //     Swal.showLoading(null);
  //   },
  //   willClose: () => {
  //     clearInterval(timerInterval);
  //   }
  // }).then((result) => {
  //   if (result.dismiss === Swal.DismissReason.timer) {
  //     console.log("I was closed by the timer");
  //   }
  // });


  // handleApiError(error: any) {
  //   if (error.status === 400) {
  //     this.swal.Error_400();
  //   } else if (error.status === 500) {
  //     this.swal.Error_500();
  //   } else {
  //     Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
  //   }
  // }
  // this.cdr.detectChanges();
}
