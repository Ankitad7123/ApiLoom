import {
  Button,
  Box,
  Flex,
  useMediaQuery,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  IconButton,
  useDisclosure,
  
  Image,
  Heading
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';

import MapProject from './Projects';
import ApiTester from './Normal';
import {useNavigate} from 'react-router-dom'

function Selection() {
  const [activeView, setActiveView] = useState('testing');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const ifName = localStorage.getItem("userApi")
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the userApi from localStorage
    localStorage.removeItem('userApi');

    // Redirect to the login page
    navigate('/login');
  }; // Adjusted breakpoint for wider range

  const handleViewChange = (view) => {
    setActiveView(view);
    onClose(); // Close the drawer when a view is selected
  };

  return (
    <Box>
      
   

      {/* Navigation Bar */}
      <Flex
        width="100%"
        justifyContent="center" // Center the hamburger menu
        mt={isMobile ? '10px' : '20px'} // Adjust top margin based on screen size
        alignItems="center"

      >
      
      
       
        {/* Hamburger menu for all screens, but centered in big screens */}
     {ifName &&  <IconButton
          icon={<HamburgerIcon />}
          aria-label="Menu"
          onClick={onOpen}
          variant="outline"
          colorScheme="teal" 
          ml={isMobile ? '-144px' : '-1060px'}
          fontSize={isMobile ? '24px' : '29px'} // Larger size for mobile screens
        />}

{ifName && <Button
      onClick={handleLogout}
      variant="ghost"
      _hover={{ bg: 'transparent' }}
      _active={{ bg: 'transparent' }}
      _focus={{ outline: 'none' }}
      border={"0.5px solid black"}
      fontFamily={'monospace'}
      ml={10}
      color={'red'}
    >
      Logout
    </Button>}


    {!ifName && <Button
      onClick={()=>{navigate("/login")}}
      variant="ghost"
      _hover={{ bg: 'transparent' }}
      _active={{ bg: 'transparent' }}
      _focus={{ outline: 'none' }}
      border={"0.5px solid black"}
      fontFamily={'monospace'}
      ml={0}
      color={'green'}
    >
      login
    </Button>}
        
         
      
        

        {/* Drawer for Navigation Options */}
        <Drawer isOpen={isOpen} placement="top" onClose={onClose} size={isMobile ? 'full' : 'sm'}>
          <DrawerOverlay />
          <DrawerContent 
           height={isMobile ? '50vh' : '40vh'} // Keep height based on screen size
           width={isMobile ? '100%' : '50%'} // Full width for mobile, card-like width for big screens
           borderRadius={isMobile ? '0' : '12px'} // Rounded corners for large screens
           marginTop={isMobile ? '0' : '5vh'} // Margin from top to make it look like a card in big screens
           boxShadow={isMobile ? 'none' : 'lg'} // Add shadow to make it look like a floating card on large screens
           mx={isMobile ? '0' : 'auto'} 
          
          
          > {/* Height controlled based on screen size */}
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            
            <DrawerBody>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Button
                  onClick={() => handleViewChange('projects')}
                  borderRadius="md"
                  width="80%"
                  mb="4"
                  colorScheme={activeView === 'projects' ? 'teal' : 'green'}
                  variant={activeView === 'projects' ? 'solid' : 'outline'}
                  _hover={{ bg: activeView === 'projects' ? 'teal.500' : 'green.200' }}
                  fontSize="sm"
                  p={4}
                >
                  Projects
                </Button>
                <Button
                  onClick={() => handleViewChange('testing')}
                  borderRadius="md"
                  width="80%"
                  colorScheme={activeView === 'testing' ? 'teal' : 'green'}
                  variant={activeView === 'testing' ? 'solid' : 'outline'}
                  _hover={{ bg: activeView === 'testing' ? 'teal.500' : 'green.200' }}
                  fontSize="sm"
                  p={4}
                >
                  Testing
                </Button>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>

      {/* Main Content Section */}
      <Box display={activeView === 'testing' ? 'block' : 'none'}>
        <ApiTester />
      </Box>
      <Box display={activeView === 'projects' ? 'block' : 'none'}>
        <MapProject />
      </Box>
    </Box>
  );
}

export default Selection;
