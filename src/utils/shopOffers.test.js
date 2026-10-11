import test from 'node:test';
import assert from 'node:assert/strict';
import { SHOP_ITEMS } from './trainerProgress.js';
import { createShopOffers, formatOfferRemaining, getDiscountedPrice } from './shopOffers.js';

test('shop offers are stable, capped and never include album packs', () => {
  const morning = new Date(2026, 8, 21, 9).getTime();
  const evening = new Date(2026, 8, 21, 22).getTime();
  const first = createShopOffers(SHOP_ITEMS, morning);
  const second = createShopOffers(SHOP_ITEMS, evening);
  assert.deepEqual(first, second);
  assert.equal(first.length, 3);
  assert.equal(first[0].kind, 'daily');
  assert.equal(first[0].discount, 50);
  assert.equal(first.some(offer => offer.itemId === 'album-pack'), false);
  assert.equal(new Set(first.map(offer => offer.itemId)).size, first.length);
  first.slice(1).forEach(offer => assert.equal(offer.discount >= 5 && offer.discount <= 25, true));
});

test('discounted prices use the advertised percentage', () => {
  assert.equal(getDiscountedPrice(1000, 50), 500);
  assert.equal(getDiscountedPrice(600, 25), 450);
});

test('offer countdowns preserve days, hours and minutes', () => {
  const now = new Date(2026, 8, 22, 10, 0).getTime();
  const endsAt = now + (((2 * 24 * 60) + (3 * 60) + 4) * 60000);
  assert.equal(formatOfferRemaining(endsAt, now), '2d 3h 4m');
});
