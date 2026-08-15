package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCalculateHandler(t *testing.T) {
	tests := []struct {
		name         string
		expression   string
		expectedCode int
		expectedRes  float64
		expectError  bool
	}{
		{"Toplama", "5+5", http.StatusOK, 10, false},
		{"İşlem Önceliği", "2+3*4", http.StatusOK, 14, false},
		{"Üslü Sayı", "2**3", http.StatusOK, 8, false},
		{"Karekök", "sqrt(16)", http.StatusOK, 4, false},
		{"Yüzde (React formatı)", "50*(20/100)", http.StatusOK, 10, false},
		{"Geçersiz İfade Hata Kontrolü", "5+*2", http.StatusBadRequest, 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			reqBody := CalcRequest{Expression: tt.expression}
			body, _ := json.Marshal(reqBody)

			req, err := http.NewRequest("POST", "/api/calculate", bytes.NewBuffer(body))
			if err != nil {
				t.Fatal(err)
			}

			rr := httptest.NewRecorder()

			handler := http.HandlerFunc(calculateHandler)
			handler.ServeHTTP(rr, req)

			if status := rr.Code; status != tt.expectedCode {
				t.Errorf("The expected status code %v, but %v was received", tt.expectedCode, status)
			}

			var res CalcResponse
			json.NewDecoder(rr.Body).Decode(&res)

			if tt.expectError {
				if res.Error == "" {
					t.Errorf("The expected error message was not received")
				}
			} else {
				if res.Result != tt.expectedRes {
					t.Errorf("The expected result %v, but %v was received", tt.expectedRes, res.Result)
				}
			}
		})
	}
}
