const moment = require('moment');

var players = {
    "Lebron James": {
        "Jersey Number": 23,
        "Team": "Cleveland Cavaliers",
        "MVPS": 4
    },
    "Chris Paul": {
        "Jersey Number": 3,
        "Team": "Los Angeles Clippers",
        "MVPS": 0
    },
    "Kobe Bryant": {
        "Jersey Number": 24,
        "Team": "Los Angeles Lakers",
        "MVPS": 1
    },
    "Kevin Durant": {
        "Jersey Number": 35,
        "Team": "Oklahoma City Thunder",
        "MVPS": 1
    }
};

exports.handler = async event => {
    var name = event.pathParameters.name;
    var { player, ...info } = event.queryStringParameters;

    var message = `${name} favorite player is ${player ? player : "Lebron James"}.`;

    var playerTeam = `${name} favorite team is ${player ? players[player]["Team"] : players["Lebron James"]["Team"]}.`;

    var response = {
        name: name,
        message: message,
        favoriteTeam: playerTeam,
        info: info
    };

    //Must return a valid http response in order to test api gateway with a status code and body at minimum.
    return {
        statusCode: 200,
        body: JSON.stringify(response)
    };
}