import React, {useState, useEffect} from 'react'
import { Calendar, Views } from 'react-big-calendar'

// import {Modal, Spin} from 'antd'
import {startOfWeek, addDays, format} from 'date-fns';

import {localize, fmtEventStartEnd, formatTimestamp} from '../util/CalendarLocalizer'
import {getToolbar} from '../util/CalendarToolbar'


//import {  Styled } from 'direflow-component';

/*
import calendarStyles from 'react-big-calendar/lib/css/react-big-calendar.css'
import additionalStyles from './Platzbelegung.css'

import {fetchEvents} from '../data/DataSource'
import { stageEvents } from '../data/StageEvents';
*/
export default function Platzbelegung() {

  return(
    <div>
      <div>This is a Test (4)</div>
      <div>Just write anything here</div>
    </div>
  );

}

function getStartOfWeek(day=new Date()) {
  const opts = {weekStartsOn: 1};
  return(startOfWeek(day, opts));
}