import { Box, Center, Container, Flex } from '@chakra-ui/react'
import React from 'react'

function NavBar() {
  return (
    <Flex color={'white'} bg={'grey'} justifyContent={'space-between'} height={'7vh'} gap={'10px'}>
    
      <Box bg={'red'} width={'20vw'} textAlign={'center'}>1</Box>
        <Box bg={'red'}  width={'20vw'}>2</Box>
        <Box bg={'red'}  width={'20vw'}>3</Box>

    </Flex>
  )
}

export default NavBar