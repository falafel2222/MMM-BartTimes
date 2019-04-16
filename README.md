# MMM-BartTimes

Magic Mirror module that displays the upcoming departure times for all BART (Bay Area Rapid Transit) lines at a certain station.

This exists thanks to BART providing an easy public API, which can be found [here](http://api.bart.gov/docs/overview/index.aspx)

### Installation
1. Navigate to the magic mirror modules directory and clone this repository there.
2. Inside the `MMM-BartTimes` folder, run `npm install` to install the required dependencies.
3. Modify `config.js` to include `MMM-BartTimes`. An example config can be seen below.

### Configuration

1. Determine the abbreviation for your BART station of choice.
Abbreviations can be found [here](http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V) (under the tag `<abbr>`)
2. (Optional) If you want your own API key so you aren't at the mercy of BART changing their public one, you can request one [here](http://api.bart.gov/api/register.aspx).
3. (Even more optional) If you hate clutter and don't want to see some trains, you can add them to the train blacklist.

Example configuration file:
```
{
	module: 'MMM-BartTimes',
	position: 'top_left',
	config: {
		station: '19th',
		train_blacklist: ['Dublin/Pleasanton', 'MacArthur'],
		key: 'IFYO-UWAN-TYOU-ROWN',
	}
},
```
