package main

import (
	"log"

	"modernbank_user/config"
	"modernbank_user/db"
	"modernbank_user/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize database
	db.InitDB(cfg.DatabaseURL)

	// Setup Gin router
	r := gin.Default()
	// 트레일링 슬래시 자동 제거 방지
	r.RemoveExtraSlash = true
	// 자동 리다이렉트 비활성화
	r.RedirectTrailingSlash = false
	r.RedirectFixedPath = false

	// Swagger UI 경로 추가
	//r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	// 요청이 들어올 때마다 URL을 출력
	r.Use(func(c *gin.Context) {
		log.Printf("Incoming request: %s %s", c.Request.Method, c.Request.URL.Path)
		c.Next()
	})

	routes.SetupRoutes(r)

	// Start server
	log.Printf("Server is running on %s", cfg.ServerPort)
	if err := r.Run(cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
