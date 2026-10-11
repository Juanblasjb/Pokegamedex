import test from 'node:test';
import assert from 'node:assert/strict';
import { registerLeagueVictory } from './hallOfFame.js';

const pokemon = Array.from({ length: 6 }, (_, index) => ({ id: index + 1, name: `Pokemon ${index + 1}` }));
const victory = { id: 'league-run-1', result: 'champion', team: [1, 2, 3, 4, 5, 6], wonAt: 1000 };
const captures = () => Object.fromEntries(pokemon.map(p => [p.id, { owned: true, registered: true, specimen: { id: `specimen-${p.id}`, isShiny: p.id === 1, nature: 'Firme', stats: { hp: 45 } } }]));

test('the Hall records six champion specimens independently from later releases or recaptures', () => {
  const data = captures();
  const result = registerLeagueVictory({ name: 'RED' }, data, pokemon, victory);
  assert.equal(result.hallOfFame[0].team.length, 6);
  assert.equal(result.hallOfFame[0].trainerName, 'RED');
  data[1].specimen.stats.hp = 90;
  data[2].specimen = null;
  assert.equal(result.hallOfFame[0].team[0].specimen.stats.hp, 45);
  assert.equal(result.hallOfFame[0].team[0].specimen.isShiny, true);
  assert.equal(result.hallOfFame[0].team[1].specimen.id, 'specimen-2');
  assert.equal(registerLeagueVictory(result, data, pokemon, victory), result);
});

test('gym wins, partial teams, duplicate slots and unowned Pokemon never enter the Hall', () => {
  const profile = { name: 'RED', gymProgress: 9 };
  const data = captures();
  for (const invalid of [{ ...victory, result: 'gym' }, { ...victory, team: [1, 2, 3] }, { ...victory, team: [1, 2, 3, 4, 5, 5] }]) {
    assert.equal(registerLeagueVictory(profile, data, pokemon, invalid), profile);
  }
  data[6].owned = false;
  assert.equal(registerLeagueVictory(profile, data, pokemon, victory), profile);
});

test('each distinct victory preserves its original team and appears newest first', () => {
  const first = registerLeagueVictory({ name: 'RED' }, captures(), pokemon, victory);
  const second = registerLeagueVictory(first, captures(), pokemon, { ...victory, id: 'league-run-2', wonAt: 2000 });
  assert.deepEqual(second.hallOfFame.map(entry => entry.id), ['league-run-2', 'league-run-1']);
});
