export default function ReviewCard({ review }) {
  const initials = (review.user || '?').charAt(0).toUpperCase()
  const date = new Date(review.created_at).toLocaleDateString('ru-RU', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-author">
          <div className="review-avatar">{initials}</div>
          <div>
            <div className="review-username">{review.user}</div>
            <div className="review-date">{date}</div>
          </div>
        </div>
        <div className="review-stars">{'★'.repeat(review.rating)}</div>
      </div>
      {review.text && <div className="review-text">{review.text}</div>}
    </div>
  )
}
