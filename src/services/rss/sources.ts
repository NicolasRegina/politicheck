export interface RssFeedConfig {
  id: string;
  outletId: string;
  outletName: string;
  category: 'nacional' | 'internacional';
  defaultTopic: string;
  url: string;
}

export const RSS_FEEDS: RssFeedConfig[] = [
  // Clarín
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
  // La Nación
  {
    id: 'lanacion-general',
    outletId: 'lanacion',
    outletName: 'La Nación',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml'
  },
  // Infobae
  {
    id: 'infobae-general',
    outletId: 'infobae',
    outletName: 'Infobae',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.infobae.com/arc/outboundfeeds/rss/?outputType=xml'
  },
  // Ámbito Financiero
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
  // El Cronista
  {
    id: 'cronista-general',
    outletId: 'cronista',
    outletName: 'El Cronista',
    category: 'nacional',
    defaultTopic: 'Economía',
    url: 'https://www.cronista.com/files/rss/news.xml'
  },
  // Página 12
  {
    id: 'pagina12-portada',
    outletId: 'pagina12',
    outletName: 'Página 12',
    category: 'nacional',
    defaultTopic: 'Política',
    url: 'https://www.pagina12.com.ar/rss/portada.xml'
  },
  // Mirada Exterior (Internacional)
  {
    id: 'elpais-argentina',
    outletId: 'elpais',
    outletName: 'El País',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada'
  },
  {
    id: 'cnn-espanol',
    outletId: 'cnn',
    outletName: 'CNN en Español',
    category: 'internacional',
    defaultTopic: 'Internacional',
    url: 'https://cnnespanol.cnn.com/feed/'
  }
];
