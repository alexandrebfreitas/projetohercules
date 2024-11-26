import React from "react";
import "./HomePage.css"; // Estilos personalizados

function HomePage() {
  return (
    <div className="main-container">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <h1>Blip</h1>
        </div>
        <div className="header-actions">
          <button className="header-btn">Create router</button>
          <button className="header-btn">Create chatbot</button>
        </div>
      </header>

      {/* Workspace */}
      <div className="workspace">
        <h2>Emiliano's Workspace</h2>
        <div className="workspace-panels">
          <div className="panel">
            <h3>Contract panel</h3>
            <p>Manage members and important information from your contract</p>
          </div>
          <div className="panel">
            <h3>Learn how to use Blip</h3>
            <p>Check out our content to learn all about our platform.</p>
          </div>
          <div className="panel">
            <h3>Ask anything to our Blip Community</h3>
            <p>Get better results with our help.</p>
          </div>
        </div>
      </div>

      {/* Chatbots Section */}
      <div className="chatbots">
        <h3>Chatbots on Emiliano</h3>
        <div className="chatbots-list">
          <div className="chatbot-card">
            <p>BotTesteVisual</p>
            <span>Builder</span>
          </div>
          <div className="chatbot-card">
            <p>BotTesteFila</p>
            <span>Builder</span>
          </div>
          <div className="chatbot-card">
            <p>BotNovaCaixa</p>
            <span>Builder</span>
          </div>
          <div className="chatbot-card">
            <p>Link</p>
            <span>Builder</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
