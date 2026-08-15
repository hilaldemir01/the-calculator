package com.hilaldemir.sezzle_the_calculator.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CalculatorResponse {
    private Double result;
    private String error;

    public CalculatorResponse(Double result, String error) {
        this.result = result;
        this.error = error;
    }

    public Double getResult() {
        return result;
    }

    public String getError() {
        return error;
    }
}
