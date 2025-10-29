export default function Drawer(theme) {
  return {
    MuiDrawer: {
      styleOverrides: {
        variant: "permanent",
        paper: {
          flexShrink: 0,
          width: 300,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.grey[300]}`,
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.background.default,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          marginLeft: "10px",
          marginRight: "10px",
          paddingLeft: "2px",
          paddingRight: "2px",
          '&.Mui-selected': {
            fontWeight: 'bold',
            backgroundColor: theme.palette.action.selected,
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: 'rgba(0, 0, 0, 0.74)',
          fontWeight: 500,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 0.65)',
          minWidth: 40
        },
      },
    },
  };
}
