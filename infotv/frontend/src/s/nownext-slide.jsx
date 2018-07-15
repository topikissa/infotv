import React from "react";
import _ from "lodash";
import DatumManager from "../datum";
import moment from "moment";
import config from "../config";
import cx from "classnames";

function renderProgram(prog, startTs, endTs) {

    const startMoment = moment.unix(startTs);
    const startDay = getWeekday(startTs);
    const startTime = startMoment.format("HH:mm");
    const endTime = moment.unix(endTs).format("HH:mm");
    const endDay = getWeekday(endTs);
    const className = cx({
        progInfo: true,
        //soon: (Math.abs(moment().diff(startMoment)) < 5 * 60 * 1000),
    });

    return (
        <span className={className}>
            <span className="days">{startDay} </span>
            <span className="times">{startTime} -</span>
            <span className="days">{endDay} </span>
            <span className="times">{endTime}</span>
            <span className="title">{prog.title}</span>
        </span>
    );
}

function getWeekday(timeStamp) {


    const weekdays = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"]; 
    const date = new Date(timeStamp*1000);
    return weekdays[date.getDay()];

}

function NowNextSlide() {




    const entriesShown = 40; // TODO fix hard coded value
    const gracePeriod = 15 * 60; // in seconds
    const onlyLoc = config.loc;
    const content = [];
    const schedule = DatumManager.getValue("schedule");
    if (!schedule) return (<div>No schedule</div>);
    //const rooms = DatumManager.getValue("rooms");
    //if (!rooms) return (<div>No locations</div>);
    const nowTs = (+new Date()) / 1000;  // time in seconds


    var entryCounter = 0;
    _.each(schedule, (prog) => {
        // NOTE: the programme entries in the conbase json api are ordered by time
        if (entryCounter >= entriesShown) return false; // only show first entries

 	if (prog.is_public!==true) return false; // do not show non-public entries

        const loc = prog.room_name;  
         if (onlyLoc && loc.indexOf(onlyLoc) === -1) return; // only show entries for current location. (Match given location limiter to the prefix of programme location)

        const startDate = new Date(prog.start_time);  
        const endDate = new Date(startDate.getTime()+60*1000*prog.length); // time in milliseconds  
        const startTs = startDate.getTime()/1000;  // in seconds
        const endTs = endDate.getTime()/1000;  // in seconds
        
        // only show programs which have started less than a grace period ago
        // or have not yet started
        // and have not ended yet
        if(prog && startTs+gracePeriod>nowTs && endTs > nowTs) {
            entryCounter++;
            let timeType = "";
            let timeClass = "";

            if (startTs<nowTs) {    
                timeType = "Nyt";
                timeClass = "now";
            } else {
                timeType = "Seuraavaksi";
                timeClass = "next";
            }
            let typeEntry = 
                <div className={timeClass}><span className="ntitle">{timeType}</span></div>;
            let progEntry = 
                <div className={timeClass}>{renderProgram(prog, startTs, endTs)}</div>;
            content.push(
                <tr key={prog.title+loc+prog.start_time} className="nownext-table-row">
                    <td className="nownext-table-cell current">{typeEntry}</td>
                    <td className="nownext-table-cell current">{progEntry}</td>
                    <td className="nownext-table-cell loc">{loc}</td>
                </tr>
            );

        } 

    });

    return (
        <div className="slide nownext-slide">
        <h1>Seuraavaksi ohjelmassa</h1>
        <div className="scrollable-next">
            <p>
            <table className="nownext_table">
                <tbody>{content}</tbody>
            </table>
            </p>
        </div>
        </div>
    );
}

export default {
    view: NowNextSlide,
};
