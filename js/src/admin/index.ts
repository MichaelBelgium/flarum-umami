import app from 'flarum/admin/app';

app.initializers.add('michaelbelgium/flarum-umami', () => {
  app.extensionData
    .for('michaelbelgium-umami')
    .registerSetting({
      setting: 'michaelbelgium-umami.site_id',
      label: app.translator.trans('michaelbelgium-umami.admin.settings.site_id.label'),
      help: app.translator.trans('michaelbelgium-umami.admin.settings.site_id.help'),
      placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      type: 'text',
    })
    .registerSetting({
      setting: 'michaelbelgium-umami.domain',
      label: app.translator.trans('michaelbelgium-umami.admin.settings.domain.label'),
      help: app.translator.trans('michaelbelgium-umami.admin.settings.domain.help'),
      placeholder: 'https://umami.yourdomain.com',
      type: 'text',
    });
});
