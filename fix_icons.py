"""
Script để thay thế các icon bị lỗi (Flatsome icons) bằng Remix Icon
"""

import os
import re

# Thư mục gốc của project
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Các pattern cần thay thế
REPLACEMENTS = [
    # icon-menu -> ri-menu-line
    (r'class="icon-menu"', 'class="ri-menu-line"'),
    (r"class='icon-menu'", "class='ri-menu-line'"),
    
    # icon-angle-left -> ri-arrow-left-s-line
    (r'class="icon-angle-left"', 'class="ri-arrow-left-s-line"'),
    (r"class='icon-angle-left'", "class='ri-arrow-left-s-line'"),
    
    # icon-angle-right -> ri-arrow-right-s-line
    (r'class="icon-angle-right"', 'class="ri-arrow-right-s-line"'),
    (r"class='icon-angle-right'", "class='ri-arrow-right-s-line'"),
    
    # Các icon phổ biến khác có thể bị lỗi
    (r'class="icon-home"', 'class="ri-home-line"'),
    (r'class="icon-phone"', 'class="ri-phone-line"'),
    (r'class="icon-envelope"', 'class="ri-mail-line"'),
    (r'class="icon-user"', 'class="ri-user-line"'),
    (r'class="icon-search"', 'class="ri-search-line"'),
    (r'class="icon-cart"', 'class="ri-shopping-cart-line"'),
    (r'class="icon-close"', 'class="ri-close-line"'),
    (r'class="icon-plus"', 'class="ri-add-line"'),
    (r'class="icon-minus"', 'class="ri-subtract-line"'),
    (r'class="icon-chevron-left"', 'class="ri-arrow-left-s-line"'),
    (r'class="icon-chevron-right"', 'class="ri-arrow-right-s-line"'),
    (r'class="icon-chevron-up"', 'class="ri-arrow-up-s-line"'),
    (r'class="icon-chevron-down"', 'class="ri-arrow-down-s-line"'),
]

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

def replace_icons(content):
    """Thay thế các icon bị lỗi"""
    changes_made = []
    
    for pattern, replacement in REPLACEMENTS:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            icon_name = pattern.split('"')[1] if '"' in pattern else pattern.split("'")[1]
            new_icon = replacement.split('"')[1] if '"' in replacement else replacement.split("'")[1]
            changes_made.append(f"{icon_name} -> {new_icon}")
    
    return content, changes_made

def process_file(filepath):
    """Xử lý một file HTML"""
    print(f"\nĐang xử lý: {os.path.basename(filepath)}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content, changes = replace_icons(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            for change in changes:
                print(f"  ✓ {change}")
            return len(changes)
        else:
            print("  - Không có icon cần thay thế")
            return 0
            
    except Exception as e:
        print(f"  ✗ Lỗi: {e}")
        return 0

def main():
    print("=" * 50)
    print("Thay thế icon bị lỗi bằng Remix Icon")
    print("=" * 50)
    
    html_files = get_html_files()
    print(f"\nTìm thấy {len(html_files)} file HTML")
    
    total_changes = 0
    for filepath in html_files:
        total_changes += process_file(filepath)
    
    print("\n" + "=" * 50)
    print(f"Hoàn thành! Đã thay thế {total_changes} icon")
    print("=" * 50)

if __name__ == '__main__':
    main()
