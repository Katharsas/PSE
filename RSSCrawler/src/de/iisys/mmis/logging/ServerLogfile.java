package de.iisys.mmis.logging;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import de.iisys.mmis.rssServer.RSSThread;

public class ServerLogfile {
	
	private DateFormat formatter = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.ENGLISH);
	private File file;
	
	public ServerLogfile(String filename) {
		file = new File(filename);
	}
	
	public void writeEvent(String className, String method, String message) {
		try {
			Date date = new Date(System.currentTimeMillis());
			String s = 	formatter.format(date) + ": " +
						"class " + className + ", " +
						"method " + method + ", " +
						message + "\r\n";
			if(RSSThread.verbose) {
				System.out.println(s);
			}
			FileWriter serverLogfile = new FileWriter(file,true);
			serverLogfile.write(s);
			serverLogfile.close();
		} catch (IOException e) {
			e.printStackTrace();
		}				
	}
	

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		ServerLogfile logfile = new ServerLogfile("testlog");
		logfile.writeEvent("Testclass", "Testmethod", "Simple test message");
		logfile.writeEvent("Otherclass", "Othermethod", "Other test message");
	}

}
