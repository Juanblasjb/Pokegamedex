import test from 'node:test';
import assert from 'node:assert/strict';
import { applyRocketDefeat, resolveRocketBattle, typeMultiplier } from './rocketBattle.js';

test('aplica debilidades e inmunidades de tipos', () => {
  assert.equal(typeMultiplier(['Agua'], ['Fuego']), 2);
  assert.equal(typeMultiplier(['Eléctrico'], ['Tierra']), 0);
});

test('una derrota normal descuenta la mitad de la recompensa y no roba objetos', () => {
  const result = applyRocketDefeat({ money: 2000, inventory: { 'poke-ball': 2 } }, { reward: 1000 });
  assert.equal(result.moneyLost, 500);
  assert.equal(result.profile.money, 1500);
  assert.equal(result.stolenItemId, null);
  assert.equal(result.profile.inventory['poke-ball'], 2);
});

test('una derrota contra jefe descuenta el doble y roba una unidad', () => {
  const result = applyRocketDefeat({ money: 5000, inventory: { 'poke-ball': 2 } }, { reward: 1000, boss: true }, 0);
  assert.equal(result.moneyLost, 2000);
  assert.equal(result.profile.money, 3000);
  assert.equal(result.stolenItemId, 'poke-ball');
  assert.equal(result.profile.inventory['poke-ball'], 1);
});

test('el cálculo doble compara estadísticas de ambos equipos', () => {
  const strong = { type: ['Agua'], stats: { hp: 100, atk: 100, def: 100, spAtk: 100, spDef: 100, spd: 100 } };
  const weak = { type: ['Fuego'], stats: { hp: 10, atk: 10, def: 10, spAtk: 10, spDef: 10, spd: 10 } };
  assert.equal(resolveRocketBattle([strong, strong], [weak, weak], 'assault', 0.5).won, true);
});
