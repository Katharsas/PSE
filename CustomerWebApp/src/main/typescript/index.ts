class HelloClass {
	name: string;
	constructor(name: string) {
        this.name = name;
    }

	greet() {
		return "Hello World! My name is " + this.name + " !";
	}
}

$(document).ready(function() {
    let greeter = new HelloClass("Bob");
    console.log(greeter.greet());
    console.log("The End.");
});