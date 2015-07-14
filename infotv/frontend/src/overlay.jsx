var React = require("react");
var moment = require("moment");
var DatumManager = require("./datum");

var OverlayComponent = React.createClass({
	componentWillMount: function() {
		var self = this;
		this._clockUpdateTimer = setInterval(function() { self.forceUpdate(); }, 5000);
	},

	componentWillUnmount: function() {
		clearInterval(this._clockUpdateTimer);
		this._clockUpdateTimer = null;
	},

	renderWeather: function() {
		var weather = DatumManager.getValue("weather");
		if(!weather) return null;
		var temperature, icon;
		try {
			temperature = weather.main.temp - 273.15;
		}
		catch(problem) {
			temperature = null;
		}
		try {
			icon = weather.weather[0].icon;
			icon = <img src={"http://openweathermap.org/img/w/" + icon + ".png"}/>;
		} catch(problem) {
			icon = null;
		}

		return <div className="weather">
			<span>{temperature ? temperature.toLocaleString("fi", {maximumFractionDigits: 1}) + "°C" : ""}</span>
			<span>{icon}</span>
		</div>;
	},

	render: function() {
		var text = moment().format("HH:mm");
		var weather = this.renderWeather();
		return <div id="quad">
			<div className="clock">{text}</div>
			{weather}
		</div>;
	}

});

module.exports = OverlayComponent;
