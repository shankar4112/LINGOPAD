import TranslationRepository from './TranslationRepository.js';

class Translation {
  constructor() {
    this.repo = TranslationRepository;
  }

  // Save a new translation
  save(translationData) {
    return this.repo.save(translationData);
  }

  // Get all saved translations
  getAll() {
    return this.repo.getAll();
  }

  // Get translation by ID
  getById(id) {
    return this.repo.getById(id);
  }

  // Delete all translations
  clearAll() {
    return this.repo.clearAll();
  }

  // Delete specific translation
  async deleteById(id) {
    const result = await this.repo.deleteById(id);
    return {
      message: result.message,
      changes: result.deletedCount
    };
  }

  // Get translations by language
  getByLanguage(targetLanguage) {
    return this.repo.getByLanguage(targetLanguage);
  }

  // Search translations
  search(query) {
    return this.repo.search(query);
  }
}

export default Translation;
