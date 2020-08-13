<?php

namespace Ps2alerts\Frontend\Contract;

use Twig_Environment as Twig;

trait TemplateAwareTrait
{
    /**
     * @var \Twig_Environment
     */
    protected $twig;

    /**
     * Set template Driver
     */
    public function setTemplateDriver(Twig $twig)
    {
        $this->twig = $twig;
    }

    /**
     * Get the template driver
     */
    public function getTemplateDriver()
    {
        return $this->twig;
    }
}
