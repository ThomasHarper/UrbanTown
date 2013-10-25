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
					$id = myLastInsertId();
					$_SESSION['login'] = $login;
					$_SESSION['id'] = $id;
					$smarty->assign('login', $login);
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
			$query = 'SELECT id,password FROM `players` WHERE login = "'.myEscape($_POST['login']).'"';
			$result = myFetchAssoc($query);
			foreach ($result as $value) {
				foreach ($value as $attr) {
					$attrs[] = $attr;					
				}
			}
			if (sha1($password_secured) === $attrs[1]) {
				$_SESSION['id'] = $attrs[0];
				$_SESSION['login'] = $login;	
				$smarty->assign('login', $login);			
				$tpl = "game";
			}
			else
			{
				die("Wrong password");
			}
			
		}
	}

	if ($action === "save") 
	{				
		// Data from ajax request
		$data = $_POST['data']; // already escaped in query
		$score = myEscape($_POST['score']);
		$over = myEscape($_POST['over']);
		
		// Check if there's a pending game
		$query = 'SELECT * FROM `games` WHERE players_id ='.$_SESSION['id'].' AND `over` = 0';
		$result = myFetchAssoc($query);

		// If no pending games, we create a new one
		if(empty($result))
		{
			echo "insert";
			$query = 'INSERT INTO `games` (`state`,`score`,`players_id`, `over`) 
			VALUES ("'.addslashes($data).'", 0, '.$_SESSION['id'].', 0)';
			myQuery($query);			
		}
		// else we update it
		else
		{
			echo "update";
			$query = 'UPDATE `games` SET `state` = "'.addslashes($data).'", `score` = '.$score.', `over` = '.$over.' 
			WHERE `players_id` = '.$_SESSION['id'].' AND `over` = 0';
			myQuery($query);			
		}
			
	}

	if ($action === "over") 
	{
		$query = 'UPDATE `games` SET `over` = 1 WHERE `players_id` = '.$_SESSION['id'].' AND `over` = 0';
		myQuery($query);
	}


    if ($action === "fuckThisShit") 
    {
        $tpl = "game";
    }

?>