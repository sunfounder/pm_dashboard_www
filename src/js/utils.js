function isNum(data) {
  return !isNaN(Number(data, 10));
}

function round(number, index) {
  if (isNum(number)) {
    let a = 10 ** index;
    return parseInt(number * a) / a;
  }
  return number;
}

function firstUpperCase(string) {
  if (!string) return;
  string = string[0].toUpperCase() + string.slice(1);
  return string;
}

function formatBytes(bytes, originalUnit = '') {
  if (typeof bytes !== 'number') return '0';
  var units = ['', 'K', 'M', 'G', 'T'];
  var unitIndex = units.indexOf(originalUnit);

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }
  return bytes.toFixed(2) + ' ' + units[unitIndex];
}

function timeFormatting(time) {
  const timeString = time;
  const dateTime = new Date(timeString);
  const formattedTime = dateTime.toISOString().replace("T", " ").replace("Z", "");
  return formattedTime;
}

function celciusToFahrenheit(celcius) {
  return celcius * 9 / 5 + 32;
}


export { isNum, round, firstUpperCase, formatBytes, timeFormatting, celciusToFahrenheit };