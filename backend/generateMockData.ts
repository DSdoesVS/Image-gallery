// generateMockData.ts
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

// Types matching your MongoDB data structure
interface User {
  _id: {
    $oid: string;
  };
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  __v: number;
}

interface Album {
  _id: {
    $oid: string;
  };
  userId: {
    $oid: string;
  };
  title: string;
  createdAt: {
    $date: string;
  };
}

interface Photo {
  _id: {
    $oid: string;
  };
  albumId: {
    $oid: string;
  };
  title: string;
  url: string;
  thumbnailUrl: string;
  createdAt: {
    $date: string;
  };
}

// Generate a random ObjectId string
const generateObjectId = (): string => {
  return new ObjectId().toString();
};

// Generate a random title based on theme
const generateTitle = (theme: string, index: number): string => {
  const themes = {
    nature: ['Forest', 'Mountain', 'Ocean', 'Desert', 'Lake', 'River', 'Sunset', 'Sunrise', 'Wildlife', 'Landscape'],
    city: ['Downtown', 'Skyline', 'Street', 'Building', 'Architecture', 'Urban', 'Night City', 'Bridge', 'Park', 'Monument'],
    food: ['Dinner', 'Breakfast', 'Lunch', 'Dessert', 'Cuisine', 'Gourmet', 'Homemade', 'Restaurant', 'Drinks', 'Snacks'],
    travel: ['Vacation', 'Journey', 'Adventure', 'Exploration', 'Trip', 'Destination', 'Holiday', 'Tour', 'Sightseeing', 'Excursion'],
    people: ['Family', 'Friends', 'Portrait', 'Group', 'Selfie', 'Party', 'Gathering', 'Celebration', 'Event', 'Reunion']
  };
  
  const themeWords = themes[theme as keyof typeof themes] || themes.nature;
  return `${themeWords[index % themeWords.length]} Collection ${index + 1}`;
};

// Generate a random photo title
const generatePhotoTitle = (theme: string, index: number): string => {
  const adjectives = ['Beautiful', 'Amazing', 'Stunning', 'Wonderful', 'Impressive', 'Fascinating', 'Breathtaking', 'Captivating', 'Spectacular', 'Gorgeous'];
  const themes = {
    nature: ['Forest', 'Mountain', 'Ocean', 'Desert', 'Lake', 'River', 'Sunset', 'Sunrise', 'Wildlife', 'Landscape'],
    city: ['Downtown', 'Skyline', 'Street', 'Building', 'Architecture', 'Urban', 'Night City', 'Bridge', 'Park', 'Monument'],
    food: ['Dinner', 'Breakfast', 'Lunch', 'Dessert', 'Cuisine', 'Gourmet', 'Homemade', 'Restaurant', 'Drinks', 'Snacks'],
    travel: ['Vacation', 'Journey', 'Adventure', 'Exploration', 'Trip', 'Destination', 'Holiday', 'Tour', 'Sightseeing', 'Excursion'],
    people: ['Family', 'Friends', 'Portrait', 'Group', 'Selfie', 'Party', 'Gathering', 'Celebration', 'Event', 'Reunion']
  };
  
  const themeWords = themes[theme as keyof typeof themes] || themes.nature;
  const adj = adjectives[index % adjectives.length];
  const noun = themeWords[index % themeWords.length];
  
  return `${adj} ${noun} ${index + 1}`;
};

// Generate random date within the last year
const generateRandomDate = (): string => {
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const timeDiff = now.getTime() - oneYearAgo.getTime();
  const randomDate = new Date(oneYearAgo.getTime() + Math.random() * timeDiff);
  return randomDate.toISOString();
};

// Generate albums for a user
const generateAlbumsForUser = (user: User, countPerUser = 4): Album[] => {
  const themes = ['nature', 'city', 'food', 'travel', 'people'];
  
  return Array.from({ length: countPerUser }, (_, i) => {
    const theme = themes[i % themes.length];
    return {
      _id: {
        $oid: generateObjectId()
      },
      userId: {
        $oid: user._id.$oid
      },
      title: generateTitle(theme, i),
      createdAt: {
        $date: generateRandomDate()
      }
    };
  });
};

// Generate photos for an album
const generatePhotosForAlbum = (album: Album, countPerAlbum = 10): Photo[] => {
  // Extract theme from album title
  const albumTitleLower = album.title.toLowerCase();
  let theme = 'nature'; // default theme
  
  if (albumTitleLower.includes('forest') || albumTitleLower.includes('mountain')) {
    theme = 'nature';
  } else if (albumTitleLower.includes('downtown') || albumTitleLower.includes('urban')) {
    theme = 'city';
  } else if (albumTitleLower.includes('dinner') || albumTitleLower.includes('cuisine')) {
    theme = 'food';
  } else if (albumTitleLower.includes('vacation') || albumTitleLower.includes('trip')) {
    theme = 'travel';
  } else if (albumTitleLower.includes('family') || albumTitleLower.includes('friends')) {
    theme = 'people';
  }
  
  return Array.from({ length: countPerAlbum }, (_, i) => {
    const id = Math.floor(Math.random() * 1000) + i;
    return {
      _id: {
        $oid: generateObjectId()
      },
      albumId: {
        $oid: album._id.$oid
      },
      title: generatePhotoTitle(theme, i),
      url: `https://picsum.photos/800/600?random=${id}`,
      thumbnailUrl: `https://picsum.photos/200/200?random=${id}`,
      createdAt: {
        $date: generateRandomDate()
      }
    };
  });
};

