import { UPDATE_THEME } from './../../constants/action-types';

export function setTheme(theme) {
	return (dispatch) => {
		dispatch(updateTheme(theme));
	};
}

function updateTheme(theme) {
	connectThemeUpdate(theme);

	return {
		type: UPDATE_THEME,
		theme: theme
	};
}

async function connectThemeUpdate(theme) {
	
	await window.less
		.modifyVars({
			'@primary-color': theme.primaryColor,
			'@btn-primary-bg': theme.buttonColor,
			'@bg-color': theme.backgroundColor,
			'@layout-header-background': theme.headerColor,
			'@secondary-color': theme.secondaryColor,
			'@text-color-secondary': theme.textPrimaryColor,
			'@text-color': theme.textSecondaryColor,
			'@card-background': theme.cardBackground,
			'@icon-color': theme.iconColor
		})
		.then(() => {
		
		})
		.catch((error) => {
			console.log(error);
		});
}
