import test from 'node:test';
import assert from 'node:assert/strict';
import {
  activateBoostItem, buyItem, claimAchievement, consumeInventoryItem, equipProfileImage, getAccumulatedExpForLevel,
  getLevelCost, getLevelProgress, getLevelRewards, getRetryBallId, getTitles, grantTrainerExperience, normalizeTrainerProfile,
  renameTrainer, resolveCaptureAttempt,
} from './trainerProgress.js';
import { normalizeSaveData, registerCapture, releasePokemon } from './captureSystem.js';

test('the trainer curve matches the documented costs and accumulated milestones', () => {
  assert.equal(getLevelCost(1), 100);
  assert.equal(getLevelCost(10), 1000);
  assert.equal(getLevelCost(25), 4750);
  assert.equal(getLevelCost(50), 17250);
  assert.equal(getLevelCost(75), 42250);
  assert.equal(getLevelCost(90), 72250);
  assert.equal(getLevelCost(99), 90250);
  assert.equal(getAccumulatedExpForLevel(10), 4500);
  assert.equal(getAccumulatedExpForLevel(25), 45750);
  assert.equal(getAccumulatedExpForLevel(50), 314500);
  assert.equal(getAccumulatedExpForLevel(75), 1045750);
  assert.equal(getAccumulatedExpForLevel(100), 2702000);
});

test('level rewards replace lower rewards and level ten grants both boosters', () => {
  const profile = grantTrainerExperience({ money: 0 }, 4500);
  assert.equal(profile.level, 10);
  assert.equal(profile.money, 9500);
  assert.equal(profile.inventory['lucky-egg'], 1);
  assert.equal(profile.inventory['amulet-coin'], 1);
  assert.equal(profile.boosts.luckyEggCharges, 0);
  assert.equal(profile.boosts.amuletCoinCharges, 0);
  assert.deepEqual(getLevelProgress(4500), { level: 10, total: 4500, current: 0, target: 1000, remaining: 1000, percent: 0 });
  assert.deepEqual(getLevelRewards(1, 10), { money: 9500, boostSets: 1, levelsGained: 9 });
});

test('progression items activate from the bag and grant ten capture charges', () => {
  const profile = normalizeTrainerProfile({ inventory: { 'lucky-egg': 2, 'amulet-coin': 1 } });
  const luckyEgg = activateBoostItem(profile, 'lucky-egg');
  assert.equal(luckyEgg.inventory['lucky-egg'], 1);
  assert.equal(luckyEgg.boosts.luckyEggCharges, 10);
  const amulet = activateBoostItem(luckyEgg, 'amulet-coin');
  assert.equal(amulet.inventory['amulet-coin'], 0);
  assert.equal(amulet.boosts.amuletCoinCharges, 10);
  assert.equal(activateBoostItem(amulet, 'amulet-coin'), amulet);
});

test('capture rewards combine rarity, shiny, perfect throw and boosters', () => {
  const profile = { money: 0, boosts: { luckyEggCharges: 2, amuletCoinCharges: 2 } };
  const result = resolveCaptureAttempt(profile, { id: 151, rarity: 'Legendario' }, { success: true, isShiny: true, perfect: true });
  assert.equal(result.rewards.experience, 9000);
  assert.equal(result.rewards.money, 3000);
  assert.equal(result.profile.boosts.luckyEggCharges, 1);
  assert.equal(result.profile.boosts.amuletCoinCharges, 1);
  assert.equal(result.profile.inventory['lucky-egg'], 1);
  assert.equal(result.profile.inventory['amulet-coin'], 1);
  const failed = resolveCaptureAttempt(result.profile, { rarity: 'Común' }, { success: false });
  assert.equal(failed.profile.boosts.luckyEggCharges, 0);
  assert.equal(failed.profile.boosts.amuletCoinCharges, 0);
});

test('achievement EXP can only be claimed once', () => {
  const profile = { name: 'RED', money: 0 };
  assert.equal(claimAchievement(profile, {}, 0, 'dex-1'), profile);
  const claimed = claimAchievement(profile, { 1: true }, 0, 'dex-1');
  assert.equal(claimed.experience, 250);
  assert.equal(claimAchievement(claimed, { 1: true }, 0, 'dex-1'), claimed);
});

