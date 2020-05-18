<?php

namespace Ps2alerts\Frontend\Contract;

interface ConfigAwareInterface
{
    /**
     * Sets the Config
     *
     * @param array $array
     */
    public function setConfig(array $array);

    /**
     * Gets the config
     *
     * @return array
     */
    public function getConfig();

    /**
     * Gets the config item from the config array
     *
     * @param  string $key Array key to get
     * @return string      Array key content returned
     */
    public function getConfigItem($key);
}
