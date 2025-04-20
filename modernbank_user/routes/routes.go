package routes

import (
	"fmt"
	"modernbank_user/db"
	"modernbank_user/handlers"
	"modernbank_user/middleware"
    // "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	fmt.Println("setup route start...")
	//CORS 추가
	fmt.Println("setting cors")
	r.Use(middleware.CORSMiddleware())
	// r.Use(cors.Default())
	fmt.Println("cors end")
    // 기본 경로를 /modernbank/users로 설정
    baseRouter := r.Group("/modernbank/user")
    {
		baseRouter.OPTIONS("/", func(c *gin.Context) {
            c.Status(204) // Preflight 요청에 대한 응답
        })

        // Public routes
		// 로그인
        baseRouter.POST("/login", handlers.LoginHandler(db.DB))
		// 사용자 조회
		baseRouter.GET("/username/:user_id", handlers.GetUsername(db.DB))
		// 사용자 생성
        baseRouter.POST("", handlers.CreateUser(db.DB)) 

        // Protected routes
        protected := baseRouter.Group("/api")
        protected.Use(middleware.JWTAuthMiddleware())
        protected.PATCH("/:user_id/password", handlers.ChangePassword(db.DB))
    }

}
