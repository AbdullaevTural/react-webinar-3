/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = {
      ...initState,
      lastCode: initState.list ? initState.list.length : 0,
    };
    this.listeners = []; // Слушатели изменений состояния
    this.existingCodes = initState.list ? initState.list.map(item => item.code) : [];
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    const newCode = this.generateUniqueCode();
    this.setState({
      ...this.state,
      lastCode: newCode,
      list: [
        ...this.state.list,
        { code: newCode, title: "Новая запись", selectionCount: 0 },
      ],
    });
    this.existingCodes.push(newCode);
  };

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter(item => item.code !== code)
    })
  };

  /**
   * Выделение записи по коду
   * @param code
   */
  selectItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.map((item) => {
        if (item.code === code) {
          if (!item.selected) {
            item.selectionCount = item.selectionCount ? item.selectionCount + 1 : 1;
          }
          item.selected = !item.selected;
        } else {
          item.selected = false;
        }
        return item;
      }),
    });
  }
   /**
   * Выделение записи по коду
   * @param code
   */
   pluralizeTimes(count) {
    if (count === 1) {
      return 'раз';
    } else if (count >= 2 && count <= 4) {
      return 'раза';
    } else {
      return 'раз';
    }
  }
    /**
   * Генерация уникального кода
   * @returns {number}
   */
    generateUniqueCode() {
      let newCode = this.state.lastCode + 1;
      while (this.existingCodes.includes(newCode)) {
        newCode++;
      }
      return newCode;
    }
}

export default Store;
