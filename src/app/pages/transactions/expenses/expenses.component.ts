import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

import { Expense, ExpenseChart } from 'src/app/core/data/expense';

import { AggregateService } from 'src/app/core/services/aggregate.service';
import { ExpenseService } from 'src/app/core/services/expense.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit, AfterViewInit {

  @Input() isDashboard?: boolean;
  @Input() data?: Expense[];
  @Input() chartData?: ExpenseChart[];

  expenses$: Subject<Expense[]> = new Subject();
  expenseChartData$: Subject<ExpenseChart[]> = new Subject();
  chartXAxisLabels: string[];
  chartYAxisLabels = 'Expense';
  chartDataSource: number[];
  currentRange: { from: Date; to: Date } = { from: new Date('2021-07-01T00:00:00.000Z'), to: new Date('2021-07-31T00:00:00.000Z') };
  currentRangeYear: number;
  categories: string[];
  expenses: Expense[] = [];
  expensesData: Expense[] = [];

  constructor(private expenseService: ExpenseService,
    private aggregateService: AggregateService) { }

  ngOnInit() {
    this.listenForUpdates$();
  }

  ngAfterViewInit() {
    // if (this.isDashboard && this.data) {
      this.loadData();
    // }
  }

  doRefresh(event) {
    this.loadData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  loadData() {
    if (!this.isDashboard) {
      this.expenseService.fetchExpenseForDateRange(this.currentRange.from, this.currentRange.to).subscribe((data) => {
        this.getData(data);
      });
      this.loadCharts();
    } else {
      this.getData(this.data);
    }
  }

  loadCharts() {
    if (this.currentRange.from.getFullYear() === this.currentRangeYear) {
      return;
    }
    this.currentRangeYear = this.currentRange.from.getFullYear();
    this.chartDataSource = undefined;
    if (this.isDashboard) {
      this.formulateChartData(this.chartData as ExpenseChart[]);
      this.expenseChartData$.next(this.chartData as ExpenseChart[]);
      return;
    }
    this.aggregateService.getMonthlyExpense(this.currentRange).subscribe(data => {
      this.formulateChartData(data as ExpenseChart[]);
      this.expenseChartData$.next(data as ExpenseChart[]);
    });
  }

  getData(expenses: Expense[]) {
    this.categories = this.getDistinctCategories(expenses);
    this.expenses = expenses;
    this.expensesData = this.expenses;
    this.expenses$.next(expenses);
  }

  listenForUpdates$() {
    this.expenseService.listenToUpdates$().subscribe((updated: boolean) => {
      if (updated && !this.isDashboard) {
        this.loadData();
        this.loadCharts();
        this.expenseService.notifyUpdates$(false);
      }
    });
  }

  formulateChartData(data: ExpenseChart[]) {
    this.chartXAxisLabels = [];
    this.chartDataSource = [];
    data = _.orderBy(data, ['_id.month'], ['desc']);
    data.forEach(expenseChart => {
      this.chartXAxisLabels.push(`${expenseChart._id.month}/${expenseChart._id.year}`);
      this.chartDataSource.push(expenseChart.amount);
    });
  }

  getDistinctCategories(expenses: Expense[]) {
    const distinctCategories = _.uniq((_.map(expenses, 'category')));
    distinctCategories.splice(0, 0, 'All');
    return distinctCategories;
  }

  onEdit(expense: Expense) {

  }

  onDelete(expense: Expense) {

  }

}
