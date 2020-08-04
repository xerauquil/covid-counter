import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import { pink, lightGreen } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: pink,
  },
  spacing: factor => `${0.25 * factor}rem`,
});


export default responsiveFontSizes(theme);