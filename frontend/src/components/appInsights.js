import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import tfconfig from '../../terraform.config.json' assert { type: 'json' };

const appInsights = new ApplicationInsights({
  config: {
    connectionString: tfconfig.application_insights_connection_string.value,
    enableAutoRouteTracking :true
    //enableAutoRouteTracking: true, // automatically track page views on route change (optional)
  }
});

appInsights.loadAppInsights();

export default appInsights;