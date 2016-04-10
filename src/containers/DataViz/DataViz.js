import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { BarChart } from '../../../react-d3';
import moment from 'moment';
import jquery from 'jquery';

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

let barData3 = [
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
let todayAverageData;
let lastFiveDaysNoToday;
let lastFiveChartData;

export default class DataViz extends Component {
  
  componentDidMount() {
	  fetch(`https://crankycoaster.firebaseio.com/.json`).then(data => data.json()).then(sipObj => {
		sipsArr = sipObj[Object.keys(sipObj)[0]];
	  	todaySips = sipsArr.filter((sip) => {
			return moment(sip.time).date() === moment().subtract(1, 'days').date();
			//GET RID OF THE SUBTRACT 1 DAYS, THIS IS FOR TESTING
		});
		todayChartData = todaySips.reduce((prev, sip) => {
			const xVal = moment(sip.time).hour();
			prev[xVal] = {
				x: xVal,
				y: sip.changeInForce * 1.3 + ( ( prev[xVal] && prev[xVal].y) || 0),
				count: 1 + ( ( prev[xVal] && prev[xVal].y) || 0)
			}
			return prev;
		}, []);
		barData = [
  			{'name': 'Series B',
			 'values': todayChartData
			}
		];

		todayAverageData = todayChartData.map(dataPoint => {
			return {
				x: dataPoint.x,
				y: dataPoint.y / dataPoint.count
			}
		});
		barData3 = [
		{'name': 'Series B',
			'values': todayAverageData
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
				y: sip.changeInForce * 1.3 + ( ( prev[xVal] && prev[xVal].y ) || 0 )
			}
			return prev;
		}, []);
		barData2 = [
		{'name': 'Series B',
			'values': lastFiveChartData
			}
		];
	});

  
  	const els = Array.from(window.document.querySelectorAll('.my-first-barchart .rd3-barchart-bar'));
	
	els.forEach((el) => {
		if(el.getAttribute('height') > 120) {
			try {
				jquery(el).addClass('good');
			} catch (e) {
				console.error(e);
			}
		} else if (el.getAttribute('height') > 85) {
			try {
				jquery(el).addClass('ok');
			} catch (e) {
				console.error(e);
			}
		} else {
			try {
				jquery(el).addClass('bad');
			} catch (e) {
				console.error(e);
			}
		}
	});
  }	
  componentDidUpdate() {
  	const els = Array.from(window.document.querySelectorAll('.rd3-barchart-bar'));

	els.forEach((el) => {
		if(el.getAttribute('height') > 120) {
			try {
				jquery(el).addClass('good');
			} catch (e) {
				console.error(e);
			}
		} else if (el.getAttribute('height') > 85) {
			try {
				jquery(el).addClass('ok');
			} catch (e) {
				console.error(e);
			}
		} else {
			try {
				jquery(el).addClass('bad');
			} catch (e) {
				console.error(e);
			}
		}
	});
  }
  render() {
    return (
      <div className="container">
        <h1>Data Visualization</h1>
        <Helmet title="Data Visualization"/>
		<BarChart className='my-first-barchart' data={barData} title={`Today's Drinking`} width={800} xAxisLabel={`Hour (Military Time)`} yAxisLabel={`Volume (ml)`} fill={`#000000`}/>
		<BarChart data={barData3} title={`Average Sip Size`} width={800} xAxisLabel={`Hour (Military Time)`} yAxisLabel={`Volume (ml)`} fill={`#000000`}/>
		<BarChart data={barData2} title={`Last Five Days' Drinking`} width={800} xAxisLabel={`Days Before Today`} yAxisLabel={`Volume (ml)`} fill={`#000000`}/>
      </div>
    );
  }
}
