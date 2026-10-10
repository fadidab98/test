package dev.cicd.lab;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
class GreetingServiceTest {
 @Test void greetsPipeline() { assertEquals("Hello, Pipeline!",new GreetingService().greet("Pipeline")); }
 @Test void greetsSpring() { assertEquals("Hello, Spring Boot!",new GreetingService().greet("Spring Boot")); }
}
