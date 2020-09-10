import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.NUXT_ENV_APP_INSIGHT_KEY
    /* ...Other Configuration Options... */
  }
})
appInsights.loadAppInsights()
appInsights.trackPageView() // Manually call trackPageView to establish the current user/session/pageview
