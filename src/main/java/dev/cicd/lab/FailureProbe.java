package dev.cicd.lab;
public final class FailureProbe {
 private FailureProbe() {}
 public static String check(){ String value;if(System.nanoTime()<0L)value="never";return value; }
}
