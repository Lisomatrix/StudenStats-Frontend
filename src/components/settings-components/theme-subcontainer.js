import React, { Component } from 'react';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import { message, Switch, Button } from 'antd';
import rgba from 'rgba-convert';
import { Prompt } from 'react-router-dom';
import { shallowEqual } from 'shouldcomponentupdate-children';

function getAlpha(hex) {
	if (!hex) {
		return 100;
	}

	if (hex.length > 7) {
		const hexString = hex.slice(-2);
		const alpha = Math.trunc(parseInt(hexString, 16) * 100 / 255);

		return alpha;
	} else {
		return 100;
	}
}

function getSmallHex(hex) {
	if (!hex) {
		return '#ffffff';
	}

	if (hex.length > 7) {
		return hex.substring(0, 7);
	} else {
		return hex;
	}
}

class ThemeSubContainer extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return shallowEqual(this.props, nextProps, this.state, nextState);
	}

	constructor(props) {
		super(props);

		this.state = {
			primaryColor: props.theme.primaryColor,
			secondaryColor: props.theme.secondaryColor,
			primaryText: props.theme.textPrimaryColor,
			secondaryText: props.theme.textSecondaryColor,
			background: props.theme.backgroundColor,
			heading: props.theme.headerColor,
			layoutHeading: props.theme.headerColor,
			cardBackground: props.theme.cardBackground,
			iconColor: props.theme.iconColor,
			buttonColor: props.theme.buttonColor,
			changed: false
		};
	}

	changeHandler = (colors) => {
		this.setState({ colors: colors });
	};

	darkThemeChanger = (e) => {
		const newTheme = this.props.theme;

		newTheme.dark = e ? 'dark' : 'light';

		this.props.setTheme(newTheme);
	};

	saveTheme = () => {

		const newTheme = {
			backgroundColor: this.state.background,
			dark: this.props.theme.dark === 'dark' ? true : false,
			headerColor: this.state.layoutHeading,
			primaryColor: this.state.primaryColor,
			secondaryColor: this.state.secondaryColor,
			textPrimaryColor: this.state.primaryText,
			textSecondaryColor: this.state.secondaryText,
			cardBackground: this.state.cardBackground,
			iconColor: this.state.iconColor,
			buttonColor: this.state.buttonColor
		};

		this.props.saveTheme(newTheme);

		this.setState({ changed: false });
	};

	resetTheme = () => {
		window.less
			.modifyVars({
				'@btn-primary-bg': '#1890ff',
				'@bg-color': '#f0f2f5',
				'@layout-header-background': '#ffffff',
				'@secondary-color': '#1890ff',
				'@text-color-secondary': rgba.hex('rgba(0, 0, 0, .45)'),
				'@text-color': '#000000a6',
				'@card-background': '#f8f8f8',
				'@icon-color': '#000000a6'
			})
			.then((success) => {
				message.success(`Tema atualizado!`);
			})
			.catch((error) => {
				message.error(`Lamento mas ocorreu um erro ao atualizar o tema!`);
			});

		this.setState({
			primaryColor: '#1890ff',
			secondaryColor: '#1890ff',
			primaryText: '#000000a6',
			secondaryText: rgba.hex('rgba(0, 0, 0, .45)'),
			background: '#f0f2f5',
			heading: rgba.hex('rgba(0, 0, 0, .85)'),
			layoutHeading: '#ffffff',
			buttonPrimary: '#1890ff',
			cardBackground: '#ffffff',
			iconColor: '#000000a6',
			buttonColor: '#1890ff',
			changed: true
		});
	};

	onClose = () => {

		window.less
			.modifyVars({
				//'@btn-primary-bg': this.state.primaryColor,
				'@primary-color': this.state.primaryColor,
				'@bg-color': this.state.background,
				'@layout-header-background': this.state.layoutHeading,
				'@secondary-color': this.state.secondaryColor,
				'@text-color-secondary': this.state.secondaryText,
				'@text-color': this.state.primaryText,
				'@card-background': this.state.cardBackground,
				'@icon-color': this.state.iconColor,
				'@btn-primary-bg': this.state.buttonColor
			})
			.then((success) => {
				message.success(`Tema atualizado!`);
			})
			.catch((error) => {
				message.error(`Lamento mas ocorreu um erro ao atualizar o tema!`);
				console.log(error);
			});
	};

	render() {
		return (
			<div className="theme-subcontainer">
				<Prompt
					when={this.state.changed}
					message={(location) => `O tema não foi guardado tem a certeza que pretende sair?`}
				/>
				<div className="dark-theme-switcher-container">
					<span className="primary-text">Barra lateral negra: </span>
					<Switch
						defaultChecked={this.props.theme.dark === 'dark' ? true : false}
						onChange={this.darkThemeChanger}
						className="dark-theme-switch"
					/>
				</div>
				<div className="secondary-color-container color-selector-container">
					<span className="secondary-color-title primary-text">Cor Secundária:</span>
					<ColorPicker
						animation="slide-up"
						alpha={getAlpha(this.state.secondaryColor)}
						color={getSmallHex(this.state.secondaryColor)}
						onClose={(colours) => {
							const hexString = Math.trunc(colours.alpha * 255 / 100).toString(16);

							this.setState({ secondaryColor: colours.color + hexString, changed: true }, () => {
								this.onClose();
							});
						}}
					/>
				</div>
				<div className="primary-text-color-container color-selector-container">
					<span className="primary-text-color-title primary-text">Cor primária de texto:</span>
					<ColorPicker
						alpha={getAlpha(this.state.primaryText)}
						color={getSmallHex(this.state.primaryText)}
						onClose={(colours) => {
							const hexString = Math.trunc(colours.alpha * 255 / 100).toString(16);

							this.setState({ primaryText: colours.color + hexString, changed: true }, () => {
								this.onClose();
							});
						}}
						animation="slide-up"
					/>
				</div>
				<div className="secondary-text-color-container color-selector-container">
					<span className="secondary-text-color-title primary-text">Cor Secundária de texto:</span>
					<ColorPicker
						alpha={getAlpha(this.state.secondaryText)}
						color={getSmallHex(this.state.secondaryText)}
						onClose={(colours) => {
							const hexString = Math.trunc(colours.alpha * 255 / 100).toString(16);

							this.setState({ secondaryText: colours.color + hexString, changed: true }, () => {
								this.onClose();
							});
						}}
						animation="slide-up"
					/>
				</div>
				<div className="background-color-container color-selector-container">
					<span className="background-color-title primary-text">Cor de fundo:</span>
					<ColorPicker
						alpha={getAlpha(this.state.background)}
						color={getSmallHex(this.state.background)}
						onClose={(colours) => {
							const hexString = Math.trunc(colours.alpha * 255 / 100).toString(16);

							this.setState({ background: colours.color + hexString, changed: true }, () => {
								this.onClose();
							});
						}}
						animation="slide-up"
					/>
				</div>
				<div className="layout-header-color-container color-selector-container">
					<span className="layout-header-color-title primary-text">Cor de cabeçalho da página:</span>
					<ColorPicker
						alpha={getAlpha(this.state.layoutHeading)}
						color={getSmallHex(this.state.layoutHeading)}
						onClose={(colours) => {
							const hexString = Math.trunc(colours.alpha * 255 / 100).toString(16);

							this.setState({ layoutHeading: colours.color + hexString, changed: true }, () => {
								this.onClose();
							});
						}}
						animation="slide-up"
					/>
				</div>
				<div className="card-body-color-container color-selector-container">
					<span className="card-body-color-title primary-text">Cor do fundo dos blocos:</span>
					<ColorPicker
						alpha={getAlpha(this.state.cardBackground)}
						color={getSmallHex(this.state.cardBackground)}
						onClose={(colours) => {
							const hexString = Math.trunc(colours.alpha * 255 / 100).toString(16);

							this.setState({ cardBackground: colours.color + hexString, changed: true }, () => {
								this.onClose();
							});
						}}
						animation="slide-up"
					/>
				</div>
				<div className="button-primary-color-container color-selector-container">
					<span className="button-primary-color-title primary-text">Cor primária:</span>
					<ColorPicker
						alpha={getAlpha(this.state.primaryColor)}
						color={getSmallHex(this.state.primaryColor)}
						onClose={(colours) => {
							const hexString = Math.trunc(colours.alpha * 255 / 100).toString(16);

							this.setState({ primaryColor: colours.color + hexString, changed: true }, () => {
								this.onClose();
							});
						}}
						animation="slide-up"
					/>
				</div>
				<div className="icon-color-container color-selector-container">
					<span className="icon-color-container-title primary-text">Cor de ícones:</span>
					<ColorPicker
						alpha={getAlpha(this.state.iconColor)}
						color={getSmallHex(this.state.iconColor)}
						onClose={(colours) => {
							const hexString = Math.trunc(colours.alpha * 255 / 100).toString(16);

							this.setState({ iconColor: colours.color + hexString, changed: true }, () => {
								this.onClose();
							});
						}}
						animation="slide-up"
					/>
				</div>
				<div className="button-color-container color-selector-container">
					<span className="button-color-container-title primary-text">Cor dos botões:</span>
					<ColorPicker
						alpha={getAlpha(this.state.buttonColor)}
						color={getSmallHex(this.state.buttonColor)}
						onClose={(colours) => {
							const hexString = Math.trunc(colours.alpha * 255 / 100).toString(16);

							this.setState({ buttonColor: colours.color + hexString, changed: true }, () => {
								this.onClose();
							});
						}}
						animation="slide-up"
					/>
				</div>
				<div className="theme-save-container">
					<Button className="theme-reset-btn" onClick={this.resetTheme} type="danger">
						Repor tema
					</Button>
					<Button className="theme-save-btn" onClick={this.saveTheme} type="primary">
						Guardar Tema
					</Button>
				</div>
			</div>
		);
	}
}

export default ThemeSubContainer;
