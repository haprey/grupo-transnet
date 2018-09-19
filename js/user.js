function ncore_ajaxStart( div_id )
{
    var have_div_id = typeof div_id != 'undefined';

    if (have_div_id)
    {
        ncoreJQ( '#'+div_id ).addClass( 'ncore_waiting' );
    }
    else
    {
        ncoreJQ( '#ncore_ajax_wait').addClass( 'ncore_waiting' );
    }
}

function ncore_ajaxStop( div_id )
{
    var have_div_id = typeof div_id != 'undefined';

    if (have_div_id)
    {
        ncoreJQ( '#'+div_id ).removeClass( 'ncore_waiting' );
    }
    else
    {
        ncoreJQ( '#ncore_ajax_wait').removeClass( 'ncore_waiting' );
    }
}

function ncore_fetchUrl( url, do_omit_waiting )
{
    var do_omit = typeof do_omit_waiting != 'undefined' && do_omit_waiting;

    if (!do_omit)
    {
        ncore_ajaxStart();
    }

    var timestamp = new Date().getTime();
    url = ncore_addUrlArgs( url, timestamp )

    ncoreJQ.getJSON( url, ncore_callBack );

    return false;
}

function ncore_addUrlArgs( url, args )
{
    var first
    var last

    var pos = url.indexOf( "?" )

    var have_arg_sep = pos >= 0
    var sep = have_arg_sep
            ? '&'
            : '?'

    pos = url.indexOf( "#" )
    if (pos>=0)
    {
        first = url.substring( 0, pos )
        last  = url.substring( pos )
    }
    else
    {
        first = url
        last  = ''
    }

    url = first + sep + args + last

    return url

}



function ncore_callBack( response )
{
    if (!response.redirect && !response.must_reload)
    {
        ncore_ajaxStop();
    }

    if (response.error)
    {
        alert( response.error );
    }

    if (response.success)
    {
        alert( response.success );
    }

    if (response.html && response.target_div_id)
    {
         ncore_ajaxStop( response.target_div_id );
         ncoreJQ( '#'+response.target_div_id ).html( response.html );
    }

    if (response.js)
    {
        eval(response.js);
    }

    if (response.must_reload)
    {
        location.reload( true );
    }

    if (response.redirect)
    {
        window.location.href = response.redirect;
    }

    return false;
}





function ncore_passwordStrength( password, username, password_repetition )
{
    var have_pw  = typeof password            != 'undefined' && password            != '';
    var have_rep = typeof password_repetition != 'undefined' && password_repetition != '';

    if (!have_pw && !have_rep)
    {
        return 'none';
    }

    if (have_pw && have_rep
        && password_repetition != password) {

        return 'mismatch'
    }

    if (have_rep && !have_pw)
    {
        password = password_repetition;
    }

    var char_count = ncore_countUniqueChars( password );

    if (char_count < 4 ) {
        return 'bad'
    }

    if (username && password.toLowerCase().indexOf( username.toLowerCase() ) >= 0)
    {
        return 'bad'
    }

    var categories = 0

    if ( password.match(/[0-9]/) )
    {
        categories++
    }

    if ( password.match(/[a-z]/) )
    {
        categories++
    }
    if ( password.match(/[A-Z]/) )
    {
        categories++
    }

    if ( password.match(/[^a-zA-Z0-9]/) )
    {
        categories++
    }

    if (categories <= 1)
        return 'weak'

    if (char_count >= 10)
        return 'strong'

    if (categories >= 4 && char_count >= 4 && password.length >= 8)
        return 'strong'

    if (categories >= 2 && char_count >= 5 && password.length >= 8)
        return 'good'

    return 'weak';
}

function ncore_countUniqueChars( str )
{
    if (typeof str == 'undefined')
    {
        return 0;
    }

    Object.ncore_size = function(obj) {
        var size = 0;
        for(key in obj) {
            if(obj.hasOwnProperty(key)) size++;
        }
        return size;
    }

    var letters = new Object;

    for(x = 0, length = str.length; x < length; x++) {
      var l = str.charAt(x)
      letters[l] = (isNaN(letters[l]) ? 1 : letters[l] + 1);
    }

    return Object.ncore_size(letters)
}


function ncore_getElementsByClass( searchClass, domNode, tagName) {
    if (domNode == null) domNode = document;
    if (tagName == null) tagName = '*';
    var el = new Array();
    var tags = domNode.getElementsByTagName(tagName);
    var tcl = " "+searchClass+" ";
    for(i=0,j=0; i<tags.length; i++) {
        var test = " " + tags[i].className + " ";
        if (test.indexOf(tcl) != -1)
            el[j++] = tags[i];
    }
    return el;
}


function ncore_setBrowserCapabilityCookie()
{
   var cookie_value = window.innerWidth + "x" +  window.innerHeight
                    + "/"
                    + screen.width + "x" + screen.height

   var date=new Date();
   date.setDate( date.getDate() + 365 );
   expires = date.toUTCString();

   document.cookie = "ncore_display_size=" + cookie_value + "; expires=" + expires + "; path=/";
}
ncore_setBrowserCapabilityCookie();

