import * as migration_20260719_204040_initial from './20260719_204040_initial';
import * as migration_20260729_203754_news_and_service_fields from './20260729_203754_news_and_service_fields';

export const migrations = [
  {
    up: migration_20260719_204040_initial.up,
    down: migration_20260719_204040_initial.down,
    name: '20260719_204040_initial',
  },
  {
    up: migration_20260729_203754_news_and_service_fields.up,
    down: migration_20260729_203754_news_and_service_fields.down,
    name: '20260729_203754_news_and_service_fields'
  },
];