test('Pikachu is the default avatar and five captures unlock the species portrait', () => {
  const profile = normalizeTrainerProfile({ name: 'RED', money: 0 });
  assert.equal(profile.profileImage, 'normal-25');
  assert.deepEqual(profile.unlockedProfileImages, ['normal-25']);
  assert.equal(equipProfileImage(profile, 'normal-6'), profile);

  const rewarded = claimAchievement(profile, { 6: { registered: true, owned: true, captures: 5 } }, 6, 'species-6-5');
  assert.equal(rewarded.experience, 1000);
  assert.equal(rewarded.money, 3500);
  assert.equal(rewarded.unlockedProfileImages.includes('normal-6'), true);
  assert.equal(equipProfileImage(rewarded, 'normal-6').profileImage, 'normal-6');
  assert.equal(claimAchievement(rewarded, { 6: { registered: true, owned: true, captures: 5 } }, 6, 'species-6-5'), rewarded);
});

test('purchases and paid renaming preserve inventory and never overdraw', () => {
  const profile = { name: 'RED', money: 700, inventory: { gift: 2 } };
  const purchased = buyItem(profile, 'poke-ball');
  assert.equal(purchased.money, 500);
  assert.equal(purchased.inventory['poke-ball'], 1);
  const renamed = renameTrainer(purchased, ' BLUE ');
  assert.equal(renamed.name, 'BLUE');
  assert.equal(renamed.money, 0);
  assert.equal(renamed.inventory.gift, 2);
  assert.equal(renameTrainer(renamed, 'GREEN'), renamed);

  const titled = buyItem({ money: 1200 }, 'shop-title');
  assert.equal(titled.money, 200);
  assert.equal(titled.inventory['shop-title'], undefined);
  assert.equal(titled.eventTitles[0].id, 'shop-title');
  assert.equal(getTitles(titled, {}).some(title => title.id === 'shop-title'), true);
  assert.equal(buyItem(titled, 'shop-title'), titled);

  const migrated = normalizeTrainerProfile({ inventory: { 'shop-title': 1, gift: 2 } });
  assert.equal(migrated.inventory['shop-title'], undefined);
  assert.equal(migrated.inventory.gift, 2);
  assert.equal(migrated.eventTitles[0].id, 'shop-title');

  const aids = buyItem({ money: 2000 }, 'max-repel');
  assert.equal(aids.money, 600);
  assert.equal(aids.inventory['max-repel'], 1);

  const discounted = buyItem({ money: 1000 }, 'super-ball', 300);
  assert.equal(discounted.money, 700);
  assert.equal(discounted.inventory['super-ball'], 1);

  const bulk = buyItem({ money: 2000 }, 'repel', 250, 4);
  assert.equal(bulk.money, 1000);
  assert.equal(bulk.inventory.repel, 4);

  const unaffordableBulk = buyItem({ money: 900 }, 'repel', 250, 4);
  assert.equal(unaffordableBulk.money, 900);
  assert.equal(unaffordableBulk.inventory?.repel, undefined);
});

test('album packs cost 750 coins and remain stored until opened in Albums', () => {
  const profile = buyItem({ money: 1500 }, 'album-pack', 750, 2);
  assert.equal(profile.money, 0);
  assert.equal(profile.inventory['album-pack'], 2);
});

test('capture retries choose the correct ball and consume exactly one item', () => {
  assert.equal(getRetryBallId({ rarity: 'Común' }), 'poke-ball');
  assert.equal(getRetryBallId({ rarity: 'Infrecuente' }), 'super-ball');
  assert.equal(getRetryBallId({ rarity: 'Raro' }), 'ultra-ball');
  assert.equal(getRetryBallId({ rarity: 'Legendario' }), 'master-ball');
  assert.equal(getRetryBallId({ id: 151, rarity: 'Mítico' }), 'master-ball');

  const profile = { money: 200, inventory: { 'ultra-ball': 2 } };
  const consumed = consumeInventoryItem(profile, 'ultra-ball');
  assert.equal(consumed.inventory['ultra-ball'], 1);
  assert.equal(consumed.money, 200);
  assert.equal(consumeInventoryItem(profile, 'poke-ball'), profile);
});

test('release preserves permanent registration and shiny history', () => {
  const save = { 151: { registered: true, owned: true, captures: 5, specialUnlock: true, specimen: { isShiny: true } } };
  const released = releasePokemon(normalizeSaveData(save), 151);
  const recaptured = registerCapture(released, { id: 151, name: 'Mew', stats: { hp: 100 } });
  assert.equal(recaptured[151].registered, true);
  assert.equal(recaptured[151].everShiny, true);
  assert.equal(recaptured[151].captures, 6);
  assert.equal(typeof recaptured[151].lastCapturedAt, 'number');
});
