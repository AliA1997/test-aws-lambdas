
module.exports =  async function() {
        const mongoose = require('mongoose');
        const { promisify } = require('util');
        const connectionString = `mongodb://admin:admin1234@ds359077.mlab.com:59077/united-nations`;
        
        const connectAsync = promisify(mongoose.connect);
        await connectAsync(connectionString);
        
        const countrySchema = new mongoose.Schema({
            name: String,
            capital: String,
            foundedYear: Number,
            countryRank: Number,
            militaryRank: Number
        });
        
        const Country = mongoose.model('Country', countrySchema);
        
        function findCountry(filt){
            return new Promise((resolve, reject) => {
                return Country.find({filt}, (err, docs) => {
                    if(err)
                        return reject(err);
        
                    return resolve(docs);
                });
            });
        }
        
        async function getCountries(filts) {
            return new Promise((resolve, reject) => {
                var countries = [];
                console.log(filts);
                filts.forEach(async filt => {
                    var country = await findCountry(filt);
                    countries.push(country);
                })
                return resolve(countries);
            });
        }
        
        function getCountriesById(id) {
            var multiple = arguments[1];
            
            return new Promise((resolve, reject) => {
                var findOpts = id ? { _id: id } : {};
                return Country.find(findOpts, (err, docs) => {
                    if(err)
                        return reject(err);
                    
                    if(multiple)
                        return resolve(docs);
                    else 
                        return resolve(docs[0]);
                });
            });
        }
        
        function returnFilters(filters) {
            return new Promise((resolve, reject) => {
                var filtersToReturn = Object.keys(filters).filter(key => filters[key]).map(filterKey => {
                    if(filters[filterKey])
                        return { [filterKey]: filters[filterKey] };
                });
        
        
                return resolve(filtersToReturn);
            });
        }
        
        return {
            getCountries,
            getCountriesById,
            returnFilters
        };
    }();



