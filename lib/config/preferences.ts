export const APP_CONFIG = {
  validation: {
    company: {
      nameMinLength: 2,
      nameMaxLength: 100,
      registrationNumberPattern: /^[A-Z0-9]{6,10}$/,
      phonePattern: /^\+?[1-9]\d{1,14}$/,
    },
    pagination: {
      defaultPageSize: 10,
      maxPageSize: 100,
    },
  },
  ui: {
    toast: {
      duration: 5000,
      position: 'top-right',
    },
    table: {
      defaultSort: 'created_at',
      defaultOrder: 'desc',
    },
  },
  dates: {
    format: 'yyyy-MM-dd',
    timezone: 'UTC',
  },
  features: {
    enableOptimisticUpdates: true,
    useEdgeRuntime: true,
    enableAnalytics: true,
  },
} as const;

export type ValidationRules = typeof APP_CONFIG.validation;
export type UIPreferences = typeof APP_CONFIG.ui;
export type FeatureFlags = typeof APP_CONFIG.features; 