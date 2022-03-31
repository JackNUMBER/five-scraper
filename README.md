<img align="right" src="assets/robot.png">

The purpose of this project is to **facilitate the booking** of futsal "soccer five" game slots.\
It will **list quickly all available slots** according to your playing habits.

Currently only LE FIVE (https://lefive.fr) centers are available.

## Install and run

Requirement: Node.js + npm

1. Clone the repo
2. Run `npm i`
3. Run `npm run get-slot`

## Custom

The script works by **time iteration**, meaning it will gives you each slots available in the date and time range you have setted. You can **set every part of the search**: the number of weeks you want to check, wich day you want to play, at what time and where.

At the moment game duration is not customisable (set to 60 min) but you can set it in the request.

### Weeks

Edit `WEEKS_FROM_NOW` to set until when you want you want to check slots.\
The script start from today (the day when you run the script).

> Eg. `WEEKS_FROM_NOW = 4` will request slots for the next 4 weeks.

### Week days

Edit `WEEK_DAYS` to set wich days of the week you want to play.

> Eg. `WEEK_DAYS = [1, 2, 6]` will request slots for Monday, Tuesday and Saturday.

### Times

Edit `TIME_START` and `TIME_END` (24-hour) to set your wanted time range.\
The script will check every 30 minutes slots between this two times.

> Eg. `TIME_START = '19:00'` and `TIME_END = '20:30'` will request 3 slots (19:00, 19:30, 20:00).

### Centers

To add center you can take somes in the list bellow and add them in the `centers` const.

> Eg. `centers = [ LE_FIVE_VILETTE, LE_FIVE_PARIS_18 ]` will search in the 2 centers.

[➡ List of centers](centers.md)

## Output

Here an example of what the script will retourn to you in the terminal:

```
'lundi 04 avril - 21:00 (2 slots, 120€) @ LE FIVE Villette',
'mardi 05 avril - 21:00 (1 slots, 120€) @ LE FIVE Villette',
'lundi 11 avril - 21:00 (1 slots, 120€) @ LE FIVE Villette',
'mardi 12 avril - 21:00 (1 slots, 140€) @ LE FIVE Paris 18',
'mercredi 13 avril - 21:00 (2 slots, 120€) @ LE FIVE Villette',
'lundi 18 avril - 19:00 (3 slots, 120€) @ LE FIVE Villette',
'mercredi 20 avril - 21:00 (3 slots, 120€) @ LE FIVE Villette',
'mercredi 20 avril - 21:00 (1 slots, 140€) @ LE FIVE Paris 18',
```

During the process you will see all dates listing, it is for debug.

## Next steps

I plan to add booking part with Puppeteer.
