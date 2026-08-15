package com.hilaldemir.sezzle_the_calculator;

import com.hilaldemir.sezzle_the_calculator.controller.CalculatorController;
import com.hilaldemir.sezzle_the_calculator.dto.CalculatorRequest;
import com.hilaldemir.sezzle_the_calculator.dto.CalculatorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class SezzleTheCalculatorApplicationTests {

    private final CalculatorController controller = new CalculatorController();

    @Test
    void contextLoads() {
    }

    @Test
    public void testSuccessfulCalculation() {
        CalculatorRequest request = new CalculatorRequest();
        request.setExpression("5 + 5 * 2");

        ResponseEntity<CalculatorResponse> response = controller.calculate(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(15.0, response.getBody().getResult());
    }

    @Test
    public void testAdvancedOperations() {
        CalculatorRequest request = new CalculatorRequest();
        request.setExpression("2 ** 3 + SQRT(16)");

        ResponseEntity<CalculatorResponse> response = controller.calculate(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(12.0, response.getBody().getResult());
    }

    @Test
    public void testInvalidExpression() {
        CalculatorRequest request = new CalculatorRequest();
        request.setExpression("5 + * 2");

        ResponseEntity<CalculatorResponse> response = controller.calculate(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getError());
    }
}
