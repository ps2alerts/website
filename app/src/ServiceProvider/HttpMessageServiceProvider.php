<?php

namespace Ps2alerts\Frontend\ServiceProvider;

use League\Container\ServiceProvider\AbstractServiceProvider;
use Zend\Diactoros\ServerRequestFactory;

class HttpMessageServiceProvider extends AbstractServiceProvider
{
    protected $provides = [
        'Zend\Diactoros\Response',
        'Zend\Diactoros\Response\SapiEmitter',
        'Zend\Diactoros\ServerRequest'
    ];

    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->getContainer()->add('Zend\Diactoros\Response');

        $this->getContainer()->share('Zend\Diactoros\Response\SapiEmitter');

        $this->getContainer()->share('Zend\Diactoros\ServerRequest', function () {
            $config = $this->getContainer()->get('config');

            // Rewrite REQUEST_URI path so it matches exactly the routes
            // @todo: Reconfigure for virtual hosts when local box supports it
            if ($config['environment'] === 'development') {
                $_SERVER['REQUEST_URI'] = str_replace('/ps2alerts/public', '', $_SERVER['REQUEST_URI']);
            }

            return ServerRequestFactory::fromGlobals();
        });
    }
}
