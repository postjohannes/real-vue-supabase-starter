import { supabase } from '@/services/supabase';

import { useProfileStore } from '@/stores/profileStore';
import { Profile, ProfileDto } from '@/domain/Profile';

const table = 'profiles';
const store = useProfileStore();

const toDomain = (dto: ProfileDto): Profile => {
  return {
    loginProvider: dto.login_provider,
    lastLogin: dto.last_login,
  };
};

async function initProfile() {
  const { data, error } = await supabase.from<ProfileDto>(table).select('*').single();
  if (data) store.update(toDomain(data));
  return error;
}

async function createProfile(loginProvider: string, lastLogin: Date) {
  const profile = {
    login_provider: loginProvider,
    last_login: lastLogin,
  } as ProfileDto;
  const { error } = await supabase.from<ProfileDto>(table).insert(profile, { returning: 'minimal' });
  store.update(toDomain(profile));
  return error;
}

async function hasSupabaseEntry(userId: string) {
  const { error, data } = await supabase.from<ProfileDto>(table).select('*').eq('user_id', userId).single();
  return !error && !!data;
}

export { initProfile, createProfile, hasSupabaseEntry };
