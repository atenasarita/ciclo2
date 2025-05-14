import Button from './Button';
export default function ApprovalCard({ user, onApprove, onReject }) {
  return (
    <div className="approval-card">
      <div className="user-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div className="actions">
        <Button onClick={() => onApprove(user)}>Approve</Button>
        <Button onClick={() => onReject(user)}>Reject</Button>
      </div>
    </div>
  );
}
