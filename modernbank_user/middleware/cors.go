package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        origin := c.Request.Header.Get("Origin")
        
        // Origin 주소를 콘솔에 출력
        log.Printf("Received request from origin: %s", origin)

        // 모든 origin을 허용
        c.Header("Access-Control-Allow-Origin", origin)
        c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        // c.Header("Access-Control-Expose-Headers", "*")
        c.Header("Access-Control-Allow-Credentials", "true")

        // Preflight 요청 처리
        if c.Request.Method == http.MethodOptions {
            log.Printf("Handling OPTIONS request from origin: %s", origin)
            c.AbortWithStatus(http.StatusNoContent)
            return
        }

        c.Next()
    }
}