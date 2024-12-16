import axios from 'axios';
import {
  add,
  format,
  getISODay,
  getISOWeek,
  isWithinInterval,
  set as fnsSet,
} from 'date-fns';
import frenchLocale from 'date-fns/locale/fr';

const LE_FIVE_VILETTE = 39;
const LE_FIVE_PARIS_18 = 69;
const LE_FIVE_PARIS_17 = 63;
const LE_FIVE_PARIS_13 = 51;

const centers = [
  LE_FIVE_VILETTE,
  LE_FIVE_PARIS_18,
  // LE_FIVE_PARIS_17,
  // LE_FIVE_PARIS_13,
];

const WEEKS_FROM_NOW = 4; // number of weeks next today we will search a slot

const WEEK_DAYS = [1, 2, 3]; // list of week days (eg. monday = 1)

const TIME_START = '19:00';
const TIME_END = '21:00';

const DELAY_BETWEEN_REQUEST = 200;

const slots = [];

const today = new Date();
let currentDate = today;
const currentWeek = getISOWeek(currentDate);
const lastDate = add(currentDate, { weeks: WEEKS_FROM_NOW });
const lastWeek = getISOWeek(lastDate);

const timeStartHours = TIME_START.split(':')[0];
const timeStartMinutes = TIME_START.split(':')[1];
const timeEndtHours = TIME_END.split(':')[0];
const timeEndtMinutes = TIME_END.split(':')[1];

console.log('today:', today, 'week:', currentWeek);
console.log('last day: ', lastDate, 'week:', lastWeek);

let countWeek = 0;
let previousWeek = currentWeek;
let countDay = 0;
let countWantedDay = 0;

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// loop for days
async function scrap() {
  while (countWeek <= WEEKS_FROM_NOW) {
    if (WEEK_DAYS.includes(getISODay(currentDate))) {
      console.log(
        'week:',
        getISOWeek(currentDate),
        'weekday:',
        getISODay(currentDate),
      );

      // reset hours
      currentDate = fnsSet(currentDate, {
        hours: timeStartHours,
        minutes: timeStartMinutes,
        seconds: 0,
        milliseconds: 0,
      });

      // loop for hours
      // continue if the current hour is not between the defined time interval
      while (
        isWithinInterval(currentDate, {
          start: fnsSet(currentDate, {
            hours: timeStartHours,
            minutes: timeStartMinutes,
          }),
          end: fnsSet(currentDate, {
            hours: timeEndtHours,
            minutes: timeEndtMinutes,
          }),
        })
      ) {
        console.log(currentDate);

        centers.forEach((center) => {
          slots.push(getSlotData(currentDate, center));
        });

        await timer(DELAY_BETWEEN_REQUEST); // avoid 502 on server

        // go to next slot
        currentDate = add(currentDate, { minutes: 30 });
      }
      countWantedDay++;
    }

    // go to next day
    currentDate = add(currentDate, { days: 1 });
    countDay++;

    // increment week
    if (previousWeek !== getISOWeek(currentDate)) {
      countWeek++;
      previousWeek = getISOWeek(currentDate);
    }
  }

  function getSlotData(date, center) {
    const datePlusOneHour = add(date, { hours: 1 });

    return axios
      .post(
        'https://api.lefive.fr/splf/v1/bookingrules/availableFields/front?appId=1&isChannelWeb=true',
        {
          startingDateZuluTime: date,
          duration: 60,
          center_id: center,
          bookingType_id: '1',
          sportType_id: '1',
          isChannelWeb: true,
          capacity: '10',
          endingDateZuluTime: datePlusOneHour,
        },
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(
          `[${error.response.status}] ${error.response.statusText} | [${error.response.data.code}] ${error.response.data.description}`,
        );
      });
  }

  function formatResponse(response) {
    if (!response[0]) return;

    const formatedDate = format(
      new Date(response[0]['startingDateZuluTime']),
      'iiii dd LLLL - kk:mm',
      { locale: frenchLocale },
    );
    const countSlots = response.length;
    const price = `${response[0]['price']}€`;
    const centerName = response[0]['center']['centerName'];

    return `${formatedDate} (${countSlots} slots, ${price}) @ ${centerName}`;
  }

  console.log('\n\nLes requêtes ont été envoyées. Veuillez patienter...\n');

  Promise.all(slots).then(function (promises) {
    const slots = promises.filter((x) => x && x.length > 0);
    console.dir(
      slots.map((item) => formatResponse(item)),
      { maxArrayLength: null },
    );
    if (promises.some((x) => x === undefined)) {
      console.log(
        "\nAttention : certaines requêtes n'ont pas abouties. Les résultats ci-dessus peuvent être partiels.\n",
      );
    }
  });
}

scrap();
