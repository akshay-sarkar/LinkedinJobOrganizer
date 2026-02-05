'use client';

import { useState, useCallback, memo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { jobAPI } from '@/lib/api';

const JobCard = memo(({ job, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const handleToggleFavorite = useCallback(async () => {
    setUpdating(true);
    try {
      await jobAPI.update(job.id, { isFavorite: !job.isFavorite });
      onUpdate(job.id);
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setUpdating(false);
    }
  }, [job.id, job.isFavorite, onUpdate]);

  const handleToggleApplied = useCallback(async () => {
    setUpdating(true);
    try {
      await jobAPI.update(job.id, { isApplied: !job.isApplied });
      onUpdate(job.id);
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setUpdating(false);
    }
  }, [job.id, job.isApplied, onUpdate]);

  const handleDelete = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.delete(job.id);
        onUpdate(job.id);
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  }, [job.id, onUpdate]);

  const handleViewJob = useCallback(() => {
    window.open(job.jobUrl, '_blank');
  }, [job.jobUrl]);

  return (
    <Card className="hover:shadow-xl transition-shadow dark:bg-gray-800 border dark:border-gray-700">
      {/* Header - Title and Favorite */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1 dark:text-white">{job.title}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">{job.company}</p>
        </div>
        <button
          onClick={handleToggleFavorite}
          disabled={updating}
          className="text-2xl hover:scale-110 transition-transform dark:text-yellow-400"
        >
          {job.isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {/* Location */}
      {job.location && (
        <p className="text-sm text-gray-500 mb-3 dark:text-gray-400">📍 {job.location}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.isEasyApply && <Badge variant="success">Easy Apply</Badge>}
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
          onClick={handleViewJob}
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
});
JobCard.displayName = 'JobCard';

export default JobCard;
