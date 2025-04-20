package models

import (
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"errors"
	"golang.org/x/crypto/bcrypt"
)

func GenerateSalt() (string, error) {
	bytes := make([]byte, 16)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(bytes), nil
}

func HashPassword(password, salt string) (string, error) {
	saltedPassword := password + salt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(saltedPassword), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func ValidateUser(db *sql.DB, userID, password string) (bool, error) {
	var storedHash, salt string
	err := db.QueryRow("SELECT password_hash, salt FROM tb_user WHERE user_id = $1", userID).Scan(&storedHash, &salt)
	if err == sql.ErrNoRows {
		return false, nil
	} else if err != nil {
		return false, err
	}

	saltedPassword := password + salt
	err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(saltedPassword))
	return err == nil, nil
}

func ChangePassword(db *sql.DB, userID, newPassword string) error {
	salt, err := GenerateSalt()
	if err != nil {
		return err
	}

	hashedPassword, err := HashPassword(newPassword, salt)
	if err != nil {
		return err
	}

	_, err = db.Exec("UPDATE tb_user SET password_hash = $1, salt = $2 WHERE user_id = $3", hashedPassword, salt, userID)
	if err != nil {
		return errors.New("failed to update password")
	}
	return nil
}
