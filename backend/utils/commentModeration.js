const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[@]/g, "a")
    .replace(/[0]/g, "o")
    .replace(/[1!]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[5$]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const badWords = [
  "madarchod",
  "maderchod",
  "mc",
  "bhenchod",
  "behenchod",
  "bc",
  "chutiya",
  "chutya",
  "gandu",
  "harami",
  "kutta",
  "kutiya",
  "randi",
  "bastard",
  "asshole",
  "idiot",
  "moron",
  "stupid",
  "loser",
  "fuck",
  "fucking",
  "shit",
  "bitch",
  "slut",
  "whore"
];

const suspiciousPhrases = [
  "nobody wants you here",
  "stop commenting",
  "get lost",
  "go away",
  "shut up",
  "you are useless",
  "you are dumb",
  "you are stupid",
  "you ruin every post",
  "leave this group",
  "nobody likes you",
  "stop posting",
  "you are embarrassing",
  "no one wants you here"
];

const containsExplicitAbuse = (text) => {
  const normalized = normalizeText(text);
  const words = normalized.split(" ");

  for (let word of words) {
    if (badWords.includes(word)) {
      return true;
    }
  }

  for (let word of badWords) {
    if (normalized.includes(word)) {
      return true;
    }
  }

  return false;
};

const getSuspicionScore = (text) => {
  const normalized = normalizeText(text);
  let score = 0;

  for (let phrase of suspiciousPhrases) {
    if (normalized.includes(phrase)) {
      score += 2;
    }
  }

  const softNegativeWords = [
    "hate",
    "useless",
    "stupid",
    "dumb",
    "embarrassing",
    "annoying",
    "worst",
    "leave",
    "stop",
    "nobody"
  ];

  const words = normalized.split(" ");

  for (let word of words) {
    if (softNegativeWords.includes(word)) {
      score += 1;
    }
  }

  return score;
};

const analyzeComment = (text) => {
  if (containsExplicitAbuse(text)) {
    return {
      action: "block_immediately",
      reason: "explicit_abuse_detected",
      suspicionScore: 0
    };
  }

  const suspicionScore = getSuspicionScore(text);

  if (suspicionScore >= 2) {
    return {
      action: "needs_llm",
      reason: "suspicious_toxicity_detected",
      suspicionScore
    };
  }

  return {
    action: "allow",
    reason: "clean_comment",
    suspicionScore
  };
};

module.exports = {
  normalizeText,
  containsExplicitAbuse,
  getSuspicionScore,
  analyzeComment
};