import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '@app/_services/web-socket.service';
import { EChartsOption } from 'echarts';

interface DataItem {
  name: string;
  value: [string, number];
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  chartOption: any;
  updateOptions: any;

  private oneMinute = 60 * 1000;
  private now!: Date;
  private data!: any[];
  private timer: any;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.data = [];
    this.now = new Date();
    this.now = new Date(this.now.getTime() - 503*this.oneMinute);

    for (let i = 0; i < 500; i++) {
      this.data.push(this.generateZeros());
    }
    this.webSocketService.outUpdateEvent.subscribe(res => {
      let chartDate = new Date(res.timeStamp);
      this.data.shift();
      this.data.push({name: chartDate.toString(), value: [chartDate.getTime(), res.measuredPower]});
      // update series data:
      this.updateOptions = {
        series: [{
          data: this.data
        }]
      };
    });
    
    

    // initialize chart options:
    this.chartOption = {
      title: {
        text: 'PGU Power'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          params = params[0];
          const date = new Date(params.name);
          return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + date.getHours() + 'h' + date.getMinutes() + ' : ' + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [{
        name: 'PGU Measures',
        type: 'line',
        showSymbol: false,
        areaStyle: {},
        smooth: true,
        data: this.data
      }]
    };
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  generateZeros() {
    this.now = new Date(this.now.getTime() + this.oneMinute);
    return {
      name: this.now.toString(),
      value: [
        this.now.getTime(),
        0
      ]
    };
  }
}
