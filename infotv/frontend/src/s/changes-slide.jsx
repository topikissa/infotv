import React from "react";
import _ from "lodash";
import DatumManager from "../datum";
import moment from "moment";
import config from "../config";
import cx from "classnames";

function renderChanges(prog, startTs, endTs) {
// TODO this function is identical to renderProgram in nowNext-slide and might be imported from there

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

function getStartTs(prog) {


    const startDate = new Date(prog.date+"T"+prog.time);  // time in milliseconds
    const startTs = startDate.getTime()/1000;  // in seconds
    return startTs;

}

function getEndTs(prog) {


    const startDate = new Date(prog.date+"T"+prog.time);  
    const endDate = new Date(startDate.getTime()+60*1000*prog.mins); // time in milliseconds  
    const endTs = endDate.getTime()/1000;  // in seconds
    return endTs;

}



function getLocationString(prog) {
        var numLocs = 0;
        var locString = "";
        _.each(prog.loc, (loc) => {
            if (numLocs > 0) {
                locString = locString + ", ";
            }
            locString = locString + loc;
            numLocs = numLocs +1;
        });
        return locString;
}

function ChangesSlide() {


    const changeStr = "CHANGE";
    const removedStr = "DELETED";
    const newStr = "NEW";
    const entriesShown = 40; // TODO fix hard coded value
    const gracePeriod = 15 * 60; // in seconds
    const onlyLoc = config.loc;
    const content = [];
    const currentSchedule = DatumManager.getValue("current_schedule");
    if (!currentSchedule) return (<div>No current schedule</div>);
    const origSchedule = DatumManager.getValue("orig_schedule");
    if (!origSchedule) return (<div>No original schedule</div>);
    //const rooms = DatumManager.getValue("rooms");
    //if (!rooms) return (<div>No locations</div>);
    const nowTs = (+new Date()) / 1000;  // time in seconds
    var origHashtable = {}
    var changeList = [];

    // loop trough all the original schedule entries and store them to a hash table
    _.each(origSchedule, (prog) => {
        prog.notDeleted = 0;  // to check for removed programs

        // NOTE javascript objects are (apparently) impelmented internally 
        // by using hash tables for key mapping
        // so can get good enough hash table performance by just using them
        origHashtable[prog.id] = prog;
        
    });

    // loop trough the current schedule entries and compare to the original ones
    _.each(currentSchedule, (currentProg) => {

        // fetch corresponding entry (origProg) from the original programme
        const origProg = origHashtable[currentProg.id];       



        // if no entry found then this is a NEW program
        if (!origProg) {
            // compare times, if time in the past then now need to show
            const currentEndTs = getEndTs(currentProg);  
            if (currentEndTs > nowTs) {
                currentProg.reason = newStr;
                // add the entry to the list of changed 
                changeList.push(currentProg);
            }
            return;
        }

        // set the notDeleted tag
        origProg.notDeleted = 1;

        // compare times, if both the original and current entry time are in the past then now need to show them
        const currentStartTs = getStartTs(currentProg);  
        const currentEndTs = getEndTs(currentProg);  
        const origStartTs = getStartTs(origProg); 
        const origEndTs = getEndTs(origProg);  
        if (currentEndTs > nowTs && origEndTs > nowTs) {

            // compare the fields with the original entry
            // starting time
            if (currentStartTs !== origStartTs) {
                currentProg.reason = changeStr;            
                // add the entry to the list of changed 
                changeList.push(currentProg);
                return;
            }
            // ending time
            if (currentEndTs !== origEndTs) {
                currentProg.reason = changeStr;            
                // add the entry to the list of changed 
                changeList.push(currentProg);
                return;
            }

            // location
            const currentLog = getLocationString(currentProg);
            const origLog = getLocationString(origProg);
            if (origLog !== currentLog) {
                currentProg.reason = changeStr;            
                // add the entry to the list of changed 
                changeList.push(currentProg);
                return;
            }



        }

    });

    // loop trough the original entries once more and check for cancelled entries
    _.each(origSchedule, (prog) => {
        if (!prog.notDeleted) {
            const endTs = getEndTs(prog);  
            if (endTs > nowTs) {
                prog.reason = removedStr;            
                // add the entry to the list of changed 
                changeList.push(prog);
            }
            return;
        }
        
    });

    // sort the changeList in ascending order by the starting time
    changeList.sort(function(a,b) {
       
        return getStartTs(a) - getStartTs(b);

    });


    // Print the changes
    var entryCounter = 0;
    _.each(changeList, (prog) => {


        const loc = getLocationString(prog);
        if (onlyLoc && loc.indexOf(onlyLoc) === -1) return; // only show entries for current location. (Match given location limiter to the prefix of programme location)

        if (entryCounter >= entriesShown) return false; // only show first entries

       

        // TODO remove
        // Ropecon2017 specific fixes
        // Remove entries for Pöytäpelit programme not located in the Halli 5
        var notIncluded = false;
        _.each(prog.tags, (tag) => {
            if (tag.indexOf("Pöytäpelit") !== -1) {
                if (loc.indexOf("Halli 5") === -1) {
                    notIncluded=true;
                    return;
                }
            }
        });
        if (notIncluded) return;


        entryCounter++;

        const startTs = getStartTs(prog);
        const endTs = getEndTs(prog);

        let changeType = "";
        let changeClass = "";

        if (prog.reason === newStr) {    
            changeType = "Uusi";
            changeClass = "new";
        } else if (prog.reason === changeStr){
            changeType = "Muutos";
            changeClass = "change";
        } else if (prog.reason === removedStr){
            changeType = "Peruttu";
            changeClass = "cancellation";
        }
        let typeEntry = 
            <div className={changeClass}><span className="ctitle">{changeType}</span></div>;
        let progEntry = 
            <div className={changeClass}>{renderChanges(prog, startTs, endTs)}</div>;
        content.push(
            <tr key={prog.id+prog.title+loc} className="changes-table-row">
                <td className="changes-table-cell current">{typeEntry}</td>
                <td className="changes-table-cell current">{progEntry}</td>
                <td className="changes-table-cell loc">{loc}</td>
            </tr>
        );

    });

    return (
        <div className="slide changes-slide">
        <h1>Ohjelmamuutokset</h1>
        <div className="scrollable-changes">
            <p>
            <table className="changes_table">
                <tbody>{content}</tbody>
            </table>
            </p>
        </div>
        </div>
    );


}

export default {
    view: ChangesSlide,
};
