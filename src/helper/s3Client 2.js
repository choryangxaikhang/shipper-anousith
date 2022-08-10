import S3 from 'react-aws-s3';

const config = {
    bucketName: 'bithouse-bucket',
    dirName: 'images', 
    region: 'ap-southeast-1',
    accessKeyId: 'AKIARU4Q6V6AGTS2DCIJ',
    secretAccessKey: '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',
    s3Url: 'https://bithouse-bucket.s3.ap-southeast-1.amazonaws.com', 
    // s3://anousith-bucket/feedback_images/
}

 export const s3Client = new S3(config);

