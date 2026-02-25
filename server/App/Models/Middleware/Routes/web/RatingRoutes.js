// server/api/ratings.js
const express = require('express');
const RatingModels = require('../../../RatingModels');
const { ratingData } = require('../controllers/web/RatingDataFolder');
const router = express.Router();


// POST /api/ratings
router.post('/review-insert', async (req, res) => {
  try {
    const { stars, review, author,} = req.body;
    
    const newRating = new RatingModels({
     
      stars,
      review,
      author,
    
      date: new Date()
    });

    const savedRating = await newRating.save();
    res.status(201).json(savedRating);
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

router.get('/review-view',ratingData);

module.exports = router;