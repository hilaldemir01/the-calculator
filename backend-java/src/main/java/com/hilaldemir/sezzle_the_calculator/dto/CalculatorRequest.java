package com.hilaldemir.sezzle_the_calculator.dto;

public class CalculatorRequest {
    private String calculation;

    public String getExpression() {
        return calculation;
    }

    public void setExpression(String calculation) {
        this.calculation = calculation;
    }
}
