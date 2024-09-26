package main

import (
	"backApi/models"
	"backApi/routes"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/subosito/gotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func init() {
	// Load environment variables from .env file
	gotenv.Load()
}

func main() {
	r := gin.Default()
	var err error
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	// ttp://localhost:3000

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "*")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	r.Any("/api", func(c *gin.Context) {
		// Get the base URL from the query parameters
		baseURL := c.Query("url")
		fmt.Println("==>", baseURL)
		if baseURL == "" {
			c.String(http.StatusBadRequest, "Missing 'url' query parameter")
			return
		}

		// Create a new request to the external API
		req, err := http.NewRequest(c.Request.Method, baseURL, c.Request.Body)
		if err != nil {
			c.String(http.StatusInternalServerError, "Failed to create request: %s", err.Error())
			return
		}

		// Copy headers from the original request
		for key, value := range c.Request.Header {
			req.Header[key] = value
		}

		// Send the request
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			c.String(http.StatusBadGateway, "Failed to send request: %s", err.Error())
			return
		}
		defer resp.Body.Close()

		// Set the response status and headers
		c.Status(resp.StatusCode)
		for key, value := range resp.Header {
			c.Writer.Header()[key] = value
		}

		// Copy the response body
		io.Copy(c.Writer, resp.Body)
	})
	if err := db.AutoMigrate(&models.UserApi{}, &models.Project{}, &models.API{}); err != nil {
		log.Fatal(err)
	}

	routes.UrlPath(r, db)

	r.Run(":8000") // Start the server on port 8000
}
