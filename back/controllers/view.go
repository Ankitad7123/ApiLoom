package controllers

import (
	"backApi/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Create a new user
func Create(c *gin.Context, db *gorm.DB) {
	var user models.UserApi

	// Bind the incoming JSON to the user model
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create the user in the database
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

// User login
func Login(c *gin.Context, db *gorm.DB) {
	var user models.UserApi
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// Bind the login details
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find the user by username
	if err := db.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Check if the password matches (Assuming password is stored in plain text for now)
	if user.Password != input.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

// Get all projects for a user
func GetAll(c *gin.Context, db *gorm.DB) {
	username := c.Param("username")

	var projects []models.Project

	// Find the user by username
	if res := db.Preload("APIs").Where("username = ?", username).Find(&projects).Error; res != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Get all projects related to the user

	c.JSON(http.StatusOK, gin.H{"res": projects})
}

// Create a new project
func PostAll(c *gin.Context, db *gorm.DB) {
	var project models.Project

	// Bind the project data from JSON
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create the project in the database
	if err := db.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project created successfully", "project": project})
}

// Delete an API by ID
func DeleteOne(c *gin.Context, db *gorm.DB) {
	username := c.Param("username") // Get the username from the URL
	projectName := c.Param("name")  // Get the project name from the URL
	// Get the API ID from the URL

	var api models.Project

	// First, find the API by ID
	if err := db.Where("username = ? AND name = ?", username, projectName).First(&api).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "API not found"})
		return
	}

	// Delete the API
	if err := db.Delete(&api).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete API"})
		return
	}

	// Retrieve all APIs for the specified username and project name, sorted by name
	var apis []models.Project
	if err := db.Where("username = ? AND name = ?", username, projectName).Order("name").Find(&apis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve APIs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "API deleted successfully", "remainingAPIs": apis})
}

// Update an API by ID
func UpdateOne(c *gin.Context, db *gorm.DB) {
	projectID := c.Param("id")
	var project models.Project

	// Find the project by ID
	if err := db.Preload("APIs").First(&project, projectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	// Bind the updated project data from JSON
	var updatedProject models.Project
	if err := c.ShouldBindJSON(&updatedProject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update project fields
	project.Name = updatedProject.Name
	project.Description = updatedProject.Description
	project.Username = updatedProject.Username
	project.UserID = updatedProject.UserID

	// Explicitly delete old APIs
	if err := db.Where("project_id = ?", project.ID).Delete(&models.API{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old APIs"})
		return
	}

	// Save new APIs and associate them with the project
	for _, api := range updatedProject.APIs {
		api.ProjectID = project.ID // Ensure the ProjectID is set correctly
		if err := db.Save(&api).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update APIs"})
			return
		}
	}

	// Save the updated project
	if err := db.Save(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully", "project": project})
}
