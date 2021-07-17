import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy } from 'lodash';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { DashboardData } from 'src/app/core/models/dashboard.model';

import { AggregateService } from 'src/app/core/services/aggregate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  dashboardData$: Observable<DashboardData>;
  chartXAxisLabels: string[];
  expensesChartDataSource: number[];
  incomesChartDataSource: number[];
  totalExpenses = 0;
  totalIncomes = 0;
  totalSavings = 0;
  currentRange: { from: Date; to: Date };

  constructor(private aggregateService: AggregateService,
    private router: Router) {}

  get absoluteSavingsValue() {
    return Math.abs(this.totalSavings);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.totalExpenses = 0;
    this.totalIncomes = 0;
    this.totalSavings = 0;
    // TODO: set the from and to date dynamically
    this.dashboardData$ = this.aggregateService.getDashboardData(
      { from: new Date('2021-01-01T00:00:00.000Z'), to: new Date('2021-12-31T00:00:00.000Z') }
    ).pipe(map((data: DashboardData) => {
      if (data) {
        data.expenses.chart = orderBy(data.expenses.chart, ['_id.month'], ['desc']);
        data.incomes.chart = orderBy(data.incomes.chart, ['_id.month'], ['desc']);
        return data;
      }
      return data;
    }), tap(data => this.formulateChartData(data))) as Observable<DashboardData>;
  }

  formulateChartData(data: DashboardData) {
    this.chartXAxisLabels = [];
    this.expensesChartDataSource = [];
    this.incomesChartDataSource = [];
    data.expenses.chart.forEach(expenseChart => {
      this.chartXAxisLabels.push(`${expenseChart._id.month}/${expenseChart._id.year}`);
      this.expensesChartDataSource.push(expenseChart.amount);
      this.totalExpenses += expenseChart.amount;
    });
    data.incomes.chart.forEach(incomeChart => {
      this.incomesChartDataSource.push(incomeChart.amount);
      this.totalIncomes += incomeChart.amount;
    });
    this.totalSavings = this.totalIncomes - this.totalExpenses;
  }

  onExpensesClick() {
    this.router.navigate(['/tabs/transactions/expenses']);
  }

  onIncomesClick() {
    this.router.navigate(['/tabs/transactions/incomes']);
  }
}
