import React, { useState, useEffect } from 'react';
import {
  Select,
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  SimpleGrid,
  useMediaQuery,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  IconButton,
  Flex,
  useToast,
  CloseButton,
} from '@chakra-ui/react';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import ApiTester2 from './ProjectNormal'; // Adjust import based on your file structure
import { useNavigate } from 'react-router-dom';
const MapProject = () => {
  const [projects, setProjects] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);
  const [showProjects, setShowProjects] = useState(true);
  const [isMobile] = useMediaQuery("(max-width: 468px)");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFormVisible, setFormVisible] = useState(false);

  const [newProject, setNewProject] = useState({
    username: localStorage.getItem('userApi'),  // Adding the username field
    Name: "",
    Description: "",
    APIs: []
  });
  const toast = useToast();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the userApi from localStorage
    localStorage.removeItem('userApi');

    // Redirect to the login page
    navigate('/login');
  };

  const fetchProjects = async () => {
    const userApi = localStorage.getItem('userApi');
    if (!userApi) {
      toast({
        title: '',
        description: 'You are not logged In',
       
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/get/${userApi}`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      setProjects(data.res);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refreshKey]);

  const handleTestApiClick = (api) => {
    setSelectedApi(api);
    setShowProjects(false);
  };

  const handleBackToProjects = () => {
    setShowProjects(true);
    setFormVisible(false);
    setSelectedApi(null);
    setNewProject({ Name: '', Description: '', APIs: [] });
  };

  const handleAddProjectClick = () => {
    setFormVisible(true);
    setShowProjects(false);
  };

  const handleAddHeader = (apiIndex) => {
    const updatedApis = [...newProject.APIs];
    updatedApis[apiIndex].Headers = updatedApis[apiIndex].Headers || [];
    updatedApis[apiIndex].Headers.push({ key: "", value: "" });
    setNewProject((prev) => ({ ...prev, APIs: updatedApis }));
  };
  
  const handleHeaderChange = (apiIndex, headerIndex, e) => {
    const { name, value } = e.target;
    const updatedApis = [...newProject.APIs];
  
    // Update the correct header's key or value
    updatedApis[apiIndex].Headers[headerIndex] = {
      ...updatedApis[apiIndex].Headers[headerIndex],
      [name]: value,
    };
  
    setNewProject((prev) => ({ ...prev, APIs: updatedApis }));
  };
  
  
  const handleDeleteHeader = (apiIndex, headerIndex) => {
    const updatedApis = [...newProject.APIs];
    updatedApis[apiIndex].Headers = updatedApis[apiIndex].Headers.filter(
      (_, i) => i !== headerIndex
    );
    setNewProject((prev) => ({ ...prev, APIs: updatedApis }));
  };
  

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  // Ensure deep cloning of APIs when adding new ones
  const handleAddApi = () => {
    setNewProject((prev) => ({
      ...prev,
      APIs: [...prev.APIs, { Name: "", Endpoint: "", Method: "" , Headers: [] }]  // Simplified API structure
    }));
  };

  const handleApiChange = (index, e) => {
    const { name, value } = e.target;
    const updatedApis = [...newProject.APIs];
  
    if (name === "Headers") {
      // Convert the input to an object
      const headersArray = value ? JSON.parse(value) : [];
      
      // Convert the array of headers to an object
      const headersObject = {};
      headersArray.forEach(header => {
        headersObject[header.key] = header.value; // Assuming header has 'key' and 'value'
      });
  
      updatedApis[index] = { ...updatedApis[index], Headers: headersObject }; // Store as an object
    } else {
      updatedApis[index] = { ...updatedApis[index], [name]: value }; // For other fields
    }
  
    setNewProject((prev) => ({ ...prev, APIs: updatedApis }));
  };
  
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userApi = localStorage.getItem('userApi');
      if (!userApi) {
        alert('User API not found in local storage');
        return;
      }
  
      const url = `http://localhost:8000/post`;
      const projectToSubmit = {
        ...newProject,
        username: userApi,
      };
  
      // Ensure Headers are correctly formatted
      projectToSubmit.APIs = projectToSubmit.APIs.map(api => ({
        ...api,
        // Convert Headers array to an object
        Headers: api.Headers.reduce((acc, header) => {
          if (header.key) { // Only add if key is present
            acc[header.key] = header.value; // Map key to value
          }
          return acc;
        }, {}),
      }));
  
      console.log('Submitting project:', projectToSubmit); // Debug log to check structure
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectToSubmit),
      });
  
      const responseBody = await response.json(); // Parse response body
      console.log("Response Body:", responseBody); // Log response body
  
      if (!response.ok) {
        throw new Error(`Failed to save project: ${responseBody.message || 'Unknown error'}`); // Use server's error message if available
      }
  
      console.log("Project Response:", responseBody);
      setProjects((prev) => [...prev, responseBody]);
  
      // Reset form and state after submission
      setNewProject({ Name: '', Description: '', APIs: [] });
      setFormVisible(false);
      setRefreshKey((prevKey) => prevKey + 1);
      setShowProjects(true);
    } catch (error) {
      alert(error.message);
    }
  };
  
  
  
  
  

  const handleDeleteProject = async (id, name) => {
    try {
      const response = await fetch(`http://localhost:8000/delete/${id}/${name}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      setRefreshKey((prevKey) => prevKey + 1);
      setProjects((prev) => prev.filter((project) => project.ID !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container maxW="container.xl" bg="white" py={10}>
       
      <VStack spacing={6} align="stretch">
        {showProjects ? (
          <>
          
         
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {projects.map((project) => (
                <Box
                  key={project.ID}
                  p={5}
                  borderWidth={1}
                  borderRadius="lg"
                  boxShadow="md"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading as="h3" size="lg" color="teal.500">
                      {project.Name}
                    </Heading>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="ghost"
                      aria-label="Delete project"
                      onClick={() => handleDeleteProject(project.Username, project.Name)}
                    />
                  </Flex>
                  <Text color="gray.600" fontSize="md">
                    {project.Description}
                  </Text>
                  {project && project.APIs && project.APIs.length > 0 && (
                    <VStack mt={4} align="stretch">
                      {project.APIs.map((api) => (
                        <Box key={api.ID} borderWidth={1} p={3} borderRadius="md">
                          <Text>
                            <strong>API Name:</strong> {api.Name}
                          </Text>
                          <Text>
                            <strong>Endpoint:</strong> {api.Endpoint}
                          </Text>
                          <Text>
                            <strong>Method:</strong> {api.Method}
                          </Text>
                          <Button
                            mt={2}
                            colorScheme="teal"
                            size="sm"
                            onClick={() => handleTestApiClick(api)}
                          >
                            Test API
                          </Button>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              ))}
            </SimpleGrid>
            <Button
              p={6}
              borderWidth={1}
              borderRadius="lg"
              width="100%"
              bg="teal.400"
              color="white"
              _hover={{ bg: "teal.500", transform: "scale(1.05)" }}
              boxShadow="md"
              onClick={handleAddProjectClick}
            >
              <Heading fontSize="2xl">⊕ Add Project</Heading>
            </Button>
          </>
        ) : (
          <Box>
            <IconButton
              onClick={handleBackToProjects}
              icon={<ArrowBackIcon />}
              aria-label="Go back"
              variant="outline"
              colorScheme="teal"
              size="lg"
              position={'absolute'}
              width={isMobile ? '20px' : ""}

              mt={isMobile ? '40px' : ""}
              left={isMobile ?6:'35px'}
              top={isMobile ? '28px':'82px'}
            />
          
            {selectedApi && (
  <ApiTester2
    initialMethod={selectedApi.Method || 'GET'} // Default to 'GET' if null
    initialUrl={selectedApi.Endpoint || ''} // Default to empty string if null
    initialHeaders={
      selectedApi.Headers
        ? Object.entries(selectedApi.Headers).map(([key, value]) => ({ key, value }))
        : [] // Default to an empty array if null
    }
    initialBody={selectedApi.Body || ''} // Default to empty string if null
    selectedApi={selectedApi} // Passing the entire API object as a prop if needed
  />
)}

{isFormVisible && (
  <Box mt={5} width={isMobile ? '60vw' : "40vw"}>
    <Heading mb={4}>Add New Project</Heading>
    <form onSubmit={handleSubmit}>
      <FormControl id="name" mb={4}>
        <FormLabel>Project Name</FormLabel>
        <Input
          type="text"
          name="Name"
          value={newProject.Name}
          onChange={handleFormChange}
          required
          border={'1px solid black'}
        />
      </FormControl>
      
      <FormControl id="description" mb={4}>
        <FormLabel>Project Description</FormLabel>
        <Textarea
          name="Description"
          value={newProject.Description}
          onChange={handleFormChange}
          required
          border={'1px solid black'}
        />
      </FormControl>

      {newProject.APIs.map((api, index) => (
        <Box key={index} borderWidth={1} p={3} borderRadius="md" mt={4}>
          <FormControl mb={2}>
            <FormLabel>API Name</FormLabel>
            <Input
              type="text"
              name="Name"
              value={api.Name}
              onChange={(e) => handleApiChange(index, e)}
              required
              border={'1px solid black'}
            />
          </FormControl>
          
          <FormControl mb={2}>
            <FormLabel>API Endpoint</FormLabel>
            <Input
              type="text"
              name="Endpoint"
              value={api.Endpoint}
              onChange={(e) => handleApiChange(index, e)}
              required
              border={'1px solid black'}
            />
          </FormControl>
          
          <FormControl mb={2}>
            <FormLabel>API Method</FormLabel>
            <Select
              name="Method"
              value={api.Method}
              onChange={(e) => handleApiChange(index, e)}
              required
              border={'0.5px solid black'}
            >
              <option value="GET" style={{ color: 'blue' }}>GET</option>
              <option value="POST" style={{ color: 'green' }}>POST</option>
              <option value="PUT" style={{ color: 'yellow' }}>PUT</option>
              <option value="DELETE" style={{ color: 'red' }}>DELETE</option>
            </Select>
          </FormControl>
          
          <FormControl mb={2}>
  <FormLabel>API Headers</FormLabel>
  {api.Headers.map((header, headerIndex) => (
    <Flex key={headerIndex} mb={2}>
      <Input
        name="key"
        value={header.key}
        onChange={(e) => handleHeaderChange(index, headerIndex, e)}
        placeholder="Header Key"
        border={'1px solid black'}
        required
      />
      <Input
        name="value"
        value={header.value}
        onChange={(e) => handleHeaderChange(index, headerIndex, e)}
        placeholder="Header Value"
        border={'1px solid black'}
        required
      />
      <IconButton
        icon={<DeleteIcon />}
        colorScheme="red"
        aria-label="Delete Header"
        onClick={() => handleDeleteHeader(index, headerIndex)}
        ml={2}
      />
    </Flex>
  ))}
  <Button
    mt={2}
    colorScheme="teal"
    onClick={() => handleAddHeader(index)}
  >
    Add Header
  </Button>
</FormControl>


          
          <FormControl mb={2}>
            <FormLabel>API Body</FormLabel>
            <Textarea
              name="Body"
              value={api.Body}
              onChange={(e) => handleApiChange(index, e)}
              placeholder="Enter API request body"
              border={'1px solid black'}
            />
          </FormControl>

          <CloseButton
            border={"0.5px solid black"}
            onClick={() =>
              setNewProject((prev) => ({
                ...prev,
                APIs: prev.APIs.filter((_, i) => i !== index),
              }))
            }
          />
        </Box>
      ))}

      <Flex flexDir={'row'} justifyContent={'space-between'}>
        <Button mt={5} type="button" colorScheme="teal" onClick={handleAddApi}>
          Add API
        </Button>
        <Button mt={5} colorScheme="teal" type="submit">
          Save Project
        </Button>
      </Flex>
    </form>
  </Box>
)}

          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default MapProject;




