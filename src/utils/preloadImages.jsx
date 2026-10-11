// src/utils/preloadImages.js
export const preloadAllSilhouettes = () => {
  const promises = [];

  for (let i = 1; i <= 150; i++) {
    const img = new Image();
    img.src = `/assets/Pokedex_silueta/${i}.png`;
    promises.push(
      new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // incluso si falla, no bloqueamos
      })
    );
  }

  return Promise.all(promises);
};