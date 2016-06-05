package cwa.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HelloWorldPageController {

	// page mapped to: localhost:8080/CWA/hello
	// =>
	@RequestMapping(value = "/hello", method = RequestMethod.GET)
	public String serachPage() {
		return "myHello.html";
	}
    @RequestMapping(value = "/", method = RequestMethod.GET)
	public String indexPage() {
		return "search.html";
	}
    
}
