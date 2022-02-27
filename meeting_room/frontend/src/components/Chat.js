import { ChatEngine } from 'react-chat-engine';
import React, { Component } from "react";

import ChatFeed from './ChatFeed';

const projectID = 'b4ea9a27-6bf1-4e87-90d8-fae0fcd046e1';

const App = () => {

  return (
    <ChatEngine
      height="100vh"
      projectID={projectID}
      userName={localStorage.getItem('username')}
      userSecret='secret-123-jBj02'
      renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
      onNewMessage={() => new Audio('https://chat-engine-assets.s3.amazonaws.com/click.mp3').play()}
    />
  );
};

// infinite scroll, logout, more customizations...

export default App;