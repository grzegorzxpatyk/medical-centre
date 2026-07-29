import * as migration_20260719_204040_initial from './20260719_204040_initial';

export const migrations = [
  {
    up: migration_20260719_204040_initial.up,
    down: migration_20260719_204040_initial.down,
    name: '20260719_204040_initial'
  },
];
