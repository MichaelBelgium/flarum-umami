import app from 'flarum/admin/app';
import { extend } from 'flarum/common/extend';
import DashboardPage from 'flarum/admin/components/DashboardPage';
import UmamiWidget from './components/UmamiWidget';

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
    })
    .registerSetting({
      setting: 'michaelbelgium-umami.api_username',
      label: app.translator.trans('michaelbelgium-umami.admin.settings.username.label'),
      help: app.translator.trans('michaelbelgium-umami.admin.settings.username.help'),
      type: 'text',
    })
    .registerSetting({
      setting: 'michaelbelgium-umami.api_password',
      label: app.translator.trans('michaelbelgium-umami.admin.settings.password.label'),
      help: app.translator.trans('michaelbelgium-umami.admin.settings.password.help'),
      type: 'password',
    });

  extend(DashboardPage.prototype, 'availableWidgets', function (widgets) {
    widgets.add('umami', UmamiWidget.component());
  });
});
