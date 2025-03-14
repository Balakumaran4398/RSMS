import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { StorageService } from '../_core/service/storage.service';
import { AlertService } from '../_core/service/alert.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

// import { AlertsComponentComponent } from '../alerts-component/alerts-component.component';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageServise: StorageService, private alertToaster: AlertService,private matDialog:MatDialog,private router:Router) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = request;
    const accessToken = this.storageServise.getToken();
    if (accessToken != null) {
      authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + accessToken) });
    }
    return next.handle(authReq).pipe(
      catchError((error) => {
        let handled: boolean = false;
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
          } else {
            switch (error.status) {
                case 401:
                    this.storageServise.signOut();
                    // this.alertToaster.showError("Invalid Credentials,Please Enter valid Employeeid and Password");
                    console.log(`redirect to login`);
                    this.matDialog.closeAll();
                    handled = true;
                    break;
                  case 403:
                    // this.token.signOut();
                    console.log(`redirect to login`);
                    handled = true;
                    break;
            }
          }
        } else {
          console.error("Other Errors");
        }
        if (handled) {
          this.swall('Incorrect username or password!!');
          return of(error);
        } else {
          console.log('throw error back to to the subscriber');
          return throwError(error);
        }
      })
    )
  }

  swall(msg: any) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Login Failed',
      text: msg,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000
    });
  }

  signOut(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
    window.location.reload();
  }
}
