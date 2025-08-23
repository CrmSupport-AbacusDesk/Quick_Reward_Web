import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExportexcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string, cat_no: any): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName, cat_no);
  }

  private saveAsExcelFile(buffer: any, fileName: string, cat_no: any): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    if (cat_no) {
      FileSaver.saveAs(data, cat_no + '-Excel' + EXCEL_EXTENSION);
    }
    else {
      FileSaver.saveAs(data, fileName + '-Excel' + EXCEL_EXTENSION);
    }
  }

}