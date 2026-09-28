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

  // 15. El País (Mirada Exterior)
  {
    id: 'elpais-argentina',
    outletId: 'elpais',
    outletName: 'El País',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada'
  },

  // 16. CNN en Español (Mirada Exterior)
  {
    id: 'cnn-espanol',
    outletId: 'cnn',
    outletName: 'CNN en Español',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://cnnespanol.cnn.com/feed/'
  },

  // 17. BBC News Mundo (Mirada Exterior)
  {
    id: 'bbcmundo-general',
    outletId: 'bbcmundo',
    outletName: 'BBC News Mundo',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://feeds.bbci.co.uk/mundo/rss.xml'
  },

  // 18. La Derecha Diario
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
