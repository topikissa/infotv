import React from "react";
import _ from "lodash";
import DatumManager from "../datum";
import moment from "moment";
import config from "../config";
import cx from "classnames";

function renderProgram(prog) {
    const startMoment = moment.unix(prog.start_ts);
    const startTime = startMoment.format("HH:mm");
    const endTime = moment.unix(prog.end_ts).format("HH:mm");
    const className = cx({
        progInfo: true,
        soon: (Math.abs(moment().diff(startMoment)) < 5 * 60 * 1000),
    });

    return (
        <span className={className}>
        <span className="times">{startTime}-{endTime}</span>
        <span className="title">{prog.title}</span>
    </span>
    );
}

function NowNextSlide(props) {
    const onlyLoc = config.loc;
    const content = [];
    const schedule = DatumManager.getValue("schedule");
    if (!schedule) return (<div>No schedule</div>);
    const nowTs = (+new Date()) / 1000;
    const order = schedule.location_order || [];
    _.each(order, (loc) => {
        if (onlyLoc && onlyLoc !== loc) return;
        const programs = _.filter(schedule.programs, (prog) => prog.location === loc);
        let currentProg = _.detect(programs, (prog) => (nowTs >= prog.start_ts && nowTs < prog.end_ts));
        let nextProg = _.detect(programs, (prog) => (prog.start_ts >= nowTs));
        if (!(currentProg || nextProg)) return;

        currentProg = (currentProg ? (
            <div className="now"><span className="ntitle">Nyt</span> {renderProgram(currentProg)}</div>) : null);

        nextProg = (nextProg ? (
            <div className="next"><span className="ntitle">Seuraavaksi</span> {renderProgram(nextProg)}
            </div>) : null);

        content.push(
            <tr key={loc} className="nownext-table-row">
                <td className="nownext-table-cell loc">{loc}</td>
                <td className="nownext-table-cell current">{currentProg}</td>
                <td className="nownext-table-cell next">{nextProg}</td>
            </tr>
        );
    });
    return (
        <div key={props.key} className="slide nownext-slide">
            <table className="nownext_table">
                <tbody>{content}</tbody>
            </table>
        </div>
    );
}

export default {
    view: NowNextSlide,
};
