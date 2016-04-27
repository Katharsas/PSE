package de.iisys.mmis.rssparser;

public class BoilerpipeMonitor extends Thread {
	private BoilerpipeThread boilerpipe;
	private int waitingTime;
	
	BoilerpipeMonitor(BoilerpipeThread boilerpipe, int waitingTime) {
		this.boilerpipe = boilerpipe;
		this.waitingTime = waitingTime; 
	}
	
	@SuppressWarnings("deprecation")
	@Override
	public void run() {
		try {
			sleep(waitingTime);
		}
		catch (InterruptedException e) {
		}
		boilerpipe.stop();
	}
}