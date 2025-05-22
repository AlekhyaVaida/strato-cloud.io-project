package main

import (
	"encoding/json"
	"net/http"
)

type User struct {
	Name              string `json:"name"`
	CreatedAt         string `json:"created_at"`         // YYYY-MM-DD
	PasswordChangedAt string `json:"password_changed_at"`// YYYY-MM-DD
	LastAccessAt      string `json:"last_access_at"`     // YYYY-MM-DD
	MFAEnabled        bool   `json:"mfa_enabled"`
}

// CORS middleware to allow requests from the React app
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		next(w, r)
	}
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	users := []User{
		{
			Name:              "Foo Bar1",
			CreatedAt:         "2020-10-01",
			PasswordChangedAt: "2021-10-01",
			LastAccessAt:      "2025-01-04",
			MFAEnabled:        true,
		},
		{
			Name:              "Foo1 Bar1",
			CreatedAt:         "2019-09-20",
			PasswordChangedAt: "2019-09-22",
			LastAccessAt:      "2025-02-08",
			MFAEnabled:        false,
		},
		{
			Name:              "Foo2 Bar2",
			CreatedAt:         "2022-02-03",
			PasswordChangedAt: "2022-02-03",
			LastAccessAt:      "2025-02-12",
			MFAEnabled:        false,
		},
		{
			Name:              "Foo3 Bar3",
			CreatedAt:         "2023-03-07",
			PasswordChangedAt: "2023-03-10",
			LastAccessAt:      "2022-01-03",
			MFAEnabled:        true,
		},
		{
			Name:              "Foo Bar4",
			CreatedAt:         "2018-04-08",
			PasswordChangedAt: "2020-04-12",
			LastAccessAt:      "2022-10-04",
			MFAEnabled:        false,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func main() {
	http.HandleFunc("/api/users", enableCORS(getUsers))
	
	port := ":8080"
	println("Server running on port", port)
	http.ListenAndServe(port, nil)
}
