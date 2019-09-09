const moment = require('moment');
const data = require('./data.json');

exports.handler = async event => {
    var playerId = event.pathParameters.playerId;

    const playerData = playerId && Number.isInteger(playerId) ? data.players.find(player => player.id === playerId) : data.players[0];

    var response = {
        statusCode: 200,
        body: JSON.stringify(playerData),
        retrievalTime: moment(new Date()).format('MM/DD/YYYY hh:mm:ss a')
    };

    return response;
}