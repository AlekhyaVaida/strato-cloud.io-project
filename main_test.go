package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetUsers(t *testing.T) {
	// Create a request to pass to the handler
	req, err := http.NewRequest("GET", "/api/users", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a ResponseRecorder to record the response
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(getUsers)

	// Call the handler directly and pass our request and ResponseRecorder
	handler.ServeHTTP(rr, req)

	// Check the status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body is what we expect
	var response []User
	err = json.Unmarshal(rr.Body.Bytes(), &response)
	if err != nil {
		t.Fatal("Failed to unmarshal response:", err)
	}

	// Expected values
	expectedCount := 5
	expectedFirstUsername := "Foo Bar1"

	// Check if the response contains the correct number of users
	if len(response) != expectedCount {
		t.Errorf("expected %d users, got %d", expectedCount, len(response))
	}

	// Check if the first user has the expected name
	if len(response) > 0 && response[0].Name != expectedFirstUsername {
		t.Errorf("expected first user name to be %s, got %s", expectedFirstUsername, response[0].Name)
	}

	// Verify MFA status of users
	if !response[0].MFAEnabled {
		t.Errorf("expected first user to have MFA enabled")
	}
	if response[1].MFAEnabled {
		t.Errorf("expected second user to have MFA disabled")
	}
}

func TestCORSMiddleware(t *testing.T) {
	// Create a test HTTP handler that we'll wrap with our CORS middleware
	testHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Wrap the test handler with our CORS middleware
	handlerWithCORS := enableCORS(testHandler)

	// Create a GET request
	req, err := http.NewRequest("GET", "/api/users", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Create a ResponseRecorder to record the response
	rr := httptest.NewRecorder()

	// Call the handler
	handlerWithCORS.ServeHTTP(rr, req)

	// Check the status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check CORS headers
	expectedOrigin := "*"
	if rr.Header().Get("Access-Control-Allow-Origin") != expectedOrigin {
		t.Errorf("expected Access-Control-Allow-Origin header to be %q, got %q", 
			expectedOrigin, rr.Header().Get("Access-Control-Allow-Origin"))
	}

	// Test OPTIONS request handling
	reqOptions, err := http.NewRequest("OPTIONS", "/api/users", nil)
	if err != nil {
		t.Fatal(err)
	}

	rrOptions := httptest.NewRecorder()
	handlerWithCORS.ServeHTTP(rrOptions, reqOptions)

	// Check the status code for OPTIONS should be 200 OK
	if status := rrOptions.Code; status != http.StatusOK {
		t.Errorf("OPTIONS handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
} 