// const { exec } = require('child_process');

// 运行 Node 命令并获取返回值的方法
function runNodeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

module.exports = {
  runNodeCommand,
};