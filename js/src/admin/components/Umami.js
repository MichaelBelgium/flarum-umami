import app from 'flarum/admin/app';

export default class Umami {
  static instance = null;
  bearerToken = null;

  static getInstance() {
    if (!Umami.instance) {
      Umami.instance = new Umami();
    }
    return Umami.instance;
  }

  async login() {
    if (this.bearerToken) {
      console.info('[michaelbelgium-umami] Bearer token already set, not fetching new one.');
      return true;
    }

    if (
      app.data.settings['michaelbelgium-umami.api_username'] === undefined ||
      app.data.settings['michaelbelgium-umami.api_password'] === undefined ||
      app.data.settings['michaelbelgium-umami.api_username'] === '' ||
      app.data.settings['michaelbelgium-umami.api_password'] === ''
    ) {
      console.error('[michaelbelgium-umami] API username and/or password not set or emtpy.');
      return false;
    }

    try {
      const response = await app.request({
        url: app.data.settings['michaelbelgium-umami.domain'] + '/api/auth/login',
        method: 'POST',
        body: {
          username: app.data.settings['michaelbelgium-umami.api_username'],
          password: app.data.settings['michaelbelgium-umami.api_password'],
        },
      });

      this.bearerToken = response.token;
      console.info('[michaelbelgium-umami] Logged in as', response.user.username);
      return true;
    } catch (error) {
      console.error('[michaelbelgium-umami] Error logging in:', error);
    }
    return false;
  }

  async website() {
    return await app.request({
      url: app.data.settings['michaelbelgium-umami.domain'] + '/api/websites/' + app.data.settings['michaelbelgium-umami.site_id'],
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
    });
  }

  async websiteStats() {
    let stats = {};

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    weekAgo.setHours(0, 0, 0, 0);

    let response = await app.request({
      url: app.data.settings['michaelbelgium-umami.domain'] + '/api/websites/' + app.data.settings['michaelbelgium-umami.site_id'] + '/stats',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
      params: {
        startAt: weekAgo.getTime(),
        endAt: now.getTime(),
      },
    });

    stats = response;

    response = await app.request({
      url: app.data.settings['michaelbelgium-umami.domain'] + '/api/websites/' + app.data.settings['michaelbelgium-umami.site_id'] + '/active',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
    });

    stats.live = response.x;

    return stats;
  }
}
