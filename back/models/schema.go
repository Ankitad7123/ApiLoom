package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type UserApi struct {
	gorm.Model
	Username string
	Password string
}

type Project struct {
	gorm.Model
	Name        string
	Username    string
	Description string
	APIs        []API `gorm:"foreignKey:ProjectID"`
	UserID      uint
}

type API struct {
	gorm.Model

	Name      string
	Endpoint  string
	Method    string
	Headers   datatypes.JSONMap `gorm:"type:jsonb"` // Store Headers as JSON
	Body      string
	ProjectID uint
}
