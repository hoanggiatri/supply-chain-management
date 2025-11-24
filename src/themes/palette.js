// material-ui
import { createTheme } from '@mui/material/styles';

// third-party
import { presetPalettes } from '@ant-design/colors';

// project import
import ThemeOption from './theme';

export default function Palette(mode, presetColor) {
  const colors = presetPalettes;

  let greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  let greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  let greyConstant = ['#fafafb', '#e6ebf1'];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors, presetColor, mode);

  return createTheme({
    palette: {
      mode,
      common: {
        black: '#000',
        white: '#fff'
      },
      ...paletteColor,
      text: {
        primary: mode === 'dark' ? '#e3e3e3' : paletteColor.grey[700],
        secondary: mode === 'dark' ? '#a0a0a0' : paletteColor.grey[500],
        disabled: mode === 'dark' ? '#6b6b6b' : paletteColor.grey[400]
      },
      action: {
        disabled: paletteColor.grey[300],
        hover: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
        selected: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',
        disabledBackground: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : paletteColor.grey[200],
      background: {
        paper: mode === 'dark' ? '#1a1a1a' : paletteColor.grey[0],
        default: mode === 'dark' ? '#0d0d0d' : paletteColor.grey.A50
      }
    }
  });
}
