import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    _blue: {
      500: '#3818D9', // bleu, par défault
    },
    _green: {
        500: '#03781D'
    },
    _red: {
        500: "#E2A1A1"
    }
  },
});

export default theme;