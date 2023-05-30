import React, {useState, useEffect} from 'react'
import { Calendar, Views } from 'react-big-calendar'

// import {Modal, Spin} from 'antd'
import {startOfWeek, addDays, format} from 'date-fns';

import {localize, fmtEventStartEnd, formatTimestamp} from '../util/CalendarLocalizer'
import {getToolbar} from '../util/CalendarToolbar'


//import {  Styled } from 'direflow-component';

import calendarStyles from 'react-big-calendar/lib/css/react-big-calendar.css'
import additionalStyles from './Platzbelegung.css'

import {fetchEvents} from '../data/DataSource'
import { stageEvents } from '../data/StageEvents';

export default function Platzbelegung() {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

//  const [selectedDate, setSelectedDate] = useState(new Date());
  const [targetRange, setTargetRange] = useState(null); // der Datumsbereich, der zumindest geladen werden soll
  const [loadedRange, setLoadedRange] = useState(null); // der Datumsbereich, der effektiv geladen wurde
  const [isLoading, setIsLoading] = useState(null); // Variable, um zu vermeiden, dass mehrere Ladevorgänge gleichzeitig asynchron getriggered werden

  const [timestampDataLoaded, setTimestampDataLoaded] = useState(null);
  const [eventPopupVisible, setEventPopupVisible] = useState(false);


  return(
    <div>
      <div>This is a Test (8)</div>
      <div>Just write anything here</div>
    </div>
  );

}

function getStartOfWeek(day=new Date()) {
  const opts = {weekStartsOn: 1};
  return(startOfWeek(day, opts));
}