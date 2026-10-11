export const STICKERS_PER_PACK = 5;
export const NORMAL_DUPLICATE_VALUE = 100;
export const HOLO_DUPLICATE_VALUE = 200;

const stickerKey = (speciesId, slot) => `${speciesId}-${slot}`;

export function normalizeAlbumCollection(collection = {}) {
  return {
    collected: { ...(collection.collected || {}) },
    placed: { ...(collection.placed || {}) },
  };
}

export function getAlbumSticker(collection, speciesId, slot) {
  const key = stickerKey(speciesId, slot);
  return {
    key,
    sticker: collection?.collected?.[key] || null,
    placed: Boolean(collection?.placed?.[key]),
  };
}

export function openAlbumPacks(rawProfile, requestedPacks = 1, { random = Math.random, includeMew = false, now = Date.now() } = {}) {
  const availablePacks = Math.max(0, Number(rawProfile?.inventory?.['album-pack']) || 0);
  const packCount = Math.max(0, Math.min(availablePacks, Math.floor(Number(requestedPacks) || 0)));
  if (!packCount) return { profile: rawProfile, stickers: [], duplicateMoney: 0, packCount: 0 };

  const albumCollection = normalizeAlbumCollection(rawProfile.albumCollection);
  const stickers = [];
  let duplicateMoney = 0;
  const speciesCount = includeMew ? 151 : 150;

  for (let index = 0; index < packCount * STICKERS_PER_PACK; index += 1) {
    const speciesId = 1 + Math.floor(random() * speciesCount);
    const slot = 1 + Math.floor(random() * 11);
    const finish = random() < 0.12 ? 'holo' : 'normal';
    const key = stickerKey(speciesId, slot);
    const duplicate = Boolean(albumCollection.collected[key]);
    const resaleValue = duplicate ? (finish === 'holo' ? HOLO_DUPLICATE_VALUE : NORMAL_DUPLICATE_VALUE) : 0;
    const sticker = { key, speciesId, slot, finish, duplicate, resaleValue };

    if (duplicate) duplicateMoney += resaleValue;
    else albumCollection.collected[key] = { speciesId, slot, finish, obtainedAt: now + index };
    stickers.push(sticker);
  }

  return {
    profile: {
      ...rawProfile,
      money: Math.max(0, Number(rawProfile.money) || 0) + duplicateMoney,
      inventory: { ...rawProfile.inventory, 'album-pack': availablePacks - packCount },
      albumCollection,
    },
    stickers,
    duplicateMoney,
    packCount,
  };
}

export function placeAlbumSticker(rawProfile, speciesId, slot) {
  const albumCollection = normalizeAlbumCollection(rawProfile?.albumCollection);
  const key = stickerKey(speciesId, slot);
  if (!albumCollection.collected[key] || albumCollection.placed[key]) return rawProfile;
  return {
    ...rawProfile,
    albumCollection: {
      ...albumCollection,
      placed: { ...albumCollection.placed, [key]: true },
    },
  };
}
