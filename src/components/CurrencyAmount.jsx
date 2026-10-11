import './CurrencyAmount.css';

const COIN_IMAGE = '/assets/items/coin.png';

export default function CurrencyAmount({ amount = 0, prefix = '', className = '' }) {
  const numericAmount = Number(amount) || 0;

  return (
    <span className={`currency-amount ${className}`.trim()} aria-label={`${prefix}${numericAmount.toLocaleString('es-CL')} monedas`}>
      {prefix && <span className="currency-amount-prefix" aria-hidden="true">{prefix}</span>}
      <img src={COIN_IMAGE} alt="" aria-hidden="true" />
      <span>{numericAmount.toLocaleString('es-CL')}</span>
    </span>
  );
}
