import React, { useState, useEffect } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Heading, Alert, AlertIcon, Spinner, Stack, Text } from '@chakra-ui/react';

const TypingEffect = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 100); // 100ms delay for each letter typing
      return () => clearTimeout(timer);
    } else {
      setTimeout(onComplete, 2500); // Additional delay after typing effect completes
    }
  }, [index, text, onComplete]);

  return (
    <Text fontFamily="monospace" fontSize="lg" display="flex" alignItems="center">
      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0LtwervqLAyyD_7nj-oQ0kYCaDlBmbXqyEw&s" 
        alt="apiLOOM logo" 
        style={{ width: '100px', marginRight: '8px' }} 
      />
      {displayedText}
    </Text>
  );
};


const UserAuth = () => {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Welcome message text
  const welcomeText = "Welcome to apiLoom, an API testing platform where you can test, explore, and manage your APIs efficiently.";

  // Check for logged-in user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userApi');
    if (storedUser) {
      window.location.href = '/selection'; // Change to your protected route
    }
  }, []);

  const useAsGuest = () => {
    window.location.href = '/selection';
  };

  const handleUsernameChange = (e) => setUsername(e.target.value.trim());
  const handlePasswordChange = (e) => setPassword(e.target.value.trim());

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage('Both fields are required.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const url = isLoginMode
        ? 'http://localhost:8000/login'
        : 'http://localhost:8000/create';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed.');
      }

      const data = await response.json();
      localStorage.setItem('userApi', data.username || username);
      setUsername('');
      setPassword('');
      window.location.href = '/selection'; // Redirect to the desired page after login
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box >
      {!showForm ? (
        // Show the typing effect initially
        <Box width="820px" mx="auto"   mt={'290px'}  fontFamily={'monospace'} bg={'white'} color={'black'}>
        
        <TypingEffect text={welcomeText} onComplete={() => setShowForm(true)} />
        </Box>
      ) : (
        // Once typing effect is done, display the form
        <>
        <Box width="320px" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            {isLoginMode ? 'Login' : 'Create'}
          </Heading>
          {errorMessage && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel>Username</FormLabel>
              <Input type="text" value={username} onChange={handleUsernameChange} placeholder="Enter your username" required />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={handlePasswordChange} placeholder="Enter your password" required />
            </FormControl>
            <Stack direction="row" align="center" justifyContent="space-between" mt={4}>
              <Button colorScheme="teal" type="submit" isLoading={isLoading} spinner={<Spinner size="sm" />}>
                {isLoginMode ? 'Login' : 'Create'}
              </Button>
              <Button variant="link" colorScheme="grey" onClick={toggleMode} disabled={isLoading} margin={'60px'}>
                {isLoginMode ? 'Want to create?' : 'Already have an account?'}
              </Button>
            </Stack>
          </form>

          <Button
            onClick={useAsGuest}
            variant="ghost"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
            _focus={{ outline: 'none' }}
            border={"0.5px solid black"}
            fontFamily={'monospace'}
            ml={12}
            color={'lightgrey'}
            bg={'black'}
          >
            Use as a guest
          </Button>
          </Box>
          </>
        
      )}
    </Box>
  );
};

export default UserAuth;
