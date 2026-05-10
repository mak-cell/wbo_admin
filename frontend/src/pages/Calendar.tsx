import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import Layout from '../components/Layout';
import { Card, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, radius } from '../styles/designTokens';
import { ApiService } from '../services/apiService';
import { CalendarEvent } from '../types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[6]};
  animation: ${fadeIn} 0.5s ease;

  h1 {
    font-size: 2.5rem;
    color: ${colors.primary};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
`;

const MonthTitle = styled.h2`
  font-size: 1.5rem;
  color: ${colors.onBackground};
  min-width: 200px;
  text-align: center;
`;

const CalendarContainer = styled(Card)`
  padding: ${spacing[4]};
  animation: ${fadeIn} 0.5s ease 0.2s both;
`;

const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${spacing[2]};
  margin-bottom: ${spacing[2]};
  text-align: center;
  font-weight: 600;
  color: ${colors.secondary};
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${spacing[2]};
`;

const DayCell = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean; $hasEvents: boolean }>`
  min-height: 120px;
  padding: ${spacing[2]};
  background: ${({ $isCurrentMonth, $hasEvents }) => 
    !$isCurrentMonth ? 'rgba(255, 255, 255, 0.01)' : 
    $hasEvents ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${({ $isToday, $hasEvents }) => 
    $isToday ? colors.primary : 
    $hasEvents ? 'rgba(212, 175, 55, 0.2)' : colors.border};
  border-radius: ${radius.md};
  opacity: ${({ $isCurrentMonth }) => $isCurrentMonth ? 1 : 0.4};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  ${({ $isCurrentMonth }) => $isCurrentMonth && `
    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      cursor: pointer;
    }
  `}

  @media (max-width: 768px) {
    min-height: 80px;
    padding: ${spacing[1]};
  }
`;

const DayNumber = styled.span<{ $isToday: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $isToday }) => $isToday ? colors.primary : 'transparent'};
  color: ${({ $isToday }) => $isToday ? colors.background : colors.onBackground};
  font-weight: ${({ $isToday }) => $isToday ? 700 : 500};
  font-size: 0.9rem;
  margin-bottom: ${spacing[2]};
`;

const EventChip = styled.div<{ $source?: string }>`
  background: ${({ $source }) => $source === 'deliverable' ? colors.info : colors.primaryHover};
  color: ${colors.background};
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 2px 4px;
  }
`;

const MoreEventsIndicator = styled.div`
  font-size: 0.7rem;
  color: ${colors.primary};
  font-weight: 600;
  text-align: center;
  margin-top: 2px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  justify-content: flex-end;
`;

const SidePanel = styled.div`
  width: 400px;
  max-width: 100%;
  height: 100%;
  background: ${colors.surface};
  border-left: 1px solid ${colors.border};
  box-shadow: -4px 0 24px rgba(0,0,0,0.5);
  padding: ${spacing[6]};
  overflow-y: auto;
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${spacing[4]};
  border-bottom: 1px solid ${colors.border};

  h3 {
    font-size: 1.5rem;
    color: ${colors.primary};
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.onBackground};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: ${colors.danger};
  }
`;

const EventDetailCard = styled(Card)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${colors.border};
  padding: ${spacing[4]};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing[2]};
  font-size: 0.9rem;

  strong {
    color: ${colors.secondary};
  }
  
  span {
    color: ${colors.onBackground};
    text-align: right;
  }
`;

const WorkersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing[2]};
  margin-top: ${spacing[2]};
`;

const WorkerBadge = styled.div`
  background: rgba(255, 255, 255, 0.1);
  color: ${colors.onBackground};
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${colors.primary};
  }
