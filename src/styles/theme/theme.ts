
import { createTheme } from '@mui/material'

declare module "@mui/material/styles" {
  interface TypographyVariants {
    'title-lg': React.CSSProperties;
    'title-sm': React.CSSProperties;
    'body-sm': React.CSSProperties;
    'body-xs': React.CSSProperties;
    success: React.CSSProperties;
    muted: React.CSSProperties;
    shadowLight: React.CSSProperties;
    shadowDark: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    'title-lg'?: React.CSSProperties;
    'title-sm'?: React.CSSProperties;
    'body-sm'?: React.CSSProperties;
    'body-xs'?: React.CSSProperties;
    success?: React.CSSProperties;
    muted?: React.CSSProperties;
    shadowLight?: React.CSSProperties;
    shadowDark?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    'title-lg': true;
    'title-sm': true;
    'body-sm': true;
    'body-xs': true;
    success: true;
    muted: true;
    shadowLight: true;
    shadowDark: true;
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700
    },
    h2: {
      fontWeight: 700
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem'
    },
    h5: {
      fontWeight: 700,
      fontSize: '1rem'
    },
    h6: {
      fontWeight: 700
    },
    'title-lg': {
      fontWeight: 700,
      fontSize: 24
    },
    'title-sm': {
      fontWeight: 700,
      fontSize: 12
    },
    'body-sm': {
      fontSize: 12
    },
    'body-xs': {
      fontSize: 12
    },
    success: {
      color: '#559399'
    },
    muted: {
      color: '#777'
    },
    shadowLight: {
      textShadow: '1px 1px 0 #64aab1'
    },
    shadowDark: {
      color: '#A6CBCE',
      textShadow: '1px 1px 0 rgba(61, 106, 110, .75)'
    }
  },
  palette: {
    primary: {
      50: "#F2F7F8",
      100: "#E5EFF0",
      200: "#C7DEE0",
      300: "#A6CBCE",
      400: "#7FB3B8",
      500: "#559399",
      600: "#4C858A",
      700: "#437579",
      800: "#375F62",
      900: "#284548",
    },
    secondary: {
      main: '#228be6',
    },
    background: {
      default: '#f0f4f8',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState?.color === 'success' && {
            color: '#2e4934',
            backgroundColor: '#81f499',
            boxShadow: 'none',
            '&:hover': {
              color: '#528b5f',
              backgroundColor: '#92ffaa',
              boxShadow: 'none',
            },
          }),
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'inherit',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '.Mui-readOnly': {
            backgroundColor: '#f0f4f8',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            overflowX: 'hidden'
          },
          '& .MuiFilledInput-root': {
            overflow: 'auto',
            fontSize: 14,
            backgroundColor: 'rgba(0, 0, 0, .09)',
            border: 'none',
            padding: 0,
            borderRadius: 6,
            '&::before': {
              borderBottom: 'none !important'
            },
            '&::after': {
              borderBottom: 'none'
            },
            '&:hover': {
              borderRadius: 6,
            },
            '&.Mui-focused': {
              border: '2px solid #0b6bcb'
            },
            '.MuiInputBase-input': {
              padding: 10,
            }
          }
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          paddingTop: 6,
          paddingBottom: 6
        },
        root: {
          '& .MuiFilledInput-root': {
            padding: '7.5px !important',
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '.MuiToolbar-root': {
            backgroundColor: 'transparent',
          },
          '& .MuiTableRow-root': {
            backgroundColor: 'transparent',
            '& .MuiTableCell-root': {
              fontSize: 12,
            }
          }
        }
      }
    }
  },
});