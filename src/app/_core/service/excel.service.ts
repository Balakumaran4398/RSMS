import * as XLSX from 'xlsx';
import *   as fs from 'file-saver';
import { Injectable } from '@angular/core';
// import { Workbook } from 'exceljs';
import * as Excel from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {

  async generateExcel() {
    const ws1Header = [
      'Cas Form Id', 'Cus Name First', 'Cus Name Last', 'Father Name', 'Date of Birth',
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
      ['Landline No', '', 'No'],
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
      ['Landline No', '', 'No'],
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
  async generateBulkPackageUpdationExcel() {
    const header = ['Smartcard'];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('sheet1');
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
   

    headerRow.height = 30;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Bulk Package Updation.xlsx');
    });
  }
  async generateInventoryUpload() {
    const header = ['Smartcard', 'Box ID','Chip ID','Model'];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
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
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(2).width = 30;

    headerRow.height = 30;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Inventory Upload.xls');
    });
  }
  async generateSmartcardRefreshExcel() {
    const header = ['Smartcard (Mandatory)'];
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
    headerRow.height = 30;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Bulk Smartcard Refresh.xlsx');
    });
  }
  async generateOpearateCreationExcel() {
     const ws1Header = ['LCO NAME', 'MOBILE', 'EMAIL', 'ADDRESS', 'AREA NAME', 'STATE', 'PINCODE', 'USER ID', 'PASSWORD', 'BUSINESS NAME'];
    const ws2SubHeader = ['Field Name', 'Data Format', 'Mandatory'];
    const values1 = [
      ['LCO NAME', 'String', 'Yes'],
      ['MOBILE NUMBER', '10-digit (should be unique)', 'Yes'],
      ['EMAIL', '', 'No'],
      ['ADDRESS', 'String', 'Yes'],
      ['AREA NAME', '', 'Yes'],
      ['STATE', '', 'Yes'],
      ['PINCODE', '6-digit', 'Yes'],
      ['USER ID', 'Minimum 6 Maximum 2', 'Yes'],
      ['PASSWORD', 'Minimum 6 Maximum 2', 'Yes'],
      ['BUSINESS NAME', '', 'No'],
    ];

    const workbook = new Excel.Workbook();

    // First sheet setup
    const sheet1 = workbook.addWorksheet('Sheet1');
    const headerRow1 = sheet1.addRow(ws1Header);
    headerRow1.eachCell((cell) => {
      applyHeaderStyle(cell, '326D41');
    });
    headerRow1.height = 20; 


    const sheet2 = workbook.addWorksheet('Sheet2');
    sheet2.mergeCells('A1:C1');
    sheet2.getCell('A1').value = 'OPERATOR CREATION';
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

 
    sheet1.columns = ws1Header.map(() => ({ width: 20 }));
    [1, 2, 3, 5, 6, 7].forEach((colNum) => {
      sheet2.getColumn(colNum).width = 30;
    });

    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Bulk Operator Creation.xlsx');

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
  async generateBaseChangeExcel(type: any) {
    const header = ['Smartcard (Mandatory) '];
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
    // worksheet.getColumn(2).width = 30;

    headerRow.height = 30;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      // fs.saveAs(blob, 'Bulk Active Base Change.xlsx');
      fs.saveAs(blob, `Bulk ${type}.xlsx`);

    });
  }
  async generatealacarteactivationExcel(type: any) {
    console.log(type);
    const header = type === 'carton_box'
      ? ['BOX ID (Mandatory)', 'CARTON BOX (Mandatory)']
      : ['SMARTCARD (Mandatory)', 'BOX ID (Non-Mandatory)'];

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
      fs.saveAs(blob, `Bulk ${type}.xlsx`);
    });
  }
  async generateChannelDetailsExcel() {
    const mainHeader = 'CHANNEL DETAIL REPORT'
    const header = ['TS ID', 'FREQUENCY', 'SERVICE NAME', 'SERVICE ID', 'PRODUCT ID', 'INRAMT', 'CATEGORY NAME', 'BROADCASTER NAME', 'CHANNEL TYPE NAME', 'DISTRIBUTOR NAME', 'CHANNEL STATUS'];
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');
    const headerMainRow = worksheet.addRow([mainHeader]);
    const headerRow = worksheet.addRow(header);
    worksheet.mergeCells('A1:K1');
    headerMainRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '013047' },
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
    headerMainRow.height = 30;

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

    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 30;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;

    headerRow.height = 30;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `Channel Details.xlsx`);
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
        fgColor: { argb: 'cce0d8' },
        bgColor: { argb: 'cce0d8' },
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
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 30 }, // LCO Name
      { key: 'c', width: 20 }, // Customer Name
      { key: 'd', width: 25 }, // Smartcard
      { key: 'e', width: 18 }, // Box ID
      { key: 'f', width: 30 }, // Address
      { key: 'g', width: 15 }, // Mobile No
      { key: 'h', width: 30 }, // Package Name
      { key: 'i', width: 25 }, // Expiry Date
      { key: 'j', width: 25 }, // Activation Date
    ];

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, titles + '.xlsx');
    });
  }


  async generateChannelExcel(areatitle: string, headers: any, dataRow: any[], titles: any,) {

    // const subtitle = sub;
    const title = titles;
    const header = headers;

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    //==========TITLE=============
    const titleRow = worksheet.addRow([title]);
    titleRow.font = {
      family: 4,
      size: 13,
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
    // const subtitleRow = worksheet.addRow([subtitle]);
    // subtitleRow.font = {
    //   family: 4,
    //   size: 12,
    //   color: { argb: '000000' },
    //   bold: true,
    // };
    // subtitleRow.height = 20;
    // subtitleRow.alignment = { horizontal: 'center' };
    // subtitleRow.eachCell((cell: any) => {
    //   cell.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: 'cce0d8' },
    //     bgColor: { argb: 'cce0d8' },
    //   };
    //   cell.border = {
    //     top: { style: 'thin' },
    //     left: { style: 'thin' },
    //     bottom: { style: 'thin' },
    //     right: { style: 'thin' },
    //   };
    // });
    // worksheet.mergeCells(areasub);

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
      // { key: 'a', width: 10 }, // S.NO
      { key: 'a', width: 25 }, // LCO Name
      { key: 'b', width: 25 }, // Customer Name
      { key: 'c', width: 25 }, // Smartcard
      { key: 'd', width: 25 }, // Box ID
      { key: 'e', width: 25 }, // Address
      { key: 'f', width: 30 }, // Mobile No
      { key: 'g', width: 30 }, // Package Name
      { key: 'h', width: 30 }, // Expiry Date
      { key: 'i', width: 30 }, // Activation Date
      { key: 'j', width: 30 }, // Activation Date
      { key: 'k', width: 30 }, // Activation Date
      { key: 'l', width: 25 }, // Activation Date
    ];

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, titles + '.xlsx');
    });
  }
  async generateSuspendBasedExcel(areatitle: string, headers: any, dataRow: any[], titles: any, areasub: any, sub: any) {

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
        fgColor: { argb: 'cce0d8' },
        bgColor: { argb: 'cce0d8' },
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
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 25 }, // LCO Name
      { key: 'c', width: 25 }, // Customer Name
      { key: 'd', width: 25 }, // Smartcard
      { key: 'e', width: 25 }, // Box ID
      { key: 'f', width: 25 }, // Address
      { key: 'g', width: 30 }, // Mobile No
      { key: 'h', width: 30 }, // Package Name
      { key: 'i', width: 30 }, // Expiry Date
      { key: 'j', width: 30 }, // Activation Date
      { key: 'k', width: 30 }, // Activation Date
      { key: 'l', width: 30 }, // Activation Date
      { key: 'm', width: 25 }, // Activation Date
    ];

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, titles + '.xlsx');
    });
  }

  async generatedAllServiceExcel(areatitle: string, headers: any, dataRow: any[], titles: any, areasub: any, sub: any) {

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
        fgColor: { argb: 'cce0d8' },
        bgColor: { argb: 'cce0d8' },
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
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 30 }, // smartcard
      { key: 'c', width: 30 }, // log date
      { key: 'd', width: 30 }, // action
      { key: 'e', width: 90 }, // remark

    ];

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, titles + '.xlsx');
    });
  }

  async generateIMAGEExcel1(areatitle: string, headers: any, dataRow: any[], titles: any, cellSize: any, areasub: any, sub: any) {
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
        // fgColor: { argb: 'b2b2b2' },
        // bgColor: { argb: 'b2b2b2' },
        fgColor: { argb: 'cce0d8' },
        bgColor: { argb: 'cce0d8' },
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
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 30 }, // LCO Name
      { key: 'c', width: 20 }, // Customer Name
      { key: 'd', width: 25 }, // Smartcard
      { key: 'e', width: 18 }, // Box ID
      { key: 'f', width: 30 }, // Address
      { key: 'g', width: 15 }, // Mobile No
      { key: 'h', width: 30 }, // Package Name
      { key: 'i', width: 25 }, // Expiry Date
      { key: 'j', width: 25 }, // Area id
      { key: 'k', width: 20 }, // Customer No
      { key: 'l', width: 20 }, // Activation Date
    ];

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, titles + '.xlsx');
    });
  }
  async generateDashboardSTBExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Helper to style and merge a row
    const styleAndMergeRow = (rowData: any, options: any, mergeArea: string) => {
      const row = worksheet.addRow([rowData]);
      row.font = options.font;
      row.alignment = options.alignment;
      row.height = options.height || undefined;

      row.eachCell((cell: any) => {
        cell.fill = options.fill;
        cell.border = options.border;
      });

      worksheet.mergeCells(mergeArea);
    };

    // Title
    styleAndMergeRow(titles, {
      font: { family: 4, size: 16, color: { argb: 'FFFFFF' }, bold: true },
      alignment: { horizontal: 'center' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '34495e' },
        bgColor: { argb: '34495e' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areatitle);

    // Subtitle
    styleAndMergeRow(sub, {
      font: { family: 4, size: 12, color: { argb: '000000' }, bold: true },
      alignment: { horizontal: 'center' },
      height: 20,
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cce0d8' },
        bgColor: { argb: 'cce0d8' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areasub);

    // Column Headers
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '333333' },
        bgColor: { argb: '333333' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data Rows
    dataRow.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.height = 20;
      row.eachCell((cell: any) => {
        cell.border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Columns
    worksheet.columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 20 }, // SUB ID
      { key: 'c', width: 30 }, // OPERATOR NAME
      { key: 'd', width: 23 }, // CUSTOMER NAME
      { key: 'e', width: 25 }, // SMARTCARD
      { key: 'f', width: 30 }, // BOX ID
      { key: 'g', width: 30 }, // CAS NAME
      { key: 'h', width: 30 }, // PRODUCT NAME
      { key: 'i', width: 20 }, // PRODUCT ID
      { key: 'j', width: 25 }, //ACTIVATION DATE
      { key: 'k', width: 25 }, // EXPIRY DATE
    ];

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `${titles}.xlsx`);
    });
  }

  async generateboxinlcoExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'a', width: 30 }, // OPERATOR NAME
      { key: 'b', width: 30 }, // OPERATOR ID
      { key: 'c', width: 20 }, // AMOUNT
      { key: 'd', width: 20 }, // REMARKS
      { key: 'e', width: 30 }, // TRANSACTION DATE 
      { key: 'f', width: 30 }, // OPERATION ADDRESS
      { key: 'g', width: 30 }, // CONTACT NUMBER

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'BOX IN LCO HAND'
    );
  }
  async generateboxinCustomerExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 30 }, // SMARTCARD
      { key: 'c', width: 20 }, // BOX ID
      { key: 'd', width: 20 }, // CAS 
      { key: 'e', width: 20 }, // ISALLOCATED
      { key: 'f', width: 20 }, // STATUS
      { key: 'g', width: 30 }, // OPERATOR NAME 
      { key: 'h', width: 25 }, // SUBSCRIBER NAME
      { key: 'i', width: 20 }, // SUBSCRIBER MOBILE NUMBER

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'BOX IN CUSTOMER HAND'
    );
  }
  async generateBasePackageExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 30 }, // SMARTCARD
      { key: 'c', width: 20 }, // BOX ID
      { key: 'd', width: 20 }, // CAS 
      { key: 'e', width: 20 }, // ISALLOCATED
      { key: 'f', width: 20 }, // STATUS
      { key: 'g', width: 30 }, // OPERATOR NAME 
      { key: 'h', width: 25 }, // SUBSCRIBER NAME
      { key: 'i', width: 20 }, // SUBSCRIBER MOBILE NUMBER

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'BASE PACKAGE REPORT'
    );
  }
  async generateAddonExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 30 }, // SMARTCARD
      { key: 'c', width: 30 }, // BOX ID
      { key: 'd', width: 20 }, // CAS 
      { key: 'e', width: 20 }, // ISALLOCATED
      { key: 'f', width: 20 }, // STATUS
      { key: 'g', width: 30 }, // OPERATOR NAME 
      { key: 'h', width: 25 }, // SUBSCRIBER NAME
      { key: 'i', width: 20 }, // SUBSCRIBER MOBILE NUMBER

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'ADDON PACKAGE'
    );
  }
  async generatePaychannelExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 30 }, // CHANNEL NAME
      { key: 'c', width: 20 }, // PRODUCT ID
      { key: 'd', width: 20 }, // SERVICE ID
      { key: 'e', width: 20 }, // CHANNEL RATE
      { key: 'f', width: 30 }, // CREATED DATE



    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'PAY CHANNEL'
    );
  }
  async generateFTAExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 30 }, // CHANNEL NAME 
      { key: 'c', width: 20 }, // PRODUCT ID
      { key: 'd', width: 20 }, // SERVICE ID
      { key: 'e', width: 20 }, // CHANNEL RATE
      { key: 'f', width: 20 }, //CREATED DATE


    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'FTA CHANNEL'
    );
  }
  async generateDashboardInventoryExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 20 }, // SMARTCARD
      { key: 'c', width: 30 }, // BOX ID
      { key: 'd', width: 20 }, // CAS 
      { key: 'e', width: 20 }, // ISALLOCATED
      { key: 'f', width: 20 }, // STATUS
      { key: 'g', width: 30 }, // OPERATOR NAME 
      { key: 'h', width: 25 }, // SUBSCRIBER NAME
      { key: 'i', width: 20 }, // SUBSCRIBER MOBILE NUMBER

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'BASE PACKAGE'
    );
  }
  async generateOperatorDashboardExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Helper to style and merge a row
    const styleAndMergeRow = (rowData: any, options: any, mergeArea: string) => {
      const row = worksheet.addRow([rowData]);
      row.font = options.font;
      row.alignment = options.alignment;
      row.height = options.height || undefined;

      row.eachCell((cell: any) => {
        cell.fill = options.fill;
        cell.border = options.border;
      });

      worksheet.mergeCells(mergeArea);
    };

    // Title
    styleAndMergeRow(titles, {
      font: { family: 4, size: 16, color: { argb: 'FFFFFF' }, bold: true },
      alignment: { horizontal: 'center' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '34495e' },
        bgColor: { argb: '34495e' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areatitle);

    // Subtitle
    styleAndMergeRow(sub, {
      font: { family: 4, size: 12, color: { argb: '000000' }, bold: true },
      alignment: { horizontal: 'center' },
      height: 20,
      fill: {
        type: 'pattern',
        pattern: 'solid',
        // fgColor: { argb: 'b2b2b2' },
        // bgColor: { argb: 'b2b2b2' },
        fgColor: { argb: 'cce0d8' },
        bgColor: { argb: 'cce0d8' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areasub);

    // Column Headers
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '333333' },
        bgColor: { argb: '333333' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data Rows
    dataRow.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.height = 20;
      row.eachCell((cell: any) => {
        cell.border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
    worksheet.columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 50 }, // CUSTOMER ID
      { key: 'c', width: 40 }, // SUBSCRIBER NAME
      { key: 'd', width: 25 }, // ADDRESS
      { key: 'e', width: 25 }, // MOBILE NO
      { key: 'f', width: 25 }, // SMARTCARD
      { key: 'g', width: 25 }, // MOBILE NO
      { key: 'h', width: 25 }, //SMARTCARD
      { key: 'i', width: 25 }, //BOXID
      { key: 'j', width: 20 }, //PACKAGE STATUS
      { key: 'k', width: 21 }, //ACTIVATION DATE
      { key: 'l', width: 21 }, //ACTIVATION DATE
    ];
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `${titles}.xlsx`);
    });
  }
  async generateTraiPackageBaseExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    // const maxLength = Math.max(...dataRow.map(row => row[6].length)); 
    // const columnWidth = Math.min(Math.max(maxLength + 2, 40), 60);
    const styleAndMergeRow = (rowData: any, options: any, mergeArea: string) => {
      const row = worksheet.addRow([rowData]);
      row.font = options.font;
      row.alignment = options.alignment;
      row.height = options.height || undefined;

      row.eachCell((cell: any) => {
        cell.fill = options.fill;
        cell.border = options.border;
      });

      worksheet.mergeCells(mergeArea);
    };

    // Title
    styleAndMergeRow(titles, {
      font: { family: 4, size: 16, color: { argb: 'FFFFFF' }, bold: true },
      alignment: { horizontal: 'center' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '34495e' },
        bgColor: { argb: '34495e' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areatitle);

    // Subtitle
    styleAndMergeRow(sub, {
      font: { family: 4, size: 12, color: { argb: '000000' }, bold: true },
      alignment: { horizontal: 'center' },
      height: 20,
      fill: {
        type: 'pattern',
        pattern: 'solid',
        // fgColor: { argb: 'b2b2b2' },
        // bgColor: { argb: 'b2b2b2' },
        fgColor: { argb: 'cce0d8' },
        bgColor: { argb: 'cce0d8' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areasub);

    // Column Headers
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '333333' },
        bgColor: { argb: '333333' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data Rows
    dataRow.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.height = 20;
      row.eachCell((cell: any) => {
        cell.border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
    worksheet.columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 30 }, // CHANNEL NAME PREVIOUS
      { key: 'c', width: 30 }, // CHANNEL NAME NEW
      { key: 'd', width: 40 }, // BROADCASTER NAME PREVIOUS
      { key: 'e', width: 40 }, // BROADCASTER NAME NEW
      { key: 'f', width: 30 }, // SERVICE ID PREVIOUS
      { key: 'g', width: 40 }, // SERVICE ID NEW
      { key: 'h', width: 40 }, // OLD PRODUCT ID
      { key: 'i', width: 30 }, // NEW PRODUCT ID
      { key: 'j', width: 30 }, // MRP PRE
      { key: 'k', width: 20 }, // MRP NEW
      { key: 'l', width: 30 }, // CREATED DATE

    ];
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `${titles}.xlsx`);
    });
  }

  async generatelcorechargeExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    // const maxLength = Math.max(...dataRow.map(row => row[6].length)); 
    // const columnWidth = Math.min(Math.max(maxLength + 2, 40), 60);
    const styleAndMergeRow = (rowData: any, options: any, mergeArea: string) => {
      const row = worksheet.addRow([rowData]);
      row.font = options.font;
      row.alignment = options.alignment;
      row.height = options.height || undefined;

      row.eachCell((cell: any) => {
        cell.fill = options.fill;
        cell.border = options.border;
      });

      worksheet.mergeCells(mergeArea);
    };

    // Title
    styleAndMergeRow(titles, {
      font: { family: 4, size: 16, color: { argb: 'FFFFFF' }, bold: true },
      alignment: { horizontal: 'center' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '34495e' },
        bgColor: { argb: '34495e' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areatitle);

    // Subtitle
    styleAndMergeRow(sub, {
      font: { family: 4, size: 12, color: { argb: '000000' }, bold: true },
      alignment: { horizontal: 'center' },
      height: 20,
      fill: {
        type: 'pattern',
        pattern: 'solid',
        // fgColor: { argb: 'b2b2b2' },
        // bgColor: { argb: 'b2b2b2' },
        fgColor: { argb: 'cce0d8' },
        bgColor: { argb: 'cce0d8' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areasub);

    // Column Headers
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '333333' },
        bgColor: { argb: '333333' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data Rows
    dataRow.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.height = 20;
      row.eachCell((cell: any) => {
        cell.border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
    worksheet.columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 30 }, // OPERATOR NAME
      { key: 'c', width: 30 }, // TRANSACTION GROUP TIME
      { key: 'd', width: 20 }, // LCO AMOUNT
      { key: 'e', width: 25 }, // OLD BALANCE
      { key: 'f', width: 25 }, // CURRENT BALANCE
      { key: 'g', width: 30 }, // TRANSACTION DATE 

    ];
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `${titles}.xlsx`);
    });
  }
  async generateExcelFile(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any,
    columns: any[],
    fileName: string
  ) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Helper to style and merge a row
    const styleAndMergeRow = (rowData: any, options: any, mergeArea: string) => {
      const row = worksheet.addRow([rowData]);
      row.font = options.font;
      row.alignment = options.alignment;
      row.height = options.height || undefined;

      row.eachCell((cell: any) => {
        cell.fill = options.fill;
        cell.border = options.border;
      });

      worksheet.mergeCells(mergeArea);
    };

    // Title
    styleAndMergeRow(titles, {
      font: { family: 4, size: 16, color: { argb: 'FFFFFF' }, bold: true },
      alignment: { horizontal: 'center' },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '34495e' },
        bgColor: { argb: '34495e' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areatitle);

    // Subtitle
    styleAndMergeRow(sub, {
      font: { family: 4, size: 12, color: { argb: '000000' }, bold: true },
      alignment: { horizontal: 'center' },
      height: 20,
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cce0d8' },
        bgColor: { argb: 'cce0d8' },
      },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    }, areasub);

    // Column Headers
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '333333' },
        bgColor: { argb: '333333' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data Rows
    dataRow.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.height = 20;
      row.eachCell((cell: any) => {
        cell.border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    worksheet.columns = columns;
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `${fileName}.xlsx`);
    });
  }

  async generateBouquetExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 25 }, //SMARTCARD
      { key: 'c', width: 21 }, // BOXID
      { key: 'd', width: 28 }, // PRODUCT ID
      { key: 'e', width: 25 }, //PRODUCT NAME
      { key: 'f', width: 25 }, // LOG DATE
      { key: 'g', width: 25 }, // ACTIVATION DATE
      { key: 'h', width: 25 },// EXPIRY DATE
      { key: 'i', width: 25 },// ACTIVITY
      { key: '', width: 25 }, // STATUS
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'BOUQUET ALACARTE'
    );
  }
  async generateRetailerExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 25 }, //Balance
      { key: 'b', width: 21 }, // MOBILE NUMBER
      { key: 'c', width: 20 }, // RETAILER ID
      { key: 'd', width: 30 }, //RETAILER NAME
      { key: 'e', width: 25 }, // STATUS 
      { key: 'f', width: 20 }, // USERNAME

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'RETAILER '
    );
  }
  async generateComboExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 35 }, //Balance
      { key: 'b', width: 35 }, // MOBILE NUMBER
      { key: 'c', width: 35 }, // RETAILER ID
      { key: 'd', width: 35 }, //RETAILER NAME
      { key: 'e', width: 35 }, // STATUS 
      { key: 'f', width: 20 }, // USERNAME

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'Combo'
    );
  }
  async generateBaseSubscriptionExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {


    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 15 }, // SUB ID 
      { key: 'c', width: 15 }, // OPERATOR ID 
      { key: 'd', width: 25 }, // CUSTOMER NAME
      { key: 'e', width: 25 }, // Smartcard
      { key: 'f', width: 25 }, // Box ID
      { key: 'g', width: 30 }, // Package
      { key: 'h', width: 20 }, // Product id
      { key: 'i', width: 30 }, // Subscription start date
      { key: 'j', width: 30 }, // Subscription end date
    ];

    // ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'Base Subscription'
    );
  }
  async generateWeeklySubscriptionExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 20 }, //CUSTOMER NAME
      { key: 'b', width: 25 }, // SMARTCARD
      { key: 'c', width: 20 }, // BOXID
      { key: 'd', width: 20 }, //CAS
      { key: 'e', width: 25 }, // PACKAGE 
      { key: 'f', width: 20 }, // PRODUCT ID
      { key: 'g', width: 20 }, // TYPE
      { key: 'h', width: 35 }, // SUBSCRIPTION START DATE
      { key: 'i', width: 35 }, // SUBSCRIPTION END DATE

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'Weekly Subscription'
    );
  }
  async generateNotExpiryExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 20 }, //CUSTOMER NAME
      { key: 'b', width: 25 }, // Subcriber name
      { key: 'c', width: 20 }, // address
      { key: 'd', width: 20 }, // mobile no
      { key: 'e', width: 30 }, // smartcard 
      { key: 'f', width: 20 }, // box id
      { key: 'g', width: 20 }, // package status
      { key: 'h', width: 35 }, // expiry date

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'Not Expiry'
    );
  }
  async generateBoxinhandExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 30 }, //smartcard
      { key: 'b', width: 30 }, // box id
      { key: 'c', width: 30 }, //cas
      { key: 'd', width: 30 }, // allocatio date
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'Box in hand'
    );
  }
  async generateAddonSubscriptionExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 30 }, // OPERATOR NAME
      { key: 'b', width: 20 }, // CUSTOMER NAME
      { key: 'c', width: 30 }, // SMARTCARD
      { key: 'd', width: 20 }, // BOX ID
      { key: 'e', width: 30 }, // PACKAGE 
      { key: 'f', width: 15 }, // PROCUCT ID
      { key: 'g', width: 30 }, // SUBSCRIPTION START DATE
      { key: 'h', width: 30 }, // SUBSCRIPTION END DATE

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'Addon Subscription'
    );
  }
  async generateAlacarteSubscriptionExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 30 }, // SMARTCARD
      { key: 'b', width: 25 }, // BOX ID
      { key: 'c', width: 35 }, // PRODUCT ID
      { key: 'd', width: 30 }, // PRODUCT NAME
      { key: 'e', width: 35 }, // ACTIVATION DATE
      { key: 'f', width: 35 }, // EXPIRY DATE
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'Alacarte Subscription'
    );
  }
  async generateAllTypesExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 20 }, // SUB ID
      { key: 'c', width: 30 }, // OPERATOR NAME
      { key: 'd', width: 30 }, // CUSTOMER NAME
      { key: 'e', width: 30 }, // SMARTCARD
      { key: 'f', width: 30 }, // BOX ID
      { key: 'g', width: 15 }, // CAS
      { key: 'h', width: 25 }, // PACKAGE
      { key: 'i', width: 20 }, // PRODUCT ID
      { key: 'j', width: 20 }, // PRODUCT TYPE
      { key: 'k', width: 30 }, // SUBSCRIPTION START DATE
      { key: 'l', width: 30 }, // SUBSCRIPTION END DATE
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'All Types Subscription'
    );
  }
  async generateTotalSmartcardExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 20 }, // Customer ID
      { key: 'c', width: 25 }, // Customer Name
      { key: 'd', width: 15 }, // CAS FORM ID
      { key: 'e', width: 15 }, // MOBILE NO
      { key: 'f', width: 30 }, // ADDRESS
      { key: 'g', width: 30 }, // INSTALL ADDRESS
      { key: 'h', width: 35 }, // EMAIL
      { key: 'i', width: 20 }, // LANDLINE NO
      { key: 'j', width: 30 }, // SMARTCARD
      { key: 'k', width: 25 }, // BOXID
      { key: 'l', width: 15 }, // STATUS
      { key: 'm', width: 30 }, // CREATED DATE
      { key: 'n', width: 20 }, // USER NAME
      { key: 'o', width: 20 }, // PASSWORD
      { key: 'p', width: 20 }, // APP LOCK STATUS
      { key: 'q', width: 25 }, // PACKAGE NAME
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'TOTAL SMARTCARD'
    );
  }
  async generateBlockExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 25 }, // OPERATOR NAME
      { key: 'c', width: 25 }, // SUBSCRIBER ID
      { key: 'd', width: 25 }, // SUBSCRIBER NAME
      { key: 'e', width: 20 }, // MOBILE NO
      { key: 'f', width: 30 }, // SMARTCARD
      { key: 'g', width: 15 }, // BOX ID
      { key: 'h', width: 15 }, // CAS
      { key: 'i', width: 20 }, // PACKAGE ID
      { key: 'j', width: 20 }, // PRODUCT NAME
      { key: 'k', width: 30 }, // EXPIRY DATE
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'BLOCK LIST HISTORY REPORT'
    );
  }
  async generatePairedExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 20 }, // SUBSCRIBER ID
      { key: 'c', width: 30 }, // SUBSCRIBER NAME
      { key: 'd', width: 30 }, // SMARTCARD
      { key: 'e', width: 30 }, // BOXID
      { key: 'f', width: 30 }, // ADDRESS
      { key: 'g', width: 30 }, // INSTALL DATE

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'PAIRED BOX AND SMARTCARD REPORT'
    );
  }
  async generateAllServiceExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 30 }, // SMARTCARD
      { key: 'c', width: 30 }, // LOG DATE
      { key: 'd', width: 20 }, // ACTION
      { key: 'e', width: 100 }, // REMARKS


    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'ALL SERVICE LIST REPORT'
    );
  }
  async generateScrollExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 25 }, // INTEND ID
      { key: 'c', width: 25 }, // INTENT TO
      { key: 'd', width: 25 }, // MESSAGE
      { key: 'e', width: 20 }, // FONT COLOR
      { key: 'f', width: 25 }, // BACKGROUND COLOR
      { key: 'g', width: 15 }, // FONT SIZE
      { key: 'h', width: 15 }, // POSITION
      { key: 'i', width: 20 }, // REPEAT FOR
      { key: 'j', width: 30 }, // CREATED DATE

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'SCROLL HISTORY REPORT'
    );
  }
  async generateMailExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 30 }, // INTEND ID
      { key: 'c', width: 15 }, // INTENT TO
      { key: 'd', width: 25 }, // TITLE
      { key: 'e', width: 20 }, // SENDER
      { key: 'f', width: 25 }, // MESSAGE
      { key: 'g', width: 30 }, // SEND DATE
      { key: 'h', width: 30 }, // EXPIRY DATE
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'MAIL HISTORY REPORT'
    );
  }
  async generatFingerprintExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 25 }, //  ID
      { key: 'c', width: 25 }, //  Message
      { key: 'd', width: 20 }, // POSITION
      { key: 'e', width: 25 }, // FONT COLOR
      { key: 'f', width: 35 }, // BACKGROUNT COLOR
      { key: 'g', width: 20 }, // FONT SIZE
      { key: 'h', width: 30 }, //  DATE
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'FINGER PRINT HISTORY'
    );
  }
  async generatMessageExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 25 }, // INTEND ID
      { key: 'c', width: 15 }, // INTENT TO
      { key: 'd', width: 30 }, // MESSAGE
      { key: 'e', width: 20 }, // FONT COLOR
      { key: 'f', width: 30 }, // BACKGROUND COLOR
      { key: 'g', width: 20 }, // REPEAT FOR
      { key: 'h', width: 20 }, // TRANSPARANCY	
      { key: 'i', width: 20 }, // DURATION
      { key: 'j', width: 20 }, // TIME GAP	
      { key: 'k', width: 20 }, // CAS
      { key: 'l', width: 30 }, // SEND DATE
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'MESSAGE HISTORY REPORT'
    );
  }
  async generatNetworkSmartcardStatusExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 20 }, // ACTIVE
      { key: 'c', width: 20 }, // DEACTIVE
      { key: 'd', width: 20 }, // TOTAL
      { key: 'e', width: 35 }, // ACTIVE SUBSCRIPTION
      { key: 'f', width: 35 }, // DEACTIVE SUBSCRIPTION
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'NETWORK SMARTCARD STATUS COUNT'
    );
  }
  async generatNetworkOperatorwiseSmartcardStatusExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 30 }, // OPERATOR
      { key: 'c', width: 20 }, // ACTIVE
      { key: 'd', width: 20 }, // DEACTIVE
      // { key: 'e', width: 20 }, // TOTAL
      { key: 'e', width: 35 }, // ACTIVE SUBSCRIPTION
      { key: 'f', width: 35 }, // DEACTIVE SUBSCRIPTION
      { key: 'g', width: 25 }, // BLOCK
    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'OPERATORWISE NETWORK SMARTCARD STATUS COUNT'
      // ''
    );
  }
  async generatSmartcardSuspendExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 25 }, // CUSTOMER NAME	
      { key: 'c', width: 20 }, // MOBILE NO	
      { key: 'd', width: 30 }, // SMARTCARD	
      { key: 'e', width: 20 }, // BOX ID	
      { key: 'f', width: 20 }, // CAS
      { key: 'g', width: 30 }, // PACKAGE
      { key: 'h', width: 35 }, // SUBSCRIPTION END DATE

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'SMARTCARD SUSPEND REPORT'
    );
  }
  async generatSmartcardSuspendDurationExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 25 }, // CUSTOMER NAME	
      { key: 'c', width: 20 }, // MOBILE NO	
      { key: 'd', width: 30 }, // SMARTCARD	
      { key: 'e', width: 20 }, // BOX ID	
      { key: 'f', width: 20 }, // CAS
      { key: 'g', width: 30 }, // PACKAGE
      { key: 'h', width: 35 }, // SUBSCRIPTION END DATE

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'SUSPEND REPORT FOR PARTICULAR DURATION'
    );
  }
  async generatSuspendExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 20 }, // CUSTOMER NAME	
      { key: 'c', width: 18 }, // MOBILE NO	
      { key: 'd', width: 25 }, // SMARTCARD	
      { key: 'e', width: 15 }, // STATUS
      { key: 'f', width: 22 }, // SUSPEND DATE	
      { key: 'g', width: 22 }, // RESUME DATE	
      { key: 'h', width: 25 }, // OLD EXPIRY DATE
      { key: 'i', width: 25 }, // NEW EXPIRY DATE
      { key: 'j', width: 18 }, // REMAINING DAYS
      { key: 'k', width: 15 }, // CAS
      { key: 'l', width: 30 }, // PACKAGE

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'DATE WISE SMARTCARD SUSPEND'
    );
  }
  async generatUniversalExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 15 }, // S.NO
      { key: 'b', width: 20 }, // PACKAGE ID
      { key: 'c', width: 30 }, // PACKAGE NAME
      { key: 'd', width: 15 }, // CAS
      { key: 'e', width: 20 }, // AS ON 07th
      { key: 'f', width: 20 }, // AS ON 14th
      { key: 'g', width: 20 }, // AVERAGE
      { key: 'h', width: 25 }, // MONTH & YEAR

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'Over All Base / Universal Count Report'
    );
  }
  async generateRechargeExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 30 }, // OPERATOR NAME
      { key: 'c', width: 30 }, // TRANSACTION GROUP TIME
      { key: 'd', width: 20 }, // LCO AMOUNT
      { key: 'e', width: 25 }, // OLD BALANCE
      { key: 'f', width: 25 }, // CURRENT BALANCE
      { key: 'g', width: 30 }, // TRANSACTION DATE 

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'LCO RECHARGE REPORT'
    );
  }
  generateLCO_dateRechargeExcel(
    header: string[],
    datas: any[],
    title: string,
    sub: string,
    totalRow: any[]
  ) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Recharge Report');

    // Title Row
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { bold: true, size: 17, color: { argb: 'FFFFFF' } };
    titleRow.alignment = { horizontal: 'center' };
    titleRow.height = 30;
    titleRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '34495e' },
      };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true };
    });
    worksheet.mergeCells(`A1:H1`);
    // Subtitle Row
    const subTitleRow = worksheet.addRow([sub]);
    subTitleRow.font = { bold: true, size: 15, color: { argb: 'FFFFFF' } };
    subTitleRow.alignment = { horizontal: 'center' };
    subTitleRow.height = 25;
    subTitleRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cce0d8' },
      };
      cell.font = { color: { argb: '000000' }, bold: true };
    });
    worksheet.mergeCells(`A2:H2`);
    // Header Row
    const headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true, size: 13, color: { argb: 'FFFFFF' } };
    headerRow.height = 23;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2c2e2d' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    datas.forEach((rowData) => {
      const row = worksheet.addRow(rowData);
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.height = 20;
      row.eachCell((cell: any) => {
        cell.border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
    // Total Row
    const totalRowIndex = worksheet.addRow(totalRow);
    totalRowIndex.eachCell((cell, colNumber) => {
      if (colNumber === 7 || colNumber === 8) {
        totalRowIndex.height = 20;
        totalRowIndex.alignment = { vertical: 'middle', horizontal: 'center' };
        totalRowIndex.font = { bold: true, size: 13, color: { argb: 'FFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '016b4d' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { color: { argb: 'FFFFFF' }, bold: true };
      }
    });

    // Set Column Widths
    worksheet.columns = [
      { key: 'a', width: 10 }, // S.NO
      { key: 'b', width: 30 }, // OPERATOR NAME
      { key: 'c', width: 20 }, // OPERATOR ID
      { key: 'd', width: 15 }, // AMOUNT
      { key: 'e', width: 20 }, // REMARKS
      { key: 'f', width: 25 }, // TRANSACTION DATE
      { key: 'g', width: 50 }, // OPERATION ADDRESS
      { key: 'h', width: 25 }, // CONTACT NUMBER
    ];

    // Save the file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `${title}.xlsx`);
    });
  }
  async generateLCO_monthRechargeExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 30 }, // OPERATOR NAME
      { key: 'b', width: 30 }, // OPERATOR ID
      { key: 'c', width: 20 }, // AMOUNT
      { key: 'd', width: 20 }, // REMARKS
      { key: 'e', width: 30 }, // TRANSACTION DATE 
      { key: 'f', width: 30 }, // OPERATION ADDRESS
      { key: 'g', width: 30 }, // CONTACT NUMBER

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'MONTHWISE LOG RECHARGE REPORT'
    );
  }
  async generateLCO_yearRechargeExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    titles: any,
    areasub: any,
    sub: any
  ) {
    const columns = [
      { key: 'a', width: 30 }, // OPERATOR NAME
      { key: 'b', width: 30 }, // OPERATOR ID
      { key: 'c', width: 20 }, // AMOUNT
      { key: 'd', width: 20 }, // REMARKS
      { key: 'e', width: 30 }, // TRANSACTION DATE 
      { key: 'f', width: 30 }, // OPERATION ADDRESS
      { key: 'g', width: 30 }, // CONTACT NUMBER

    ];
    await this.generateExcelFile(
      areatitle,
      headers,
      dataRow,
      titles,
      areasub,
      sub,
      columns,
      'YEARWISE LOG RECHARGE REPORT'
    );
  }
  // --------------------------------Syncronization--------------------
  async generateSynchronizationExcel(
    areatitle: string,
    headers: any,
    dataRow: any[],
    title: string,
    areasub: string,
    subtitle: string,
    additionalSubheaders: any
  ) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    //========== TITLE ==========
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
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    worksheet.mergeCells(areatitle);

    //========== SUBTITLE ==========
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
        fgColor: { argb: 'cce0d8' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    worksheet.mergeCells(areasub);

    //========== ADDITIONAL SUBHEADERS ==========
    const subheaderValues = [
      `From Date: ${additionalSubheaders['From Date']}`,
      `To Date: ${additionalSubheaders['To Date']}`,
      `Package Type: ${additionalSubheaders['Package Type']}`,
    ];
    const subheaderRow = worksheet.addRow(subheaderValues);
    subheaderRow.font = {
      family: 4,
      size: 12,
      color: { argb: '000000' },
      bold: false,
    };
    subheaderRow.height = 20;
    subheaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
    subheaderRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8f8f5' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.columns = [
      { width: 30 }, // From Date column
      { width: 30 }, // To Date column
      { width: 30 }, // Package Type column
      { width: 30 }, // Package Type column
      { width: 30 }, // Package Type column
      { width: 30 }, // Package Type column
      { width: 20 }, // Package Type column
    ];

    //========== COLUMN HEADERS ==========
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '333333' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    //========== DATA ROWS ==========
    dataRow.forEach((d) => {
      const row = worksheet.addRow(d);
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.height = 20;
      row.eachCell((cell: any) => {
        cell.border = {
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `${title}.xlsx`);
    });
  }
  generateExcelReport(addonList: any[], alacarteList: any[], baseList: any[], title: string, sub: string) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Package Data');

    // Add title and subtitle
    worksheet.mergeCells('A1:H1');
    worksheet.getCell('A1').value = title;
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2:H2');
    worksheet.getCell('A2').value = sub;
    worksheet.getCell('A2').font = { bold: true, size: 12 };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    let startRow = 4;

    // Add Addon List
    if (addonList.length) {
      console.log('addonList', addonList);

      worksheet.getRow(startRow).values = ['Addon List'];
      worksheet.getRow(startRow).font = { bold: true, size: 14 };
      startRow++;

      const addonHeader = ['S.NO', 'Customer Name', 'Mobile No', 'Smartcard', 'Box ID', 'CAS Name', 'Product Name', 'Created Date'];
      worksheet.addRow(addonHeader).eachCell((cell) => {
        cell.font = { bold: true };
      });
      addonList.forEach((item, index) => {
        worksheet.addRow([
          index + 1,
          item.customername,
          item.mobileno,
          item.smartcard,
          item.boxid,
          item.casname,
          item.productname,
          item.createddate,
        ]);
      });
      startRow += addonList.length + 2;
    }

    // Add Alacarte List
    if (alacarteList.length) {
      console.log('alacarteList', alacarteList);

      worksheet.getRow(startRow).values = ['Alacarte Package List'];
      worksheet.getRow(startRow).font = { bold: true, size: 14 };
      startRow++;

      const alacarteHeader = ['S.NO', 'Product Name', 'CAS Product ID', 'CAS Name'];
      worksheet.addRow(alacarteHeader).eachCell((cell) => {
        cell.font = { bold: true };
      });
      alacarteList.forEach((item, index) => {
        worksheet.addRow([
          index + 1,
          item.productname,
          item.casproductid,
          item.casname,
        ]);
      });
      startRow += alacarteList.length + 2;
    }

    // Add Base List
    if (baseList.length) {
      console.log('baselist', baseList);

      worksheet.getRow(startRow).values = ['Base Package List'];
      worksheet.getRow(startRow).font = { bold: true, size: 14 };
      startRow++;

      const baseHeader = ['S.NO', 'Product Name', 'CAS Product ID', 'CAS Name', 'W1', 'W2', 'W3', 'W4', 'Average', 'Month & Year'];
      worksheet.addRow(baseHeader).eachCell((cell) => {
        cell.font = { bold: true };
      });
      baseList.forEach((item, index) => {
        worksheet.addRow([
          index + 1,
          item.productname,
          item.casproductid,
          item.casname,
          item.w1,
          item.w2,
          item.w3,
          item.w4,
          item.avg,
          item.monthyear,
        ]);
      });
    }

    // Adjust column widths
    worksheet.columns.forEach((column) => {
      column.width = 20; // Adjust as necessary
    });

    // Save the Excel file
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Overall_Report.xlsx');
    });
  }

}
