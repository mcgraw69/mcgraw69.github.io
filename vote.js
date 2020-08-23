(function () {
    var myConnector = tableau.makeConnector();

myConnector.getSchema = function (schemaCallback) {
    var cols = [
        {id: "voteraddress",	alias: "Voter Address",						dataType: tableau.dataTypeEnum.string},
        {id: "division",		alias: "Division Name",						dataType: tableau.dataTypeEnum.string},
        {id: "level",		alias: "Level",						dataType: tableau.dataTypeEnum.string},
        {id: "office",			alias: "Office Name",						dataType: tableau.dataTypeEnum.string},
        {id: "rep",				alias: "Representative Name",				dataType: tableau.dataTypeEnum.string},
        {id: "repparty",		alias: "Representative Party",				dataType: tableau.dataTypeEnum.string},
        {id: "repaddress",		alias: "Representative Address",			dataType: tableau.dataTypeEnum.string},
        {id: "repphone",		alias: "Representative Phone(s)",			dataType: tableau.dataTypeEnum.string},
        {id: "repemail",		alias: "Representative Email(s)",			dataType: tableau.dataTypeEnum.string},
        {id: "repurl",			alias: "Representative URL(s)",				dataType: tableau.dataTypeEnum.string},
        {id: "repphoto",		alias: "Representative Photo",				dataType: tableau.dataTypeEnum.string},
        {id: "repfb",			alias: "Representative Facebook",			dataType: tableau.dataTypeEnum.string},
        {id: "reptw",			alias: "Representative Twitter",			dataType: tableau.dataTypeEnum.string},
        {id: "repyt",			alias: "Representative YouTube",			dataType: tableau.dataTypeEnum.string}
    ];

    var tableSchema = {
        id: "vote",
        alias: "vote",
        columns: cols
    };

    schemaCallback([tableSchema]);
};

myConnector.getData = function(table, doneCallback) {
    var fulladdress = JSON.parse(tableau.connectionData),
    	addressstring = fulladdress.street + ",%20" + 
    					fulladdress.city  + ",%20" +
    					fulladdress.state  + "%20" +
    					fulladdress.zip;
    $.getJSON("https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDiAMDzP6mnK1dYooRqTC4WdAppj6QsjSM&address=" + addressstring, function(resp) {
        var offices		= resp.offices,
        	rep			= resp.officials,
        	divisions	= resp.divisions,
        	vaddress	= resp.normalizedInput,
        	fb			= "Facebook",
        	tw			= "Twitter",
        	yt			= "YouTube",
            tableData	= [];
		// Iteration 1
		for (var i = 0, leni = offices.length; i < leni; i++) {
		
        // Iteration 2
        for (var j = 0, lenj = offices[i].officialIndices.length; j < lenj; j++) {
        
			function getchan(x) {
								let		result; 
								if		(typeof rep[offices[i].officialIndices[j]].channels != "undefined")
										{
										if		((rep[offices[i].officialIndices[j]].channels.length === 1) &&
												(rep[offices[i].officialIndices[j]].channels[0].type === x))
												{result = x + ".com/" + rep[offices[i].officialIndices[j]].channels[0].id;} 
										else if	((rep[offices[i].officialIndices[j]].channels.length === 2) &&
												(rep[offices[i].officialIndices[j]].channels[0].type === x))
												{result = x + ".com/" + rep[offices[i].officialIndices[j]].channels[0].id;} 
										else if	((rep[offices[i].officialIndices[j]].channels.length === 2) &&
												(rep[offices[i].officialIndices[j]].channels[1].type === x))
												{result = x + ".com/" + rep[offices[i].officialIndices[j]].channels[1].id;} 
										else if	((rep[offices[i].officialIndices[j]].channels.length === 3) &&
												(rep[offices[i].officialIndices[j]].channels[0].type === x))
												{result = x + ".com/" + rep[offices[i].officialIndices[j]].channels[0].id;} 
										else if	((rep[offices[i].officialIndices[j]].channels.length === 3) &&
												(rep[offices[i].officialIndices[j]].channels[1].type === x))
												{result = x + ".com/" + rep[offices[i].officialIndices[j]].channels[1].id;} 
										else if	((rep[offices[i].officialIndices[j]].channels.length === 3) &&
												(rep[offices[i].officialIndices[j]].channels[2].type === x))
												{result = x + ".com/" + rep[offices[i].officialIndices[j]].channels[2].id;} 
										else 	{result = "Not Available";}
										;}
								else	{result = "Not Available";} 
								return	result;
								}
            tableData.push({
                "office"		: 	offices[i].name,
                "level"		: 	offices[i].levels,
		    "division"		:	divisions[offices[i].divisionId].name,
                "repno"			:	offices[i].officialIndices[j],
                "rep"			:	rep[offices[i].officialIndices[j]].name,
                "repparty"		:	rep[offices[i].officialIndices[j]].party,
                "voteraddress"	:	vaddress.line1 + ", " + 
                					vaddress.city + ", " + 
                					vaddress.state + " "+ 
                					vaddress.zip,
                "repaddress"	:	rep[offices[i].officialIndices[j]].address[0].line1 + ", " + 
                					rep[offices[i].officialIndices[j]].address[0].city + ", " + 
                					rep[offices[i].officialIndices[j]].address[0].state + " "+ 
                					rep[offices[i].officialIndices[j]].address[0].zip,
				"repphone"		:	rep[offices[i].officialIndices[j]].phones,
				"repemail"		:	rep[offices[i].officialIndices[j]].emails,
				"repurl"		:	rep[offices[i].officialIndices[j]].urls,
				"repphoto"		:	rep[offices[i].officialIndices[j]].photoUrl,
				"repfb"			:	getchan(fb),
				"reptw"			:	getchan(tw),
				"repyt"			:	getchan(yt)

            });
        }
        }
		//}
		
        table.appendRows(tableData);
        doneCallback();
    });
};

    tableau.registerConnector(myConnector);
    
$(document).ready(function() {
    $("#submitButton").click(function() {
        var fulladdress = { 
        					street: $('#street').val().trim(),
        					city: $('#city').val().trim(),
        					state: $('#state').val().trim(),
        					zip: $('#zip').val().trim()
						  };
            tableau.connectionData = JSON.stringify(fulladdress);
            tableau.connectionName = "Vote";
            tableau.submit();
    });
});
})();













