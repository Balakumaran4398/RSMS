import * as XLSX from 'xlsx';
import *   as fs from 'file-saver';
import { Injectable } from '@angular/core';
// import { Workbook } from 'exceljs';
import * as Excel from 'exceljs';

@Injectable({
  providedIn: 'root', // <-- this registers the service globally
})
export class ExcelService {

  async generateExcel() {
    const ws1Header = [
      'Cus Name First', 'Cus Name Last', 'Father Name', 'Date of Birth',
      'Area Name', 'Street Name', 'Address', 'Address Proof No',
      'Mobile No', 'Landline No', 'Email', 'Smartcard No', 'Box Id'
    ];
    const ws2SubHeader = ['Field Name', 'Data Format', 'Mandatory'];
    const values1 = [
      ['Cas Form Id', 'Number', 'Yes'],
      ['Cus Name First', '', 'Yes'],
      ['Cus Name Last', '', 'No'],
      ['Father Name', '', 'No'],
      ['Date of Birth', 'YYYY-MM-DD', 'No'],
      ['Area Name', '', 'No'],
      ['Street Name', '', 'No'],
      ['Address', '', 'Yes'],
      ['Address Proof No', '12-digit', 'No'],
      ['Mobile No', '10-digit (Should be Unique)', 'Yes'],
      ['Landline No', '', 'Yes'],
      ['Email', '', 'No'],
      ['Smartcard No', 'Depends upon CAS', 'No'],
      ['Box Id', 'Depends upon CAS', 'No']
    ];
    const values2 = [
      ['Cas Form Id', 'Number', 'Yes'],
      ['Cus Name First', '', 'Yes'],
      ['Cus Name Last', '', 'No'],
      ['Father Name', '', 'No'],
      ['Date of Birth', 'YYYY-MM-DD', 'No'],
      ['Area Name', '', 'No'],
      ['Street Name', '', 'No'],
      ['Address', '', 'Yes'],
      ['Address Proof No', '12-digit', 'No'],
      ['Mobile No', '10-digit (Should be Unique)', 'Yes'],
      ['Landline No', '', 'Yes'],
      ['Email', '', 'No'],
      ['Smartcard No', 'Depends upon CAS', 'Yes'],
      ['Box Id', 'Depends upon CAS', 'Yes']
    ];
    const workbook = new Excel.Workbook();

    // First sheet setup
    const sheet1 = workbook.addWorksheet('Sheet1');
    const headerRow1 = sheet1.addRow(ws1Header);
    headerRow1.eachCell((cell) => {
      applyHeaderStyle(cell, '326D41');
    });
    headerRow1.height = 20; // Set the height for the first header row


    const sheet2 = workbook.addWorksheet('Sheet2');
    sheet2.mergeCells('A1:C1');
    sheet2.getCell('A1').value = 'Subscriber Create Only';
    applyHeaderStyle(sheet2.getCell('A1'), '326D41');


    const headerRow2 = sheet2.addRow(ws2SubHeader);
    headerRow2.eachCell((cell) => {
      applyHeaderStyle(cell, '201065');
    });
    headerRow2.height = 20;


    const startRow = 2;
    values1.forEach((row, index) => {
      const rowData = sheet2.addRow([...row]);
      rowData.eachCell((cell, colNumber) => {
        if (colNumber === 3) {
          cell.font = {
            color: { argb: cell.value === 'Yes' ? '10A715' : 'EF0D15' },
            bold: true
          };
        }
        applyCellBorder(cell);
      });
    });


    sheet2.mergeCells('E1:G1');
    sheet2.getCell('E1').value = 'Subscriber Create and Allocate to Subscriber';
    applyHeaderStyle(sheet2.getCell('E1'), '326D41');
    const headerRow3 = sheet2.getRow(2);
    headerRow3.getCell(5).value = ws2SubHeader[0];
    headerRow3.getCell(6).value = ws2SubHeader[1];
    headerRow3.getCell(7).value = ws2SubHeader[2];
    headerRow3.eachCell((cell) => {
      applyHeaderStyle(cell, '201065');
    });
    headerRow3.height = 20;
    values2.forEach((row, index) => {
      let valueRow = sheet2.getRow(index + 3);
      valueRow.getCell(5).value = row[0];
      valueRow.getCell(6).value = row[1];
      valueRow.getCell(7).value = row[2];

      const mandatoryCell = valueRow.getCell(7);

      mandatoryCell.font = {
        color: { argb: row[2] === 'Yes' ? '10A715' : 'EF0D15' },
        bold: true
      };
      applyCellBorder(mandatoryCell);
    });

    sheet1.columns = ws1Header.map(() => ({ width: 20 }));
    [1, 2, 3, 5, 6, 7].forEach((colNum) => {
      sheet2.getColumn(colNum).width = 30;
    });

    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Subscriber Import.xlsx');

    // Helper functions
    function applyHeaderStyle(cell: Excel.Cell, color: string) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      applyCellBorder(cell);
    }

