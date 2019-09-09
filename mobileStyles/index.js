exports.handler = async event => {
    const data = event.data;
    const mobileStyles = await mobileStyles(data);
}

const mobileStyles = data => {
    return new Promise((resolve, reject) => {
        if(JSON.stringify(data) === "{}" || !data) 
            return reject({message: 'Invalid styles provided'})

        const mobileStyle = {
            backgroundColor: data[`background-color`],
            fontColor: data[`color`],
            fontSize: data[`font-size`],
            height: data[`height`],
            width: data[`width`]
        };
        return resolve(mobileStyle);
    });
}