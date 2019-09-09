const im = require('imagemagick');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuid/v4');
const {promisify} = require('util');
const AWS = require("aws-sdk");

//Convert the imagemagick module resize function from a callback to a proimse.
const imageResize = promisify(im.resize);
const readFileAsync = promisify(fs.readFile);
//COnvert unlink to un link file after it is processed
const unlinkAsync = promisify(fs.unlink);

AWS.config.update({ region: "us-east-2"});
//Create new s3 object
const s3 = new AWS.S3();

exports.handler = async event => {
    var processedFiles = event.Records.map(async record => {
        //GEt bucket name
        const bucket = record.s3.bucket.name;
        //Get filename
        const filename = record.s3.object.key;

        ///Define params for request to s3
        const params = {
            Bucket: bucket,
            Key: filename
        };

        //Get the specific s3 object using tbe s3 utils getObject function.
        let inputData = await s3.getObject(params).promise();

        //Define a tempfile retrieve from lambda temporary file directory
        let tempFile = os.tmpdir() + '/' + uuidv4() + '.jpg';

        //Define options for resizing image
        let resizeArgs = {
            srcData: inputData.Body,
            dstPath: tempFile,
            width: 150
        };

        //Then resize image
        await imageResize(resizeArgs);

        let resizedData = readFileAsync(tempFile);

        //Upload new file to s3
        let targetFilename = filename.substring(0, filename.lastIndexOf('.') ) + '-small.jpg';

        let s3Params = {
            Bucket: bucket.substring(0, bucket.lastIndexOf('-')),
            Key: targetFilename,
            Body: new Buffer(resizedData),
            ContentType: 'image/jpeg'
        };

        //Update specifed s3 object.
        await s3.putObject(s3Params).promise();

        return await unlinkAsync(tempFile);
    });

    await Promise.all(processedFiles);
    console.info("done");
    return "done";
}