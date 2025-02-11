export default class LocalStorageService {
  static getItem(key: string) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Ошибка при получении ключа ${key} из localStorage`, error);
      return null;
    }
  }

  static setItem(key: string, value: unknown) {
    try {
      const item = JSON.stringify(value);
      localStorage.setItem(key, item);
    } catch (error) {
      console.error(`Ошибка при сохранении ключа ${key} в localStorage`, error);
    }
  }

  static removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Ошибка при удалении ключа ${key} в localStorage`, error);
    }
  }
}
