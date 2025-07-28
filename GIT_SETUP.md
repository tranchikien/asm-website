# 📚 Hướng dẫn Setup Git cho KIENSTORE

## 🔧 Cài đặt Git

### Windows
1. Tải Git từ: https://git-scm.com/download/win
2. Cài đặt với cấu hình mặc định
3. Mở Git Bash hoặc Command Prompt

### macOS
```bash
# Sử dụng Homebrew
brew install git

# Hoặc tải từ website
# https://git-scm.com/download/mac
```

### Linux
```bash
# Ubuntu/Debian
sudo apt-get install git

# CentOS/RHEL
sudo yum install git
```

## 🚀 Khởi tạo Repository

### 1. Cấu hình Git
```bash
# Cấu hình thông tin cá nhân
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Kiểm tra cấu hình
git config --list
```

### 2. Khởi tạo Repository
```bash
# Trong thư mục project
git init

# Kiểm tra trạng thái
git status
```

### 3. Thêm files vào staging
```bash
# Thêm tất cả files
git add .

# Hoặc thêm từng file
git add index.html
git add css/styles.css
git add js/*.js
```

### 4. Commit đầu tiên
```bash
git commit -m "Initial commit: KIENSTORE game website"
```

## 📤 Push lên GitHub

### 1. Tạo Repository trên GitHub
1. Đăng nhập GitHub
2. Click "New repository"
3. Đặt tên: `kienstore-website`
4. Chọn "Public" hoặc "Private"
5. **KHÔNG** check "Initialize this repository with a README"
6. Click "Create repository"

### 2. Kết nối với GitHub
```bash
# Thêm remote origin
git remote add origin https://github.com/your-username/kienstore-website.git

# Kiểm tra remote
git remote -v
```

### 3. Push code
```bash
# Push lên branch main
git branch -M main
git push -u origin main
```

## 🔄 Workflow hàng ngày

### 1. Kiểm tra thay đổi
```bash
git status
git diff
```

### 2. Thêm thay đổi
```bash
git add .
git commit -m "Mô tả thay đổi"
```

### 3. Push lên GitHub
```bash
git push
```

## 🌿 Quản lý Branches

### Tạo branch mới
```bash
# Tạo và chuyển sang branch mới
git checkout -b feature/new-feature

# Hoặc sử dụng git switch (Git 2.23+)
git switch -c feature/new-feature
```

### Chuyển branch
```bash
git checkout main
git switch main
```

### Merge branch
```bash
# Chuyển về main
git checkout main

# Merge branch
git merge feature/new-feature

# Xóa branch đã merge
git branch -d feature/new-feature
```

## 📋 Git Commands hữu ích

### Xem lịch sử
```bash
# Xem commit history
git log --oneline

# Xem thay đổi của commit
git show <commit-hash>
```

### Undo changes
```bash
# Undo file chưa staged
git checkout -- filename

# Undo file đã staged
git reset HEAD filename

# Undo commit cuối
git reset --soft HEAD~1
```

### Stash (lưu tạm)
```bash
# Lưu thay đổi tạm
git stash

# Xem stash list
git stash list

# Apply stash
git stash pop
```

## 🔐 SSH Key (Optional)

### Tạo SSH Key
```bash
# Tạo SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start ssh-agent
eval "$(ssh-agent -s)"

# Thêm SSH key
ssh-add ~/.ssh/id_ed25519
```

### Thêm SSH Key vào GitHub
1. Copy public key
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Vào GitHub Settings > SSH and GPG keys
3. Click "New SSH key"
4. Paste public key
5. Click "Add SSH key"

### Sử dụng SSH
```bash
# Thay đổi remote URL
git remote set-url origin git@github.com:your-username/kienstore-website.git
```

## 📝 Commit Messages

### Quy tắc đặt tên
```
type(scope): description

Examples:
feat(auth): add user registration
fix(cart): resolve checkout issue
docs(readme): update installation guide
style(css): improve button design
refactor(api): optimize database queries
test(auth): add login tests
```

### Types
- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Cập nhật documentation
- `style`: Thay đổi format (không ảnh hưởng code)
- `refactor`: Refactor code
- `test`: Thêm/sửa tests
- `chore`: Cập nhật build tools, configs

## 🚀 Deployment với Git

### Vercel
1. Push code lên GitHub
2. Đăng ký Vercel
3. Import project từ GitHub
4. Deploy tự động

### Netlify
1. Push code lên GitHub
2. Đăng ký Netlify
3. Import project từ GitHub
4. Deploy tự động

### Heroku
```bash
# Cài đặt Heroku CLI
# Tạo app
heroku create kienstore-app

# Deploy
git push heroku main
```

## 🔍 Troubleshooting

### Lỗi Permission
```bash
# Kiểm tra quyền
ls -la

# Thay đổi quyền
chmod 644 filename
```

### Lỗi Merge Conflict
```bash
# Xem conflicts
git status

# Giải quyết conflicts trong editor
# Sau đó
git add .
git commit -m "Resolve merge conflicts"
```

### Lỗi Push
```bash
# Pull trước khi push
git pull origin main

# Force push (cẩn thận!)
git push --force-with-lease
```

## 📚 Tài liệu tham khảo

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) 