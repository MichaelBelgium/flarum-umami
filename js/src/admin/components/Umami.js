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
      const response = await fetch(app.data.settings['michaelbelgium-umami.domain'] + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: app.data.settings['michaelbelgium-umami.api_username'],
          password: app.data.settings['michaelbelgium-umami.api_password'],
        }),
      });

      if (!response.ok) {
        console.error('[michaelbelgium-umami] Error logging in:', json);
        return false;
      }

      const json = await response.json();

      this.bearerToken = json.token;

      console.info('[michaelbelgium-umami] Logged in as', json.user.username);
      return true;
    } catch (error) {
      console.error('[michaelbelgium-umami] Error logging in:', error);
    }
    return false;
  }

  async website() {
    const response = await fetch(
      app.data.settings['michaelbelgium-umami.domain'] + '/api/websites/' + app.data.settings['michaelbelgium-umami.site_id'],
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.bearerToken,
          Origin: app.forum.attribute('baseUrl'),
        },
      }
    );

    if (!response.ok) {
      console.error('[michaelbelgium-umami] Error fetching website:', json);
      return null;
    }

    return await response.json();
  }

  async websiteStats() {
    let stats = {};

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    weekAgo.setHours(0, 0, 0, 0);

    let response = await fetch(
      app.data.settings['michaelbelgium-umami.domain'] +
        '/api/websites/' +
        app.data.settings['michaelbelgium-umami.site_id'] +
        '/stats' +
        '?startAt=' +
        weekAgo.getTime() +
        '&endAt=' +
        now.getTime(),
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.bearerToken,
          Origin: app.forum.attribute('baseUrl'),
        },
      }
    );

    stats = await response.json();

    response = await fetch(
      app.data.settings['michaelbelgium-umami.domain'] + '/api/websites/' + app.data.settings['michaelbelgium-umami.site_id'] + '/active',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.bearerToken,
          Origin: app.forum.attribute('baseUrl'),
        },
      }
    );

    const tmp = await response.json();
    stats.live = tmp.x;

    return stats;
  }
}
