<?php

namespace Ps2alerts\Frontend\Contract;

use Twig_Environment as Twig;

interface TemplateAwareInterface
{
    /**
     * Set the Template driver
     *
     * @param \Twig_Environment $template
     */
    public function setTemplateDriver(Twig $template);

    /**
     * Get the Template driver
     *
     * @return \Twig_Environment
     */
    public function getTemplateDriver();
}
