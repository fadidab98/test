package dev.cicd.lab;

/** Deliberate Java syntax error: a missing semicolon in the return statement. */
public final class Calculator {
    private Calculator() {}

    public static int add(int a, int b) {
        return a + b
    }
}
