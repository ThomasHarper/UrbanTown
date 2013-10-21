<?php
//-- DATABASE SQL --//
    function my_fetch_assoc($query)
	{
		global $link;

		$result = mysqli_query($link, $query);
		if ($result === FALSE)
			die (mysqli_error($link));
		$data = mysqli_fetch_array($result, MYSQLI_ASSOC);

		return $data;
	}

	function myQuery($query)
	{
		global $link;

		$result = mysqli_query($link, $query) or die(mysqli_error($link));
		return $result;
	}

	function myFetchAssoc($query)
	{
		global $link;
		$array = array();
		$result = myQuery($query) or die(mysqli_error($link));
		$tab_res = null;
		if (!$result)
		 {
			return false;
		}
		while ($tab_res = mysqli_fetch_assoc($result))
		{
			$array[] = $tab_res;
		}
		return $array;
	}

	function myEscape($to_escape)
	{
		global $link;

		return mysqli_real_escape_string($link ,$to_escape);
	}
//-- DATABASE SQL --//

//-- EMAIL CHECK --//
function emailCheck($email){

    $regex = '#^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$#';//dat regex
    if(preg_match($regex, $email)){
        return true;
    }
    else{
        return false;
    }

}

function nameCheck($name){

    $regex = '/^[A-Za-z \'-]+$/i';//dat regex
    if(preg_match($regex, $name)){
        return true;
    }
    else{
        return false;
    }

}
//-- EMAIL CHECK --//

//-- PASSWORD HASH --//
function passwordHash($password){

    $hashedPassword = hash("sha256", 'Host'.$password.'rules');//HASH!
    return $hashedPassword;

}
//-- PASSWORD HASH --//

//-- ERROR FUNCTION --//
function error_handle($errno, $errstr){

    echo '<div class="overlay">';
        echo '<div id="error" data-width="430" data-height="170">';
            echo '<h3>Erreur</h3>';
            echo '<p>Une erreur est survenue, veuillez r&eacute;essayer ult&eacute;rieurement</p>';
            echo '<input id="undisplay-error" type="button" value="OK">';
        echo '</div>';
    echo '</div>';
}

if($DEBUG == false){
    set_error_handler("error_handle");
}

function myLastInsertId()
{
  global $link;

  return mysqli_insert_id($link);
}
//-- ERROR FUNCTION --//