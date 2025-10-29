export default function Link() {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          textDecoration: 'none', 
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
    },
  };
}