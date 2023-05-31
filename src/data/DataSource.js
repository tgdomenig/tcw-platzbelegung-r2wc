
import {format, addDays, parse} from 'date-fns'
import { fetchRestData } from './FetchData';

/* Fetch events from tribe events REST API and stage them in an appropriate format */

const IS_PRODUCTION_DATA = true;

const SITE = IS_PRODUCTION_DATA ? `https://tc-witikon.ch/` :  `https://tcw.it-couture.ch/`;

const TRIBE_ENDPOINT = `wp-json/tribe/events/v1/events`;

// const ENDPOINT_SLUG = SITE + `wp-json/tribe/events/v1/events?start_date=2021-04-01&per_page=100`;
//     https://tcw.it-couture.ch/wp-json/tribe/events/v1/events?start_date=2021-06-28&per_page=100

// https://tc-witikon.ch/wp-json/tribe/events/v1/events?start_date=2022-05-01&per_page=100
// https://tcw.it-couture.ch/wp-json/tribe/events/v1/events?start_date=2021-04-01&per_page=100

export async function fetchEvents({startDate, minEndDate}) {

  let lastFullyLoadedDay;

  const endpoint = SITE + TRIBE_ENDPOINT;


  // callback determines whether more data should be fetched
  const go_on_callback = (events) => {
    if (! events) {
      throw ({error: "SOMETHING WRONG, no events even though not end of data"});
    }
    const currentLastDate = _myParseDate(events[events.length-1].start_date);

    const go_on = (! minEndDate) || (currentLastDate <= minEndDate);

    if (! go_on) {
      lastFullyLoadedDay = addDays(currentLastDate, -1);
    }

    return go_on;
  }

  if (! lastFullyLoadedDay) {
    // in this case, all data was loaded
    lastFullyLoadedDay = Date.parse("2999-12-31");
  }

  const {events, error} = await fetchRestData({endpoint, startDate, go_on_callback, perPage: 100});

  return {events, error, lastFullyLoadedDay};

}

function _myParseDate(d) {
  return parse(d, "yyyy-MM-dd HH:mm:ss", new Date());
}

