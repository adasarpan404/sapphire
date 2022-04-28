const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const fs = require('fs')
const mime = require('mime-types')
const BUCKETNAME = "sapphire-v3"
const accessKeyId = process.env.SPACE_ACCESS_KEY;
const secretAccessKey= process.env.SPACE_SECRET;
const s3Client = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
  region: "fra1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
  credentials: {
    accessKeyId, // Access key pair. You can create access key pairs using the control panel or API.
    secretAccessKey // Secret access key defined through an environment variable.
  }
});
exports.uploadFile = async (file, location) => {
  console.log(file.filename)
    const fileStream = fs.createReadStream(file.path)
    const mimeType = mime.lookup(file)
    console.log(mimeType)
    try{
    const uploadParams = {
      Bucket: `${BUCKETNAME}`,
      Body: fileStream,
      Key: `collection/${file.filename}.png`,
      // ContentEncoding: 'base64',
        ContentType: 'image/png',
      ACL: "public-read", // Defines ACL permissions, such as private or public.
  Metadata: { // Defines metadata tags.
    "Content-Type": "image/png"
  }
    }
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    return data;
  }catch(err){
    return err
  }}



  