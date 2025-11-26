// src/config/toefl/sim_config.ts

export const sim_config = {
  full: {
    /** 
     * TOEFL PBT default 
     * (You can adjust these numbers any time)
     */
    readingPassages: 5,        // Normally 5 passages
    listeningPrompts: 1,       // You currently only have 1 in DB
    structureQuestions: 40     // Real TOEFL PBT = 40 grammar questions
  },

  /** Optional future modes */
  short: {
    readingPassages: 1,
    listeningPrompts: 1,
    structureQuestions: 10
  },

  mini: {
    readingPassages: 1,
    listeningPrompts: 0,
    structureQuestions: 5
  }
};
