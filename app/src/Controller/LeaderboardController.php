<?php

namespace Ps2alerts\Frontend\Controller;

use Ps2alerts\Frontend\Contract\ConfigAwareInterface;
use Ps2alerts\Frontend\Contract\ConfigAwareTrait;
use Ps2alerts\Frontend\Contract\TemplateAwareInterface;
use Ps2alerts\Frontend\Contract\TemplateAwareTrait;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LeaderboardController implements ConfigAwareInterface, TemplateAwareInterface
{
    use ConfigAwareTrait;
    use TemplateAwareTrait;

    /**
     * Leaderboard Index Page
     *
     * @param  Psr\Http\Message\ServerRequestInterface $request
     * @param  Psr\Http\Message\ResponseInterface      $response
     *
     * @return Psr\Http\Message\ResponseInterface
     */
    public function index(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('leaderboards/index.html')
        );

        return $response;
    }

    /**
     * Leaderboard Weapons Page
     *
     * @param  Psr\Http\Message\ServerRequestInterface $request
     * @param  Psr\Http\Message\ResponseInterface      $response
     * 
     * @return Psr\Http\Message\ResponseInterface
     */
    public function weapons(ServerRequestInterface $request, ResponseInterface $response)
    {
        $response->getBody()->write(
            $this->getTemplateDriver()->render('leaderboards/weapons.html')
        );

        return $response;
    }
}
