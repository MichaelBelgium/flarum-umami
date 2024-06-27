import DashboardWidget, { IDashboardWidgetAttrs } from 'flarum/admin/components/DashboardWidget';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Umami from './Umami';
import icon from 'flarum/common/helpers/icon';
import app from 'flarum/admin/app';

export default class UmamiWidget extends DashboardWidget {
  loading = false;
  umami = Umami.getInstance();
  stats = null;
  website = null;
  success = true;

  async oninit(vnode) {
    super.oninit(vnode);

    this.loading = true;
    m.redraw();

    this.success = await this.umami.login();

    if (this.success) {
      this.website = await this.umami.website();

      if (this.website === null) {
        this.success = false;
      } else {
        this.stats = await this.umami.websiteStats();
      }
    }

    this.loading = false;
    m.redraw();
  }

  className() {
    return 'UmamiWidget';
  }

  content() {
    if (!this.success) {
      return (
        <div>
          <h4>Umami statistics</h4>
          <p>{app.translator.trans('michaelbelgium-umami.admin.settings.errors.no_connection')}</p>
        </div>
      );
    }

    return (
      <div>
        <h4>Umami statistics</h4>
        <div className="UmamiWidget-stats">
          <section>
            <dt>{this.loading ? <LoadingIndicator size="small" display="inline" /> : <>{this.stats.live}</>}</dt>
            <h3>
              {icon('fas fa-circle fa-beat')} {app.translator.trans('michaelbelgium-umami.admin.widget.live')}
            </h3>
          </section>
          <section>
            <dt>
              {this.loading ? (
                <LoadingIndicator size="small" display="inline" />
              ) : (
                <>
                  {this.stats.pageviews.value} {this.changeToSpan(this.stats.visits.change)}
                </>
              )}
            </dt>
            <h3>{app.translator.trans('michaelbelgium-umami.admin.widget.views')}</h3>
          </section>
          <section>
            <dt>
              {this.loading ? (
                <LoadingIndicator size="small" display="inline" />
              ) : (
                <>
                  {this.stats.visits.value} {this.changeToSpan(this.stats.visits.value)}
                </>
              )}
            </dt>
            <h3>{app.translator.trans('michaelbelgium-umami.admin.widget.visits')}</h3>
          </section>
          <section>
            <dt>
              {this.loading ? (
                <LoadingIndicator size="small" display="inline" />
              ) : (
                <>
                  {this.stats.visitors.value} {this.changeToSpan(this.stats.visitors.change)}
                </>
              )}
            </dt>
            <h3>{app.translator.trans('michaelbelgium-umami.admin.widget.visitors')}</h3>
          </section>
        </div>
      </div>
    );
  }

  changeToSpan(change) {
    return (
      <span className={change >= 0 ? 'more' : 'less'}>
        {change >= 0 ? '+' : '-'} {change}
      </span>
    );
  }
}
