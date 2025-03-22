import React, { createContext, useState, useEffect, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";

const firebaseConfig = {};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const FCMContext = createContext<
  { fcmToken: string | null; getFCMToken: () => Promise<void> } | undefined
>(undefined);

export const FCMProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const getFCMToken = async () => {
    try {
      let token = localStorage.getItem("fcmToken");

      if (!token) {
        token = await getToken(messaging);

        if (token) {
          localStorage.setItem("fcmToken", token);
          setFcmToken(token);
          console.log("FCM Token:", token);
        }
      } else {
        setFcmToken(token);
        console.log("FCM Token from localStorage:", token);
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  };

  const handleFCMMessage = () => {
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
    });
  };

  useEffect(() => {
    getFCMToken();
    handleFCMMessage();
  }, []);

  return (
    <FCMContext.Provider value={{ fcmToken, getFCMToken }}>
      {children}
    </FCMContext.Provider>
  );
};

export const useFCM = () => {
  const context = useContext(FCMContext);
  if (!context) {
    throw new Error("useFCM must be used within a FCMProvider");
  }
  return context;
};
