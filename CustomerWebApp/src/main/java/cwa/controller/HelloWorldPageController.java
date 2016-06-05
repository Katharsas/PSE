package cwa.controller;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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
    
    @RequestMapping(value = "/post" , method = RequestMethod.POST)
    @ResponseBody
    public String parse_post(@RequestBody String json) throws UnsupportedEncodingException {
    
        String json_url_decoded = java.net.URLDecoder.decode(json, "UTF-8");
        try(  PrintWriter out = new PrintWriter( "C:/Users/Daniel/Documents/PSE/CustomerWebApp/src/main/java/cwa/controller/log.txt" )  ){
            out.println( json_url_decoded );
        }catch (FileNotFoundException ex) {
            //Logger.getLogger(HelloWorldPageController.class.getName()).log(Level.SEVERE, null, ex);
        }
       String result = "{'name':'John Johnson','street':'Oslo West 16','phone':'555 1234567'}";
      
      
		return json_url_decoded;//result;
    }
   
    
}
