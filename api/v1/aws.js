import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const uploadToS3 = (base64String, fileType) => {
  const base64Data = new Buffer.from(
    base64String.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = fileType.split("/")[1];
  const name = uuidv4();

  s3.upload({
    Bucket: S3_BUCKET,
    Key: `uploads/${name}.${type}`,
    Body: base64Data,
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
    ACL: "public-read"
  })
    .promise()
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
};

export default uploadToS3;
