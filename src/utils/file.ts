const fs = require('fs');
export async function existDir(folderpath) {
  console.log('打印创建目录：');
  console.log(folderpath);
  try {
    const pathArr = folderpath.split('\\');
    console.log(pathArr);
    let _path = '';
    for (let i = 0; i < pathArr.length; i++) {
      if (pathArr[i]) {
        _path += `${pathArr[i]}/`;
        console.log(_path);
        console.log(fs.existsSync(_path));
        if (!fs.existsSync(_path)) {
          fs.mkdirSync(_path);
        }
      }
    }
  } catch (e) {}
}
