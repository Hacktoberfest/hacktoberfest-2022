import appwrite from 'assets/img/sponsors/appwrite-logo.svg';
import devtron from 'assets/img/sponsors/devtron-logo.svg';
import digitalocean from 'assets/img/sponsors/digitalocean-logo.svg';
import docker from 'assets/img/sponsors/docker-logo.svg';
import novu from 'assets/img/sponsors/novu-logo.svg';
import rapidapi from 'assets/img/sponsors/rapidapi-logo.svg';

const sponsors = {
  presented: [
    {
      name: 'DigitalOcean',
      url: 'https://digitalocean.com',
      image: digitalocean.src,
      scaleFactor: 1.25,
      verticalOffset: 0,
    },
    {
      name: 'Appwrite',
      url: 'https://appwrite.io/',
      image: appwrite.src,
      scaleFactor: 1,
      verticalOffset: 0,
    },
    {
      name: 'Docker',
      url: 'https://docker.com/',
      image: docker.src,
      scaleFactor: 0.875,
      verticalOffset: 2,
    },
  ],
  supported: [
    {
      name: 'Novu',
      url: 'https://novu.co/',
      image: novu.src,
      scaleFactor: 0.985,
      verticalOffset: 0,
    },
    {
      name: 'RapidAPI',
      url: 'https://rapidapi.com/',
      image: rapidapi.src,
      scaleFactor: 1,
      verticalOffset: 0,
    },
    {
      name: 'Devtron',
      url: 'https://devtron.ai/',
      image: devtron.src,
      scaleFactor: 1.225,
      verticalOffset: 2,
    },
  ],
};

export default sponsors;
