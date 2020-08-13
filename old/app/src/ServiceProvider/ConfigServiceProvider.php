<?php

namespace Ps2alerts\Frontend\ServiceProvider;

use League\Container\ServiceProvider\AbstractServiceProvider;

class ConfigServiceProvider extends AbstractServiceProvider
{
    /**
     * @var array
     */
    protected $provides = ['config'];

    /**
     * @{inheritDoc}
     */
    public function register()
    {
        $this->getContainer()->share('config', function () {
            return [
                'api_url'   => $_ENV['API_URL'],
                'base_url'    => $_ENV['BASE_URL'],
                'environment' => $_ENV['ENVIRONMENT'],
                'logger' => 'file',
                'version'     => $_ENV['VERSION']
            ];
        });
    }
}
