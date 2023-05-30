import React, {useState, useEffect} from 'react'
import { Calendar, Views } from 'react-big-calendar'

import {Modal, Spin} from 'antd'
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

  useEffect(() => {

//    let mounted = true; // READ THIS ARTICLE: https://medium.com/doctolib/react-stop-checking-if-your-component-is-mounted-3bb2568a4934

    async function loadEvents(tgtRange, lddRange, events0) {

      const {loadingRange, minDateLoaded} = determineLoadingRange(tgtRange, lddRange);

      console.log("Loading from " + format(loadingRange[0], "dd-MM") + " to " + format(loadingRange[1], "dd-MM"));
      const {events: raw_events = [], lastFullyLoadedDay, error} = 
        await fetchEvents({startDate: loadingRange[0], minEndDate: loadingRange[1]});

      const events1 = stageEvents(raw_events);

      const timestamp = new Date();

      if (error) {
        Modal.error({
          title: "Fehler!",
          content: "Die Daten konnten nicht geladen werden",
          getContainer: document.getElementById('tcw-platzbelegung-web-component')
        });
        return {error};
      }

      const maxDateLoaded = (lddRange && lastFullyLoadedDay < lddRange[1]) ? lddRange[1] : lastFullyLoadedDay;

      if (events0 && events0.length > 0) {
        setEvents(mergeEvents(events0, events1));
      }
      else {
        // console.log("Events: (" + events1.length + "):");
        // console.log(events1);
        setEvents(events1);
      };

      setTargetRange(tgtRange);
      setLoadedRange([minDateLoaded, maxDateLoaded]);
      console.log("Loaded from " + format(minDateLoaded, "dd-MM") + " to " + format(maxDateLoaded, "dd-MM"));
      setTimestampDataLoaded(timestamp);
      setIsLoading(false);
    }
  
    if ( ! isLoading && ! isInTargetRange(selectedDate, targetRange)) {
      const newTgtRange = determineTargetRange(selectedDate);
      if (isContainedInLoadedRange(newTgtRange, loadedRange)) {
        setTargetRange(newTgtRange);
      }
      else {
        setIsLoading(true);
        loadEvents(newTgtRange, loadedRange, events);
      }
    }

    return(() => { 
    //  mounted = false;
    }); // cleanup
  },
    [selectedDate, targetRange, loadedRange, isLoading, events]
  );

  const mergeEvents = (evts1, evts2) => {
    const allEvents = new Map(evts1.map(el => [el.id, el]));
    if (evts2 && evts2.length > 0) {
      evts2.forEach(el => {
        if (! allEvents.has(el.id)) {
          allEvents.set(el.id, el);
        }
      });  
    }
    return Array.from(allEvents.values());
  }


  const style = {height: 1200, width: '100%'};

  const {culture, localizer, formats, messages} = localize();

  const onSelectEvent = event => {
    setSelectedEvent(event);
    setEventPopupVisible(true);
  }

//  const onSelectSlot = () => {}

  const renderEventBar = ({event}) => {
    return(<div></div>)
  }

  const renderEventPopup = () => {
    if (selectedEvent) {
      const {start, end, platz, title} = selectedEvent;
      return(
        <div>

          <div>
            {fmtEventStartEnd({start, end}, culture, localizer)}
          </div>
          <div className={"emph"}>
            {platz}
          </div>
          <div className={"emph"}>
            {title}
          </div>
        </div>
      )
    }
  }

  const renderEventDay = ({event}) => {
      return(
        <div style={{padding: 4}}>
            {event.title}
        </div>
      )
  }

  const renderEventAgenda = ({event}) => {
    const {title, platz} = event;
    return(
      <div>{platz}: {title}</div>

    )
  }

  const onChangeView = view => {
    if (view === Views.AGENDA && selectedDate) {
      setSelectedDate(getStartOfWeek(selectedDate));
    }
  }

  const onNavigate = (date, view) => {
    setSelectedDate(date);
//    loadMoreEventsIfNecessary(date);
  }

  // const loadMoreEventsIfNecessary = async date => {

  //   const {haveToFetch, start, minEnd} = getFetchParameters(date);

  //   if (haveToFetch) {
  //     const {events, lastFullyLoadedDay} = await fetchEvents({start, minEnd});

  //     setEvents(events);
  //     setNominalMinDate(start);
  //     setNominalMaxDate(lastFullyLoadedDay);
  //   }
  // }


  const popupProps = {
    getContainer: document.getElementById('tcw-platzbelegung-web-component'),
    centered: true,
    
    // closable: false,
    // footer: <Button onClick={() => { setPopupVisible(false); }}>Zurück</Button>
  }

  return(
    <div>HELLO THIS IS JUST A PLACEHOLDER</div>
  );

  return(
    <div style={{...calendarStyles, ...additionalStyles}}>
      <div id="tcw-platzbelegung-web-component" className="web-component tcw-platzbelegung">

      <Modal {...popupProps} footer={false} visible={eventPopupVisible} onCancel={()=> { setEventPopupVisible(false); }} >
        <div>{renderEventPopup()}</div>
      </Modal>

      <Modal {...popupProps} closable={false} bodyStyle={{textAlign: 'center'}} style={{width: 200}} footer={null} visible={isLoading}>
        <Spin size="large" />
      </Modal>

      <Calendar
        culture={culture}
        localizer={localizer}
        messages={messages}
        formats={formats}

        date={selectedDate}

        onNavigate={onNavigate}
        length={6} // number of days in Agenda

        onSelectEvent={onSelectEvent}

        onView = {view => { onChangeView(view, this); }}

        min={new Date(2021, 0, 1, 8, 0)} // 8:00
        max={new Date(2021, 0, 1, 22, 0)} // Max will be 22:00
  
        views={[Views.WEEK, Views.DAY, Views.AGENDA]}

        style={style}
        events={events}
        defaultView={Views.WEEK}

//        tooltipAccessor={() => (<div>THIS IS TOOLTIP</div>)}

        eventPropGetter={({className}) => ({className}) }


        components={{
          toolbar: getToolbar(),
          week: {event: renderEventBar},
          day: {event: renderEventDay},
          agenda: {event: renderEventAgenda}
        }}
      />

      {timestampDataLoaded && <div>aktualisiert am {formatTimestamp(timestampDataLoaded, culture, localizer)}</div>}


      {/* <Calendar 
//        style={style} 

        localizer={getFnsLocalizer()}

        events={DATA}
        startAccessor="eventStart"
        endAccessor="eventEnd"

  //      eventPropGetter={(event,start,end,isSelected) => ({className: event.meta.calendarItemClass}) }

  //      showMultiDayTimes={true} // overnight events

        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        views={myViews}
        defaultView={Views.MONTH}
  //      defaultDate={selectedDate}
        selectable={true}
        // components={{
        //   toolbar: getToolbar({additionalAction: openAvailabilityEditorAction}),
        //   month: {event: RenderEventMonthView},
        //   week: {event: RenderEvent},
        //   day: {event: RenderEvent}
        // }}

      /> */}
      </div>
    </div>
  )
}

function getStartOfWeek(day=new Date()) {
  const opts = {weekStartsOn: 1};
  return(startOfWeek(day, opts));
}