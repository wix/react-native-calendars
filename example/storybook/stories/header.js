import React from 'react';
import {Text} from 'react-native';
import Header from '../../../src/calendar/header';
import {parseDate} from '../../../src/interface';

const Container = ({title, children}) => (
  <>
    <Text>{title}</Text>
    {children}
  </>
);

const month = parseDate('2020-06-01');

export default function(storiesOf, module) {
  storiesOf('Header', module).add('Examples', () => (
    <>
      <Container title="Default">
        <Header month={month} />
      </Container>
      <Container title="With indicator">
        <Header month={month} showIndicator />
      </Container>
      <Container title="Custom first day">
        <Header month={month} firstDay={3} />
      </Container>
      <Container title="Hide day names">
        <Header month={month} hideDayNames />
      </Container>
      <Container title="Show week numbers">
        <Header month={month} weekNumbers />
      </Container>
      <Container title="With disabled days">
        <Header month={month} disabledDaysIndexes={[2]} />
      </Container>
    </>
  ));
}
