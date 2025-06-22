const fs = require("fs");
const path = require("path");

const postsDirectory = path.join(process.cwd(), "src/posts");
const publicPostsDirectory = path.join(process.cwd(), "public/posts");

// public/posts 디렉토리가 없으면 생성
if (!fs.existsSync(publicPostsDirectory)) {
  fs.mkdirSync(publicPostsDirectory, { recursive: true });
}

// posts 디렉토리의 모든 폴더를 순회
const postFolders = fs.readdirSync(postsDirectory).filter((fileName) => {
  const fullPath = path.join(postsDirectory, fileName);
  return fs.statSync(fullPath).isDirectory();
});

postFolders.forEach((postFolder) => {
  const sourceDir = path.join(postsDirectory, postFolder);
  const targetDir = path.join(publicPostsDirectory, postFolder);

  // 대상 디렉토리가 없으면 생성
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 이미지 파일들을 복사
  const files = fs.readdirSync(sourceDir);
  files.forEach((file) => {
    if (file.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);

      // 파일이 존재하지 않거나 소스 파일이 더 최신인 경우에만 복사
      if (
        !fs.existsSync(targetFile) ||
        fs.statSync(sourceFile).mtime > fs.statSync(targetFile).mtime
      ) {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`Copied: ${file} to public/posts/${postFolder}/`);
      }
    }
  });
});

console.log("Image copy process completed!");
