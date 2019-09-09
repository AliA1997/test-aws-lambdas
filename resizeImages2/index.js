const moment = require('moment');
const im = require('imagemagick');
const os = require('os');
const fs = require('fs');
const { promisify } = require('util');
const uuid = require('uuid/v4');
const AWS = require('aws-sdk');

//Update the region of specified s3 bucket.
AWS.config.update({ region: 'us-east-2' });


//Define the s3 utility used to retrieve and update specified s3 objects.
const s3 = new AWS.S3();

//Turn asynchronous callbacks to promises
//Function responsible for resizing images.
const resizeAsync = promisify(im.resize);

//Read the temp file 
const readFileAsync = promisify(fs.readFile);

//After processing files unlink the tempfile
const unlinkAsync = promisify(fs.unlink);

//Define the lambda function.
exports.handler = async event => {
    //Map through the records and process each record and resize the width and move the updated object to the a different s3 bucket.
    const processedFiles = event.Records.map(async record => {
        const bucket = record.s3.bucket.name;
        const filename = record.s3.object.key;

        //Define params for retrieve the specified s3 file.
        let getParams = {
            Bucket: bucket,
            key: filename, 
        };

        let inputData = await s3.getObject(getParams).promise();

        let tempFile = os.tmpdir() + '/' + uuid() + '.jpg';

        //Define options for resizing images
        let resizeArgs = {
            srcData: inputData.Body,
            dstPath: tempFile,
            width: 150
        };

        //Resize image 
        await resizeAsync(resizeArgs);

        //Read file of the resize image and assign it to the tempfile.
        let resizedData = await readFileAsync(tempFile);

        //Define the new filename
        let targetFilename = filename.substring(0, filename.lastIndexOf('.') ) + '-small.jpg';
        
        console.log('targetFileName---------------', targetFilename);
        // //Params for the new s3 object.
        const newS3Object = {
            Bucket: bucket + '-dest',
            Key: targetFilename,
            Body: new Buffer(resizedData),
            ContentType: 'image/jpeg'
        };

        console.log(JSON.stringify(newS3Object));
        //Update the specified object.
        await s3.putObject(newS3Object).promise();

        return await unlinkAsync(tempFile);

    });

    await Promise.all(processedFiles);
    const returnMessage = `Done at ${moment(new Date()).format('MM/DD/YYYY')}`
    console.log(returnMessage);
    return returnMessage;
};