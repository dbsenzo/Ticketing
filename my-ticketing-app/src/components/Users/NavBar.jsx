import { Box, Flex, Link, useColorModeValue } from '@chakra-ui/react';

const NaveBar = () => {
  const bg = "white";
  const color = useColorModeValue('gray.800', 'white');

  return (
    <Box
      bg={bg}
      w="250px"
      p={4}
      color={color}
      height="100vh"
      position="fixed"
      left={0}
      top={0}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Flex direction="column" alignItems="center">
        <Box mb="100">Logo</Box>
        <Link mb={4} href="#" _hover={{ textDecoration: 'none', bg: "#3818D9", textColor: "white" }}>
          Home
        </Link>
        <Link mb={4} href="#" _hover={{ textDecoration: 'none', bg: "#3818D9", textColor: "white" }}>
          Statistics
        </Link>
        <Link mb={4} href="#" _hover={{ textDecoration: 'none', bg: "#3818D9", textColor: "white" }}>
          Clients
        </Link>
      </Flex>
    </Box>
  );
};

export default NaveBar;
