import React, { Component } from 'react';
import { Layout, Icon, Drawer } from 'antd';
import SidebarMenu from './sidebar-components/sidebar-menu';
import { connect } from 'react-redux';
import { setTheme } from './../../redux/actions/theme';
import { shallowEqual } from 'shouldcomponentupdate-children';
import { alunoMenu, parenteMenu, professorMenu, classDirectorMenu, adminMenu } from './../../constants/menus';
import { isUndefined } from 'util';

const { Sider } = Layout;

function getMenuItemId(path, menu) {
	if (path === '/' || path === '') return { id: '1' };

	const isSubItem = path.split('/').length - 1 === 2 ? true : false;

	var foundSubItem;

	const foundId = menu.find((route) => {
		if (isSubItem) {
			if (route.isGroup) {
				const subItem = route.group.find((subItem) => {
					if (subItem.link === path) {
						return subItem;
					}
				});

				if (subItem) {
					foundSubItem = subItem;
				}
			}
		} else {
			if (route.link === path) {
				return route;
			}
		}
	});

	if (isSubItem) {
		return foundSubItem;
	} else {
		return foundId;
	}
}

class Sidebar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: [ '1' ],
			changed: true,
			isClassDirector: false
		};
	}

	LogoIcon = () => (
		<svg
			version="1.0"
			xmlns="http://www.w3.org/2000/svg"
			width="30px"
			height="30px"
			viewBox="0 0 102.000000 154.000000"
			preserveAspectRatio="xMaxYMax"
		>
			<g transform="translate(0.000000,154.000000) scale(0.100000,-0.100000)" stroke="none">
				<path d="M338 1458 c-76 -33 -138 -64 -138 -68 0 -4 22 -17 50 -29 l49 -21 -1
					-113 c-1 -95 2 -121 21 -170 40 -102 103 -157 181 -157 78 0 141 55 181 157
					19 49 22 75 21 170 l-1 113 49 21 c28 12 50 25 50 29 0 11 -278 130 -303 129
					-12 0 -84 -27 -159 -61z m76 -253 c31 -14 70 -25 86 -25 16 0 55 11 86 25 31
					14 58 25 60 25 2 0 4 -18 4 -40 0 -29 4 -40 15 -40 18 0 13 -31 -17 -100 -54
					-127 -172 -159 -254 -68 -29 31 -60 95 -68 140 -6 32 -4 37 9 32 12 -5 15 2
					15 35 0 23 2 41 4 41 2 0 29 -11 60 -25z" />
				<path d="M265 908 c-78 -27 -144 -99 -169 -185 l-7 -23 411 0 412 0 -7 28
					c-20 80 -120 176 -198 189 -33 5 -35 4 -70 -58 -53 -94 -93 -150 -100 -142
					-13 13 -7 94 8 109 25 25 18 29 -45 29 -62 0 -70 -4 -45 -25 15 -13 22 -100 8
					-114 -8 -8 -111 147 -119 181 -7 25 -29 29 -79 11z" />
				<path d="M58 669 c-41 -23 -41 -41 -3 -262 20 -117 43 -222 51 -234 8 -12 29
					-25 46 -28 18 -3 188 -5 376 -3 336 3 344 3 361 24 11 14 29 94 54 238 39 227
					39 243 -3 266 -25 14 -859 13 -882 -1z m886 -31 c13 -21 11 -45 -23 -237 -30
					-169 -41 -217 -56 -227 -15 -11 -89 -14 -367 -14 -335 0 -349 1 -368 20 -11
					11 -20 26 -20 33 -1 6 -16 100 -35 207 -30 174 -32 197 -19 218 l14 22 430 0
					430 0 14 -22z" />
				<path d="M120 115 c0 -13 49 -15 380 -15 331 0 380 2 380 15 0 13 -49 15 -380 15 -331 0 -380 -2 -380 -15z" />
			</g>
		</svg>
	);

	componentDidMount() {
		const route = this.getRouteByPath(window.location.pathname);

		if(route) {
			if (route.isSubItem) {
				this.setState({ selected: [ isUndefined(route) || route.id === 0 ? '1' : `${route.id}` ] });
			} else {
				this.setState({ selected: [ isUndefined(route) || route.id === 0 ? '1' : `${route.id}` ] });
			}
		}

		this.props.history.listen((location, action) => {
			if (this.state.changed) {
				const route = this.getRouteByPath(location.pathname);

				if (route) {

					if (route.hasOwnProperty('isSubItem')) {
						this.setState({ selected: [ isUndefined(route) || route.id === 0 ? '1' : `${route.id}` ] });
					} else {
						this.setState({ selected: [ isUndefined(route) || route.id === 0 ? '1' : `${route.id}` ] });
					}
				}
			} else {
				this.setState({ changed: false });
			}
		});
	}

	getRouteByPath = (path) => {
		var route;

		if (this.props.role === 'ROLE_PROFESSOR') {
			if (this.props.user.classDirector) {
				route = getMenuItemId(path, classDirectorMenu);
			} else {
				route = getMenuItemId(path, professorMenu);
			}
		} else if (this.props.role === 'ROLE_ALUNO') {
			route = getMenuItemId(path, alunoMenu);
		} else if (this.props.role === 'ROLE_PARENT') {
			route = getMenuItemId(path, parenteMenu);
		} else if (this.props.role === 'ROLE_ADMIN') {
			route = getMenuItemId(path, adminMenu);
		}

		return route;
	};

	changeSelected = ({ item, key, keyPath }) => {
		// this.setState({ selected: [ key ], changed: false });
	};

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		const theme = (this.props.collapsed ? 'logo-title hidden ' : 'logo-title ') + this.props.theme.dark;
		
		return window.innerWidth > 900 ? (
			<Sider
				ref={(pb) => (this.sidebar = pb)}
				trigger={this.props.trigger} // Remove sidebar trigger
				onCollapse={this.props.onCollapse}
				collapsible={this.props.collapsible}
				collapsedWidth={this.props.collapsedWidth}
				collapsed={this.props.collapsed}
				className="sider-shadow animated slideInLeft"
				breakpoint={this.props.breakpoint}
				theme={this.props.theme.dark}
				width={this.props.width}
				style={{
					overflow: 'hidden',
					height: '100vh',
					position: 'fixed',
					left: 0,
					backgroundColor: this.props.theme.dark === 'dark' ? '#002140' : '#ffffff'
				}}
			>
				<div
					style={{
						backgroundColor: this.props.theme.dark === 'dark' ? '#002140' : '#fff',
						boxShadow: this.props.theme.dark === 'dark' ? 'none' : '1px 1px 0 0 #e8e8e8'
					}}
					className="logo-container"
				>
					<div className="logo-icon-container">
						<Icon className={this.props.theme.dark + ' logo-icon'} component={this.LogoIcon} />
					</div>
					<div className="logo-title-container">
						<span className={theme}>StudenStats</span>
					</div>
				</div>
				<SidebarMenu
					onKeyClick={this.changeSelected}
					selectedKey={this.state.selected}
					history={this.props.history}
					role={this.props.role}
					theme={this.props.theme.dark}
					isClassDirector={this.props.user.classDirector}
					// isClassDirector={true}
				/>
			</Sider>
		) : (
			<Drawer
				placement="left"
				bodyStyle={{
					backgroundColor: this.props.theme.dark === 'dark' ? '#002140' : '#fff',
					padding: 0,
					height: '100%'
				}}
				onClose={this.props.onCollapse}
				visible={!this.props.collapsed}
			>
				<div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
					<div
						style={{
							backgroundColor: this.props.theme.dark === 'dark' ? '#002140' : '#fff',
							boxShadow: this.props.theme.dark === 'dark' ? 'none' : '1px 1px 0 0 #e8e8e8',
							marginBottom: '0px'
						}}
						className="logo-container"
					>
						<div className="logo-icon-container">
							<Icon className={this.props.theme.dark + ' logo-icon'} component={this.LogoIcon} />
						</div>
						<div className="logo-title-container">
							<span className={theme}>StudenStats</span>
						</div>
					</div>

					<SidebarMenu
						onKeyClick={this.changeSelected}
						selectedKey={this.state.selected}
						history={this.props.history}
						role={this.props.role}
						theme={this.props.theme.dark}
						isClassDirector={this.props.user.classDirector}
					/>
				</div>
			</Drawer>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		role: state.authentication.role,
		user: state.connect.user,
		theme: state.theme
	};
};

const mapDispatchToProps = {
	setTheme
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
