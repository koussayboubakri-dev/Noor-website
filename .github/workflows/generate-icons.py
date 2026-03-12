from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, path):
    # Background
    img = Image.new('RGBA', (size, size), (8, 16, 12, 255))
    draw = ImageDraw.Draw(img)
    
    # Outer ring
    margin = size * 0.08
    draw.ellipse([margin, margin, size-margin, size-margin], 
                 outline=(201, 169, 108, 180), width=max(2, size//60))
    
    # Inner glow circle
    gm = size * 0.15
    draw.ellipse([gm, gm, size-gm, size-gm],
                 fill=(22, 33, 23, 255), outline=(201, 169, 108, 80), width=1)
    
    # Arabic text "نور" — use a basic approach since we may not have Arabic font
    # Draw a crescent moon shape instead
    cx, cy, r = size//2, size//2, size//3
    # Full circle
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(201, 169, 108, 255))
    # Cut out for crescent
    offset = r * 0.35
    draw.ellipse([cx-r+offset, cy-r-offset*0.3, cx+r+offset, cy+r-offset*0.3], 
                 fill=(22, 33, 23, 255))
    
    # Star
    star_x, star_y = cx + int(r*0.55), cy - int(r*0.55)
    sr = max(3, size//32)
    draw.ellipse([star_x-sr, star_y-sr, star_x+sr, star_y+sr], fill=(201, 169, 108, 220))
    
    img.save(path, 'PNG')
    print(f"Created {path}")

create_icon(192, '/home/claude/noor-pwa/icon-192.png')
create_icon(512, '/home/claude/noor-pwa/icon-512.png')
