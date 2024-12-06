import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userRole", data.role);

        setUser({
          name: data.username,
          email: data.email,
          id: data.id,
          role: data.role,
        });

        switch (data.role) {
          case "ADMIN":
            navigate("/dashboard");
            break;
          case "USER":
            navigate("/courses");
            break;
          default:
            navigate("/courses");
        }
      } else {
        setError(data.error || t("login.error_login_failed"));
      }
    } catch (error) {
      setError(t("login.error_occurred"));
      console.error("Login error:", error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
  
    try {
      const response = await fetch('http://localhost:8080/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.status === 200) {
        const data = await response.json();
        setMessage(t('forgot_password.reset_link_sent'));
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('forgot_password.error_occurred'));
      }
    } catch (error) {
      setError(t('forgot_password.error_occurred'));
      console.error('Forgot password error:', error);
    }
  };

  const styles = {
    languageSwitcher: {
      position: "absolute",
      top: "10px",
      right: "20px",
      display: "flex",
      gap: "10px",
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #ced4da",
      borderRadius: "5px",
      fontSize: "14px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#e2e6ea",
    },
  };

  return (
    <div>
      {/* Language Switcher */}
      <div style={styles.languageSwitcher}>
        <button
          onClick={() => changeLanguage("en")}
          style={styles.button}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("fr")}
          style={styles.button}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Français
        </button>
      </div>

      <div className="auth">
        <div className="container">
          <h3>{t("login.welcome")}</h3>
          <br />
          <h2>{t("login.login")}</h2>
          <form autoComplete="off" className="form-group" onSubmit={login}>
            <label htmlFor="email">{t("login.email")}</label>
            <input
              type="email"
              className="form-control"
              style={{ width: "100%" }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <br />
            <label htmlFor="password">{t("login.password")}</label>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <span>
              <Link to="/ForgotPassword">{t("login.forgot_password")}</Link>
            </span>
            <br />
            <button type="submit" className="btn btn-success btn-md">
              {t("login.login")}
            </button>
          </form>

          {error && (
            <span className="error-msg" style={{ color: "red" }}>
              {error}
            </span>
          )}

          {message && (
            <span className="success-msg" style={{ color: "green" }}>
              {message}
            </span>
          )}

          <span>
            {t("login.no_account")}
            <Link to="/register"> {t("login.register_here")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;