import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

import { Income, IncomeChart } from 'src/app/core/data/income';

import { AggregateService } from 'src/app/core/services/aggregate.service';
import { IncomeService } from 'src/app/core/services/income.service';

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.scss'],
})
export class IncomesComponent implements OnInit, AfterViewInit {

  @Input() isDashboard?: boolean;
  @Input() data?: Income[];
  @Input() chartData?: IncomeChart[];

  incomes$: Subject<Income[]> = new Subject();
  incomeChartData$: Subject<IncomeChart[]> = new Subject();
  chartXAxisLabels: string[];
  chartYAxisLabels = 'Income';
  chartDataSource: number[];
  currentRange: { from: Date; to: Date } = { from: new Date('2021-07-01T00:00:00.000Z'), to: new Date('2021-07-31T00:00:00.000Z') };
  currentRangeYear: number;
  categories: string[];
  incomes: Income[] = [];
  incomesData: Income[] = [];

  constructor(private incomeService: IncomeService,
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
      this.incomeService.fetchIncomeForDateRange(this.currentRange.from, this.currentRange.to).subscribe((data) => {
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
      this.formulateChartData(this.chartData as IncomeChart[]);
      this.incomeChartData$.next(this.chartData as IncomeChart[]);
      return;
    }
    this.aggregateService.getMonthlyIncome(this.currentRange).subscribe(data => {
      this.formulateChartData(data as IncomeChart[]);
      this.incomeChartData$.next(data as IncomeChart[]);
    });
  }

  getData(incomes: Income[]) {
    this.categories = this.getDistinctCategories(incomes);
    this.incomes = incomes;
    this.incomesData = this.incomes;
    this.incomes$.next(incomes);
  }

  listenForUpdates$() {
    this.incomeService.listenToUpdates$().subscribe((updated: boolean) => {
      if (updated && !this.isDashboard) {
        this.loadData();
        this.loadCharts();
        this.incomeService.notifyUpdates$(false);
      }
    });
  }

  formulateChartData(data: IncomeChart[]) {
    this.chartXAxisLabels = [];
    this.chartDataSource = [];
    data = _.orderBy(data, ['_id.month'], ['desc']);
    data.forEach(incomeChart => {
      this.chartXAxisLabels.push(`${incomeChart._id.month}/${incomeChart._id.year}`);
      this.chartDataSource.push(incomeChart.amount);
    });
  }

  getDistinctCategories(incomes: Income[]) {
    const distinctCategories = _.uniq((_.map(incomes, 'category')));
    distinctCategories.splice(0, 0, 'All');
    return distinctCategories;
  }

  onEdit(income: Income) {

  }

  onDelete(income: Income) {

  }


}
