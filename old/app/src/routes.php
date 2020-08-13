<?php

use League\Container\Container;
use League\Container\ContainerInterface;
use League\Route\RouteCollection;

// Load the route collection. If container is not ready, generate one here now.
$route = new RouteCollection(
    isset($container) && $container instanceof ContainerInterface ? $container : new Container
);

$route->get('/', 'Ps2alerts\Frontend\Controller\SplashController::splash');
$route->get('/home', 'Ps2alerts\Frontend\Controller\MainController::landing');
$route->get('/about', 'Ps2alerts\Frontend\Controller\MainController::about');
$route->get('/alert-history', 'Ps2alerts\Frontend\Controller\MainController::alertHistory');
$route->get('/alert/{id:number}', 'Ps2alerts\Frontend\Controller\MainController::alert');
$route->get('/change-log', 'Ps2alerts\Frontend\Controller\MainController::changeLog');

/* Profiles */
$route->get('/profiles/player/{id:number}', 'Ps2alerts\Frontend\Controller\ProfileController::player');
$route->get('/profiles/outfit/{id:number}', 'Ps2alerts\Frontend\Controller\ProfileController::outfit');

/* Leaderboards */
$route->get('/leaderboards', 'Ps2alerts\Frontend\Controller\LeaderboardController::index');
//$route->get('/leaderboards/players', 'Ps2alerts\Frontend\Controller\LeaderboardController::players');
//$route->get('/leaderboards/outfits', 'Ps2alerts\Frontend\Controller\LeaderboardController::outfits');
$route->get('/leaderboards/weapons', 'Ps2alerts\Frontend\Controller\LeaderboardController::weapons');
//$route->get('/leaderboards/vehicles', 'Ps2alerts\Frontend\Controller\LeaderboardController::vehicles');

$route->get('/project-status', 'Ps2alerts\Frontend\Controller\ProjectStatusController::index');

$route->get('/websocket-test', 'Ps2alerts\Frontend\Controller\MainController::websocketTest');

return $route;
