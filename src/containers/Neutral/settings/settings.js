import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import './../../../styles/settings.less';
import { setTheme } from './../../../redux/actions/theme';
import { sendUpdateTheme } from './../../../redux/actions/websocket';
import { shallowEqual } from 'shouldcomponentupdate-children';
import Loadable from 'react-loadable';
import Loading from './../loading/loading';
import { requestUserThemeUpdate, requestUpdateParent, requestUpdateAdmin, requestUpdateTeacher, requestUpdateStudent } from './../../../redux/actions/restActions/user';

const ThemeSubContainer = Loadable({
	loader: () => import('./../../../components/settings-components/theme-subcontainer'),
	loading: Loading
});

const UserSubContainer = Loadable({
	loader: () => import('./../../../components/settings-components/user-subcontainer'),
	loading: Loading
})

class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			colors: '',
			selectedTab: ["1"],
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	render() {
		return (
			<div className="settings-container-container animated slideInUp">
				<div className="settings-container">
					<div style={{ gridColumn: '1/1' }} className="settings-menu-container">
						<Menu onSelect={(item) => {
							this.setState({ selectedTab: item.selectedKeys });

						}} selectedKeys={this.state.selectedTab} theme={this.props.theme.dark} mode="inline" defaultSelectedKeys={['1']}>
							<Menu.Item key="1">Configurações de Tema</Menu.Item>
							<Menu.Item key="2">Configurações Básicas</Menu.Item>
						</Menu>
					</div>
					<div style={{ gridColumn: '2/2' }} className="settings-subcontainer-container">
						{this.state.selectedTab[0] === "1" ? <ThemeSubContainer
							theme={this.props.theme}
							setTheme={this.props.setTheme}
							saveTheme={this.props.requestUserThemeUpdate}
						/> : <UserSubContainer
								role={this.props.role}
								user={this.props.user}
								userPhoto={this.props.userPhoto}
								requestUpdateParent={this.props.requestUpdateParent}
								requestUpdateAdmin={this.props.requestUpdateAdmin}
								requestUpdateTeacher={this.props.requestUpdateTeacher}
								requestUpdateStudent={this.props.requestUpdateStudent}
							/>}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		theme: state.theme,
		userPhoto: state.authentication.userPhoto,
		role: state.authentication.role,
		user: state.connect.user
	};
};

const mapDispatchToProps = {
	setTheme,
	sendUpdateTheme,
	requestUserThemeUpdate,
	requestUpdateParent,
	requestUpdateAdmin,
	requestUpdateTeacher,
	requestUpdateStudent
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
