import * as migration_20260719_204040_initial from './20260719_204040_initial';
import * as migration_20260729_203754_news_and_service_fields from './20260729_203754_news_and_service_fields';
import * as migration_20260806_120000_rename_services_to_poradnie from './20260806_120000_rename_services_to_poradnie';
import * as migration_20260807_223000_dane_ogolne_global from './20260807_223000_dane_ogolne_global';
import * as migration_20260808_120000_client_data_fields from './20260808_120000_client_data_fields';

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
  {
    up: migration_20260806_120000_rename_services_to_poradnie.up,
    down: migration_20260806_120000_rename_services_to_poradnie.down,
    name: '20260806_120000_rename_services_to_poradnie'
  },
  {
    up: migration_20260807_223000_dane_ogolne_global.up,
    down: migration_20260807_223000_dane_ogolne_global.down,
    name: '20260807_223000_dane_ogolne_global'
  },
  {
    up: migration_20260808_120000_client_data_fields.up,
    down: migration_20260808_120000_client_data_fields.down,
    name: '20260808_120000_client_data_fields'
  },
];
