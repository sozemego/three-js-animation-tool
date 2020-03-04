let itemName = "animation";

export function persistToLocalStorage(state: any) {
  let str = JSON.stringify(state);
  localStorage.setItem(itemName, str);
}

export function getFromLocalStorage(defaultValue: any): object {
  let str = localStorage.getItem(itemName);
  if (!str) {
    return defaultValue;
  }
  return JSON.parse(str);
}
