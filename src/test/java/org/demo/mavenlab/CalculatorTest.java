package org.demo.mavenlab;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CalculatorTest {

    @Test
    void addsTwoNumbers() {
        assertEquals(7, Calculator.add(3, 4));
    }

    @Test
    void detectsIntegerOverflow() {
        assertThrows(ArithmeticException.class, () -> Calculator.add(Integer.MAX_VALUE, 1));
    }
}
