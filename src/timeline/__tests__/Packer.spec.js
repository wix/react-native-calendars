import _ from 'lodash';
import uut from '../Packer';

describe('Timeline Packer utils', () => {
  const events = [
    {
      id: 'event_1',
      start: '2017-09-06 01:30:00',
      end: '2017-09-06 02:30:00',
      title: 'Event 1'
    },
    {
      id: 'event_2',
      start: '2017-09-06 02:15:00',
      end: '2017-09-06 02:45:00',
      title: 'Event 2'
    },
    {
      id: 'event_3',
      start: '2017-09-06 01:55:00',
      end: '2017-09-06 03:00:00',
      title: 'Event 3'
    }
  ];
  it('should sort events by start and end times', () => {
    const packedEvents = uut(events, {screenWidth: 300, dayStart: 0});
    expect(packedEvents[0].id).toBe('event_1');
    expect(packedEvents[1].id).toBe('event_3');
    expect(packedEvents[2].id).toBe('event_2');
  });

  describe('should set events block size', () => {
    it('should set event block height based on their duration', () => {
      const packedEvents = uut(events, {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].height).toBe(100); // event 1
      expect(packedEvents[1].height).toBeCloseTo(108.333); // event 3
      expect(packedEvents[2].height).toBe(50); // event 2
    });

    it('should set event block width based on overlaps of 3 events', () => {
      const packedEvents = uut(events, {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].width).toBe(90); // event 1
      expect(packedEvents[1].width).toBe(90); // event 3
      expect(packedEvents[2].width).toBe(100); // event 2
    });

    it('should set event block width based on overlaps of 2 events', () => {
      const packedEvents = uut([events[0], events[1]], {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].width).toBe(140); // event 1
      expect(packedEvents[1].width).toBe(150); // event 2
    });

    it('should set event block width when there is not overlaps', () => {
      const packedEvents = uut([events[0]], {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].width).toBe(300); // event 1
    });

    it('should handle a complex case of overlapping events', () => {
      const overlappingEvents = [
        {
          start: `2017-09-06 01:15:00`,
          end: `2017-09-06 02:30:00`
        },
        {
          start: `2017-09-06 01:30:00`,
          end: `2017-09-06 02:30:00`
        },
        {
          start: `2017-09-06 01:45:00`,
          end: `2017-09-06 02:45:00`
        },
        {
          start: `2017-09-06 02:40:00`,
          end: `2017-09-06 03:10:00`
        },
        {
          start: `2017-09-06 02:50:00`,
          end: `2017-09-06 03:20:00`
        },
        {
          start: `2017-09-06 04:30:00`,
          end: `2017-09-06 05:30:00`
        }
      ];
      let packedEvents = uut(overlappingEvents, {screenWidth: 300, dayStart: 0, overlapEventsSpacing: 4});
      packedEvents = _.sortBy(packedEvents, 'index');
      expect(packedEvents[0].width).toBe(96);
      expect(packedEvents[1].width).toBe(96);
      expect(packedEvents[2].width).toBe(100);
      expect(packedEvents[3].width).toBe(96);
      expect(packedEvents[4].width).toBe(200);
      expect(packedEvents[5].width).toBe(300);
    });
  });

  describe('should set events block position', () => {
    it('should set top position base on the event start time', () => {
      const packedEvents = uut(events, {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].top).toBe(150); // event 1
      expect(packedEvents[1].top).toBeCloseTo(191.666); // event 3
      expect(packedEvents[2].top).toBe(225); // event 2
    });

    it('should set left position base when the 3 events overlap', () => {
      const packedEvents = uut(events, {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].left).toBe(0); // event 1
      expect(packedEvents[1].left).toBe(100); // event 3
      expect(packedEvents[2].left).toBe(200); // event 2
    });

    it('should set left position base when the 2 events overlap', () => {
      const packedEvents = uut([events[0], events[1]], {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].left).toBe(0); // event 1
      expect(packedEvents[1].left).toBe(150); // event 3
    });
  });
});
