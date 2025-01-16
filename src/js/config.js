
const ip = window.location.hostname;
let _host = `http://${ip}:34001/api/v1.0/`;
// const HOST = `http://192.168.100.160:34001/api/v1.0/`;
// const HOST = `http://pironman-u1-002.local:34001/api/v1.0/`;
// if (ip === 'localhost' || ip === '127.0.0.1') {
//   _host = `http://192.168.4.1:34001/api/v1.0/`;
// }

const HOST = _host;
export { HOST }