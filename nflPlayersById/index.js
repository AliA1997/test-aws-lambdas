const moment = require('moment');
const mongoose = require('mongoose');
const {promisify} = require('util');

const connectAsync = promisify(mongoose.connect);

const connectionString = `mongodb://admin:admin1234@ds261342.mlab.com:61342/greatest-players-of-all-time-nfl`;
exports.handler = async event => {
    const playerRank = event.pathParameters.rank;

    await connectAsync(connectionString);

    const playerSchema = new mongoose.Schema({
        name: String,
        team: String,
        position: String,
        rank: Number
    });
    const Player = mongoose.model('Player', playerSchema);
    
    function getPlayers(rank) {
        var findOpts = rank ? { rank } : {};
        return new Promise((resolve, reject) => {
          return Player.find(findOpts, (err, docs) => {
            if(err)
              return reject(err);
  
            return resolve(docs[0]);
          });
        })
    }

      
    const player = await getPlayers(playerRank);


    player.retrievalReturn = moment(new Date()).format('MM/DD/YYYY');
    const response = {
        statusCode: 200,
        body: JSON.stringify(player)
    };
    return response;
}