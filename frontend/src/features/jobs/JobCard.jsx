import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { jobAPI } from '../../services/api';

/**
 * Job Card Component - Displays a single job
 *
 * Tailwind Grid Classes:
 * - grid grid-cols-2 = 2 column grid
 * - gap-4 = spacing between grid items
 */

const JobCard = ({ job, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const handleToggleFavorite = async () => {
    setUpdating(true);
    try {
      await jobAPI.update(job.id, { isFavorite: !job.isFavorite });
      onUpdate(); // Refresh the job list
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleApplied = async () => {
    setUpdating(true);
    try {
      await jobAPI.update(job.id, { isApplied: !job.isApplied });
      onUpdate();
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.delete(job.id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  return (
    <Card className="hover:shadow-xl transition-shadow">
      {/* Header - Title and Favorite */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
          <p className="text-lg text-gray-600">{job.company}</p>
        </div>
        <button
          onClick={handleToggleFavorite}
          disabled={updating}
          className="text-2xl hover:scale-110 transition-transform"
        >
          {job.isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {/* Location */}
      {job.location && (
        <p className="text-sm text-gray-500 mb-3">📍 {job.location}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.isApplied && <Badge variant="success">✓ Applied</Badge>}
        {job.isFavorite && <Badge variant="warning">⭐ Favorite</Badge>}
        {job.isRejected && <Badge variant="danger">✗ Rejected</Badge>}
        {!job.isApplied && !job.isRejected && (
          <Badge variant="info">Pending</Badge>
        )}
      </div>

      {/* Date */}
      <p className="text-xs text-gray-400 mb-4">
        Added: {new Date(job.createdAt).toLocaleDateString()}
      </p>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          onClick={() => window.open(job.jobUrl, '_blank')}
          variant="primary"
        >
          View Job
        </Button>
        <Button
          size="sm"
          onClick={handleToggleApplied}
          disabled={updating}
          variant={job.isApplied ? 'secondary' : 'success'}
        >
          {job.isApplied ? 'Mark as Unapplied' : 'Mark as Applied'}
        </Button>
        <Button
          size="sm"
          onClick={handleDelete}
          variant="danger"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;
