const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addReview, getReviews, deleteReview } = require('./review.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/:toyId', log, getReviews)
router.post('/:toyId', requireAuth, addReview)
router.delete('/:toyId/:reviewId', requireAuth, deleteReview)

module.exports = router