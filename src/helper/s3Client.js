import S3 from 'react-aws-s3';

const config = {
    bucketName: 'anousith-bucket',
    dirName: 'feedback_images', 
    region: 'ap-southeast-1',
    accessKeyId: 'AKIAUEQCQ2DVXZPKJ5MM',
    secretAccessKey: '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',
    s3Url: 'https://anousith-bucket.s3.ap-southeast-1.amazonaws.com', 
    // s3://anousith-bucket/feedback_images/
}

 export const s3Client = new S3(config);

