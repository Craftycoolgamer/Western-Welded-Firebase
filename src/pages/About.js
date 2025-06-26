import React from 'react';
import './About.css'; // Optional styling

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Western Welded</h1>
        <p>Your trusted partner in quality metal fabrication</p>
      </section>
      
      <section className="about-content">
        <div className="about-history">
          <h2>Our Story</h2>
          <p>
            Founded in [YEAR], Western Welded has grown from a small local workshop 
            to a leading provider of precision metal fabrication services. Our 
            commitment to quality and craftsmanship has remained unchanged since day one.
          </p>
        </div>
        
        <div className="about-mission">
          <h2>Our Mission</h2>
          <p>
            To deliver exceptional metal fabrication solutions through innovative 
            techniques, skilled craftsmanship, and unwavering dedication to customer 
            satisfaction.
          </p>
        </div>
        
        <div className="about-team">
          <h2>Our Team</h2>
          <p>
            Our certified welders and fabricators bring decades of combined experience 
            to every project. We invest in continuous training to stay at the forefront 
            of industry advancements.
          </p>
        </div>
      </section>
      
      <section className="about-values">
        <h2>Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Quality</h3>
            <p>We never compromise on materials or workmanship</p>
          </div>
          <div className="value-card">
            <h3>Integrity</h3>
            <p>Honest communication and fair pricing</p>
          </div>
          <div className="value-card">
            <h3>Innovation</h3>
            <p>Continually improving our techniques and technology</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;