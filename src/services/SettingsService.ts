import { supabase } from '@/services/supabase';

import { useProfileSettingsStore } from '@/stores/settingsStore';
import { ProfileSettings, ProfileSettingsDto } from '@/domain/ProfileSettings';
import snakecaseKeys from 'snakecase-keys';

const table = 'settings';
const store = useProfileSettingsStore();

const toDomain = (dto: ProfileSettingsDto): ProfileSettings => {
  return {
    email: dto.email,
    displayName: dto.display_name,
    newsletterSubscribe: dto.newsletter_subscribe,
  }
}

async function hasSettings() {
  const { data, error } = await supabase.from<ProfileSettingsDto>(table).select('*').single();
  return !error && data;
}

async function initSettings() {
  const { data, error } = await supabase.from<ProfileSettingsDto>(table).select('*').single();
  if (data) store.init(toDomain(data));
  return error;
}

async function createSettings() {
  const { error } = await supabase.from<ProfileSettingsDto>(table).insert(snakecaseKeys(store.settings));
  return error;
}

async function updateSettings(settings: ProfileSettings, userId: string) {
  const { error } = await supabase.from<ProfileSettingsDto>(table).update(snakecaseKeys(settings)).eq('user_id', userId);
  if (!error) store.update(settings);
  return error;
}

export { hasSettings, initSettings, createSettings, updateSettings };
