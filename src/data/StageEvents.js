import {parse} from 'date-fns'

export function stageEvents(jsonEvents) {

  if (jsonEvents) {
    return jsonEvents.map(({id, title, start_date, end_date, itc_platzbelegung}) => {

      const plaetze = stagePlatzbelegung(itc_platzbelegung);


      return plaetze.map(({className, platz}) => (
        {
          id: id + " " + platz,
          title, // default accessor for react-big-calendar
          start: _myParseDate(start_date), // default accessor for react-big-calendar
          end: _myParseDate(end_date), // default accessor for react-big-calendar
          platz,
          className
        })
      );
    }).flat();
  }

}

function _myParseDate(d) {
  return parse(d, "yyyy-MM-dd HH:mm:ss", new Date());
}

  /* 
    NOTE: itc_platzbelegung is an attribute corresponding to a custom field of the custom post type that is created by EventsCalendar.
    It is added to the WP REST API using the tribe-events filters 'tribe_rest_single_event_data' and 'tribe_rest_event_data'; see the functions.php file 
    of the child-theme.
    itc_platzbelegung has the format ["1"] (Belegung Platz 1) or in case of several occupied courts ["1|3|4"] (Belegung Plätze 1, 3, 4);
  */
function stagePlatzbelegung(itc_platzbelegung) {

  if (itc_platzbelegung && itc_platzbelegung.length > 0 && itc_platzbelegung[0] !== "") {
    return itc_platzbelegung[0].split("|").map(s => ({className: "platz-" + s, platz: "Platz " + s}));
  }
  else return []
}

/* ---- EXAMPLE TRIBE EVENT as received from endpoint https://tcw.it-couture.ch/wp-json/tribe/events/v1/events ---- 

{
  "id": 8212,
  "global_id": "tcw.it-couture.ch?id=8212",
  "global_id_lineage": [
    "tcw.it-couture.ch?id=8212"
  ],
  "author": "1",
  "status": "publish",
  "date": "2021-04-07 09:15:56",
  "date_utc": "2021-04-07 07:15:56",
  "modified": "2021-04-07 09:15:56",
  "modified_utc": "2021-04-07 07:15:56",
  "url": "https://tcw.it-couture.ch/event/interclub-40-3l-damen-r-bachmann-3/",
  "rest_url": "https://tcw.it-couture.ch/wp-json/tribe/events/v1/events/8212",
  "title": "Interclub 40+ 3L Damen (R. Bachmann)",
  "description": "",
  "excerpt": "",
  "slug": "interclub-40-3l-damen-r-bachmann-3",
  "image": false,
  "all_day": false,
  "start_date": "2021-06-26 09:00:00",
  "start_date_details": {
    "year": "2021",
    "month": "06",
    "day": "26",
    "hour": "09",
    "minutes": "00",
    "seconds": "00"
  },
  "end_date": "2021-06-26 13:00:00",
  "end_date_details": {
    "year": "2021",
    "month": "06",
    "day": "26",
    "hour": "13",
    "minutes": "00",
    "seconds": "00"
  },
  "utc_start_date": "2021-06-26 07:00:00",
  "utc_start_date_details": {
    "year": "2021",
    "month": "06",
    "day": "26",
    "hour": "07",
    "minutes": "00",
    "seconds": "00"
  },
  "utc_end_date": "2021-06-26 11:00:00",
  "utc_end_date_details": {
    "year": "2021",
    "month": "06",
    "day": "26",
    "hour": "11",
    "minutes": "00",
    "seconds": "00"
  },
  "timezone": "Europe/Berlin",
  "timezone_abbr": "CEST",
  "cost": "",
  "cost_details": {
    "currency_symbol": "",
    "currency_position": "prefix",
    "values": []
  },
  "website": "",
  "show_map": false,
  "show_map_link": false,
  "hide_from_listings": false,
  "sticky": false,
  "featured": false,
  "categories": [
    {
      "name": "Platzbelegung Interclub",
      "slug": "platzbelegung-interclub",
      "term_group": 0,
      "term_taxonomy_id": 28,
      "taxonomy": "tribe_events_cat",
      "description": "",
      "parent": 0,
      "count": 20,
      "filter": "raw",
      "id": 28,
      "urls": {
        "self": "https://tcw.it-couture.ch/wp-json/tribe/events/v1/categories/28",
        "collection": "https://tcw.it-couture.ch/wp-json/tribe/events/v1/categories"
      }
    }
  ],
  "tags": [],
  "venue": {
    "id": 1187,
    "author": "7",
    "status": "publish",
    "date": "2017-03-05 12:39:47",
    "date_utc": "2017-03-05 11:39:47",
    "modified": "2017-03-05 12:39:47",
    "modified_utc": "2017-03-05 11:39:47",
    "url": "https://tcw.it-couture.ch/veranstaltungsort/tennis-club-witikon/",
    "venue": "Tennis Club Witikon",
    "slug": "tennis-club-witikon",
    "address": "Eschenhaustrasse 29",
    "city": "Zürich",
    "country": "Schweiz",
    "province": "Zürich",
    "zip": "8053",
    "stateprovince": "Zürich",
    "geo_lat": 47.3656629,
    "geo_lng": 8.5892775,
    "json_ld": {
      "@type": "Place",
      "name": "Tennis Club Witikon",
      "description": "",
      "url": "https://tcw.it-couture.ch/veranstaltungsort/tennis-club-witikon/",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Eschenhaustrasse 29",
        "addressLocality": "Zürich",
        "addressRegion": "Zürich",
        "postalCode": "8053",
        "addressCountry": "Schweiz"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.3656629,
        "longitude": 8.5892775
      },
      "telephone": "",
      "sameAs": ""
    },
    "show_map": true,
    "show_map_link": true,
    "global_id": "tcw.it-couture.ch?id=1187",
    "global_id_lineage": [
      "tcw.it-couture.ch?id=1187"
    ]
  },
  "organizer": [],
  "json_ld": {
    "@context": "http://schema.org",
    "@type": "Event",
    "name": "Interclub 40+ 3L Damen (R. Bachmann)",
    "description": "",
    "url": "https://tcw.it-couture.ch/event/interclub-40-3l-damen-r-bachmann-3/",
    "startDate": "2021-06-26T09:00:00+02:00",
    "endDate": "2021-06-26T13:00:00+02:00",
    "location": {
      "@type": "Place",
      "name": "Tennis Club Witikon",
      "description": "",
      "url": "https://tcw.it-couture.ch/veranstaltungsort/tennis-club-witikon/",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Eschenhaustrasse 29",
        "addressLocality": "Zürich",
        "addressRegion": "Zürich",
        "postalCode": "8053",
        "addressCountry": "Schweiz"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.3656629,
        "longitude": 8.5892775
      },
      "telephone": "",
      "sameAs": ""
    },
    "performer": "Organization"
  },
  "itc_platzbelegung": [
    "1|2|3|4"
  ]
}

*/