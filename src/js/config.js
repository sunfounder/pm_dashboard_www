
const protocol = window.location.protocol;
const ip = window.location.hostname;
// const ip = '192.168.100.219';
let _host = `${protocol}//${ip}:34001/api/v1.0/`;

const HOST = _host;
export { HOST }