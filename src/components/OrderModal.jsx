import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./styles/OrderModal.module.css";

function OrderModal({ order, setOrderModal }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState({
    name: false,
    phone: false,
    address: false
  });
  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();

  // Pass string for field, and pass state value of same field
  // set the error status based on if val or not
  const handleFieldValidation = (fieldName, fieldVal) => {
    setError((prev) => ({
      ...prev,
      [fieldName]: !fieldVal
    }));

    if (!fieldVal) {
      setHasError(true);
      return true;
    }

    return false;
  };

  const handlePhoneValidation = () => {
    // Check to see if value passed consists of only the chars in phoneregex
    const validatePhoneNumber = (phoneNum) => {
      const phoneChars = /^[0-9()-]+$/;
      return phoneChars.test(phoneNum);
    };

    let tempErr = false;
    if (!validatePhoneNumber(phone) || !phone) {
      setError((prev) => ({
        ...prev,
        phone: true
      }));
      setHasError(true);
      tempErr = true;
    } else {
      setError((prev) => ({
        ...prev,
        phone: false
      }));
    }

    return tempErr;
  };

  const placeOrder = async () => {
    let temp = false;

    // Check each field and set appropriate errors, if temp is ever true (one error) temp will ALWAYS be true and thus exit func
    temp = handleFieldValidation("name", name) || temp;
    temp = handlePhoneValidation() || temp;
    temp = handleFieldValidation("address", address) || temp;

    if (temp) {
      return;
    }
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone,
        address,
        items: order
      })
    });

    if (response.status === 200) {
      const data = await response.json();
      navigate(`/order-confirmation/${data.id}`);
    }
  };

  const getError = () => {
    let errorStr = "Please complete these sections: ";

    Object.keys(error).forEach((key) => {
      if (error[key]) {
        errorStr += `${key}, `;
      }
    });

    return errorStr.slice(0, -2);
  };

  return (
    <>
      <div
        label="Close"
        className={styles.orderModal}
        onKeyPress={(e) => {
          if (e.key === "Escape") {
            setOrderModal(false);
          }
        }}
        onClick={() => setOrderModal(false)}
        role="menuitem"
        tabIndex={0}
      />
      <div className={styles.orderModalContent}>
        <h2>Place Order</h2>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              Name
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setName(e.target.value);
                }}
                type="text"
                id="name"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">
              Phone
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setPhone(e.target.value);
                }}
                type="phone"
                id="phone"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">
              Address
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setAddress(e.target.value);
                }}
                type="phone"
                id="address"
              />
            </label>
          </div>
        </form>
        <div className="error_msg">{hasError && <p>{getError()}</p>}</div>

        <div className={styles.orderModalButtons}>
          <button
            className={styles.orderModalClose}
            onClick={() => setOrderModal(false)}
          >
            Close
          </button>
          <button
            onClick={() => {
              placeOrder();
            }}
            className={styles.orderModalPlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderModal;
