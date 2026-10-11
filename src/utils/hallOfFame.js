import { getCaptureRecord } from './captureSystem.js';

// Call from the final League victory handler, then persist the returned profile.
// A gym badge or partial Elite Four progress must never create an entry.
export function registerLeagueVictory(profile, capturedData, pokemonData, victory) {
  if (!victory?.id || victory.result !== 'champion') return profile;
  if (profile.hallOfFame?.some(entry => entry.id === victory.id)) return profile;
  const ids = (victory.team || []).map(Number);
  if (ids.length !== 6 || new Set(ids).size !== 6) return profile;
  const team = ids.map(id => {
    const pokemon = pokemonData.find(p => p.id === id);
    const record = getCaptureRecord(capturedData, id);
    if (!pokemon || !record.owned) return null;
    return { speciesId: id, name: pokemon.name, specimen: record.specimen ? JSON.parse(JSON.stringify(record.specimen)) : null };
  });
  if (team.some(member => !member)) return profile;
  const entry = { id: victory.id, wonAt: victory.wonAt || Date.now(), trainerName: profile.name, team };
  return { ...profile, hallOfFame: [entry, ...(profile.hallOfFame || [])] };
}
