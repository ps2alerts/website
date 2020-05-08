<?php

namespace Ps2alerts\Frontend\Controller;

use Ps2alerts\Frontend\Contract\ConfigAwareInterface;
use Ps2alerts\Frontend\Contract\ConfigAwareTrait;
use Ps2alerts\Frontend\Contract\TemplateAwareInterface;
use Ps2alerts\Frontend\Contract\TemplateAwareTrait;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ProfileController implements ConfigAwareInterface, TemplateAwareInterface
{
    use ConfigAwareTrait;
    use TemplateAwareTrait;

    /**
     * Player Profile Page
     *
     * @param  ServerRequestInterface $request
     * @param  ResponseInterface      $response
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function player(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('profiles/player.html')
        );

        return $response;
    }

    /**
     * Outfit Profile Page
     *
     * @param  ServerRequestInterface $request
     * @param  ResponseInterface      $response
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function outfit(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('profiles/outfit.html')
        );

        return $response;
    }
}
