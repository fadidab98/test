package org.demo.mavenlab;

/** Small working class; the intended failure is in Maven dependency resolution, not Java code. */
public final class Calculator {
    private Calculator() {
    }

    public static int add(int left, int right) {
        return Math.addExact(left, right);
    }
}
