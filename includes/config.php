<?php

// identifiants BDD
$config['bdd']['server'] = "localhost";
$config['bdd']['user'] = "root";
$config['bdd']['pass'] = "root";
$config['bdd']['base'] = "game";

// config['routes'] liste les actions legales
// et le sous-controllers correspondant
$config['routes'] = array(
    "home"	=> "home",
    "signup" => "home",
    "signin" => "home",
    "save" => "home",
    "fuckThisShit" => "home"
);

//Mode Debugg
$DEBUG = true;//"true" pour active

//action par defaut
$config['defaults']['action'] = "home";
