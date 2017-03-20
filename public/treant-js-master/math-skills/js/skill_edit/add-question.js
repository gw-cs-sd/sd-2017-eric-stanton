var numRules = 1;
var numVariables = 0;
function initQuestionUi(){
	initAddRuleButton();
	initAddVariableButton();
	initUploadButton();
	initLabelingDialog();
}

function initAddRuleButton() {
	$("#add-rule").click(function() {
		numRules = numRules + 1;
		var rule1 = $("#rule-item-no1").clone();
		var rules = $("#rules-row");
		rule1.prop("id", "rule-item-no"+numRules);
		rules.append(rule1);
	});
}

function initAddVariableButton(){
	$("#add-variable").click(function() {
		var variable = "${"+String.fromCharCode(97 + numVariables)+"}";
		numVariables = numVariables + 1;
		$('#equation').val($('#equation').val() + ""+variable);
	});
}

function initLabelingDialog(){
	$("#create-labels-dialog").dialog({
	    autoOpen: false,
	    modal: true,
	    width: "550px",
	    buttons : {
	         "Confirm" : function() {
	             $(this).dialog("close");
	         },
	         "Cancel" : function() {
	           $(this).dialog("close");
	         }
	       }
	     });
	
	$("#image-labels-button").click(function(){
		$("#label-me-image").attr("src", $('img#upload-image').prop("src"));
		
		// get labels from equation and append as draggables
		var equationString = $("#equation").val();
		// break up into variables
		console.log(equationString);
		
		var matchString;
		matchString = equationString.match(/\${([a-zA-Z]+)}/g);
		console.log(matchString);	
		
		
		for (var label of matchString){
			$("#labels-starting-point").append("<br/>"+label)
		}
		
    
		$("#create-labels-dialog").dialog("open");
  });
		  
}

function initUploadButton(){
	
	var thumb = $('img#upload-image');        

		  new AjaxUpload('image-upload-input', {
		    action: $('form#upload-image-form').attr('action'),
		    name: 'image',
		    onComplete: function(file, response) {
		    	sourceString = $.parseHTML( response ),
		    	  nodeNames = [];
		    	thumb.attr('src', sourceString[0].textContent);
		    }
		  });
}



function submitQuestion(){
	// ajax 1: post tree
	saveTree();
	// ajax 2: post question
	// get values from fields
	
	// create json object
	var questionJson = {};
	questionJson.questionName = $("#question-name").val();
	questionJson.questionText = $("#question-text").val();
	questionJson.equation = $("#equation").val();
	questionJson.skillId = lastClickedSkill;
	questionJson.rules = [];
	
	$("[id^=rule-item-no]").each(function(index, element){
		var tmpRule = {"rule": $(element).val()}
		questionJson.rules.push(tmpRule);
	});
	
//TODO images, labels not yet implemented
//	questionJson.imageUrl = $("#image-url").val();
//	questionJson.labels = [];
	
	var questionRequestBody = {"question": questionJson };
	$.ajax({
		 headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		},
	    url : "/math/demo/question",
	    type: "post",
	    dataType: "json",
	    data : JSON.stringify(questionRequestBody),
	    success: function(data, textStatus, jqXHR)
	    {
	    	if (data.response.success==true){
	    		alert("Question added to skill");
	    		$("#create-question-dialog").dialog("close");
	    	}
	    	else{
	    		alert("Question Not Added.  Validation Errors: "+data.response.errors);
	    	}
	    },
	    error: function (jqXHR, textStatus, errorThrown)
	    {
	    	alert("Error.  Tree not saved: "+errorThrown);
	    	// raise error dialog
	    }
	});
}
function saveTree(){
	nodeStructure = {"nodeStructure": chart_config_all.nodeStructure };
	$.ajax({
		 headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		},
	    url : "/math/demo/tree",
	    type: "post",
	    dataType: "json",
	    data : JSON.stringify(nodeStructure),
	    success: function(data, textStatus, jqXHR)
	    {
	        // user does not need to be notified about successes
	    },
	    error: function (jqXHR, textStatus, errorThrown)
	    {
	    	alert("Error.  Tree not saved: "+errorThrown);
	    	// raise error dialog
	    }
	});
}



	