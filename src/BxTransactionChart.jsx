import React from "react";
import BxDateTime from "./BxDateTime";
import {Line} from 'react-chartjs-2';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

const chartOptions = {
    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,
    scaleGridLineColor: "rgba(47,79,79,.05)",
    scaleGridLineWidth: 1,
    scaleShowHorizontalLines: true,
    scaleShowVerticalLines: true,
    bezierCurve: false,
    bezierCurveTension: 0.4,
    pointDot: true,
    pointDotRadius: 4,
    pointDotStrokeWidth: 1,
    pointHitDetectionRadius: 20,
    datasetStroke: true,
    datasetStrokeWidth: 2,
    datasetFill: true,
    offsetGridLines: false,
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
    const data = (canvas) => {
      const ctx = canvas.getContext("2d")
      const gradient = ctx.createLinearGradient(0,0,0,350);
      gradient.addColorStop(0,'rgba(255,135,67,0.5)');
      gradient.addColorStop(0.5,'rgba(255,135,67,0.25)');
      gradient.addColorStop(0.9,'rgba(255,135,67,0.05)');
      gradient.addColorStop(1,'rgba(255,135,67,0)');
      return {
          labels: theLabels,
          datasets: [{
              label: "每分钟交易数",
              data: theData,
              backgroundColor: gradient,
              pointBackgroundColor: '#FF5E0C',
              borderColor: '#FF5E0C',
          }]
      }
    }

    chartOptions.scales = {
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
            <Line data={data} options={chartOptions}/>
        </Paper>
      </Grid>
    );
  }
}
export default BxTransactionChart;
