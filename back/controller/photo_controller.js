const { BlobServiceClient } = require('@azure/storage-blob');
const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=movezblobstorage;AccountKey=gdynUtIh+okgMWIeg3pLYYMNk5rXhIG/h0IiQ1/BqYNy4TqgJowOKQLPR0So9hYBww6+aH30mndD+AStU7DwQg==;EndpointSuffix=core.windows.net';
const containerName = 'photos';

const uploadPhoto = async (file) => {
    try{
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer);
    return blockBlobClient.url;
    }
    catch(error){
        throw error;
    }
}

const deletePhoto = async (photoUrl) => {
    if(!photoUrl || photoUrl == null || photoUrl == undefined || photoUrl == ''){
        throw new Error('No photo url provided');
    }
    try{
        const blockBlobClient = getBlobClient(photoUrl);
        await blockBlobClient.delete();
    }
    catch(error){
        console.log('here: ', error.message);
        throw new Error(error.message);
    }
}

const updatePhoto = async (newPhoto, oldPhotoUrl) => {
    let newUrl = '';
    try{
    newUrl = await uploadPhoto(newPhoto);
    await deletePhoto(oldPhotoUrl);
    console.log('newUrl: ', newUrl);
    }
    catch(error){
        throw new Error(error.message);
    }
    finally{
        return newUrl;
    }
}

//probably wont be used.
const getPhoto = async (photoUrl) => {
    const blockBlobClient = getBlobClient(photoUrl);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
  
    return downloaded;
}

function getBlobClient(photoUrl) {
    const url = new URL(photoUrl);
    const pathParts = url.pathname.split('/');
    const blobName = pathParts.slice(2).join('/'); // The rest is the blob name
    console.log(blobName);
    try{
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        return blockBlobClient;
    }
    catch(error){
        console.log('here: ', error.message);
        throw new Error(error.message);
    }
}

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  }

  module.exports = { uploadPhoto, deletePhoto, updatePhoto, getPhoto };