import { Client, Account, ID, Databases, Storage } from 'appwrite';

const client = new Client();

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!projectId || projectId === 'YOUR_PROJECT_ID_HERE') {
    console.warn('Appwrite Project ID is not set. Please update your .env file.');
}

client
    .setEndpoint(endpoint || 'https://cloud.appwrite.io/v1')
    .setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query } from 'appwrite';
export default client;
