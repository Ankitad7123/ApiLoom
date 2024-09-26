// src/theme.js

import { extendTheme } from '@chakra-ui/react';

// Custom theme
const theme = extendTheme({
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Roboto, sans-serif',
  },
  styles: {
    
      h1: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '2xl',
        fontWeight: 'bold',
        color: 'teal.500',
      },
      h2: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: 'xl',
        fontWeight: 'semibold',
        color: 'teal.400',
      },
      a: {
        color: 'teal.600',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  
});

export default theme;
