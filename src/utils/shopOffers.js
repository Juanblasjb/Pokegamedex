const DAY_MS = 24 * 60 * 60 * 1000;

const hashString = value => {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRandom = seed => {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffle = (items, random) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
};

export const getLocalDayKey = timestamp => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export function createShopOffers(items, timestamp = Date.now()) {
  const now = new Date(timestamp);
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daySerial = Math.floor(Date.UTC(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate()) / DAY_MS);
  const blockStartSerial = Math.floor(daySerial / 5) * 5;
  const daysUntilNextBlock = (blockStartSerial + 5) - daySerial;
  const dailyEndsAt = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate() + 1).getTime();
  const rotationEndsAt = new Date(dayStart.getFullYear(), dayStart.getMonth(), dayStart.getDate() + daysUntilNextBlock).getTime();
  const eligible = items.filter(item => item.price != null && !item.future && !item.progressionOnly && item.id !== 'album-pack');

  const rotationRandom = createRandom(hashString(`shop-rotation-${blockStartSerial}`));
  const rotatingItems = shuffle(eligible, rotationRandom).slice(0, 2);
  const rotatingIds = new Set(rotatingItems.map(item => item.id));
  const dailyCandidates = eligible.filter(item => !rotatingIds.has(item.id));
  const dailyRandom = createRandom(hashString(`shop-daily-${getLocalDayKey(timestamp)}`));
  const dailyItem = shuffle(dailyCandidates, dailyRandom)[0];

  const offers = dailyItem ? [{ itemId: dailyItem.id, discount: 50, kind: 'daily', endsAt: dailyEndsAt }] : [];
  rotatingItems.forEach(item => offers.push({
    itemId: item.id,
    discount: 5 + Math.floor(rotationRandom() * 21),
    kind: 'rotation',
    endsAt: rotationEndsAt,
  }));
  return offers;
}

export function getDiscountedPrice(price, discount) {
  const original = Math.max(0, Number(price) || 0);
  const percentage = Math.max(0, Math.min(100, Number(discount) || 0));
  return Math.max(0, Math.round(original * (1 - (percentage / 100))));
}

export function formatOfferRemaining(endsAt, timestamp = Date.now()) {
  const remaining = Math.max(0, endsAt - timestamp);
  const totalMinutes = Math.ceil(remaining / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
