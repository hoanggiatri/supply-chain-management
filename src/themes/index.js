import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

// project import
import Palette from './palette';
import CustomShadows from './shadows';
import Typography from './typography';

export default function ThemeCustomization({ children }) {
  // Base palette (with our custom 'default' color)
  const baseTheme = Palette('light', 'default');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeTypography = Typography(`'Public Sans', sans-serif`);
  const themeCustomShadows = useMemo(() => CustomShadows(baseTheme), [baseTheme]);

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
      palette: baseTheme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography
    }),
    [baseTheme, themeTypography, themeCustomShadows]
  );

  const themes = createTheme(themeOptions);

  return (
    // injectFirst={true} để CSS của MUI được inject trước,
    // giúp Tailwind + Material Tailwind dễ dàng override khi có xung đột.
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        {/* Không dùng CssBaseline để tránh reset CSS của MUI đè lên Tailwind */}
        {/* <CssBaseline /> */}
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = {
  children: PropTypes.node
};
