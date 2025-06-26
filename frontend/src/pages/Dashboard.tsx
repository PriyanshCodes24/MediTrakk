import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { user } = useAuth();
  // console.log(user);
  return (
    <div>
      <h1>Welcome back, to MediTrakk {user.name}</h1>
    </div>
  );
};
