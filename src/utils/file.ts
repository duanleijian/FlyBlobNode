const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const { createReadStream, readdirSync, createWriteStream } = require('fs');
// 判断文件夹存在，不存在则创建
export async function existDir(folderpath: string) {
  // console.log('打印创建目录：', folderpath);
  try {
    const pathArr = folderpath.split('\\');
    let _path = '';
    for (let i = 0; i < pathArr.length; i++) {
      if (pathArr[i]) {
        _path += `${pathArr[i]}/`;
        if (!fs.existsSync(_path)) {
          fs.mkdirSync(_path);
        }
      }
    }
  } catch (e) {}
}

// 判断文件
export function isDirectory(folderPath: string) {
  return fs.existsSync(folderPath);
}

// 删除文件夹夹下的文件
function removeFiles(dir, excludes = []) {
  return new Promise(function (resolve, reject) {
    //先读文件夹
    fs.stat(dir, function (err, stat) {
      if (stat.isDirectory()) {
        fs.readdir(dir, function (err, files) {
          files = files
            .map((file) => path.join(dir, file))
            .filter((path) => {
              const src = path.substr(path.lastIndexOf('/')).replace('/', '');
              return !excludes.includes(src);
            }); // a/b  a/m
          files.map((file) => removeFiles(file, excludes));
        });
      } else {
        fs.unlink(dir, resolve);
      }
    });
  });
}

// 删除文件夹
function removePromise(dir) {
  return new Promise(function (resolve, reject) {
    //先读文件夹
    fs.stat(dir, function (err, stat) {
      if (stat.isDirectory()) {
        fs.readdir(dir, function (err, files) {
          files = files.map((file) => path.join(dir, file));
          files = files.map((file) => removePromise(file));
          Promise.all(files).then(function () {
            fs.rmdir(dir, resolve);
          });
        });
      } else {
        fs.unlink(dir, resolve);
      }
    });
  });
}

// 获取文件列表
export function getDirFiles(targetSrc) {
  const chunkFilesDir = path.resolve(__dirname, targetSrc);
  let list = readdirSync(chunkFilesDir);
  // 给文件排序
  list = list.sort((a: string, b: string) => {
    const path1 = a.split('-')[1];
    const path2 = b.split('-')[1];
    return Number(path1) - Number(path2);
  });
  return list;
}

// 合并文件
async function streamMergeRecursive(
  fileList,
  fileWriteStream,
  sourceFiles,
  fileName,
) {
  if (!fileList.length) {
    console.log('-------- WriteStream 合并完成 --------');
    // 最后关闭可写流，防止内存泄漏
    // 关闭流之前立即写入最后一个额外的数据块(Stream 合并完成)。
    fileWriteStream.end('---Stream 合并完成---');
    // await removeFiles(sourceFiles, [fileName]);
    return;
  }
  const data = fileList.shift();
  const { filePath: chunkFilePath } = data;
  console.log('-------- 开始合并 --------\n', chunkFilePath);
  // 获取当前的可读流
  const currentReadStream = createReadStream(chunkFilePath);
  // 监听currentReadStream的on('data'),将读取到的内容调用fileWriteStream.write方法
  // end:true 读取结束时终止写入流,设置 end 为 false 写入的目标流(fileWriteStream)将会一直处于打开状态，不自动关闭
  currentReadStream.pipe(fileWriteStream, { end: false });
  // 监听可读流的 end 事件，结束之后递归合并下一个文件 或者 手动调用可写流的 end 事件
  currentReadStream.on('end', () => {
    console.log('-------- 结束合并 --------\n', chunkFilePath);
    streamMergeRecursive(fileList, fileWriteStream, sourceFiles, fileName);
  });

  // 监听错误事件，关闭可写流，防止内存泄漏
  currentReadStream.on('error', (error) => {
    console.error('-------- WriteStream 合并失败 --------\n', error);
    fileWriteStream.close();
  });
}

// 获取文件进度
export function getFolderFileTotal(targetSrc, total) {
  const chunkFilesDir = path.resolve(__dirname, targetSrc);
  const list = readdirSync(chunkFilesDir);
  console.log('length', list.length);
  console.log('total', total);
  console.log('====================\n');
  return Number(list.length) / Number(total);
}

// 读取文件夹的文件列表
export function streamMergeMain(sourceFiles, targetFile, fileName) {
  // 获取源文件目录(sourceFiles)下的所有文件
  const chunkFilesDir = path.resolve(__dirname, sourceFiles);
  let list = readdirSync(chunkFilesDir);
  // 给文件排序
  list = list.sort((a: string, b: string) => {
    const path1 = a.split('-')[1];
    const path2 = b.split('-')[1];
    return Number(path1) - Number(path2);
  });
  console.log('list', list);
  const fileList = list.map((name) => ({
    name,
    filePath: path.resolve(chunkFilesDir, name),
  }));

  // 创建一个可写流
  const fileWriteStream = createWriteStream(
    path.resolve(__dirname, targetFile),
  );
  streamMergeRecursive(fileList, fileWriteStream, sourceFiles, fileName);
  // removeDir(sourceFiles);
}
