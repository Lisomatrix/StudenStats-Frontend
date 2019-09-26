import React, { Component } from 'react';
import { Icon, AutoComplete } from 'antd';
import './../../../styles/search.less';
import { shallowEqual } from 'shouldcomponentupdate-children';

const dataSource = [ 'Home', 'School' ];

function onSelect(value) {
}

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			extended: false
		};

		this.SearchInputRef = React.createRef();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	Expand = () => {
		if (window.innerWidth <= 500) {
		}

		this.setState({ extended: true });
		this.SearchInputRef.current.focus();
	};

	hide = () => {
		this.setState({ extended: false });
	};

	render() {
		return (
			<div style={{ width: this.state.extended ? '215px' : '64px' }} className="search-input-and-icon-container">
				<div
					onClick={this.Expand}
					className={
						!this.state.extended && window.innerWidth <= 500 ? (
							'search-icon-container '
						) : (
							'search-icon-container icon-focused'
						)
					}
				>
					<Icon className="search-icon" type="search" />
				</div>
				<div
					className={
						!this.state.extended ? (
							'search-container hidden'
						) : 'search-container' + this.state.extended && window.innerWidth <= 500 ? (
							'search-container focused'
						) : (
							'search-container'
						)
					}
				>
					<AutoComplete dataSource={dataSource} onSelect={onSelect} ref={this.SearchInputRef}>
						<input
							onBlur={this.hide}
							placeholder="Procurar..."
							className="search-input"
							// style={{ width: 200 }}
						/>
					</AutoComplete>
				</div>
			</div>
		);
	}
}

export default Search;
