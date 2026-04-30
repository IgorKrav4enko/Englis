type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-wrap" aria-label={`Progress ${current} of ${total}`}>
      <div className="progress-label">
        Exercise {current} / {total}
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
