import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  , useNavigate} from 'react-router-dom';
import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import Selection from './Section/Selection';
import Login from './Section/Login';

import Login2 from './Section/Login2';

// A component to protect the Login route
const ProtectedRoute = ({ children }) => {
  const userApi = localStorage.getItem('userApi');
  
  // If userApi exists, redirect to the Selection page
  if (userApi) {
    return <Navigate to="/selection" />;
  }

  // If no userApi, render the child component (Login)
  return children;
};

const NotFound = () => {
  const navigate = useNavigate();  // Correct way to use `useNavigate` inside the component
  const handleRedirect = (e) => {
    e.preventDefault();
    navigate('/selection'); // Redirects to `/selection`
  };

  return (
    <Box fontFamily={'monospace'} textAlign="center" mt={150}>
      <Flex align="center" justify="center" fontSize="larger">
        <Heading>4</Heading>
        <img style={{ width: '80px'}} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0LtwervqLAyyD_7nj-oQ0kYCaDlBmbXqyEw&s' alt='logo_apiloom' />
        <Heading>4</Heading>
      </Flex>
      <p>Page not found.</p>
      <a href="#"  style={{margin:"130px", textDecoration:"underline"}} onClick={handleRedirect}>try this?</a>
    </Box>
  );
};


function App() {
  const userApi = localStorage.getItem('userApi');

 
  return (
    <Router>
      <Center>
        <Box bg="white" height="100vh">
          <Routes>
            {/* Redirect to Selection if user is logged in */}
            <Route
              path="/"
              element={userApi ? <Navigate to="/selection" /> : <Navigate to="/apiloom" />}
            />

            {/* Protect the login page, redirect to selection if already logged in */}
            <Route
              path="/login"
              element={
                <ProtectedRoute>
                  <Login2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apiloom"
              element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>
              }
            />

<Route
              path="*"
              element={
                <ProtectedRoute>
                {/* <Box fontFamily={'monospace'}>
                <Flex mt={160} fontSize={'larger'}>
                 <Heading  >4</Heading>
                 <img style={{width:"80px" , marginTop:"-18px"}} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0LtwervqLAyyD_7nj-oQ0kYCaDlBmbXqyEw&s' alt='logo_apillom'/>
                 <Heading  >4</Heading>
                 
                  
                  </Flex>
                  <p style={{marginLeft:"20px"}}>pageNotFound</p>
                  <a href="" onClick={NotFound} >trythis?</a>
                </Box> */}

                <NotFound />
                </ProtectedRoute>
              }
            />

            {/* Selection page should be accessible after login */}
            <Route path="/selection" element={<Selection />} />
          </Routes>
        </Box>
      </Center>
    </Router>
  );
}

export default App;
