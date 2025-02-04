const Notification = ({ notification, type }) => {
  if (!notification) return null;

  const notificationStyle = {
    color: type === "error" ? "#721c24" : "#155724",
    background: type === "error" ? "#f8d7da" : "#d4edda",
    fontSize: "18px",
    fontWeight: "bold",
    borderLeft: `5px solid ${type === "error" ? "#f5c6cb" : "#c3e6cb"}`,
    borderRadius: "8px",
    padding: "12px 15px",
    marginBottom: "15px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return <div style={notificationStyle}>{notification}</div>;
};

export default Notification;
