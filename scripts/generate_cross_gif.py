#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to generate the radiant golden cross animated GIF for Logos MultiVerse header.
Creates: data/cross_holy_gold.gif
"""
import os
import math
from PIL import Image, ImageDraw, ImageFilter

W, H = 64, 64
num_frames = 20
frames = []

for i in range(num_frames):
    t = i / num_frames
    scale = 2
    sw, sh = W * scale, H * scale
    img = Image.new('RGBA', (sw, sh), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    
    # 1. Radiant Aura / Halo
    glow_alpha = int(90 + 50 * math.sin(t * 2 * math.pi))
    gd = Image.new('RGBA', (sw, sh), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(gd)
    gdraw.rounded_rectangle([sw*0.42, sh*0.12, sw*0.58, sh*0.88], radius=8, fill=(255, 215, 0, glow_alpha))
    gdraw.rounded_rectangle([sw*0.22, sh*0.32, sw*0.78, sh*0.48], radius=8, fill=(255, 215, 0, glow_alpha))
    gd = gd.filter(ImageFilter.GaussianBlur(radius=6))
    img.paste(gd, (0, 0), gd)
    
    # 2. Outer Gold Bevel
    d.rounded_rectangle([sw*0.43, sh*0.14, sw*0.57, sh*0.86], radius=4, fill=(184, 134, 11, 255))
    d.rounded_rectangle([sw*0.24, sh*0.33, sw*0.76, sh*0.47], radius=4, fill=(184, 134, 11, 255))
    
    # 3. Main Bright Royal Gold Cross
    d.rounded_rectangle([sw*0.445, sh*0.155, sw*0.555, sh*0.845], radius=3, fill=(255, 215, 0, 255))
    d.rounded_rectangle([sw*0.255, sh*0.345, sw*0.745, sh*0.455], radius=3, fill=(255, 215, 0, 255))
    
    # 4. Inner Bright Light Core
    d.rounded_rectangle([sw*0.47, sh*0.18, sw*0.53, sw*0.82], radius=2, fill=(255, 245, 180, 255))
    d.rounded_rectangle([sw*0.28, sh*0.37, sw*0.72, sw*0.43], radius=2, fill=(255, 245, 180, 255))
    
    # 5. Sparkle Star at Intersection (0.5 * sw, 0.4 * sh)
    flare_p = (t + 0.3) % 1.0
    if 0.1 < flare_p < 0.6:
        fl_alpha = math.sin((flare_p - 0.1) / 0.5 * math.pi)
        fl_len = int(14 * fl_alpha)
        cx, cy = sw * 0.5, sh * 0.4
        a_int = int(255 * fl_alpha)
        d.line([(cx - fl_len, cy), (cx + fl_len, cy)], fill=(255, 255, 255, a_int), width=3)
        d.line([(cx, cy - fl_len), (cx, cy + fl_len)], fill=(255, 255, 255, a_int), width=3)
        d.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=(255, 255, 255, a_int))

    # Downscale for smooth anti-aliasing
    final_img = img.resize((W, H), Image.Resampling.LANCZOS)
    
    # Create P-mode image with transparency key
    alpha = final_img.split()[3]
    p_img = final_img.convert('RGB').convert('P', palette=Image.Palette.ADAPTIVE, colors=254)
    p_data = list(p_img.getdata())
    a_data = list(alpha.getdata())
    for idx in range(len(p_data)):
        if a_data[idx] < 64:
            p_data[idx] = 255
    p_img.putdata(p_data)
    frames.append(p_img)

out_dirs = [r'E:\kinhthanh\data', r'E:\KINHTHANH WEB\data']
for d in out_dirs:
    os.makedirs(d, exist_ok=True)
    out_file = os.path.join(d, 'cross_holy_gold.gif')
    frames[0].save(
        out_file,
        save_all=True,
        append_images=frames[1:],
        duration=60,
        loop=0,
        transparency=255,
        disposal=2
    )
    print(f"Saved: {out_file} ({os.path.getsize(out_file)} bytes)")
