import { Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // Envia para console em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric);
    return;
  }

  // Em produção, poderia enviar para um serviço de analytics
  // Por enquanto, vamos enviar para um endpoint local
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch((error) => {
      console.warn('Failed to send web vitals:', error);
    });
  }
}

export function reportWebVitals(metric: Metric) {
  sendToAnalytics(metric);
}

// Função para track eventos personalizados
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  const event = {
    name: eventName,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    },
  };

  // Envia para console em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics Event]', event);
    return;
  }

  // Em produção, envia para endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
      keepalive: true,
    }).catch((error) => {
      console.warn('Failed to send analytics event:', error);
    });
  }
}
