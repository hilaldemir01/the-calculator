package com.hilaldemir.sezzle_the_calculator.controller;

import com.hilaldemir.sezzle_the_calculator.dto.CalculatorRequest;
import com.hilaldemir.sezzle_the_calculator.dto.CalculatorResponse;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CalculatorController {

    @PostMapping("/calculate")
    public ResponseEntity<CalculatorResponse> calculate(@RequestBody CalculatorRequest request) {
        try {
            if (request.getExpression() == null || request.getExpression().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new CalculatorResponse(null, "İfade boş olamaz"));
            }

            String sanitizedExpr = request.getExpression().replace("**", "^");

            Expression exp = new ExpressionBuilder(sanitizedExpr).build();
            double result = exp.evaluate();

            return ResponseEntity.ok(new CalculatorResponse(result, null));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new CalculatorResponse(null, "Invalid expression or division by zero error"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new CalculatorResponse(null, "Calculation Error : "+e.getMessage()));
        }
    }
}