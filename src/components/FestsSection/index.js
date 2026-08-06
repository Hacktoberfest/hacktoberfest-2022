import {
  Eyebrow,
  FestsBeat,
  FestsBeatLabel,
  FestsBeatNumber,
  FestsBeats,
  FestsCopy,
  FestsHeading,
  FestsIntro,
  FestsRoot,
} from './FestsSection.styles';

const BEATS = [
  { number: '01', label: 'Run an open model on real hardware' },
  { number: '02', label: 'Build and demo a project in a day' },
  { number: '03', label: 'Meet the developers in your city' },
];

const FestsSection = () => (
  <FestsRoot id="fests">
    <FestsIntro>
      <div>
        <Eyebrow>The Fests</Eyebrow>
        <FestsHeading>
          A Hacktober Fest is a mini-hackathon <em>in your city.</em>
        </FestsHeading>
      </div>
      <FestsCopy>
        <p>
          A Hacktober Fest is a one-day, in-person mini-hackathon: a few hours
          with local developers, food, and hardware, building something real
          with open source AI models. No experience with open models required
          &mdash; every Fest has guided challenges to start from.
        </p>
        <p>
          Hundreds are happening across the world this October, hosted by local
          communities with support from Hacktoberfest.
        </p>
      </FestsCopy>
    </FestsIntro>

    <FestsBeats aria-label="What you will do at a Fest">
      {BEATS.map((beat) => (
        <FestsBeat key={beat.number}>
          <FestsBeatNumber>{beat.number}</FestsBeatNumber>
          <FestsBeatLabel>{beat.label}</FestsBeatLabel>
        </FestsBeat>
      ))}
    </FestsBeats>
  </FestsRoot>
);

export default FestsSection;
