<?php

/*
 * This file is part of michaelbelgium/flarum-umami.
 *
 * Copyright (c) 2024 Michael V..
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

use Flarum\Extend;
use Michaelbelgium\FlarumUmami\Listeners;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    (new Extend\Frontend('forum'))
        ->content(Listeners\UmamiTagRenderer::class),

    new Extend\Locales(__DIR__.'/locale'),
];
