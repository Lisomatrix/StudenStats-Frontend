import { UPDATE_THEME } from './../../constants/action-types';

const theme = (state = [], action) => { 
    switch(action.type) {
        case UPDATE_THEME:
            return Object.assign({}, state, {
                theme: action.theme,
                backgroundColor: action.theme.backgroundColor,
                dark: action.theme.dark,
                headerColor: action.theme.headerColor,
                primaryColor: action.theme.primaryColor,
                secondaryColor: action.theme.secondaryColor,
                textPrimaryColor: action.theme.textPrimaryColor,
                textSecondaryColor: action.theme.textSecondaryColor,
                cardBackground: action.theme.cardBackground,
                buttonColor: action.theme.buttonColor,
                iconColor: action.theme.iconColor,
                initialThemeSet: true
            });

        default:
            return state;
    }
}

export default theme;