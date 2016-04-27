package de.iisys.mmis.rssviewer;

import de.iisys.mmis.logging.ServerLogfile;
import de.iisys.mmis.rssparser.*;
import de.iisys.mmis.rssframe.*;

import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.net.*;
import java.util.*;

import javax.swing.*;
import javax.swing.event.*;

@SuppressWarnings("serial")
public class RSSOutput extends JFrame implements Observer {
	private static ServerLogfile messageFile;
	private static ServerLogfile errorFile;
	private static String notificationdir;
	private JPanel contentPane;
	private DefaultListModel<NewsItem> dlm = new DefaultListModel<NewsItem>();
	private JList<NewsItem> items = new JList<NewsItem>(dlm);
	private JScrollPane scrollPane = new JScrollPane(items);
	private JEditorPane display = new JEditorPane();
	private JLabel timeLabel = new JLabel();
	private JButton urlButton = new JButton();
	private Desktop desktop = Desktop.getDesktop();
	private TreeSet<NewsItem> set = new TreeSet<NewsItem>(new NewsItemComparator());


	public RSSOutput()
	{
		contentPane = (JPanel) getContentPane();
		contentPane.setLayout(new BorderLayout());
		contentPane.add(timeLabel,BorderLayout.NORTH);
		contentPane.add(scrollPane,BorderLayout.WEST);
		contentPane.add(display,BorderLayout.CENTER);
		contentPane.add(urlButton,BorderLayout.SOUTH);

		scrollPane.setMinimumSize(new Dimension(300,400));
		scrollPane.setPreferredSize(new Dimension(300,400));
		scrollPane.setMaximumSize(new Dimension(300,400));

		items.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
		items.setFont(new Font("Arial", Font.PLAIN, 10));

		display.setEditable(false);
		display.setContentType("text/html");

		items.addListSelectionListener(new ListSelectionListener() {
			public void valueChanged(ListSelectionEvent e) {
				NewsItem item = items.getSelectedValue();
				if (item != null) {
					timeLabel.setText(item.getPubDate().toString());
					display.setText(item.getDescription());
					urlButton.setText(item.getLink());
				}
			}
		});

		urlButton.addActionListener(new ActionListener() {;
		public void actionPerformed(ActionEvent e) {
			try {
				desktop.browse(new URI(urlButton.getText()));
			} catch(Exception exception) {
				// nothing
			}
		}
		});

		setTitle("RSS News");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}

	public void update(Observable o, Object arg) {
		RSSParser parser = new RSSParser(messageFile, errorFile);
		BufferedReader reader;
		String filename;
		File[] notFiles = (File[]) arg;
		
		for (int i = 0; i < notFiles.length; i++) {
			try {
				reader = new BufferedReader(new FileReader(notFiles[i]));
				filename = reader.readLine();
				while (filename != null) {
					set.add(parser.parseArchiveFile(new File(filename)));
					filename = reader.readLine();
				}
				reader.close();
				notFiles[i].delete();
				
			} catch (IOException e) {
				System.err.println("Failed to access file in function 'update' of class 'RSSOutput': " + e);
			}
		}
		
		dlm = new DefaultListModel<NewsItem>();
	    for (NewsItem nitem : set) {
	        dlm.addElement(nitem);
	    }
		
		Runnable run = new Runnable(){
			public void run(){
				items.setModel(dlm);
				items.setSelectedIndex(0);
			}
		};
		EventQueue.invokeLater(run);
	}

	public static void main(String args[]) throws IOException {
		String currdir = new java.io.File( "." ).getCanonicalPath();
		String configFile =  currdir + "/client.properties";
		Properties properties = new Properties();
		properties.load(new FileReader(configFile));
		notificationdir = properties.getProperty("notificationdir");
		messageFile = new ServerLogfile(currdir + "/messages.log");
		errorFile = new ServerLogfile(currdir + "/errors.log");
		RSSOutput output = new RSSOutput();
		DirectoryMonitor monitor = new DirectoryMonitor(notificationdir, 1000,errorFile);
		monitor.addObserver(output);
		monitor.startMonitor();
		output.setSize(600,400);
		output.setVisible(true);
	}
}