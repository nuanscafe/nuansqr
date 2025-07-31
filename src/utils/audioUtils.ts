// Audio utility functions for notifications

export const playBeepSound = (frequency: number = 800, duration: number = 200) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.log('Web Audio API desteklenmiyor:', error);
  }
};

export const playNewOrderSound = () => {
  // Try to play MP3 file first, fallback to beep
  try {
    const audio = new Audio('/sounds/new-order.mp3');
    audio.volume = 0.8;
    audio.play().catch(() => {
      // Fallback: Double beep for new order
      playBeepSound(800, 200);
      setTimeout(() => playBeepSound(1000, 200), 300);
    });
  } catch (error) {
    // Fallback: Double beep
    playBeepSound(800, 200);
    setTimeout(() => playBeepSound(1000, 200), 300);
  }
};

export const playWaiterCallSound = () => {
  // Try to play MP3 file first, fallback to beep
  try {
    const audio = new Audio('/sounds/waiter-call.mp3');
    audio.volume = 0.7;
    audio.play().catch(() => {
      // Fallback: Triple beep for waiter call
      playBeepSound(600, 150);
      setTimeout(() => playBeepSound(800, 150), 200);
      setTimeout(() => playBeepSound(1000, 150), 400);
    });
  } catch (error) {
    // Fallback: Triple beep
    playBeepSound(600, 150);
    setTimeout(() => playBeepSound(800, 150), 200);
    setTimeout(() => playBeepSound(1000, 150), 400);
  }
};