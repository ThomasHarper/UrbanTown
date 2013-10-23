<?php
	$tpl = "home";
	if ($action === "signup") {

		$all_logins = array();
		$query =  'SELECT login FROM `players`';
		$all = myFetchAssoc($query);
		foreach ($all as $logins) {
			foreach ($logins as $login) {
				$all_logins[] = $login;
			}
		}
		if (!in_array(myEscape($_POST['login']), $all_logins))
		{
			if (!empty($_POST['login']) && !empty($_POST['password'])) 
			{					
			$login = myEscape($_POST['login']);
			$password = myEscape($_POST['password']);
			$password_secured = sha1($password);
			$query = 'INSERT INTO `players` (`login`, `password`) VALUES ("' . $login . '", "' . $password_secured . '")';
			
				if(myQuery($query))
				{
					$_SESSION['login'] = $login;
					$tpl = "game";
				}
				else
				{
					die("Fail inscription");
				}
			
			}

		}
		else
		{
			die("login alreay taken");
		}
		
	}

	if($action === "signin")
	{
		$password_secured = myEscape($_POST['password']);
		$login = myEscape($_POST['login']);
		$all_logins = array();
		$query =  'SELECT login FROM `players`';
		$all = myFetchAssoc($query);
		foreach ($all as $logins) {
			foreach ($logins as $login) {
				$all_logins[] = $login;
			}
		}
		if (in_array(myEscape($_POST['login']), $all_logins) && !empty($_POST['login']) && !empty($_POST['password']))
		{
			$query = 'SELECT password FROM `players` WHERE login = "'.myEscape($_POST['login']).'"';
			$result = myFetchAssoc($query);
			foreach ($result as $value) {
				foreach ($value as $pwd) {
					$password = $pwd;
				}
			}

			if (sha1($password_secured) === $password) {
				$_SESSION['login'] = $login;
				$tpl = "game";
			}
			
		}
	}

?>