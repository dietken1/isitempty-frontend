import React from "react";
import styles from "./CheckBox.module.css";

const CheckBox = ({ label, checked, onChange }) => {
  return (
    <label className={styles.checkboxLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.checkboxInput}
      />
      {label}
    </label>
  );
};

export default CheckBox;
