// src/utils/fakeData.ts
import { User } from '../types/User';
import { Album } from '../types/Album';
import { Photo } from '../types/Photo';

// Generate a random ID
const generateId = () => Math.floor(Math.random() * 10000);

// Generate a fake user with random data
export const generateFakeUser = (id?: string): User => ({
  id: id || `${generateId()}`,
  name: `User ${generateId()}`,
  username: `user${generateId()}`,
  email: `user${generateId()}@example.com`,
});

// Generate an array of fake users
export const generateFakeUsers = (count = 5): User[] => {
  return Array.from({ length: count }, (_, i) => 
    generateFakeUser(`${i + 1}`)
  );
};

// Generate a fake album with random data
export const generateFakeAlbum = (userId?: number): Album => ({
  id: generateId(),
  userId: userId || generateId(),
  title: `Album ${generateId()}`,
  _id: `${generateId()}`, // For compatibility with existing code
});

// Generate an array of fake albums for a user
export const generateFakeAlbums = (userId: number, count = 3): Album[] => {
  return Array.from({ length: count }, () => 
    generateFakeAlbum(userId)
  );
};

// Generate a fake photo using Lorem Picsum
export const generateFakePhoto = (albumId?: number): Photo => {
  const id = generateId();
  return {
    id,
    albumId: albumId || generateId(),
    title: `Photo ${id}`,
    url: `https://picsum.photos/800/600?random=${id}`,
    thumbnailUrl: `https://picsum.photos/200/200?random=${id}`,
  };
};

// Generate an array of fake photos for an album
export const generateFakePhotos = (albumId: number, count = 5): Photo[] => {
  return Array.from({ length: count }, () => 
    generateFakePhoto(albumId)
  );
};