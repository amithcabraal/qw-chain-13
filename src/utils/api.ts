const DATAMUSE_API = 'https://api.datamuse.com/words';
const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export interface DictionaryResponse {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
    }[];
  }[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const hasVowels = (word: string): boolean => {
  return /[aeiou]/i.test(word);
};

export const fetchWordData = async (word: string) => {
  if (!word) {
    throw new Error('Word parameter is required');
  }

  const normalizedWord = word.toLowerCase().trim();
  let definitions: string[] = [];
  let synonyms: string[] = [];
  
  try {
    // Get dictionary definition first
    let definitionResponse = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries && !definitionResponse) {
      try {
        definitionResponse = await fetch(`${DICTIONARY_API}/${encodeURIComponent(normalizedWord)}`);
        
        if (definitionResponse.ok) {
          const definitionData: DictionaryResponse[] = await definitionResponse.json();
          
          // Collect all unique definitions across different meanings
          const allDefinitions = new Set<string>();
          definitionData[0]?.meanings.forEach(meaning => {
            meaning.definitions.forEach(def => {
              allDefinitions.add(def.definition);
            });
          });
          
          definitions = Array.from(allDefinitions);
          
          if (definitions.length === 0) {
            definitions = ['Definition not available'];
          }
        } else if (definitionResponse.status === 404) {
          console.log(`No definition found for word: ${normalizedWord}`);
          definitions = ['Definition not available'];
          break;
        } else {
          throw new Error(`Dictionary API returned status: ${definitionResponse.status}`);
        }
      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) {
          console.error('Failed to fetch definition after retries:', error);
          definitions = ['Definition not available'];
        } else {
          await delay(1000 * retryCount);
        }
      }
    }

    // Primary synonym sources with different relationships
    const endpoints = [
      // Direct synonyms (highest quality)
      `${DATAMUSE_API}?rel_syn=${encodeURIComponent(normalizedWord)}&max=15`,
      // Similar meaning words
      `${DATAMUSE_API}?ml=${encodeURIComponent(`similar to ${normalizedWord}`)}&max=10`,
      // Words that appear in similar contexts
      `${DATAMUSE_API}?rel_trg=${encodeURIComponent(normalizedWord)}&max=10`
    ];

    const uniqueSynonyms = new Set<string>();
    
    await Promise.all(endpoints.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) return;
        
        const data: { word: string; score: number; tags?: string[] }[] = await response.json();
        
        data
          .filter(item => {
            // Adjust scoring based on endpoint type
            const minScore = endpoint.includes('rel_syn') ? 1000 : // Higher threshold for direct synonyms
                           endpoint.includes('ml') ? 2000 : // Higher for meaning-like
                           500; // Lower for context-related
            
            return (
              item.score > minScore &&
              // Basic word validation
              /^[a-z]+$/i.test(item.word) && // Only pure alphabetical words
              item.word.length > 2 && // No very short words
              item.word.toLowerCase() !== normalizedWord && // No self-matches
              !item.tags?.includes('prop') && // Filter out proper nouns if tagged
              !item.tags?.includes('n_prop') && // Filter out proper noun tags
              hasVowels(item.word) // Only include words with vowels
            );
          })
          .forEach(item => {
            uniqueSynonyms.add(item.word.toLowerCase());
          });
      } catch (error) {
        console.error(`Failed to fetch from endpoint ${endpoint}:`, error);
      }
    }));

    synonyms = Array.from(uniqueSynonyms);

    if (synonyms.length === 0) {
      throw new Error(`No valid synonyms found for: ${normalizedWord}`);
    }

    console.log(`Found ${synonyms.length} synonyms for ${normalizedWord}:`, synonyms);

    return {
      word: normalizedWord,
      definition: definitions[0], // Keep for backward compatibility
      definitions: definitions,
      synonyms
    };
  } catch (error) {
    console.error('Error in fetchWordData:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to fetch word data: ${error.message}`
        : 'Failed to fetch word data: Unknown error'
    );
  }
};