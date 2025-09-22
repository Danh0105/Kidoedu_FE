import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();
  const BASENAME = '';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = `${BASENAME}/login`;
  };

  return (
    <a href="#" className="btn btn-default btn-flat float-end" onClick={handleLogout}>
      Sign out
    </a>
  );
}
