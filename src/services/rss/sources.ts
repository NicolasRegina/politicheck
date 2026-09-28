export interface RssFeedConfig {
  id: string;
  outletId: string;
  outletName: string;
  category: 'nacional' | 'internacional';
  defaultTopic: string;
  url: string;
}

export const RSS_FEEDS: RssFeedConfig[] = [
  // 1. Clarín
  {
    id: 'clarin-politica',
    outletId: 'clarin',
    outletName: 'Clarín',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.clarin.com/rss/politica/'
  },
  {
    id: 'clarin-economia',
    outletId: 'clarin',
    outletName: 'Clarín',
    category: 'nacional',
    defaultTopic: 'Economía',
    url: 'https://www.clarin.com/rss/economia/'
  },

  // 2. La Nación
  {
    id: 'lanacion-general',
    outletId: 'lanacion',
    outletName: 'La Nación',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml'
  },

  // 3. Infobae
  {
    id: 'infobae-general',
    outletId: 'infobae',
    outletName: 'Infobae',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.infobae.com/arc/outboundfeeds/rss/?outputType=xml'
  },

  // 4. Todo Noticias (TN)
  {
    id: 'tn-general',
    outletId: 'tn',
    outletName: 'Todo Noticias (TN)',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://tn.com.ar/rss.xml'
  },

  // 5. Página 12
  {
    id: 'pagina12-portada',
    outletId: 'pagina12',
    outletName: 'Página 12',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.pagina12.com.ar/rss/portada.xml'
  },

  // 6. Ámbito Financiero
  {
    id: 'ambito-home',
    outletId: 'ambito',
    outletName: 'Ámbito Financiero',
    category: 'nacional',
    defaultTopic: 'Economía',
    url: 'https://www.ambito.com/rss/pages/home.xml'
  },
  {
    id: 'ambito-politica',
    outletId: 'ambito',
    outletName: 'Ámbito Financiero',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.ambito.com/rss/pages/politica.xml'
  },

  // 7. El Cronista
  {
    id: 'cronista-general',
    outletId: 'cronista',
    outletName: 'El Cronista',
    category: 'nacional',
    defaultTopic: 'Economía',
    url: 'https://www.cronista.com/files/rss/news.xml'
  },

  // 8. Diario Perfil
  {
    id: 'perfil-general',
    outletId: 'perfil',
    outletName: 'Perfil',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.perfil.com/feed'
  },

  // 9. elDiarioAR
  {
    id: 'eldiarioar-general',
    outletId: 'eldiarioar',
    outletName: 'elDiarioAR',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.eldiarioar.com/rss/'
  },

  // 10. Crónica
  {
    id: 'cronica-general',
    outletId: 'cronica',
    outletName: 'Crónica',
    category: 'nacional',
    defaultTopic: 'Sociedad',
    url: 'https://www.cronica.com.ar/feed/'
  },

  // 11. BAE Negocios
  {
    id: 'baenegocios-general',
    outletId: 'baenegocios',
    outletName: 'BAE Negocios',
    category: 'nacional',
    defaultTopic: 'Economía',
    url: 'https://www.baenegocios.com/feed/'
  },

  // 12. La Izquierda Diario
  {
    id: 'izquierdadiario-general',
    outletId: 'izquierdadiario',
    outletName: 'La Izquierda Diario',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.laizquierdadiario.com/spip.php?page=backend'
  },

  // 13. Cenital
  {
    id: 'cenital-general',
    outletId: 'cenital',
    outletName: 'Cenital',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://cenital.com/feed/'
  },

  // 14. El Economista
  {
    id: 'eleconomista-general',
    outletId: 'eleconomista',
    outletName: 'El Economista',
    category: 'nacional',
    defaultTopic: 'Economía',
    url: 'https://eleconomista.com.ar/feed/'
  },

  // 15. El País (España - Mirada Exterior)
  {
    id: 'elpais-portada',
    outletId: 'elpais',
    outletName: 'El País',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada'
  },
  {
    id: 'elpais-argentina',
    outletId: 'elpais',
    outletName: 'El País',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/argentina/portada'
  },

  // 16. Expansión (España - Economía y Negocios Globales)
  {
    id: 'expansion-latam',
    outletId: 'expansion',
    outletName: 'Expansión',
    category: 'internacional',
    defaultTopic: 'Economía',
    url: 'https://e00-expansion.uecdn.es/rss/latinoamerica.xml'
  },

  // 17. France 24 en Español (Francia - Mirada Exterior)
  {
    id: 'france24-latam',
    outletId: 'france24',
    outletName: 'France 24',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://www.france24.com/es/am%C3%A9rica-latina/rss'
  },
  {
    id: 'france24-general',
    outletId: 'france24',
    outletName: 'France 24',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://www.france24.com/es/rss'
  },

  // 18. BBC News Mundo (Reino Unido - Mirada Exterior)
  {
    id: 'bbcmundo-general',
    outletId: 'bbcmundo',
    outletName: 'BBC News Mundo',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://feeds.bbci.co.uk/mundo/rss.xml'
  },

  // 19. El Mundo (España - Mirada Exterior)
  {
    id: 'elmundo-internacional',
    outletId: 'elmundo',
    outletName: 'El Mundo',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://e00-elmundo.uecdn.es/elmundo/rss/internacional.xml'
  },

  // 20. La Vanguardia (España - Mirada Exterior)
  {
    id: 'lavanguardia-internacional',
    outletId: 'lavanguardia',
    outletName: 'La Vanguardia',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://www.lavanguardia.com/rss/internacional.xml'
  },

  // 21. Le Monde (Francia - Mirada Exterior)
  {
    id: 'lemonde-international',
    outletId: 'lemonde',
    outletName: 'Le Monde',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://www.lemonde.fr/international/rss_full.xml'
  },

  // 22. Le Figaro (Francia - Mirada Exterior)
  {
    id: 'lefigaro-international',
    outletId: 'lefigaro',
    outletName: 'Le Figaro',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://www.lefigaro.fr/rss/figaro_international.xml'
  },

  // 23. The Guardian (Reino Unido - Mirada Exterior)
  {
    id: 'theguardian-americas',
    outletId: 'theguardian',
    outletName: 'The Guardian',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://www.theguardian.com/world/americas/rss'
  },

  // 24. The New York Times (EE.UU. - Mirada Exterior)
  {
    id: 'nyt-americas',
    outletId: 'nyt',
    outletName: 'The New York Times',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml'
  },

  // 25. DW Español (Alemania - Mirada Exterior)
  {
    id: 'dw-espanol',
    outletId: 'dw',
    outletName: 'DW Español',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://rss.dw.com/xml/rss-sp-all'
  },

  // 26. Nikkei Asia (Japón - Mirada Exterior)
  {
    id: 'nikkeiasia-world',
    outletId: 'nikkeiasia',
    outletName: 'Nikkei Asia',
    category: 'internacional',
    defaultTopic: 'Economía',
    url: 'https://asia.nikkei.com/rss/feed/nar'
  },

  // 27. The Japan Times (Japón - Mirada Exterior)
  {
    id: 'japantimes-news',
    outletId: 'japantimes',
    outletName: 'The Japan Times',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://www.japantimes.co.jp/feed/'
  },

  // 28. Xinhua News (China - Mirada Exterior)
  {
    id: 'xinhua-world',
    outletId: 'xinhua',
    outletName: 'Xinhua News',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'http://www.xinhuanet.com/english/rss/worldrss.xml'
  },

  // 29. La Derecha Diario (Nacional)
  {
    id: 'derechadiario-politica',
    outletId: 'derechadiario',
    outletName: 'La Derecha Diario',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://derechadiario.com.ar/rss/cat/politica'
  },
  {
    id: 'derechadiario-economia',
    outletId: 'derechadiario',
    outletName: 'La Derecha Diario',
    category: 'nacional',
    defaultTopic: 'Economía',
    url: 'https://derechadiario.com.ar/rss/cat/economia'
  }
];
