import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMaterialModule } from './mat-material/mat-material.module';
// import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { LoginComponent } from 'src/app/login/login.component';
import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
    declarations: [
        LoginComponent,
    ],
    imports: [
        CommonModule,
        MatMaterialModule,
        HttpClientModule,
        AgGridModule,
        MatDatepickerModule,
        // ToastrModule.forRoot({
        //     timeOut: 4000, // 10 seconds
        //     closeButton: true,
        //     progressBar: true,
        // }),
    ]
})
export class CoreModule { }