`;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await ApiService.getCalendarEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    };
    fetchEvents();
  }, []);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - getDay(monthStart)); // Start from previous month's overlapping days
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - getDay(monthEnd))); // End at next month's overlapping days

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (date: Date) => {
    return events.filter(e => isSameDay(new Date(e.date), date));
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <Layout>
      <PageHeader>
        <h1>Studio Calendar</h1>
        <HeaderActions>
          <Button variant="outline" onClick={prevMonth}>←</Button>
          <MonthTitle>{format(currentDate, 'MMMM yyyy')}</MonthTitle>
          <Button variant="outline" onClick={nextMonth}>→</Button>
          <Button variant="primary" onClick={today}>Today</Button>
        </HeaderActions>
      </PageHeader>

      <CalendarContainer>
        <WeekDaysGrid>
          {weekDays.map(day => <div key={day}>{day}</div>)}
        </WeekDaysGrid>
        
        <DaysGrid>
          {calendarDays.map((day: Date, idx: number) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <DayCell 
                key={idx} 
                $isCurrentMonth={isCurrentMonth}
                $isToday={isToday}
                $hasEvents={dayEvents.length > 0}
                onClick={() => isCurrentMonth && dayEvents.length > 0 && setSelectedDate(day)}
              >
                <DayNumber $isToday={isToday}>
                  {format(day, 'd')}
                </DayNumber>
                
                {dayEvents.slice(0, 3).map(e => {
                  const workerText = e.assigned_workers.length > 0 ? ` (${e.assigned_workers.join(', ')})` : '';
                  return (
                    <EventChip key={`${e.source}-${e.event_id}`} $source={e.source} title={`${e.title}${workerText}`}>
                      {e.source === 'deliverable' ? '📦 ' : ''}{e.title}{workerText}
                    </EventChip>
                  );
                })}
                
                {dayEvents.length > 3 && (
                  <MoreEventsIndicator>+{dayEvents.length - 3} more</MoreEventsIndicator>
                )}
              </DayCell>
            );
          })}
        </DaysGrid>
      </CalendarContainer>

      {selectedDate && (
        <Overlay onClick={() => setSelectedDate(null)}>
          <SidePanel onClick={e => e.stopPropagation()}>
            <PanelHeader>
              <h3>{format(selectedDate, 'MMMM do, yyyy')}</h3>
              <CloseButton onClick={() => setSelectedDate(null)}>&times;</CloseButton>
            </PanelHeader>

            {selectedDayEvents.length === 0 ? (
              <p style={{ color: colors.onBackground }}>No events scheduled for this day.</p>
            ) : (
              selectedDayEvents.map(event => (
                <EventDetailCard key={event.event_id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
                    <CardTitle style={{ color: event.source === 'deliverable' ? colors.info : colors.primary, fontSize: '1.2rem', margin: 0 }}>
                      {event.source === 'deliverable' ? '📦 ' : '📅 '}{event.title}
                    </CardTitle>
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '12px', fontWeight: 700, textTransform: 'uppercase', background: event.source === 'deliverable' ? 'rgba(59,130,246,0.15)' : 'rgba(212,175,55,0.15)', color: event.source === 'deliverable' ? colors.info : colors.primary }}>
                      {event.source === 'deliverable' ? 'Deliverable' : 'Event'}
                    </span>
                  </div>
                  
                  <DetailRow>
                    <strong>Client:</strong>
                    <span>{event.client_name}</span>
                  </DetailRow>
                  
                  <DetailRow>
                    <strong>Type:</strong>
                    <span>{event.event_type}</span>
                  </DetailRow>
                  
                  <DetailRow>
                    <strong>Location:</strong>
                    <span>{event.location}</span>
                  </DetailRow>
                  
                  <DetailRow>
                    <strong>Status:</strong>
                    <span style={{ 
                      color: event.status === 'Delivered' || event.status === 'Completed' ? colors.success : 
                             event.status === 'In Progress' ? colors.info : colors.warning 
                    }}>
                      {event.status}
                    </span>
                  </DetailRow>

                  <div style={{ marginTop: spacing[4] }}>
                    <strong style={{ color: colors.secondary, fontSize: '0.9rem' }}>Assigned Team:</strong>
                    {event.assigned_workers.length > 0 ? (
                      <WorkersList>
                        {event.assigned_workers.map((worker, i) => (
                          <WorkerBadge key={i}>{worker}</WorkerBadge>
                        ))}
                      </WorkersList>
                    ) : (
                      <p style={{ color: colors.onBackground, fontSize: '0.85rem', marginTop: spacing[1] }}>
                        No workers assigned yet.
                      </p>
                    )}
                  </div>
                </EventDetailCard>
              ))
            )}
          </SidePanel>
        </Overlay>
      )}
    </Layout>
  );
}
