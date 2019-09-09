const moment = require('moment');

var greetings = {
    "en": "Hello",
    "sp": "Hola",
    "fr": "Bonjour"
};

exports.handler = async event => {

    const name = event.pathParamters.name;
    //Retrieve lang from the api gateway queryParameters.
    const { lang, ...info } = event.queryParameters;
    const message = `${lang ? greetings[lang] : greetings['en']} ${name}`;

    const response = {
        name: name,
        message: message,
        info: info,
        timestamp: moment().unix()
    };

    //Can't just return the response in api gateway.
    //Must return a http response with at least a statusCode and body.
    return {
        statusCode: 200,
        body: JSON.stringify(response)
    };
}
