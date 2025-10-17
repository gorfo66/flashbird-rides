import {
  Chart,
  ChartConfiguration
} from "chart.js/auto"
import {
  Log
} from "../models"
import {
  interpolate
} from "./ride-helpers"

export const createCharts = (logs: Log[], interpolation: boolean, domElements: { speed: HTMLCanvasElement; tilt: HTMLCanvasElement }): { speed?: Chart; tilt?: Chart } => {

  const style = getComputedStyle(document.body);
  const output: { speed?: Chart; tilt?: Chart } = {};

  const lightDarkColor = style.getPropertyValue('--mat-sys-primary');
  const colorSplit = lightDarkColor.match(/^light-dark\((.*),(.*)\)$/);
  const color = colorSplit![1];


  const interpolatedLogs = interpolation ? interpolate(logs) : logs;

  const config: ChartConfiguration = {
    type: 'line',
    data: {
      datasets: []
    },
    options: {
      elements: {
        point: {
          radius: 0
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Custom Chart Title'
        }
      },

      scales: {
        xAxis: {
          type: 'linear',
          position: 'bottom'
        },
        mainY: {
          beginAtZero: true,
          display: true,
          position: 'left',
        },
        altY: {
          display: false,
          position: 'right'
        }
      }
    }
  };

  const dataSetDefaultConfig = {
    cubicInterpolationMode: 'monotone',
    tension: 0.5,
    borderWidth: 1,
    borderColor: color,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backgroundColor: function (context: any) {
      const chart = context.chart;
      const { ctx, chartArea } = chart;

      if (!chartArea) {
        // This case happens on initial chart load
        return;
      }

      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(1, color);
      gradient.addColorStop(0, color + '30');

      return gradient;
    },
    fill: true,
    yAxisID: 'mainY',
  }


  const altitudeDataSet = {
    ...dataSetDefaultConfig,
    yAxisID: 'altY',
    label: 'altitude',
    fill: true,
    backgroundColor: '#EEEEEE',
    borderColor: '#EEEEEE',
    data: interpolatedLogs.map((log: Log) => {
      return {
        x: log.distance / 1000,
        y: log.altitude
      }
    })
  }

  const speedConfig = {
    ...config
  }
  speedConfig.options!.plugins!.title!.text = 'Vitesse';
  output.speed = new Chart(domElements.speed, {
    ...speedConfig,
    data: {
      datasets: [
        {
          ...dataSetDefaultConfig,
          label: 'Speed',
          data: interpolatedLogs.map((log: Log) => {
            return {
              x: log.distance / 1000,
              y: Math.round(log.speed)
            }
          })
        }, altitudeDataSet
      ]
    }
  }) as Chart;

  const tiltConfig = {
    ...config
  }
  tiltConfig.options!.plugins!.title!.text = 'Angle';
  output.tilt = new Chart(domElements.tilt, {
    ...tiltConfig,
    data: {
      datasets: [
        {
          ...dataSetDefaultConfig,
          label: 'Tilt',
          data: interpolatedLogs.map((log: Log) => {
            return {
              x: log.distance / 1000,
              y: Math.round(log.tilt)
            }
          })
        },
        altitudeDataSet
      ]
    }
  }) as Chart;


  return output;
}