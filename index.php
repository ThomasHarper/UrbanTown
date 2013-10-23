<?php

//start the session
session_start();

//autoload
function myAutoLoad($class)
{
  if(file_exists('./libs/classes/' . $class . '.php'))
    require_once('./libs/classes/' . $class . '.php');
  elseif(file_exists('./models/' . $class . '.php'))
    require_once('./models/' . $class . '.php');
  elseif(file_exists('./libs/tusk/'.$class.'.php'))
    require_once('./libs/tusk/'.$class.'.php');
}

spl_autoload_register("myAutoLoad");

//Inclusion config et tools
require_once('./includes/config.php');
require_once('./includes/tools.php');

//inclusion Smarty
require_once('./libs/smarty/Smarty.class.php');

//on instancie smarty
$smarty = new Smarty();

//smarty modifier
require_once('./includes/modifier.php');

//connecter a la base de donnee
$link = mysqli_connect($config['bdd']['server'],
	$config['bdd']['user'],
	$config['bdd']['pass'],
	$config['bdd']['base']);

//Si fail de la connection
if (mysqli_connect_errno())
{
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

//Valeur d'action par defaut
$action = $config['defaults']['action'];

//On verifie si une action est specifiee dans l'url
if(!empty($_GET['action']))
{
	$action = $_GET['action'];
}

//On verifie que l'action est legale
if(!array_key_exists($action, $config['routes']))
{
	die('action ill&eacute;gale');
}

//On inclu l'action group
$actiongroup_path = './Controllers/'.$config['routes'][$action].'Controller.php';
if(is_readable($actiongroup_path))
{
    include($actiongroup_path);
}
else
{
    die('le fichier '.$actiongroup_path." est inexistant ou innaccessible");
}

//On assign $_SESSION pour y avoir accès sur tous les tpl
$smarty->assign('session', $_SESSION);

//On inclu le template
$smarty->assign('tpl', $tpl);

if ($tpl != 'json')
    $tpl_path = 'templates/main.tpl';
else
    $tpl_path = 'templates/json.tpl';

if (is_file($tpl_path))
{
    $smarty->display($tpl_path);
}
else
{
    echo "Page introuvable ('".$tpl_path."' inexistant ou innaccessible)";
}

?>