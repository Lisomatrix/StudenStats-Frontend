import React, { Component } from 'react';
import { Card, Icon } from 'antd';
import './absence.css';
import { shallowEqual } from 'shouldcomponentupdate-children';
import CountUp from 'react-countup';

const TestIcon = () => (
	<svg
		style={{ width: '50px', height: '50px' }}
		className="icon"
		width="64pt"
		height="64pt"
		viewBox="0 0 64 64"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g id="#000000ff">
			<path
				opacity="1.00"
				d=" M 26.59 7.97 C 27.94 6.19 29.42 3.89 31.97 3.99 C 34.54 3.85 36.03 6.19 37.41 7.96 C 42.94 8.04 48.47 7.98 54.00 8.00 C 54.00 24.67 54.00 41.33 54.00 58.00 C 39.33 58.00 24.67 58.00 10.00 58.00 C 10.00 41.33 10.00 24.67 10.00 8.00 C 15.53 7.98 21.06 8.04 26.59 7.97 M 29.79 12.00 C 27.86 12.00 25.93 12.00 24.00 12.00 C 24.00 13.33 24.00 14.67 24.00 16.00 C 29.33 16.00 34.67 16.00 40.00 16.00 C 40.00 14.67 40.00 13.33 40.00 12.00 C 38.07 12.00 36.14 12.00 34.21 12.00 C 33.93 10.50 34.10 8.02 31.96 7.95 C 29.87 8.10 30.09 10.52 29.79 12.00 M 14.00 11.99 C 14.00 26.00 14.00 40.00 14.00 54.00 C 26.00 54.00 38.00 54.00 50.00 54.00 C 50.00 40.00 50.00 26.00 50.00 11.99 C 48.00 12.01 46.00 12.01 44.00 11.99 C 44.00 14.66 44.00 17.33 44.00 20.00 C 36.00 20.00 28.00 20.00 20.00 20.00 C 20.00 17.33 20.00 14.66 20.00 11.99 C 18.00 12.01 16.00 12.01 14.00 11.99 Z"
			/>
			<path
				opacity="1.00"
				d=" M 40.02 29.15 C 41.54 27.63 43.06 26.11 44.59 24.59 C 45.53 25.53 46.47 26.47 47.41 27.41 C 44.94 29.89 42.47 32.36 40.00 34.82 C 38.19 33.02 36.39 31.22 34.59 29.42 C 35.52 28.48 36.45 27.54 37.38 26.61 C 38.26 27.45 39.14 28.30 40.02 29.15 Z"
			/>
			<path
				opacity="1.00"
				d=" M 18.00 28.00 C 22.67 28.00 27.33 28.00 32.00 28.00 C 32.00 29.33 32.00 30.67 32.00 32.00 C 27.33 32.00 22.67 32.00 18.00 32.00 C 18.00 30.67 18.00 29.33 18.00 28.00 Z"
			/>
			<path
				opacity="1.00"
				d=" M 40.00 43.16 C 41.53 41.64 43.06 40.12 44.59 38.59 C 45.53 39.53 46.47 40.47 47.41 41.41 C 44.95 43.89 42.47 46.35 40.00 48.82 C 38.20 47.02 36.38 45.22 34.58 43.42 C 35.54 42.49 36.49 41.54 37.42 40.58 C 38.28 41.44 39.14 42.30 40.00 43.16 Z"
			/>
			<path
				opacity="1.00"
				d=" M 18.00 42.00 C 22.67 42.00 27.33 42.00 32.00 42.00 C 32.00 43.33 32.00 44.67 32.00 46.00 C 27.33 46.00 22.67 46.00 18.00 46.00 C 18.00 44.67 18.00 43.33 18.00 42.00 Z"
			/>
		</g>
	</svg>
);

class MarkedTests extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		const testsNumber = this.props.tests;

		return (
			<Card className="absence-card green-card" title="Testes marcados" hoverable bordered>
				<div className="display-container">
					<div className="icon-container">
						<Icon className="icon" component={TestIcon} />
					</div>
					<div className="text-container">
						{/* <span className="text">{testsNumber}</span> */}
						<CountUp
							className="text"
							end={parseInt(testsNumber)}
							duration={2}
						/>
					</div>
				</div>
			</Card>
		);
	}
}

export default MarkedTests;
