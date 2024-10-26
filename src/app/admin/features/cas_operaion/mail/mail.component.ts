import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { BaseService } from 'src/app/_core/service/base.service';
import { StorageService } from 'src/app/_core/service/storage.service';
import Swal from 'sweetalert2';
import { CasDialogueComponent } from '../../channel_setting/_Dialogue/cas-dialogue/cas-dialogue.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent {
  form!: FormGroup;
  IntendFormControl: any;
  username: any;
  role: any;
  isIntendto: boolean = true;
  isSmartcardEnabled: boolean = false;
  isAreaCodeEnabled: boolean = false;
  isMSOCodeEnabled: boolean = false;
  isButtonEnable: boolean = false;
  isDateDisabled: boolean = true;
  CasFormControl: any;
  selectedIntendFormControl: any;
  selectedAreaCodeFormControl = new FormControl('');

  intendIdFormControl: any;
  intendIdLcoFormControl: any;
  area: any[] = [];
  cas: any[] = [];
  lco_list: any[] = [];
  searchTerm: string = '';
  intend: any = [
    { lable: "MSO", value: 0 },
    { lable: "Smartcard", value: 1 },
    { lable: "LCO", value: 2 },
  ];

  public rowSelection: any = "multiple";
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      width: 180,
      floatingFilter: true
    },
    paginationPageSize: 10,
    pagination: true,
  }
  rowData = [];
  onGridReady = () => {

  }
  constructor(private userservice: BaseService, private storageService: StorageService, private fb: FormBuilder, public dialog: MatDialog) {
    this.username = storageService.getUsername();
    this.role = storageService.getUserRole();
    userservice.GetMail_List(this.role, this.username).subscribe((data: any) => {
      this.rowData = data;
      console.log(this.rowData);
    })
    userservice.getsmartcardallocationSubscriberList(this.role, this.username).subscribe((data: any) => {
      console.log(data);
      // this.lco_list = data[0].operatorid;
      this.lco_list = Object.entries(data[0].operatorid).map(([key, value]) => ({ name: key, id: value }));
      console.log(this.lco_list);

      console.log(this.lco_list);
    })
  }
  columnDefs: ColDef[] = [
    { headerName: "S.No", lockPosition: true, valueGetter: 'node.rowIndex+1', cellClass: 'locked-col', width: 80, suppressNavigable: true, sortable: false, filter: false },
    { headerName: "INTEND ID", field: 'intendid' },
    { headerName: "INTEND TO", field: 'intendto' },
    { headerName: "TITLE", field: 'mailtitle' },
    { headerName: "SENDER	", field: 'sender' },
    { headerName: "MESSAGE", field: 'message' },
    { headerName: "EXPIRY DATE	", field: 'expirydate' },
    {
      headerName: "ACTION",
      cellRenderer: (params: any) => {
        const div = document.createElement('div');

        const MailButton = document.createElement('button');
        MailButton.innerHTML = '<button style="width: 5em;background-color: #6f8fde;color:white;border-radius: 5px;height: 2em;color:white"><p style="margin-top:-6px">RS</p></button>';
        MailButton.style.backgroundColor = 'transparent';
        MailButton.style.border = 'none';
        MailButton.title = 'Mail';
        MailButton.style.cursor = 'pointer';
        MailButton.style.marginLeft = '20px';

        // Add click event listener to Stop Button
        MailButton.addEventListener('click', () => {
          // Assuming 'this' refers to the component instance
          this.openDialog(params.data, 'mail');
        });

        // Append Stop Button to div
        div.appendChild(MailButton);

        // Return the div containing the Stop Button
        return div;
      }
    }


  ];

  ngOnInit() {
    this.userservice.Finger_print_List(this.role, this.username).subscribe((data) => {
      console.log(data);
      this.area = data[0].arealist;
      console.log(this.area);
      this.area = Object.entries(data[0].arealist).map(([key, value]) => ({ name: key, id: value }));
      this.cas = Object.entries(data[0].caslist).map(([key, value]) => ({ name: key, id: value }));
    })
    this.form = this.fb.group({
      castype: ['', Validators.required],
      intendto: ['', Validators.required],
      intendid: ['', Validators.required],
      sender: ['', Validators.required],
      mailtitle: ['', Validators.required],
      expirydate: [0, Validators.required],
      isresend: [false, Validators.required],
      message: ['', Validators.required],
      d_type: 0,
      role: this.role,
      username: this.username,
    })
    
  }
  onChangeIntendTo1(selectedValue: any) {
    this.isSmartcardEnabled = false;
    this.isAreaCodeEnabled = false;
    console.log('enabled             =' + selectedValue);
    if (selectedValue == 0) {
      this.isSmartcardEnabled = false;
      this.isAreaCodeEnabled = false
      this.isMSOCodeEnabled = false
      console.log('Smartcard enabled');
    }
    if (selectedValue == 1) {
      this.isSmartcardEnabled = true;
      this.isAreaCodeEnabled = false
      console.log('Smartcard enabled');
    }

    if (selectedValue == 2) {
      this.isAreaCodeEnabled = true;
      this.isSmartcardEnabled = false
      console.log('Area code enabled');
    }
    if (selectedValue !== 2 && selectedValue !== 3) {
      console.log('Both disabled');
    }
  }
  onSelectionFingerPrint(selectedCas: string) {
    console.log(selectedCas);
    const casId = Number(selectedCas);
    if (casId == 1) {
      this.isDateDisabled = false;
    } else {
      this.isDateDisabled = true;
    }
  }
  filteredIntendArea(): any[] {
    if (!this.searchTerm) {
      return this.area;
    }
    return this.area.filter((area: any) =>
      area.lable.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  // onSubmit() {
  //   // if (this.form.valid) {
  //     Swal.fire({
  //       title: 'Updateing...',
  //       text: 'Please wait while the Mail is being updated',
  //       allowOutsideClick: false,
  //       didOpen: () => {
  //         Swal.showLoading(null);
  //       }
  //     });
  //   this.userservice.CreateMail(this.form.value).subscribe(
  //     (res: any) => {
  //       console.log(res);
  //       Swal.fire({
  //         title: 'Success!',
  //         text: res.message || 'Your mail has been created successfully.',
  //         icon: 'success',
  //         timer: 3000, // 3 seconds
  //         showConfirmButton: false
  //       }).then(() => {
  //         // window.location.reload();
  //         this.ngOnInit();
  //       });
  //     },
  //     (error) => {
  //       console.error(error);
  //       Swal.fire({
  //         title: 'Error!',
  //         text: error?.error.message || 'There was an issue creating your mail. Please try again later.',
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //     }
  //   );
  // // } else {
  // //   this.form.markAllAsTouched();
  // // }
  // }

  onSubmit() {
    // Check if the form is valid
    if (this.form.valid) {
      Swal.fire({
        title: 'Updating...',
        text: 'Please wait while the Mail is being updated',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null);
        }
      });

      // Call the API to create the mail
      this.userservice.CreateMail(this.form.value).subscribe(
        (res: any) => {
          console.log(res);
          Swal.fire({
            title: 'Success!',
            text: res.message || 'Your mail has been created successfully.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            // Optionally reload the page or refresh data
            this.ngOnInit();
          });
        },
        (error) => {
          console.error(error);
          Swal.fire({
            title: 'Error!',
            text: error?.error.message || 'There was an issue creating your mail. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      );
    } else {
      // If the form is invalid, mark all controls as touched to trigger validation messages
      this.form.markAllAsTouched();
    }
  }


  openDialog(event: any, type: any): void {
    let dialogData = { data: event, type: type };
    const dialogRef = this.dialog.open(CasDialogueComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: dialogData
    });
    console.log(dialogData);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
