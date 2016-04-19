package de.iisys.mmis.rssparser;

import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import de.iisys.mmis.logging.ServerLogfile;
import de.l3s.boilerpipe.extractors.ArticleExtractor;

class BoilerpipeThread extends Thread {
	private Item itemObj;
	private ServerLogfile errorFile;

	public BoilerpipeThread(Item itemObj, ServerLogfile errorFile) {
		this.itemObj = itemObj;
		this.errorFile = errorFile;
	}

	@Override
	public void run () {
		URL itemUrl = null;
		HttpURLConnection con = null;
		//StringBuilder htmlCode = new StringBuilder(1024); Auskommentiert von Michael Gerber 04.12.2014
		try {
			synchronized (itemObj) {
				itemUrl = new URL (itemObj.getLink());
				con = (HttpURLConnection) itemUrl.openConnection();
				Pattern p = Pattern.compile("text/html;+charset=([^\\s]+)\\s*");
				Matcher m = p.matcher(con.getContentType());
				String charset = m.matches() ? m.group(1) : "UTF-8";
				InputStreamReader isr = new InputStreamReader(con.getInputStream(), charset);
				itemObj.setText(ArticleExtractor.INSTANCE.getText(isr));
				itemObj.notify();
			}
		} catch(Exception e) {
			errorFile.writeEvent("BoilerpipeThread", "run", "Exception: " + e);
		} finally {
			if (con != null) con.disconnect();		
		}
	}
}

