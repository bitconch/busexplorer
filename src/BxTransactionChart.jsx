import React from "react";
import BxDateTime from "./BxDateTime";
import {Bar} from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

const barChartOptions = {
    // Y/X轴的颜色
    scaleLineColor: "rgba(47,79,79,.05)",
    // X,Y轴的宽度
    scaleLineWidth: 1,
    // 刻度是否显示标签, 即Y轴上是否显示文字
    scaleShowLabels: false,
    // 是否显示网格
    scaleShowGridLines: true,
    backgroundColor:"rgba(47,79,79,.05)",
    // 网格颜色
    scaleGridLineColor: "rgba(47,79,79,.05)",
    // 网格宽度
    scaleGridLineWidth: 1,
    //Bar Chart图表特定参数：
    //是否绘制柱状条的边框
    barShowStroke : true,
    //柱状条边框的宽度
    barStrokeWidth : 2,
    //柱状条组之间的间距(过大或过小会出现重叠偏移错位的效果，请控制合理数值)
    barValueSpacing :5,
    //每组柱状条组中柱状条之间的间距
    barDatasetSpacing :5,
    // 动画的特效
    animationEasing: "easeOutQuart",
};

class BxTransactionChart extends React.Component {
  render() {
    const {classes, txnStats} = this.props;
    if (_.size(txnStats) === 0) {
      return (
        <Paper className={classes.transChart}>
          <Typography className={classes.dataTableCellTitle}>No Data Present - Loading...</Typography>
        </Paper>
      );
    }

    let theLabels = _.keys(txnStats).map(x =>
      BxDateTime.formatDateTime(x, {
        style: BxDateTime.ISO8601_FMT,
        local: true,
      }),
    );
    let theData = _(txnStats).values().map(x => parseInt(x || "0")).value();
    let data = {
      labels: theLabels,
      datasets: [{
        label: "每分钟交易数",
        data: theData,
        backgroundColor: "#00d1d1",
        borderColor: '#00d1d1',
      }]
    };

    barChartOptions.scales = {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: `时间段: ${theLabels[0]} 至 ${theLabels[theLabels.length - 1]}`,
        },
        ticks: {
          callback: x => {
            return x.split(' ').pop();
          },
        },
      }]
    };

    return (
      <Grid container justify="center" className={classes.transChart}>
        <Paper className={classes.dataStyle}>
            <Bar data={data} options={barChartOptions}/>
        </Paper>
      </Grid>
    );
  }
}
export default BxTransactionChart;
