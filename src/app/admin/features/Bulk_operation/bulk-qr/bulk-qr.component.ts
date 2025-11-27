import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import { SwalService } from 'src/app/_core/service/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-qr',
  templateUrl: './bulk-qr.component.html',
  styleUrls: ['./bulk-qr.component.scss']
})
export class BulkQrComponent implements OnInit {

  role: any;
  username: any;
  operatorList: any[] = [];
  filteredOperators: any[] = [];
  filteredTypes: any[] = [
    { name: "Select Status", id: '0' },
    { name: "Active", id: '1' },
    { name: "Deactive", id: '2' },
  ];
  selectedType: any = 0;
  selectedOperator: any;
  selectedCas: any = 0;
  selectedSublco: any = 0;
  cas: any[] = [];
  sublco: any[] = [];
  filteredCasList: any[] = [];
  filteredSublcoList: any[] = [];
  constructor(private userservice: BaseService, private storageservice: StorageService, private swal: SwalService,) {
    this.role = storageservice.getUserRole();
    this.username = storageservice.getUsername();
  }
  ngOnInit(): void {
    this.loadOperators();
    this.getCasList();

  }
  ngAfterViewInit(): void {
    ($('#ltb') as any).select2({
      placeholder: 'Select Operator Name',
      allowClear: true
    });
    $('#ltb').on('change', (event: any) => {
      this.selectedOperator = event.target.value;
      console.log(this.selectedOperator);

      this.onoperatorchange(this.selectedOperator);
    });


    ($('#cas') as any).select2({
      placeholder: 'Select CAS Name',
      allowClear: true
    });
    $('#cas').on('change', (event: any) => {
      this.selectedCas = event.target.value;
      console.log(this.selectedCas);
    });

    ($('#sublco') as any).select2({
      placeholder: 'Select SUBLCO Name',
      allowClear: true
    });
    $('#sublco').on('change', (event: any) => {
      this.selectedSublco = event.target.value;
      console.log(this.selectedSublco);
    });
    ($('#type') as any).select2({
      placeholder: 'Select TYpe',
      allowClear: true
    });
    $('#type').on('change', (event: any) => {
      const selectedIndex = event.target.selectedIndex;
      this.selectedType = selectedIndex;
      console.log(this.selectedType);
    });


  }
  loadOperators() {
    this.userservice.getOeratorList(this.role, this.username, 2).subscribe((data: any) => {
      console.log(data);
      this.operatorList = Object.keys(data).map(key => {
        const value = data[key];
        return { name: key, value: value };
      });
      this.filteredOperators = this.operatorList;
    });

  }
  filterOperators(event: any): void {
    const filterValue = event.target.value.toLowerCase();
    this.filteredOperators = this.operatorList.filter(operator => operator.name.toLowerCase().includes(filterValue));
  }
  onoperatorchange(operator: any): void {
    console.log(operator);
    const match = operator.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      this.selectedOperator = match[1];
    } else {
      this.selectedOperator = null;
    }
    console.log('Selected Operator:', this.selectedOperator);
    this.getSublcoList();
  }
  getCasList() {
    this.userservice.Cas_type(this.role, this.username).subscribe((data) => {
      this.cas = data;
      console.log('dfdsfdsfsd', this.cas);
      this.cas = data.map((item: any) => ({
        id: item.id,
        name: item.casname
      }));
      this.filteredCasList = this.cas;
      console.log(this.cas);

    });
  }

  getSublcoList() {
    this.userservice.getAllSublcoListByOperatorId(this.role, this.username, this.selectedOperator).subscribe((data: any) => {
      this.sublco = data;
      console.log('dfdsfdsfsd', this.sublco);
      this.sublco = data.map((item: any) => ({
        id: item.retailerId,
        name: item.retailerName
      }));
      this.filteredSublcoList = this.sublco;
      console.log(this.sublco);
    })
  }
  submit() {
    if (!this.selectedOperator) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Selection',
        text: 'Please select an operator.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    this.swal.Loading();

    this.userservice.getBulkQRDownload(this.role, this.username, this.selectedOperator, this.selectedCas, this.selectedType, this.selectedSublco)
      .subscribe({
        next: async (response: HttpResponse<Blob>) => {
          this.swal.Close();
          console.log('Response:', response);
          if (response.status === 204) {
            this.swal.info1('No data available to download (204 - No Content).');
            return;
          }
          if (response.status === 200 && response.body) {
            const blob = response.body;
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'BulkQRDownload.zip';
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            this.swal.success_3('Bulk QR Download completed successfully!');
            return;
          }
          this.swal.Error(`Unexpected response (${response.status}).`);
        },
        error: async (err) => {
          this.swal.Close();
          if (err.error instanceof Blob) {
            const errorText = await err.error.text();
            try {
              const parsed = JSON.parse(errorText);
              this.swal.Error(parsed.message || 'Something went wrong.');
            } catch {
              this.swal.Error(errorText || 'Something went wrong.');
            }
            return;
          }
          const status = err.status;
          switch (status) {
            case 400:
              this.swal.Error('Bad Request (400)');
              break;
            case 401:
              this.swal.Error('Unauthorized (401)');
              break;
            case 403:
              this.swal.Error('Forbidden (403)');
              break;
            case 404:
              this.swal.Error('Not Found (404)');
              break;
            case 500:
              this.swal.Error('Internal Server Error (500)');
              break;
            case 204:
              this.swal.info1('No data available (204 - No Content).');
              break;
            default:
              this.swal.Error(`Unexpected error (${status})`);
              break;
          }
        }
      });
  }


}
