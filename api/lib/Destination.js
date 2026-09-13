import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema(
  {
    stopNumber: {
      type: Number,
      default: 1,
    },
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    distance: {
      type: String,
      default: '',
      trim: true,
    },
    searchQuery: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'darshan',
    },
    visited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Destination =
  mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);

export default Destination;
