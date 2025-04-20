package handlers

import (
	"log"

	"database/sql"
	"net/http"

	"modernbank_user/models"
    "modernbank_user/utils"

	"github.com/gin-gonic/gin"
)

type CreateUserRequest struct {
	UserID     string `json:"user_id"`
	Username   string `json:"username"`
	Password   string `json:"password"`
}

type ChangePasswordRequest struct {
	//UserID      string `json:"user_id"`      // 사용자 ID
	OldPassword string `json:"old_password"`   // 기존 비밀번호
	NewPassword string `json:"new_password"`   // 새 비밀번호
}

func CreateUser(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateUserRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
			return
		}

		tx, err := db.Begin()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction", "details": err.Error()})
			return
		}
		defer tx.Rollback()

		salt, err := models.GenerateSalt()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to generate salt",
				"details": err.Error(),
			})
			return
		}

		hashedPassword, err := models.HashPassword(req.Password, salt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to hash password",
				"details": err.Error(),
			})
			return
		}

		_, err = tx.Exec("INSERT INTO tb_user (user_id, username, password_hash, salt) VALUES ($1, $2, $3, $4)",
			req.UserID, req.Username, hashedPassword, salt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to insert user",
				"details": err.Error(),
			})
			return
		}

		if err := tx.Commit(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to commit transaction",
				"details": err.Error(),
			})
			return
		}


        token, err :=   utils.GenerateJWT(req.UserID)
        if err != nil {
            log.Printf("UserHandler: Failed to generate token: %v", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
            return
        }
        log.Println("UserHandler: Setting JWT token in cookie")
        utils.SetJWTCookie(c, token)

		c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
	}
}

// ChangePassword allows users to update their password
func ChangePassword(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.Param("user_id") // URL에서 user_id 추출
		var req ChangePasswordRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		// Validate the old password
		valid, err := models.ValidateUser(db, userID, req.OldPassword)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		if !valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user_id or password"})
			return
		}

		// Update the password
		err = models.ChangePassword(db, userID, req.NewPassword)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
	}
}

// GetUsername returns the username for a given user_id
func GetUsername(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        userID := c.Param("user_id") // URL에서 user_id 파라미터 추출

        // 데이터베이스에서 username 조회
        var username string
        err := db.QueryRow("SELECT username FROM tb_user WHERE user_id = $1", userID).Scan(&username)
        
        if err != nil {
            if err == sql.ErrNoRows {
                // 사용자를 찾을 수 없는 경우
                c.JSON(http.StatusNotFound, gin.H{
                    "error": "User not found",
                })
                return
            }
            // 기타 데이터베이스 오류
            c.JSON(http.StatusInternalServerError, gin.H{
                "error": "Failed to retrieve username",
                "details": err.Error(),
            })
            return
        }

        // 성공적으로 username을 찾은 경우
        c.JSON(http.StatusOK, gin.H{
            "user_id": userID,
            "username": username,
        })
    }
}