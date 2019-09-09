exports.handler = async event => {
    var data = event.data;
    var websiteStyles = await returnStyles(data);
    return websiteStyles;
}


const returnStyles = data => {
    return new Promise((reject, resolve) => {
        if(JSON.stringify(data) === "{}" || !data)
            return reject({message: 'Invalid info related to return styles'});

        return resolve(data);
    });
}