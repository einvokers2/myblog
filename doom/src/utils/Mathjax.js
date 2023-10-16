let isMathjaxConfig = false // ⽤于标识是否配置
function injectMathJax() {
    if (!window.MathJax) {
      const script = document.createElement('script')
      script.src =
      "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
      script.async = true
      document.head.appendChild(script);

    }
  }


const initMathjaxConfig = (callback) => {
    injectMathJax()
    if (!window.MathJax) {
        return
    }
    window.MathJax = {
        tex: {
            packages: ['base'],
            inlineMath: [ ['$','$'], ['\\(','\\)'] ],
            displayMath: [
                ['$$', '$$'],
                ['\\[', '\\]']
            ], // 段内公式选择符
        },
        svg: {
            scale: 1,                      // global scaling factor for all expressions
            minScale: .5,                  // smallest scaling factor to use
            mtextInheritFont: false,       // true to make mtext elements use surrounding font
            merrorInheritFont: true,       // true to make merror text use surrounding font
            mathmlSpacing: false,          // true for MathML spacing rules, false for TeX rules
            skipAttributes: {},            // RFDa and other attributes NOT to copy to the output
            exFactor: .5,                  // default size of ex in em units
            displayAlign: 'center',        // default for indentalign when set to 'auto'
            displayIndent: '0',            // default for indentshift when set to 'auto'
            fontCache: 'local',            // or 'global' or 'none'
            localID: null,                 // ID to use for local font cache (for single equation processing)
            internalSpeechTitles: true,    // insert <title> tags with speech content
            titleID: 0                     // initial id number to use for aria-labeledby titles
          },
        options: {
            enableMenu: false,
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code',
                'a'], // 避开某些标签
            ignoreHtmlClass: 'tex2jax_ignore',
            processHtmlClass: 'tex2jax_process',
            
        },
        loader: {
            load: ["input/tex", "output/svg"]
        },


        startup: {
            // 当mathjax加载并初始化完成后的回调
            pageReady: () => {
              callback && callback()
            },
          },

        
    }
    isMathjaxConfig = true // 配置完成，改为true
}
const TypeSet = async function (elementClass) {
    const node = document.getElementsByClassName(elementClass)
    if (!window.MathJax) {
        return
    }
    window.MathJax.startup.promise = window.MathJax.startup.promise
        .then(() => {
            return window.MathJax.typesetPromise([node])
        })
        .catch((err) => console.log('Typeset failed: ' + err.message))
    return window.MathJax.startup.promise
}


export default {
    isMathjaxConfig,
    initMathjaxConfig,
    TypeSet
}