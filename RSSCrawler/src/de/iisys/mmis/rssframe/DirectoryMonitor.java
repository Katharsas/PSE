package de.iisys.mmis.rssframe;

import java.io.File;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Observable;

import de.iisys.mmis.logging.ServerLogfile;

public class DirectoryMonitor extends Observable implements Runnable {
	private ServerLogfile errorFile;
	private Thread thread;
	private int interval;
	private File dir;
	private boolean stop = false;
	private HashMap<File,Long> fileMap = new HashMap<File,Long>(100);
	private LinkedList<File> updatedFiles;

	public DirectoryMonitor (String dir, int interval, ServerLogfile errorFile) {
		this.dir = new File(dir);
		this.interval = interval;
		thread = new Thread(this);
		this.errorFile = errorFile;
	}

	public void startMonitor() {
		thread.start();
	}

	public void stopMonitor() {
		stop = true;
	}

	@Override
	public void run() {
		try {
			File[] files;
			while (!stop) {
				updatedFiles = new LinkedList<File>();
				files = dir.listFiles();

				for (int i = 0; i < files.length; i++) {
					if (files[i].isFile()) {
						if (fileMap.containsKey(files[i])) {
							if (fileMap.get(files[i]).longValue() < files[i]
									.lastModified()) {
								fileMap.put(files[i],
										new Long(files[i].lastModified()));
								updatedFiles.add(files[i]);
							}
						} else {
							fileMap.put(files[i],
									new Long(files[i].lastModified()));
							updatedFiles.add(files[i]);
						}
					}
				}
				if (!updatedFiles.isEmpty()) {
					File[] fa = new File[0];
					fa = updatedFiles.toArray(fa);
					setChanged();
					notifyObservers(fa);
				}
				try {
					Thread.sleep(interval);
				} catch (InterruptedException e) {
					return;
				}
			}
		} catch (Throwable t) {
			errorFile.writeEvent("DirectoryMonitor", "run",
					"Unhandled exception: " + t);
			System.exit(0);
		}
	}
}
