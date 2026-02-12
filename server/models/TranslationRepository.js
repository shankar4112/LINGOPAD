import Translation from './TranslationModel.js';
import { Op } from 'sequelize';

/**
 * Translation Repository
 * Handles all database operations for translations
 * Provides a consistent API regardless of whether using SQLite or PostgreSQL
 */
class TranslationRepository {
  /**
   * Save a new translation
   * @param {Object} translationData - Translation data to save
   * @returns {Promise<Object>} - Saved translation with ID
   */
  async save(translationData) {
    try {
      const translation = await Translation.create({
        inputText: translationData.inputText,
        translatedText: translationData.translatedText,
        pronunciation: translationData.pronunciation || null,
        sourceLanguage: translationData.sourceLanguage || 'english',
        targetLanguage: translationData.targetLanguage,
        translationMethod: translationData.translationMethod || 'nllb'
      });

      return {
        id: translation.id,
        inputText: translation.inputText,
        translatedText: translation.translatedText,
        pronunciation: translation.pronunciation,
        sourceLanguage: translation.sourceLanguage,
        targetLanguage: translation.targetLanguage,
        translationMethod: translation.translationMethod,
        createdAt: translation.createdAt
      };
    } catch (error) {
      throw new Error(`Failed to save translation: ${error.message}`);
    }
  }

  /**
   * Get all translations, ordered by creation date (newest first)
   * @param {Number} limit - Maximum number of records to return
   * @param {Number} offset - Number of records to skip
   * @returns {Promise<Array>} - Array of translation records
   */
  async getAll(limit = 1000, offset = 0) {
    try {
      const translations = await Translation.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return translations.map(t => this._formatTranslation(t));
    } catch (error) {
      throw new Error(`Failed to retrieve translations: ${error.message}`);
    }
  }

  /**
   * Get translation by ID
   * @param {Number} id - Translation ID
   * @returns {Promise<Object|null>} - Translation record or null if not found
   */
  async getById(id) {
    try {
      const translation = await Translation.findByPk(id);
      return translation ? this._formatTranslation(translation) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve translation: ${error.message}`);
    }
  }

  /**
   * Get translations by target language
   * @param {String} targetLanguage - Target language code
   * @param {Number} limit - Maximum number of records to return
   * @param {Number} offset - Number of records to skip
   * @returns {Promise<Array>} - Array of translation records
   */
  async getByLanguage(targetLanguage, limit = 1000, offset = 0) {
    try {
      const translations = await Translation.findAll({
        where: { targetLanguage },
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return translations.map(t => this._formatTranslation(t));
    } catch (error) {
      throw new Error(`Failed to retrieve translations by language: ${error.message}`);
    }
  }

  /**
   * Search translations by input or translated text
   * @param {String} query - Search query
   * @param {Number} limit - Maximum number of records to return
   * @param {Number} offset - Number of records to skip
   * @returns {Promise<Array>} - Array of matching translation records
   */
  async search(query, limit = 1000, offset = 0) {
    try {
      const searchPattern = `%${query}%`;
      const translations = await Translation.findAll({
        where: {
          [Op.or]: [
            { inputText: { [Op.like]: searchPattern } },
            { translatedText: { [Op.like]: searchPattern } }
          ]
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return translations.map(t => this._formatTranslation(t));
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Delete translation by ID
   * @param {Number} id - Translation ID
   * @returns {Promise<Object>} - Deletion result
   */
  async deleteById(id) {
    try {
      const result = await Translation.destroy({
        where: { id }
      });

      return {
        message: result > 0 ? 'Translation deleted successfully' : 'Translation not found',
        deletedCount: result
      };
    } catch (error) {
      throw new Error(`Failed to delete translation: ${error.message}`);
    }
  }

  /**
   * Clear all translations
   * @returns {Promise<Object>} - Deletion result
   */
  async clearAll() {
    try {
      const result = await Translation.destroy({
        where: {}
      });

      return {
        message: 'All translations cleared successfully',
        deletedCount: result
      };
    } catch (error) {
      throw new Error(`Failed to clear translations: ${error.message}`);
    }
  }

  /**
   * Get count of all translations
   * @returns {Promise<Number>} - Total count
   */
  async count() {
    try {
      return await Translation.count();
    } catch (error) {
      throw new Error(`Failed to count translations: ${error.message}`);
    }
  }

  /**
   * Get statistics about translations
   * @returns {Promise<Object>} - Statistics
   */
  async getStatistics() {
    try {
      const { sequelize } = Translation;
      const totalCount = await Translation.count();
      
      const languageCounts = await Translation.findAll({
        attributes: [
          'targetLanguage',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        raw: true,
        group: ['targetLanguage']
      });

      const methods = await Translation.findAll({
        attributes: [
          'translationMethod',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        raw: true,
        group: ['translationMethod']
      });

      return {
        totalTranslations: totalCount,
        totalLanguages: languageCounts.length,
        languageCounts: languageCounts.reduce((acc, { targetLanguage, count }) => {
          acc[targetLanguage] = parseInt(count);
          return acc;
        }, {}),
        methodCounts: methods.reduce((acc, { translationMethod, count }) => {
          acc[translationMethod || 'unknown'] = parseInt(count);
          return acc;
        }, {})
      };
    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }

  /**
   * Format translation object for API response
   * @private
   * @param {Object} translation - Sequelize translation instance
   * @returns {Object} - Formatted translation object
   */
  _formatTranslation(translation) {
    return {
      id: translation.id,
      inputText: translation.inputText,
      translatedText: translation.translatedText,
      pronunciation: translation.pronunciation,
      sourceLanguage: translation.sourceLanguage,
      targetLanguage: translation.targetLanguage,
      translationMethod: translation.translationMethod,
      createdAt: translation.createdAt
    };
  }
}

export default new TranslationRepository();
