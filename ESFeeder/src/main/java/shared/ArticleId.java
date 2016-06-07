package shared;

import java.util.Objects;
import java.lang.Comparable;
import java.lang.ClassCastException;
import java.lang.NullPointerException;

public class ArticleId implements Comparable{

    private final String id;

    public ArticleId(String id) {
        this.id = id;
    }

	@Override
	public int compareTo(Object that) throws ClassCastException, NullPointerException{
		
		 if (that == null) {
            throw new NullPointerException();
        }
        if (this.getClass() != that.getClass()) {
            throw new ClassCastException();
        }      
		return this.getId().compareTo( ((ArticleId) that).getId());
	}
		

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 37 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (this.getClass() != obj.getClass()) {
            return false;
        }
        final ArticleId other = (ArticleId) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }

    public String getId() {
        return id;
    }

}