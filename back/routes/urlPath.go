package routes

import (
	"backApi/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UrlPath(r *gin.Engine, db *gorm.DB) {
	r.POST("/create", func(c *gin.Context) {
		controllers.Create(c, db)
	})
	r.POST("/login", func(c *gin.Context) {
		controllers.Login(c, db)
	})

	r.GET("/get/:username", func(c *gin.Context) {
		controllers.GetAll(c, db)
	})

	r.POST("/post", func(c *gin.Context) {
		controllers.PostAll(c, db)
	})
	r.DELETE("/delete/:username/:name", func(c *gin.Context) {
		controllers.DeleteOne(c, db)
	})
	r.PUT("/update/:id", func(c *gin.Context) {
		controllers.UpdateOne(c, db)
	})

}
