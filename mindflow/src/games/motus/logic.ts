import words from '../../../dictionaries/fr/words-5.json';

export type LetterStatus = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export interface LetterResult {
  letter: string;
  status: LetterStatus;
}

export interface GameState {
  targetWord: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  maxAttempts: number;
  wordLength: number;
}

// Get a random word from the dictionary
export function getRandomWord(): string {
  const validWords = words.filter((w: string) => w.length === 5);
  const randomIndex = Math.floor(Math.random() * validWords.length);
  return validWords[randomIndex].toUpperCase();
}

// Get daily word based on date (same word for everyone on same day)
export function getDailyWord(): string {
  const today = new Date();
  const startDate = new Date('2024-01-01');
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const validWords = words.filter((w: string) => w.length === 5);
  const index = daysSinceStart % validWords.length;
  return validWords[index].toUpperCase();
}

// Check if a word is valid (exists in dictionary)
export function isValidWord(word: string): boolean {
  return words.map((w: string) => w.toUpperCase()).includes(word.toUpperCase());
}

// Evaluate a guess against the target word
export function evaluateGuess(guess: string, target: string): LetterResult[] {
  const result: LetterResult[] = [];
  const targetLetters = target.split('');
  const guessLetters = guess.toUpperCase().split('');

  // Track which letters in target have been matched
  const targetUsed = new Array(target.length).fill(false);
  const guessStatus: LetterStatus[] = new Array(guess.length).fill('absent');

  // First pass: find correct positions (green)
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      guessStatus[i] = 'correct';
      targetUsed[i] = true;
    }
  }

  // Second pass: find present letters (yellow)
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessStatus[i] === 'correct') continue;

    for (let j = 0; j < targetLetters.length; j++) {
      if (!targetUsed[j] && guessLetters[i] === targetLetters[j]) {
        guessStatus[i] = 'present';
        targetUsed[j] = true;
        break;
      }
    }
  }

  // Build result
  for (let i = 0; i < guessLetters.length; i++) {
    result.push({
      letter: guessLetters[i],
      status: guessStatus[i],
    });
  }

  return result;
}

// Initialize a new game
export function initGame(daily: boolean = false): GameState {
  return {
    targetWord: daily ? getDailyWord() : getRandomWord(),
    guesses: [],
    currentGuess: '',
    gameStatus: 'playing',
    maxAttempts: 6,
    wordLength: 5,
  };
}

// Add a letter to current guess
export function addLetter(state: GameState, letter: string): GameState {
  if (state.gameStatus !== 'playing') return state;
  if (state.currentGuess.length >= state.wordLength) return state;

  return {
    ...state,
    currentGuess: state.currentGuess + letter.toUpperCase(),
  };
}

// Remove last letter from current guess
export function removeLetter(state: GameState): GameState {
  if (state.gameStatus !== 'playing') return state;
  if (state.currentGuess.length === 0) return state;

  return {
    ...state,
    currentGuess: state.currentGuess.slice(0, -1),
  };
}

// Submit current guess
export function submitGuess(state: GameState): GameState {
  if (state.gameStatus !== 'playing') return state;
  if (state.currentGuess.length !== state.wordLength) return state;
  if (!isValidWord(state.currentGuess)) return state;

  const newGuesses = [...state.guesses, state.currentGuess];
  const isCorrect = state.currentGuess.toUpperCase() === state.targetWord.toUpperCase();
  const isLastAttempt = newGuesses.length >= state.maxAttempts;

  let newStatus: 'playing' | 'won' | 'lost' = 'playing';
  if (isCorrect) {
    newStatus = 'won';
  } else if (isLastAttempt) {
    newStatus = 'lost';
  }

  return {
    ...state,
    guesses: newGuesses,
    currentGuess: '',
    gameStatus: newStatus,
  };
}

// Get keyboard status for all letters
export function getKeyboardStatus(guesses: string[], target: string): Record<string, LetterStatus> {
  const status: Record<string, LetterStatus> = {};

  for (const guess of guesses) {
    const results = evaluateGuess(guess, target);
    for (const { letter, status: letterStatus } of results) {
      const currentStatus = status[letter];
      // Priority: correct > present > absent
      if (letterStatus === 'correct') {
        status[letter] = 'correct';
      } else if (letterStatus === 'present' && currentStatus !== 'correct') {
        status[letter] = 'present';
      } else if (!currentStatus) {
        status[letter] = letterStatus;
      }
    }
  }

  return status;
}
