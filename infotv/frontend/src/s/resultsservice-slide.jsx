import React from "react";
import _ from "lodash";
import DatumManager from "../datum";
import moment from "moment";
import config from "../config";
import cx from "classnames";



function ResultsserviceSlide() {


    const content = [];
    const results = DatumManager.getValue("results");
    if (!results) return (<div>No results</div>);

    const genres = results.genres;
    _.each(genres, (genre) => {

        const genreName = genre.genre;
        const tournaments = genre.tournaments;
        _.each(tournaments, (tournament) => {
            const tournamentName = tournament.name;
            const results = tournament.results;
            const genreClass = "genre"; 
            const tournamentClass= "tournament";
            let genreEntry = 
                <div className={genreClass}><span className="gtitle">{genreName}</span></div>;
            let tournamentEntry = 
                <div className={tournamentClass}><span className="ttitle">{tournamentName}</span></div>;
            const resultsContent = [];
            let firstResult = true;
            _.each(results, (result) => {
                const place = result.place;
                const placeDescription = result.place_description;
                const resultName = result.name;
                const placeValueShown = (placeDescription) ? placeDescription : place;
               
                if (firstResult===false) {
                    resultsContent.push(
			<br></br>
                    );
                }
                resultsContent.push(
                    <span className="place">{placeValueShown}</span>
                );
                resultsContent.push(
                    <span className="result">: {resultName}</span>
                );
                firstResult = false;
            });
            content.push(
                <tr key={genreName+tournamentName} className="resultsservice-table-row">
                    <td className="resultsservice-table-cell genre">{genreEntry}</td>
                    <td className="resultsservice-table-cell tournament">{tournamentEntry}</td>
                    <td className="resultsservice-table-cell results">{resultsContent}</td>
                </tr>
            );

        });
    });

    return (
        <div className="slide resultservice-slide">
        <h1>Tulospalvelu</h1>
        <div className="scrollable-results">
            <p>
            <table className="resultservice_table">
                <tbody>{content}</tbody>
            </table>
            </p>
        </div>
        </div>
    );
}

export default {
    view: ResultsserviceSlide,
};