    function applyCellBorder(cell: Excel.Cell) {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }
  async generateActivationExcel() {
    const header = ['Smartcard (Mandatory)', 'Box ID (Non-Mandatory)'];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '326D41' },
      };
      cell.font = {
        color: { argb: 'FFFFFF' },
        bold: true,
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;

    headerRow.height = 30;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Bulk Box Activation.xlsx');
    });
  }

  async generateDeactivationExcel() {
    const header = ['Smartcard (Mandatory)', 'Box ID (Non-Mandatory)'];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '326D41' },
      };
      cell.font = {
        color: { argb: 'FFFFFF' },
        bold: true,
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;

    headerRow.height = 30;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Bulk Box Deactivation.xlsx');
    });
  }
  async generatealacarteactivationExcel() {
    const header = ['Smartcard (Mandatory)', 'Box ID (Non-Mandatory)'];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '326D41' },
      };
      cell.font = {
        color: { argb: 'FFFFFF' },
        bold: true,
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;

    headerRow.height = 30;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Bulk Alacarte Activation.xlsx');
    });
  }



  async generateIMAGEExcel(areatitle: string, headers: any, dataRow: any[], titles: any, cellSize: any, areasub: any, sub: any) {
    const subtitle = sub;
    const title = titles;
    const header = headers;

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    //==========TITLE=============
    const titleRow = worksheet.addRow([title]);
    titleRow.font = {
      family: 4,
      size: 16,
      color: { argb: 'FFFFFF' },
      bold: true,
    };
    titleRow.alignment = { horizontal: 'center' };
    titleRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '34495e' },
        bgColor: { argb: '34495e' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    worksheet.mergeCells(areatitle);

    //==========SUBTITLE=============
    const subtitleRow = worksheet.addRow([subtitle]);
    subtitleRow.font = {
      family: 4,
      size: 12,
      color: { argb: '000000' },
      bold: true,
    };
    subtitleRow.height = 20;
    subtitleRow.alignment = { horizontal: 'center' };
    subtitleRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'b2b2b2' },
        bgColor: { argb: 'b2b2b2' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    worksheet.mergeCells(areasub);

    //==========COLUMN HEADERS============
    const headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    headerRow.eachCell((cell: any, number: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '333333' }, // Adjusted color
        bgColor: { argb: '333333' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    //==========DATA ROWS=============
    dataRow.forEach((d) => {
      const row = worksheet.addRow(d);
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.height = 20;
      row.eachCell((cell: any) => {
        cell.border = {
          // top: { style: 'thin' },
          left: { style: 'thin' },
          // bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    worksheet.columns = [
      { key: 'a', width: 20 }, // LCO Name
      { key: 'b', width: 20 }, // Customer Name
      { key: 'c', width: 25 }, // Smartcard
      { key: 'd', width: 18 }, // Box ID
      { key: 'e', width: 30 }, // Address
      { key: 'f', width: 15 }, // Mobile No
      { key: 'g', width: 30 }, // Package Name
      { key: 'h', width: 25 }, // Expiry Date
      { key: 'i', width: 25 }, // Activation Date
    ];

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, titles + '.xlsx');
    });
  }

}
