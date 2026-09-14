/* 头图 hover 平滑缩放显示完整图片
 * 把 #page-header 的内联 background-image 转移到一个 <img> 层，
 * 默认用 transform scale 放大成"裁剪填满"的效果，
 * hover 时平滑缩小到 scale(1)，完整显示整张头图。
 * 留白处用同一张图的模糊背景填充，避免出现突兀色块。
 */
(function () {
  function computeScale(header, img) {
    var hw = header.clientWidth, hh = header.clientHeight;
    var nw = img.naturalWidth, nh = img.naturalHeight;
    if (!nw || !nh || !hw || !hh) return;
    // object-fit: contain 下的显示尺寸
    var cw = hh * nw / nh, ch = hh;
    if (cw > hw) {
      cw = hw;
      ch = hw * nh / nw;
    }
    var scale = Math.max(hw / cw, hh / ch);
    header.style.setProperty('--header-bg-scale', scale.toFixed(3));
    header.classList.add('bg-ready');
  }

  function initHeaderBg() {
    var headers = document.querySelectorAll('#page-header');
    for (var i = 0; i < headers.length; i++) {
      (function (header) {
        // 首页全屏大图保持铺满效果，不做展开
        if (header.classList.contains('full_page')) return;
        if (header.querySelector('.header-bg-layer')) return;

        var bg = header.style.backgroundImage;
        if (!bg) return;
        var m = bg.match(/url\(["']?(.*?)["']?\)/);
        if (!m) return;

        header.style.backgroundImage = 'none';
        header.classList.add('has-bg-layer');

        var layer = document.createElement('div');
        layer.className = 'header-bg-layer';

        var blur = document.createElement('div');
        blur.className = 'header-bg-blur';
        blur.style.backgroundImage = bg;
        layer.appendChild(blur);

        var img = document.createElement('img');
        img.className = 'header-bg-img';
        img.alt = '';
        img.draggable = false;
        img.onload = function () { computeScale(header, img); };
        img.src = m[1];
        layer.appendChild(img);

        header.insertBefore(layer, header.firstChild);

        if (img.complete) computeScale(header, img);
      })(headers[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderBg);
  } else {
    initHeaderBg();
  }
})();
