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

  const [selectedEvent, setSelectedEvent] = useState(null);

//  const [events, setEvents] = useState([]);

  return(
    <div>
      <div>This is a Test (10)</div>
      <div>Just write anything here</div>
    </div>
  );

}