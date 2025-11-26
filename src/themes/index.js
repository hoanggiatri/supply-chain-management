import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { StyledEngineProvider } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// project import
import Palette from './palette';
import CustomShadows from './shadows';
import Typography from './typography';

export default function ThemeCustomization({ children }) {
  const theme = Palette('light', 'default');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeTypography = Typography(`'Public Sans', sans-serif`);
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1800,
          xl: 1920
        }
      },
      direction: 'ltr',
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography
    }),
    [theme, themeTypography, themeCustomShadows]
  );

  // const themes = createTheme(themeOptions);
  // themes.components = componentsOverride(themes);

  return (
    <StyledEngineProvider injectFirst={false}>
      {/* <ThemeProvider theme={themes}> */}
      {/* CssBaseline commented out to prevent MUI from overriding Tailwind */}
      {/* <CssBaseline /> */}
      {children}
      {/* </ThemeProvider> */}
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = {
  children: PropTypes.node
};
