package dev.cicd.lab;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@RestController public class GreetingController {
 private final GreetingService service;
 public GreetingController(GreetingService service) { this.service=service; }
 @GetMapping("/greeting") public String greet(@RequestParam(defaultValue="DevOps") String name) { return service.greet(name); }
}
