package main

import (
	"encoding/json"
	"log"
	"math"
	"net/http"

	"github.com/expr-lang/expr"
	"github.com/rs/cors"
)

// React'ten gelecek JSON formatı
type CalcRequest struct {
	Expression string `json:"expression"`
}

// React'e döneceğimiz JSON formatı
type CalcResponse struct {
	Result float64 `json:"result,omitempty"`
	Error  string  `json:"error,omitempty"`
}

func calculateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CalcRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSON(w, http.StatusBadRequest, CalcResponse{Error: "Geçersiz JSON formatı"})
		return
	}

	env := map[string]interface{}{
		"sqrt": math.Sqrt,
	}

	program, err := expr.Compile(req.Expression, expr.Env(env))
	if err != nil {
		sendJSON(w, http.StatusBadRequest, CalcResponse{Error: "Geçersiz matematiksel ifade"})
		return
	}

	result, err := expr.Run(program, env)
	if err != nil {
		sendJSON(w, http.StatusBadRequest, CalcResponse{Error: "Hesaplama hatası"})
		return
	}

	var finalResult float64
	switch v := result.(type) {
	case float64:
		finalResult = v
	case int:
		finalResult = float64(v)
	case int64:
		finalResult = float64(v)
	default:
		sendJSON(w, http.StatusBadRequest, CalcResponse{Error: "Bilinmeyen sonuç tipi"})
		return
	}

	sendJSON(w, http.StatusOK, CalcResponse{Result: finalResult})
}

func sendJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/calculate", calculateHandler)

	handler := cors.Default().Handler(mux)

	log.Println("Go Backend sunucusu 8080 portunda başlatıldı...")

	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
