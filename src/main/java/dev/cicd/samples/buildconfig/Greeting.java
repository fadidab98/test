package dev.cicd.samples.buildconfig;

public final class Greeting {
    private Greeting() {
    }

    public static String message() {
        return "Java 17 source code compiles successfully.";
    }
}
