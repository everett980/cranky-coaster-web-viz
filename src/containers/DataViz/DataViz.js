import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { BarChart } from 'react-d3';
import moment from 'moment';

let barData = [
	{
		'name': 'Series A',
		'values': [
			{'x': 1, 'y': 4},
		],
	}
]

let barData2 = [
	{
		'name': 'Series A',
		'values': [
			{'x': 1, 'y': 4},
		],
	}
]

let sipsArr;
let todaySips;
let todayChartData;
let lastFiveDaysNoToday;
let lastFiveChartData;

export default class DataViz extends Component {
  
  componentDidMount() {
	  fetch(`https://crankycoaster.firebaseio.com/.json`).then(data => data.json()).then(sipObj => {
		sipsArr = sipObj[Object.keys(sipObj)[0]];
	  	todaySips = sipsArr.filter((sip) => {
			return moment(sip.time).date() === moment().date();
		});
		todayChartData = todaySips.reduce((prev, sip) => {
			const xVal = moment(sip.time).hour();
			prev[xVal] = {
				x: xVal,
				y: sip.changeInForce + ( ( prev[xVal] && prev[xVal].y) || 0)
			}
			return prev;
		}, []);
		barData = [
  			{'name': 'Series B',
			 'values': todayChartData
			}
		];
		
		lastFiveDaysNoToday = sipsArr.filter((sip) => {
			const dif = moment().date() - moment(sip.time).date();
			return dif && dif < 6;
		});
		const minDay = lastFiveDaysNoToday.reduce((prev, sip) => {
			return prev < moment(sip.time).date() ? prev : moment(sip.time).date();
		}, moment(lastFiveDaysNoToday[0].time).date());
		lastFiveChartData = lastFiveDaysNoToday.reduce((prev, sip) => {
			const xVal = moment(sip.time).date() - minDay;
			prev[xVal] = {
				x: 5 - xVal,
				y: sip.changeInForce + ( ( prev[xVal] && prev[xVal].y ) || 0 )
			}
			return prev;
		}, []);
		barData2 = [
		{'name': 'Series B',
			'values': lastFiveChartData
			}
		];
	});
  }	
  render() {
    return (
      <div className="container">
        <h1>Data Visualization</h1>
        <Helmet title="Data Visualization"/>
		View Datas Dude
		<BarChart data={barData} title={`Today's Drinking`} xAxisLabel={`Hour (Military Time)`} yAxisLabel={`Force, for now`}/>
		<BarChart data={barData2} title={`Last Five Days' Drinking`} xAxisLabel={`Days Before Today`} yAxisLabel={`Force, for now`}/>
      </div>
    );
  }
}
