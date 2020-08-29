<?php

$container = new League\Container\Container();

// Service Providers
$container->addServiceProvider(Ps2alerts\Frontend\ServiceProvider\ConfigServiceProvider::class);
$container->addServiceProvider(Ps2alerts\Frontend\ServiceProvider\HttpMessageServiceProvider::class);
$container->addServiceProvider(Ps2alerts\Frontend\ServiceProvider\LogServiceProvider::class);
$container->addServiceProvider(Ps2alerts\Frontend\ServiceProvider\TemplateServiceProvider::class);

// Inflectors
$container->inflector(Ps2alerts\Frontend\Contract\ConfigAwareInterface::class)
          ->invokeMethod('setConfig', ['config']);
$container->inflector(Ps2alerts\Frontend\Contract\TemplateAwareInterface::class)
          ->invokeMethod('setTemplateDriver', ['Twig_Environment']);

// Controllers
$container->add(Ps2alerts\Frontend\Controller\MainController::class);
$container->add(Ps2alerts\Frontend\Controller\SplashController::class);
$container->add(Ps2alerts\Frontend\Controller\LeaderboardController::class);
$container->add(Ps2alerts\Frontend\Controller\ProfileController::class);
$container->add(Ps2alerts\Frontend\Controller\ProjectStatusController::class);

return $container;
