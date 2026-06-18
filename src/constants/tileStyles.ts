export type TileStyle = {
  gradient: string;
  color: string;
  fontSize: number;
};

export const TILE_STYLES: Record<number, TileStyle> = {
  2:    { gradient: 'linear-gradient(135deg, rgb(255,205,171) 0%, rgb(252,199,162) 100%)', color: '#96694b', fontSize: 45 },
  4:    { gradient: 'linear-gradient(135deg, rgb(252,221,157) 0%, rgb(246,213,147) 100%)', color: '#906f2b', fontSize: 45 },
  8:    { gradient: 'linear-gradient(135deg, rgb(192,210,198) 0%, rgb(190,209,197) 100%)', color: '#668270', fontSize: 45 },
  16:   { gradient: 'linear-gradient(135deg, rgb(199,202,175) 0%, rgb(197,196,168) 100%)', color: '#777755', fontSize: 45 },
  32:   { gradient: 'linear-gradient(135deg, rgb(197,212,238) 0%, rgb(181,199,229) 100%)', color: '#697a97', fontSize: 45 },
  64:   { gradient: 'linear-gradient(135deg, rgb(197,193,231) 0%, rgb(178,179,224) 100%)', color: '#6d6b93', fontSize: 45 },
  128:  { gradient: 'linear-gradient(135deg, rgb(196,171,255) 0%, rgb(232,162,252) 100%)', color: '#8665a3', fontSize: 42 },
  256:  { gradient: 'linear-gradient(135deg, rgb(240,128,210) 0%, rgb(235,110,200) 100%)', color: '#8b2882', fontSize: 42 },
  512:  { gradient: 'linear-gradient(135deg, rgb(233,149,216) 0%, rgb(228,151,213) 100%)', color: '#8e5081', fontSize: 42 },
  1024: { gradient: 'linear-gradient(135deg, rgb(248,168,169) 0%, rgb(247,158,160) 100%)', color: '#a75253', fontSize: 36 },
  2048: { gradient: 'linear-gradient(135deg, rgb(255,215,80)  0%, rgb(255,185,0)   100%)', color: '#7a5200', fontSize: 32 },
};

export const UNKNOWN_TILE_STYLE: TileStyle = {
  gradient: 'linear-gradient(135deg, rgb(220,80,80) 0%, rgb(195,55,55) 100%)',
  color: '#fff',
  fontSize: 26,
};
