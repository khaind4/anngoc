"""
Script để thêm local-search.js vào tất cả file HTML
và cập nhật form tìm kiếm để hoạt động offline
"""

import os
import re

# Thư mục gốc của project
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_html_files():
    """Lấy tất cả file HTML trong project"""
    html_files = []
    
    # File index.html ở root
    index_file = os.path.join(BASE_DIR, 'index.html')
    if os.path.exists(index_file):
        html_files.append(index_file)
    
    # Các file trong thư mục pages
    pages_dir = os.path.join(BASE_DIR, 'pages')
    if os.path.exists(pages_dir):
        for filename in os.listdir(pages_dir):
            if filename.endswith('.html'):
                html_files.append(os.path.join(pages_dir, filename))
    
    return html_files

def add_local_search_script(content, is_pages_folder):
    """Thêm script local-search.js vào file HTML"""
    
    # Xác định đường dẫn script tùy theo vị trí file
    if is_pages_folder:
        script_path = '../assets/js/local-search.js'
    else:
        script_path = './assets/js/local-search.js'
    
    script_tag = f'<script src="{script_path}"></script>'
    
    # Kiểm tra xem script đã được thêm chưa
    if 'local-search.js' in content:
        print("  - Script đã tồn tại, bỏ qua")
        return content
    
    # Thêm script trước thẻ </body>
    if '</body>' in content:
        content = content.replace('</body>', f'{script_tag}\n</body>')
        print("  - Đã thêm local-search.js")
    else:
        print("  - Không tìm thấy thẻ </body>")
    
    return content

def update_search_form(content):
    """Cập nhật form tìm kiếm để không trỏ đến server"""
    
    # Pattern để tìm form tìm kiếm với action trỏ đến server
    old_action_pattern = r'action="https://thangmaytaynam\.com\.vn/"'
    new_action = 'action="#" onsubmit="return false;"'
    
    if re.search(old_action_pattern, content):
        content = re.sub(old_action_pattern, new_action, content)
        print("  - Đã cập nhật form action")
    
    return content

def process_file(filepath):
    """Xử lý một file HTML"""
    print(f"\nĐang xử lý: {filepath}")
    
    is_pages_folder = 'pages' in filepath
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Thêm script local-search.js
        content = add_local_search_script(content, is_pages_folder)
        
        # Cập nhật form tìm kiếm
        content = update_search_form(content)
        
        # Chỉ ghi file nếu có thay đổi
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print("  ✓ Đã lưu thay đổi")
        else:
            print("  - Không có thay đổi")
            
    except Exception as e:
        print(f"  ✗ Lỗi: {e}")

def main():
    print("=" * 50)
    print("Cập nhật tìm kiếm local cho Thang Máy An Ngọc")
    print("=" * 50)
    
    html_files = get_html_files()
    print(f"\nTìm thấy {len(html_files)} file HTML")
    
    for filepath in html_files:
        process_file(filepath)
    
    print("\n" + "=" * 50)
    print("Hoàn thành!")
    print("=" * 50)

if __name__ == '__main__':
    main()
