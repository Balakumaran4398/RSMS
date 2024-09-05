import { Component } from '@angular/core';

@Component({
  selector: 'app-sub-dashboard',
  templateUrl: './sub-dashboard.component.html',
  styleUrls: ['./sub-dashboard.component.scss']
})
export class SubDashboardComponent {
  gridOptions = {
    defaultColDef: {
      width: 205
    },
  }

  columnDefs: any[] = [
    {
      headerName: "S.No", valueGetter: 'node.rowIndex+1',

    },
    {
      headerName: 'SMARTCARD',
      field: 'smartcard',
    },
    {
      headerName: 'CAS TYPE',
      field: 'cas_type',
    },
    {
      headerName: 'EXPIRY DATE	',
      field: 'expiry_date',
    },
    {
      headerName: 'ACTION',
      field: 'action',
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';

        // Info Button
        const infoButton = document.createElement('button');
        infoButton.style.backgroundColor = '#b81f1a';
        infoButton.style.border = 'none';
        // infoButton.style.padding = '1px';
        infoButton.style.width = '25px';
        infoButton.style.height = '25px';
        infoButton.style.color = 'white';
        infoButton.style.borderRadius = '5px';
        infoButton.style.cursor = 'pointer';
        infoButton.style.fontSize = '15px';
        infoButton.style.display = 'flex';
        infoButton.style.alignItems = 'center';
        infoButton.style.justifyContent = 'center';
        const infoIcon = document.createElement('i');
        infoIcon.className = 'fa fa-info'; // example icon
        infoButton.appendChild(infoIcon);
        infoButton.title = 'Info';

        // Refresh Button
        const refreshButton = document.createElement('button');
        refreshButton.style.backgroundColor = '#246b3a';
        refreshButton.style.border = 'none';
        refreshButton.style.color = 'white';
        // refreshButton.style.padding = '10px';
        refreshButton.style.width = '25px';
        refreshButton.style.height = '25px';
        refreshButton.style.borderRadius = '5px';
        refreshButton.style.cursor = 'pointer';
        refreshButton.style.fontSize = '15px';
        refreshButton.style.display = 'flex';
        refreshButton.style.alignItems = 'center';
        refreshButton.style.justifyContent = 'center';
        const refreshIcon = document.createElement('i');
        refreshIcon.className = 'fa fa-refresh'; // example icon
        refreshButton.appendChild(refreshIcon);
        refreshButton.title = 'Refresh';

        // Download Button
        const downloadButton = document.createElement('button');
        downloadButton.style.backgroundColor = '#0d6efd';
        downloadButton.style.border = 'none';
        // downloadButton.style.padding = '10px';
        downloadButton.style.width = '25px';
        downloadButton.style.height = '25px';
        downloadButton.style.color = 'white';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.fontSize = '15px';
        downloadButton.style.display = 'flex';
        downloadButton.style.alignItems = 'center';
        downloadButton.style.justifyContent = 'center';
        const downloadIcon = document.createElement('i');
        downloadIcon.className = 'fa fa-download'; // example icon
        downloadButton.appendChild(downloadIcon);
        downloadButton.title = 'Download';

        // Append buttons to the container
        container.appendChild(infoButton);
        container.appendChild(refreshButton);
        container.appendChild(downloadButton);

        // Add click event listeners if needed
        infoButton.addEventListener('click', () => {
          console.log('Info button clicked', params.data);
        });

        refreshButton.addEventListener('click', () => {
          console.log('Refresh button clicked', params.data);
        });

        downloadButton.addEventListener('click', () => {
          console.log('Download button clicked', params.data);
        });

        return container;
      },
    },

  ]
  rowData: any[] = [
    {
      smartcard: '1234567890',
      cas_type: 'Type A',
      expiry_date: '2024-12-31',
      action: 'Activate'
    },
    {
      smartcard: '0987654321',
      cas_type: 'Type B',
      expiry_date: '2025-06-30',
      action: 'Deactivate'
    },
    {
      smartcard: '1234567890',
      cas_type: 'Type A',
      expiry_date: '2024-12-31',
      action: 'Activate'
    },
    {
      smartcard: '0987654321',
      cas_type: 'Type B',
      expiry_date: '2025-06-30',
      action: 'Deactivate'
    },
    {
      smartcard: '1234567890',
      cas_type: 'Type A',
      expiry_date: '2024-12-31',
      action: 'Activate'
    },
    {
      smartcard: '0987654321',
      cas_type: 'Type B',
      expiry_date: '2025-06-30',
      action: 'Deactivate'
    },
    // Add more rows as needed
  ];

  onGridReady() {

  }
  Lodin_details() {

  }
  Edit_subscriber_details() {

  }
  Download() {

  }
  Report() {

  }
}

