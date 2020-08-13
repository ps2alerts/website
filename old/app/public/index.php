<?php

include __DIR__ . '/../vendor/autoload.php';

use League\Route\Http\Exception\NotFoundException;
use Psr\Log\LoggerInterface;
use Zend\Diactoros\Response;

// Container
$container = include __DIR__ . '/../src/container.php';

// Routes
$router = include __DIR__ . '/../src/routes.php';

// FIRE!!!
try {
    $response = $router->dispatch(
        $container->get('Zend\Diactoros\ServerRequest'),
        $container->get('Zend\Diactoros\Response')
    );

    // Send the response to the client
    $container->get('Zend\Diactoros\Response\SapiEmitter')->emit($response);
} catch (NotFoundException $e) {
    /** @var Response $response */
    $response = $container->get('Zend\Diactoros\Response');

    $response = $response->withStatus(404);
    $response->getBody()->write(
        $container->get('Twig_Environment')->render('404.html')
    );
} catch (\Exception $e) {
    /** @var LoggerInterface $logger */
    $logger = $container->get('Monolog\Logger');

    $logger->addDebug('Exception: ');
    $logger->addDebug($e->getMessage());

    if ($_ENV['ENVIRONMENT'] === 'development') {
        trigger_error("{$e->getMessage()}{$e->getTraceAsString()}");
    } else {
        $logger->addError(":warning: Exception IN API: \n\n" . $e->getMessage());

        /** @var Response $response */
        $response = $container->get('Zend\Diactoros\Response');

        $response->getBody()->write(
            'An error occurred! This has been logged. If this is occurring frequently, please contact @Maelstromeous.'
        );

        $container->get('Zend\Diactoros\Response\SapiEmitter')->emit($response);
    }
}
