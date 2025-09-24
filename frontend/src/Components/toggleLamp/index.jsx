"use client";
import { useState } from "react";
import styles from "./index.module.css";

export default function LampToggle() {
  const [isNight, setIsNight] = useState(false);

  const toggleLamp = () => {
    setIsNight(!isNight);
  };

  return (
    <div className={`${styles.page} ${isNight ? styles.night : ""}`}>
      <div className={styles.lampContainer}>
        <div className={styles.lamp}>
          <div className={styles.bulb}>ssdfsd</div>
          <div className={styles.string}>dssdfsdd</div>
          <div

          style={{color : "red"}}
            className={`${styles.switch} ${isNight ? styles.pulled : ""}`}
            onClick={toggleLamp}
          > dsfsd</div>
        </div>
      </div>
    </div>
  );
}
