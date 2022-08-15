import sortBy from 'lodash/sortBy';
import * as uut from '../Packer';

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
    const packedEvents = uut.populateEvents(events, {screenWidth: 300, dayStart: 0});
    expect(packedEvents[0].id).toBe('event_1');
    expect(packedEvents[1].id).toBe('event_3');
    expect(packedEvents[2].id).toBe('event_2');
  });

  describe('should set events block size', () => {
    it('should set event block height based on their duration', () => {
      const packedEvents = uut.populateEvents(events, {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].height).toBe(100); // event 1
      expect(packedEvents[1].height).toBeCloseTo(108.333); // event 3
      expect(packedEvents[2].height).toBe(50); // event 2
    });

    it('should set event block width based on overlaps of 3 events', () => {
      const packedEvents = uut.populateEvents(events, {
        screenWidth: 310,
        dayStart: 0,
        rightEdgeSpacing: 10,
        overlapEventsSpacing: 10
      });
      expect(packedEvents[0].width).toBe(90); // event 1
      expect(packedEvents[1].width).toBe(90); // event 3
      expect(packedEvents[2].width).toBe(100); // event 2
    });

    it('should set event block width based on overlaps of 2 events', () => {
      const packedEvents = uut.populateEvents([events[0], events[1]], {
        screenWidth: 300,
        dayStart: 0,
        overlapEventsSpacing: 10,
        rightEdgeSpacing: 10
      });
      expect(packedEvents[0].width).toBe(135); // event 1
      expect(packedEvents[1].width).toBe(145); // event 2
    });

    it('should set event block width when there is not overlaps', () => {
      const packedEvents = uut.populateEvents([events[0]], {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].width).toBe(290); // event 1
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
      let packedEvents = uut.populateEvents(overlappingEvents, {
        screenWidth: 310,
        dayStart: 0,
        overlapEventsSpacing: 4
      });
      packedEvents = sortBy(packedEvents, 'index');
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
      const packedEvents = uut.populateEvents(events, {screenWidth: 300, dayStart: 0});
      expect(packedEvents[0].top).toBe(150); // event 1
      expect(packedEvents[1].top).toBeCloseTo(191.666); // event 3
      expect(packedEvents[2].top).toBe(225); // event 2
    });

    it('should set left position base when the 3 events overlap', () => {
      const packedEvents = uut.populateEvents(events, {
        screenWidth: 300,
        dayStart: 0,
        overlapEventsSpacing: 10,
        rightEdgeSpacing: 10
      });
      expect(packedEvents[0].left).toBe(0); // event 1
      expect(packedEvents[1].left).toBeCloseTo(96.666); // event 3
      expect(packedEvents[2].left).toBeCloseTo(193.333); // event 2
    });

    it('should set left position base when the 2 events overlap', () => {
      const packedEvents = uut.populateEvents([events[0], events[1]], {
        screenWidth: 300,
        dayStart: 0,
        overlapEventsSpacing: 10,
        rightEdgeSpacing: 10
      });
      expect(packedEvents[0].left).toBe(0); // event 1
      expect(packedEvents[1].left).toBe(145); // event 3
    });
  });

  describe('buildUnavailableHoursBlocks', () => {
    it('should build unavailable blocks with default options', () => {
      const blocks = uut.buildUnavailableHoursBlocks([
        {start: 0, end: 9},
        {start: 19, end: 24}
      ]);
      expect(blocks[0]).toEqual({
        top: 0,
        height: 900
      });
      expect(blocks[1]).toEqual({
        top: 1900,
        height: 500
      });
    });

    it('should not return blocks for invalid hours', () => {
      const blocks = uut.buildUnavailableHoursBlocks([
        {start: -2, end: 7},
        {start: 3, end: 7},
        {start: 22, end: 25}
      ]);

      expect(blocks.length).toBe(1);
      expect(blocks[0]).toEqual({
        top: 300,
        height: 400
      });
    });

    it('should handle different start/end day hours', () => {
      const blocks = uut.buildUnavailableHoursBlocks(
        [
          {start: 0, end: 9},
          {start: 19, end: 24}
        ],
        {dayStart: 8, dayEnd: 20}
      );

      expect(blocks[0]).toEqual({
        top: 0,
        height: 100
      });
      expect(blocks[1]).toEqual({
        top: 1100,
        height: 100
      });
    });
  });
});
