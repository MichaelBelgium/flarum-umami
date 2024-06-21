<?php

namespace Michaelbelgium\FlarumUmami\Listeners;

use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ServerRequestInterface;

class UmamiTagRenderer
{
    protected SettingsRepositoryInterface $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(Document $document, ServerRequestInterface $request)
    {
        $domain = $this->settings->get('michaelbelgium-umami.domain');
        $site_id = $this->settings->get('michaelbelgium-umami.site_id');

        if (str_ends_with($domain, '/'))
            $domain = substr($domain, 0, -1);

        $document->head[] = "<script defer data-website-id=\"$site_id\" src=\"$domain/script.js\"></script>";
    }
}