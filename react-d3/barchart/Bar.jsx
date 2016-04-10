'use strict';

var React = require('react');

module.exports = React.createClass({

	propTypes: {
				   fill: React.PropTypes.string,
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	className: React.PropTypes.string
			   },

	getDefaultProps() {
		return {
			offset: 0,
	className: 'rd3-barchart-bar'
		};
	},

	render() {
		let className = 'rd3-barchart-bar';

		if (this.props.height > 60) className += ' good';
		else if (this.props.height > 40) className += ' ok';
		else className += ' bad';
		return (
				<rect
				className = {className}
				{...this.props}
				fill={this.props.fill}
				onMouseOver={this.props.handleMouseOver}
				onMouseLeave={this.props.handleMouseLeave}
				/>
			   );
		}
	});
