<?php

// identifiants BDD
$config['bdd']['server'] = "127.0.0.1";
$config['bdd']['user'] = "root";
$config['bdd']['pass'] = "";
$config['bdd']['base'] = "";

// config['routes'] liste les actions legales
// et le sous-controllers correspondant
$config['routes'] = array(
    "home"	=> "home"
);

//Mode Debugg
$DEBUG = true;//"true" pour active

//action par defaut
$config['defaults']['action'] = "home";
