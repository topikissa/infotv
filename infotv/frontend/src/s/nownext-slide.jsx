var React = require("react/addons");
var _ = require("lodash");
var DatumManager = require("../datum");
var moment = require("moment");
var config = require("../config");
var cx = require("classnames");

function renderProgram(prog) {
    var startMoment = moment.unix(prog.start_ts);
    var startTime = startMoment.format("HH:mm");
    var endTime = moment.unix(prog.end_ts).format("HH:mm");
    var className = cx({
        "progInfo": true,
        "soon": (Math.abs(moment().diff(startMoment)) < 5 * 60 * 1000)
    });

    return (
        <span className={className}>
        <span className="times">{startTime}-{endTime}</span>
        <span className="title">{prog.title}</span>
    </span>
    );
}

var NowNextSlide = React.createClass({

    render: function () {
        var onlyLoc = config.loc;
        var content = [];
        var schedule = DatumManager.getValue("schedule");
        if (!schedule) return (<div>No schedule</div>);
        var nowTs = (+new Date()) / 1000;
        var order = schedule.location_order || [];
        _.each(order, function (loc) {
            if (onlyLoc && onlyLoc !== loc) return;
            var programs = _.filter(schedule.programs, function (prog) {
                return prog.location === loc;
            });
            var currentProg = _.detect(programs, function (prog) {
                return (nowTs >= prog.start_ts && nowTs < prog.end_ts);
            });
            var nextProg = _.detect(programs, function (prog) {
                return (prog.start_ts >= nowTs);
            });
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
            <div key={this.props.key} className="slide nownext-slide">
                <table className="nownext_table">
                    <tbody>{content}</tbody>
                </table>
            </div>
        );
    }
});


module.exports = {
    view: NowNextSlide
};
