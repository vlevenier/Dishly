import { useAuth } from "../auth/useAuth";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button className="btn" onClick={logout}>
      Logout
    </button>
  );
}