import React from 'react';
import Container from '../container';
import Dot from '../../../src/calendar/dot';

const theme = {
  dotColor: 'red',
  selectedDotColor: 'blue',
  todayDotColor: 'green',
  disabledDotColor: 'gray',
};

export default function(storiesOf, module) {
  storiesOf('Dot', module).add('isMarked', () => (
    <>
      <Container title="Not marked">
        <Dot theme={theme} isMarked={false} />
      </Container>
      <Container title="isMarked">
        <Dot theme={theme} isMarked />
      </Container>
      <Container title="isDisabled">
        <Dot theme={theme} isMarked isDisabled />
      </Container>
      <Container title="isToday">
        <Dot theme={theme} isMarked isToday />
      </Container>
      <Container title="isSelected">
        <Dot theme={theme} isMarked isSelected />
      </Container>
      <Container title="With custom dotcolor">
        <Dot theme={theme} isMarked dotColor="purple" />
      </Container>
    </>
  ));
}
