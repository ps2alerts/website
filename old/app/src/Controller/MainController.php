<?php

namespace Ps2alerts\Frontend\Controller;

use Ps2alerts\Frontend\Contract\ConfigAwareInterface;
use Ps2alerts\Frontend\Contract\ConfigAwareTrait;
use Ps2alerts\Frontend\Contract\TemplateAwareInterface;
use Ps2alerts\Frontend\Contract\TemplateAwareTrait;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class MainController implements ConfigAwareInterface, TemplateAwareInterface
{
    use ConfigAwareTrait;
    use TemplateAwareTrait;

    /**
     * Landing Page
     *
     * @param  ServerRequestInterface $request
     * @param  ResponseInterface      $response
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function landing(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('landing.html')
        );

        return $response;
    }

    /**
     * About Page
     *
     * @param  ServerRequestInterface $request
     * @param  ResponseInterface      $response
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function about(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('about.html')
        );

        return $response;
    }

    /**
     * Alert History Page
     *
     * @param  ServerRequestInterface $request
     * @param  ResponseInterface      $response
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function alertHistory(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('alert-history.html')
        );

        return $response;
    }

    /**
     * Alert Pages
     *
     * @param  ServerRequestInterface $request
     * @param  ResponseInterface      $response
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function alert(ServerRequestInterface $request, ResponseInterface $response, array $args)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('alert.html', ['args' => $args])
        );

        return $response;
    }

    /**
     * Alert Pages
     *
     * @param  ServerRequestInterface $request
     * @param  ResponseInterface      $response
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function changeLog(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('change-log.html')
        );

        return $response;
    }

    public function websocketTest(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('push-test.html')
        );

        return $response;
    }
}
