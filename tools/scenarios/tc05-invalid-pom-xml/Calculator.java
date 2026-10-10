package dev.cicd.lab;

/** Healthy source used in all scenarios except the deliberate syntax failure. */
public final class Calculator {
    private Calculator() {}

    public static int add(int a, int b) {
        return a + b;
    }
}
