const { BlobServiceClient } = require('@azure/storage-blob');
const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=movezblobstorage;AccountKey=gdynUtIh+okgMWIeg3pLYYMNk5rXhIG/h0IiQ1/BqYNy4TqgJowOKQLPR0So9hYBww6+aH30mndD+AStU7DwQg==;EndpointSuffix=core.windows.net'; //change later
const containerName = 'photos';

const deletePhoto = async (photoUrl) => {
    try{
    const url = new URL(photoUrl);
    const pathParts = url.pathname.split('/');
    const blobName = pathParts.slice(2).join('/'); // The rest is the blob name

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();
    }
    catch(error){
        throw new Error(error.message);
    }
}