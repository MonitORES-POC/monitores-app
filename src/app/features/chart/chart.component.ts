import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { PguService } from '@app/_services';
import { WebSocketService } from '@app/_services/web-socket.service';
import { EChartsOption } from 'echarts';
import { concatMap, Subject, takeUntil } from 'rxjs';

interface DataItem {
  name: string;
  value: [string, number];
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  chartOption: any;
  updateOptions: any;
  chartConstraintDate: Date;

  private oneMinute = 60 * 1000;
  private now!: Date;
  private measureData: any[] = [];
  private constraintData: any[] = [];
  private timer: any;

  constructor(
    private webSocketService: WebSocketService,
    private pguService: PguService
  ) {}

  ngOnInit(): void {
    this.webSocketService.outBufferEvent
      .pipe(
        takeUntil(this.destroy$),
        concatMap((updateDtoList) => {
          this.measureData = updateDtoList.map((u) => {
            return {
              name: u.measure.timeStamp,
              value: [
                new Date(u.measure.timeStamp).getTime(),
                u.measure.measuredPower ?? 0,
              ],
            };
          });
          this.constraintData = updateDtoList.map((u) => {
            if (u.constraint.powerLimit > 0) {
              const appTime = new Date(u.constraint.applicationTime).getTime();
              const measTime = new Date(u.measure.timeStamp).getTime();
              this.chartConstraintDate = new Date(u.constraint.applicationTime);
              const constraintDelay = 5 * 60 * 1000;
              if (
                measTime <= appTime + constraintDelay &&
                measTime >= appTime - constraintDelay
              ) {
                return {
                  name: u.measure.timeStamp,
                  value: [measTime, u.constraint.powerLimit],
                };
              }
            }
            return null;
          });
          this.updateOptions = {
            color:
              AppConstants.ChartColor[
                updateDtoList[updateDtoList.length - 1].statusId
              ],
            series: [
              {
                data: this.measureData,
              },
              {
                data: this.constraintData,
              },
            ],
          };
          return this.webSocketService.outUpdateEvent;
        })
      )
      .subscribe((res) => {
        if (this.pguService.currentPgu.value?.id === res.id) {
          let chartDate = new Date(res.measure.timeStamp);
          this.measureData.shift();
          this.measureData.push({
            name: chartDate.toString(),
            value: [chartDate.getTime(), res.measure.measuredPower],
          });
          if (res.constraint.powerLimit > 0) {
            this.chartConstraintDate = new Date(res.constraint.applicationTime);
            const constraintDelay = 5 * 60 * 1000;
            if (
              chartDate.getTime() <=
                this.chartConstraintDate.getTime() + constraintDelay &&
              chartDate.getTime() >=
                this.chartConstraintDate.getTime() - constraintDelay
            ) {
              this.constraintData.shift();
              this.constraintData.push({
                name: chartDate.toString(),
                value: [chartDate.getTime(), res.constraint.powerLimit],
              });
            } else {
              this.constraintData.shift();
              this.constraintData.push(null);
            }
          } else {
            this.constraintData.shift();
            this.constraintData.push(null);
          }
          // update series data:
          this.updateOptions = {
            color: AppConstants.ChartColor[res.statusId],
            series: [
              {
                data: this.measureData,
              },
              {
                data: this.constraintData,
              },
            ],
          };
        }
      });

    // initialize chart options:
    this.chartOption = {
      title: {
        text: 'PGU Power',
      },
      color: ['blue', 'red'],
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          params = params[0];
          const date = new Date(params.name);
          return (
            date.getDate() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getFullYear() +
            ' : ' +
            date.getHours() +
            'h' +
            date.getMinutes() +
            ' : ' +
            (Math.round(params.value[1] * 100) / 100).toFixed(2) +
            ' kW'
          );
        },
        axisPointer: {
          animation: false,
        },
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: true,
        },
        name: 'time',
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        name: 'power',
        splitLine: {
          show: true,
        },
        axisLabel: {
          formatter: function (val) {
            return val + ' kW';
          },
        },
      },
      /* visualMap: {
        show: false,
        dimension: 0,
        seriesIndex: 1,
        pieces: [
          {
            min: 0,
            max: this.chartConstraintDate !== undefined && this.chartConstraintDate !== null  ? this.chartConstraintDate.getTime() : 1659046658337,
            //lte: this.chartConstraintDate ? this.chartConstraintDate.getTime() : 1000000000000,
            color: 'yellow'
          },
          {
            min: this.chartConstraintDate !== undefined && this.chartConstraintDate !== null ? this.chartConstraintDate.getTime() : 1659046658337,
            color: 'red'
          },
        ]
      }, */
      series: [
        {
          name: 'PGU Measures',
          type: 'line',
          showSymbol: false,
          areaStyle: {},
          smooth: true,
          data: this.measureData,
        },
        {
          name: 'PGU Constraint',
          type: 'line',
          showSymbol: true,
          smooth: true,
          data: this.constraintData,
        },
      ],
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    clearInterval(this.timer);
  }

  generateZeros() {
    this.now = new Date(this.now.getTime() + this.oneMinute);
    return {
      name: this.now.toString(),
      value: [this.now.getTime(), 0],
    };
  }
}
