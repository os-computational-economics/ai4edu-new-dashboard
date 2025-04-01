"use client";
import { Divider } from "@nextui-org/react";
import { useState, useEffect } from "react";

export default function Maintenance() {
  // You can set these values as props or from an API
  const [maintenanceTimestamp, setMaintenanceTimestamp] = useState(
    "2025-04-05T23:59:59"
  );
  const [maintenanceTimeZone, setMaintenanceTimeZone] =
    useState("America/New_York");
  const [timeLeft, setTimeLeft] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");

  useEffect(() => {
    // Format the maintenance end time with the specified time zone
    try {
      const endTimeDate = new Date(maintenanceTimestamp);
      const options: Intl.DateTimeFormatOptions = {
        timeZone: maintenanceTimeZone,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      };

      setFormattedEndTime(endTimeDate.toLocaleString("en-US", options));
    } catch (e) {
      setFormattedEndTime(`${maintenanceTimestamp} ${maintenanceTimeZone}`);
    }

    const calculateTimeLeft = () => {
      // Convert the maintenance timestamp to the specified time zone
      const endTime = new Date(maintenanceTimestamp);
      // Adjust for time zone if needed (using the browser's time zone handling)
      const now = new Date();

      const difference = +endTime - +now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        if (days > 0) {
          setTimeLeft("More than 24 hours");
        } else {
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);

          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        setTimeLeft("Maintenance should be complete soon");
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [maintenanceTimestamp, maintenanceTimeZone]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2D3748, #1A202C)",
        padding: "2rem",
        color: "#F7FAFC",
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "450px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          padding: "2.5rem",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#3B82F6",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            marginBottom: "0.75rem",
            background: "linear-gradient(90deg, #60A5FA, #2563EB)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          We&rsquo;ll be back soon!
        </h1>

        <p
          style={{
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "#CBD5E0",
            marginBottom: "2rem",
          }}
        >
          Our system is currently undergoing scheduled maintenance to improve
          your experience.
        </p>

        <div
          style={{
            width: "100%",
            height: "6px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "3px",
            marginBottom: "1.5rem",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              height: "100%",
              width: "35%",
              background: "linear-gradient(90deg, #2563EB, #60A5FA)",
              borderRadius: "3px",
              animation: "pulse 2s infinite",
            }}
          ></div>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#A0AEC0",
              marginBottom: "0.5rem",
            }}
          >
            Maintenance ends at:
          </p>

          <p
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#3B82F6",
            }}
          >
            {formattedEndTime}
          </p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            width: "100%",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#A0AEC0",
              marginBottom: "0.5rem",
            }}
          >
            Estimated time remaining:
          </p>

          <p
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#8B5CF6",
            }}
          >
            {timeLeft}
          </p>
        </div>
      </div>

      <p
        style={{
          marginTop: "2rem",
          fontSize: "0.875rem",
          color: "rgba(255, 255, 255, 0.5)",
        }}
      >
        Thank you for your patience.
      </p>
    </div>
  );
}
