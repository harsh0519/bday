export interface Memory {
  date: string;
  title: string;
  emoji: string;
  description: string;
  note: string;
}

export interface Photo {
  caption: string;
}

export const config = {
  name: 'Sarah',
  memories: [
    { date: '2024-01-15', title: 'First Date', emoji: '💕', description: 'When we met at the coffee shop', note: 'You were so beautiful that day' },
    { date: '2024-02-14', title: 'Valentine\'s Day', emoji: '🌹', description: 'Our first Valentine together', note: 'Remember the sunset dinner?' },
    { date: '2024-06-20', title: 'Beach Trip', emoji: '🏖️', description: 'Summer vacation memories', note: 'That was the best week ever' },
    { date: '2024-12-25', title: 'Christmas', emoji: '🎄', description: 'Our first Christmas together', note: 'You made it so special' }
  ] as Memory[],
  loveReasons: [
    'You make me smile every single day',
    'Your kindness and compassion',
    'Your infectious laugh that brightens my day',
    'The way you support my dreams',
    'Your thoughtfulness and attention to detail',
    'How safe I feel when I\'m with you'
  ] as string[],
  photos: [
    { caption: 'Our first photo together 📸' },
    { caption: 'That beautiful sunset 🌅' },
    { caption: 'Silly moments together 😄' },
    { caption: 'You and me forever 💕' }
  ] as Photo[],
  letterContent: 'My dearest love, every moment with you is a gift. You bring joy, laughter, and warmth into my life in ways I never imagined possible. I am grateful for your love, your support, and your unwavering presence in my life. Happy Birthday to the person who makes every day special. Forever yours. 💕',
  finalMessage: 'Happy Birthday, My Love! 🎉 You deserve all the happiness in the world!',
  musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
} as const;
