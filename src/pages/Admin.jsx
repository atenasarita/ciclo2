import { Link } from 'react-router-dom';
import ApprovalCard from '../components/ApprovalCard';
import '../styles/admin-styles.css';

const dummyUsers = [
  { name: 'Jane Doe', username: 'N00949600', email: 'jane@kia.com' },
  { name: 'John Doe', username: 'N01331090', email: 'john@kia.com' },
];

export default function Admin() {
  const handleApprove = user => {};
  const handleReject  = user => {};

  return (
    <div className='admin-page'>

      <Link to="/sessionstarted">
            <img
              className='go-back-btn'
              src={process.env.PUBLIC_URL + '/assets/go-back.png'}
              alt="Return btn"
            />
      </Link>

      <div className="admin-container">
        <div className="header-container">
          <h1>Pending Sign Ups Requests</h1>
        </div>
        <div className="approval-list">
          {dummyUsers.map(u => (
            <ApprovalCard key={u.username} user={u}
              onApprove={handleApprove} onReject={handleReject} />
          ))}
        </div>
      </div>
    </div>
  );
}