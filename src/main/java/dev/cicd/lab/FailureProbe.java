package dev.cicd.lab;
public final class FailureProbe {
 private FailureProbe() {}
 public static String check(){ java.nio.file.Files.readString(java.nio.file.Path.of("README.md"));return "ok"; }
}
