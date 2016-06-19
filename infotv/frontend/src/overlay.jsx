import React from "react";
import moment from "moment";
import DatumManager from "./datum";

export default class OverlayComponent extends React.Component {
    componentWillMount() {
        this.clockUpdateTimer = setInterval(() => { this.forceUpdate(); }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.clockUpdateTimer);
        this.clockUpdateTimer = null;
    }

    renderWeather() {
        const weather = DatumManager.getValue("weather");
        if (!weather) return null;
        let temperature;
        let icon;
        try {
            temperature = weather.main.temp - 273.15;
        } catch (problem) {
            temperature = null;
        }
        try {
            icon = weather.weather[0].icon;
            icon = <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="weather icon" />;
        } catch (problem) {
            icon = null;
        }

        return (<div className="weather">
            <span>{temperature ? `${temperature.toLocaleString("fi", { maximumFractionDigits: 1 })}°C` : ""}</span>
            <span>{icon}</span>
        </div>);
    }

    render() {
        const text = moment().format("HH:mm");
        const weather = this.renderWeather();
        return (<div id="quad">
            <div className="clock">{text}</div>
            {weather}
        </div>);
    }
}
