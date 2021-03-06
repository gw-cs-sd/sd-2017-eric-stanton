package models.common;

import com.avaje.ebean.Model;
import com.avaje.ebean.annotation.CreatedTimestamp;
import com.avaje.ebean.annotation.UpdatedTimestamp;
import play.data.validation.Constraints.Required;
import utilities.common.NameGenerator;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Prompt extends Model {
	/********************************
	 FIELDS
	 ********************************/
	/* Universal */
	/*===========*/
	@Id
	public Long id;

	@Required
	public boolean retired = false;

	@CreatedTimestamp
	public Timestamp createdTime;

	@UpdatedTimestamp
	public Timestamp updatedTime;


	/* Specific */
	/*===========*/
	@Required
	public String text;

	
	/********************************
	 CONSTRUCTORS
	 ********************************/
	
	public Prompt(String text) {
		this.text = text;
	}
	
	
	/********************************
	 FINDER
	 ********************************/
	//Initialize Ebean Finder
	public static Finder<Long, Prompt> find = new Finder<Long, Prompt>(Prompt.class);


	/********************************
	 CREATE / DELETE 
	 ********************************/
	public static Prompt create(Prompt prompt) {
		prompt.save();
		return prompt;
	}

	public static void delete(Long id) {
		Prompt prompt = find.ref(id);
		if (prompt == null) {
			return;
		}

		prompt.retired = true;
		prompt.save();
	}
		
	
	/********************************
	 GETTERS 
	 ********************************/

	//-----------Single-------------//

	//Get Prompt by ID
	public static Prompt byId(Long id) {
		return find.where()
				.ne("retired", true)
				.eq("id", id)
				.findUnique();
	}

	//Get Prompt by text
	public static Prompt byText(String text) {
		return find.where()
				.ne("retired", true)
				.eq("text", text)
				.findUnique();
	}
	
	//-----------Group-------------//
	
	//Get all Prompts in the system 
	public static List<Prompt> getAll() {
		return find.where()
				.ne("retired", true)
				.findList();
	}


	////////////////////////////////////////////
	//TEST
	////////////////////////////////////////////

	public static List<Prompt> createSomePrompts(int numPrompts) {
		List<Prompt> prompts = new ArrayList<Prompt>();
		NameGenerator ng = new NameGenerator();

		for (int i=0; i<numPrompts; i++) {
			Prompt prompt = new Prompt(ng.getName().toLowerCase());
			prompts.add(prompt);
		}

		return prompts;
	}
}