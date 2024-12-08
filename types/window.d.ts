interface OutsetaChat {
  show: () => void;
  hide: () => void;
}

interface Outseta {
  chat: OutsetaChat;
}

declare global {
  interface Window {
    Outseta?: Outseta;
  }
}

export {};
