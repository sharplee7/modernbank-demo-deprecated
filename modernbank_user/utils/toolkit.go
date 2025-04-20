package utils

import (
    "encoding/base64"
    "fmt"
    "log"
    "os"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v4"
)

func GenerateJWT(userID string) (string, error) {
    log.Println("GenerateJWT: Started generating JWT")

    secret := os.Getenv("JWT_SECRET")
    decodedSecret, err := base64.StdEncoding.DecodeString(secret)
    if err != nil {
        log.Printf("GenerateJWT: Failed to decode secret: %v", err)
        return "", fmt.Errorf("failed to decode secret: %v", err)
    }

    claims := jwt.MapClaims{
        "user_id": userID,
        "exp":     time.Now().Add(time.Hour * 24).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(decodedSecret)

    if err != nil {
        log.Printf("GenerateJWT: Failed to sign token: %v", err)
        return "", fmt.Errorf("failed to sign token: %v", err)
    }

    log.Printf("GenerateJWT: Generated token for user %s", userID)
    return tokenString, nil
}

func SetJWTCookie(c *gin.Context, token string) {
    // c.SetCookie("jwt_token", token, 3600*24, "/", "localhost", false, true)
    c.SetCookie("jwt_token", token, 3600*24, "/", "", false, true)
}
