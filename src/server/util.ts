export const is_production = (process.env.NODE_ENV === 'production');
export const is_development = !is_production;