function isHexColor(color: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}

export { isHexColor };
