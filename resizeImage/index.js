exports.handler = async event => {
    var data = event.data;
    var results = await resizeImage(data);
    return results;
}

const resizeImage = async data => {
    return new Promise((resolve, reject) => {
        if(!data.height || !data.width)
            return reject({message: 'Need to provide data that has a height and width.'});

        var image = {
            height: `${data.height}px`,
            width: `${data.width}px`
        };
        return sresolve(image);
    });

}