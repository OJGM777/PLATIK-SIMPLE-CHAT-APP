import React from 'react'

const AlertCard = ({ message, type }) => {
    const alertStyles = {
      padding: "6px 6px",
      margin: "10px 0",
      justifyContent: "center",
      borderRadius: "5px",
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      ...(type === "success" && {
        backgroundColor: "#d4edda",
        color: "#155724",
        border: `1px solid #155724`
      }),
      ...(type === "error" && {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        border: `1px solid #721c24`
      }),
      ...(type === "info" && {
        backgroundColor: "#d1ecf1",
        color: "#0c5460",
        border: `1px solid #0c5460`
      }),
    };

    return (
      <div style={alertStyles}>
        <p>{message}</p>
      </div>
    );
  };

export default AlertCard;