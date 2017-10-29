function generateBreadCrumbs()
{
	// Get the URL...
	var whichURL = document.location;
	// Get the file name from the URL...
	var whichFile = getFileFromURL( whichURL );
	// A 'page' in this case is the file name minus the .html...
	var whichPage;
	
	// Special case for requests for index.html or just the root of the site...
	if( (whichFile == '') || (whichFile == 'index.html') )
	{
		whichPage = 'home';
	}
	else
		whichPage = stripExtension(whichFile);

	// Split the page name up to generate the breadcrumb titles...
	var underscore = '_';
	var nameArray = whichPage.split(underscore);
	
	// This array stores the file urls for links...
	var linkArray = new Array(nameArray.length);
	
	// Build up the file names for each link.  The '.html' is appended later.	
	for( var i = 0; i <= nameArray.length-1; i++ )
	{
		linkArray[i] = '';
		/*
		For each link I need to increment through the titles...
		i.e. if the page being displayed is "home_contact_angel" then the links will be:
		
			home.html
			home_contact.html
			home_contact_angel.html
		*/
		for( var j = 0; j <= i; j++ )
		{
			// This is the last title (or the first if there was only one) so we're done...
			if( i == j )
				linkArray[i] = linkArray[i] + nameArray[j];
			// Otherwise append the title on, with an underscore.
			else
				linkArray[i] = nameArray[j] + underscore;
		}
	}

	// Again, a special case to make sure 'home' points to index.html...
	if( nameArray[0] == 'home' )
		linkArray[0] = 'index';

	// Capitalize the first letter of each title...
	for( var i = 0; i <= nameArray.length-1; i++ )
	{
		var firstChar = nameArray[i][0];
		nameArray[i] =  nameArray[i].replace( nameArray[i][0], firstChar.toUpperCase() );
	}
	
	// Create the breabcrumb HTML...
	var breadCrumbHTML = '';

	for( var i = 0; i <= nameArray.length-1; i++ )
	{
		breadCrumbHTML = breadCrumbHTML + ' / <A href="' + linkArray[i] + '.html">' + nameArray[i] + '</A>';
	}

	document.getElementById('breadCrumbDiv').innerHTML = breadCrumbHTML;
}

function getFileFromURL( pURL )
{
	var slash = "/";
	var tempArray  = pURL.href.split(slash);
	
	// The file name is the last element.  If the URL pointed to a folder instead
	// of a file, the last element is the empty string, which is fine.
	var fileName = tempArray[(tempArray.length-1)];
	
	return fileName;	
}


function stripExtension( pfileName )
{
	var page = pfileName.substring(0,(pfileName.length-5));

	return page;
}
