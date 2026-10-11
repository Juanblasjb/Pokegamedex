import test from 'node:test';
import assert from 'node:assert/strict';
import { openAlbumPacks, placeAlbumSticker } from './albumCollection.js';

const sequenceRandom = values => {
  let index = 0;
  return () => values[index++ % values.length];
};

test('opening a pack consumes it and stores five new stickers', () => {
  const result = openAlbumPacks({ money: 0, inventory: { 'album-pack': 2 } }, 1, {
    random: sequenceRandom([0, 0, .5, .1, .1, .5, .2, .2, .5, .3, .3, .5, .4, .4, .5]),
    now: 1000,
  });
  assert.equal(result.packCount, 1);
  assert.equal(result.stickers.length, 5);
  assert.equal(result.profile.inventory['album-pack'], 1);
  assert.equal(Object.keys(result.profile.albumCollection.collected).length, 5);
});

test('duplicates are sold automatically using their finish value', () => {
  const profile = {
    money: 50,
    inventory: { 'album-pack': 1 },
    albumCollection: { collected: { '1-1': { speciesId: 1, slot: 1, finish: 'normal' } }, placed: {} },
  };
  const result = openAlbumPacks(profile, 1, { random: sequenceRandom([0, 0, .5]) });
  assert.equal(result.duplicateMoney, 100 * 5);
  assert.equal(result.profile.money, 550);
  assert.equal(result.stickers.every(sticker => sticker.duplicate), true);
});

test('a collected sticker can be placed only once', () => {
  const profile = { albumCollection: { collected: { '25-3': { speciesId: 25, slot: 3, finish: 'holo' } }, placed: {} } };
  const placed = placeAlbumSticker(profile, 25, 3);
  assert.equal(placed.albumCollection.placed['25-3'], true);
  assert.equal(placeAlbumSticker(placed, 25, 3), placed);
});
