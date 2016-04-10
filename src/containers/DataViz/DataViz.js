import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default class DataViz extends Component {

  componentWillMount() {
	  console.log('about to fetch');
	  try { 
	  fetch(`https://lit-savannah-65925.herokuapp.com/api/cupReadings`);
	  } catch(e) {
		  console.error(e);
	  }
  }
  render() {
    return (
      <div className="container">
        <h1>Data Visualization</h1>
        <Helmet title="Data Visualization"/>
		View Datas Dude
      </div>
    );
  }
}
