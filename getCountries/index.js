const funcs = require('./funcs');


exports.handler = async event => {
    var id = event.pathParameters.id;

    var { ...filters } = event.queryStringParameters;

    var arrayOfFilters = funcs.returnFilters(filters);

    let countries = [];
    
    if(id) {
        let countryFound = await funcs.getCountriesById(id); 
        countries.push(countryFound);
    }
    let countriesFound = await funcs.getCountries(arrayOfFilters);
    countries = [...countries, ...countriesFound];

    const responseBody = {
        countries: countries,
        timeOfRetrieval: moment(new Date()).format('MM/DD/YYYY')
    };

    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody)
    };

    return response;
}