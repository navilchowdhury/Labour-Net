import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, worker, job, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      console.log('Submitting review:', { worker: worker._id, job: job._id, rating, comment });
      const response = await axios.post('http://localhost:5000/api/reviews/', {
        worker: worker._id,
        job: job._id,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Review response:', response.data);

      onReviewSubmitted(response.data);
      onClose();
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.error || 'Failed to submit review. Please try again.';
      alert(`Review failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        className={`star-button ${star <= rating ? 'active' : ''}`}
        onClick={() => setRating(star)}
      >
        ★
      </button>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <div className="review-modal-header">
          <h2>Review Worker</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="review-modal-content">
          <div className="worker-info">
            <h3>{worker.name}</h3>
            <p>Job: {job.category} Position</p>
            <p>Location: {job.location || job.address}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rating-section">
              <label>Rating:</label>
              <div className="star-rating">
                {renderStars()}
              </div>
              <span className="rating-text">
                {rating} out of 5 stars
              </span>
            </div>

            <div className="comment-section">
              <label htmlFor="comment">Comment (optional):</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with this worker..."
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
