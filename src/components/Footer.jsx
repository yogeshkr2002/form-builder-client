import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.section}>
        <h3 style={styles.heading}>FormBot</h3>
        <p style={styles.text}>
          Made with <span style={styles.heart}>❤️</span> by <br />
          <a
            href="https://twitter.com/cuvette"
            style={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            @cuvette
          </a>
        </p>
      </div>
      <div style={styles.section}>
        <h3 style={styles.heading}>Product</h3>
        <a href="/status" style={styles.link}>
          Status
        </a>
        <a href="/documentation" style={styles.link}>
          Documentation
        </a>
        <a href="/roadmap" style={styles.link}>
          Roadmap
        </a>
        <a href="/pricing" style={styles.link}>
          Pricing
        </a>
      </div>
      <div style={styles.section}>
        <h3 style={styles.heading}>Community</h3>
        <a
          href="https://discord.com"
          style={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </a>
        <a
          href="https://github.com"
          style={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </a>
        <a
          href="https://twitter.com"
          style={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        <a
          href="https://linkedin.com"
          style={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a href="/oss-friends" style={styles.link}>
          OSS Friends
        </a>
      </div>
      <div style={styles.section}>
        <h3 style={styles.heading}>Company</h3>
        <a href="/about" style={styles.link}>
          About
        </a>
        <a href="/contact" style={styles.link}>
          Contact
        </a>
        <a href="/terms" style={styles.link}>
          Terms of Service
        </a>
        <a href="/privacy" style={styles.link}>
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    display: "flex",
    justifyContent: "space-evenly",
    padding: "20px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  section: {
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  text: {
    fontSize: "14px",
    margin: 0,
  },
  heart: {
    color: "red",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    marginBottom: "8px",
    fontSize: "14px",
  },
};

export default Footer;