// Main function to generate all mock data
const generateMockData = () => {
  try {
    // Read users from test.users.json file
    // If you have this file in a different location, adjust the path
    const usersJson = `[{
      "_id": {
        "$oid": "680653d9749ea3dbc093c5fa"
      },
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "passwordHash": "$2b$10$Yk.T9BOx5ZpoZIA3/MntsOSgu2eKo/B83Ck4D6N1CA8rzOeDKmuWa",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "680653d9749ea3dbc093c5fc"
      },
      "name": "Ervin Howell",
      "username": "Antonette",
      "email": "Shanna@melissa.tv",
      "passwordHash": "$2b$10$6hL.Li2GBioDNuq9GNSUD.6URj7Z5p78ShnYPYjLHA4oaYcG6xrQ2",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "680653da749ea3dbc093c5fe"
      },
      "name": "Clementine Bauch",
      "username": "Samantha",
      "email": "Nathan@yesenia.net",
      "passwordHash": "$2b$10$.bQbBgC2oGpgnjEcpIrG1OUQh95INOnr9Q.hZUwNGMa7/XUjOQL3m",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "680653da749ea3dbc093c600"
      },
      "name": "Patricia Lebsack",
      "username": "Karianne",
      "email": "Julianne.OConner@kory.org",
      "passwordHash": "$2b$10$h/4wgu/06OwjtRwy3bUF5OmYkUkvBU8nzv/eaHQrnQDnoUBwunSpK",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "680653da749ea3dbc093c602"
      },
      "name": "Chelsey Dietrich",
      "username": "Kamren",
      "email": "Lucio_Hettinger@annie.ca",
      "passwordHash": "$2b$10$j4nCJR3KlQIwSTRRohrD5ujqQVDttk8YdBmwFhOdzf8YIcKzgONdW",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "680653da749ea3dbc093c604"
      },
      "name": "Mrs. Dennis Schulist",
      "username": "Leopoldo_Corkery",
      "email": "Karley_Dach@jasper.info",
      "passwordHash": "$2b$10$izOI970qUcgdl5x1Fip38uFPTz1o7B5uj.Q7lm6mN04eeRJQb36Qm",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "680653db749ea3dbc093c606"
      },
      "name": "Kurtis Weissnat",
      "username": "Elwyn.Skiles",
      "email": "Telly.Hoeger@billy.biz",
      "passwordHash": "$2b$10$1wMkvLPRId0BUf9BFUkXT.o3htlTkM6oCmTERZb0b1r4T35QeYN8O",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "680653db749ea3dbc093c608"
      },
      "name": "Nicholas Runolfsdottir V",
      "username": "Maxime_Nienow",
      "email": "Sherwood@rosamond.me",
      "passwordHash": "$2b$10$ux1XYNFaa01HqK1jj/wIM.1zKYlhEFH6f/6J.NQGGuh1T.OgzHnSG",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "680653db749ea3dbc093c60a"
      },
      "name": "Glenna Reichert",
      "username": "Delphine",
      "email": "Chaim_McDermott@dana.io",
      "passwordHash": "$2b$10$pPIPbgU6KrIGM1hs35tDt.9GqqDO0xT1QF90wZeizyZ2ppLHUyIdi",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "680653db749ea3dbc093c60c"
      },
      "name": "Clementina DuBuque",
      "username": "Moriah.Stanton",
      "email": "Rey.Padberg@karina.biz",
      "passwordHash": "$2b$10$ASbuj0bSkSXYZ2Pgj/VpBeki48bzdaMON61AhmQW1kikf2yavGTJK",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "68066eb393e9f5dfd58131ce"
      },
      "name": "Daksh",
      "username": "daksh123",
      "email": "daksh@example.com",
      "passwordHash": "$2b$10$sRfRXKYRcP0cUqOviUZNJOBlXE80JUU8gccBlG0WtyDietRF.mBAK",
      "__v": 0
    },
    {
      "_id": {
        "$oid": "6807c2ea62f0504014c61202"
      },
      "name": "Test",
      "username": "sample",
      "email": "example12@gmail.com",
      "passwordHash": "$2b$10$biXrxLwldQgMB6zJaCnEWeVj/dF/4X.L74ldLada0YOKNoe.GyTrS",
      "__v": 0
    }]`;
    
    const inputUsers = JSON.parse(usersJson) as User[];
    
    // Generate albums for each user
    const albums: Album[] = [];
    inputUsers.forEach(user => {
      const userAlbums = generateAlbumsForUser(user);
      albums.push(...userAlbums);
    });
    
    // Generate photos for each album
    const photos: Photo[] = [];
    albums.forEach(album => {
      const albumPhotos = generatePhotosForAlbum(album);
      photos.push(...albumPhotos);
    });
    
    // Write data to files
    fs.writeFileSync(
      path.resolve(__dirname, './mockAlbums.json'), 
      JSON.stringify(albums, null, 2)
    );
    
    fs.writeFileSync(
      path.resolve(__dirname, './mockPhotos.json'), 
      JSON.stringify(photos, null, 2)
    );
    
    console.log(`Generated ${albums.length} albums and ${photos.length} photos for ${inputUsers.length} users`);
    console.log('Data saved to mockAlbums.json and mockPhotos.json');
    
  } catch (error) {
    console.error('Error generating mock data:', error);
  }
};

// Run the generator
generateMockData();