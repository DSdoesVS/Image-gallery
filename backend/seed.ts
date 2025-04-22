import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load models
import User from './src/models/User';
import Album from './src/models/Album';
import Photo from './src/models/Photo';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/image-gallery';

// Convert JSON data to match Mongoose schema (strip MongoDB specific format)
const convertAlbumData = (album: any) => {
  return {
    _id: album._id.$oid,
    userId: album.userId.$oid,
    title: album.title,
    createdAt: new Date(album.createdAt.$date)
  };
};

const convertPhotoData = (photo: any) => {
  return {
    _id: photo._id.$oid,
    albumId: photo.albumId.$oid,
    title: photo.title,
    url: photo.url,
    thumbnailUrl: photo.thumbnailUrl,
    createdAt: new Date(photo.createdAt.$date)
  };
};

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read the mock data files
    const albumsPath = path.join(__dirname, 'mockAlbums.json');
    const photosPath = path.join(__dirname, 'mockPhotos.json');

    if (!fs.existsSync(albumsPath) || !fs.existsSync(photosPath)) {
      console.error('Mock data files not found. Please run generateMockData.ts first.');
      return;
    }

    const albums = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));
    const photos = JSON.parse(fs.readFileSync(photosPath, 'utf8'));

    // Clear existing data (optional - remove this if you want to keep existing data)
    console.log('Clearing existing album and photo data...');
    await Album.deleteMany({});
    await Photo.deleteMany({});

    // Insert albums with bulk operation
    console.log('Seeding albums...');
    const albumsData = albums.map(convertAlbumData);
    await Album.insertMany(albumsData);
    console.log(`${albumsData.length} albums seeded successfully!`);

    // Insert photos with bulk operation
    console.log('Seeding photos...');
    const photosData = photos.map(convertPhotoData);
    await Photo.insertMany(photosData);
    console.log(`${photosData.length} photos seeded successfully!`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeder
seedDatabase();