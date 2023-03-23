function getName  (input:string) {
    let text = (input && input.trim()) || '';
    text = text.toUpperCase();
    let myArray = text.split(' ');
    let result = ' ';
    let l = myArray.length;
    if (l > 3) {
        l = 3;
    }
    for (let i = 0; i < l; i++) result = result + myArray[i][0];
    return result;
};

function hexToHSL(hexColor:string) {
    // Convert hex color to RGB
    const r = parseInt(hexColor.substring(1,3), 16) / 255;
    const g = parseInt(hexColor.substring(3,5), 16) / 255;
    const b = parseInt(hexColor.substring(5,7), 16) / 255;
  
    // Find the minimum and maximum values of RGB
    const cmin = Math.min(r,g,b);
    const cmax = Math.max(r,g,b);
    
    // Calculate the hue
    let hue = 0;
    if (cmax === cmin) {
      hue = 0;
    } else if (cmax === r) {
      hue = ((g - b) / (cmax - cmin)) % 6;
    } else if (cmax === g) {
      hue = (b - r) / (cmax - cmin) + 2;
    } else {
      hue = (r - g) / (cmax - cmin) + 4;
    }
    hue = Math.round(hue * 60);
  
    // Calculate the lightness
    const lightness = (cmax + cmin) / 2;
  
    // Calculate the saturation
    let saturation = 0;
    if (cmax !== cmin) {
      saturation = (cmax - lightness) / (1 - Math.abs(2 * lightness - 1));
    }
    saturation = +(saturation * 100).toFixed(1);
  
    // Return the HSL color
    return {
      h: hue,
      s: saturation,
      l: lightness
    };
  }

export {getName, hexToHSL}