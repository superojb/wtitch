import Big from 'big.js';

// Configure Big.js global settings if necessary
Big.DP = 10; // Default decimal places
Big.RM = 1; // Round half up

export const BigFormatter = {
  /**
   * Formats a price based on the tick size.
   * Example: Price 123.456, TickSize 0.1 -> 123.5
   */
  formatPrice: (price: string | number, tickSize: string | number): string => {
    if (!price) return '0.00';
    try {
      const p = new Big(price);
      const t = new Big(tickSize);
      return p.div(t).round(0, 1).mul(t).toFixed(BigFormatter.getDecimals(t));
    } catch (e) {
      console.warn('BigFormatter error:', e);
      return String(price);
    }
  },

  /**
   * Formats an amount/quantity based on the step size.
   */
  formatAmount: (amount: string | number, stepSize: string | number): string => {
    if (!amount) return '0.00';
    try {
      const a = new Big(amount);
      const s = new Big(stepSize);
      // Floor rounding for amounts usually safer for selling
      return a.div(s).round(0, 0).mul(s).toFixed(BigFormatter.getDecimals(s));
    } catch (e) {
      return String(amount);
    }
  },

  /**
   * Helper to count decimal places from a step size string (e.g. "0.001" -> 3)
   */
  getDecimals: (stepSize: Big): number => {
    const s = stepSize.toString();
    if (s.indexOf('.') === -1) return 0;
    return s.split('.')[1].length;
  },
  
  /**
   * Compact format for large volumes (K, M, B)
   */
  formatVolume: (volume: string | number): string => {
      try {
          const v = new Big(volume);
          if (v.gte(1000000000)) return v.div(1000000000).toFixed(2) + 'B';
          if (v.gte(1000000)) return v.div(1000000).toFixed(2) + 'M';
          if (v.gte(1000)) return v.div(1000).toFixed(2) + 'K';
          return v.toFixed(2);
      } catch (e) {
          return '0.00';
      }
  }
};
