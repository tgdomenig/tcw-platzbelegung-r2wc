import React, {useState, useEffect} from 'react';
import { Calendar, Views } from 'react-big-calendar';

// import {Modal, Spin} from 'antd';
import {startOfWeek, addDays, format} from 'date-fns';

import {localize, fmtEventStartEnd, formatTimestamp} from '../util/CalendarLocalizer';
import {getToolbar} from '../util/CalendarToolbar';


//import {  Styled } from 'direflow-component';

import calendarStyles from 'react-big-calendar/lib/css/react-big-calendar.css';
import additionalStyles from './Platzbelegung.css';

import {fetchEvents} from '../data/DataSource';
import { stageEvents } from '../data/StageEvents';

export default function Platzbelegung() {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* 
  Bemerkung: react-big-calendar zeigt die Agenda immer vom selektierten Datum an 30 Tage vorwärts.
  Wir wollen jedoch statt dessen die Agenda synchron mit der "Week View" zeigen, d.h. für die selektierte Woche.
  Zu diesem Zweck müssen wir das selektierte Datum "kontrollieren", d.h. als Zustandsvariable ausserhalb des Kalenders
  definieren und explizit setzen, wenn zur Agenda-View gewechselt wird.
  */
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [targetRange, setTargetRange] = useState(null); // der Datumsbereich, der zumindest geladen werden soll
  const [loadedRange, setLoadedRange] = useState(null); // der Datumsbereich, der effektiv geladen wurde
  const [isLoading, setIsLoading] = useState(null); // Variable, um zu vermeiden, dass mehrere Ladevorgänge gleichzeitig asynchron getriggered werden

  const [timestampDataLoaded, setTimestampDataLoaded] = useState(null);
  const [eventPopupVisible, setEventPopupVisible] = useState(false);

  const isInTargetRange = (selDate, tgtRange) => {
    return tgtRange && selDate >= tgtRange[0] && selDate <= tgtRange[1];
  }

  const determineTargetRange = (selDate) => {
    const startOfWeek = getStartOfWeek(selDate);
//    const endOfWeek = addDays(startOfWeek, 6); // end of current week
    const targetEnd = addDays(startOfWeek, 20); // end of current week
    return [startOfWeek, targetEnd];
  }

  const isContainedInLoadedRange = (tgtRange, lddRange) => {
    return (tgtRange && lddRange && tgtRange[0] >= lddRange[0] && tgtRange[1] <= lddRange[1])
  }

  // bestimme, abhängig vom targetRange und dem bereits geladenen Range, welcher Bereich zusätzlich geladen werden soll
  const determineLoadingRange = (tgtRange, lddRange) => {
    let a, b, minDateLoaded;
    if (! lddRange) {
      minDateLoaded = addDays(tgtRange[0],-7);
      a = minDateLoaded;
      b = tgtRange[1];
    }
    else {
      if (tgtRange[0] < lddRange[0]) {
        minDateLoaded = addDays(tgtRange[0],-14);
        a = minDateLoaded;
        b = lddRange[0];
      }
      else { // targetRange[1] > loadedRange[1]
        minDateLoaded = lddRange[0];
        a = lddRange[1];
        b = tgtRange[1];
      }
    }
    return {loadingRange: [a,b], minDateLoaded};
  }

  return(
    <div>
      <div>This is a Platzbelegung (1)</div>
      <div>Just write anything here</div>
    </div>
  );

}
