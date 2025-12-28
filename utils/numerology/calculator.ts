/**
 * Letter to number mapping for numerology calculations
 * Based on Pythagorean numerology system
 */
const letterValues: { [key: string]: number } = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

/**
 * Master numbers that should not be reduced
 */
const masterNumbers = [11, 22, 33];

/**
 * Reduce a number to a single digit unless it's a master number
 */
export function reduceToSingleDigit(num: number): number {
  while (num > 9 && !masterNumbers.includes(num)) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

/**
 * Always reduce to single digit, even if it's a master number
 * Used specifically for duration calculations
 */
function alwaysReduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

/**
 * Convert a name to its numerology value
 */
function nameToNumber(name: string): { number: number; raw: number } {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  const sum = cleanName
    .split('')
    .reduce((total, letter) => total + (letterValues[letter] || 0), 0);
  return {
    number: reduceToSingleDigit(sum),
    raw: sum
  };
}

/**
 * Determine if Y is a vowel at a given position
 */
function isYVowel(name: string, index: number): boolean {
  const letters = name.toUpperCase().split('');
  const nextLetter = letters[index + 1];
  // Heuristic: Y is vowel if not followed by a vowel or at end
  return !nextLetter || !'AEIOU'.includes(nextLetter);
}

/**
 * Get vowels from a name, handling Y appropriately
 */
function getVowels(name: string): string {
  return name.toUpperCase().split('').filter((char, i) =>
    'AEIOU'.includes(char) || (char === 'Y' && isYVowel(name, i))
  ).join('');
}

/**
 * Get consonants from a name
 */
function getConsonants(name: string): string {
  const upperName = name.toUpperCase();
  return upperName.split('').filter((char, i) => {
    if ('AEIOU'.includes(char)) return false;
    if (char === 'Y') return !isYVowel(upperName, i);
    return /^[A-Z]$/.test(char);
  }).join('');
}

/**
 * Calculate vowel value (for Soul Urge number)
 */
function vowelValue(name: string): { number: number; raw: number } {
  const vowels = getVowels(name);
  const sum = vowels
    .split('')
    .reduce((total, letter) => total + (letterValues[letter] || 0), 0);
  return {
    number: reduceToSingleDigit(sum),
    raw: sum
  };
}

/**
 * Calculate consonant value (for Personality number)
 */
function consonantValue(name: string): { number: number; raw: number } {
  const consonants = getConsonants(name);
  const sum = consonants
    .split('')
    .reduce((total, letter) => total + (letterValues[letter] || 0), 0);
  return {
    number: reduceToSingleDigit(sum),
    raw: sum
  };
}

/**
 * Detect karmic debt in a sum before reduction
 */
function detectKarmic(sum: number): number | null {
  if ([13, 14, 16, 19].includes(sum)) return sum;
  return null;
}

/**
 * Calculate Life Path Number from date of birth
 * @param dob Date string in format MM/DD/YYYY
 */
export function calculateLifePathNumber(dob: string): { number: number, raw: number, karmicDebts: number[] } {
  const [month, day, year] = dob.split('/').map(Number);

  if (!month || !day || !year) {
    throw new Error('Invalid date format. Use MM/DD/YYYY');
  }

  const karmicDebts: number[] = [];

  // Month
  let monthSum = month;
  let karmic = detectKarmic(monthSum);
  if (karmic) karmicDebts.push(karmic);
  const reducedMonth = reduceToSingleDigit(monthSum);

  // Day
  let daySum = day;
  karmic = detectKarmic(daySum);
  if (karmic) karmicDebts.push(karmic);
  const reducedDay = reduceToSingleDigit(daySum);

  // Year: sum digits first
  let yearSum = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  karmic = detectKarmic(yearSum);
  if (karmic) karmicDebts.push(karmic);
  const reducedYear = reduceToSingleDigit(yearSum);

  // Total after reduced components
  const totalSum = reducedMonth + reducedDay + reducedYear;
  karmic = detectKarmic(totalSum);
  if (karmic) karmicDebts.push(karmic);

  const lifePathNumber = reduceToSingleDigit(totalSum);

  // Unique debts
  return {
    number: lifePathNumber,
    raw: totalSum,
    karmicDebts: [...new Set(karmicDebts)]
  };
}

/**
 * Calculate Expression Number (Destiny Number) from full name
 */
export function calculateExpressionNumber(
  firstName: string,
  middleName: string = '',
  lastName: string
): { number: number; raw: number } {
  const fullName = `${firstName}${middleName}${lastName}`;
  return nameToNumber(fullName);
}

/**
 * Calculate Soul Urge Number (Heart's Desire) from vowels in full name
 */
export function calculateSoulUrgeNumber(
  firstName: string,
  middleName: string = '',
  lastName: string
): { number: number; raw: number } {
  const fullName = `${firstName}${middleName}${lastName}`;
  return vowelValue(fullName);
}

/**
 * Calculate Personality Number from consonants in full name
 */
export function calculatePersonalityNumber(
  firstName: string,
  middleName: string = '',
  lastName: string
): { number: number; raw: number } {
  const fullName = `${firstName}${middleName}${lastName}`;
  return consonantValue(fullName);
}

/**
 * Calculate Birthday Number from day of birth
 */
export function calculateBirthdayNumber(dob: string): { number: number; raw: number } {
  const [, day] = dob.split('/').map(Number);

  if (!day) {
    throw new Error('Invalid date format. Use MM/DD/YYYY');
  }

  return {
    number: reduceToSingleDigit(day),
    raw: day
  };
}

/**
 * Calculate Maturity Number (Life Path + Expression)
 */
export function calculateMaturityNumber(
  lifePathNumber: number,
  expressionNumber: number
): { number: number; raw: number } {
  const sum = lifePathNumber + expressionNumber;
  return {
    number: reduceToSingleDigit(sum),
    raw: sum
  };
}

/**
 * Calculate Personal Year Number
 */
export function calculatePersonalYearNumber(
  birthMonth: number,
  birthDay: number,
  currentYear: number = new Date().getFullYear()
): number {
  const sum = birthMonth + birthDay + currentYear;
  return reduceToSingleDigit(sum);
}

/**
 * Pinnacle Cycle data structure
 */
export interface PinnacleCycle {
  number: number;
  raw: number;
  startAge: number;
  endAge: number;
  duration: number;
}

export interface PinnacleCycles {
  first: PinnacleCycle;
  second: PinnacleCycle;
  third: PinnacleCycle;
  fourth: PinnacleCycle;
}

/**
 * Calculate Pinnacle Cycles
 * There are 4 pinnacles in a lifetime, each representing different periods
 * Master numbers (11, 22, 33) are preserved in pinnacle calculations
 */
export function calculatePinnacleCycles(dob: string): PinnacleCycles {
  const [month, day, year] = dob.split('/').map(Number);

  if (!month || !day || !year) {
    throw new Error('Invalid date format. Use MM/DD/YYYY');
  }

  const lifePath = calculateLifePathNumber(dob);
  const lifePathNumber = lifePath.number;

  // First Pinnacle duration = 36 - Life Path Number
  // ALWAYS reduce master numbers for duration calculation
  const durationLifePath = alwaysReduceToSingleDigit(lifePathNumber);
  const firstDuration = 36 - durationLifePath;

  // Calculate the four pinnacle numbers - preserve master numbers
  // First Pinnacle: Month + Day
  const firstRaw = month + day;
  let firstPinnacle = firstRaw;
  if (!masterNumbers.includes(firstPinnacle)) {
    firstPinnacle = reduceToSingleDigit(firstPinnacle);
  }

  // Second Pinnacle: Day + Year
  const secondRaw = day + year;
  let secondPinnacle = secondRaw;
  if (!masterNumbers.includes(secondPinnacle)) {
    secondPinnacle = reduceToSingleDigit(secondPinnacle);
  }

  // Third Pinnacle: First Pinnacle + Second Pinnacle
  const thirdRaw = firstPinnacle + secondPinnacle;
  let thirdPinnacle = thirdRaw;
  if (!masterNumbers.includes(thirdPinnacle)) {
    thirdPinnacle = reduceToSingleDigit(thirdPinnacle);
  }

  // Fourth Pinnacle: Month + Year
  const fourthRaw = month + year;
  let fourthPinnacle = fourthRaw;
  if (!masterNumbers.includes(fourthPinnacle)) {
    fourthPinnacle = reduceToSingleDigit(fourthPinnacle);
  }

  // Calculate age ranges
  // First Pinnacle: birth to (36 - Life Path) years
  const firstEndAge = firstDuration;

  // Second Pinnacle: 9 years after first
  const secondStartAge = firstEndAge + 1;
  const secondEndAge = secondStartAge + 8; // 9 years total (inclusive)

  // Third Pinnacle: 9 years after second
  const thirdStartAge = secondEndAge + 1;
  const thirdEndAge = thirdStartAge + 8; // 9 years total (inclusive)

  // Fourth Pinnacle: rest of life
  const fourthStartAge = thirdEndAge + 1;

  return {
    first: {
      number: firstPinnacle,
      raw: firstRaw,
      startAge: 0,
      endAge: firstEndAge,
      duration: firstDuration + 1
    },
    second: {
      number: secondPinnacle,
      raw: secondRaw,
      startAge: secondStartAge,
      endAge: secondEndAge,
      duration: 9
    },
    third: {
      number: thirdPinnacle,
      raw: thirdRaw,
      startAge: thirdStartAge,
      endAge: thirdEndAge,
      duration: 9
    },
    fourth: {
      number: fourthPinnacle,
      raw: fourthRaw,
      startAge: fourthStartAge,
      endAge: 999, // Represents "rest of life"
      duration: -1 // Indicates ongoing
    }
  };
}

/**
 * Get current pinnacle based on age
 */
export function getCurrentPinnacle(pinnacleCycles: PinnacleCycles, age: number): {
  cycle: 'first' | 'second' | 'third' | 'fourth';
  pinnacle: PinnacleCycle;
  yearsRemaining: number;
} {
  if (age <= pinnacleCycles.first.endAge) {
    return {
      cycle: 'first',
      pinnacle: pinnacleCycles.first,
      yearsRemaining: pinnacleCycles.first.endAge - age
    };
  } else if (age <= pinnacleCycles.second.endAge) {
    return {
      cycle: 'second',
      pinnacle: pinnacleCycles.second,
      yearsRemaining: pinnacleCycles.second.endAge - age
    };
  } else if (age <= pinnacleCycles.third.endAge) {
    return {
      cycle: 'third',
      pinnacle: pinnacleCycles.third,
      yearsRemaining: pinnacleCycles.third.endAge - age
    };
  } else {
    return {
      cycle: 'fourth',
      pinnacle: pinnacleCycles.fourth,
      yearsRemaining: -1 // Ongoing
    };
  }
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob: string): number {
  const [month, day, year] = dob.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calculate all core numbers for a person
 */
export interface NumerologyCalculation {
  lifePathNumber: number;
  lifePathRaw: number;
  expressionNumber: number;
  expressionRaw: number;
  soulUrgeNumber: number;
  soulUrgeRaw: number;
  personalityNumber: number;
  personalityRaw: number;
  birthdayNumber: number;
  birthdayRaw: number;
  maturityNumber: number;
  maturityRaw: number;
  personalYearNumber: number;
  pinnacleCycles: PinnacleCycles;
  currentAge: number;
  karmicDebts: number[];
}

export function calculateAllNumbers(
  firstName: string,
  middleName: string = '',
  lastName: string,
  dob: string
): NumerologyCalculation {
  const lifePath = calculateLifePathNumber(dob);
  const expression = calculateExpressionNumber(firstName, middleName, lastName);
  const soulUrge = calculateSoulUrgeNumber(firstName, middleName, lastName);
  const personality = calculatePersonalityNumber(firstName, middleName, lastName);
  const birthday = calculateBirthdayNumber(dob);
  const maturity = calculateMaturityNumber(lifePath.number, expression.number);

  const [month, day] = dob.split('/').map(Number);
  const personalYearNumber = calculatePersonalYearNumber(month, day);

  const pinnacleCycles = calculatePinnacleCycles(dob);
  const currentAge = calculateAge(dob);

  return {
    lifePathNumber: lifePath.number,
    lifePathRaw: lifePath.raw,
    expressionNumber: expression.number,
    expressionRaw: expression.raw,
    soulUrgeNumber: soulUrge.number,
    soulUrgeRaw: soulUrge.raw,
    personalityNumber: personality.number,
    personalityRaw: personality.raw,
    birthdayNumber: birthday.number,
    birthdayRaw: birthday.raw,
    maturityNumber: maturity.number,
    maturityRaw: maturity.raw,
    personalYearNumber,
    pinnacleCycles,
    currentAge,
    karmicDebts: lifePath.karmicDebts
  };
}

/**
 * Validate date format
 */
export function isValidDate(dob: string): boolean {
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  if (!dateRegex.test(dob)) {
    return false;
  }

  const [month, day, year] = dob.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Validate name (must have at least first and last name)
 */
export function isValidName(firstName: string, lastName: string): boolean {
  return (
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    /^[a-zA-Z\s\-\'\.]+$/.test(firstName) &&
    /^[a-zA-Z\s\-\'\.]+$/.test(lastName)
  );
}