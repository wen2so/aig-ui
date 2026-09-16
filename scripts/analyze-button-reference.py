"""拆解用户提供的 WebP，生成逐帧 PNG、按钮放大图与本地逐帧查看器。

用法：python scripts/analyze-button-reference.py <input.webp> [output-directory]
依赖：Pillow。只读取源文件，产物默认写入忽略提交的 artifacts/button-reference。
标注针对 600×338、67 帧的本次参考素材，其他素材仅提取画面和时间。
"""

import argparse
import html
import json
from pathlib import Path

from PIL import Image, ImageDraw


NOTES = [
    "只有背景，按钮尚未建立。",
    "极淡的块面开始预闪；压缩噪点使轮廓不完全清晰。",
    "第一项出现低亮横条；第二项左右块面预闪，文字很淡。",
    "前两项衬底撤去，标题与选项文字开始可读。",
    "第三、四项出现低亮几何片；前两项主要保留文字。",
    "文字进一步显现，块面继续留空。",
    "第一项单独亮起右侧三角；第二项左右梯形同时出现。",
    "第一项完整横条点亮；第二项切换为右侧小三角。",
    "第一项保留实底；第二项三角消失。",
    "第一项左侧斜带留空；第二项出现左半梯形。",
    "第一项斜带继续留空；第二项改为右半梯形，边缘短标更清楚。",
    "第一项新增右侧三角缺口；第二项又切回左半梯形。",
    "第一项斜带与三角缺口并存；第二项形成完整深色横条。",
    "第二项保持完整横条；第三项右半块显现，第四项暂时留空。",
    "第三项切回左半块；第四项左半梯形显现。",
    "第二项整条开始变浅；第三项接近完整，第四项切到右半块。",
    "第一项缺口开始填回；第二项继续变浅，第三项完整。",
    "第一项缺口仍可辨认；第四项已形成完整横条。",
    "前四项进入收束阶段：选中项保留深色，其他项逐渐淡出。",
    "第一项右三角缺口进一步填回；其余横条继续变浅。",
    "第一项保留深浅刻面，第二项浅底仍可见。",
    "非选中衬底继续淡出，文字位置保持稳定。",
    "第一项内部差异减弱；第四项衬底仍在收束。",
    "非选中背景进一步减弱，没有观察到按钮平移或缩放。",
    "第二项已接近透明，第一项仍保持深色衬底。",
    "第二项衬底基本退去；后两项残留少量底色。",
    "后两项继续清除底色；选中框线保持。",
    "界面接近稳定，只保留第一项的深色底。",
    "进入稳定菜单：第一项高亮，其他项保留文字。",
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", nargs="?", type=Path, default=Path("artifacts/button-reference"))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    frames, timing = [], []
    elapsed = 0
    with Image.open(args.source) as animation:
        matched = animation.size == (600, 338) and animation.n_frames == 67
        for index in range(animation.n_frames):
            animation.seek(index)
            animation.load()  # WebP 的 duration 在解码本帧后才可读取。
            duration = animation.info.get("duration", 0)
            frame = animation.convert("RGB").copy()
            frame.save(args.output / f"frame-{index:03d}.png")
            if matched:
                frame.crop((0, 178, 600, 280)).resize((1200, 204)).save(args.output / f"crop-{index:03d}.png")
            note = NOTES[index] if matched and index < len(NOTES) else (
                "菜单保持稳定；背景人物与压缩噪点仍有变化，未见新的按钮状态转换。" if matched else "未添加视觉标注。"
            )
            timing.append(dict(frame=index, start_ms=elapsed, duration_ms=duration, note=note))
            frames.append(frame)
            elapsed += duration
    (args.output / "timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=2), encoding="utf-8")
    for start in range(0, len(frames), 18):
        page = frames[start:start + 18]
        sheet = Image.new("RGB", (1200, ((len(page) + 1) // 2) * 128), "#e9e8e5")
        draw = ImageDraw.Draw(sheet)
        for offset, frame in enumerate(page):
            index = start + offset
            x, y = offset % 2 * 600, offset // 2 * 128
            crop = frame.crop((0, 178, 600, 280)) if matched else frame.resize((600, 102))
            sheet.paste(crop, (x, y + 22))
            draw.text((x + 5, y + 5), f"F{index:03d} | {timing[index]['start_ms']}ms", fill="#202629")
        sheet.save(args.output / f"buttons-{start:03d}.png")
    if matched:
        selected = [2, 6, 7, 9, 11, 12, 15, 17, 24, 28]
        sheet = Image.new("RGB", (1200, len(selected) * 112), "#e9e8e5")
        draw = ImageDraw.Draw(sheet)
        for row, index in enumerate(selected):
            draw.text((8, row * 112 + 4), f"F{index:03d} / {index * 40}ms", fill="#202629")
            strip = frames[index].crop((30, 183, 599, 225)).resize((1138, 84))
            sheet.paste(strip, (30, row * 112 + 24))
        sheet.save(args.output / "keyframes.png")
    data = json.dumps(timing, ensure_ascii=False).replace("</", "<\\/")
    name = html.escape(args.source.name)
    report = """<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Button 逐帧拆解</title>
<style>
body{margin:0;background:#f5f3ef;color:#1c2b34;font:15px/1.7 system-ui,sans-serif}main{max-width:1240px;margin:auto;padding:30px}
h1{font-weight:500}small{color:#5a6871}button,input,select{font:inherit}button,select{padding:7px 15px;border:1px solid #bac4c9;background:white;cursor:pointer}
.controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:20px 0}input{flex:1;min-width:180px}img{display:block;max-width:100%;height:auto}
.stage{display:grid;grid-template-columns:600px 1fr;gap:24px;background:white;padding:20px}#note{font-size:18px}.crop{margin:20px 0;background:white;padding:20px}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:10px;border-bottom:1px solid #d5d8d8}a{color:#285e7e}
@media(max-width:1000px){.stage{grid-template-columns:1fr}main{padding:16px}}
</style><main><small>参考素材 / 逐帧证据</small><h1>块面如何出现、留空与收束</h1>
<p>SOURCE · COUNT 帧 · TOTALms。时间从 F000 起算；标注区分实测画面和实现建议。原图仅作本地分析。</p>
<div class="controls"><button id="back">上一帧</button><button id="play">播放</button><button id="next">下一帧</button>
<label>速度 <select id="speed"><option value="1">原速</option><option value="0.25">1/4 速度</option></select></label>
<input id="position" aria-label="帧位置" type="range" min="0" max="MAX" value="0"><output id="time"></output></div>
<div class="stage"><img id="frame" alt="参考动图的完整画面"><div><small>本帧观察</small><p id="note"></p>
<p>← / → 逐帧；空格播放或暂停。按钮区域放大只增加显示尺寸，不补造细节。</p></div></div>
<div class="crop"><img id="crop" alt="按钮区域两倍放大"></div>
<h2>对照结论</h2><p>参考包含低亮预闪、少量大块的整帧切换、按钮间错峰、非选中衬底淡出和选中项稳定保留。固定文字与细短线贯穿这段过程。后半段仍有人物运动，不能将背景变化误判为按钮闪烁。</p>
<p>40ms 是文件的采样间隔。它证明相邻采样帧的外观变化，不能单凭录像还原游戏引擎的原始关键帧、精确透明度或输入事件。素材未展示 hover 和点击完整流程。</p>
<h2>每帧记录</h2><table><thead><tr><th>帧</th><th>起始时间</th><th>观察</th></tr></thead><tbody id="rows"></tbody></table>
<script>const frames=DATA;let current=0,timer=0;const $=id=>document.getElementById(id);function show(n){current=(n+frames.length)%frames.length;const f=frames[current];$('position').value=current;$('time').textContent=`F${String(current).padStart(3,'0')} · ${f.start_ms}ms + ${f.duration_ms}ms`;$('frame').src=`frame-${String(current).padStart(3,'0')}.png`;$('crop').src=`crop-${String(current).padStart(3,'0')}.png`;$('note').textContent=f.note}function stop(){clearTimeout(timer);timer=0;$('play').textContent='播放'}function tick(){timer=setTimeout(()=>{show(current+1);tick()},frames[current].duration_ms/Number($('speed').value))}function play(){if(timer)stop();else{$('play').textContent='暂停';tick()}}$('play').onclick=play;$('back').onclick=()=>{stop();show(current-1)};$('next').onclick=()=>{stop();show(current+1)};$('position').oninput=e=>{stop();show(Number(e.target.value))};document.onkeydown=e=>{if(e.target.matches('input,select,button'))return;if(e.key==='ArrowRight'){stop();show(current+1)}if(e.key==='ArrowLeft'){stop();show(current-1)}if(e.code==='Space'){e.preventDefault();play()}};for(const f of frames){const row=document.createElement('tr');for(const value of [f.frame,f.start_ms+'ms',f.note]){const cell=document.createElement('td');cell.textContent=value;row.append(cell)}$('rows').append(row)}show(0);</script></main>"""
    report = report.replace("SOURCE", name).replace("COUNT", str(len(frames))).replace("TOTAL", str(elapsed)).replace("MAX", str(len(frames) - 1)).replace("DATA", data)
    if not matched:
        report = report.replace('<div class="crop"><img id="crop" alt="按钮区域两倍放大"></div>', '<img id="crop" hidden>')
    (args.output / "index.html").write_text(report, encoding="utf-8")
    print(json.dumps(dict(frames=len(frames), total_ms=elapsed, output=str(args.output.resolve())), ensure_ascii=False))


if __name__ == "__main__":
    main()
