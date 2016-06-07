package util;

//Arbeitet mit Objecten, die das Interface Comparable haben, sortiert aufsteigend

import java.io.Serializable;
import java.util.Iterator;
import java.util.LinkedList;

public class Container< Item extends Comparable > implements Iterable, Serializable{

	private LinkedList< Item > con;

	//Container erzeugen mithilfe der bezogenen Daten
	public Container (){

		this.con = new LinkedList< Item >();

	}

	//-----------------------------------------
	/*Methoden*/

	/**Fuegt ein Item in die Liste ein; hier wird bereits richtig einsortiert, keine Sortiermethode noetig*/
	public boolean addItem( Item toAdd ){

            if( this.searchItem( toAdd ) == -1 ){

                for( int i = 0; i < con.size(); i++ ){
                    
                    if( toAdd.compareTo( con.get( i ) ) < 0 ){
                	con.add( i, toAdd );
                	return true;
                    }

                }//Ende for
                
                //Wenn alle Elemente kleiner sind
                con.addLast( toAdd );
                return true;
                
		}//Ende if-search

		return false; //wird zurueckgegeben, wenn Objekt bereits existiert
	}

	/**Aendert den Inhalt eines Events*/
	public boolean changeContent( Item toDelete, Item newItem ){

		if ( this.delItem( toDelete ) )
			return this.addItem( newItem );
		else
			return false;

	}

	/**Loescht ein Item*/
	public boolean delItem( Item toDelete ){

		int index = this.searchItem( toDelete );

		if( index > -1 ){
			con.remove( index );
			return true;
		}else
			return false;

	}
	
	public Iterator iterator(){
		
		return con.iterator();
		
	}

	/**Hilfsmethode zum Auffinden, gibt den index zurueck*/
	private int searchItem( Item toSearch ){

		for( int i = 0; i < con.size(); i++){
		    if( con.get( i ).compareTo( toSearch ) == 0 ){  return i; }
        }//Ende for
        return -1;

	}
        

	//----------------------------------------
	/**Getter & Setter*/
	public LinkedList< Item > getCon(){
		return this.con;
	}
        
        public int getSize(){
            return this.con.size();
        }

	public void setCon( LinkedList< Item > newCon ){
		this.con = newCon;
	}

}