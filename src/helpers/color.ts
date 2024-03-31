function isHexColor(color: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}

function hexToRgb(hex: string) {
  let r = '0';
  let g = '0';
  let b = '0';

  // 3 digits
  if (hex.length == 4) {
    r = '0x' + hex[1] + hex[1];
    g = '0x' + hex[2] + hex[2];
    b = '0x' + hex[3] + hex[3];

    // 6 digits
  } else if (hex.length == 7) {
    r = '0x' + hex[1] + hex[2];
    g = '0x' + hex[3] + hex[4];
    b = '0x' + hex[5] + hex[6];
  }

  return 'rgb(' + +r + ',' + +g + ',' + +b + ')';
}

export { isHexColor, hexToRgb };
