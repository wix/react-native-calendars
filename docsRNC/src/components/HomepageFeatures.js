import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Calendar',
    img: require('../../static/img/calendar.png').default,
    description: <>Calendar component</>
  },
  {
    title: 'Calendar Markings',
    img: require('../../static/img/calendar-markings.png').default,
    description: <>Marked dates on Calendar's components</>
  },
  {
    title: 'Expandable Calendar',
    img: require('../../static/img/expandableCalendar.png').default,
    description: <>Expandable calendar component</>
  }
  // {
  //   title: 'Timeline Calendar',
  //   img: require('../../static/img/timeline-calendar.png').default,
  //   description: (<>Timeline calendar component</>)
  // }
];

function Feature({img, title /* , description */}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        {/* <p>{description}</p> */}
      </div>
      <div className="text--center">
        <img src={img} alt={title} className={styles.featureSvg} />
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
