
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import HOD from './models/HOD.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const addHOD = async () => {
  try {
    // Check if HOD already exists
    const existingHOD = await HOD.findOne({ email: 'aimlhod@mits.ac.in' });
    if (existingHOD) {
      console.log('HOD with email aimlhod@mits.ac.in already exists');
      mongoose.connection.close();
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('hodSecurePassword123', salt); // Replace with a secure password

    // Create HOD
    const hod = new HOD({
      email: 'aimlhod@mits.ac.in',
      password: hashedPassword,
      role: 'hod',
    });

    // Save HOD to database
    await hod.save();
    console.log('HOD added successfully with email: aimlhod@mits.ac.in');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding HOD:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
addHOD();
