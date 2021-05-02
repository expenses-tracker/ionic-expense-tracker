import { Injectable } from '@angular/core';
import { Expense } from '../data/expense';
import { Income } from '../data/income';
import { ExpenseService } from './expense.service';
import { IncomeService } from './income.service';
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { UserDetailService } from './user-detail.service';
import { DatePipe } from '@angular/common';

export interface ExportExpense {
  from: Date;
  to: Date;
  incomes: Income[];
  expenses: Expense[];
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  workBook: Workbook;
  exportData: ExportExpense;

  constructor(
    private expense: ExpenseService,
    private income: IncomeService,
    private user: UserDetailService,
    private datePipe: DatePipe) { }

  workbook() {
    this.workBook = new Workbook();
  }

  setExportData(exportData: ExportExpense) {
    this.exportData = exportData;
  }

  fetchIncome(from: Date, to: Date) {
    return this.income.fetchIncomeForDateRange(from, to);
  }

  fetchExpense(from: Date, to: Date) {
    return this.expense.fetchExpenseForDateRange(from, to);
  }

  exportToXLS(exportModel: ExportExpense): Promise<any> {
    try {
      this.setExportData(exportModel);
      this.workbook();
      this.setWorkBookProperties();
    } catch (error) {
      return Promise.reject(`Unable to initialize workbook`);
    }
    return this.downloadWorkBook();
  }

  setWorkBookProperties() {
    this.workBook.creator = this.user.currentUser().fullName;
    this.workBook.lastModifiedBy = this.user.currentUser().fullName;
    this.workBook.created = new Date();
    this.workBook.modified = new Date();
    this.workBook.lastPrinted = new Date();
    const worksheet = this.workBook.addWorksheet('Transactions');
    // Add column headers and define column keys and widths
    // Note: these column structures are a workbook-building convenience only,
    // apart from the column width, they will not be fully persisted.
    worksheet.columns = [
      { header: 'Date', key: 'dated', width: 20 },
      { header: 'Description', key: 'description', width: 60 },
      { header: 'Payment Type', key: 'paymentType', width: 30 },
      { header: 'Income', key: 'income', width: 20 },
      { header: 'Amount', key: 'amount', width: 20 },
      { header: 'Household', key: 'household', width: 20 },
      { header: 'Travel', key: 'travel', width: 20 },
      { header: 'Bills', key: 'bills', width: 20 },
      { header: 'Outside Food', key: 'outsideFood', width: 20 },
      { header: 'Shopping', key: 'shopping', width: 20 },
      { header: 'Others', key: 'others', width: 20 },
    ];
  }

  addRowsToWorkSheet(worksheet: Worksheet) {
    this.exportData.incomes.forEach(income => {
      worksheet.addRow({
        dated: this.datePipe.transform(income.dated, 'yyyy-MM-dd'),
        description: income.description,
        paymentType: income.paymentType,
        income: income.amount
      });
    });
    this.exportData.expenses.forEach(expense => {
      worksheet.addRow(this.getExpenseWithCategoryForExcel(expense));
    });
  }

  getExpenseWithCategoryForExcel(expense: Expense) {
    const expenseObj: any = {
      dated: this.datePipe.transform(expense.dated, 'yyyy-MM-dd'),
      description: expense.description,
      paymentType: expense.paymentType,
      amount: expense.amount
    };
    switch (expense.category) {
      case 'Bills':
        expenseObj.bills = expense.amount;
        break;
      case 'Food/Snacks':
        expenseObj.outsideFood = expense.amount;
        break;
      case 'Household':
        expenseObj.household = expense.amount;
        break;
      case 'Travel':
        expenseObj.travel = expense.amount;
        break;
      case 'Shopping':
        expenseObj.shopping = expense.amount;
        break;
      default:
        expenseObj.others = expense.amount;
        break;
    }
    return expenseObj;
  }

  downloadWorkBook() {
    const fromDate = this.datePipe.transform(this.exportData.from, 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(this.exportData.to, 'yyyy-MM-dd');
    this.addRowsToWorkSheet(this.workBook.getWorksheet('Transactions'));
    return new Promise((resolve, reject) => {
      this.workBook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, `Expenses_${fromDate}_${toDate}`);
        resolve({});
      }).catch(err => reject(err));
    });
  }

  reset() {
    this.workBook = undefined;
    this.exportData = undefined;
  }
}
