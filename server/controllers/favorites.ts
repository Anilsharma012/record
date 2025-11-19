import { Request, Response } from 'express';
import { Favorite } from '../models/Favorite';
import { Listing } from '../models/Listing';
import { AuthRequest } from '../middleware/auth';

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // listing id
    const existing = await Favorite.findOne({ userId: req.user._id, listingId: id });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      await Listing.findByIdAndUpdate(id, { $inc: { favoritesCount: -1 } });
      return res.json({ favorited: false });
    }
    await Favorite.create({ userId: req.user._id, listingId: id });
    await Listing.findByIdAndUpdate(id, { $inc: { favoritesCount: 1 } });
    res.json({ favorited: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const listFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const items = await Favorite.find({ userId: req.user._id }).populate('listingId');
    res.json(items);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
